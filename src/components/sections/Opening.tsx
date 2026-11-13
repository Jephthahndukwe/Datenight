import { useRef } from 'react';
import { m, useScroll, useTransform, type Variants } from 'framer-motion';
import { site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { Bokeh } from '../ui/Bokeh';
import { Picture } from '../ui/Picture';

const letters: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.5, ease: [0.22, 0.61, 0.36, 1] } },
};

/** The name, revealed one letter at a time in the script font. */
function LetterReveal({ text, reduced, delay }: { text: string; reduced: boolean; delay: number }) {
  return (
    <m.span
      className="inline-block"
      aria-label={text}
      initial={reduced ? false : 'hidden'}
      animate="show"
      transition={{ delayChildren: delay, staggerChildren: 0.12 }}
    >
      {[...text].map((ch, i) => (
        <m.span key={i} aria-hidden variants={letters} className="inline-block whitespace-pre">
          {ch}
        </m.span>
      ))}
    </m.span>
  );
}

/** 1. A candlelit table, a slow push-in, and "Ciao, {name}" appearing letter by letter. */
export function Opening({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = tier.reducedMotion;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '14%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-28%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} id="opening" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-wine-950">
      <m.div className="absolute inset-0" style={reduced ? undefined : { y: photoY }}>
        <div className={`absolute inset-0 ${reduced ? '' : 'kenburns'}`}>
          <Picture
            name="hero"
            priority
            width={640}
            height={818}
            alt="A candlelit dinner table set with wine glasses"
            className="h-full w-full object-cover object-[50%_32%]"
          />
        </div>
      </m.div>

      {/* grade + legibility: burgundy at the foot, soft shade on top, warm glow around the flame */}
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(18,4,10,0.96) 0%, rgba(44,11,25,0.78) 26%, rgba(44,11,25,0.12) 58%, rgba(18,4,10,0.55) 100%)' }} />
      <div aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: 'radial-gradient(60% 40% at 30% 14%, rgba(255,190,100,0.55), transparent 70%)' }} />
      {!reduced && <Bokeh />}

      <m.div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center justify-end px-6 pb-[16svh] text-center" style={reduced ? undefined : { y: textY, opacity: textOpacity }}>
        <p className="text-[10px] uppercase tracking-[0.46em] text-gold-300/90">Una cena per due</p>
        <h1 className="mt-5 font-script text-cream-50 [text-shadow:0_2px_40px_rgba(18,4,10,0.7)]">
          <span className="block text-[clamp(44px,13vw,76px)] leading-none text-gold-300">
            <LetterReveal text="Ciao," reduced={reduced} delay={1.0} />
          </span>
          <span className="block text-[clamp(84px,27vw,190px)] leading-[0.92]">
            <LetterReveal text={site.herName} reduced={reduced} delay={1.7} />
          </span>
        </h1>
        <p className="mt-6 max-w-[28ch] font-display text-[1.15rem] italic leading-snug text-cream-200/80">
          A little question, and a table by candlelight.
        </p>
      </m.div>

      <div className="absolute inset-x-0 bottom-[max(22px,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.36em] text-cream-200/60" aria-hidden>
        <span>Scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-gold-400/25">
          <span className="absolute inset-x-0 top-0 h-3.5 bg-gradient-to-b from-gold-300 to-transparent [animation:hint_2.6s_ease-in-out_infinite]" />
        </span>
      </div>

      {/* open from black, slowly */}
      <div aria-hidden className="fade-from-black pointer-events-none absolute inset-0 z-20 bg-wine-950" />
      <style>{`@keyframes hint{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}@media (prefers-reduced-motion:reduce){[class*="animation:hint"]{animation:none!important}}`}</style>
    </section>
  );
}
