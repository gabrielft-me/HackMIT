import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { env } from '@/env';
import { supabaseAdmin } from '@/lib/supabase';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = json as any;

    // Store incoming payload in Supabase (JSONB)
    try {
      const { error: insertError } = await supabaseAdmin
        .from('fit_submissions')
        .insert({ payload: data });
      if (insertError) {
        // Do not fail the request if storage fails
      }
    } catch {
      // Swallow unexpected errors from client
    }

    // Fetch available models from Supabase
    const { data: unslothModels, error: unslothError } = await supabaseAdmin
      .from('unsloth_models')
      .select('*');
    if (unslothError) {
      return NextResponse.json({ error: `Failed to load unsloth_models: ${unslothError.message}` }, { status: 500 });
    }

    const system = `You are an expert AI model selection assistant. Given user requirements and a catalog of available models from a table named unsloth_models, pick the TOP 3 models that best fit the user's needs based on it's trainabily with LoRA and effiency.
Return ONLY a minified JSON array with exactly 3 objects. Each object MUST strictly match the row schema from unsloth_models (same field names and types). Do not include any extra fields or explanations.`;

    const userPrompt = `User requirements JSON (from frontend):
${JSON.stringify(data)}

Available models JSON array (from unsloth_models):
${JSON.stringify(unslothModels ?? [])}

Respond with ONLY a minified JSON array of length 3 containing the selected rows in the same JSON shape as unsloth_models.`;

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

    return new Response(content.text, {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
