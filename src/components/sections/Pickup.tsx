import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { clock, site } from '../../config/site';
import { Button } from '../ui/Button';
import { MascotArt } from '../ui/Illustrations';

const ease = [0.22, 0.61, 0.36, 1] as const;

function Check() {
  return (
    <m.span
      aria-hidden
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: [0, 1.25, 1], rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-ruby-600 text-cream-50 shadow-[0_3px_8px_-2px_rgba(126,18,38,0.7)]"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </m.span>
  );
}

/** 4. "When should I pick you up?" She taps a time; the mascot has an opinion. */
export function Pickup({ value, onChange, onNext, reduced }: { value: string | null; onChange: (t: string) => void; onNext: () => void; reduced: boolean }) {
  const [talk, setTalk] = useState<{ text: string; n: number } | null>(null);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (time: string, reaction: string) => {
    onChange(time);
    window.clearTimeout(timer.current);
    setTalk((t) => ({ text: reaction, n: (t?.n ?? 0) + 1 }));
    timer.current = window.setTimeout(() => setTalk(null), 6000);
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const rise = (d: number) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: reduced ? 0 : d, ease },
  });

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center">
      <m.div {...rise(0.1)} className="flex w-full items-center gap-3">
        <m.div
          key={talk?.n ?? 0}
          className="h-[78px] w-[65px] shrink-0"
          initial={false}
          animate={talk && !reduced ? { scale: [1, 0.86, 1.1, 1], rotate: [0, -6, 4, 0] } : { scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <m.div animate={reduced ? undefined : { y: [0, -4, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            <MascotArt className="h-full w-full" />
          </m.div>
        </m.div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[2rem] font-medium leading-[1.02] text-ink">{site.pickup.title}</h2>
        </div>
      </m.div>

      <div className="relative mt-2 h-[3.2rem] w-full" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.p
            key={talk ? `t${talk.n}` : 'sub'}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={talk ? 'font-hand text-[1.5rem] leading-[1.05] text-ruby-600' : 'font-display text-[1.1rem] italic leading-tight text-ink-soft'}
          >
            {talk ? talk.text : site.pickup.subtitle}
          </m.p>
        </AnimatePresence>
      </div>

      <m.div {...rise(0.5)} className="mt-3 grid w-full grid-cols-2 gap-3.5" role="radiogroup" aria-label={site.pickup.title}>
        {site.pickup.options.map((o) => {
          const on = value === o.time;
          return (
            <m.button
              key={o.time}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => pick(o.time, o.reaction)}
              animate={on ? { scale: [1, 0.9, 1.05, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileTap={{ scale: 0.95 }}
              className={`no-callout card-paper relative flex h-[92px] flex-col items-center justify-center gap-1 rounded-[16px] border transition-colors duration-500 ${on ? 'border-ruby-600 !bg-[#fdf0e4]' : 'border-gold-600/30'}`}
            >
              <AnimatePresence>{on && <Check />}</AnimatePresence>
              <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-colors duration-500 ${on ? 'text-ruby-600' : 'text-gold-600'}`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
              <span className={`font-display text-[1.75rem] font-semibold leading-none transition-colors duration-500 ${on ? 'text-ruby-600' : 'text-ink'}`}>{clock(o.time)}</span>
            </m.button>
          );
        })}
      </m.div>

      <div className="mt-7 h-12">
        {value && (
          <m.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}>
            <Button onClick={onNext}>{site.pickup.next}</Button>
          </m.div>
        )}
      </div>
    </div>
  );
}
