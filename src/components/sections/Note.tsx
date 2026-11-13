import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { fill, site } from '../../config/site';
import { Button } from '../ui/Button';

/** 3. A handwritten note that fades in line by line. */
export function Note({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const lines = site.note.lines;
  const step = 1.9; // seconds between lines
  const first = 1.0;
  const total = first + lines.length * step + 0.8;
  const [ready, setReady] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setReady(true), (total + 0.6) * 1000);
    return () => window.clearTimeout(id);
  }, [reduced, total]);

  const ease = [0.22, 0.61, 0.36, 1] as const;
  const fade = (i: number) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, delay: reduced ? 0 : first + i * step, ease },
  });

  return (
    <m.div
      className="flex w-full max-w-[350px] flex-col items-center"
      onPanEnd={(_, info) => { if (ready && info.offset.x < -70) onNext(); }}
      style={{ touchAction: 'pan-y' }}
    >
      <m.div
        initial={reduced ? false : { opacity: 0, y: 24, rotate: 1.5 }}
        animate={{ opacity: 1, y: 0, rotate: -0.6 }}
        transition={{ duration: 1.4, ease }}
        className="card-paper relative w-full rounded-[6px] px-7 pb-8 pt-9"
      >
        <m.p {...fade(-0.5)} className="font-script text-[3.1rem] leading-none text-ruby-600">{fill(site.note.greeting)}</m.p>
        <div className="mt-4 space-y-3.5">
          {lines.map((l, i) => (
            <m.p key={i} {...fade(i)} className="font-hand text-[1.5rem] leading-[1.22] text-ink">
              {fill(l)}
            </m.p>
          ))}
        </div>
        <m.p {...fade(lines.length)} className="mt-5 text-right font-script text-[2.5rem] leading-none text-ruby-600">{fill(site.note.signoff)}</m.p>
      </m.div>

      <div className="mt-7 h-12">
        {ready && (
          <m.div initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
            <Button onClick={onNext}>{site.note.next}</Button>
          </m.div>
        )}
      </div>
    </m.div>
  );
}
