import { useEffect, useMemo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { fill, site } from '../../config/site';
import { Button } from '../ui/Button';
import { MascotArt } from '../ui/Illustrations';

const ease = [0.22, 0.61, 0.36, 1] as const;

type Seg = { text: string; className: string };

/** 4. Her reward: your letter, typed out gently, with a shy, blushing mascot peeking over the card. */
export function Note({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const segs: Seg[] = useMemo(
    () => [
      { text: fill(site.note.greeting), className: 'font-script text-[3.1rem] leading-none text-ruby-600' },
      ...site.note.lines.map((l) => ({ text: fill(l), className: 'mt-3.5 block font-hand text-[1.5rem] leading-[1.22] text-ink' })),
      { text: fill(site.note.signoff), className: 'mt-5 block text-right font-script text-[2.5rem] leading-none text-ruby-600' },
    ],
    [],
  );
  const total = useMemo(() => segs.reduce((n, s) => n + s.text.length, 0), [segs]);
  const [count, setCount] = useState(reduced ? total : 0);
  const done = count >= total;
  const timer = useRef<number>(0);

  // a gentle typewriter: steady, with small pauses at commas and longer ones at full stops
  useEffect(() => {
    if (reduced || count >= total) return;
    let seen = 0;
    let prev = ' ';
    for (const s of segs) {
      if (count < seen + s.text.length) { prev = s.text[count - seen - 1] ?? ' '; break; }
      seen += s.text.length;
      prev = s.text[s.text.length - 1];
    }
    const delay = count === 0 ? 900 : /[.!?]/.test(prev) ? 420 : /[,;]/.test(prev) ? 190 : 30 + Math.random() * 20;
    timer.current = window.setTimeout(() => setCount((c) => c + 1), delay);
    return () => window.clearTimeout(timer.current);
  }, [count, total, segs, reduced]);

  // keep the caret in view as the letter grows past the bottom of a short screen
  useEffect(() => {
    if (reduced || count % 24 !== 0) return;
    document.querySelector('.caret')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [count, reduced]);

  let offset = 0;
  return (
    <div className="flex w-full max-w-[350px] flex-col items-center">
      <m.div
        initial={reduced ? false : { opacity: 0, y: 24, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -0.5 }}
        transition={{ duration: 1.2, ease }}
        className="relative mt-12 w-full"
      >
        {/* the shy mascot, peeking over the top of the card */}
        <m.div
          className="absolute -top-[66px] right-5 z-0 w-[80px]"
          initial={reduced ? false : { y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, delay: reduced ? 0 : 0.8, ease }}
        >
          <MascotArt mood="shy" className="w-full" />
        </m.div>
        <button
          type="button"
          onClick={() => setCount(total)}
          aria-label={site.note.skipHint}
          className="card-paper relative z-10 block w-full cursor-default rounded-[6px] px-7 pb-8 pt-9 text-left"
        >
          {segs.map((s, i) => {
            const start = offset;
            offset += s.text.length;
            const shown = Math.max(0, Math.min(s.text.length, count - start));
            const typing = !done && count >= start && count < start + s.text.length;
            // the whole text is always laid out (the untyped part invisible), so the card never grows as it types
            return (
              <span key={i} className={s.className}>
                <span>{s.text.slice(0, shown)}</span>
                {typing && <span className="caret" aria-hidden />}
                <span className="opacity-0" aria-hidden={true}>{s.text.slice(shown)}</span>
              </span>
            );
          })}
        </button>
      </m.div>

      <div className="mt-6 h-12 text-center">
        {done ? (
          <m.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
            <Button onClick={onNext}>{site.note.next}</Button>
          </m.div>
        ) : (
          <p className="pt-3 font-display text-[0.95rem] italic text-ink-soft/60">{site.note.skipHint}</p>
        )}
      </div>
    </div>
  );
}
