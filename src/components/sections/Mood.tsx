import { useRef } from 'react';
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { fill, site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { Bokeh } from '../ui/Bokeh';
import { Picture } from '../ui/Picture';

function Line({ text, i, n, p, reduced }: { text: string; i: number; n: number; p: MotionValue<number>; reduced: boolean }) {
  // one line per screen: it fades up, rests, then dissolves upward
  const start = 0.1;
  const end = 0.97;
  const seg = (end - start) / n;
  const a = start + i * seg;
  const last = i === n - 1;
  const keys = last ? [a, a + seg * 0.32, 1] : [a, a + seg * 0.28, a + seg * 0.72, a + seg];
  const opacity = useTransform(p, keys, last ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, keys, last ? [36, 0, 0] : [36, 0, 0, -30]);
  const blur = useTransform(p, keys, last ? [8, 0, 0] : [8, 0, 0, 6]);
  const filter = useTransform(blur, (b) => (b < 0.2 ? 'none' : `blur(${b}px)`));
  return (
    <m.p
      style={reduced ? { opacity: i === 0 ? 1 : 0 } : { opacity, y, filter }}
      className="absolute inset-x-0 top-1/2 mx-auto max-w-[19ch] -translate-y-1/2 px-1 text-center font-display text-[clamp(32px,9vw,52px)] italic leading-[1.16] text-cream-50 [text-shadow:0_2px_30px_rgba(18,4,10,0.9)] sm:max-w-[24ch]"
    >
      {fill(text)}
    </m.p>
  );
}

/** 2. Your words, one at a time, over a dark glass of wine and slow bokeh. Three layers drift at different speeds. */
export function Mood({ tier }: { tier: Tier }) {
  const outer = useRef<HTMLElement>(null);
  const reduced = tier.reducedMotion;
  const { scrollYProgress: p } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const lines = site.whyLines;

  const bgY = useTransform(p, [0, 1], ['6%', '-6%']);
  const bgScale = useTransform(p, [0, 1], [1.22, 1.06]);
  const midY = useTransform(p, [0, 1], ['10%', '-30%']);
  const nearY = useTransform(p, [0, 1], ['20%', '-90%']);

  return (
    <section ref={outer} id="mood" className="relative w-full" style={{ height: reduced ? '100svh' : `${110 + lines.length * 85}svh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-wine-950">
        {/* far: the glass, dim and slow */}
        <m.div className="absolute inset-0 opacity-60" style={reduced ? undefined : { y: bgY, scale: bgScale }}>
          <Picture name="wine" width={640} height={960} alt="" className="h-full w-full object-cover object-[50%_18%]" />
        </m.div>
        <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(18,4,10,0.35) 0%, rgba(18,4,10,0.15) 30%, rgba(18,4,10,0.82) 58%, #12040a 100%)' }} />

        {/* mid: drifting bokeh */}
        {!reduced && (
          <m.div aria-hidden className="absolute inset-0" style={{ y: midY }}>
            <Bokeh />
          </m.div>
        )}

        {/* text */}
        <div className="absolute inset-x-0 bottom-[10svh] top-[50svh] z-20 mx-auto max-w-2xl px-6">
          <div className="relative h-full">
            {lines.map((t, i) => (
              <Line key={i} text={t} i={i} n={lines.length} p={p} reduced={reduced} />
            ))}
          </div>
        </div>

        {/* near: big out-of-focus lights sliding past the lens */}
        {!reduced && (
          <m.div aria-hidden className="pointer-events-none absolute inset-0 z-30" style={{ y: nearY }}>
            <Bokeh variant="near" />
          </m.div>
        )}
      </div>
    </section>
  );
}
