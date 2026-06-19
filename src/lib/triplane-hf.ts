import { Client } from '@gradio/client';
import { hfGarageSpace, huggingFaceToken } from '@/lib/env-server';

const TENTATIVI_CONN = 3;
const PAUSA_RITENTO_MS = 10_000;

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

function messaggioErroreHf(errore: unknown, space: string): string {
  const msg = errore instanceof Error ? errore.message : String(errore);
  if (/could not resolve app config/i.test(msg)) {
    if (space.includes('TriplaneGaussian')) {
      return 'TriplaneGaussian su Hugging Face è offline (GPU non disponibili). MotoGarage usa TripoSplat: imposta HF_GARAGE_SPACE=VAST-AI/TripoSplat su Vercel e rifai deploy.';
    }
    return 'Il laboratorio AI su Hugging Face non risponde (spazio spento o in avvio). Attendi 1–2 minuti e riprova.';
  }
  if (/503|502|504|unavailable/i.test(msg)) {
    return 'Il laboratorio AI è temporaneamente sovraccarico. Riprova tra qualche minuto.';
  }
  return msg;
}

async function connettiSpace(space: string, token: string) {
  return Client.connect(space, {
    token: token as `hf_${string}`,
    status_callback: (status) => {
      if (process.env.NODE_ENV === 'development' && status.status !== 'running') {
        console.info(`[HF ${space}]`, status.status, status.detail ?? '');
      }
    },
  });
}

export async function generaSplatDaImmagine(
  imageBytes: Uint8Array,
  mimeType: string,
  onProgress?: (progress: number, messaggio: string) => Promise<void> | void,
): Promise<Uint8Array> {
  const token = huggingFaceToken();
  if (!token) {
    throw new Error('HUGGINGFACE_TOKEN non configurato. Aggiungilo su Vercel e in .env.local.');
  }

  const space = hfGarageSpace();
  await onProgress?.(15, `Connessione a ${space}…`);

  let client: Awaited<ReturnType<typeof Client.connect>> | null = null;
  let ultimoErrore: unknown = null;

  for (let tentativo = 0; tentativo < TENTATIVI_CONN; tentativo += 1) {
    try {
      if (tentativo > 0) {
        await onProgress?.(18, 'Attendo che il laboratorio AI si svegli…');
        await new Promise((resolve) => setTimeout(resolve, PAUSA_RITENTO_MS * tentativo));
      }
      client = await connettiSpace(space, token);
      break;
    } catch (errore) {
      ultimoErrore = errore;
    }
  }

  if (!client) {
    throw new Error(messaggioErroreHf(ultimoErrore, space));
  }

  await onProgress?.(30, 'Generazione Gaussian Splat da foto…');

  const blob = new Blob([Buffer.from(imageBytes)], { type: mimeType || 'image/jpeg' });

  let risultato: Awaited<ReturnType<typeof client.predict>>;
  try {
    if (space.includes('TriplaneGaussian')) {
      risultato = await client.predict('/run_example', [blob]);
    } else {
      risultato = await client.predict('/generate', {
        image: blob,
        seed: 42,
        steps: 20,
        guidance_scale: 3,
        num_gaussians: 131_072,
        output_format: 'ply',
      });
    }
  } catch (errore) {
    throw new Error(messaggioErroreHf(errore, space));
  }

  const dati = risultato?.data;
  if (!Array.isArray(dati) || dati.length < 2) {
    throw new Error('Risposta inattesa dal laboratorio AI.');
  }

  const indicePly = space.includes('TriplaneGaussian') ? 1 : 1;
  const plyUrl = estraiUrlFile(dati[indicePly]);
  if (!plyUrl) {
    throw new Error('Il laboratorio AI non ha restituito un file PLY.');
  }

  await onProgress?.(80, 'Download del modello Gaussian Splat…');

  const risposta = await fetch(plyUrl);
  if (!risposta.ok) {
    throw new Error(`Download PLY fallito (${risposta.status}).`);
  }

  return new Uint8Array(await risposta.arrayBuffer());
}
