import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextDir = path.join(root, '.next');

// Evita build mentre .next è in uso da dev (causa la corruzione CSS/chunk).
if (fs.existsSync(nextDir) && !fs.existsSync(path.join(nextDir, 'BUILD_ID'))) {
  console.warn(
    '[motogarage] Attenzione: sembra esserci una cache dev attiva in .next.\n'
    + 'Chiudi `npm run dev` prima di `npm run build`, altrimenti al prossimo avvio dev verrà pulita automaticamente.',
  );
}

const child = spawn('npx', ['next', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
