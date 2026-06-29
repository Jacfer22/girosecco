/**
 * Genera B-roll cinematico via Hugging Face FLUX o Ideogram 4 (--ideogram).
 * npm run social:hf-broll
 * npm run social:hf-broll -- --ideogram
 */
import pkg from '@next/env';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@gradio/client';
import { renderSocialPng, logoDataUrl, fileToDataUrl, ROOT } from '../social/lib/render-social.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { loadEnvConfig } = pkg;
loadEnvConfig(ROOT);

const usaIdeogram = process.argv.includes('--ideogram');
const OUT_RAW = join(ROOT, 'social', 'starter-kit', usaIdeogram ? '06-ideogram-cinematic' : '05-hf-cinematic', 'raw');
const OUT_FINAL = join(ROOT, 'social', 'starter-kit', usaIdeogram ? '06-ideogram-cinematic' : '05-hf-cinematic');
const TEMPLATE = join(ROOT, 'social', 'templates', 'post-cinematic.html');

const MODEL = process.env.HF_MARKETING_MODEL ?? 'black-forest-labs/FLUX.1-schnell';
const IDEOGRAM_SPACE = process.env.HF_IDEOGRAM_SPACE ?? 'ideogram-ai/ideogram4';

const PROMPTS = [
  {
    id: 'strada-notte',
    prompt:
      'cinematic vertical photo motorcycle on empty winding mountain road at blue hour, dark wet asphalt, subtle red tail light bokeh, moody fog, photorealistic, no text, no logo, no people face, 9:16 composition, premium automotive photography',
    titolo: 'Ogni strada è tua',
    sottotitolo: 'Traccia il percorso reale con GPS e card condivisibile.',
    pill: 'Traccia un giro',
  },
  {
    id: 'curve-alpi',
    prompt:
      'aerial cinematic vertical view of serpentine mountain pass road in dolomites at dusk, dark dramatic sky with subtle red horizon glow, empty road, photorealistic, no text, no logo, 9:16, premium travel photography',
    titolo: 'Itinerari che restano',
    sottotitolo: 'Scopri route per regione e condividi i tuoi giri.',
    pill: 'Esplora itinerari',
  },
];

async function generaFlux(token, prompt) {
  const res = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'image/png',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { width: 768, height: 1344 },
    }),
  });

  if (res.status === 503) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Modello in avvio su HF — riprova tra 30s. ${body.error ?? ''}`);
  }
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF ${res.status}: ${err.slice(0, 200)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  return buf;
}

function estraiUrlFile(valore) {
  if (!valore) return null;
  if (typeof valore === 'string') return valore;
  if (typeof valore === 'object') return valore.url ?? valore.path ?? null;
  return null;
}

async function generaIdeogram(token, prompt) {
  const opzioni = {};
  if (token) opzioni.token = token;
  const client = await Client.connect(IDEOGRAM_SPACE, opzioni);
  const risultato = await client.predict('/generate', {
    prompt,
    mode: 'Turbo · 12 steps',
    upsampler: 'Ideogram (remote)',
    width: 768,
    height: 1344,
    seed: 0,
    randomize_seed: true,
  });
  const dati = risultato?.data;
  if (!Array.isArray(dati) || !dati[0]) {
    throw new Error('Risposta inattesa da Ideogram 4.');
  }
  const imgUrl = estraiUrlFile(dati[0]);
  if (!imgUrl) throw new Error('Nessuna immagine restituita.');
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`Download fallito (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const token = process.env.HUGGINGFACE_TOKEN ?? process.env.HF_TOKEN;
  if (!token && !usaIdeogram) {
    console.error('Manca HUGGINGFACE_TOKEN in .env.local — vedi social/starter-kit/HF-SETUP.md');
    process.exit(1);
  }

  mkdirSync(OUT_RAW, { recursive: true });
  mkdirSync(OUT_FINAL, { recursive: true });
  const logo = logoDataUrl();
  const risultati = [];

  for (const item of PROMPTS) {
    console.log(`\n▶ ${usaIdeogram ? 'Ideogram' : 'FLUX'}: ${item.id}`);
    try {
      const buf = usaIdeogram
        ? await generaIdeogram(token, item.prompt)
        : await generaFlux(token, item.prompt);
      const ext = usaIdeogram ? 'webp' : 'png';
      const mime = usaIdeogram ? 'image/webp' : 'image/png';
      const rawPath = join(OUT_RAW, `${item.id}.${ext}`);
      writeFileSync(rawPath, buf);
      const bgData = fileToDataUrl(rawPath, mime);
      const outPath = join(OUT_FINAL, `${item.id}-branded.png`);
      await renderSocialPng({
        templatePath: TEMPLATE,
        vars: {
          BG_DATA_URL: bgData,
          LOGO_DATA_URL: logo,
          TITOLO: item.titolo,
          SOTTOTITOLO: item.sottotitolo,
          PILL: item.pill,
        },
        outPath,
        width: 1080,
        height: 1920,
      });
      console.log(`  ✓ ${outPath}`);
      risultati.push({ id: item.id, file: outPath, ok: true });
    } catch (e) {
      console.warn(`  ⚠ ${item.id}: ${e instanceof Error ? e.message : e}`);
      risultati.push({ id: item.id, ok: false, error: String(e) });
    }
  }

  writeFileSync(
    join(OUT_FINAL, 'manifest.json'),
    JSON.stringify({ model: usaIdeogram ? IDEOGRAM_SPACE : MODEL, risultati }, null, 2),
  );
  const ok = risultati.filter((r) => r.ok).length;
  console.log(`\n✓ ${ok}/${PROMPTS.length} cinematic branded`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
