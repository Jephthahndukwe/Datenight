import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { site, type Choice } from '../../config/site';
import { ClinkArt } from '../ui/Illustrations';

const yes =
  'btn-pulse wobble no-callout inline-flex h-14 w-[13.5rem] items-center justify-center rounded-full border border-ruby-700/60 bg-gradient-to-b from-ruby-500 to-ruby-700 px-8 font-display text-[1.4rem] font-semibold tracking-wide text-cream-50 shadow-[0_10px_26px_-12px_rgba(126,18,38,0.9)] transition-[filter] duration-300 hover:brightness-110 active:scale-[0.97]';

/** 5. The question. Two yeses, equally lovable. */
export function Question({ onAnswer, reduced }: { onAnswer: (c: Choice) => void; reduced: boolean }) {
  const [egg, setEgg] = useState(false);
  const hold = useRef<number>(0);
  const idle = useRef<number>(0);

  useEffect(() => {
    idle.current = window.setTimeout(() => setEgg(true), 10000);
    return () => { window.clearTimeout(idle.current); window.clearTimeout(hold.current); };
  }, []);

  const startHold = () => { window.clearTimeout(hold.current); hold.current = window.setTimeout(() => setEgg(true), 2800); };
  const stopHold = () => window.clearTimeout(hold.current);
  const ease = [0.22, 0.61, 0.36, 1] as const;
  const rise = (delay: number) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.4, delay: reduced ? 0 : delay, ease },
  });

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center text-center">
      <m.div {...rise(0.2)}>
        <ClinkArt className="h-[112px] w-auto text-gold-600" />
      </m.div>
      <m.h2 {...rise(0.8)} className="mt-4 font-display text-[clamp(32px,9.2vw,44px)] font-medium leading-[1.1] text-ink [text-wrap:balance]">
        {site.question.headline}
      </m.h2>

      <m.div
        {...rise(2.0)}
        className="mt-9 flex w-full flex-col items-center gap-5"
        onPointerEnter={startHold}
        onPointerLeave={stopHold}
        onPointerDown={startHold}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button type="button" className={yes} onClick={() => onAnswer('yes')}>{site.question.yesPrimary}</button>
        <button type="button" className={`${yes} offset`} onClick={() => onAnswer('obviously')}>{site.question.yesSecondary}</button>
      </m.div>

      <m.p {...rise(2.8)} className="mt-7 font-display text-[1.15rem] italic text-ink-soft">{site.question.underline}</m.p>
      <div className="mt-4 h-8" aria-live="polite">
        <m.p initial={false} animate={{ opacity: egg ? 1 : 0, y: egg ? 0 : 6 }} transition={{ duration: 1.6 }} className="font-hand text-[1.3rem] text-ruby-600">
          {site.question.easterEgg}
        </m.p>
      </div>
    </div>
  );
}
