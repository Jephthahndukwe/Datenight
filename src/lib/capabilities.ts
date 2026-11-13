/** One-time device sniffing for motion decisions. */
export type Tier = {
  /** User prefers reduced motion: no parallax, no Ken Burns, no petals, no smooth scroll */
  reducedMotion: boolean;
  /** Touch-first device (drives tilt-by-orientation and touch fallbacks) */
  coarse: boolean;
};

let cached: Tier | null = null;

export function getTier(): Tier {
  if (cached) return cached;
  cached = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    coarse: window.matchMedia('(pointer: coarse)').matches,
  };
  return cached;
}
