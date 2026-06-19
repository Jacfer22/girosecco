import { NextRequest } from 'next/server';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import {
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrlServer,
  verificaConfigMinima,
} from '@/lib/env-server';

export function adminClient(): SupabaseClient {
  const serviceKey = supabaseServiceRoleKey();
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY non disponibile sul server.');
  }
  return createClient(supabaseUrlServer(), serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function clientUtente(token: string): SupabaseClient {
  return createClient(supabaseUrlServer(), supabaseAnonKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function verificaUtente(req: NextRequest): Promise<{
  user: User;
  admin: SupabaseClient;
  usaServiceRole: boolean;
}> {
  verificaConfigMinima();
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

  const serviceKey = supabaseServiceRoleKey();
  const admin = serviceKey
    ? createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : clientUtente(token);

  return { user: data.user, admin, usaServiceRole: !!serviceKey };
}

export function rispostaErroreApi(error: unknown, fallback = 'Errore imprevisto.') {
  const messaggio = error instanceof Error ? error.message : fallback;
  const status = /autenticazione|sessione/i.test(messaggio)
    ? 401
    : /non trovata|non autorizzat/i.test(messaggio)
      ? 403
      : /configurazione server|environment variables|\.env\.local/i.test(messaggio)
        ? 503
        : /gestiti dal server|non consentita|row-level security/i.test(messaggio)
          ? 503
          : 500;
  return { messaggio, status };
}
