import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Avviso, Itinerario } from './types';
import { AVVISI_FALLBACK, ITINERARI_FALLBACK } from './fallback';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getClient(): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key);
}

// Se Supabase non è configurato o la query fallisce, il sito usa i dati fallback:
// puoi vedere tutto in locale prima ancora di creare il progetto Supabase.

interface RigaItinerario extends Omit<Itinerario, 'pro_extra'> {
  variante_pro: string | null;
  weekend_pro: string | null;
}

function mappaRiga(riga: RigaItinerario): Itinerario {
  const { variante_pro, weekend_pro, ...resto } = riga;
  return {
    ...resto,
    tracciato: riga.tracciato ?? [],
    pro_extra:
      variante_pro && weekend_pro
        ? { variante: variante_pro, weekend: weekend_pro }
        : null,
  };
}

export async function getItinerari(): Promise<Itinerario[]> {
  const supabase = getClient();
  if (!supabase) return ITINERARI_FALLBACK;

  const { data, error } = await supabase
    .from('itinerari')
    .select('*')
    .order('km', { ascending: true });

  if (error || !data || data.length === 0) return ITINERARI_FALLBACK;
  return (data as RigaItinerario[]).map(mappaRiga);
}

export async function getItinerario(slug: string): Promise<Itinerario | null> {
  const supabase = getClient();
  if (!supabase) {
    const itinerario = ITINERARI_FALLBACK.find((i) => i.slug === slug) ?? null;
    if (!itinerario) return null;
    return {
      ...itinerario,
      avvisi: AVVISI_FALLBACK.filter((a) => a.itinerario_id === itinerario.id),
    };
  }

  const { data, error } = await supabase
    .from('itinerari')
    .select('*, tappe(*), avvisi(*)')
    .eq('slug', slug)
    .order('ordine', { referencedTable: 'tappe', ascending: true })
    .single();

  if (error || !data) {
    const itinerario = ITINERARI_FALLBACK.find((i) => i.slug === slug) ?? null;
    if (!itinerario) return null;
    return {
      ...itinerario,
      avvisi: AVVISI_FALLBACK.filter((a) => a.itinerario_id === itinerario.id),
    };
  }

  const riga = data as RigaItinerario & { avvisi?: (Avviso & { attivo?: boolean })[] };
  const itinerario = mappaRiga(riga);
  itinerario.avvisi = (riga.avvisi ?? []).filter((a) => a.attivo !== false);
  return itinerario;
}

// Restituisce gli id degli itinerari con almeno un avviso attivo,
// utile per mostrare un badge "Aggiornamenti" nelle card della homepage.
export async function getItinerariConAvvisi(): Promise<Set<string>> {
  const supabase = getClient();
  if (!supabase) {
    return new Set(AVVISI_FALLBACK.map((a) => a.itinerario_id));
  }

  const { data, error } = await supabase
    .from('avvisi')
    .select('itinerario_id')
    .eq('attivo', true);

  if (error || !data) return new Set();
  return new Set(data.map((r: { itinerario_id: string }) => r.itinerario_id));
}

export type { Avviso };
