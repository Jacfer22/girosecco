/**
 * Genera immagini (e reel slideshow) per Instagram via Ideogram 4 su Hugging Face.
 * Solo uso locale da Cursor — non fa parte dell'app MotoGarage.
 *
 * npm run social:ideogram
 * npm run social:ideogram -- --prompt "moto sportiva al tramonto sulle Dolomiti, cinematic, no text"
 * npm run social:ideogram -- --preset all --branded
 * npm run social:ideogram -- --preset strada-notte --quality --video
 */
import pkg from '@next/env';
import ffmpegPath from 'ffmpeg-static';
import { Client } from '@gradio/client';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { renderSocialPng, logoDataUrl, fileToDataUrl, ROOT } from '../social/lib/render-social.mjs';
import { generaIdeogramBrowser, profilePronto } from './lib/ideogram-browser.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { loadEnvConfig } = pkg;
loadEnvConfig(ROOT);

const IDEOGRAM_SPACE = process.env.HF_IDEOGRAM_SPACE ?? 'ideogram-ai/ideogram4';
const OUT_BASE = join(ROOT, 'social', 'ideogram', 'out');
const TEMPLATE = join(ROOT, 'social', 'templates', 'post-cinematic.html');

const TENTATIVI = 3;
const PAUSA_MS = 8_000;

const PRESET = {
  'strada-notte': {
    prompt:
      'cinematic vertical photo motorcycle on empty winding mountain road at blue hour, dark wet asphalt, subtle red tail light bokeh, moody fog, photorealistic, no text, no logo, no people face, 9:16 composition, premium automotive photography',
    titolo: 'Ogni strada è tua',
    sottotitolo: 'Traccia il percorso reale con GPS e card condivisibile.',
    pill: 'Traccia un giro',
  },
  'curve-alpi': {
    prompt:
      'aerial cinematic vertical view of serpentine mountain pass road in dolomites at dusk, dark dramatic sky with subtle red horizon glow, empty road, photorealistic, no text, no logo, 9:16, premium travel photography',
    titolo: 'Itinerari che restano',
    sottotitolo: 'Scopri route per regione e condividi i tuoi giri.',
    pill: 'Esplora itinerari',
  },
  'garage-notte': {
    prompt:
      'cinematic vertical photo dark premium motorcycle garage at night, single sport bike under warm spotlight, concrete floor reflections, moody red accent light, photorealistic, no text, no logo, 9:16, automotive editorial',
    titolo: 'Il tuo garage digitale',
    sottotitolo: 'Parcheggia la moto in 3D e condividi il link.',
    pill: 'Apri il garage',
  },
  'navigatore-strada': {
    prompt:
      'cinematic vertical POV from motorcycle handlebars on coastal road at golden hour, blurred motion on asphalt, Mediterranean sea cliff, photorealistic, no text, no logo, no UI, 9:16, adventure photography',
    titolo: 'Naviga in sicurezza',
    sottotitolo: 'Indicazioni vocali pensate per chi va in moto.',
    pill: 'Prova il navigatore',
  },
  'community-giro': {
    prompt:
      'cinematic vertical photo group of motorcycles parked at scenic mountain viewpoint at sunset, Italian alps, warm light, photorealistic, no text, no logo, no readable faces, 9:16, lifestyle photography',
    titolo: 'Community di motociclisti',
    sottotitolo: 'Condividi giri, invita amici, cresci insieme.',
    pill: 'Unisciti gratis',
  },
};

function help() {
  console.log(`
Ideogram 4 — asset Instagram (solo locale, non nell'app)

Uso:
  npm run social:ideogram -- [opzioni]

Opzioni:
  --prompt "testo"     Prompt singolo (obbligatorio senza --preset)
  --prompt-file path   Legge il prompt da file (utile su Windows)
  --preset <id|all>    Preset marketing MotoGarage (${Object.keys(PRESET).join(', ')})
  --list-presets       Elenco preset con titoli
  --hd                 1152×2048 + Quality (alta definizione 9:16)
  --browser            Usa browser HF con la tua sessione (default)
  --api                Usa API Gradio diretta (può esaurire quota IP)
  --headed             Browser visibile (debug)
  --quality            Default · 20 steps (più lento, più dettaglio)
  --branded            Overlay logo + copy MotoGarage (1080×1920 PNG)
  --turbo              Turbo · 12 steps (default, solo --api)
  --width N            Default browser HD: 1152 · API: 768
  --height N           Default browser HD: 2048 · API: 1344
  --seed N             Seed fisso (default random)
  --video              Slideshow MP4 9:16 dalle immagini branded generate
  --out <cartella>     Output (default social/ideogram/out)
  --titolo "..."       Copy overlay branded (default MotoGarage)
  --sottotitolo "..."  Sottotitolo overlay branded
  --pill "..."         Pill overlay branded

Token HF opzionale in .env.local (solo --api).
Prima volta: npm run social:ideogram:login (sessione browser = stessa quota del sito).
Primo avvio space: attendi 1–2 min se fallisce, riprova.
`);
}

function parseArgs(argv) {
  const args = {
    prompt: null,
    promptFile: null,
    preset: null,
    listPresets: false,
    branded: false,
    quality: false,
    turbo: true,
    width: 768,
    height: 1344,
    seed: 0,
    randomizeSeed: true,
    video: false,
    out: OUT_BASE,
    titolo: null,
    sottotitolo: null,
    pill: null,
    hd: false,
    browser: true,
    api: false,
    headed: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--list-presets') args.listPresets = true;
    else if (a === '--branded') args.branded = true;
    else if (a === '--hd') args.hd = true;
    else if (a === '--browser') {
      args.browser = true;
      args.api = false;
    } else if (a === '--api') {
      args.api = true;
      args.browser = false;
    } else if (a === '--headed') args.headed = true;
    else if (a === '--quality') {
      args.quality = true;
      args.turbo = false;
    } else if (a === '--turbo') {
      args.turbo = true;
      args.quality = false;
    } else if (a === '--video') args.video = true;
    else if (a === '--prompt') args.prompt = argv[++i] ?? '';
    else if (a === '--prompt-file') args.promptFile = argv[++i] ?? '';
    else if (a === '--preset') args.preset = argv[++i] ?? '';
    else if (a === '--width') args.width = Number(argv[++i]);
    else if (a === '--height') args.height = Number(argv[++i]);
    else if (a === '--seed') {
      args.seed = Number(argv[++i]);
      args.randomizeSeed = false;
    }     else if (a === '--out') args.out = join(ROOT, argv[++i] ?? OUT_BASE);
    else if (a === '--titolo') args.titolo = argv[++i] ?? '';
    else if (a === '--sottotitolo') args.sottotitolo = argv[++i] ?? '';
    else if (a === '--pill') args.pill = argv[++i] ?? '';
  }

  return args;
}

function estraiUrlFile(valore) {
  if (!valore) return null;
  if (typeof valore === 'string') return valore;
  if (typeof valore === 'object') return valore.url ?? valore.path ?? null;
  return null;
}

async function connettiIdeogram(token) {
  const opzioni = {};
  if (token) opzioni.token = token;
  let ultimo;
  for (let t = 0; t < TENTATIVI; t += 1) {
    try {
      if (t > 0) {
        console.log(`  ↻ Riprovo connessione (${t + 1}/${TENTATIVI})…`);
        await new Promise((r) => setTimeout(r, PAUSA_MS * t));
      }
      return await Client.connect(IDEOGRAM_SPACE, opzioni);
    } catch (e) {
      ultimo = e;
    }
  }
  throw ultimo ?? new Error('Connessione Ideogram fallita.');
}

async function generaIdeogram(client, prompt, args) {
  const mode = args.quality ? 'Default · 20 steps' : 'Turbo · 12 steps';
  const risultato = await client.predict('/generate', {
    prompt,
    mode,
    upsampler: 'Ideogram (remote)',
    width: args.width,
    height: args.height,
    seed: args.seed,
    randomize_seed: args.randomizeSeed,
  });
  const dati = risultato?.data;
  if (!Array.isArray(dati) || !dati[0]) throw new Error('Risposta inattesa da Ideogram 4.');
  const imgUrl = estraiUrlFile(dati[0]);
  if (!imgUrl) throw new Error('Nessuna immagine restituita.');
  const res = await fetch(imgUrl);
  if (!res.ok) throw new Error(`Download fallito (${res.status}).`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = /\.webp/i.test(imgUrl) ? 'webp' : 'png';
  const mime = ext === 'webp' ? 'image/webp' : 'image/png';
  return { buf, ext, mime, seed: dati[1], caption: dati[2] };
}

async function applicaBrand(rawPath, mime, meta, outDir) {
  const logo = logoDataUrl();
  const bgData = fileToDataUrl(rawPath, mime);
  const outPath = join(outDir, `${meta.id}-branded.png`);
  await renderSocialPng({
    templatePath: TEMPLATE,
    vars: {
      BG_DATA_URL: bgData,
      LOGO_DATA_URL: logo,
      TITOLO: meta.titolo ?? 'MotoGarage',
      SOTTOTITOLO: meta.sottotitolo ?? 'Il garage digitale della tua moto.',
      PILL: meta.pill ?? 'motogarage.info',
    },
    outPath,
    width: 1080,
    height: 1920,
  });
  return outPath;
}

function creaVideoSlideshow(brandedPaths, outDir) {
  if (!ffmpegPath) {
    console.warn('ffmpeg-static non disponibile — salto --video');
    return null;
  }
  const listPath = join(outDir, '_concat.txt');
  const lines = brandedPaths.map((p) => `file '${p.replace(/\\/g, '/')}'\nduration 4`).join('\n');
  writeFileSync(listPath, `${lines}\nfile '${brandedPaths[brandedPaths.length - 1].replace(/\\/g, '/')}'\n`);
  const outMp4 = join(outDir, 'reel-ideogram-slideshow.mp4');
  const r = spawnSync(
    ffmpegPath,
    ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30', outMp4],
    { stdio: 'inherit' },
  );
  if (r.status !== 0) throw new Error('ffmpeg slideshow fallito.');
  return outMp4;
}

function risolviModalita(args) {
  if (args.hd) {
    args.width = 1152;
    args.height = 2048;
    args.quality = true;
    args.turbo = false;
  } else if (args.browser && args.width === 768 && args.height === 1344) {
    args.width = 1152;
    args.height = 2048;
  }
  if (args.api && args.width === 1152 && args.height === 2048 && !args.hd) {
    args.width = 768;
    args.height = 1344;
  }
}

function modeBrowser(args) {
  if (args.quality) return 'quality';
  if (!args.turbo) return 'default';
  return 'turbo';
}
function messaggioErrore(e) {
  const raw =
    e instanceof Error
      ? e.message
      : typeof e === 'object' && e !== null
        ? JSON.stringify(e)
        : String(e);
  if (/ZeroGPU quota exceeded/i.test(raw)) {
    const wait = raw.match(/Try again in ([^"]+)/i)?.[1]?.trim();
    return `Quota ZeroGPU IP esaurita con --api. Usa --browser (default) dopo npm run social:ideogram:login. ${wait ? `Oppure riprova tra ${wait}.` : ''}`;
  }
  if (/Profilo browser HF assente/i.test(raw)) {
    return raw;
  }
  return raw;
}

function jobsDaArgs(args) {
  if (args.promptFile) {
    const path = join(ROOT, args.promptFile);
    if (!existsSync(path)) throw new Error(`File prompt non trovato: ${path}`);
    args.prompt = readFileSync(path, 'utf8').trim();
    args.promptId = basename(path, extname(path));
  }
  if (args.prompt?.trim()) {
    const slug = (args.promptId ?? args.prompt.slice(0, 40).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')) || 'custom';
    return [{
      id: slug,
      prompt: args.prompt.trim(),
      titolo: args.titolo ?? undefined,
      sottotitolo: args.sottotitolo ?? undefined,
      pill: args.pill ?? undefined,
    }];
  }
  if (args.preset === 'all') {
    return Object.entries(PRESET).map(([id, p]) => ({ id, ...p }));
  }
  if (args.preset && PRESET[args.preset]) {
    return [{ id: args.preset, ...PRESET[args.preset] }];
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    help();
    return;
  }
  if (args.listPresets) {
    for (const [id, p] of Object.entries(PRESET)) {
      console.log(`${id}\n  ${p.titolo}\n  ${p.prompt.slice(0, 90)}…\n`);
    }
    return;
  }

  const jobs = jobsDaArgs(args);
  if (!jobs?.length) {
    help();
    console.error('\nSpecifica --prompt "…" oppure --preset <id|all>');
    process.exit(1);
  }

  risolviModalita(args);

  const token = process.env.HUGGINGFACE_TOKEN ?? process.env.HF_TOKEN ?? '';
  const rawDir = join(args.out, 'raw');
  const brandedDir = join(args.out, 'branded');
  mkdirSync(rawDir, { recursive: true });
  if (args.branded) mkdirSync(brandedDir, { recursive: true });

  const via = args.api ? 'API Gradio' : 'browser HF';
  console.log(`▶ Ideogram 4 (${via}) ${args.width}×${args.height} — ${jobs.length} job\n`);

  if (args.browser && !profilePronto(ROOT)) {
    console.error('Profilo browser assente. Esegui una volta:\n  npm run social:ideogram:login\n');
    process.exit(1);
  }

  let client = null;
  if (args.api) {
    if (!token) console.log('ℹ HUGGINGFACE_TOKEN assente — quota IP molto bassa con --api.\n');
    client = await connettiIdeogram(token);
  }

  const risultati = [];
  const brandedPaths = [];

  for (const job of jobs) {
    console.log(`▶ ${job.id}`);
    try {
      let buf;
      let ext;
      let mime;
      let seed;
      let caption;

      if (args.browser) {
        const out = await generaIdeogramBrowser({
          root: ROOT,
          prompt: job.prompt,
          width: args.width,
          height: args.height,
          mode: modeBrowser(args),
          headless: !args.headed,
          log: console.log,
        });
        ({ buf, ext, mime } = out);
      } else {
        const out = await generaIdeogram(client, job.prompt, args);
        ({ buf, ext, mime, seed, caption } = out);
      }

      const rawPath = join(rawDir, `${job.id}.${ext}`);
      writeFileSync(rawPath, buf);
      console.log(`  ✓ raw ${args.width}×${args.height} → ${rawPath}${seed != null ? ` (seed ${seed})` : ''}`);

      let brandedPath = null;
      if (args.branded) {
        brandedPath = await applicaBrand(rawPath, mime, job, brandedDir);
        brandedPaths.push(brandedPath);
        console.log(`  ✓ branded 1080×1920 → ${brandedPath}`);
      }

      risultati.push({ id: job.id, ok: true, raw: rawPath, branded: brandedPath, seed, caption });
    } catch (e) {
      const msg = messaggioErrore(e);
      console.warn(`  ⚠ ${job.id}: ${msg}`);
      risultati.push({ id: job.id, ok: false, error: msg });
    }
  }

  let videoPath = null;
  if (args.video && brandedPaths.length > 0) {
    console.log('\n▶ Slideshow reel…');
    videoPath = creaVideoSlideshow(brandedPaths, args.out);
    if (videoPath) console.log(`  ✓ ${videoPath}`);
  }

  writeFileSync(
    join(args.out, 'manifest.json'),
    JSON.stringify({ via, space: IDEOGRAM_SPACE, args: { branded: args.branded, width: args.width, height: args.height, hd: args.hd }, risultati, video: videoPath }, null, 2),
  );

  const ok = risultati.filter((r) => r.ok).length;
  console.log(`\n✓ ${ok}/${jobs.length} completati → ${args.out}`);
  if (ok === 0) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
