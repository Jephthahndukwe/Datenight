import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '../config/site';

/** Ambient music: created lazily on the first tap (never autoplays), fades in/out, loops. */
export function useMusic() {
  const el = useRef<HTMLAudioElement | null>(null);
  const raf = useRef(0);
  const [playing, setPlaying] = useState(false);

  const fade = useCallback((to: number, ms: number, done?: () => void) => {
    cancelAnimationFrame(raf.current);
    const a = el.current;
    if (!a) return;
    const from = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) raf.current = requestAnimationFrame(step);
      else done?.();
    };
    raf.current = requestAnimationFrame(step);
  }, []);

  const toggle = useCallback(async () => {
    if (!el.current) {
      const a = new Audio(site.music.src);
      a.loop = true;
      a.preload = 'auto';
      a.volume = 0;
      el.current = a;
    }
    const a = el.current;
    if (a.paused) {
      try {
        await a.play();
        setPlaying(true);
        fade(site.music.volume, 2200);
      } catch {
        setPlaying(false);
      }
    } else {
      setPlaying(false);
      fade(0, 700, () => a.pause());
    }
  }, [fade]);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    el.current?.pause();
  }, []);

  return { playing, toggle };
}
