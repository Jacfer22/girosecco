import { SupabaseClient } from '@supabase/supabase-js';

export type FormatoModelloFile = 'ply' | 'splat' | 'ksplat' | 'glb';

export function formatoDaNome(fileName: string): FormatoModelloFile | null {
  const nome = fileName.toLowerCase();
  if (nome.endsWith('.ply')) return 'ply';
  if (nome.endsWith('.splat')) return 'splat';
  if (nome.endsWith('.ksplat')) return 'ksplat';
  if (nome.endsWith('.glb')) return 'glb';
  return null;
}

export function validaPlyGaussian(bytes: Uint8Array): boolean {
  const header = new TextDecoder('ascii').decode(bytes.slice(0, Math.min(bytes.length, 8192)));
  return header.startsWith('ply')
    && header.includes('end_header')
    && header.includes('property float opacity')
    && header.includes('property float scale_0')
    && header.includes('property float rot_0');
}

export async function pubblicaModelloGarage(
  admin: SupabaseClient,
  motoId: string,
  bytes: Uint8Array,
  formato: FormatoModelloFile,
  provider: string,
): Promise<string> {
  if (formato === 'ply' && !validaPlyGaussian(bytes)) {
    throw new Error('Il PLY non sembra un Gaussian Splat compatibile.');
  }

  const path = `${motoId}/modello.${formato}`;
  const contentType = formato === 'glb' ? 'model/gltf-binary' : 'application/octet-stream';
  const { error: uploadError } = await admin.storage
    .from('modelli-3d')
    .upload(path, Buffer.from(bytes), { upsert: true, contentType, cacheControl: '3600' });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = admin.storage.from('modelli-3d').getPublicUrl(path);
  const aggiornamento: Record<string, unknown> = {
    model_url: publicUrl.publicUrl,
    model_format: formato,
    stato: 'pronto',
    progress: 100,
    errore: null,
    provider,
  };
  if (formato === 'glb') aggiornamento.glb_url = publicUrl.publicUrl;

  const { error: updateError } = await admin.from('moto').update(aggiornamento).eq('id', motoId);
  if (updateError) throw new Error(updateError.message);

  return publicUrl.publicUrl;
}

export async function aggiornaProgressoGarage(
  admin: SupabaseClient,
  motoId: string,
  valori: {
    stato?: string;
    progress?: number;
    errore?: string | null;
    provider?: string;
    task_id?: string | null;
  },
) {
  const { error } = await admin.from('moto').update(valori).eq('id', motoId);
  if (error) throw new Error(error.message);
}
