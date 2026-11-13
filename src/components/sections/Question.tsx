import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { fill, site } from '../../config/site';
import { MascotArt, type Mood } from '../ui/Illustrations';
import { RunawayButton } from '../ui/RunawayButton';

const ease = [0.22, 0.61, 0.36, 1] as const;

/** Pleading, then sweating, then crying: the mascot's mood follows how many times No has run. */
const moodFor = (n: number): Mood => {
  if (n === 0) return 'happy';
  if (n <= 3) return (['plead', 'sweat', 'cry'] as const)[n - 1];
  return (['cry', 'plead', 'sweat', 'cry'] as const)[n % 4]; // after the first three, keep the drama varied
};

const shuffled = <T,>(a: readonly T[]): T[] => {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** The n-th line (1-based): the opening lines in order, then the pool shuffled, endlessly, with no back-to-back repeats. */
function useEscapeLines() {
  const { opening, pool } = site.question.escape;
  const rounds = useRef<string[][]>([]);
  return useMemo(
    () => (n: number) => {
      if (n <= opening.length) return opening[n - 1];
      const k = n - opening.length - 1;
      const round = Math.floor(k / pool.length);
      while (rounds.current.length <= round) {
        const next = shuffled(pool);
        const prev = rounds.current[rounds.current.length - 1];
        if (prev && next[0] === prev[prev.length - 1]) next.push(next.shift()!);
        rounds.current.push(next);
      }
      return rounds.current[round][k % pool.length];
    },
    [opening, pool],
  );
}

/** 2. The mascot holds up a sign. Yes is easy. No cannot be caught. */
export function Question({ onYes, reduced }: { onYes: () => void; reduced: boolean }) {
  const [escapes, setEscapes] = useState(0);
  const hud = useRef<HTMLDivElement>(null);
  const yes = useRef<HTMLButtonElement>(null);
  const slot = useRef<HTMLSpanElement>(null);

  const mood = moodFor(escapes);
  const lineFor = useEscapeLines();
  const line = escapes === 0 ? site.question.idleLine : lineFor(escapes);
  // Yes grows a little and glows more with every escape (capped, so No always has somewhere to run)
  const grow = Math.min(escapes, 5);

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center text-center">
      <div ref={hud} className="flex w-full flex-col items-center">
        {/* mascot + sign */}
        <m.div
          initial={reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, ease }}
          className="relative w-[min(86vw,310px)]"
        >
          <div className={`relative z-0 mx-auto h-[120px] w-[100px] ${mood === 'sweat' || mood === 'cry' ? 'shiver' : ''}`}>
            <m.div
              key={mood}
              initial={false}
              animate={reduced ? undefined : { scale: [1, 0.9, 1.06, 1] }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full w-full"
            >
              <MascotArt mood={mood} className="h-full w-full" />
            </m.div>
          </div>
          <div className="card-paper relative z-10 -mt-4 rounded-[16px] border-2 border-gold-600/55 px-5 pb-6 pt-7">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-3 h-4 w-4 text-ruby-600/70" fill="currentColor" aria-hidden><path d="M12 21C3 15 4 6.500 9 6.500c2 0 3 1.500 3 2.500 0-1 1-2.500 3-2.500 5 0 6 8.500-3 14.500Z" /></svg>
            <svg viewBox="0 0 24 24" className="absolute right-3 top-3 h-4 w-4 text-ruby-600/70" fill="currentColor" aria-hidden><path d="M12 21C3 15 4 6.500 9 6.500c2 0 3 1.500 3 2.500 0-1 1-2.500 3-2.500 5 0 6 8.500-3 14.500Z" /></svg>
            <h2 className="font-display text-[clamp(29px,8.6vw,36px)] font-medium leading-[1.1] text-ink [text-wrap:balance]">{fill(site.question.sign)}</h2>
          </div>
          {/* the mascot's hands, holding the top of the sign */}
          <svg viewBox="0 0 310 200" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[200px] w-full" fill="none" aria-hidden>
            <g stroke="#ff9d3c" strokeWidth="6" strokeLinecap="round">
              <path d="M127 88Q104 90 100 114" /><path d="M183 88Q206 90 210 114" />
            </g>
            <circle cx="100" cy="118" r="8" fill="#ffb347" stroke="#d9962e" strokeWidth="1.200" />
            <circle cx="210" cy="118" r="8" fill="#ffb347" stroke="#d9962e" strokeWidth="1.200" />
          </svg>
        </m.div>

        {/* the line under the sign: fixed height, so nothing shifts when it changes */}
        <div className="mt-4 flex h-[3.4rem] w-full items-start justify-center" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={line}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${escapes === 0 ? 'font-display text-[1.1rem] italic text-ink-soft' : 'max-w-[24ch] font-hand text-[1.55rem] leading-[1.02] text-ruby-600'}`}
            >
              {line}
            </m.p>
          </AnimatePresence>
        </div>
      </div>

      <m.div
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: reduced ? 0 : 0.9, ease }}
        className="mt-5 flex items-center gap-4"
      >
        <m.button
          ref={yes}
          type="button"
          onClick={onYes}
          animate={{ scale: 1 + grow * 0.07 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          style={{ ['--g' as string]: grow }}
          className="yes-btn no-callout inline-flex h-14 w-44 items-center justify-center rounded-full border border-ruby-700/60 bg-gradient-to-b from-ruby-500 to-ruby-700 font-display text-[1.45rem] font-semibold tracking-wide text-cream-50 shadow-[0_10px_26px_-12px_rgba(126,18,38,0.9)] active:scale-[0.97]"
        >
          {site.question.yes}
        </m.button>
        <span ref={slot} aria-hidden className="block h-12 w-24" />
      </m.div>

      <RunawayButton
        label={site.question.no}
        slotRef={slot}
        avoidRefs={[hud, yes]}
        onEscape={setEscapes}
        reduced={reduced}
        showAfter={reduced ? 0 : 1.6}
      />
    </div>
  );
}
