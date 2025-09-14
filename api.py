import os, json, re, shutil
from pathlib import Path
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from rich import print, box
from rich.table import Table

from huggingface_hub import HfApi, hf_hub_download, list_repo_files, model_info
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# LLM: usa OpenAI se houver chave; senão, Ollama local

from fastapi import FastAPI, HTTPException, Header, Depends
app = FastAPI(title="LoRA Model Selector API", version="1.0.0")

USE_OPENAI = bool(os.getenv("OPENAI_API_KEY"))
if USE_OPENAI:
    from openai import OpenAI
    oai = OpenAI()
else:
    from langchain_community.llms import Ollama

DATA_DIR = Path("./hf_cards"); DATA_DIR.mkdir(exist_ok=True, parents=True)
INDEX_DIR = Path("./index_chroma")

API_KEY = os.getenv("API_KEY")  # defina se quiser autenticação simples

app = FastAPI(title="LoRA Model Selector API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

def require_api_key(x_api_key: Optional[str] = Header(default=None)):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# ------------------ Types ------------------
class CompareRequest(BaseModel):
    repos: List[str] = Field(..., description="Hugging Face model repo IDs")
    question: Optional[str] = Field(None, description="Custom RAG question in English")

class ModelAttrs(BaseModel):
    repo_id: str
    license: Optional[str] = None
    param_count_b: Optional[float] = None
    num_hidden_layers: Optional[int] = None
    hidden_size: Optional[int] = None
    num_attention_heads: Optional[int] = None
    max_position_embeddings: Optional[int] = None
    weight_types: List[str] = []
    lora_ready_hint: str = ""
    reason_not_trainable: Optional[str] = None

class CompareResponse(BaseModel):
    snapshot: List[ModelAttrs]
    answer: str

# ------------------ Core ------------------
def read_json_safe(p: Path):
    try:
        return json.loads(p.read_text(encoding="utf-8", errors="ignore")) if p.exists() else None
    except Exception:
        return None

def guess_params_from_card(text: str) -> Optional[float]:
    m = re.search(r"(\d{1,3})\s*(?:B|b)\s*(?:params|parameters)?", text)
    return float(m.group(1)) if m else None

def inspect_repo(repo_id: str) -> ModelAttrs:
    print(f"[bold cyan]Inspecting[/] {repo_id}")
    card_path = DATA_DIR / f"{repo_id.replace('/','__')}__README.md"
    cfg_path  = DATA_DIR / f"{repo_id.replace('/','__')}__config.json"
    files, text_card = [], ""

    try:
        files = list_repo_files(repo_id)
        try:
            readme_path = hf_hub_download(repo_id, filename="README.md")
            text_card = Path(readme_path).read_text(encoding="utf-8", errors="ignore")
        except Exception:
            pass
        card_path.write_text(text_card or "", encoding="utf-8")
    except Exception:
        pass

    cfg = None
    if "config.json" in files:
        p = hf_hub_download(repo_id, filename="config.json")
        shutil.copy(p, cfg_path)
        cfg = read_json_safe(cfg_path)

    weight_types = []
    low = " ".join(files).lower()
    if any(f.endswith(".safetensors") for f in files): weight_types.append("safetensors")
    if ".gguf" in low: weight_types.append("gguf")
    if "fp16" in low or "float16" in low: weight_types.append("fp16")
    if "bf16" in low: weight_types.append("bf16")
    if "awq" in low: weight_types.append("awq")
    if "gptq" in low: weight_types.append("gptq")
    if "bnb-4bit" in low or "4bit" in low: weight_types.append("bnb-4bit")

    attrs = ModelAttrs(repo_id=repo_id, weight_types=weight_types)
    if cfg:
        attrs.num_hidden_layers = cfg.get("num_hidden_layers") or cfg.get("n_layer")
        attrs.hidden_size = cfg.get("hidden_size") or cfg.get("n_embd")
        attrs.num_attention_heads = cfg.get("num_attention_heads") or cfg.get("n_head")
        attrs.max_position_embeddings = cfg.get("max_position_embeddings") or cfg.get("rope_scaling",{}).get("max_position_embeddings")

    try:
        mi = model_info(repo_id)
        attrs.license = getattr(mi, "license", None)
    except Exception:
        pass

    if any(w in weight_types for w in ["safetensors","fp16","bf16","bnb-4bit"]):
        attrs.lora_ready_hint = "Likely fine-tune-ready (16-bit or QLoRA)."
    if "gguf" in weight_types and not any(w in weight_types for w in ["safetensors","fp16","bf16","bnb-4bit"]):
        attrs.reason_not_trainable = "GGUF is inference-oriented; use 16-bit safetensors or QLoRA weights for LoRA."

    if not attrs.param_count_b:
        attrs.param_count_b = guess_params_from_card(text_card)

    (DATA_DIR / f"{repo_id.replace('/','__')}__CARD.txt").write_text(text_card or "", encoding="utf-8")
    return attrs

def build_rag(cards_dir: Path, index_dir: Path):
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
        "Compare open-source LLMs for LoRA/QLoRA fine-tuning efficiency using facts from the context."
    )
    user_msg = (
        "Context:\n" + context +
        "\n\nTask: " + question +
        "\nConstraints: English only; include a comparison table; flag GGUF-only repos."
    )
    if USE_OPENAI:
        r = oai.chat.completions.create(
            model="gpt-4o-mini",
            temperature=0.2,
            messages=[{"role":"system","content":system_prompt},{"role":"user","content":user_msg}],
        )
        return r.choices[0].message.content
    else:
        llm = Ollama(model="llama3.2:3b", temperature=0.2)
        return llm.invoke(system_prompt + "\n\n" + user_msg)

# ------------------ Routes ------------------
@app.get("/health")
def health():
    return {"ok": True, "llm": "openai" if USE_OPENAI else "ollama"}

@app.post("/compare", response_model=CompareResponse, dependencies=[Depends(require_api_key)])
def compare(req: CompareRequest):
    # 1) Inspeciona todos os repositórios
    attrs_list = [inspect_repo(r) for r in req.repos]

    # 2) Constrói o índice RAG
    vs = build_rag(DATA_DIR, INDEX_DIR)
    if not vs:
        raise HTTPException(status_code=400, detail="No model cards available for RAG.")
    retriever = vs.as_retriever(search_kwargs={"k": 6})

    # 3) Pergunta (ou padrão)
    question = req.question or (
        "Compare the listed models for efficient LoRA training on a single-GPU workstation. "
        "Prioritize trainable weight types (16-bit / QLoRA), license permissiveness, params, layers, hidden size, and context length. "
        "Output an English table [Model, Fine-tune-ready?, License, Params(B), Layers, Hidden, Context, Notes], then recommend the top 2."
    )
    docs = retriever.get_relevant_documents("Models for LoRA fine-tuning efficiency; GGUF vs safetensors flags")
    context = "\n\n".join(d.page_content[:2000] for d in docs)
    answer = answer_with_llm(context, question)

    return CompareResponse(snapshot=attrs_list, answer=answer)
