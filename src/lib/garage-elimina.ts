import { SupabaseClient } from '@supabase/supabase-js';

interface MotoDaEliminare {
  id: string;
  utente_id: string;
  foto_sx_url: string | null;
  foto_dx_url: string | null;
  model_format?: string | null;
}

export async function eliminaMotoGarage(
  admin: SupabaseClient,
  moto: MotoDaEliminare,
  utenteId: string,
): Promise<void> {
  if (moto.utente_id !== utenteId) {
    throw new Error('Non autorizzato.');
  }

  const foto = [moto.foto_sx_url, moto.foto_dx_url].filter((p): p is string => !!p);
  if (foto.length > 0) {
    const { error } = await admin.storage.from('foto-moto').remove(foto);
    if (error) throw new Error(`Foto: ${error.message}`);
  }

  const formato = moto.model_format ?? 'ply';
  const candidati = new Set([
    `${moto.id}/modello.${formato}`,
    `${moto.id}/modello.ply`,
    `${moto.id}/modello.splat`,
    `${moto.id}/modello.ksplat`,
    `${moto.id}/modello.glb`,
  ]);
  const { error: modelloError } = await admin.storage.from('modelli-3d').remove([...candidati]);
  // Il modello può non esistere ancora (richiesta in coda o errore).
  if (modelloError && !/not found|object not found/i.test(modelloError.message)) {
    throw new Error(`Modello 3D: ${modelloError.message}`);
  }

  const { error: deleteError } = await admin.from('moto').delete().eq('id', moto.id);
  if (deleteError) throw new Error(deleteError.message);
}
