import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { site } from './config/site';
import { getTier } from './lib/capabilities';
import { useLenis } from './lib/useLenis';
import { Overlays } from './components/ui/Overlays';
import { MusicToggle } from './components/ui/MusicToggle';
import { Opening } from './components/sections/Opening';
import { Mood } from './components/sections/Mood';
import { Menu } from './components/sections/Menu';
import { Question } from './components/sections/Question';

export function App() {
  const tier = getTier();
  useLenis(!tier.reducedMotion);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <main>
          <Opening tier={tier} />
          <Mood tier={tier} />
          <Menu reducedMotion={tier.reducedMotion} coarse={tier.coarse} />
          <Question tier={tier} />
        </main>
        <Overlays />
        {site.music.enabled && <MusicToggle />}
      </MotionConfig>
    </LazyMotion>
  );
}
