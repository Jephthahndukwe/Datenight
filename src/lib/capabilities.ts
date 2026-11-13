/**
 * One-time device sniffing: can we run WebGL, and should we?
 * Add ?3d=0 to the URL to force the static fallback, ?3d=1 to force 3D.
 */
export type Tier = {
  /** WebGL context can be created */
  webgl: boolean;
  /** Low-memory / few-core / data-saver device: use static art instead of 3D */
  lowPower: boolean;
  /** User prefers reduced motion: 3D renders a still frame, no drift or flicker */
  reducedMotion: boolean;
  /** Final decision: render the 3D scenes */
  use3d: boolean;
};

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

let cached: Tier | null = null;

export function getTier(): Tier {
  if (cached) return cached;
  const q = new URLSearchParams(location.search).get('3d');
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const lowPower =
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
    nav.connection?.saveData === true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const webgl = hasWebGL();
  const use3d = q === '0' ? false : q === '1' ? webgl : webgl && !lowPower;
  cached = { webgl, lowPower, reducedMotion, use3d };
  return cached;
}
