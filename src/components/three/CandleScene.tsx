import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import type { Group } from 'three';
import { Candle } from './Candle';

type Props = { lit: boolean; motion: boolean; active: boolean; onReady?: () => void };

function Rig({ motion, children }: { motion: boolean; children: React.ReactNode }) {
  const g = useRef<Group>(null);
  useFrame(({ pointer, clock }) => {
    if (!g.current || !motion) return;
    const t = clock.elapsedTime;
    g.current.rotation.y += ((pointer.x * 0.25 + Math.sin(t * 0.3) * 0.05) - g.current.rotation.y) * 0.04;
    g.current.rotation.x += ((-pointer.y * 0.06) - g.current.rotation.x) * 0.04;
  });
  return <group ref={g}>{children}</group>;
}

/** Section 1: a single candle that lights on first tap or scroll. */
export default function CandleScene({ lit, motion, active, onReady }: Props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.6, 6.2], fov: 32 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={active && motion ? 'always' : 'demand'}
      onCreated={() => onReady?.()}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.7} color="#9a6a7a" />
      <directionalLight position={[-3, 4, 2]} intensity={0.35} color="#9a6a8a" />
      <Rig motion={motion}>
        <group position={[0, -1.28, 0]}>
          <Candle lit={lit} motion={motion} scale={0.56} intensity={26} distance={12} />
        </group>
        {lit && motion && (
          <Sparkles count={16} scale={[3.2, 3.6, 2.4]} position={[0, 0.2, 0]} size={2.2} speed={0.25} opacity={0.6} color="#ffd98a" noise={0.6} />
        )}
      </Rig>
    </Canvas>
  );
}
