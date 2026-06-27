/**
 * Video tour Instagram: iPhone centrato + mascotte + dialoghi completi + transizioni sgasata.
 */
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import pkg from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { assertMascots, loadMascotDataUrls, toMp4, concatMp4 } from '../social/lib/tour.mjs';
import {
  APP_TOUR_SCENES,
  TRANSITION_SEC,
  captureScreenFrames,
  recordCompositeSegment,
  recordTransitionSegment,
} from '../social/lib/tour-app-video.mjs';
import { planTourAudio, extractThumbnail, muxVideoAudio } from '../social/lib/tour-audio.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'social', 'tour-video');
const WORK = join(OUT_DIR, '_work');
const FINAL = join(OUT_DIR, 'motogarage-mascot-tour.mp4');
const FINAL_VO = join(OUT_DIR, 'motogarage-reel-voice.mp4');
const THUMB = join(OUT_DIR, 'reel-cover.jpg');

const FPS = 24;
const GARAGE_USER = process.env.REEL_GARAGE_USER ?? 'demo';

const { loadEnvConfig } = pkg;
loadEnvConfig(ROOT);

async function isCorrectApp(base) {
  try {
    const r = await fetch(base, { signal: AbortSignal.timeout(12000) });
    const html = await r.text();
    if (!r.ok) return false;
    return html.includes('MotoGarage') || html.includes('Traccia') || html.includes('/_next/');
  } catch {
    return false;
  }
}

async function resolveBaseUrl() {
  for (const base of [
    process.env.REEL_BASE_URL,
    'https://motogarage.info',
    'http://127.0.0.1:3002',
    'http://localhost:3002',
  ].filter(Boolean)) {
    const normalized = String(base).replace(/\/$/, '');
    if (await isCorrectApp(normalized)) return normalized;
  }
  throw new Error(
    'App non raggiungibile. Avvia: npm run build && npx next start -p 3002\n' +
      'Oppure: REEL_BASE_URL=https://motogarage.info npm run social:tour-video',
  );
}

async function resolveGarageUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return GARAGE_USER;
  const sb = createClient(url, key);
  for (const candidate of [GARAGE_USER, 'demo', 'jacop']) {
    const { data } = await sb.from('profiles').select('username').ilike('username', candidate).maybeSingle();
    if (data?.username) return data.username;
  }
  return GARAGE_USER;
}

function fileOk(path, min = 50000) {
  return existsSync(path) && statSync(path).size >= min;
}

async function main() {
  console.log('\n🎬 MotoGarage — reel centrato + dialoghi + transizioni\n');

  assertMascots();
  const base = await resolveBaseUrl();
  const garageUser = await resolveGarageUser();
  console.log(`▶ Base URL: ${base}`);
  console.log(`▶ Garage user: ${garageUser}\n`);

  rmSync(WORK, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(WORK, { recursive: true });

  console.log('▶ Step 1: pianificazione audio (durata scene = lunghezza dialogo)\n');
  const voiceDir = join(WORK, 'voice');
  const { plan, voiceover } = await planTourAudio(voiceDir);
  const durationById = Object.fromEntries(plan.map((p) => [p.id, p.durationSec]));

  const mascotUrls = loadMascotDataUrls();
  const browser = await chromium.launch();
  const segments = [];

  try {
    for (let i = 0; i < APP_TOUR_SCENES.length; i++) {
      const scene = APP_TOUR_SCENES[i];
      const sec = durationById[scene.id] ?? scene.sec;
      console.log(`\n▶ ${scene.step} — ${sec.toFixed(1)}s`);

      const screenFrames = await captureScreenFrames(
        browser,
        base,
        scene,
        join(WORK, scene.id, 'screen'),
        FPS,
        sec,
        garageUser,
        ROOT,
      );
      console.log(`  ✓ ${screenFrames.length} frame schermo`);

      const compDir = join(WORK, scene.id, 'composite');
      const prefix = 'c_';
      await recordCompositeSegment(scene, mascotUrls[scene.mascot], screenFrames, compDir, prefix, FPS, sec);

      const seg = join(WORK, `${scene.id}.mp4`);
      const ok = toMp4(join(compDir, `${prefix}%04d.png`), seg, FPS, sec);
      if (!ok || !fileOk(seg)) throw new Error(`Segmento fallito: ${scene.id}`);
      segments.push(seg);
      console.log(`  ✓ scena ${Math.round(statSync(seg).size / 1024)} KB`);

      if (i < APP_TOUR_SCENES.length - 1) {
        const nextMascot = APP_TOUR_SCENES[i + 1].mascot;
        const tDir = join(WORK, `trans-${i}`, 'composite');
        const tPrefix = 't_';
        console.log(`  ⚡ transizione sgasata (${TRANSITION_SEC}s) — ${nextMascot}`);
        await recordTransitionSegment(nextMascot, mascotUrls[nextMascot], tDir, tPrefix, FPS, TRANSITION_SEC);
        const tSeg = join(WORK, `trans-${i}.mp4`);
        const tok = toMp4(join(tDir, `${tPrefix}%04d.png`), tSeg, FPS, TRANSITION_SEC);
        if (!tok || !fileOk(tSeg, 10000)) throw new Error(`Transizione fallita: ${i}`);
        segments.push(tSeg);
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\n▶ Concatenazione video…\n');
  if (!concatMp4(segments, FINAL)) process.exit(1);

  console.log('\n▶ Mux audio (dialoghi non tagliati)…\n');
  if (!muxVideoAudio(FINAL, voiceover, FINAL_VO)) process.exit(1);
  extractThumbnail(FINAL_VO, THUMB, 4);

  const sizeMb = (statSync(FINAL_VO).size / (1024 * 1024)).toFixed(1);
  console.log(`\n✅ Video pronto: ${FINAL_VO} (${sizeMb} MB)\n`);
  console.log(`   Cover: ${THUMB}`);
  console.log('   Layout: telefono + mascotte centrati · transizioni VVRRR tra scene\n');

  rmSync(WORK, { recursive: true, force: true });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
