/**
 * Rose-petal burst on a plain 2D canvas. A few dozen petals with gravity, air drag and
 * a slow flutter, then it removes itself. No libraries, no per-frame allocation.
 */
type Petal = {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; flip: number; vf: number;
  size: number; color: string; phase: number; sway: number; delay: number; life: number;
};

const COLORS = ['#8f0f2c', '#a8142f', '#c42b45', '#d9475c', '#e8808c', '#f4c9c4'];

export function burstPetals(onDone: () => void): () => void {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '65' });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); onDone(); return () => {}; }
  ctx.scale(dpr, dpr);

  const unit = Math.max(0.8, Math.min(1.4, W / 375));
  const N = 54;
  const petals: Petal[] = Array.from({ length: N }, (_, i) => {
    const side = i % 3; // left, right, centre
    const x = side === 0 ? W * 0.06 : side === 1 ? W * 0.94 : W * (0.35 + Math.random() * 0.3);
    const inward = side === 0 ? 1 : side === 1 ? -1 : 0;
    return {
      x, y: H + 20 + Math.random() * 30,
      vx: inward * (60 + Math.random() * 200) + (Math.random() - 0.5) * 120,
      vy: -(H * (0.9 + Math.random() * 0.9)),
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 3,
      flip: Math.random() * 6.28, vf: 2 + Math.random() * 3,
      size: (8 + Math.random() * 8) * unit,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      phase: Math.random() * 6.28, sway: 30 + Math.random() * 50,
      delay: Math.random() * 0.45, life: 5 + Math.random() * 1.8,
    };
  });

  const G = 380; // px/s²
  const DRAG = 1.9;
  let t0 = 0;
  let last = 0;
  let raf = 0;
  let stopped = false;

  const draw = (p: Petal, a: number) => {
    const s = p.size;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.cos(p.flip) * 0.85 + 0.15 * Math.sign(Math.cos(p.flip) || 1), 1);
    ctx.globalAlpha = a;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.8, s * 0.75, 0, s);
    ctx.bezierCurveTo(-s * 0.8, s * 0.75, -s * 0.95, -s * 0.55, 0, -s);
    ctx.fill();
    // a soft highlight so each petal reads as satin, not a flat shape
    ctx.globalAlpha = a * 0.22;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-s * 0.18, -s * 0.25, s * 0.18, s * 0.45, 0.3, 0, 6.28);
    ctx.fill();
    ctx.restore();
  };

  const frame = (now: number) => {
    if (stopped) return;
    if (!t0) { t0 = now; last = now; }
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    for (const p of petals) {
      const age = t - p.delay;
      if (age < 0) { alive++; continue; }
      if (age > p.life) continue;
      alive++;
      const falling = p.vy > 0 ? Math.min(1, p.vy / 120) : 0;
      p.vx += Math.sin(t * 1.7 + p.phase) * p.sway * (0.3 + falling) * dt * 2;
      p.vy += (G - DRAG * p.vy) * dt;
      p.vx -= DRAG * 0.7 * p.vx * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      const fadeIn = Math.min(1, age / 0.15);
      const fadeOut = Math.min(1, (p.life - age) / 1.2);
      draw(p, Math.max(0, Math.min(fadeIn, fadeOut)));
    }
    if (alive === 0) { stop(); onDone(); return; }
    raf = requestAnimationFrame(frame);
  };

  function stop() {
    stopped = true;
    cancelAnimationFrame(raf);
    canvas.remove();
  }
  raf = requestAnimationFrame(frame);
  return stop;
}
