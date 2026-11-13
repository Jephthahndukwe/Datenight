import { CanvasTexture, SRGBColorSpace } from 'three';

let tex: CanvasTexture | null = null;

/** Soft radial gradient used for flame glow. Created once, shared. */
export function glowTexture() {
  if (tex) return tex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,230,160,1)');
  grad.addColorStop(0.18, 'rgba(255,196,96,0.55)');
  grad.addColorStop(0.5, 'rgba(255,150,60,0.14)');
  grad.addColorStop(1, 'rgba(255,120,40,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}
