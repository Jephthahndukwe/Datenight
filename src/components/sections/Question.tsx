import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, useScroll, useTransform } from 'framer-motion';
import { site, derived, type Choice } from '../../config/site';
import type { Tier } from '../../lib/capabilities';
import { downloadIcs } from '../../lib/ics';
import { burstPetals } from '../../lib/petals';
import { notifyAnswer, whatsappUrl } from '../../lib/share';
import { loadAnswer, saveAnswer } from '../../lib/storage';
import { useInView } from '../../lib/useInView';
import { WineGlassArt } from '../ui/LineArt';
import { Ornament } from '../ui/Ornament';
import { Bokeh } from '../ui/Bokeh';

const btn =
  'btn-pulse no-callout inline-flex h-14 min-w-[11rem] items-center justify-center rounded-full border border-gold-400/70 bg-gradient-to-b from-gold-300 to-gold-500 px-8 font-display text-[1.35rem] font-semibold tracking-wide text-wine-900 transition-[transform,filter] duration-500 hover:brightness-105 active:scale-[0.97]';
const btnSm =
  'no-callout inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-gold-400/70 bg-gradient-to-b from-gold-300 to-gold-500 px-7 font-sans text-[13px] font-medium tracking-[0.06em] text-wine-900 transition-[transform,filter] duration-300 hover:brightness-105 active:scale-[0.98]';
const ghost =
  'no-callout inline-flex h-12 items-center justify-center gap-2.5 rounded-full border border-gold-400/40 px-7 font-sans text-[13px] tracking-[0.06em] text-cream-100 transition-colors duration-300 hover:border-gold-400 hover:bg-gold-400/10 active:scale-[0.98]';

const idlePetals = [
  { x: '14%', d: 26, delay: -4, s: 13, c: '#a8142f' },
  { x: '58%', d: 32, delay: -17, s: 11, c: '#c42b45' },
  { x: '84%', d: 29, delay: -9, s: 12, c: '#8f0f2c' },
];

/** 4 + 5. The page dims to candlelight, the question appears, and either yes brings petals and the details. */
export function Question({ tier }: { tier: Tier }) {
  const [answer, setAnswer] = useState<Choice | null>(() => loadAnswer());
  const [justAnswered, setJustAnswered] = useState(false);
  const [egg, setEgg] = useState(false);
  const [ref, inView] = useInView<HTMLElement>('0px');
  const holdTimer = useRef<number>(0);
  const idleTimer = useRef<number>(0);
  const stopBurst = useRef<() => void>(() => {});
  const reduced = tier.reducedMotion;

  // dim to candlelight as the section arrives
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 25%'] });
  const photoOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.7]);
  const glowOpacity = useTransform(scrollYProgress, [0.15, 1], [0, 1]);

  // easter egg: hovering or holding a button for a few seconds, or simply lingering
  const startHold = () => {
    window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => setEgg(true), 2800);
  };
  const stopHold = () => window.clearTimeout(holdTimer.current);
  useEffect(() => {
    if (answer || !inView) return;
    idleTimer.current = window.setTimeout(() => setEgg(true), 11000);
    return () => window.clearTimeout(idleTimer.current);
  }, [answer, inView]);
  useEffect(() => () => { stopHold(); stopBurst.current(); }, []);

  const choose = (c: Choice) => {
    stopHold();
    window.clearTimeout(idleTimer.current);
    setAnswer(c);
    setJustAnswered(true);
    saveAnswer(c);
    notifyAnswer(c);
    if (!reduced) stopBurst.current = burstPetals(() => {});
    if (navigator.vibrate) navigator.vibrate(18);
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.restaurant.name} ${site.restaurant.address}`)}`;
  const slow = [0.22, 0.61, 0.36, 1] as const;

  return (
    <section ref={ref} id="question" className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-20">
      <div aria-hidden className="absolute inset-0 bg-wine-950" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #12040a 0%, rgba(44,11,25,0.5) 40%, rgba(44,11,25,0.55) 70%, #12040a 100%)' }} />
      {!reduced && (
        <m.div aria-hidden className="absolute inset-0" style={{ opacity: photoOpacity }}>
          <Bokeh />
        </m.div>
      )}
      <m.div aria-hidden className="absolute inset-0" style={reduced ? undefined : { opacity: glowOpacity }}>
        <div className="candle-glow absolute left-1/2 top-[52%] h-[120vw] max-h-[900px] w-[120vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,160,70,0.28) 0%, rgba(160,60,50,0.16) 38%, transparent 68%)' }} />
      </m.div>

      {!reduced && !answer && idlePetals.map((p, i) => (
        <span key={i} aria-hidden className="petal-idle pointer-events-none absolute top-0 block rounded-[60%_40%_60%_40%]" style={{ left: p.x, width: p.s, height: p.s * 1.3, background: p.c, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }} />
      ))}

      <p className="relative mb-6 text-[10px] uppercase tracking-[0.42em] text-gold-300/80">IV &nbsp;·&nbsp; La domanda</p>

      <div className="relative w-full max-w-xl">
        <AnimatePresence mode="wait" initial={false}>
          {!answer ? (
            <m.div key="ask" exit={{ opacity: 0, y: -14, filter: 'blur(6px)', transition: { duration: 0.9 } }} className="flex flex-col items-center text-center">
              <WineGlassArt reduced={reduced} className="mb-5 h-[72px] w-auto" />
              <m.h2
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.8, delay: 0.5, ease: slow }}
                className="font-display text-[clamp(40px,11.5vw,78px)] font-medium leading-[1.04] text-cream-50 [text-shadow:0_2px_40px_rgba(18,4,10,0.8)]"
              >
                {site.question.headline}
              </m.h2>

              <m.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.6, delay: 1.5, ease: slow }}
                className="mt-12 flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center"
                onPointerEnter={startHold}
                onPointerLeave={stopHold}
                onPointerDown={startHold}
                onPointerUp={stopHold}
                onPointerCancel={stopHold}
                onContextMenu={(e) => e.preventDefault()}
              >
                <button type="button" className={btn} onClick={() => choose('si')}>{site.question.yesPrimary}</button>
                <button type="button" className={`${btn} offset`} onClick={() => choose('obviously')}>{site.question.yesSecondary}</button>
              </m.div>

              <m.p
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.6, delay: 2.2 }}
                className="mt-8 font-display text-lg italic text-cream-200/70"
              >
                {site.question.underline}
              </m.p>

              <div className="mt-7 h-6" aria-live="polite">
                <m.p initial={false} animate={{ opacity: egg ? 1 : 0, y: egg ? 0 : 6 }} transition={{ duration: 1.8 }} className="text-[13px] tracking-[0.04em] text-gold-300/90">
                  {site.question.easterEgg}
                </m.p>
              </div>
            </m.div>
          ) : (
            <m.div
              key="yes"
              initial={justAnswered && !reduced ? { opacity: 0, y: 70 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.7, delay: justAnswered && !reduced ? 1.1 : 0, ease: slow }}
              className="mx-auto flex w-full max-w-md flex-col items-center rounded-[28px] border border-gold-400/35 bg-wine-900/80 px-7 py-9 text-center shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            >
              <h2 className="font-display text-[clamp(32px,9.2vw,56px)] font-medium italic leading-[1.06] text-gold-300">{site.thanks[answer]}</h2>
              <Ornament className="mt-5 w-44" />

              <dl className="mt-6 grid w-full gap-5">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.38em] text-gold-400/80">Quando</dt>
                  <dd className="mt-1.5 font-display text-[1.6rem] leading-tight text-cream-50">{derived.dateLong}</dd>
                  <dd className="font-display text-xl italic text-cream-200/80">{derived.time}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.38em] text-gold-400/80">Dove</dt>
                  <dd className="mt-1.5 font-display text-[1.6rem] leading-tight text-cream-50">{site.restaurant.name}</dd>
                  <dd>
                    <a href={mapsUrl} target="_blank" rel="noreferrer" className="font-sans text-[13px] tracking-[0.04em] text-cream-200/70 underline decoration-gold-400/40 underline-offset-4 hover:text-cream-50">
                      {site.restaurant.address}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex w-full flex-col items-center gap-3">
                <button type="button" className={`${btnSm} w-full`} onClick={downloadIcs}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
                  Add to calendar
                </button>
                <a className={`${ghost} w-full`} href={whatsappUrl(answer)} target="_blank" rel="noreferrer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z" /></svg>
                  Tell {site.yourName}
                </a>
              </div>
              <p className="mt-6 font-display text-base italic text-cream-200/50">A presto.</p>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <p className="absolute bottom-6 left-6 max-w-[58%] text-left text-[10px] leading-relaxed tracking-[0.06em] text-cream-200/35">
        Photography on Unsplash: {site.photoCredits.map((c) => c.name).join(', ')}
      </p>
    </section>
  );
}
