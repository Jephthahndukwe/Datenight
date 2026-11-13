import { m } from 'framer-motion';
import { fill, site } from '../../config/site';
import { Button } from '../ui/Button';
import { Ornament } from '../ui/Ornament';

/** 1. A dark screen and a small reservation card with her name on it. */
export function Arrival({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const ease = [0.22, 0.61, 0.36, 1] as const;
  return (
    <div className="on-dark flex w-full max-w-[340px] flex-col items-center">
      <m.div
        initial={reduced ? false : { opacity: 0, y: 36, rotate: -2.5 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: 1.8, delay: 0.5, ease }}
        className="card-paper relative w-full rounded-[8px] p-[10px]"
      >
        <div className="rounded-[4px] border border-gold-600/50 p-[5px]">
          <div className="rounded-[2px] border border-gold-600/30 px-6 pb-9 pt-8 text-center">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-soft">{fill(site.arrival.eyebrow)}</p>
            <h1 className="mt-4 font-script text-[clamp(78px,24vw,104px)] leading-[0.95] text-ruby-600">{site.herName}</h1>
            <Ornament className="mx-auto mt-3 w-40" tone="ink" />
            <p className="mt-5 font-display text-[1.7rem] italic leading-none text-ink">{site.arrival.party}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[0.4em] text-gold-600">{site.arrival.detail}</p>
          </div>
        </div>
      </m.div>
      <m.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: reduced ? 0 : 2.0, ease }}
        className="mt-9"
      >
        <Button variant="gold" onClick={onNext} className="h-[52px] min-w-[12rem] text-[14px]">
          {site.arrival.button}
        </Button>
      </m.div>
    </div>
  );
}
