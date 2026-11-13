import { useCallback, useEffect, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { site } from './config/site';
import { getTier } from './lib/capabilities';
import { useLenis } from './lib/useLenis';
import { useWarm } from './lib/useInView';
import { Overlays } from './components/ui/Overlays';
import { MusicToggle } from './components/ui/MusicToggle';
import { Opening } from './components/sections/Opening';
import { Mood } from './components/sections/Mood';
import { Menu } from './components/sections/Menu';
import { Question } from './components/sections/Question';

export function App() {
  const tier = getTier();
  const [lit, setLit] = useState(() => window.scrollY > 40);
  const warm = useWarm(8000);
  useLenis(!tier.reducedMotion);

  const light = useCallback(() => setLit(true), []);

  // first tap, key press or scroll lights the candle
  useEffect(() => {
    if (lit) return;
    const evs = ['scroll', 'wheel', 'touchmove', 'keydown', 'pointerdown'] as const;
    const on = () => setLit(true);
    evs.forEach((e) => window.addEventListener(e, on, { passive: true, once: true }));
    return () => evs.forEach((e) => window.removeEventListener(e, on));
  }, [lit]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main>
          <Opening lit={lit} tier={tier} warm={warm} onLight={light} />
          <Mood tier={tier} warm={warm} />
          <Menu reducedMotion={tier.reducedMotion} />
          <Question tier={tier} warm={warm} />
        </main>
        <Overlays warm={warm} />
        {site.music.enabled && <MusicToggle />}
      </MotionConfig>
    </LazyMotion>
  );
}
