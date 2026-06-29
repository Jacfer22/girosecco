/**
 * Login Hugging Face per Ideogram (salva cookie/sessione locale).
 * npm run social:ideogram:login
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { loginIdeogramBrowser } from './lib/ideogram-browser.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

loginIdeogramBrowser(ROOT).catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
