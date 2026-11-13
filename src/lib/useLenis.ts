import { useEffect } from 'react';
import Lenis from 'lenis';

/** Smooth scrolling for pointer devices. Touch keeps native momentum (Lenis default), which feels best on Android. */
export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.9 });
    return () => lenis.destroy();
  }, [enabled]);
}
