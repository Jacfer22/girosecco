/**
 * Genera PNG marker mascotte (sfondo trasparente, ritaglio preciso).
 * npm run mascot:cutout
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'mascot');

const FILES = [
  { src: 'rosso-sport.png', out: 'rosso-sport-marker.png' },
  { src: 'blu-adventure.png', out: 'blu-adventure-marker.png' },
  { src: 'nero-cruiser.png', out: 'nero-cruiser-marker.png' },
];

async function cutoutInBrowser(page, b64, maxPx) {
  return page.evaluate(
    async ({ dataUrl, maxPx: max }) => {
      function pixelIsBg(r, g, b) {
        if (r + g + b < 38) return true;
        if (r < 28 && g < 28 && b < 28) return true;
        return false;
      }

      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = () => res(null);
        img.onerror = rej;
        img.src = dataUrl;
      });

      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return dataUrl;
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;
      const bgMask = new Uint8Array(w * h);
      const queue = [];

      const seed = (x, y) => {
        if (x < 0 || y < 0 || x >= w || y >= h) return;
        const idx = y * w + x;
        if (bgMask[idx]) return;
        const p = idx * 4;
        if (!pixelIsBg(d[p], d[p + 1], d[p + 2])) return;
        bgMask[idx] = 1;
        queue.push(x, y);
      };

      for (let x = 0; x < w; x += 1) {
        seed(x, 0);
        seed(x, h - 1);
      }
      for (let y = 0; y < h; y += 1) {
        seed(0, y);
        seed(w - 1, y);
      }

      while (queue.length > 0) {
        const y = queue.pop();
        const x = queue.pop();
        if (x === undefined || y === undefined) break;
        seed(x - 1, y);
        seed(x + 1, y);
        seed(x, y - 1);
        seed(x, y + 1);
      }

      for (let i = 0; i < w * h; i += 1) {
        if (bgMask[i]) d[i * 4 + 3] = 0;
      }

      for (let y = 1; y < h - 1; y += 1) {
        for (let x = 1; x < w - 1; x += 1) {
          const i = y * w + x;
          const p = i * 4;
          if (d[p + 3] === 0) continue;
          const sum = d[p] + d[p + 1] + d[p + 2];
          if (sum > 55) continue;
          const neighbors = [
            d[(i - 1) * 4 + 3],
            d[(i + 1) * 4 + 3],
            d[(i - w) * 4 + 3],
            d[(i + w) * 4 + 3],
          ];
          if (neighbors.some((a) => a === 0)) {
            d[p + 3] = Math.min(d[p + 3], Math.max(0, Math.round((sum - 18) * 6)));
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      let minX = w;
      let minY = h;
      let maxX = 0;
      let maxY = 0;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          if (d[(y * w + x) * 4 + 3] > 8) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const pad = 4;
      minX = Math.max(0, minX - pad);
      minY = Math.max(0, minY - pad);
      maxX = Math.min(w - 1, maxX + pad);
      maxY = Math.min(h - 1, maxY + pad);
      const cw = maxX - minX + 1;
      const ch = maxY - minY + 1;

      const trimmed = document.createElement('canvas');
      trimmed.width = cw;
      trimmed.height = ch;
      const tctx = trimmed.getContext('2d');
      if (!tctx) return canvas.toDataURL('image/png');
      tctx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
      return trimmed.toDataURL('image/png');
    },
    { dataUrl: b64, maxPx },
  );
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const { src, out } of FILES) {
    const path = join(OUT_DIR, src);
    const b64 = `data:image/png;base64,${readFileSync(path).toString('base64')}`;
    const dataUrl = await cutoutInBrowser(page, b64, 360);
    if (!dataUrl?.includes(',')) throw new Error(`Cutout fallito per ${src}`);
    const outPath = join(OUT_DIR, out);
    writeFileSync(outPath, Buffer.from(dataUrl.split(',')[1], 'base64'));
    console.log(`✓ public/mascot/${out}`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
