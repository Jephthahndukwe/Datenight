/**
 * Synthesises a short, loopable "fingerpicked guitar" track (Karplus-Strong plucks,
 * 6/8 fingerpicking over Am Dm G C F Dm E7 Am) and encodes it to public/audio/dinner.mp3.
 * It's original, so it's royalty-free by construction. To use a real track instead,
 * just overwrite public/audio/dinner.mp3 (and keep the same name or edit config/site.ts).
 *
 * Run: npm run music   (needs ffmpeg on PATH)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SR = 32000;
const EIGHTH = 0.3; // seconds
const BAR = EIGHTH * 6;
const CHORDS = [
  { root: 45, notes: [57, 60, 64] }, // Am
  { root: 50, notes: [57, 62, 65] }, // Dm
  { root: 43, notes: [55, 59, 62] }, // G
  { root: 48, notes: [55, 60, 64] }, // C
  { root: 41, notes: [53, 57, 60] }, // F
  { root: 50, notes: [57, 62, 65] }, // Dm
  { root: 40, notes: [56, 59, 62] }, // E7
  { root: 45, notes: [57, 60, 64] }, // Am
];
const BARS_PER_CHORD = 2;
const PASSES = 2;
const TOTAL = CHORDS.length * BARS_PER_CHORD * PASSES * BAR;
const TAIL = 4;
const N = Math.ceil((TOTAL + TAIL) * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);

let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

function pluck(t, midi, vel, pan, decay = 0.9965, bright = 0.5) {
  const f = hz(midi);
  const len = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(len);
  let prev = 0;
  for (let i = 0; i < len; i++) {
    const x = rnd() * 2 - 1;
    prev = prev + bright * (x - prev); // pre-filtered noise burst = warmer pluck
    buf[i] = prev;
  }
  const start = Math.floor(t * SR);
  const dur = Math.min(N - start, Math.floor(3.2 * SR));
  let idx = 0;
  let last = 0;
  const gl = Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < dur; i++) {
    const cur = buf[idx];
    const next = buf[(idx + 1) % len];
    const v = (cur + next) * 0.5 * decay;
    buf[idx] = v;
    idx = (idx + 1) % len;
    const env = i < 40 ? i / 40 : 1;
    const s = cur * vel * env;
    last = s;
    L[start + i] += s * gl;
    R[start + i] += s * gr;
  }
  return last;
}

// melody: a lazy pentatonic-ish line that lands on chord tones
const MEL = [76, 74, 72, 69, 72, 74, 76, 79, 77, 76, 74, 72];
let mi = 0;

let bar = 0;
for (let pass = 0; pass < PASSES; pass++) {
  for (const ch of CHORDS) {
    for (let b = 0; b < BARS_PER_CHORD; b++, bar++) {
      const t0 = bar * BAR;
      const [n1, n2, n3] = ch.notes;
      const pat = [ch.root, n1, n2, n3, n2, n1];
      pat.forEach((m, k) => {
        const swing = (rnd() - 0.5) * 0.012;
        const vel = (k === 0 ? 0.42 : 0.26) * (0.9 + rnd() * 0.2);
        pluck(t0 + k * EIGHTH + swing, m, vel, k === 0 ? -0.15 : -0.35 + k * 0.1, k === 0 ? 0.998 : 0.9965);
      });
      // second pass gets a gentle melody on top
      if (pass === 1 && (b === 0 || (b === 1 && rnd() > 0.35))) {
        const m = MEL[mi++ % MEL.length];
        pluck(t0 + (b === 0 ? 0 : 3) * EIGHTH + 0.01, m - (ch.root === 40 ? 1 : 0), 0.3, 0.35, 0.9972, 0.7);
        if (rnd() > 0.5) pluck(t0 + 4.5 * EIGHTH, MEL[mi++ % MEL.length], 0.22, 0.4, 0.997, 0.7);
      }
    }
  }
}

// fold the tail onto the start so the loop is seamless
const loopN = Math.floor(TOTAL * SR);
for (let i = loopN; i < N; i++) {
  L[i - loopN] += L[i];
  R[i - loopN] += R[i];
}

// normalise
let peak = 0;
for (let i = 0; i < loopN; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.85 / peak;

const pcm = Buffer.alloc(loopN * 4);
for (let i = 0; i < loopN; i++) {
  pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(L[i] * g * 32767))), i * 4);
  pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(R[i] * g * 32767))), i * 4 + 2);
}
const hdr = Buffer.alloc(44);
hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write('WAVEfmt ', 8);
hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22);
hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34);
hdr.write('data', 36); hdr.writeUInt32LE(pcm.length, 40);

const wav = join(tmpdir(), 'dinner-raw.wav');
writeFileSync(wav, Buffer.concat([hdr, pcm]));
mkdirSync('public/audio', { recursive: true });
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', wav,
  '-af', 'lowpass=f=5200,aecho=0.8:0.6:70|140|260:0.28|0.2|0.12,volume=0.9',
  '-codec:a', 'libmp3lame', '-b:a', '96k', 'public/audio/dinner.mp3']);
console.log(`wrote public/audio/dinner.mp3 (${TOTAL.toFixed(1)}s loop)`);
