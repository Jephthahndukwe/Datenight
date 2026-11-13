import { useMemo } from 'react';
import { CylinderGeometry } from 'three';
import { Flame } from './Flame';

type Props = {
  lit: boolean;
  motion?: boolean;
  scale?: number;
  height?: number;
  radius?: number;
  position?: [number, number, number];
  /** brass dish under the candle */
  dish?: boolean;
  intensity?: number;
  distance?: number;
};

/** Low-poly pillar candle: flat-shaded wax, brass dish, wick and a Flame on top. */
export function Candle({ lit, motion = true, scale = 1, height = 1.8, radius = 0.34, position = [0, 0, 0], dish = true, intensity, distance }: Props) {
  const wax = useMemo(() => new CylinderGeometry(radius * 0.96, radius, height, 10, 1), [radius, height]);
  return (
    <group position={position} scale={scale}>
      {dish && (
        <group>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[radius * 2.1, radius * 1.7, 0.1, 12]} />
            <meshStandardMaterial color="#b8862f" metalness={0.8} roughness={0.38} flatShading />
          </mesh>
          <mesh position={[0, 0.115, 0]}>
            <cylinderGeometry args={[radius * 1.55, radius * 1.7, 0.04, 12]} />
            <meshStandardMaterial color="#d9a441" metalness={0.85} roughness={0.3} flatShading />
          </mesh>
        </group>
      )}
      <mesh geometry={wax} position={[0, height / 2 + 0.14, 0]}>
        <meshStandardMaterial color="#f1e4c6" roughness={0.75} flatShading emissive="#c89a5a" emissiveIntensity={lit ? 0.5 : 0.06} />
      </mesh>
      {/* wax drip */}
      <mesh position={[radius * 0.9, height * 0.8 + 0.14, 0.05]} scale={[0.5, 1.6, 0.5]}>
        <icosahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial color="#efe0bd" roughness={0.8} flatShading />
      </mesh>
      {/* top wax pool + wick */}
      <mesh position={[0, height + 0.145, 0]}>
        <cylinderGeometry args={[radius * 0.8, radius * 0.9, 0.03, 10]} />
        <meshStandardMaterial color="#fff3d2" emissive="#ffb050" emissiveIntensity={lit ? 0.8 : 0} roughness={0.5} />
      </mesh>
      <mesh position={[0, height + 0.22, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 4]} />
        <meshBasicMaterial color="#1a0d08" />
      </mesh>
      <group position={[0, height + 0.18, 0]}>
        <Flame lit={lit} motion={motion} intensity={intensity} distance={distance} />
      </group>
    </group>
  );
}
