import { NextResponse } from 'next/server';
import { statoConfigServer } from '@/lib/env-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stato = statoConfigServer();
  const ok = stato.supabaseUrl && stato.anonKey && stato.serviceRole && stato.huggingFace;
  return NextResponse.json({
    ok,
    ...stato,
    messaggio: ok
      ? 'Server configurato per la generazione gemelli.'
      : 'Mancano variabili su Vercel o in .env.local. Servono: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, HUGGINGFACE_TOKEN.',
  });
}
