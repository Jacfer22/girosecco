/**
 * Ideogram 4 via browser Playwright — usa la sessione HF come sul sito (quota autenticata).
 */
import { chromium } from 'playwright';
import { join } from 'node:path';
import { existsSync, unlinkSync } from 'node:fs';

export const IDEOGRAM_SPACE_HUB = 'https://huggingface.co/spaces/ideogram-ai/ideogram4';

export function profileDir(root) {
  return join(root, 'social', 'ideogram', '.browser-profile');
}

export function profilePronto(root) {
  return existsSync(profileDir(root));
}

function sbloccaProfilo(dir) {
  for (const name of ['lockfile', 'SingletonLock', 'SingletonSocket', 'SingletonCookie']) {
    const p = join(dir, name);
    if (existsSync(p)) {
      try {
        unlinkSync(p);
      } catch {
        /* profilo ancora in uso */
      }
    }
  }
}

async function apriProfilo(dir, headless) {
  sbloccaProfilo(dir);
  try {
    return await chromium.launchPersistentContext(dir, {
      headless,
      viewport: { width: headless ? 1400 : 1280, height: headless ? 960 : 900 },
      args: ['--disable-session-crashed-bubble'],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/browser has been closed|sessione del browser esistente/i.test(msg)) {
      throw new Error(
        'Profilo browser occupato. Chiudi tutte le finestre Chromium aperte dal login, poi rilancia npm run social:ideogram:login',
      );
    }
    throw e;
  }
}

function modeLabel(mode) {
  if (mode === 'quality') return 'Quality · 48 steps';
  if (mode === 'default') return 'Default · 20 steps';
  return 'Turbo · 12 steps';
}

function frameLocator(page) {
  return page.frameLocator('iframe[src*="ideogram4.hf.space"]').first();
}

async function attendiSpace(page) {
  await page.goto(IDEOGRAM_SPACE_HUB, { waitUntil: 'domcontentloaded', timeout: 180_000 });
  await page.waitForSelector('iframe[src*="ideogram4.hf.space"]', { timeout: 180_000 });
  await page.waitForTimeout(4000);
}

async function conRetry(fn, tentativi = 4, pausaMs = 2500) {
  let ultimo;
  for (let i = 0; i < tentativi; i += 1) {
    try {
      return await fn();
    } catch (e) {
      ultimo = e;
      const msg = e instanceof Error ? e.message : String(e);
      if (!/detached|Target closed|Execution context was destroyed/i.test(msg) || i === tentativi - 1) {
        throw e;
      }
      await new Promise((r) => setTimeout(r, pausaMs));
    }
  }
  throw ultimo;
}

async function apriAdvanced(frame) {
  const visibile = await frame.getByRole('spinbutton', { name: /Width/i }).isVisible().catch(() => false);
  if (!visibile) {
    await frame.getByRole('button', { name: /Advanced/i }).click();
  }
  await frame.getByRole('spinbutton', { name: /Width/i }).waitFor({ timeout: 30_000 });
}

async function impostaNumero(frame, nome, valore) {
  const spin = frame.getByRole('spinbutton', { name: new RegExp(nome, 'i') });
  await spin.click({ clickCount: 3 });
  await spin.fill(String(valore));
  await spin.press('Tab');
}

async function utenteLoggato(context) {
  try {
    const res = await context.request.get('https://huggingface.co/api/whoami-v2');
    if (!res.ok()) return null;
    const data = await res.json();
    return data?.name ?? data?.user ?? null;
  } catch {
    return null;
  }
}

async function attendiLogin(context, log = console.log) {
  log('\n🔐 Accedi nel browser Chromium che si è aperto (finestra separata da Chrome/Edge).');
  log('   Lo script rileva il login in automatico — non serve premere nulla nel terminale.\n');

  for (let i = 0; i < 180; i += 1) {
    const user = await utenteLoggato(context);
    if (user) {
      log(`✓ Login rilevato: ${user}`);
      return user;
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('Timeout login (5 min). Riprova npm run social:ideogram:login');
}

export async function loginIdeogramBrowser(root) {
  const dir = profileDir(root);
  const context = await apriProfilo(dir, false);
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto('https://huggingface.co/login', { waitUntil: 'domcontentloaded' });
  await attendiLogin(context);
  await attendiSpace(page);
  console.log('✓ Space Ideogram aperto con la tua sessione.');
  await context.close();
  console.log('✓ Sessione salvata in social/ideogram/.browser-profile');
}

/**
 * @param {object} opts
 * @param {string} opts.root
 * @param {string} opts.prompt
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {'turbo'|'default'|'quality'} opts.mode
 * @param {boolean} [opts.headless]
 * @param {(msg: string) => void} [opts.log]
 */
export async function generaIdeogramBrowser(opts) {
  const log = opts.log ?? console.log;
  const dir = profileDir(opts.root);
  const headless = opts.headless ?? true;

  if (!existsSync(dir)) {
    throw new Error(
      'Profilo browser HF assente. Esegui prima: npm run social:ideogram:login',
    );
  }

  const context = await apriProfilo(dir, headless);

  try {
    const page = context.pages()[0] ?? (await context.newPage());
    log(`▶ Browser → ${IDEOGRAM_SPACE_HUB}`);
    await attendiSpace(page);

    return await conRetry(async () => {
      const frame = frameLocator(page);
      await frame.getByRole('textbox', { name: /Prompt/i }).waitFor({ timeout: 120_000 });

      log('▶ Imposto prompt e risoluzione…');
      await frame.getByRole('textbox', { name: /Prompt/i }).fill(opts.prompt);

      const mode = modeLabel(opts.mode);
      const radio = frame.getByRole('radio', { name: mode });
      const checked = await radio.getAttribute('aria-checked').catch(() => 'false');
      if (checked !== 'true') await radio.click();

      await apriAdvanced(frame);
      await impostaNumero(frame, 'Width', opts.width);
      await impostaNumero(frame, 'Height', opts.height);

      const imgPrima = await frame.locator('img[src*="file="]').first().getAttribute('src').catch(() => null);

      let nuovaUrl = null;
      const cattura = (response) => {
        const url = response.url();
        const ct = response.headers()['content-type'] ?? '';
        if (response.status() === 200 && ct.startsWith('image/') && /file=|\.webp|\.png/i.test(url)) {
          nuovaUrl = url;
        }
      };
      page.on('response', cattura);
      context.on('response', cattura);

      log('▶ Generate (Quality può richiedere 5–8 min)…');
      await frame.getByRole('button', { name: 'Generate' }).click();

      let src = null;
      for (let t = 0; t < 300; t += 1) {
        await page.waitForTimeout(2000);
        if (nuovaUrl && nuovaUrl !== imgPrima) {
          src = nuovaUrl;
          break;
        }
        const corrente = await frame.locator('img[src*="file="]').first().getAttribute('src').catch(() => null);
        if (corrente && corrente !== imgPrima) {
          src = corrente;
          break;
        }
      }
      page.off('response', cattura);
      context.off('response', cattura);
      if (!src) throw new Error('Timeout generazione — lo space potrebbe essere in coda.');

      const url = src.startsWith('http') ? src : new URL(src, 'https://ideogram-ai-ideogram4.hf.space/').href;
      log(`▶ Download ${opts.width}×${opts.height}…`);
      const res = await context.request.get(url);
      if (!res.ok()) throw new Error(`Download fallito (${res.status}).`);

      const buf = Buffer.from(await res.body());
      const ct = res.headers()['content-type'] ?? '';
      const ext = /\.webp/i.test(url) || ct.includes('webp') ? 'webp' : 'png';
      const mime = ext === 'webp' ? 'image/webp' : 'image/png';
      return { buf, ext, mime, url };
    });
  } finally {
    await context.close();
  }
}
