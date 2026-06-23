import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..', '..');

export function logoDataUrl() {
  const png = join(ROOT, 'public', 'logo-motogarage.png');
  const svg = join(ROOT, 'public', 'logo-motogarage.svg');
  const path = existsSync(png) ? png : svg;
  if (!existsSync(path)) throw new Error('Logo non trovato in public/');
  const buf = readFileSync(path);
  const mime = path.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export function fileToDataUrl(filePath, mime) {
  const buf = readFileSync(filePath);
  return `data:${mime};base64,${buf.toString('base64')}`;
}

export function fillTemplate(html, vars) {
  let out = html;
  for (const [key, val] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, val);
  }
  return out;
}

/**
 * @param {{ templatePath: string, vars: Record<string,string>, outPath: string, width: number, height: number, scale?: number }} opts
 */
export async function renderSocialPng(opts) {
  const { templatePath, vars, outPath, width, height, scale = 2 } = opts;
  mkdirSync(dirname(outPath), { recursive: true });
  let html = readFileSync(templatePath, 'utf8');
  html = fillTemplate(html, vars);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  const hasImg = await page.locator('img').count();
  if (hasImg) await page.waitForSelector('img', { state: 'visible', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();
  return outPath;
}

export function writeJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2));
}
