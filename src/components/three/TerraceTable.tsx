import { useMemo } from 'react';
import { DoubleSide, LatheGeometry, Vector2 } from 'three';
import { Candle } from './Candle';

const lathe = (pts: [number, number][], seg = 10) => new LatheGeometry(pts.map(([r, y]) => new Vector2(r, y)), seg);

function WineGlass({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const { glass, wine } = useMemo(
    () => ({
      glass: lathe([[0, 0], [0.05, 0], [0.05, 0.006], [0.013, 0.012], [0.009, 0.075], [0.014, 0.088], [0.04, 0.108], [0.054, 0.14], [0.052, 0.17], [0.042, 0.196], [0.038, 0.215]], 10),
      wine: lathe([[0, 0.1], [0.036, 0.112], [0.049, 0.14], [0.047, 0.158], [0, 0.16]], 10),
    }),
    [],
  );
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={1.15}>
      <mesh geometry={wine}>
        <meshLambertMaterial color="#8a1636" emissive="#3a0612" emissiveIntensity={0.9} side={DoubleSide} />
      </mesh>
      <mesh geometry={glass}>
        <meshStandardMaterial color="#e6eeff" transparent opacity={0.3} roughness={0.12} metalness={0.1} side={DoubleSide} depthWrite={false} flatShading />
      </mesh>
    </group>
  );
}

function Chair({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  const color = '#566330';
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      {[[-0.21, -0.21], [0.21, -0.21], [-0.21, 0.21], [0.21, 0.21]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]}>
          <boxGeometry args={[0.045, 0.44, 0.045]} />
          <meshLambertMaterial color="#3a4220" flatShading />
        </mesh>
      ))}
      {[-0.21, 0.21].map((x) => (
        <mesh key={x} position={[x, 0.74, -0.21]}>
          <boxGeometry args={[0.045, 0.56, 0.045]} />
          <meshLambertMaterial color="#3a4220" flatShading />
        </mesh>
      ))}
      {[0.6, 0.78, 0.96].map((y) => (
        <mesh key={y} position={[0, y, -0.21]}>
          <boxGeometry args={[0.42, 0.06, 0.035]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}
    </group>
  );
}

export function TerraceTable({ motion }: { motion: boolean }) {
  const bottle = useMemo(
    () => lathe([[0, 0], [0.04, 0], [0.042, 0.02], [0.042, 0.16], [0.036, 0.2], [0.016, 0.26], [0.014, 0.33], [0.016, 0.345], [0.014, 0.35]], 8),
    [],
  );
  const plate = useMemo(() => lathe([[0, 0.002], [0.12, 0.004], [0.2, 0.02], [0.215, 0.026], [0.2, 0.024], [0.12, 0.012], [0, 0.01]], 12), []);
  return (
    <group>
      {/* cloth */}
      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.72, 0.9, 0.76, 14, 1, true]} />
        <meshLambertMaterial color="#efe3c6" emissive="#7a6a50" emissiveIntensity={0.9} side={DoubleSide} flatShading />
      </mesh>
      <mesh position={[0, 0.762, 0]}>
        <cylinderGeometry args={[0.73, 0.73, 0.024, 14]} />
        <meshLambertMaterial color="#f7eed7" flatShading />
      </mesh>
      {/* wine runner */}
      <mesh position={[0, 0.776, 0]} rotation={[0, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.004, 1.4]} />
        <meshLambertMaterial color="#4a0f22" emissive="#200510" />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} geometry={plate} position={[x, 0.774, 0.12]} scale={0.9}>
          <meshLambertMaterial color="#f6efdc" side={DoubleSide} flatShading />
        </mesh>
      ))}
      <WineGlass position={[-0.2, 0.774, -0.3]} rotation={0.3} />
      <WineGlass position={[0.22, 0.774, -0.27]} rotation={1.2} />
      <mesh geometry={bottle} position={[0.02, 0.774, -0.5]}>
        <meshStandardMaterial color="#17301f" roughness={0.3} metalness={0.2} flatShading />
      </mesh>
      <Candle lit motion={motion} scale={0.25} height={1.7} radius={0.3} position={[0, 0.774, 0.02]} intensity={7} distance={7} />
      <Chair position={[-1.18, 0, 0.05]} rotation={Math.PI / 2 + 0.15} />
      <Chair position={[1.18, 0, 0.05]} rotation={-Math.PI / 2 - 0.15} />
      {/* soft warm fill from the string lights above the table */}
      <pointLight position={[0, 2.7, 0.2]} color="#ffcf8a" intensity={5} distance={9} decay={2} />
    </group>
  );
}
