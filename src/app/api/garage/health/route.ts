import { NextResponse } from 'next/server';
import { hfGarageSpace, statoConfigServer } from '@/lib/env-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stato = statoConfigServer();
  const ok = stato.supabaseUrl && stato.anonKey && stato.huggingFace;
  return NextResponse.json({
    ok,
    ...stato,
    hfSpace: hfGarageSpace(),
    messaggio: ok
      ? stato.serviceRole
        ? 'Server configurato (modalità service_role).'
        : 'Server configurato (modalità utente). Esegui migration_garage_generazione_utente.sql su Supabase se la generazione fallisce.'
      : `Mancano variabili (${stato.ambiente}). Servono almeno NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY e HUGGINGFACE_TOKEN.`,
  });
}
