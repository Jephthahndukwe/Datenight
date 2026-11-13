import { m } from 'framer-motion';

type Props = { className?: string; reduced?: boolean; delay?: number };

const draw = (reduced?: boolean, delay = 0) => ({
  initial: reduced ? false : { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { duration: reduced ? 0 : 2.4, delay, ease: [0.4, 0, 0.2, 1] as const },
});

/** Thin gold line-art wine glass. Draws itself once when it scrolls into view. */
export function WineGlassArt({ className = '', reduced, delay }: Props) {
  const a = draw(reduced, delay);
  return (
    <svg viewBox="0 0 60 120" className={className} fill="none" stroke="#d9a441" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <m.path d="M14 8h32c2 22-1 42-16 48C15 50 12 30 14 8z" {...a} />
      <m.path d="M16 30c8 4 20 4 28 0" {...a} />
      <m.path d="M30 56v46M18 108c6-5 18-5 24 0" {...a} />
    </svg>
  );
}

/** Thin gold line-art lemon sprig: a curved stem, six leaves and two lemons. */
export function LemonBranchArt({ className = '', reduced, delay }: Props) {
  const a = draw(reduced, delay);
  return (
    <svg viewBox="0 0 240 140" className={className} fill="none" stroke="#d9a441" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <m.path d="M6 14C60 18 118 40 160 84c14 14 28 30 40 46" {...a} />
      <m.path d="M44 20c4-14 18-18 30-14-2 12-14 18-30 14zM86 34c6-14 22-16 34-10-3 12-17 18-34 10zM122 56c10-10 26-8 34 0-6 10-22 12-34 0z" {...a} />
      <m.path d="M70 38c-6 14-20 20-34 16 4-12 18-18 34-16zM110 60c-8 12-22 16-34 10 6-12 20-16 34-10z" {...a} />
      <m.path d="M160 84c-4 10-4 20 0 28 10 2 20-8 20-20-4-6-12-10-20-8z" {...a} />
      <m.path d="M196 118c-2 8 0 16 6 20 8 0 14-8 12-18-4-4-12-6-18-2z" {...a} />
    </svg>
  );
}
