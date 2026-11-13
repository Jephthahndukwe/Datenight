import { useCallback, useState } from 'react';
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { fill, menuSummary, site, type Choice, type Picks } from './config/site';
import { getTier } from './lib/capabilities';
import { burstPetals } from './lib/petals';
import { notifyAnswer } from './lib/share';
import { loadState, saveState } from './lib/storage';
import { Bokeh } from './components/ui/Bokeh';
import { MusicToggle } from './components/ui/MusicToggle';
import { Arrival } from './components/sections/Arrival';
import { Candle } from './components/sections/Candle';
import { Note } from './components/sections/Note';
import { MenuBuilder } from './components/sections/MenuBuilder';
import { Question } from './components/sections/Question';
import { Confirmed } from './components/sections/Confirmed';

type Step = 'arrival' | 'candle' | 'note' | 'menu' | 'question' | 'done';
const order: Step[] = ['arrival', 'candle', 'note', 'menu', 'question', 'done'];

/** Where to start: a saved answer jumps straight to the confirmation; ?step=note etc. is handy for previewing. */
function initial(saved: ReturnType<typeof loadState>): { step: Step; answer: Choice | null } {
  const q = new URLSearchParams(location.search).get('step') as Step | null;
  if (q && order.includes(q)) return { step: q, answer: q === 'done' ? (saved.answer ?? 'yes') : saved.answer };
  if (saved.answer) return { step: 'done', answer: saved.answer };
  return { step: 'arrival', answer: null };
}

export function App() {
  const tier = getTier();
  const reduced = tier.reducedMotion;
  const [saved] = useState(loadState);
  const [start] = useState(() => initial(saved));
  const [step, setStep] = useState<Step>(start.step);
  const [answer, setAnswer] = useState<Choice | null>(start.answer);
  const [picks, setPicks] = useState<Picks>(saved.picks);
  const [fresh, setFresh] = useState(false);
  // the room is dark until the candle is lit; later screens (or a returning visit) start already lit
  const [lit, setLit] = useState(order.indexOf(start.step) > 1);

  const next = useCallback(() => setStep((s) => order[Math.min(order.indexOf(s) + 1, order.length - 1)]), []);

  const pick = (course: string, option: string) => {
    const p = { ...picks, [course]: option };
    setPicks(p);
    saveState({ answer, picks: p });
  };

  const answerNow = (c: Choice) => {
    setAnswer(c);
    setFresh(true);
    saveState({ answer: c, picks });
    notifyAnswer(c, menuSummary(picks));
    if (!reduced) burstPetals(() => {});
    if (navigator.vibrate) navigator.vibrate(20);
    setStep('done');
  };

  const dark = !lit;
  const origin = '50% 42%';

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className="relative h-full w-full overflow-hidden bg-wine-950">
          {/* the dark room */}
          {!reduced && <div className="opacity-60"><Bokeh /></div>}
          <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 100%, rgba(67,16,34,0.55), transparent 70%)' }} />

          {/* the lights come up: paper spreads outwards from the flame */}
          <m.div
            aria-hidden
            className="paper absolute inset-0"
            initial={false}
            animate={{ clipPath: lit ? `circle(150% at ${origin})` : `circle(0% at ${origin})` }}
            transition={{ duration: reduced ? 0.6 : 3.0, delay: reduced ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
          />

          <div className="relative z-10 flex h-full flex-col">
            <header className="flex h-14 shrink-0 items-center justify-between px-3 pt-[env(safe-area-inset-top)]">
              <span className="h-10 w-10" aria-hidden />
              <AnimatePresence>
                {step !== 'arrival' && (
                  <m.p
                    key="label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4 }}
                    className={`text-[10px] uppercase tracking-[0.42em] transition-colors duration-[2400ms] ${dark ? 'text-gold-300/80' : 'text-gold-600'}`}
                  >
                    {fill(site.arrival.headerLabel)}
                  </m.p>
                )}
              </AnimatePresence>
              {site.music.enabled ? <MusicToggle tone={dark ? 'dark' : 'light'} /> : <span className="h-10 w-10" aria-hidden />}
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
                  {step === 'arrival' && <Arrival onNext={next} reduced={reduced} />}
                  {step === 'candle' && <Candle lit={lit} onLight={() => setLit(true)} onNext={next} reduced={reduced} />}
                  {step === 'note' && <Note onNext={next} reduced={reduced} />}
                  {step === 'menu' && <MenuBuilder picks={picks} onPick={pick} onNext={next} reduced={reduced} />}
                  {step === 'question' && <Question onAnswer={answerNow} reduced={reduced} />}
                  {step === 'done' && answer && <Confirmed choice={answer} picks={picks} reduced={reduced} fresh={fresh} />}
                </m.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
