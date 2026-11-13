import { lazy, Suspense, useRef, useState } from 'react';
import { m, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { useInView } from '../../lib/useInView';
import { TerraceFallback } from '../ui/TerraceFallback';
import { ThreeBoundary } from '../ui/ThreeBoundary';

const TerraceScene = lazy(() => import('../three/TerraceScene'));

function Line({ text, i, n, p }: { text: string; i: number; n: number; p: MotionValue<number> }) {
  // each line owns an equal slice of the scroll, with soft in and out
  const start = 0.1;
  const end = 0.96;
  const seg = (end - start) / n;
  const a = start + i * seg;
  const last = i === n - 1;
  const opacity = useTransform(p, last ? [a, a + seg * 0.28, 1] : [a, a + seg * 0.22, a + seg * 0.78, a + seg], last ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, [a, a + seg * 0.28], [18, 0]);
  const blur = useTransform(p, last ? [a, a + seg * 0.28] : [a, a + seg * 0.22, a + seg * 0.78, a + seg], last ? [10, 0] : [10, 0, 0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  return (
    <m.p style={{ opacity, y, filter }} className="absolute inset-x-0 bottom-0 mx-auto max-w-[22ch] px-2 text-center font-display text-[clamp(26px,7.2vw,38px)] italic leading-[1.18] text-cream-50 [text-shadow:0_2px_24px_rgba(18,4,10,0.9)] sm:max-w-[34ch]">
      {text}
    </m.p>
  );
}

/** 2. A stylised terrace at dusk. The camera drifts in as she scrolls; a few sincere lines fade through. */
export function Mood({ tier, warm }: { tier: Tier; warm: boolean }) {
  const outer = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stageRef, near] = useInView<HTMLDivElement>('120% 0px 120% 0px');
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (v) => { progress.current = v; });
  const lines = site.whyLines;
  const show3d = tier.use3d && warm;

  return (
    <section ref={outer} id="mood" className="relative w-full" style={{ height: `${260 + lines.length * 40}svh` }}>
      <div ref={stageRef} className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#2a1230]">
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 0 : 1 }}>
          <TerraceFallback />
        </div>
        {show3d && (
          <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
            <ThreeBoundary>
              <Suspense fallback={null}>
                <TerraceScene progress={progress} motion={!tier.reducedMotion} active={near} onReady={() => setReady(true)} />
              </Suspense>
            </ThreeBoundary>
          </div>
        )}

        {/* readable lower third + soft top fade into the previous section */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-wine-950 via-wine-950/70 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-wine-950 to-transparent" />

        <p className="absolute inset-x-0 top-[max(28px,env(safe-area-inset-top))] text-center text-[10px] uppercase tracking-[0.42em] text-gold-400/80">
          II &nbsp;·&nbsp; L’atmosfera
        </p>

        <div className="absolute inset-x-0 bottom-[max(72px,calc(env(safe-area-inset-bottom)+56px))] mx-auto h-[8.5em] max-w-2xl px-6 text-[clamp(26px,7.2vw,38px)]">
          <div className="relative h-full">
            {lines.map((t, i) => (
              <Line key={i} text={t} i={i} n={lines.length} p={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
