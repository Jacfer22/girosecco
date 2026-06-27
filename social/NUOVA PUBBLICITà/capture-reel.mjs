/**
 * capture-reel.mjs
 * Cattura reel-instagram.html → reel-motogarage.mp4
 *
 * Requisiti:
 *   npm install puppeteer
 *   ffmpeg installato e nel PATH
 *
 * Uso:
 *   node capture-reel.mjs
 */

import puppeteer from 'puppeteer';
import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = join(__dir, '_frames_capture');
const OUTPUT_MP4 = join(__dir, 'reel-motogarage.mp4');
const HTML_FILE  = join(__dir, 'reel-instagram.html');

const FPS          = 30;
const DURATION_SEC = 30;
const TOTAL_FRAMES = FPS * DURATION_SEC;
const WIDTH        = 1080;
const HEIGHT       = 1920;

if (!existsSync(FRAMES_DIR)) mkdirSync(FRAMES_DIR);

console.log('🎬 Avvio cattura reel MotoGarage...');
console.log(`   ${TOTAL_FRAMES} frame @ ${FPS}fps = ${DURATION_SEC}s`);

const browser = await puppeteer.launch({
  headless: true,
  args: [
    `--window-size=${WIDTH},${HEIGHT}`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--allow-file-access-from-files',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

// Carica HTML locale
await page.goto(`file:///${HTML_FILE.replace(/\\/g, '/')}`, {
  waitUntil: 'networkidle0',
  timeout: 15000,
});

console.log('✅ Pagina caricata — inizio cattura frame...');

// Cattura frame-per-frame avanzando il tempo manualmente
await page.evaluate(() => {
  // Blocca le animazioni CSS e gestisci il tempo manualmente
  window.__frameTime = 0;
  // Sostituzione requestAnimationFrame per controllo preciso
  // (le animazioni JS useranno questo clock)
});

for (let f = 0; f < TOTAL_FRAMES; f++) {
  const ms = (f / FPS) * 1000;

  // Avanza il clock virtuale
  await page.evaluate((t) => {
    // Triggera gli event di timeline manualmente se necessario
    document.documentElement.style.setProperty('--t', t + 'ms');
  }, ms);

  // Screenshot frame
  const padded = String(f).padStart(5, '0');
  await page.screenshot({
    path: join(FRAMES_DIR, `frame_${padded}.png`),
    clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    type: 'png',
  });

  if (f % 30 === 0) {
    const sec = Math.round(f / FPS);
    const bar = '█'.repeat(Math.round(f / TOTAL_FRAMES * 20)).padEnd(20, '░');
    process.stdout.write(`\r   [${bar}] ${sec}/${DURATION_SEC}s  `);
  }

  // Avanza animazione aspettando 1 frame reale
  await new Promise(r => setTimeout(r, 1000 / FPS));
}

console.log('\n✅ Frame catturati — assemblaggio MP4...');
await browser.close();

// FFmpeg assembly
const ffmpegCmd = [
  'ffmpeg', '-y',
  `-framerate ${FPS}`,
  `-i "${join(FRAMES_DIR, 'frame_%05d.png')}"`,
  '-c:v libx264',
  '-crf 20',
  '-preset medium',
  '-pix_fmt yuv420p',
  '-movflags +faststart',
  `"${OUTPUT_MP4}"`,
].join(' ');

console.log('   Eseguo ffmpeg...');
execSync(ffmpegCmd, { stdio: 'inherit' });

console.log(`\n🏁 DONE!`);
console.log(`   MP4  → ${OUTPUT_MP4}`);
console.log(`   Size → ${Math.round(require('fs').statSync(OUTPUT_MP4).size / 1024 / 1024 * 10) / 10} MB`);
console.log('\n→ Carica su Instagram come Reel');
