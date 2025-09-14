import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    ANTHROPIC_API_KEY: z.ZodString;
    SUPABASE_URL: z.ZodString;
    SUPABASE_SERVICE_KEY: z.ZodString;
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        test: "test";
        development: "development";
        production: "production";
    }>>;
}, z.core.$strip>;
export type Env = z.infer<typeof envSchema>;
export declare const env: Env;
export {};
