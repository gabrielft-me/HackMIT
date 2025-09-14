import os, json, re, shutil
from pathlib import Path
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from rich import print, box
from rich.table import Table

# --- Hugging Face hub ---
from huggingface_hub import HfApi, hf_hub_download, list_repo_files, model_info

# --- RAG bits ---
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Choose LLM: OpenAI or Ollama
USE_OPENAI = bool(os.getenv("OPENAI_API_KEY"))
if USE_OPENAI:
    from openai import OpenAI
    oai = OpenAI()
else:
    from langchain_community.llms import Ollama

# ---------------- Config ----------------
DATA_DIR = Path("./hf_cards")
INDEX_DIR = Path("./index_chroma")
DATA_DIR.mkdir(exist_ok=True, parents=True)

# Put your model repo IDs here (Hugging Face model pages)
REPOS = [
    # example given by user (GGUF - inference only; kept so we can explain why it's not ideal to fine-tune)
    "add real fine-tune-ready repos (16-bit / bf16 / safetensors) you care about:"
    # "meta-llama/Llama-3.1-8B",
    # "unsloth/Meta-Llama-3.1-8B-bnb-4bit",   # QLoRA route
    "mistralai/Mistral-7B-v0.3",
    "Qwen/Qwen2.5-7B",
]

# ---------------- Utilities ----------------
def read_json_safe(path: Path) -> Optional[dict]:
    if not path.exists(): 
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8", errors="ignore"))
    except Exception:
        return None

class ModelAttrs(BaseModel):
    repo_id: str
    license: Optional[str] = None
    param_count_b: Optional[float] = Field(None, description="Billions of parameters (if known)")
    num_hidden_layers: Optional[int] = None
    hidden_size: Optional[int] = None
    num_attention_heads: Optional[int] = None
    max_position_embeddings: Optional[int] = None
    weight_types: List[str] = Field(default_factory=list)  # ['safetensors','gguf','fp16','bf16','awq','gptq',...]
    lora_ready_hint: str = ""  # textual heuristics
    reason_not_trainable: Optional[str] = None

def guess_params_from_card(text: str) -> Optional[float]:
    # Try to find "XXB" in the page; very heuristic
    m = re.search(r"(\d{1,3})\s*(?:B|b)\s*(?:params|parameters)?", text)
    if m:
        return float(m.group(1))
    return None

def inspect_repo(repo_id: str) -> ModelAttrs:
    api = HfApi()
    print(f"[bold cyan]Inspecting[/] {repo_id}")
    # Get model card (README) and config.json if present
    card_path = DATA_DIR / f"{repo_id.replace('/','__')}__README.md"
    cfg_path  = DATA_DIR / f"{repo_id.replace('/','__')}__config.json"
    files = list_repo_files(repo_id)
    text_card = ""

    # Download README (model card)
    try:
        info = model_info(repo_id)
        text_card = info.cardData and info.cardData.get("generated_from_trainer") or ""
        # safer: download README directly
        try:
            readme_path = hf_hub_download(repo_id, filename="README.md")
            text_card = Path(readme_path).read_text(encoding="utf-8", errors="ignore")
        except Exception:
            pass
        card_path.write_text(text_card, encoding="utf-8")
    except Exception as e:
        text_card = ""
    
    # Download config.json if exists
    has_config = "config.json" in files
    cfg = None
    if has_config:
        p = hf_hub_download(repo_id, filename="config.json")
        shutil.copy(p, cfg_path)
        cfg = read_json_safe(cfg_path)

    # Detect weight types present
    weight_types = []
    name_join = " ".join(files).lower()
    if any(f.endswith(".safetensors") for f in files): weight_types.append("safetensors")
    if ".gguf" in name_join: weight_types.append("gguf")
    if "fp16" in name_join or "float16" in name_join: weight_types.append("fp16")
    if "bf16" in name_join: weight_types.append("bf16")
    if "awq" in name_join: weight_types.append("awq")
    if "gptq" in name_join: weight_types.append("gptq")
    if "bnb-4bit" in name_join or "4bit" in name_join: weight_types.append("bnb-4bit")

    # Parse config for core dims
    attrs = ModelAttrs(repo_id=repo_id, weight_types=weight_types)
    if cfg:
        attrs.num_hidden_layers = cfg.get("num_hidden_layers") or cfg.get("n_layer")
        attrs.hidden_size = cfg.get("hidden_size") or cfg.get("n_embd")
        attrs.num_attention_heads = cfg.get("num_attention_heads") or cfg.get("n_head")
        attrs.max_position_embeddings = cfg.get("max_position_embeddings") or cfg.get("rope_scaling",{}).get("max_position_embeddings")
        # Some configs include "architectures" etc.
        if not attrs.param_count_b:
            # param count is often absent; keep None, let LLM discuss
            pass

    # License (from model metadata if available)
    try:
        mi = model_info(repo_id)
        attrs.license = getattr(mi, "license", None)
    except Exception:
        pass

    # Heuristics: LoRA-ready means having 16-bit or safetensors (or explicit QLoRA 4-bit)
    if "safetensors" in weight_types or "fp16" in weight_types or "bf16" in weight_types or "bnb-4bit" in weight_types:
        attrs.lora_ready_hint = "Likely fine-tune-ready (16-bit or QLoRA)."
    if "gguf" in weight_types and not any(w in weight_types for w in ["safetensors","fp16","bf16","bnb-4bit"]):
        attrs.reason_not_trainable = "GGUF is inference-oriented (llama.cpp); use 16-bit safetensors or QLoRA weights for LoRA training."

    # Fallback: guess params from text
    if not attrs.param_count_b:
        g = guess_params_from_card(text_card)
        if g: attrs.param_count_b = g

    # Save a plain text for RAG
    (DATA_DIR / f"{repo_id.replace('/','__')}__CARD.txt").write_text(text_card or "", encoding="utf-8")
    return attrs

def lora_param_estimate(layers: Optional[int], hidden: Optional[int], r:int=8, targets:str="q_proj,v_proj") -> Optional[int]:
    """
    Rough LoRA params: sum over adapted matrices of r*(d_out+d_in).
    For LLaMA-style, each proj ~ hidden x hidden; if adapting q & v per layer:
      ~ layers * 2 * r * (hidden + hidden) = 4 * layers * r * hidden
    (Very rough; see Hu et al., 2021)
    """
    if not (layers and hidden):
        return None
    return 4 * layers * r * hidden

def build_rag_index(cards_dir: Path, index_dir: Path):
    if index_dir.exists():
        shutil.rmtree(index_dir)
    docs = []
    for p in cards_dir.glob("*__CARD.txt"):
        if p.stat().st_size > 0:
            docs.append(TextLoader(str(p)).load()[0])
    if not docs:
        return None
    chunks = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150).split_documents(docs)
    emb = HuggingFaceEmbeddings(model_name="BAAI/bge-m3")
    return Chroma.from_documents(chunks, emb, persist_directory=str(index_dir))

def answer_with_llm(context: str, question: str) -> str:
    system_prompt = (
        "You are a helpful AI that writes in English only. "
        "You compare open-source LLMs specifically for LoRA/QLoRA fine-tuning efficiency. "
        "Prefer deterministic facts from configs and model cards over speculation."
        "Format your answer in a string JSON with two atributes: model_name, Size_comparison_percentage,amount of parameters"
    )
    user_msg = (
        "Context (from model cards):\n"
        + context
        + "\n\nTask: " + question
        + "\n\nConstraints: Keep it concise; include a comparison table; "
          "flag any repos that are GGUF-only (inference) vs 16-bit/QLoRA (fine-tuning)."
    )

    if USE_OPENAI:
        resp = oai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role":"system","content":system_prompt},{"role":"user","content":user_msg}],
            temperature=0.2,
        )
        return resp.choices[0].message.content
    else:
        llm = Ollama(model="llama3.2:3b", temperature=0.2)
        return llm.invoke(system_prompt + "\n\n" + user_msg)

def main():
    # 1) Inspect + download cards/configs
    attrs_list: List[ModelAttrs] = []
    for rid in REPOS:
        attrs = inspect_repo(rid)
        attrs_list.append(attrs)

    # 2) Print quick table with core fields + LoRA estimate
    tbl = Table(title="LoRA Readiness Snapshot", box=box.SIMPLE)
    for col in ["Repo","License","Params (B)","Layers","Hidden","Ctx","Weights","LoRA est. params (r=8; q&v)","Note"]:
        tbl.add_column(col, overflow="fold")
    for a in attrs_list:
        est = lora_param_estimate(a.num_hidden_layers, a.hidden_size, r=8) or "-"
        tbl.add_row(
            a.repo_id,
            str(a.license or "-"),
            str(a.param_count_b or "-"),
            str(a.num_hidden_layers or "-"),
            str(a.hidden_size or "-"),
            str(a.max_position_embeddings or "-"),
            ",".join(a.weight_types) or "-",
            str(est),
            a.reason_not_trainable or a.lora_ready_hint or "-"
        )
    print(tbl)

    # 3) Build RAG over model cards
    vs = build_rag_index(DATA_DIR, INDEX_DIR)
    if not vs:
        print("[yellow]No model cards downloaded; RAG step skipped.[/]")
        return

    # 4) Retrieve top chunks and ask
    retriever = vs.as_retriever(search_kwargs={"k":6})
    question = (
        "Compare the listed models for *efficient* LoRA training on a single-GPU workstation. "
        "Prioritize: availability of 16-bit or QLoRA weights, license permissiveness, parameter count, "
        "and any explicit LoRA/QLoRA guidance in the card. "
        "Output: an English table with columns [Model, Fine-tune-ready?, License, Params(B), Layers, Hidden, Context, Notes], "
        "then a short recommendation of top 2 choices and why."
    )
    docs = retriever.get_relevant_documents("Models for LoRA fine-tuning efficiency, flags about GGUF vs safetensors")
    context = "\n\n".join([d.page_content[:2000] for d in docs])

    answer = answer_with_llm(context, question)
    print("\n[bold]RAG Answer (English):[/bold]\n")
    print(answer)

if __name__ == "__main__":
    main()
