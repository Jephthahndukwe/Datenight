import { BufferGeometry, Color, Float32BufferAttribute } from 'three';

let seed = 11;
export const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
export const reseed = (s: number) => { seed = s >>> 0; };

/** Make a geometry flat-shaded with a per-face colour jitter: "baked" low-poly lighting without any textures. */
export function faceted(geo: BufferGeometry, base: string, jitter = 0.08, bake?: (y: number, x: number, z: number) => number) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.getAttribute('position');
  const col = new Float32Array(pos.count * 3);
  const c = new Color();
  const b = new Color(base);
  for (let i = 0; i < pos.count; i += 3) {
    const j = 1 + (rand() - 0.5) * 2 * jitter;
    const cy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const k = bake ? bake(cy, cx, cz) : 1;
    c.copy(b).multiplyScalar(j * k);
    for (let v = 0; v < 3; v++) { col[(i + v) * 3] = c.r; col[(i + v) * 3 + 1] = c.g; col[(i + v) * 3 + 2] = c.b; }
  }
  g.setAttribute('color', new Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}
