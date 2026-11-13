import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { site } from '../../config/site';
import { Button } from '../ui/Button';
import { CandleArt, FlameArt } from '../ui/Illustrations';

/** 2. The signature moment. Tap the candle: the flame catches, warm light spreads, and the dark becomes paper. */
export function Candle({ lit, onLight, onNext, reduced }: { lit: boolean; onLight: () => void; onNext: () => void; reduced: boolean }) {
  const [showNext, setShowNext] = useState(false);
  const ease = [0.22, 0.61, 0.36, 1] as const;

  useEffect(() => {
    if (!lit) return;
    const id = window.setTimeout(() => setShowNext(true), reduced ? 200 : 3400);
    return () => window.clearTimeout(id);
  }, [lit, reduced]);

  const light = () => {
    if (lit) return;
    onLight();
    if (navigator.vibrate) navigator.vibrate(24);
  };

  return (
    <div className="flex w-full flex-col items-center text-center">
      <button
        type="button"
        onClick={light}
        disabled={lit}
        aria-label={lit ? 'The candle is lit' : site.candle.prompt}
        className="no-callout relative block h-[50svh] max-h-[380px] min-h-[240px] aspect-[160/260] cursor-pointer disabled:cursor-default"
      >
        {/* warm light spreading from the flame */}
        {lit && (
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-[20%] h-[96%] w-[300%] -translate-x-1/2 -translate-y-1/2" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 18%, #000 38%)', maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 18%, #000 38%)' }}>
            <m.span
              className="block h-full w-full"
              initial={reduced ? false : { opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2.6, ease }}
            >
              <span className="candle-glow block h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(255,176,80,0.6) 0%, rgba(255,160,70,0.26) 42%, rgba(255,150,60,0) 100%)' }} />
            </m.span>
          </span>
        )}
        <CandleArt className={`absolute inset-0 h-full w-full transition-colors duration-[2400ms] ${lit ? 'text-gold-600' : 'text-gold-300'}`} />
        {!lit && (
          <span aria-hidden className="pointer-events-none absolute left-1/2 top-[27%] h-14 w-14 -translate-x-1/2 -translate-y-1/2">
            <span className="ring-hint block h-full w-full rounded-full border border-gold-300/70" />
          </span>
        )}
        {lit && (
          <m.span
            aria-hidden
            className="absolute inset-0 block"
            style={{ transformOrigin: '50% 29%' }}
            initial={reduced ? false : { opacity: 0, scale: 0.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, ease }}
          >
            <FlameArt className="flame h-full w-full" />
          </m.span>
        )}
      </button>

      <div className="mt-7 h-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          {!lit ? (
            <m.p key="prompt" exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="font-display text-[1.5rem] italic text-cream-200/85">
              {site.candle.prompt}
            </m.p>
          ) : (
            <m.div key="lit" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: reduced ? 0 : 1.8, ease }}>
              <p className="font-hand text-[1.9rem] leading-tight text-ruby-600">{site.candle.lit}</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-14">
        {showNext && (
          <m.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
            <Button onClick={onNext}>{site.candle.next}</Button>
          </m.div>
        )}
      </div>
    </div>
  );
}
