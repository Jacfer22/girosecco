import { Client } from '@gradio/client';

const HF_SPACE = 'VAST-AI/TriplaneGaussian';
const CAM_DIST = 1.9;

interface FileRef {
  url?: string;
  path?: string;
  name?: string;
}

function estraiUrlFile(valore: unknown): string | null {
  if (!valore) return null;
  if (typeof valore === 'string') return valore;
  if (typeof valore === 'object') {
    const ref = valore as FileRef;
    return ref.url ?? ref.path ?? null;
  }
  return null;
}

import { huggingFaceToken } from '@/lib/env-server';

export async function generaSplatDaImmagine(
  imageBytes: Uint8Array,
  mimeType: string,
  onProgress?: (progress: number, messaggio: string) => Promise<void> | void,
): Promise<Uint8Array> {
  const token = huggingFaceToken();
  if (!token) {
    throw new Error('HUGGINGFACE_TOKEN non configurato. Aggiungilo su Vercel e in .env.local.');
  }

  await onProgress?.(15, 'Connessione a TriplaneGaussian su Hugging Face…');

  const client = await Client.connect(HF_SPACE, {
    token: token as `hf_${string}`,
  });

  await onProgress?.(30, 'Rimozione sfondo e ricostruzione 3D…');

  const blob = new Blob([Buffer.from(imageBytes)], { type: mimeType || 'image/jpeg' });
  const risultato = await client.predict('/run_example', [blob]);

  const dati = risultato?.data;
  if (!Array.isArray(dati) || dati.length < 2) {
    throw new Error('Risposta inattesa da TriplaneGaussian.');
  }

  const plyUrl = estraiUrlFile(dati[1]);
  if (!plyUrl) {
    throw new Error('TriplaneGaussian non ha restituito un file PLY.');
  }

  await onProgress?.(80, 'Download del modello Gaussian Splat…');

  const risposta = await fetch(plyUrl);
  if (!risposta.ok) {
    throw new Error(`Download PLY fallito (${risposta.status}).`);
  }

  const buffer = await risposta.arrayBuffer();
  return new Uint8Array(buffer);
}
