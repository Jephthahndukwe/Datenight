import { useRef } from 'react';
import { m, useScroll, useTransform, type Variants } from 'framer-motion';
import { fill, site } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { Bokeh } from '../ui/Bokeh';
import { Picture } from '../ui/Picture';

const letters: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.6, ease: [0.22, 0.61, 0.36, 1] } },
};

/** Text revealed one letter at a time. */
function LetterReveal({ text, reduced, delay }: { text: string; reduced: boolean; delay: number }) {
  return (
    <m.span className="inline-block" aria-label={text} initial={reduced ? false : 'hidden'} animate="show" transition={{ delayChildren: delay, staggerChildren: 0.13 }}>
      {[...text].map((ch, i) => (
        <m.span key={i} aria-hidden variants={letters} className="inline-block whitespace-pre">
          {ch}
        </m.span>
      ))}
    </m.span>
  );
}

/** 1. A single candle in the dark. Her name, then one sentence. */
export function Opening({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = tier.reducedMotion;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} id="opening" className="relative h-[100svh] min-h-[580px] w-full overflow-hidden bg-wine-950">
      {/* the candle emerges from the dark: photo on top, dissolving into black */}
      <m.div
        className="absolute inset-x-0 top-0 h-[70%]"
        style={{
          ...(reduced ? {} : { y: photoY }),
          WebkitMaskImage: 'linear-gradient(to bottom, #000 52%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 52%, transparent 100%)',
        }}
      >
        <div className={`absolute inset-0 ${reduced ? '' : 'kenburns'}`}>
          <Picture name="flame" priority width={640} height={959} alt="A single lit candle in the dark" className="h-full w-full object-cover object-[50%_18%]" />
        </div>
        {/* breathing flame glow */}
        <div aria-hidden className="candle-glow absolute left-[56%] top-[17%] h-[78vw] max-h-[420px] w-[78vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,170,80,0.38) 0%, rgba(255,140,60,0.14) 40%, transparent 68%)' }} />
      </m.div>
      {!reduced && <Bokeh />}
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 100%, rgba(67,16,34,0.5), transparent 70%)' }} />

      <m.div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center justify-end px-6 pb-[12svh] text-center" style={reduced ? undefined : { y: textY, opacity: textOpacity }}>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gold-300/80">{site.eyebrow}</p>
        <h1 className="mt-6 font-script text-cream-50 [text-shadow:0_2px_40px_rgba(18,4,10,0.8)]">
          <span className="block text-[clamp(40px,12vw,68px)] leading-none text-gold-300">
            <LetterReveal text={site.hero.greeting} reduced={reduced} delay={1.0} />
          </span>
          <span className="block text-[clamp(84px,27vw,190px)] leading-[0.92]">
            <LetterReveal text={site.herName} reduced={reduced} delay={1.6} />
          </span>
        </h1>
        {site.hero.nickname && (
          <m.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.6, delay: reduced ? 0 : 4.0, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-1 flex flex-col items-center"
          >
            {site.hero.crown && (
              <svg viewBox="0 0 40 30" className="mb-1 h-[22px] w-auto" fill="none" stroke="#ecbd62" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <m.path
                  d="M5 24 L8 9 L15 17 L20 6 L25 17 L32 9 L35 24 Z M5 28 H35"
                  initial={reduced ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, delay: reduced ? 0 : 4.2, ease: 'easeInOut' }}
                />
                <circle cx="8" cy="7" r="1" fill="#ecbd62" stroke="none" />
                <circle cx="20" cy="4" r="1" fill="#ecbd62" stroke="none" />
                <circle cx="32" cy="7" r="1" fill="#ecbd62" stroke="none" />
              </svg>
            )}
            <span className="queen-glow font-script text-[clamp(38px,11vw,60px)] leading-none text-gold-300">{site.hero.nickname}</span>
          </m.div>
        )}
        <m.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: reduced ? 0 : 5.6, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-6 max-w-[26ch] font-display text-[1.25rem] italic leading-snug text-cream-200/80"
        >
          {fill(site.hero.tagline)}
        </m.p>
      </m.div>

      <div className="absolute inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-10 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.36em] text-cream-200/45" aria-hidden>
        <span className="relative block h-8 w-px overflow-hidden bg-gold-400/25">
          <span className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-gold-300 to-transparent [animation:hint_2.8s_ease-in-out_infinite]" />
        </span>
      </div>

      <div aria-hidden className="fade-from-black pointer-events-none absolute inset-0 z-20 bg-wine-950" />
      <style>{`@keyframes hint{0%{transform:translateY(-100%)}100%{transform:translateY(260%)}}@media (prefers-reduced-motion:reduce){[class*="animation:hint"]{animation:none!important}}`}</style>
    </section>
  );
}
