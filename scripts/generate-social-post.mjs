/**
 * Genera immagine social 1080×1920 (9:16) brand MotoGarage — export 2× HD.
 * npm run social:post -- --stile logo [--tagline "..."] [--pill "..."]
 * npm run social:post -- --stile story --titolo "..." [--sottotitolo "..."] ...
 */
import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'social', 'out');

const TEMPLATES = {
  story: join(ROOT, 'social', 'templates', 'post-story.html'),
  logo: join(ROOT, 'social', 'templates', 'post-logo-launch.html'),
};

const TIPO_LABEL = {
  feature: 'Funzionalità',
  tip: 'Consiglio moto',
  garage: 'Garage 3D',
  traccia: 'Traccia GPS',
  community: 'Community',
  itinerario: 'Itinerario',
  cta: 'Inizia ora',
  launch: 'Novità',
};

function parseArgs(argv) {
  const out = {
    stile: 'story',
    titolo: '',
    sottotitolo: 'Garage digitale, tracciamento GPS e card per le tue Stories.',
    tagline: 'La casa digitale della tua moto',
    pill: 'Gratis · Provalo ora',
    tipo: 'feature',
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--stile' && argv[i + 1]) out.stile = argv[++i];
    else if (a === '--titolo' && argv[i + 1]) out.titolo = argv[++i];
    else if (a === '--sottotitolo' && argv[i + 1]) out.sottotitolo = argv[++i];
    else if (a === '--tagline' && argv[i + 1]) out.tagline = argv[++i];
    else if (a === '--pill' && argv[i + 1]) out.pill = argv[++i];
    else if (a === '--tipo' && argv[i + 1]) out.tipo = argv[++i];
  }
  if (out.stile === 'story' && !out.titolo) {
    console.error('Uso story: npm run social:post -- --stile story --titolo "..." [--sottotitolo "..."] [--pill "..."] [--tipo feature]');
    console.error('Uso logo:  npm run social:post -- --stile logo [--tagline "..."] [--pill "..."]');
    process.exit(1);
  }
  return out;
}

function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function logoDataUrl() {
  const png = join(ROOT, 'public', 'logo-motogarage.png');
  const svg = join(ROOT, 'public', 'logo-motogarage.svg');
  const path = existsSync(png) ? png : svg;
  if (!existsSync(path)) throw new Error('Logo non trovato in public/');
  const buf = readFileSync(path);
  const mime = path.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

async function main() {
  const args = parseArgs(process.argv);
  const oggi = new Date().toISOString().slice(0, 10);
  const slugBase = args.stile === 'logo' ? 'logo-launch' : slug(args.titolo);
  const fileName = `${oggi}-${slugBase}.png`;
  const outPath = join(OUT_DIR, fileName);

  mkdirSync(OUT_DIR, { recursive: true });

  const logoData = logoDataUrl();
  let html = readFileSync(TEMPLATES[args.stile] ?? TEMPLATES.story, 'utf8');
  html = html
    .replace(/\{\{LOGO_DATA_URL\}\}/g, logoData)
    .replace(/\{\{LOGO_URL\}\}/g, logoData)
    .replace(/\{\{TITOLO\}\}/g, args.titolo)
    .replace(/\{\{SOTTOTITOLO\}\}/g, args.sottotitolo)
    .replace(/\{\{TAGLINE\}\}/g, args.tagline)
    .replace(/\{\{PILL\}\}/g, args.pill)
    .replace(/\{\{TIPO_LABEL\}\}/g, TIPO_LABEL[args.tipo] ?? TIPO_LABEL.feature);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForSelector('img', { state: 'visible' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();

  const meta = {
    data: oggi,
    stile: args.stile,
    tipo: args.tipo,
    titolo: args.stile === 'logo' ? 'Logo launch' : args.titolo,
    file: `social/out/${fileName}`,
  };
  writeFileSync(join(OUT_DIR, `${fileName}.json`), JSON.stringify(meta, null, 2));

  console.log(`✓ Immagine HD (2×): ${outPath}`);
  console.log(`  Stile: ${args.stile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
