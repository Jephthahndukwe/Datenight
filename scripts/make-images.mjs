/**
 * Downloads the Unsplash photos listed in scripts/images.json, applies one shared
 * warm colour grade (burgundy shadows, golden highlights, a breath of film grain),
 * and writes mobile-sized WebP files to public/img/.
 *
 * Run: npm run images
 * To swap a photo: change its "photo" id in images.json (the part after images.unsplash.com/), re-run.
 */
import sharp from 'sharp';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomFillSync } from 'node:crypto';

const root = resolve(import.meta.dirname, '..');
const cfg = JSON.parse(await readFile(resolve(root, 'scripts/images.json'), 'utf8'));
const cache = resolve(root, 'scripts/.cache');
const out = resolve(root, 'public/img');
await mkdir(cache, { recursive: true });
await mkdir(out, { recursive: true });

async function download(name, photo) {
  const file = resolve(cache, `${name}.jpg`);
  try { await stat(file); return file; } catch { /* fetch */ }
  const res = await fetch(`https://images.unsplash.com/${photo}?w=1600&q=85&fm=jpg&fit=max`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

/** Luminance-only grain, tiny amplitude. Centred on mid-grey so soft-light leaves the average tone alone. */
function grain(w, h, amp = 7) {
  const rnd = Buffer.alloc(w * h);
  randomFillSync(rnd);
  const px = Buffer.alloc(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    const v = 128 + ((rnd[i] - 128) * amp) / 128;
    px[i * 3] = px[i * 3 + 1] = px[i * 3 + 2] = v;
  }
  return sharp(px, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
}

for (const img of cfg.images) {
  const src = await download(img.name, img.photo);
  for (const w of cfg.widths) {
    const base = sharp(src).rotate().resize({ width: w, withoutEnlargement: true });
    const { data, info } = await base
      // one grade for every photo: lift blacks toward burgundy, pull blue out of the highlights
      .modulate({ saturation: 0.94, brightness: 0.97 })
      .linear([1.03, 0.94, 0.8], [22, 4, 14])
      .gamma(1.08)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const g = await grain(info.width, info.height, 9);
    const file = resolve(out, `${img.name}-${w}.webp`);
    await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
      .composite([{ input: g, blend: 'soft-light' }])
      .webp({ quality: 66, effort: 5 })
      .toFile(file);
    console.log(`${img.name}-${w}.webp  ${info.width}x${info.height}  ${((await stat(file)).size / 1024).toFixed(0)} KB`);
  }
}
