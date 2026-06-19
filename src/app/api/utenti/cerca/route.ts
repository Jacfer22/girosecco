import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { adminClient } from '@/lib/garage-server-auth';
import { supabaseAnonKey, supabaseUrlServer, verificaConfigMinima } from '@/lib/env-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ProfiloCerca {
  id: string;
  username: string;
  avatar_url: string | null;
  moto: string | null;
  is_pro: boolean;
}

function normalizza(q: string) {
  return q.trim().toLowerCase();
}

async function verificaSessione(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!token) throw new Error('Accedi per cercare utenti.');

  const auth = createClient(supabaseUrlServer(), supabaseAnonKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await auth.auth.getUser(token);
  if (error || !data.user) throw new Error('Sessione non valida.');
  return data.user;
}

async function cercaUsername(admin: ReturnType<typeof adminClient>, q: string): Promise<ProfiloCerca[]> {
  const { data, error } = await admin
    .from('profiles')
    .select('id, username, avatar_url, moto, is_pro')
    .not('username', 'is', null)
    .ilike('username', `%${q}%`)
    .order('username')
    .limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as ProfiloCerca[];
}

async function cercaEmail(admin: ReturnType<typeof adminClient>, email: string): Promise<ProfiloCerca[]> {
  let pagina = 1;
  const perPagina = 200;

  while (pagina <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page: pagina, perPage: perPagina });
    if (error) throw new Error(error.message);

    const utente = data.users.find((u) => u.email?.toLowerCase() === email);
    if (utente) {
      const { data: profilo, error: profiloError } = await admin
        .from('profiles')
        .select('id, username, avatar_url, moto, is_pro')
        .eq('id', utente.id)
        .maybeSingle();
      if (profiloError) throw new Error(profiloError.message);
      if (!profilo?.username) return [];
      return [profilo as ProfiloCerca];
    }

    if (data.users.length < perPagina) break;
    pagina += 1;
  }

  return [];
}

export async function GET(req: NextRequest) {
  try {
    verificaConfigMinima();
    await verificaSessione(req);

    const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
    if (q.length < 2) {
      return NextResponse.json({ risultati: [] });
    }

    const admin = adminClient();
    const query = normalizza(q);
    const risultati = query.includes('@')
      ? await cercaEmail(admin, query)
      : await cercaUsername(admin, query);

    return NextResponse.json({ risultati });
  } catch (error) {
    const messaggio = error instanceof Error ? error.message : 'Ricerca non riuscita.';
    const status = messaggio.includes('Accedi') || messaggio.includes('Sessione') ? 401 : 500;
    return NextResponse.json({ errore: messaggio, risultati: [] }, { status });
  }
}
