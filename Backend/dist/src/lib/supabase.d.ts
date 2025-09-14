export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
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
