import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { eseguiGenerazioneGemello } from '@/lib/garage-generate';
import { aggiornaProgressoGarage } from '@/lib/garage-model';
import { PROVIDER_HF } from '@/lib/garage-limite';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

function adminClient() {
  if (!url || !serviceRole) throw new Error('Supabase server non configurato.');
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function verificaAdmin(req: NextRequest): Promise<{ user: User; admin: SupabaseClient }> {
  if (!url || !anon) throw new Error('Supabase non configurato.');
  const authorization = req.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) throw new Error('Autenticazione richiesta.');
  const authClient = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) throw new Error('Sessione non valida.');
  const admin = adminClient();
  const { data: profilo } = await admin.from('profiles').select('is_admin').eq('id', data.user.id).single();
  if (!profilo?.is_admin) throw new Error('Accesso admin richiesto.');
  return { user: data.user, admin };
}

function rispostaErrore(error: unknown) {
  const messaggio = error instanceof Error ? error.message : 'Errore imprevisto.';
  const status = /autenticazione|sessione/i.test(messaggio) ? 401 : /admin/i.test(messaggio) ? 403 : 500;
  return NextResponse.json({ errore: messaggio }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const { admin } = await verificaAdmin(req);
    const body = await req.json() as { motoId?: string };
    const motoId = String(body.motoId ?? '').trim();
    if (!motoId) {
      return NextResponse.json({ errore: 'motoId richiesto.' }, { status: 400 });
    }

    const { data: moto, error } = await admin
      .from('moto')
      .select('id, utente_id, stato, foto_sx_url')
      .eq('id', motoId)
      .single();

    if (error || !moto) {
      return NextResponse.json({ errore: 'Moto non trovata.' }, { status: 404 });
    }
    if (!['in_attesa', 'errore'].includes(moto.stato)) {
      return NextResponse.json({ errore: 'Questa moto non è in coda di generazione.' }, { status: 409 });
    }

    await aggiornaProgressoGarage(admin, motoId, {
      stato: 'elaborazione',
      progress: 2,
      errore: null,
      provider: PROVIDER_HF,
    });

    after(async () => {
      try {
        await eseguiGenerazioneGemello(admin, moto);
      } catch (errore) {
        const messaggio = errore instanceof Error ? errore.message : 'Generazione fallita.';
        await aggiornaProgressoGarage(admin, motoId, {
          stato: 'errore',
          progress: 0,
          errore: messaggio,
        }).catch(() => {});
      }
    });

    return NextResponse.json({ ok: true, stato: 'elaborazione' });
  } catch (error) {
    return rispostaErrore(error);
  }
}
