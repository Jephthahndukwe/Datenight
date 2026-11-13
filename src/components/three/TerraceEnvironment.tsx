import { useMemo } from 'react';
import { BackSide, BufferGeometry, CatmullRomCurve3, Color, ConeGeometry, Float32BufferAttribute, IcosahedronGeometry, PlaneGeometry, SphereGeometry, TubeGeometry, Vector3 } from 'three';
import { faceted, rand, reseed } from './lowpoly';
import { Twinkle } from './Twinkle';
import { glowTexture } from './glow';
import { AdditiveBlending } from 'three';

export const HORIZON = '#d9714f';

/* sky dome: stepped gradient bands, dusk after the sun has gone */
function skyGeometry() {
  const g = new SphereGeometry(110, 28, 18);
  const pos = g.getAttribute('position');
  const stops: [number, string][] = [
    [-1, '#2a1230'], [-0.02, '#7a3038'], [0.0, '#e8895a'], [0.04, '#e07a58'], [0.12, '#b8506a'],
    [0.28, '#7a3a72'], [0.5, '#3e2166'], [1, '#150b33'],
  ];
  const cols: number[] = [];
  const a = new Color();
  const b = new Color();
  for (let i = 0; i < pos.count; i++) {
    const e = pos.getY(i) / 110;
    let k = 0;
    while (k < stops.length - 2 && e > stops[k + 1][0]) k++;
    const [e0, c0] = stops[k];
    const [e1, c1] = stops[k + 1];
    const t = Math.min(1, Math.max(0, (e - e0) / (e1 - e0)));
    a.set(c0); b.set(c1); a.lerp(b, t);
    cols.push(a.r, a.g, a.b);
  }
  g.setAttribute('color', new Float32BufferAttribute(cols, 3));
  return g;
}

function seaGeometry() {
  reseed(5);
  const g = new PlaneGeometry(260, 200, 26, 20);
  g.rotateX(-Math.PI / 2);
  return faceted(g, '#2a2350', 0.07, (_y, x, z) => {
    // brighter toward the horizon glow on the left, a touch darker near the cliff
    const far = Math.min(1, Math.max(0, (-z - 4) / 90));
    const glow = Math.max(0, 1 - Math.abs(x + 25) / 60) * far;
    return 0.75 + far * 0.55 + glow * 0.9;
  });
}

function starPositions() {
  const out: number[] = [];
  for (let i = 0; i < 90; i++) {
    const az = rand() * Math.PI * 2;
    const el = 0.28 + Math.pow(rand(), 0.8) * 0.7;
    const r = 100;
    const y = Math.sin(el * 1.4) * r;
    const rr = Math.cos(el * 1.4) * r;
    out.push(Math.cos(az) * rr, y, Math.sin(az) * rr - 0);
  }
  return out;
}

function seaGlints() {
  const out: number[] = [];
  for (let i = 0; i < 70; i++) {
    const z = -30 - rand() * 80;
    const x = -26 + (rand() - 0.5) * (6 + (-z - 30) * 0.35);
    out.push(x, -5.85, z);
  }
  return out;
}

function windowLights() {
  const out: number[] = [];
  for (let i = 0; i < 46; i++) {
    const x = -70 + rand() * 48;
    const hill = Math.exp(-Math.pow((x + 46) / 18, 2));
    out.push(x, 2 + rand() * (4 + hill * 8), -78 + rand() * 4);
  }
  return out;
}

export function Sky({ motion }: { motion: boolean }) {
  const sky = useMemo(() => skyGeometry(), []);
  const stars = useMemo(() => (reseed(3), starPositions()), []);
  const map = useMemo(() => glowTexture(), []);
  return (
    <group>
      <mesh geometry={sky}>
        <meshBasicMaterial vertexColors side={BackSide} fog={false} depthWrite={false} />
      </mesh>
      <Twinkle positions={stars} color="#fff3dc" size={1.1} speed={1.1} motion={motion} depth={0.6} />
      {/* afterglow where the sun went down */}
      <sprite position={[-34, 6, -100]} scale={[150, 62, 1]}>
        <spriteMaterial map={map} transparent depthWrite={false} blending={AdditiveBlending} opacity={0.75} fog={false} />
      </sprite>
    </group>
  );
}

export function Sea({ motion }: { motion: boolean }) {
  const geo = useMemo(() => seaGeometry(), []);
  const glints = useMemo(() => (reseed(9), seaGlints()), []);
  return (
    <group>
      <mesh geometry={geo} position={[0, -6, -60]}>
        <meshBasicMaterial vertexColors />
      </mesh>
      <Twinkle positions={glints} color="#ffc98a" size={1.6} speed={2.2} motion={motion} depth={0.85} />
    </group>
  );
}

export function Coast({ motion }: { motion: boolean }) {
  const parts = useMemo(() => {
    reseed(21);
    const hills: { geo: BufferGeometry; pos: [number, number, number] }[] = [];
    const tone = ['#3a2145', '#33203f', '#3f2547', '#2e1c3a'];
    for (let i = 0; i < 7; i++) {
      const h = 9 + rand() * 12;
      const g = new ConeGeometry(9 + rand() * 7, h, 6, 1);
      g.translate(0, h / 2, 0);
      hills.push({ geo: faceted(g, tone[i % tone.length], 0.12), pos: [-72 + i * 7.5 + rand() * 4, -6, -80 - rand() * 6] });
    }
    // distant island on the right
    const isle = new IcosahedronGeometry(1, 1);
    isle.scale(30, 7, 8);
    return { hills, isle: faceted(isle, '#3a2850', 0.1), win: windowLights() };
  }, []);
  return (
    <group>
      {parts.hills.map((h, i) => (
        <mesh key={i} geometry={h.geo} position={h.pos}>
          <meshBasicMaterial vertexColors fog />
        </mesh>
      ))}
      <mesh geometry={parts.isle} position={[48, -5.2, -92]}>
        <meshBasicMaterial vertexColors fog />
      </mesh>
      <Twinkle positions={parts.win} color="#ffc872" size={0.9} speed={0.9} motion={motion} depth={0.35} />
    </group>
  );
}

/* terracotta floor with baked checker shading */
export function Terrace() {
  const floor = useMemo(() => {
    reseed(33);
    const g = new PlaneGeometry(14, 8.6, 14, 9);
    g.rotateX(-Math.PI / 2);
    return faceted(g, '#b0603c', 0.07, (_y, x, z) => {
      const ix = Math.floor((x + 7) / 1), iz = Math.floor((z + 4.3) / 0.955);
      return 0.88 + ((ix + iz) % 2) * 0.12;
    });
  }, []);
  return (
    <group>
      <mesh geometry={floor} position={[0, 0, 0.9]}>
        <meshLambertMaterial vertexColors emissive="#3a1a10" />
      </mesh>
      {/* parapet */}
      <mesh position={[0, 0.5, -3.4]}>
        <boxGeometry args={[14, 1, 0.4]} />
        <meshLambertMaterial color="#cfa57a" />
      </mesh>
      <mesh position={[0, 1.04, -3.4]}>
        <boxGeometry args={[14.2, 0.1, 0.56]} />
        <meshLambertMaterial color="#ecd5ae" />
      </mesh>
      {[-6.9, 6.9].map((x) => (
        <mesh key={x} position={[x, 0.75, -3.4]}>
          <boxGeometry args={[0.5, 1.5, 0.55]} />
          <meshLambertMaterial color="#d9b88f" />
        </mesh>
      ))}
      {/* two pots with olive sprigs */}
      {[-2.7, 3.2].map((x, i) => (
        <group key={x} position={[x, 1.09, -3.4]}>
          <mesh position={[0, 0.17, 0]}>
            <cylinderGeometry args={[0.2, 0.14, 0.34, 8]} />
            <meshLambertMaterial color="#b4572f" flatShading />
          </mesh>
          <mesh position={[0, 0.5, 0]} scale={[1, 1.1, 1]}>
            <icosahedronGeometry args={[0.24 + i * 0.04, 0]} />
            <meshLambertMaterial color="#5f6e34" emissive="#2a3315" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function StringLights({ motion }: { motion: boolean }) {
  const data = useMemo(() => {
    const strands = [
      { z: -2.5, y: 3.35, sag: 0.75, span: 4.6 },
      { z: -0.4, y: 3.15, sag: 0.6, span: 4.6 },
    ];
    const bulbs: number[] = [];
    const wires = strands.map((s) => {
      const pts: Vector3[] = [];
      for (let i = 0; i <= 14; i++) {
        const u = (i / 14) * 2 - 1;
        pts.push(new Vector3(u * s.span, s.y - s.sag * (1 - u * u), s.z));
      }
      for (let i = 1; i < 17; i++) {
        const u = (i / 17) * 2 - 1;
        bulbs.push(u * s.span, s.y - s.sag * (1 - u * u) - 0.06, s.z);
      }
      return new TubeGeometry(new CatmullRomCurve3(pts), 36, 0.012, 3, false);
    });
    return { wires, bulbs, posts: [-4.6, 4.6] };
  }, []);
  return (
    <group>
      {data.wires.map((g, i) => (
        <mesh key={i} geometry={g}>
          <meshBasicMaterial color="#1b0d0d" fog={false} />
        </mesh>
      ))}
      {data.posts.flatMap((x) =>
        [-2.5, -0.4].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 1.75, z]}>
            <cylinderGeometry args={[0.045, 0.06, 3.5, 5]} />
            <meshLambertMaterial color="#3a2118" flatShading />
          </mesh>
        )),
      )}
      <Twinkle positions={data.bulbs} color="#ffd48a" size={3.4} speed={1.7} motion={motion} depth={0.3} />
      <Twinkle positions={data.bulbs} color="#fff1cf" size={1.1} speed={1.7} motion={false} depth={0} />
    </group>
  );
}

