export interface LLMProfile {
  id: string;
  source_section: string;
  family: string;
  model: string | null;
  variant: string;
  artifact_type: string
  parameters_b: string;
  created_at: string;
}