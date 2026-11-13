import { useCallback, useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

type OrientationEventCtor = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

/**
 * Gentle tilt (degrees) that follows the phone's orientation.
 * - Android / desktop: starts listening straight away (no permission needed).
 * - iOS: needs a user gesture; call `request()` from a tap. If it is declined or unsupported,
 *   `status` becomes 'denied' / 'unsupported' and callers fall back to scroll + pointer tilt.
 * Springs keep every movement slow and soft.
 */
export function useOrientationTilt(enabled: boolean) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 40, damping: 18, mass: 1 });
  const y = useSpring(ry, { stiffness: 40, damping: 18, mass: 1 });
  const base = useRef<{ b: number; g: number } | null>(null);
  const listening = useRef(false);
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied' | 'unsupported'>('idle');

  const onOrient = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    if (!base.current) base.current = { b: e.beta, g: e.gamma };
    rx.set(clamp((e.beta - base.current.b) * -0.28, 9));
    ry.set(clamp((e.gamma - base.current.g) * 0.28, 9));
  }, [rx, ry]);

  const start = useCallback(() => {
    if (listening.current) return;
    listening.current = true;
    window.addEventListener('deviceorientation', onOrient, { passive: true });
    setStatus('granted');
  }, [onOrient]);

  const request = useCallback(async () => {
    const DOE = (window as unknown as { DeviceOrientationEvent?: OrientationEventCtor }).DeviceOrientationEvent;
    if (!DOE) { setStatus('unsupported'); return; }
    if (typeof DOE.requestPermission === 'function') {
      try {
        const r = await DOE.requestPermission();
        if (r === 'granted') start(); else setStatus('denied');
      } catch { setStatus('denied'); }
    } else {
      start();
    }
  }, [start]);

  useEffect(() => {
    if (!enabled) return;
    const DOE = (window as unknown as { DeviceOrientationEvent?: OrientationEventCtor }).DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission !== 'function') start(); // Android: no permission prompt
    return () => {
      window.removeEventListener('deviceorientation', onOrient);
      listening.current = false;
    };
  }, [enabled, start, onOrient]);

  return { x: x as MotionValue<number>, y: y as MotionValue<number>, status, request };
}
