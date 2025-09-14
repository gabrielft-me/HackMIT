import { NextResponse } from 'next/server';
import { supabaseAdmin, type AiModel } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('ai_models')
    .select('*')
    .returns<AiModel[]>();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ models: data ?? [] });
}
