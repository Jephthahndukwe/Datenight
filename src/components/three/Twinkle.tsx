import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial, Color } from 'three';

type Props = {
  positions: number[];
  color: string;
  size: number;
  speed?: number;
  motion: boolean;
  /** 0..1 — how deep the twinkle goes */
  depth?: number;
  fog?: boolean;
};

const vert = /* glsl */ `
  attribute float aPhase;
  uniform float uSize; uniform float uPx;
  varying float vPhase;
  void main() {
    vPhase = aPhase;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPx * (30.0 / max(0.5, -mv.z));
    gl_Position = projectionMatrix * mv;
  }
`;
const frag = /* glsl */ `
  uniform vec3 uColor; uniform float uTime; uniform float uSpeed; uniform float uDepth;
  varying float vPhase;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    float tw = 1.0 - uDepth + uDepth * (0.5 + 0.5 * sin(uTime * uSpeed + vPhase));
    gl_FragColor = vec4(uColor, a * tw);
  }
`;

/** Many glowing dots in a single draw call (stars, string lights, distant windows, sea glints). */
export function Twinkle({ positions, color, size, speed = 1.4, motion, depth = 0.5 }: Props) {
  const gl = useThree((s) => s.gl);
  const mat = useRef<ShaderMaterial>(null);
  const geo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(positions, 3));
    const n = positions.length / 3;
    g.setAttribute('aPhase', new Float32BufferAttribute(Array.from({ length: n }, () => Math.random() * 6.28), 1));
    return g;
  }, [positions]);
  const uniforms = useMemo(
    () => ({ uColor: { value: new Color(color) }, uSize: { value: size }, uPx: { value: Math.min(gl.getPixelRatio(), 1.5) }, uTime: { value: 0 }, uSpeed: { value: speed }, uDepth: { value: motion ? depth : 0 } }),
    [color, size, speed, gl, motion, depth],
  );
  useFrame(({ clock }) => {
    if (mat.current && motion) mat.current.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} blending={AdditiveBlending} />
    </points>
  );
}
