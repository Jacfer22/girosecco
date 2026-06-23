/**
 * Rosso (Panigale ref utente) — JPG + MP4 pronti Instagram.
 * npm run social:mascot
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fillTemplate, fileToDataUrl } from '../social/lib/render-social.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'social', 'mascot', 'out');
const IG = join(OUT, 'instagram');
const TEMPLATE = join(ROOT, 'social', 'templates', 'mascot-rosso-ref.html');
const REF_IMG = join(ROOT, 'social', 'mascot', 'rosso-panigale-ref.png');

const SCENES = [
  {
    file: '01-ciao-sono-rosso',
    badge: 'Rosso presenta',
    speech:
      'Ciao! Sono <strong>Rosso</strong> 🏍️ La Panigale di MotoGarage. Ti presento la mia <em>app preferita</em> — quella che uso ogni volta che esco in strada!',
    anim: 'bounce 2s ease-in-out infinite',
    appMock: `<div class="app-mock"><h3>MotoGarage</h3><p>Il garage digitale della tua moto. Benvenuto!</p><span class="chip">Entra gratis</span></div>`,
  },
  {
    file: '02-traccia-gps',
    badge: 'Traccia GPS',
    speech:
      'Con <strong>Traccia</strong> accendi il GPS e registri ogni curva. Alla fine ti creo la card 9:16 — perfetta per le Stories. È la mia funzione preferita!',
    anim: 'vroom 1.4s ease-in-out infinite',
    appMock: `<div class="app-mock"><h3>Traccia giro</h3><div class="app-map"></div><p>GPS live · km · durata</p><span class="chip">Inizia percorso</span></div>`,
  },
  {
    file: '03-garage-3d',
    badge: 'Garage 3D',
    speech:
      'Nel <strong>Garage</strong> crei l\'avatar 3D della moto. Io ci sono dentro — e tu puoi ruotarmi, mostrarmi agli amici. Che figata!',
    anim: 'ride 2.2s ease-in-out infinite',
    appMock: `<div class="app-mock"><h3>Il mio Garage</h3><p>Modello 3D · scheda moto · condividi</p><span class="chip">Crea avatar</span></div>`,
  },
  {
    file: '04-naviga-card',
    badge: 'Naviga & Card',
    speech:
      '<strong>Naviga</strong> verso la destinazione, poi condividi la card del giro su Instagram, TikTok o WhatsApp. Un tap e sei online!',
    anim: 'vroom 1.6s ease-in-out infinite',
    appMock: `<div class="app-mock"><h3>Card del giro</h3><p>Foto · percorso · km · data</p><span class="chip">Condividi</span></div>`,
  },
  {
    file: '05-community-cta',
    badge: 'Community',
    speech:
      'C\'è anche la <strong>community</strong>: classifica km, profili, itinerari. Registrati gratis — link in bio. <em>Vieni con me!</em> 🚀',
    anim: 'bounce 1.8s ease-in-out infinite',
    appMock: `<div class="app-mock"><h3>Community</h3><p>Classifica · profili · giri condivisi</p><span class="chip">Unisciti</span></div>`,
  },
];

function renderHtml(scene, mascotDataUrl) {
  let html = readFileSync(TEMPLATE, 'utf8');
  return fillTemplate(html, {
    BADGE: scene.badge,
    SPEECH: scene.speech,
    MASCOT_ANIM: scene.anim,
    MASCOT_IMG: mascotDataUrl,
    APP_MOCK: scene.appMock,
  });
}

async function captureJpeg(html, outPath) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForSelector('.bike-wrap img', { state: 'visible' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 92 });
  await browser.close();
}

async function recordSegment(html, framesDir, prefix, fps, seconds) {
  mkdirSync(framesDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForSelector('.bike-wrap img', { state: 'visible' });
  await page.waitForTimeout(400);

  const total = fps * seconds;
  for (let i = 0; i < total; i++) {
    await page.waitForTimeout(1000 / fps);
    const n = String(i).padStart(3, '0');
    await page.screenshot({
      path: join(framesDir, `${prefix}${n}.png`),
      type: 'png',
    });
  }
  await browser.close();
}

function pngToMp4(framesDir, pattern, fps, outMp4, seconds) {
  return spawnSync(
    ffmpegPath,
    [
      '-y',
      '-framerate',
      String(fps),
      '-i',
      join(framesDir, pattern),
      '-t',
      String(seconds),
      '-vf',
      'scale=1080:1920',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '23',
      '-movflags',
      '+faststart',
      outMp4,
    ],
    { stdio: 'inherit' },
  ).status === 0;
}

function concatMp4(parts, outMp4) {
  const listPath = join(OUT, '_concat-video.txt');
  writeFileSync(listPath, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  return (
    spawnSync(
      ffmpegPath,
      [
        '-y',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listPath,
        '-c',
        'copy',
        '-movflags',
        '+faststart',
        outMp4,
      ],
      { stdio: 'inherit' },
    ).status === 0
  );
}

async function main() {
  if (!existsSync(REF_IMG)) {
    console.error('Manca social/mascot/rosso-panigale-ref.png');
    process.exit(1);
  }

  mkdirSync(IG, { recursive: true });
  const mascotDataUrl = fileToDataUrl(REF_IMG, 'image/png');

  console.log('▶ Rosso Panigale — JPG Instagram (1080×1920)\n');

  for (const scene of SCENES) {
    const html = renderHtml(scene, mascotDataUrl);
    const jpgPath = join(IG, `${scene.file}.jpg`);
    await captureJpeg(html, jpgPath);
    console.log(`  ✓ ${jpgPath}`);
  }

  // Avatar quadrato per profilo (crop centro)
  const avatarPath = join(IG, '00-profilo-avatar.jpg');
  spawnSync(
    ffmpegPath,
    [
      '-y',
      '-i',
      REF_IMG,
      '-vf',
      'scale=1080:-1,crop=1080:1080:(iw-1080)/2:(ih-1080)*0.55',
      '-q:v',
      '2',
      avatarPath,
    ],
    { stdio: 'inherit' },
  );
  console.log(`  ✓ ${avatarPath} (profilo)`);

  console.log('\n▶ Video Reel — Rosso presenta l\'app (~20s)\n');
  const framesDir = join(OUT, '_frames');
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  const fps = 24;
  const secPerScene = 4;
  const segmentMp4s = [];

  for (let s = 0; s < SCENES.length; s++) {
    const scene = SCENES[s];
    const html = renderHtml(scene, mascotDataUrl);
    const prefix = `s${s}_`;
    await recordSegment(html, framesDir, prefix, fps, secPerScene);
    const segMp4 = join(IG, `_seg-${scene.file}.mp4`);
    pngToMp4(framesDir, `${prefix}%03d.png`, fps, segMp4, secPerScene);
    segmentMp4s.push(segMp4);
    console.log(`  ✓ segmento ${s + 1}/${SCENES.length}`);
  }

  const reelPath = join(IG, 'reel-rosso-presenta-app.mp4');
  concatMp4(segmentMp4s, reelPath);
  console.log(`  ✓ ${reelPath}`);

  // Pulizia segmenti temporanei
  for (const p of segmentMp4s) {
    try {
      rmSync(p);
    } catch {
      /* ok */
    }
  }

  writeFileSync(
    join(IG, 'LEGGIMI.txt'),
    [
      'FILE PRONTI PER INSTAGRAM',
      '========================',
      '',
      'Story / Post verticale: *.jpg (1080×1920)',
      'Foto profilo: 00-profilo-avatar.jpg (1080×1080)',
      'Reel: reel-rosso-presenta-app.mp4 (~20s, H.264)',
      '',
      'Carica da telefono: Instagram → + → scegli file',
      'Reel: usa reel-rosso-presenta-app.mp4',
      '',
      'NON committare — resta solo sul PC.',
    ].join('\n'),
  );

  console.log(`\n✓ Cartella Instagram: ${IG}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
