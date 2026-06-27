/**
 * Voiceover prima del video: la durata scena segue l'audio, mai tagliato.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ffmpegPath from 'ffmpeg-static';
import { APP_TOUR_SCENES, TRANSITION_SEC } from './tour-app-video.mjs';
import { MASCOT_VOICES, SCENE_VOICE_LINES } from './tour-voices.mjs';

export { TRANSITION_SEC };
export const PAUSE_AFTER_VOICE = 0.3;

function ff(args) {
  const r = spawnSync(ffmpegPath, args, { stdio: 'inherit', shell: false });
  return r.status === 0;
}

async function edgeTts(voice, text, outPath, rate) {
  const attempts = [
    { voice, rate },
    { voice: 'it-IT-DiegoNeural', rate: rate ?? '+0%' },
  ];
  let lastErr;
  for (const attempt of attempts) {
    const args = ['-m', 'edge_tts', '--voice', attempt.voice, '--text', text, '--write-media', outPath];
    if (attempt.rate) args.push('--rate', attempt.rate);
    const r = spawnSync('python', args, { stdio: 'pipe', shell: false, encoding: 'utf8' });
    if (r.status === 0 && existsSync(outPath)) return;
    lastErr = r.stderr || r.stdout || `status ${r.status}`;
    await new Promise((res) => setTimeout(res, 600));
  }
  throw new Error(`edge-tts fallito: ${outPath}\n${lastErr}`);
}

function probeDuration(path) {
  const r = spawnSync(ffmpegPath, ['-i', path, '-f', 'null', '-'], { encoding: 'utf8' });
  const m = (r.stderr || '').match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]);
}

function masterVoice(input, output) {
  return ff([
    '-y', '-i', input,
    '-af', 'afftdn=nf=-25,highpass=f=80,equalizer=f=3000:t=o:w=1000:g=3,acompressor=threshold=0.1:ratio=3:attack=5:release=50:makeup=1.5,loudnorm=I=-14:TP=-1.0:LRA=11',
    output,
  ]);
}

function silenceMp3(seconds, output) {
  return ff([
    '-y', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono',
    '-t', String(seconds), '-c:a', 'libmp3lame', '-b:a', '128k', output,
  ]);
}

/**
 * Genera tutti i dialoghi e restituisce durata per scena (audio guida il montaggio).
 */
export async function planTourAudio(workDir) {
  mkdirSync(workDir, { recursive: true });
  const plan = [];
  const concatParts = [];

  for (let i = 0; i < APP_TOUR_SCENES.length; i++) {
    const scene = APP_TOUR_SCENES[i];
    const line = SCENE_VOICE_LINES[scene.id];
    if (!line) continue;

    const cfg = MASCOT_VOICES[line.mascot];
    const rate = line.rate ?? cfg.rate;
    const raw = join(workDir, `${scene.id}-raw.mp3`);
    const mastered = join(workDir, `${scene.id}-master.mp3`);
    const sceneAudio = join(workDir, `${scene.id}-scene.mp3`);

    console.log(`  🎙 ${scene.id} — ${line.mascot} (${cfg.voice})`);
    await edgeTts(cfg.voice, line.text, raw, rate);
    masterVoice(raw, mastered);

    const voiceDur = probeDuration(mastered);
    const durationSec = voiceDur + PAUSE_AFTER_VOICE;

    // Solo padding se serve — mai troncare
    ff(['-y', '-i', mastered, '-af', `apad=pad_dur=${durationSec}`, sceneAudio]);

    const actual = probeDuration(sceneAudio) || durationSec;
    plan.push({ id: scene.id, durationSec: actual, mascot: line.mascot });
    concatParts.push(sceneAudio);

    if (i < APP_TOUR_SCENES.length - 1) {
      const gap = join(workDir, `gap-${i}.mp3`);
      silenceMp3(TRANSITION_SEC, gap);
      concatParts.push(gap);
    }
  }

  const listFile = join(workDir, 'voice-full.txt');
  writeFileSync(listFile, concatParts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  const voiceover = join(workDir, 'voiceover-full.mp3');
  if (!ff(['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', voiceover])) {
    throw new Error('Concat voiceover fallita');
  }

  const totalSec = plan.reduce((s, p) => s + p.durationSec, 0) + TRANSITION_SEC * (plan.length - 1);
  console.log(`  ✓ Audio totale: ${totalSec.toFixed(1)}s (${plan.length} scene + transizioni)\n`);

  return { plan, voiceover, totalSec };
}

export function muxVideoAudio(videoPath, audioPath, outPath) {
  return ff([
    '-y', '-i', videoPath, '-i', audioPath,
    '-c:v', 'libx264', '-crf', '22', '-preset', 'medium',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart',
    '-map', '0:v:0', '-map', '1:a:0',
    '-shortest',
    outPath,
  ]);
}

export function extractThumbnail(videoPath, outPath, atSec = 4) {
  return ff(['-y', '-ss', String(atSec), '-i', videoPath, '-frames:v', '1', '-q:v', '2', outPath]);
}
