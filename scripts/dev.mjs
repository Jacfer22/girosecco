import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextDir = path.join(root, '.next');

function rimuoviNext() {
  if (!fs.existsSync(nextDir)) return false;
  fs.rmSync(nextDir, { recursive: true, force: true });
  return true;
}

function cacheCorrotta() {
  if (!fs.existsSync(nextDir)) return false;

  // Dopo `next build` resta BUILD_ID: `next dev` sopra quella cache rompe CSS/chunk.
  if (fs.existsSync(path.join(nextDir, 'BUILD_ID'))) {
    return true;
  }

  const manifest = path.join(nextDir, 'routes-manifest.json');
  const buildManifest = path.join(nextDir, 'build-manifest.json');
  if (fs.existsSync(nextDir) && (!fs.existsSync(manifest) || !fs.existsSync(buildManifest))) {
    return true;
  }

  return false;
}

if (cacheCorrotta()) {
  console.log('[motogarage] Cache .next incompatibile: pulizia automatica…');
  rimuoviNext();
}

const child = spawn('npx', ['next', 'dev'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
