import { m } from 'framer-motion';

const petals = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 37) % 100,
  delay: (i % 7) * 0.12,
  dur: 3.4 + (i % 5) * 0.5,
  rot: (i % 2 ? 1 : -1) * (180 + (i % 4) * 60),
  c: ['#a8142f', '#c42b45', '#d9475c', '#e8808c', '#f4c9c4'][i % 5],
  s: 12 + (i % 4) * 4,
}));

/** DOM-only rose petals for devices that skip WebGL. Cheap, short, transform-only. */
export function PetalFallback({ onDone }: { onDone: () => void }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {petals.map((p, i) => (
        <m.span
          key={i}
          className="absolute top-0 block rounded-[60%_40%_60%_40%]"
          style={{ left: `${p.x}%`, width: p.s, height: p.s * 1.3, background: p.c }}
          initial={{ y: '-10vh', opacity: 0, rotate: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: p.rot, x: [0, 24, -18, 10] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
          onAnimationComplete={i === petals.length - 1 ? onDone : undefined}
        />
      ))}
    </div>
  );
}
