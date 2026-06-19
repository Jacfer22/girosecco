import { NextRequest } from 'next/server';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import {
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrlServer,
  verificaConfigServer,
} from '@/lib/env-server';

export function adminClient(): SupabaseClient {
  verificaConfigServer();
  return createClient(supabaseUrlServer(), supabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function verificaUtente(req: NextRequest): Promise<{ user: User; admin: SupabaseClient }> {
  verificaConfigServer();
  const url = supabaseUrlServer();
  const anon = supabaseAnonKey();
  const authorization = req.headers.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null;
  if (!token) throw new Error('Autenticazione richiesta.');

  const authClient = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) throw new Error('Sessione non valida.');

  return { user: data.user, admin: adminClient() };
}

export function rispostaErroreApi(error: unknown, fallback = 'Errore imprevisto.') {
  const messaggio = error instanceof Error ? error.message : fallback;
  const status = /autenticazione|sessione/i.test(messaggio)
    ? 401
    : /non trovata|non autorizzat/i.test(messaggio)
      ? 403
      : /configurazione server|environment variables|\.env\.local/i.test(messaggio)
        ? 503
        : 500;
  return { messaggio, status };
}
