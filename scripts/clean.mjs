import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const nextDir = path.join(root, '.next');

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('[motogarage] Cartella .next rimossa.');
} else {
  console.log('[motogarage] Nessuna cache .next da rimuovere.');
}
