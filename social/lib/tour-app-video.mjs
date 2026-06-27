import { chromium } from 'playwright';
import { readFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fillTemplate } from './render-social.mjs';
import { MASCOTS } from './tour.mjs';
import { mascotReelHold, mascotTransitionBurst } from './tour-mascot-motion.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const TEMPLATE = join(__dirname, '..', 'templates', 'tour-app-video-scene.html');
export const TRANSITION_TEMPLATE = join(__dirname, '..', 'templates', 'tour-app-transition.html');

export const TRANSITION_SEC = 0.7;

/** Scene tour — durata impostata da planTourAudio */
export const APP_TOUR_SCENES = [
  {
    id: '01-landing',
    step: '1 di 7',
    mascot: 'rosso',
    feature: 'Benvenuto',
    caption: 'Ciao! Sono <strong>Rosso</strong>. Ti faccio vedere MotoGarage mentre navighi nell\'app.',
    path: '/',
    mascotSide: 'right',
    sec: 5,
    setup: async (page) => {
      await page.waitForSelector('h1', { timeout: 30000 });
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(600);
    },
    animate: async (page, frame, total) => {
      const scrollMax = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
      const y = (frame / Math.max(total - 1, 1)) * Math.min(scrollMax, 420);
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    },
  },
  {
    id: '02-itinerari',
    step: '2 di 7',
    mascot: 'blu',
    feature: 'Itinerari',
    caption: 'Io sono <strong>Blu</strong>. Itinerari verificati in tutta Italia. Tu metti il casco, noi la mappa.',
    path: '/itinerari',
    mascotSide: 'left',
    sec: 5,
    setup: async (page) => {
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(800);
    },
    animate: async (page, frame, total) => {
      const y = (frame / Math.max(total - 1, 1)) * 380;
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    },
  },
  {
    id: '03-naviga',
    step: '3 di 7',
    mascot: 'blu',
    feature: 'Navigatore',
    caption: 'Navigatore <strong>pensato per la moto</strong>. Prossima manovra chiara, anche in cuffia.',
    path: '/reel/nav',
    mascotSide: 'right',
    sec: 5,
    waitFor: '[data-reel-nav-ready="true"]',
    setup: async (page) => {
      await page.waitForSelector('[data-reel-nav-ready="true"]', { timeout: 90000 });
      await page.waitForTimeout(500);
    },
    animate: async (page, frame, total) => {
      await page.evaluate(
        ({ f, t }) => window.dispatchEvent(new CustomEvent('reel-nav-frame', { detail: { frame: f, total: t } })),
        { f: frame, t: total },
      );
    },
  },
  {
    id: '04-garage',
    step: '4 di 7',
    mascot: 'nero',
    feature: 'Garage 3D',
    caption: 'Sono <strong>Nero</strong>. Crea l\'avatar 3D della tua moto e mostralo agli amici.',
    path: '/reel/garage',
    proof: '/reels/scenes/04-garage-3d-proof.png',
    proofFallback: '/reels/scenes/03-garage-3d-proof.png',
    mascotSide: 'left',
    sec: 5,
    waitFor: '[aria-label="Viewer 3D interattivo"]',
    setup: async (page) => {
      await page.waitForSelector('[aria-label="Viewer 3D interattivo"]', { timeout: 45000 });
      await page.waitForFunction(() => !document.body.innerText.includes('Caricamento avatar'), { timeout: 45000 }).catch(() => {});
      await page.waitForTimeout(500);
    },
    animate: async (page, frame, total) => {
      await page.evaluate(
        ({ f, t }) => window.dispatchEvent(new CustomEvent('reel-garage-frame', { detail: { frame: f, total: t } })),
        { f: frame, t: total },
      );
    },
  },
  {
    id: '05-traccia',
    step: '5 di 7',
    mascot: 'rosso',
    feature: 'Traccia GPS',
    caption: 'Con <strong>Traccia</strong> registri il giro col GPS. Alla fine la card è pronta per i social.',
    path: '/traccia',
    proof: '/reels/scenes/03-traccia-proof.png',
    mascotSide: 'right',
    sec: 5,
    setup: async (page) => {
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(600);
    },
    animate: async (page, frame, total) => {
      const y = (frame / Math.max(total - 1, 1)) * 80;
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    },
  },
  {
    id: '06-community',
    step: '6 di 7',
    mascot: 'nero',
    feature: 'Community',
    caption: 'In <strong>community</strong> condividi i giri, la classifica e i profili degli altri biker.',
    path: '/community',
    mascotSide: 'left',
    sec: 5,
    setup: async (page) => {
      await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(900);
    },
    animate: async (page, frame, total) => {
      const y = (frame / Math.max(total - 1, 1)) * 320;
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    },
  },
  {
    id: '07-cta',
    step: '7 di 7',
    mascot: 'blu',
    feature: 'Gratis',
    caption: 'Registrati <strong>gratis</strong> su motogarage.info. Ci vediamo in curva!',
    path: '/',
    mascotSide: 'right',
    sec: 5,
    setup: async (page) => {
      await page.evaluate(() => {
        const el = [...document.querySelectorAll('h2')].find((n) => n.textContent?.includes('Pronto a partire'));
        el?.scrollIntoView({ behavior: 'instant', block: 'center' });
      });
      await page.waitForTimeout(700);
    },
    animate: async () => {},
  },
];

function mascotColHtml(mascotDataUrl, name, accent, transform, opacity, blur) {
  const blurCss = blur > 0.1 ? `blur(${blur}px)` : 'none';
  return `<div style="flex:0 0 300px;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:${opacity};">
    <div style="width:300px;transform:${transform};filter:drop-shadow(0 22px 40px rgba(0,0,0,0.55)) ${blurCss};">
      <img src="${mascotDataUrl}" alt="" style="width:100%;height:auto;max-height:360px;object-fit:contain;display:block;" />
    </div>
    <p style="margin-top:12px;font-family:'Barlow Condensed',sans-serif;font-size:24px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase;color:${accent};text-align:center;">${name}</p>
  </div>`;
}

const EMPTY_COL = '<div style="flex:0 0 300px;"></div>';

export function renderAppVideoFrame(step, mascotDataUrl, screenDataUrl, progress) {
  const mascot = MASCOTS[step.mascot];
  const state = mascotReelHold(step.mascot, progress);
  const phoneFloat = Math.sin(progress * Math.PI * 3) * 5;
  const speedOpacity = 0.12 + Math.sin(progress * Math.PI * 8) * 0.06;
  const bubbleOpacity = progress < 0.06 ? progress / 0.06 : 1;

  const transform = `translateX(${state.x}px) translateY(${state.y}px) rotate(${state.rotate}deg) scale(${state.scale})`;
  const col = mascotColHtml(mascotDataUrl, mascot.name, mascot.accent, transform, state.opacity, state.blur);

  const onRight = step.mascotSide === 'right';
  const html = readFileSync(TEMPLATE, 'utf8');
  return fillTemplate(html, {
    CAPTION: step.caption,
    SCREEN_IMG: screenDataUrl,
    MASCOT_LEFT: onRight ? EMPTY_COL : col,
    MASCOT_RIGHT: onRight ? col : EMPTY_COL,
    ACCENT_COLOR: mascot.accent,
    GLOW_COLOR: mascot.glow,
    PHONE_FLOAT: String(phoneFloat),
    SPEED_OPACITY: String(speedOpacity),
    SPEED_X: String(-80 + progress * 160),
    SPEED_X2: String(60 - progress * 140),
    SPEED_X3: String(-40 + progress * 120),
    BUBBLE_OPACITY: String(bubbleOpacity),
  });
}

export function renderTransitionFrame(mascotKey, mascotDataUrl, progress) {
  const mascot = MASCOTS[mascotKey];
  const state = mascotTransitionBurst(mascotKey, progress);
  const html = readFileSync(TRANSITION_TEMPLATE, 'utf8');
  const transform = `translate(calc(-50% + ${state.x}px), calc(-50% + ${state.y}px)) rotate(${state.rotate}deg) scale(${state.scale})`;
  const blur = state.blur > 0.1 ? `blur(${state.blur}px)` : 'none';
  const flash = progress > 0.35 && progress < 0.55 ? (1 - Math.abs(progress - 0.45) / 0.1) * 0.35 : 0;

  return fillTemplate(html, {
    MASCOT_IMG: mascotDataUrl,
    ACCENT_COLOR: mascot.accent,
    MASCOT_TRANSFORM: transform,
    MOTION_BLUR: blur,
    MASCOT_OPACITY: String(state.opacity),
    FLASH_OPACITY: String(flash),
    TEXT_OPACITY: String(progress > 0.2 && progress < 0.75 ? 0.85 : 0),
    LX1: String(-200 + progress * 900),
    LX2: String(180 - progress * 850),
    LX3: String(-120 + progress * 780),
  });
}

function proofToFrames(root, proofPath, frameCount) {
  const full = join(root, 'public', proofPath.replace(/^\//, ''));
  const buf = readFileSync(full);
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  return Array.from({ length: frameCount }, () => dataUrl);
}

export async function captureScreenFrames(browser, base, scene, framesDir, fps, sec, garageUser, root) {
  mkdirSync(framesDir, { recursive: true });
  const frameCount = Math.ceil(sec * fps);

  if (scene.proof && !scene.path) {
    return proofToFrames(root, scene.proof, frameCount);
  }

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: 'it-IT',
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  let url = `${base}${scene.path}`;
  if (scene.id === '04-garage') url = `${base}/reel/garage?user=${garageUser}`;
  console.log(`  capture ${url}`);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    if (scene.waitFor) await page.waitForSelector(scene.waitFor, { timeout: 60000 });
    if (scene.setup) await scene.setup(page, garageUser);
    await page.waitForTimeout(400);

    const frames = [];
    for (let i = 0; i < frameCount; i++) {
      if (scene.animate) await scene.animate(page, i, frameCount);
      const png = await page.screenshot({ type: 'png' });
      frames.push(`data:image/png;base64,${png.toString('base64')}`);
      await page.waitForTimeout(1000 / fps);
    }
    await context.close();
    return frames;
  } catch (err) {
    await context.close();
    const fallback = scene.proofFallback ?? scene.proof;
    if (fallback) {
      console.warn(`  ⚠ live fallita (${err.message?.slice(0, 60)}…) — uso screenshot ${fallback}`);
      return proofToFrames(root, fallback, frameCount);
    }
    throw err;
  }
}

export async function recordCompositeSegment(step, mascotDataUrl, screenFrames, outDir, prefix, fps, sec) {
  mkdirSync(outDir, { recursive: true });
  const total = Math.ceil(sec * fps);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (let i = 0; i < total; i++) {
    const progress = total > 1 ? i / (total - 1) : 0;
    const screenIdx = Math.min(Math.floor((i / total) * screenFrames.length), screenFrames.length - 1);
    const html = renderAppVideoFrame(step, mascotDataUrl, screenFrames[screenIdx], progress);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(80);
    await page.screenshot({ path: join(outDir, `${prefix}${String(i).padStart(4, '0')}.png`), type: 'png' });
  }

  await browser.close();
}

export async function recordTransitionSegment(mascotKey, mascotDataUrl, outDir, prefix, fps, sec) {
  mkdirSync(outDir, { recursive: true });
  const total = Math.ceil(sec * fps);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (let i = 0; i < total; i++) {
    const progress = total > 1 ? i / (total - 1) : 0;
    const html = renderTransitionFrame(mascotKey, mascotDataUrl, progress);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: join(outDir, `${prefix}${String(i).padStart(4, '0')}.png`), type: 'png' });
  }

  await browser.close();
}

export function listFrameFiles(dir, prefix) {
  return readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.png'))
    .sort();
}
