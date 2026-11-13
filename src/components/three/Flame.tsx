import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Group, LatheGeometry, PointLight, Sprite, Vector2 } from 'three';
import { glowTexture } from './glow';

type Props = {
  /** whether the flame is burning (animates in/out) */
  lit: boolean;
  /** max point-light intensity */
  intensity?: number;
  /** light reach */
  distance?: number;
  /** false = still frame, no flicker */
  motion?: boolean;
  /** size of the flame mesh */
  scale?: number;
  /** size of the additive halo */
  halo?: number;
};

/** Teardrop flame + soft halo + flickering point light. Everything is driven from one useFrame. */
export function Flame({ lit, intensity = 18, distance = 9, motion = true, scale = 1, halo = 2.4 }: Props) {
  const flame = useRef<Group>(null);
  const glow = useRef<Sprite>(null);
  const light = useRef<PointLight>(null);
  const amt = useRef(lit ? 1 : 0);

  const geo = useMemo(() => {
    const prof: [number, number][] = [
      [0, 0], [0.07, 0.04], [0.11, 0.12], [0.12, 0.22], [0.1, 0.34], [0.065, 0.46], [0.03, 0.56], [0, 0.66],
    ];
    return new LatheGeometry(prof.map(([r, y]) => new Vector2(r, y)), 9);
  }, []);
  const coreGeo = useMemo(() => {
    const prof: [number, number][] = [[0, 0.02], [0.045, 0.06], [0.06, 0.14], [0.045, 0.24], [0, 0.32]];
    return new LatheGeometry(prof.map(([r, y]) => new Vector2(r, y)), 8);
  }, []);
  const map = useMemo(() => glowTexture(), []);

  useFrame(({ clock }, dt) => {
    const target = lit ? 1 : 0;
    // slow, deliberate ignite / snuff
    amt.current += (target - amt.current) * Math.min(1, dt * (lit ? 1.6 : 4));
    const a = amt.current;
    const t = clock.elapsedTime;
    const f = motion ? 1 + Math.sin(t * 13.1) * 0.05 + Math.sin(t * 7.3 + 1.7) * 0.07 + Math.sin(t * 23.7 + 0.4) * 0.025 : 1;
    const sway = motion ? Math.sin(t * 2.1) * 0.05 + Math.sin(t * 5.3) * 0.02 : 0;
    if (flame.current) {
      const s = a * scale;
      flame.current.scale.set(s * (2 - f) * 0.9, s * f * (0.85 + 0.15 * a), s * (2 - f) * 0.9);
      flame.current.rotation.z = sway;
      flame.current.visible = a > 0.01;
    }
    if (glow.current) {
      const g = halo * scale * a * (0.94 + (f - 1) * 1.2);
      glow.current.scale.set(g, g, 1);
      glow.current.material.opacity = Math.min(1, a) * 0.95;
    }
    if (light.current) {
      light.current.intensity = intensity * a * (0.9 + (f - 1) * 2.2);
    }
  });

  return (
    <group>
      <group ref={flame}>
        <mesh geometry={geo}>
          <meshBasicMaterial color="#ffc15a" toneMapped={false} />
        </mesh>
        <mesh geometry={coreGeo} position={[0, 0.02, 0]}>
          <meshBasicMaterial color="#fff3cf" toneMapped={false} />
        </mesh>
      </group>
      <sprite ref={glow} position={[0, 0.3 * scale, 0]}>
        <spriteMaterial map={map} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} opacity={0} />
      </sprite>
      <pointLight ref={light} position={[0, 0.35 * scale, 0]} color="#ffae52" intensity={0} distance={distance} decay={2} />
    </group>
  );
}
