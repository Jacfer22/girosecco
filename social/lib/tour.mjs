import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fillTemplate, fileToDataUrl, ROOT } from './render-social.mjs';
import { ensureMascotCutout } from './mascot-cutout.mjs';

export const TEMPLATE = join(ROOT, 'social', 'templates', 'tour-scene.html');

export const MASCOTS = {
  rosso: {
    name: 'Rosso',
    file: join(ROOT, 'social', 'mascot', 'rosso-sport.png'),
    role: 'sport · traccia e card',
    accent: '#ED2100',
    accentDark: '#9B1200',
    glow: 'rgba(237,33,0,0.22)',
    guideLine: 'Con Rosso',
  },
  blu: {
    name: 'Blu',
    file: join(ROOT, 'social', 'mascot', 'blu-adventure.png'),
    role: 'avventura · itinerari e naviga',
    accent: '#2B8CDE',
    accentDark: '#1A5A9E',
    glow: 'rgba(43,140,222,0.2)',
    guideLine: 'Con Blu',
  },
  nero: {
    name: 'Nero',
    file: join(ROOT, 'social', 'mascot', 'nero-cruiser.png'),
    role: 'custom · garage e community',
    accent: '#C8C4BC',
    accentDark: '#8A8680',
    glow: 'rgba(200,196,188,0.15)',
    guideLine: 'Con Nero',
  },
};

/** Motion profile — entrance, idle hold, exit per mascotte */
const MOTION = {
  rosso: {
    enterX: -1.15,
    exitX: 1.25,
    enterEnd: 0.2,
    exitStart: 0.76,
    enterRot: [-16, 2, 0],
    exitRot: [0, 10, 14],
    enterScale: [0.82, 1.06, 1],
    idleAmp: 9,
    idleLean: 2.2,
    speed: 1.15,
    dustSide: 'left',
  },
  blu: {
    enterX: 1.15,
    exitX: -1.25,
    enterEnd: 0.26,
    exitStart: 0.74,
    enterRot: [14, -3, 0],
    exitRot: [0, -8, -12],
    enterScale: [0.86, 1.02, 1],
    idleAmp: 7,
    idleLean: 1.6,
    speed: 0.95,
    dustSide: 'right',
  },
  nero: {
    enterX: -1.05,
    exitX: 1.15,
    enterEnd: 0.32,
    exitStart: 0.7,
    enterRot: [-10, 1, 0],
    exitRot: [0, 5, 8],
    enterScale: [0.9, 1.01, 1],
    idleAmp: 5,
    idleLean: 1.2,
    speed: 0.72,
    dustSide: 'left',
  },
};

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInCubic(t) {
  return t ** 3;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Frame state for mascot animation (progress 0–1 over clip duration) */
export function mascotFrameState(mascotKey, progress) {
  const m = MOTION[mascotKey];
  const W = 1080;
  let x = 0;
  let y = 0;
  let rotate = 0;
  let scale = 1;
  let blur = 0;
  let skid = 0;
  let dust = 0;
  let roadSpeed = '2.4s';

  if (progress < m.enterEnd) {
    const t = progress / m.enterEnd;
    const eased = m.speed > 1 ? easeOutCubic(t) : easeInOutCubic(t);
    x = m.enterX * W * (1 - eased);
    rotate =
      t < 0.65
        ? lerp(m.enterRot[0], m.enterRot[1], easeOutCubic(t / 0.65))
        : lerp(m.enterRot[1], m.enterRot[2], easeOutCubic((t - 0.65) / 0.35));
    scale =
      t < 0.7
        ? lerp(m.enterScale[0], m.enterScale[1], easeOutCubic(t / 0.7))
        : lerp(m.enterScale[1], m.enterScale[2], easeOutCubic((t - 0.7) / 0.3));
    if (t < 0.75) {
      skid = (1 - t) * 0.85;
      dust = (1 - t) * 0.6;
      blur = (1 - t) * (m.speed > 1 ? 2.5 : 1.5);
    }
    roadSpeed = m.speed > 1 ? '0.55s' : '0.85s';
  } else if (progress > m.exitStart) {
    const t = (progress - m.exitStart) / (1 - m.exitStart);
    const eased = easeInCubic(t);
    x = m.exitX * W * eased;
    rotate =
      t < 0.4
        ? lerp(m.exitRot[0], m.exitRot[1], easeInCubic(t / 0.4))
        : lerp(m.exitRot[1], m.exitRot[2], easeInCubic((t - 0.4) / 0.6));
    scale = 1 - eased * 0.1;
    if (t < 0.5) {
      skid = t * 1.2;
      dust = t * 0.8;
    }
    blur = eased * 2.5;
    roadSpeed = m.speed > 1 ? '0.45s' : '0.7s';
  } else {
    const hold = (progress - m.enterEnd) / (m.exitStart - m.enterEnd);
    const phase = hold * Math.PI * 5;
    y = -Math.sin(phase) * m.idleAmp;
    rotate = Math.sin(phase * 0.65) * m.idleLean;
    roadSpeed = '2.8s';
  }

  return { x, y, rotate, scale, blur, skid, dust, roadSpeed, dustSide: m.dustSide };
}

export const TOUR = [
  {
    id: '01-benvenuto',
    step: '1 di 9',
    mascot: 'rosso',
    feature: 'Benvenuto',
    headline: 'Tour MotoGarage',
    caption:
      'Tre moto, un\'app. Ti guidiamo tra <strong>GPS, itinerari e garage digitale</strong> — come lo usiamo quando scendiamo in strada.',
    appUi: `<div class="app-ui"><h4>Hub</h4><p>Home dopo il login — tutto da qui.</p><span class="btn">Entra</span></div>`,
  },
  {
    id: '02-traccia',
    step: '2 di 9',
    mascot: 'rosso',
    feature: 'Traccia GPS',
    headline: 'Traccia il giro',
    caption:
      'Accendi, parti, registra. <strong>Km, tempo e percorso</strong> live sulla mappa. Il giro parte da qui.',
    appUi: `<div class="app-ui"><h4>Traccia giro</h4><div class="app-map"></div><p>GPS attivo sulla mappa.</p><span class="btn">Inizia</span></div>`,
  },
  {
    id: '03-itinerari',
    step: '3 di 9',
    mascot: 'blu',
    feature: 'Itinerari',
    headline: 'Route pronte',
    caption:
      'Dolomiti, mare, Appennino. <strong>Itinerari per regione</strong> con curve, km e zone da scoprire prima di mettere il casco.',
    appUi: `<div class="app-ui"><h4>Itinerari</h4><p>Route curate per zona.</p><span class="btn">Esplora</span></div>`,
  },
  {
    id: '04-garage',
    step: '4 di 9',
    mascot: 'nero',
    feature: 'Garage 3D',
    headline: 'Il tuo garage',
    caption:
      'La tua moto in <strong>3D</strong>. Non un avatar generico: marca, modello, finiture. Ruota, salva, mostra.',
    appUi: `<div class="app-ui"><h4>Il mio Garage</h4><p>Avatar 3D personalizzato.</p><span class="btn">Crea</span></div>`,
  },
  {
    id: '05-card',
    step: '5 di 9',
    mascot: 'rosso',
    feature: 'Card giro',
    headline: 'Card del giro',
    caption:
      'Giro chiuso? <strong>Card automatica</strong> con tracciato e dati. Formato Story 9:16, pronta da condividere.',
    appUi: `<div class="app-ui"><h4>Card del giro</h4><p>Foto + tracciato + statistiche.</p><span class="btn">Condividi</span></div>`,
  },
  {
    id: '06-naviga',
    step: '6 di 9',
    mascot: 'blu',
    feature: 'Navigatore',
    headline: 'Naviga in moto',
    caption:
      'Destinazione inserita, <strong>prossima manovra</strong> in cuffia. Navigazione costruita per chi guida in moto.',
    appUi: `<div class="app-ui"><h4>Navigatore</h4><p>Prossima svolta + mappa.</p><span class="btn">Vai</span></div>`,
  },
  {
    id: '07-community',
    step: '7 di 9',
    mascot: 'nero',
    feature: 'Community',
    headline: 'Community moto',
    caption:
      'Chi è in strada, <strong>classifica km</strong>, profili moto. La community che capisce perché hai la tua in garage.',
    appUi: `<div class="app-ui"><h4>Community</h4><p>Classifica e profili.</p><span class="btn">Guarda</span></div>`,
  },
  {
    id: '08-registrati',
    step: '8 di 9',
    mascot: 'blu',
    feature: 'Inizia gratis',
    headline: 'Provalo ora',
    caption:
      'Crea l\'account, fai il <strong>primo giro</strong>. Gratis per partire — capisci in cinque minuti se è la tua app.',
    appUi: `<div class="app-ui"><h4>Accedi</h4><p>Email o account social.</p><span class="btn">Registrati</span></div>`,
  },
  {
    id: '09-ciao',
    step: '9 di 9',
    mascot: 'nero',
    feature: 'A presto',
    headline: 'Ci vediamo in curva',
    caption:
      'Tour chiuso. <strong>Link in bio</strong> — ci vediamo in strada. Rosso, Blu, Nero. E la tua.',
    appUi: `<div class="app-ui"><h4>MotoGarage</h4><p>La casa digitale della tua moto.</p><span class="btn">Provalo</span></div>`,
  },
];

export function assertMascots() {
  for (const key of Object.keys(MASCOTS)) {
    if (!existsSync(MASCOTS[key].file)) {
      throw new Error(`Manca mascotte: ${MASCOTS[key].file}`);
    }
  }
}

export function loadMascotDataUrls() {
  console.log('\n▶ Scontorno mascotte (rimozione sfondo nero)\n');
  return Object.fromEntries(
    Object.entries(MASCOTS).map(([k, v]) => {
      const cutout = ensureMascotCutout(v.file);
      console.log(`  ✓ ${k}: ${cutout.split(/[/\\]/).pop()}`);
      return [k, fileToDataUrl(cutout, 'image/png')];
    }),
  );
}

function dotsHtml(activeIndex, total) {
  return Array.from({ length: total }, (_, i) =>
    `<span class="dot${i === activeIndex ? ' on' : ''}"></span>`,
  ).join('');
}

function sceneVars(step, index, mascotDataUrl, progress) {
  const mascot = MASCOTS[step.mascot];
  const state = mascotFrameState(step.mascot, progress);
  const dustX = state.dustSide === 'left' ? '28%' : '62%';
  const phoneFloat = Math.sin(progress * Math.PI * 4) * 3;

  return {
    STEP_LABEL: step.step,
    GUIDE_LINE: mascot.guideLine,
    HEADLINE: step.headline,
    CAPTION: step.caption,
    FEATURE: step.feature,
    MASCOT_IMG: mascotDataUrl,
    APP_UI: step.appUi,
    DOTS: dotsHtml(index, TOUR.length),
    ACCENT_COLOR: mascot.accent,
    ACCENT_DARK: mascot.accentDark,
    GLOW_COLOR: mascot.glow,
    MASCOT_TRANSFORM: `translateX(${state.x}px) translateY(${state.y}px) rotate(${state.rotate}deg) scale(${state.scale})`,
    MOTION_BLUR: state.blur > 0.1 ? `blur(${state.blur}px)` : 'blur(0)',
    SKID_OPACITY: String(state.skid),
    DUST_OPACITY: String(state.dust),
    DUST_X: dustX,
    ROAD_SPEED: state.roadSpeed,
    PHONE_FLOAT: String(phoneFloat),
  };
}

/** Static slide — mascot in hold pose (~mid-clip) */
export function renderScene(step, index, mascotDataUrl) {
  const html = readFileSync(TEMPLATE, 'utf8');
  return fillTemplate(html, sceneVars(step, index, mascotDataUrl, 0.42));
}

/** Video frame at specific progress (0–1) */
export function renderSceneFrame(step, index, mascotDataUrl, progress) {
  const html = readFileSync(TEMPLATE, 'utf8');
  return fillTemplate(html, sceneVars(step, index, mascotDataUrl, progress));
}

export async function jpegFromHtml(html, path) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForSelector('.mascot-wrap img', { state: 'visible' });
  await page.waitForTimeout(400);
  await page.screenshot({ path, type: 'jpeg', quality: 92 });
  await browser.close();
}

/** Capture frame-by-frame with computed mascot motion (enter → idle → exit) */
export async function recordFrames(step, index, mascotDataUrl, dir, prefix, fps, sec) {
  mkdirSync(dir, { recursive: true });
  const total = fps * sec;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (let i = 0; i < total; i++) {
    const progress = i / total;
    const html = renderSceneFrame(step, index, mascotDataUrl, progress);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForSelector('.mascot-wrap img', { state: 'visible' });
    await page.screenshot({ path: join(dir, `${prefix}${String(i).padStart(3, '0')}.png`), type: 'png' });
  }

  await browser.close();
}

export function toMp4(pattern, out, fps, sec) {
  return (
    spawnSync(
      ffmpegPath,
      [
        '-y',
        '-framerate',
        String(fps),
        '-i',
        pattern,
        '-t',
        String(sec),
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
        out,
      ],
      { stdio: 'inherit' },
    ).status === 0
  );
}

export function concatMp4(list, out) {
  const f = join(out, '..', '_concat.txt');
  writeFileSync(f, list.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  return (
    spawnSync(
      ffmpegPath,
      ['-y', '-f', 'concat', '-safe', '0', '-i', f, '-c', 'copy', '-movflags', '+faststart', out],
      { stdio: 'inherit' },
    ).status === 0
  );
}
