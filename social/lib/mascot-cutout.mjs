import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import ffmpegPath from 'ffmpeg-static';

/**
 * Rimuove sfondo nero e alone scuro via colorkey ffmpeg.
 */
export function ensureMascotCutout(srcPath) {
  const cutout = srcPath.replace(/\.png$/i, '-cutout.png');
  if (existsSync(cutout) && existsSync(srcPath)) {
    if (statSync(cutout).mtimeMs >= statSync(srcPath).mtimeMs) return cutout;
  }
  /** Solo pixel quasi neri → alpha 0; preserva rosso/blu/corpo moto */
  const vf =
    "geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lt(r(X,Y)+g(X,Y)+b(X,Y)\\,32)\\,0\\,255)',format=rgba";
  const ok =
    spawnSync(
      ffmpegPath,
      ['-y', '-i', srcPath, '-vf', vf, '-update', '1', '-frames:v', '1', cutout],
      { stdio: 'pipe' },
    ).status === 0;
  if (!ok || !existsSync(cutout)) {
    console.warn(`  ⚠ cutout fallito per ${srcPath}, uso originale`);
    return srcPath;
  }
  return cutout;
}
