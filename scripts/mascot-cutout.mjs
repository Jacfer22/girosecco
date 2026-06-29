/**
 * Genera PNG mascotte senza sfondo nero in public/mascot/*-cutout.png
 * npm run mascot:cutout
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureMascotCutout } from '../social/lib/mascot-cutout.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILES = ['rosso-sport.png', 'blu-adventure.png', 'nero-cruiser.png'];

for (const f of FILES) {
  const src = join(ROOT, 'public', 'mascot', f);
  const out = ensureMascotCutout(src);
  console.log(`✓ ${out.replace(ROOT + '\\', '').replace(ROOT + '/', '')}`);
}
