/**
 * Alias — tour incluso nello starter kit.
 * npm run social:tour  →  social:starter-kit
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const r = spawnSync('node', ['scripts/generate-starter-kit.mjs'], { cwd: ROOT, stdio: 'inherit' });
process.exit(r.status ?? 1);
