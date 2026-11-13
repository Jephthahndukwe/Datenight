import { useRef } from 'react';
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { LemonBranchArt } from '../ui/LineArt';
import { Picture } from '../ui/Picture';

function Line({ text, i, n, p, reduced }: { text: string; i: number; n: number; p: MotionValue<number>; reduced: boolean }) {
  // each line owns an equal slice of the scroll: slides up into place, holds, drifts away
  const start = 0.12;
  const end = 0.97;
  const seg = (end - start) / n;
  const a = start + i * seg;
  const last = i === n - 1;
  const keys = last ? [a, a + seg * 0.3, 1] : [a, a + seg * 0.26, a + seg * 0.74, a + seg];
  const opacity = useTransform(p, keys, last ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, keys, last ? [34, 0, 0] : [34, 0, 0, -34]);
  const blur = useTransform(p, keys, last ? [8, 0, 0] : [8, 0, 0, 6]);
  const filter = useTransform(blur, (b) => (b < 0.2 ? 'none' : `blur(${b}px)`));
  return (
    <m.p
      style={reduced ? { opacity: i === 0 ? 1 : 0 } : { opacity, y, filter }}
      className="absolute inset-x-0 top-0 mx-auto max-w-[19ch] px-1 text-center font-display text-[clamp(30px,8.6vw,48px)] italic leading-[1.14] text-cream-50 [text-shadow:0_2px_30px_rgba(18,4,10,0.85)] sm:max-w-[26ch]"
    >
      {text}
    </m.p>
  );
}

/** 2. Layered parallax: far coast, mid-ground table, text, and a near sprig of lemons moving at four different speeds. */
export function Mood({ tier }: { tier: Tier }) {
  const outer = useRef<HTMLElement>(null);
  const reduced = tier.reducedMotion;
  const { scrollYProgress: p } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const lines = site.whyLines;

  const bgY = useTransform(p, [0, 1], ['5%', '-5%']);
  const bgScale = useTransform(p, [0, 1], [1.26, 1.1]);
  const archY = useTransform(p, [0, 0.7, 1], ['70%', '12%', '2%']);
  const archInner = useTransform(p, [0, 1], [1.3, 1.02]);
  const fgY = useTransform(p, [0, 1], ['6%', '-120%']);
  const fgX = useTransform(p, [0, 1], ['0%', '-14%']);
  const fgOpacity = useTransform(p, [0, 0.8, 1], [1, 0.85, 0]);

  return (
    <section ref={outer} id="mood" className="relative w-full" style={{ height: reduced ? '100svh' : `${230 + lines.length * 55}svh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-wine-900">
        {/* L0: far. Positano at dusk, drifting slowly the other way */}
        <m.div className="absolute inset-0" style={reduced ? undefined : { y: bgY, scale: bgScale }}>
          <Picture name="coast" width={640} height={853} alt="Positano at sunset on the Amalfi Coast" className="h-full w-full object-cover object-[50%_60%]" />
        </m.div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(18,4,10,0.86) 0%, rgba(44,11,25,0.5) 38%, rgba(44,11,25,0.2) 60%, rgba(18,4,10,0.7) 100%)' }} />

        {/* L1: mid. A candlelit table framed in an arch, rising through the scene */}
        <m.div className="absolute bottom-0 right-[-4vw] w-[62vw] max-w-[380px]" style={reduced ? undefined : { y: archY }}>
          <div className="relative aspect-[3/4] w-full">
            <div aria-hidden className="absolute -left-3 -top-3 h-full w-full rounded-t-[999px] border border-gold-400/45" />
            <div className="relative h-full w-full overflow-hidden rounded-t-[999px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
              <m.div className="h-full w-full" style={reduced ? undefined : { scale: archInner }}>
                <Picture name="table" width={640} height={960} sizes="(min-width: 640px) 380px, 62vw" alt="A table set for dinner with a lit candle" className="h-full w-full object-cover" />
              </m.div>
              <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,4,10,0.55), transparent 45%)' }} />
            </div>
          </div>
        </m.div>

        {/* L2: text */}
        <div className="absolute inset-x-0 top-[max(64px,12svh)] z-20 mx-auto h-[9.5em] max-w-2xl px-6 text-[clamp(30px,8.6vw,48px)]">
          <div className="relative h-full">
            {lines.map((t, i) => (
              <Line key={i} text={t} i={i} n={lines.length} p={p} reduced={reduced} />
            ))}
          </div>
        </div>

        {/* L3: near. Lemons slide past the lens, fastest layer */}
        <m.div
          aria-hidden
          className="pointer-events-none absolute -left-[12vw] -top-[6svh] z-30 h-[64svh] w-[46vw] max-w-[320px]"
          style={reduced ? { opacity: 0.9 } : { y: fgY, x: fgX, opacity: fgOpacity }}
        >
          <Picture
            name="lemons"
            width={640}
            height={1138}
            sizes="(min-width: 640px) 320px, 46vw"
            className="h-full w-full object-cover"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse 78% 68% at 14% 22%, #000 28%, transparent 100%)', maskImage: 'radial-gradient(ellipse 78% 68% at 14% 22%, #000 28%, transparent 100%)' }}
          />
        </m.div>

        <LemonBranchArt reduced={reduced} className="pointer-events-none absolute bottom-[9svh] left-[6vw] z-20 w-[34vw] max-w-[190px] opacity-90" />

        <p className="absolute inset-x-0 top-[max(24px,env(safe-area-inset-top))] z-30 text-center text-[10px] uppercase tracking-[0.42em] text-gold-300/80">
          II &nbsp;·&nbsp; L’atmosfera
        </p>
      </div>
    </section>
  );
}
