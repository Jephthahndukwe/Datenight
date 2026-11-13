import { useRef, useState, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Fog, Group, MathUtils, Vector3 } from 'three';
import { Coast, HORIZON, Sea, Sky, StringLights, Terrace } from './TerraceEnvironment';
import { TerraceTable } from './TerraceTable';
import { LemonBranch } from './LemonBranch';

type Props = { progress: MutableRefObject<number>; motion: boolean; active: boolean; onReady?: () => void };

const A = { pos: new Vector3(0.5, 1.95, 6.6), look: new Vector3(0, 1.25, -4) };
const B = { pos: new Vector3(0.1, 1.28, 2.15), look: new Vector3(0, 0.86, 0) };
const tmpP = new Vector3();
const tmpL = new Vector3();
const ease = (t: number) => t * t * (3 - 2 * t);

/** Scroll-driven camera: eases from a wide dusk view to a close table shot, plus a slow idle drift. */
function Rig({ progress, motion }: { progress: MutableRefObject<number>; motion: boolean }) {
  const { camera, size } = useThree();
  const smooth = useRef(motion ? 0 : 0.8);
  const fg = useRef<Group>(null);
  const look = useRef(new Vector3());

  useFrame(({ clock }, dt) => {
    const target = motion ? progress.current : 0.8;
    smooth.current += (target - smooth.current) * (1 - Math.exp(-3.2 * dt));
    const p = ease(MathUtils.clamp(smooth.current, 0, 1));
    const aspect = size.width / size.height;
    // portrait phones need more distance to keep the table in frame
    const back = aspect < 1 ? 1 + (1 - aspect) * 0.95 : 1;
    tmpP.lerpVectors(A.pos, B.pos, p);
    tmpP.z *= back;
    tmpL.lerpVectors(A.look, B.look, p);
    if (aspect < 1) tmpL.y += (1 - aspect) * 0.1 * p;
    else if (aspect > 1.2) tmpL.y -= Math.min(0.7, (aspect - 1.2) * 1.2) * (0.5 + 0.5 * p);
    if (motion) {
      const t = clock.elapsedTime;
      tmpP.x += Math.sin(t * 0.21) * 0.1;
      tmpP.y += Math.sin(t * 0.17 + 1) * 0.035;
    }
    camera.position.copy(tmpP);
    look.current.copy(tmpL);
    camera.lookAt(look.current);

    // foreground lemon sprig stays glued to the top-left of the view and grows as we move in
    if (fg.current) {
      const cam = camera as typeof camera & { fov: number };
      const d = MathUtils.lerp(2.35, 1.45, p);
      const halfH = Math.tan(MathUtils.degToRad(cam.fov / 2)) * d;
      fg.current.position.copy(camera.position);
      fg.current.quaternion.copy(camera.quaternion);
      fg.current.translateX(-halfH * aspect * 1.02);
      fg.current.translateY(halfH * 0.93);
      fg.current.translateZ(-d);
      fg.current.scale.setScalar(Math.max(0.5, Math.min(0.85, halfH * 0.8)));
    }
  });

  return (
    <group ref={fg}>
      <LemonBranch motion={motion} />
    </group>
  );
}

/** Section 2: low-poly terrace at dusk. One focal element: the table for two. */
export default function TerraceScene({ progress, motion, active, onReady }: Props) {
  const [dpr, setDpr] = useState(1.5);
  return (
    <Canvas
      dpr={[1, dpr]}
      camera={{ position: [0.5, 1.95, 6.6], fov: 48, near: 0.1, far: 400 }}
      gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
      frameloop={active && motion ? 'always' : 'demand'}
      onCreated={({ scene }) => {
        scene.fog = new Fog(HORIZON, 30, 150);
        onReady?.();
      }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <color attach="background" args={['#2a1230']} />
      <hemisphereLight args={['#a06a96', '#6a3420', 0.9]} />
      <Sky motion={motion} />
      <Sea motion={motion} />
      <Coast motion={motion} />
      <Terrace />
      <StringLights motion={motion} />
      <TerraceTable motion={motion} />
      <Rig progress={progress} motion={motion} />
    </Canvas>
  );
}
