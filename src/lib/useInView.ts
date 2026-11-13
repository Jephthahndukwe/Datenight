import { useEffect, useRef, useState } from 'react';

/** Boolean in-view hook with a root margin, used to start/stop 3D loops. */
export function useInView<T extends Element>(rootMargin = '0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

/**
 * "Warm" = it is now fine to spend CPU on 3D. True on the first real interaction (tap, scroll, key),
 * or a few seconds after load if she is just reading. Keeps WebGL work out of first paint and out of
 * the critical path, which is what keeps mobile performance scores high.
 */
export function useWarm(delay = 6000) {
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    if (warm) return;
    const on = () => setWarm(true);
    const evs = ['pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'] as const;
    evs.forEach((e) => window.addEventListener(e, on, { passive: true, once: true }));
    let t = 0;
    const arm = () => { t = window.setTimeout(on, delay); };
    if (document.readyState === 'complete') arm();
    else window.addEventListener('load', arm, { once: true });
    return () => {
      evs.forEach((e) => window.removeEventListener(e, on));
      window.removeEventListener('load', arm);
      window.clearTimeout(t);
    };
  }, [warm, delay]);
  return warm;
}
