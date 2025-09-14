import { z } from 'zod';

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'Missing ANTHROPIC_API_KEY'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'Missing SUPABASE_SERVICE_KEY'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
});
