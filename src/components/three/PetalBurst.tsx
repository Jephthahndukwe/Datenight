import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, DoubleSide, InstancedMesh, MathUtils, Object3D, Shape, ShapeGeometry } from 'three';

type Props = {
  /** flip to true when she answers; the canvas idles (no frames) until then */
  play: boolean;
  onDone: () => void;
};

const PETALS = 64;
const HEARTS = 9;
const GRAVITY = -5;
const DRAG = 3.2;

const petalColors = ['#8f0f2c', '#a8142f', '#c42b45', '#d9475c', '#e8808c', '#f4c9c4'];
const heartColors = ['#e0425f', '#f08aa0', '#ecbd62', '#f6d58b'];

function petalGeometry() {
  const s = new Shape();
  s.moveTo(0, -0.2);
  s.bezierCurveTo(0.2, -0.12, 0.2, 0.14, 0.02, 0.2);
  s.bezierCurveTo(-0.03, 0.17, -0.2, 0.12, -0.17, -0.1);
  s.bezierCurveTo(-0.14, -0.18, -0.06, -0.2, 0, -0.2);
  return new ShapeGeometry(s, 6);
}
function heartGeometry() {
  const s = new Shape();
  s.moveTo(0, -0.22);
  s.bezierCurveTo(-0.34, 0.02, -0.2, 0.3, 0, 0.14);
  s.bezierCurveTo(0.2, 0.3, 0.34, 0.02, 0, -0.22);
  return new ShapeGeometry(s, 8);
}

type P = { x: number; y: number; z: number; vx: number; vy: number; vz: number; ph: number; fr: number; sp: number; sp2: number; rx: number; rz: number; delay: number; life: number; size: number };

function Particles({ play, onDone }: Props) {
  const { viewport } = useThree();
  const petals = useRef<InstancedMesh>(null);
  const hearts = useRef<InstancedMesh>(null);
  const t0 = useRef<number | null>(null);
  const done = useRef(false);
  const o = useMemo(() => new Object3D(), []);
  const col = useMemo(() => new Color(), []);
  const pGeo = useMemo(petalGeometry, []);
  const hGeo = useMemo(heartGeometry, []);

  const { ps, hs } = useMemo(() => {
    const w = viewport.width;
    const bottom = -viewport.height / 2 - 0.4;
    const ps: P[] = Array.from({ length: PETALS }, (_, i) => {
      const fromSide = i % 3; // 0 left, 1 right, 2 centre
      const ox = fromSide === 0 ? -w * 0.42 : fromSide === 1 ? w * 0.42 : (Math.random() - 0.5) * w * 0.3;
      const inward = fromSide === 0 ? 1 : fromSide === 1 ? -1 : 0;
      return {
        x: ox, y: bottom + Math.random() * 0.4, z: (Math.random() - 0.5) * 2,
        vx: inward * (1.5 + Math.random() * 3.5) + (Math.random() - 0.5) * 2.5,
        vy: 9 + Math.random() * 10,
        vz: (Math.random() - 0.5) * 2,
        ph: Math.random() * 6.28, fr: 1.6 + Math.random() * 1.6,
        sp: 2 + Math.random() * 4, sp2: 1 + Math.random() * 3,
        rx: Math.random() * 6.28, rz: Math.random() * 6.28,
        delay: Math.random() * 0.7, life: 4.6 + Math.random() * 1.8, size: 0.8 + Math.random() * 0.7,
      };
    });
    const hs: P[] = Array.from({ length: HEARTS }, () => ({
      x: (Math.random() - 0.5) * w * 0.8, y: bottom, z: 0.5 + Math.random(),
      vx: 0, vy: 1.4 + Math.random() * 1.1, vz: 0,
      ph: Math.random() * 6.28, fr: 0.9 + Math.random() * 0.8, sp: 0, sp2: 0, rx: 0, rz: (Math.random() - 0.5) * 0.5,
      delay: 0.25 + Math.random() * 2.0, life: 3.8 + Math.random() * 1.2, size: 0.6 + Math.random() * 0.55,
    }));
    return { ps, hs };
  }, [viewport.width, viewport.height]);

  // hidden until played: start every instance at scale 0 so the pre-warm frame draws nothing
  useEffect(() => {
    o.scale.setScalar(0);
    o.updateMatrix();
    for (let i = 0; i < PETALS; i++) petals.current?.setMatrixAt(i, o.matrix);
    for (let i = 0; i < HEARTS; i++) hearts.current?.setMatrixAt(i, o.matrix);
    petals.current?.setColorAt(0, col.set('#fff'));
    ps.forEach((_, i) => petals.current?.setColorAt(i, col.set(petalColors[i % petalColors.length])));
    hs.forEach((_, i) => hearts.current?.setColorAt(i, col.set(heartColors[i % heartColors.length])));
    if (petals.current?.instanceColor) petals.current.instanceColor.needsUpdate = true;
    if (hearts.current?.instanceColor) hearts.current.instanceColor.needsUpdate = true;
  }, [ps, hs, col, o]);

  useFrame(({ clock }, rawDt) => {
    if (!play || done.current) return;
    const dt = Math.min(rawDt, 1 / 30);
    if (t0.current === null) t0.current = clock.elapsedTime;
    const now = clock.elapsedTime - t0.current;
    let alive = 0;

    ps.forEach((p, i) => {
      const age = now - p.delay;
      if (age < 0) { o.scale.setScalar(0); o.updateMatrix(); petals.current!.setMatrixAt(i, o.matrix); alive++; return; }
      if (age < p.life) {
        // gravity + linear drag + sideways flutter that only matters once the burst has slowed
        const fall = Math.min(1, Math.max(0, -p.vy / 1.2));
        p.vx += (Math.sin(now * p.fr + p.ph) * 2.6 * (0.25 + fall)) * dt;
        p.vy += (GRAVITY - DRAG * p.vy) * dt;
        p.vx -= DRAG * 0.55 * p.vx * dt;
        p.vz -= DRAG * 0.5 * p.vz * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        p.rx += p.sp * dt; p.rz += p.sp2 * dt;
      }
      const alpha = age >= p.life ? 0 : MathUtils.smoothstep(p.life - age, 0, 0.9) * MathUtils.smoothstep(age, 0, 0.12);
      if (age < p.life) alive++;
      o.position.set(p.x, p.y, p.z);
      o.rotation.set(p.rx, Math.sin(now * 1.3 + p.ph) * 0.6, p.rz);
      o.scale.setScalar(p.size * alpha);
      o.updateMatrix();
      petals.current!.setMatrixAt(i, o.matrix);
    });

    hs.forEach((h, i) => {
      const age = now - h.delay;
      let s = 0;
      if (age >= 0 && age < h.life) {
        h.vy += (0.5 - 0.6 * h.vy) * dt;
        h.y += h.vy * dt;
        h.x += Math.sin(now * h.fr + h.ph) * 0.5 * dt;
        s = h.size * MathUtils.smoothstep(age, 0, 0.5) * MathUtils.smoothstep(h.life - age, 0, 0.9);
        alive++;
      } else if (age < 0) alive++;
      o.position.set(h.x, h.y, h.z);
      o.rotation.set(0, Math.sin(now * 0.9 + h.ph) * 0.5, h.rz + Math.sin(now * h.fr + h.ph) * 0.18);
      o.scale.setScalar(s);
      o.updateMatrix();
      hearts.current!.setMatrixAt(i, o.matrix);
    });

    petals.current!.instanceMatrix.needsUpdate = true;
    hearts.current!.instanceMatrix.needsUpdate = true;
    if (alive === 0) { done.current = true; onDone(); }
  });

  return (
    <>
      <instancedMesh ref={petals} args={[pGeo, undefined, PETALS]} frustumCulled={false}>
        <meshBasicMaterial side={DoubleSide} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={hearts} args={[hGeo, undefined, HEARTS]} frustumCulled={false}>
        <meshBasicMaterial side={DoubleSide} toneMapped={false} />
      </instancedMesh>
    </>
  );
}

/** Rose petals and a few hearts with real (tiny) physics: gravity, drag, flutter. Short-lived and self-cleaning. */
export default function PetalBurst(props: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      frameloop={props.play ? 'always' : 'demand'}
      style={{ position: 'fixed', inset: 0, zIndex: 40, pointerEvents: 'none' }}
    >
      <Particles {...props} />
    </Canvas>
  );
}
