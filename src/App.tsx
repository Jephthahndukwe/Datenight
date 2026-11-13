import { useCallback, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { site } from './config/site';
import { getTier } from './lib/capabilities';
import { burstPetals } from './lib/petals';
import { notifyAccepted } from './lib/share';
import { loadAccepted, saveAccepted } from './lib/storage';
import { Bokeh } from './components/ui/Bokeh';
import { MusicToggle } from './components/ui/MusicToggle';
import { Envelope } from './components/sections/Envelope';
import { Question } from './components/sections/Question';
import { Celebrate } from './components/sections/Celebrate';
import { Note } from './components/sections/Note';
import { Confirmed } from './components/sections/Confirmed';

type Step = 'envelope' | 'question' | 'celebrate' | 'note' | 'done';
const steps: Step[] = ['envelope', 'question', 'celebrate', 'note', 'done'];

/** Where to start: a returning "yes" jumps to the ticket; ?step=question etc. is handy for previewing. */
function initialStep(accepted: boolean): Step {
  const q = new URLSearchParams(location.search).get('step') as Step | null;
  if (q && steps.includes(q)) return q;
  return accepted ? 'done' : 'envelope';
}

export function App() {
  const tier = getTier();
  const reduced = tier.reducedMotion;
  const [accepted] = useState(loadAccepted);
  const [start] = useState(() => initialStep(accepted));
  const [step, setStep] = useState<Step>(start);
  const [fresh, setFresh] = useState(false);
  // the room is dark until the envelope is opened; everything after (or a return visit) is already lit
  const [lit, setLit] = useState(start !== 'envelope');

  const next = useCallback(() => setStep((s) => steps[Math.min(steps.indexOf(s) + 1, steps.length - 1)]), []);

  const sayYes = () => {
    saveAccepted();
    notifyAccepted();
    if (!reduced) burstPetals(() => {});
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    setStep('celebrate');
  };

  const dark = !lit;
  const origin = '50% 40%';

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="relative h-full w-full overflow-hidden bg-wine-950">
          {/* the dark room */}
          {!reduced && <div className="opacity-60"><Bokeh /></div>}
          <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 100%, rgba(67,16,34,0.55), transparent 70%)' }} />

          {/* the lights come up: paper spreads outwards from the envelope */}
          <m.div
            aria-hidden
            className="paper absolute inset-0"
            initial={false}
            animate={{ clipPath: lit ? `circle(150% at ${origin})` : `circle(0% at ${origin})` }}
            transition={{ duration: reduced ? 0.6 : 2.6, delay: reduced ? 0 : 0.5, ease: [0.4, 0, 0.2, 1] }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <header className="flex h-14 shrink-0 items-center justify-end px-3 pt-[env(safe-area-inset-top)]">
              {site.music.enabled && <MusicToggle tone={dark ? 'dark' : 'light'} />}
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
                  className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-5 pb-8 pt-2"
                >
                  {step === 'envelope' && <Envelope onOpen={() => setLit(true)} onNext={next} reduced={reduced} />}
                  {step === 'question' && <Question onYes={sayYes} reduced={reduced} />}
                  {step === 'celebrate' && <Celebrate onNext={() => { setFresh(true); next(); }} reduced={reduced} />}
                  {step === 'note' && <Note onNext={() => { setFresh(true); next(); }} reduced={reduced} />}
                  {step === 'done' && <Confirmed reduced={reduced} fresh={fresh} />}
                </m.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
