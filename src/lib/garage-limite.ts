import { SupabaseClient } from '@supabase/supabase-js';

export const PROVIDER_APPROVAZIONE = 'in-attesa-approvazione';
export const PROVIDER_HF = 'huggingface-triposplat';

/** True se l'utente può avviare una generazione automatica (solo la prima moto). */
export async function puoGenerareAutomaticamente(
  admin: SupabaseClient,
  utenteId: string,
  motoIdEsclusa?: string,
): Promise<boolean> {
  let query = admin
    .from('moto')
    .select('id', { count: 'exact', head: true })
    .eq('utente_id', utenteId);

  if (motoIdEsclusa) {
    query = query.neq('id', motoIdEsclusa);
  }

  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return (count ?? 0) === 0;
}

export function richiedeApprovazioneAdmin(provider: string | null | undefined): boolean {
  return provider === PROVIDER_APPROVAZIONE;
}
