import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type AiModel = {
  id: string;
  provider: string;
  name: string;
  max_input_tokens?: number | null;
  price_per_1k_input_tokens_usd?: number | null;
  price_per_1k_output_tokens_usd?: number | null;
  latency_ms_p50?: number | null;
  capabilities?: string[] | null;
};
