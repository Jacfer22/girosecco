import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null | undefined;

// Restituisce un client Supabase condiviso per le operazioni lato browser
// (login, registrazione, sessione). Restituisce null se le variabili
// d'ambiente non sono configurate: in quel caso le pagine di auth
// mostrano un messaggio invece di rompersi.
export function getSupabaseBrowser(): SupabaseClient | null {
  if (client !== undefined) return client;

  if (!url || !key) {
    client = null;
    return client;
  }

  client = createClient(url, key);
  return client;
}
