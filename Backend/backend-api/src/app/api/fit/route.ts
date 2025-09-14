import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/env';

const inputSchema = z.object({
  size_of_company: z.string().min(1),
  ai_service_in_usage: z.string().min(1),
  business_model: z.string().min(1),
  type_of_data_processed: z.string().min(1),
  amount_of_latency: z.string().min(1),
  data_sensitivity: z.string().min(1),
  savings: z.string().min(1),
});

const normalizedSchema = z.object({
  company_size: z.enum(['solo', 'startup', 'smb', 'midmarket', 'enterprise']),
  current_ai_provider: z.enum(['openai', 'anthropic', 'google', 'other']).nullable(),
  business_model: z.enum(['saas', 'marketplace', 'agency', 'consulting', 'consumer_app', 'other']),
  data_types: z.array(z.enum(['pii', 'phi', 'code', 'documents', 'multimedia', 'other'])),
  latency_requirement_ms: z.number().int().nonnegative(),
  data_sensitivity: z.enum(['low', 'medium', 'high', 'regulated']),
  savings_goal_usd_per_month: z.number().nonnegative(),
});

export type Normalized = z.infer<typeof normalizedSchema>;

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = inputSchema.parse(json);

    const system = `You transform free-form company info into a normalized JSON used to compare against model options for cost optimization.`;

    const userPrompt = `Given the following company info, map it to the normalized JSON schema.

Company info (keys are in English):
- size_of_company: ${parsed.size_of_company}
- ai_service_in_usage: ${parsed.ai_service_in_usage}
- business_model: ${parsed.business_model}
- type_of_data_processed: ${parsed.type_of_data_processed}
- amount_of_latency: ${parsed.amount_of_latency}
- data_sensitivity: ${parsed.data_sensitivity}
- savings: ${parsed.savings}

Normalized JSON schema (respond with ONLY minified JSON that conforms):
${normalizedSchema.toString()}`;

    const completion = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 600,
      temperature: 0,
      system,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.content?.[0];
    if (!content || content.type !== 'text') {
      return NextResponse.json({ error: 'Invalid response from Claude' }, { status: 502 });
    }

    let normalized: unknown;
    try {
      normalized = JSON.parse(content.text);
    } catch {
      return NextResponse.json({ error: 'Claude did not return valid JSON' }, { status: 502 });
    }

    const validated = normalizedSchema.parse(normalized);
    return NextResponse.json({ normalized: validated });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
