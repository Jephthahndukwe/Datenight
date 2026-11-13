import { lazy, Suspense, useState } from 'react';
import { m } from 'framer-motion';
import { site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { useInView } from '../../lib/useInView';
import { StaticCandle } from '../ui/StaticCandle';
import { ThreeBoundary } from '../ui/ThreeBoundary';

const CandleScene = lazy(() => import('../three/CandleScene'));

type Props = { lit: boolean; tier: Tier; warm: boolean; onLight: () => void };

/** 1. A dark screen, a single candle, and "Ciao, {name}" once it's lit. */
export function Opening({ lit, tier, warm, onLight }: Props) {
  const [ref, inView] = useInView<HTMLElement>('200px');
  const [ready, setReady] = useState(false);
  const show3d = tier.use3d && warm;

  return (
    <section
      ref={ref}
      id="opening"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden"
      onPointerDown={onLight}
    >
      {/* candle light bleeding into the room */}
      <m.div
        aria-hidden
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
        style={{ background: 'radial-gradient(60% 46% at 50% 66%, rgba(236,160,70,0.34), rgba(120,40,40,0.18) 45%, transparent 75%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 100%, #2c0b19 0%, #12040a 60%)' }}
      />

      {/* CSS candle: instant, and the fallback. Fades once WebGL takes over. */}
      <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 0 : 1 }}>
        <StaticCandle lit={lit} className="bottom-[17svh] h-[32svh] max-h-[320px]" />
      </div>

      {show3d && (
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
          <ThreeBoundary>
            <Suspense fallback={null}>
              <CandleScene lit={lit} motion={!tier.reducedMotion} active={inView} onReady={() => setReady(true)} />
            </Suspense>
          </ThreeBoundary>
        </div>
      )}

      <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center px-6 pt-[12svh] text-center">
        <m.p
          initial={false}
          animate={{ opacity: lit ? 0.9 : 0.55 }}
          transition={{ duration: 1.6 }}
          className="font-sans text-[10px] uppercase tracking-[0.42em] text-gold-400"
        >
          Una cena per due
        </m.p>

        <m.h1
          initial={false}
          animate={lit ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(14px)' }}
          transition={{ duration: 2.2, delay: lit ? 0.9 : 0, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-6 font-script text-[clamp(72px,24vw,168px)] leading-[0.95] text-cream-50 [text-shadow:0_0_40px_rgba(236,160,70,0.35)]"
          aria-label={`Ciao, ${site.herName}`}
        >
          <span className="block text-[0.55em] leading-none text-gold-300">Ciao,</span>
          <span className="block">{site.herName}</span>
        </m.h1>

        <div className="mt-auto flex flex-col items-center pb-[max(28px,env(safe-area-inset-bottom))]">
          <m.p
            initial={false}
            animate={{ opacity: lit ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className="mb-3 text-[11px] uppercase tracking-[0.34em] text-cream-200/70"
          >
            Tap to light the candle
          </m.p>
          <m.div
            initial={false}
            animate={{ opacity: lit ? 1 : 0 }}
            transition={{ duration: 1.4, delay: lit ? 2.6 : 0 }}
            className="flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.34em] text-cream-200/60"
            aria-hidden={!lit}
          >
            <span>Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-gold-400/20">
              <span className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-gold-300 to-transparent [animation:hint_2.2s_ease-in-out_infinite]" />
            </span>
          </m.div>
        </div>
      </div>
      <style>{`@keyframes hint{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}@media (prefers-reduced-motion:reduce){[class*="animation:hint"]{animation:none!important}}`}</style>
    </section>
  );
}
