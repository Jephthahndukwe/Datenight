import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Color, DoubleSide, Group, InstancedMesh, Object3D, Shape, ShapeGeometry, TubeGeometry, Vector3 } from 'three';
import { rand, reseed } from './lowpoly';

function leafGeometry() {
  const s = new Shape();
  s.moveTo(0, 0);
  s.quadraticCurveTo(0.075, 0.1, 0, 0.27);
  s.quadraticCurveTo(-0.075, 0.1, 0, 0);
  return new ShapeGeometry(s, 5);
}

/** Foreground lemon sprig that hangs in the corner of the frame and sways slowly. */
export function LemonBranch({ motion }: { motion: boolean }) {
  const root = useRef<Group>(null);
  const leaves = useRef<InstancedMesh>(null);
  const data = useMemo(() => {
    reseed(77);
    const curve = new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0.28, 0.04, 0), new Vector3(0.55, -0.08, 0.04), new Vector3(0.82, -0.26, 0.02), new Vector3(1.05, -0.5, 0.06)]);
    const stem = new TubeGeometry(curve, 16, 0.009, 4, false);
    const lemons = [0.42, 0.68, 0.92].map((t, i) => ({ p: curve.getPoint(t), s: 0.075 - i * 0.006 }));
    const leafXf = Array.from({ length: 26 }, (_, i) => {
      const t = 0.1 + (i / 26) * 0.9;
      const p = curve.getPoint(t);
      const side = i % 2 ? 1 : -1;
      return { p, rz: side * (0.9 + rand() * 1.0) + (side > 0 ? 0 : Math.PI), ry: (rand() - 0.5) * 0.9, s: 0.7 + rand() * 0.6 };
    });
    return { stem, lemons, leafXf, leafGeo: leafGeometry() };
  }, []);

  useLayoutEffect(() => {
    const m = leaves.current;
    if (!m) return;
    const o = new Object3D();
    const c = new Color();
    data.leafXf.forEach((l, i) => {
      o.position.copy(l.p);
      o.rotation.set(0.5 + rand() * 0.4, l.ry, l.rz);
      o.scale.setScalar(l.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.set(i % 3 === 0 ? '#7f9341' : i % 3 === 1 ? '#5c6e2c' : '#6b7a3a'));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame(({ clock }) => {
    if (!root.current || !motion) return;
    const t = clock.elapsedTime;
    root.current.rotation.z = -0.1 + Math.sin(t * 0.55) * 0.02;
    root.current.rotation.x = Math.sin(t * 0.4 + 1) * 0.015;
  });

  return (
    <group ref={root} rotation={[0, 0, -0.1]}>
      <mesh geometry={data.stem}>
        <meshLambertMaterial color="#4a3320" emissive="#20140a" />
      </mesh>
      <instancedMesh ref={leaves} args={[data.leafGeo, undefined, data.leafXf.length]} frustumCulled={false}>
        <meshLambertMaterial side={DoubleSide} emissive="#5a6e2c" emissiveIntensity={0.75} flatShading />
      </instancedMesh>
      {data.lemons.map((l, i) => (
        <group key={i} position={[l.p.x, l.p.y - l.s * 1.1, l.p.z]}>
          <mesh scale={[l.s, l.s * 1.18, l.s]} rotation={[0, 0, 0.18]}>
            <icosahedronGeometry args={[1, 1]} />
            <meshLambertMaterial color="#ffe45a" emissive="#c2a020" emissiveIntensity={0.9} flatShading />
          </mesh>
          <mesh position={[0, l.s * 1.28, 0]}>
            <cylinderGeometry args={[0.004, 0.008, l.s * 0.5, 4]} />
            <meshLambertMaterial color="#4a3320" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
