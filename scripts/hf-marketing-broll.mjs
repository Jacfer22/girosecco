/**
 * Genera B-roll cinematico via Hugging Face FLUX (free tier con HUGGINGFACE_TOKEN).
 * npm run social:hf-broll
 */
import pkg from '@next/env';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderSocialPng, logoDataUrl, fileToDataUrl, ROOT } from '../social/lib/render-social.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { loadEnvConfig } = pkg;
loadEnvConfig(ROOT);

const OUT_RAW = join(ROOT, 'social', 'starter-kit', '05-hf-cinematic', 'raw');
const OUT_FINAL = join(ROOT, 'social', 'starter-kit', '05-hf-cinematic');
const TEMPLATE = join(ROOT, 'social', 'templates', 'post-cinematic.html');

const MODEL = process.env.HF_MARKETING_MODEL ?? 'black-forest-labs/FLUX.1-schnell';

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

async function main() {
  const token = process.env.HUGGINGFACE_TOKEN ?? process.env.HF_TOKEN;
  if (!token) {
    console.error('Manca HUGGINGFACE_TOKEN in .env.local — vedi social/starter-kit/HF-SETUP.md');
    process.exit(1);
  }

  mkdirSync(OUT_RAW, { recursive: true });
  mkdirSync(OUT_FINAL, { recursive: true });
  const logo = logoDataUrl();
  const risultati = [];

  for (const item of PROMPTS) {
    console.log(`\n▶ FLUX: ${item.id}`);
    try {
      const buf = await generaFlux(token, item.prompt);
      const rawPath = join(OUT_RAW, `${item.id}.png`);
      writeFileSync(rawPath, buf);
      const bgData = fileToDataUrl(rawPath, 'image/png');
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

  writeFileSync(join(OUT_FINAL, 'manifest.json'), JSON.stringify({ model: MODEL, risultati }, null, 2));
  const ok = risultati.filter((r) => r.ok).length;
  console.log(`\n✓ ${ok}/${PROMPTS.length} cinematic branded`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
