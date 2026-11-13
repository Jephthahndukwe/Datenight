import { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { site } from '../../config/site';
import { Button } from '../ui/Button';
import { MascotArt } from '../ui/Illustrations';

const ease = [0.22, 0.61, 0.36, 1] as const;

/** 3. She said yes. The mascot jumps, the petals fly (the canvas burst is started by the app). */
export function Celebrate({ onNext, reduced }: { onNext: () => void; reduced: boolean }) {
  const [ready, setReady] = useState(reduced);
  useEffect(() => {
    if (reduced) return;
    const id = window.setTimeout(() => setReady(true), 2600);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <div className="flex w-full max-w-[350px] flex-col items-center text-center">
      <div className={`${reduced ? '' : 'jump'} w-[150px]`}>
        <MascotArt mood="joy" arms="up" className="w-full" />
      </div>
      <m.h2
        initial={reduced ? false : { opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, delay: reduced ? 0 : 0.25, ease: [0.3, 1.25, 0.5, 1] }}
        className="mt-8 font-display text-[clamp(38px,11.4vw,54px)] font-bold uppercase leading-[0.98] tracking-tight text-ruby-600 [text-wrap:balance]"
      >
        {site.celebrate.title}
      </m.h2>
      <m.p
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: reduced ? 0 : 1.0, ease }}
        className="mt-4 font-hand text-[1.9rem] leading-none text-ink"
      >
        {site.celebrate.sub}
      </m.p>
      <div className="mt-9 h-12">
        {ready && (
          <m.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}>
            <Button onClick={onNext}>{site.celebrate.next}</Button>
          </m.div>
        )}
      </div>
    </div>
  );
}
