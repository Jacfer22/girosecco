import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { scaricaBlob, salvaInGalleria } from '@/lib/condividi-immagine';
import {
  attendiFrameRender,
  canvasSuBianco,
  preparaImmagineVetrina,
} from '@/lib/vetrina-immagine';

export { canvasSuBianco as canvasVetrinaSuBianco } from '@/lib/vetrina-immagine';

export async function catturaESalvaVetrina(
  canvas: HTMLCanvasElement,
  motoId: string,
): Promise<{ ok: boolean; messaggio?: string }> {
  if (canvas.width < 16 || canvas.height < 16) {
    return { ok: false, messaggio: 'Viewer non pronto. Attendi il caricamento della moto.' };
  }

  await attendiFrameRender();
  const dataUrl = canvasSuBianco(canvas);

  let immagine;
  try {
    immagine = await preparaImmagineVetrina(dataUrl, { nomeBase: 'motogarage-vetrina' });
  } catch (e) {
    return {
      ok: false,
      messaggio: e instanceof Error ? e.message : 'Cattura non riuscita.',
    };
  }

  const esitoGalleria = await salvaInGalleria(immagine.file);
  if (esitoGalleria === 'non_supportato') {
    scaricaBlob(immagine.blob, immagine.file.name);
  }

  const supabase = getSupabaseBrowser();
  if (!supabase) {
    URL.revokeObjectURL(immagine.anteprimaUrl);
    return { ok: false, messaggio: 'Sessione non disponibile.' };
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    URL.revokeObjectURL(immagine.anteprimaUrl);
    return { ok: false, messaggio: 'Accedi di nuovo.' };
  }

  const form = new FormData();
  form.append('motoId', motoId);
  form.append('immagine', immagine.file);

  try {
    const risposta = await fetch('/api/garage/vetrina', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    });
    const json = await risposta.json() as { errore?: string };
    if (!risposta.ok) {
      return { ok: false, messaggio: json.errore ?? 'Salvataggio vetrina fallito.' };
    }
    return { ok: true };
  } finally {
    URL.revokeObjectURL(immagine.anteprimaUrl);
  }
}
