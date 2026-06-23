/**
 * Kit Instagram starter — logo brand + tour 3 mascotte (JPG + MP4).
 * npm run social:starter-kit
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import { renderSocialPng, logoDataUrl, ROOT } from '../social/lib/render-social.mjs';
import {
  TOUR,
  MASCOTS,
  assertMascots,
  loadMascotDataUrls,
  renderScene,
  jpegFromHtml,
  recordFrames,
  toMp4,
  concatMp4,
} from '../social/lib/tour.mjs';

const KIT = join(ROOT, 'social', 'starter-kit');
const T = join(ROOT, 'social', 'templates');

const HIGHLIGHTS = [
  { file: 'app', title: 'App', sub: 'Hub, traccia e navigazione' },
  { file: 'garage', title: 'Garage', sub: 'Avatar 3D della tua moto' },
  { file: 'traccia', title: 'Traccia', sub: 'GPS e card del giro' },
  { file: 'itinerari', title: 'Itinerari', sub: 'Route per regione' },
  { file: 'faq', title: 'FAQ', sub: 'Come funziona · Gratis' },
];

const GENERATED_DIRS = ['01-profile', '02-logo', '03-highlights', '04-tour', '05-video', '_work'];

function kenBurns(input, output, seconds = 4) {
  const fps = 30;
  const frames = seconds * fps;
  const vf = `zoompan=z='min(zoom+0.0012,1.25)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${fps}`;
  return (
    spawnSync(
      ffmpegPath,
      ['-y', '-loop', '1', '-i', input, '-vf', vf, '-t', String(seconds), '-pix_fmt', 'yuv420p', '-c:v', 'libx264', output],
      { stdio: 'inherit' },
    ).status === 0
  );
}

function cleanGenerated() {
  for (const d of GENERATED_DIRS) {
    rmSync(join(KIT, d), { recursive: true, force: true });
  }
}

async function renderLogoAssets(logo) {
  console.log('▶ Logo — profilo, launch, highlight');
  mkdirSync(join(KIT, '01-profile'), { recursive: true });
  mkdirSync(join(KIT, '02-logo'), { recursive: true });
  mkdirSync(join(KIT, '03-highlights'), { recursive: true });

  await renderSocialPng({
    templatePath: join(T, 'profile-avatar.html'),
    vars: { LOGO_DATA_URL: logo },
    outPath: join(KIT, '01-profile', 'avatar-1080.png'),
    width: 1080,
    height: 1080,
  });

  const logoLaunch = join(KIT, '02-logo', 'logo-launch.png');
  await renderSocialPng({
    templatePath: join(T, 'post-logo-launch.html'),
    vars: { LOGO_DATA_URL: logo, TAGLINE: 'La casa digitale della tua moto', PILL: 'Provalo gratis' },
    outPath: logoLaunch,
    width: 1080,
    height: 1920,
  });

  for (const h of HIGHLIGHTS) {
    await renderSocialPng({
      templatePath: join(T, 'highlight-cover.html'),
      vars: { LOGO_DATA_URL: logo, HIGHLIGHT_TITLE: h.title, HIGHLIGHT_SUB: h.sub },
      outPath: join(KIT, '03-highlights', `${h.file}.png`),
      width: 1080,
      height: 1920,
    });
  }

  mkdirSync(join(KIT, '05-video'), { recursive: true });
  kenBurns(logoLaunch, join(KIT, '05-video', 'teaser-logo-4s.mp4'), 4);

  return logoLaunch;
}

async function renderTour(dataUrls) {
  const tourDir = join(KIT, '04-tour');
  const videoDir = join(KIT, '05-video');
  const framesDir = join(KIT, '_work', 'frames');
  mkdirSync(tourDir, { recursive: true });
  mkdirSync(videoDir, { recursive: true });

  console.log('\n▶ Tour virtuale — 9 slide JPG (didascalie in foto)\n');
  for (let i = 0; i < TOUR.length; i++) {
    const step = TOUR[i];
    const html = renderScene(step, i, dataUrls[step.mascot]);
    const jpg = join(tourDir, `${step.id}.jpg`);
    await jpegFromHtml(html, jpg);
    console.log(`  ✓ ${jpg}`);
  }

  const fps = 24;
  const sec = 4;
  const segs = [];

  console.log('\n▶ Video tour completo (~36s)\n');
  for (let i = 0; i < TOUR.length; i++) {
    const step = TOUR[i];
    const prefix = `t${i}_`;
    await recordFrames(step, i, dataUrls[step.mascot], framesDir, prefix, fps, sec);
    const seg = join(KIT, '_work', `_seg-${step.id}.mp4`);
    toMp4(join(framesDir, `${prefix}%03d.png`), seg, fps, sec);
    segs.push(seg);
    console.log(`  ✓ segmento ${i + 1}/9`);
  }

  const fullReel = join(videoDir, 'tour-completo.mp4');
  concatMp4(segs, fullReel);
  for (const s of segs) rmSync(s, { force: true });

  console.log('\n▶ Reel per mascotte (~12s ciascuno)\n');
  for (const [key] of Object.entries(MASCOTS)) {
    const steps = TOUR.filter((t) => t.mascot === key);
    const mSegs = [];
    for (const step of steps.slice(0, 3)) {
      const idx = TOUR.indexOf(step);
      const prefix = `${key}_${step.id}_`;
      await recordFrames(step, idx, dataUrls[key], framesDir, prefix, fps, sec);
      const seg = join(KIT, '_work', `_m-${step.id}.mp4`);
      toMp4(join(framesDir, `${prefix}%03d.png`), seg, fps, sec);
      mSegs.push(seg);
    }
    const outM = join(videoDir, `reel-${key}.mp4`);
    concatMp4(mSegs, outM);
    for (const s of mSegs) rmSync(s, { force: true });
    console.log(`  ✓ ${outM}`);
  }

  rmSync(framesDir, { recursive: true, force: true });
}

function writeCaptions() {
  const plain = (html) => html.replace(/<\/?strong>/g, '');

  const lines = [
    '# Caption — Kit Starter Instagram',
    '',
    'Hashtag base (aggiungi dove serve):',
    '`#motogarage #passionemoto #motoviaggi #instamoto #motorcyclelife #viaggiinmoto #garagedigitale #bikerlife`',
    '',
    '---',
    '',
    '## Logo launch (`02-logo/logo-launch.png`)',
    '',
    '```',
    '🏍️ MotoGarage — la casa digitale della tua moto.',
    '',
    'Garage 3D, tracciamento GPS, card per le Stories e community moto. Tutto in un\'app.',
    '',
    '👉 Link in bio · motogarage.info',
    '```',
    '',
    '**Formato:** Post feed + Story (pinna in alto se possibile)',
    '',
    '---',
    '',
    '## Reel logo (`05-video/teaser-logo-4s.mp4`)',
    '',
    '```',
    'MotoGarage sta arrivando 🏍️',
    '',
    'Garage digitale · GPS · Card social',
    '',
    'Link in bio 👇',
    '```',
    '',
    '---',
    '',
    '## Tour virtuale — 9 slide (`04-tour/`)',
    '',
    'Le didascalie sono **già nella foto**. Sotto il testo per il campo caption Instagram (copia-incolla).',
    '',
  ];

  for (const step of TOUR) {
    const m = MASCOTS[step.mascot];
    const plainCaption = plain(step.caption);
    lines.push(`### ${step.id}.jpg — ${step.feature} (${m.name})`, '');
    lines.push('```');
    lines.push(step.headline);
    lines.push('');
    lines.push(plainCaption);
    lines.push('');
    lines.push('👉 motogarage.info');
    lines.push('```');
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push(
    '## Video tour (`05-video/tour-completo.mp4`)',
    '',
    '```',
    'Tour MotoGarage — Rosso, Blu e Nero ti mostrano l\'app.',
    'GPS, itinerari, garage 3D e community. Link in bio.',
    '```',
    '',
    '---',
    '',
    '## Reel mascotte (`05-video/reel-rosso|blu|nero.mp4`)',
    '',
    '```',
    'Mini tour con Rosso — traccia GPS e card del giro.',
    'Scopri MotoGarage. Link in bio.',
    '```',
    '',
    '**Blu:** itinerari e navigatore moto.',
    '**Nero:** garage 3D e community.',
    '',
  );

  writeFileSync(join(KIT, 'CAPTIONS.md'), lines.join('\n'));
}

async function main() {
  assertMascots();
  // Forza rigenerazione cutout (soglia aggiornata)
  for (const v of Object.values(MASCOTS)) {
    const cutout = v.file.replace(/\.png$/i, '-cutout.png');
    if (existsSync(cutout)) rmSync(cutout);
  }
  cleanGenerated();
  for (const d of GENERATED_DIRS) mkdirSync(join(KIT, d), { recursive: true });

  const logo = logoDataUrl();
  await renderLogoAssets(logo);

  const dataUrls = loadMascotDataUrls();
  await renderTour(dataUrls);

  writeCaptions();
  rmSync(join(KIT, '_work'), { recursive: true, force: true });
  rmSync(join(KIT, '05-video', '_concat.txt'), { force: true });

  writeFileSync(
    join(KIT, 'manifest.json'),
    JSON.stringify(
      {
        generated: new Date().toISOString(),
        tourSteps: TOUR.length,
        highlights: HIGHLIGHTS.length,
        mascots: Object.keys(MASCOTS),
      },
      null,
      2,
    ),
  );

  console.log(`\n✓ Kit pronto: ${KIT}`);
  console.log('  Leggi social/starter-kit/README.md e CAPTIONS.md');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
