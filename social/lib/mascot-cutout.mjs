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
  const vf = 'colorkey=0x000000:0.42:0.18,format=rgba';
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
