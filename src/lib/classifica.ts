import { getSupabaseBrowser } from '@/lib/supabase-browser';

export interface RigaClassifica {
  utente_id: string;
  username: string;
  avatar_url: string | null;
  moto: string | null;
  is_pro: boolean;
  km_totali: number;
  giri_count: number;
}

export async function caricaClassificaKm(limite = 50): Promise<{ righe: RigaClassifica[]; errore?: string }> {
  const supabase = getSupabaseBrowser();
  if (!supabase) return { righe: [], errore: 'Supabase non configurato.' };

  const { data, error } = await supabase.rpc('classifica_km', { limit_n: limite });
  if (error) {
    const hint = /classifica_km|function/i.test(error.message)
      ? 'Classifica temporaneamente non disponibile. Riprova più tardi.'
      : error.message;
    return { righe: [], errore: hint };
  }

  const righe = (data as Array<Record<string, unknown>>).map((riga) => ({
    utente_id: String(riga.utente_id),
    username: String(riga.username),
    avatar_url: (riga.avatar_url as string | null) ?? null,
    moto: (riga.moto as string | null) ?? null,
    is_pro: Boolean(riga.is_pro),
    km_totali: Number(riga.km_totali) || 0,
    giri_count: Number(riga.giri_count) || 0,
  }));

  return { righe };
}
