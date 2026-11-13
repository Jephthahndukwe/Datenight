import type { ReactNode } from 'react';

/** All artwork is thin line-art in currentColor, so a single text colour class restyles it (gold, ink, wine). */
type P = { className?: string; strokeWidth?: number };

function Svg({ viewBox, className, strokeWidth = 1.4, children }: P & { viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/* ---------- the mascot: a tiny, friendly candle flame (60 x 72) ---------- */

export function MascotArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 72" className={className} aria-hidden>
      <defs>
        <linearGradient id="mf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff9d3c" />
          <stop offset="1" stopColor="#ffd96a" />
        </linearGradient>
      </defs>
      {/* little candle stub */}
      <rect x="20" y="52" width="20" height="16" rx="3" fill="#fbf4e4" stroke="#b8862b" strokeWidth="1.300" />
      <path d="M30 50v4" stroke="#6b3a45" strokeWidth="1.400" strokeLinecap="round" />
      {/* flame body */}
      <path d="M30 6C16 22 12 34 16 44c3 6 9 8 14 8s11-2 14-8c4-10 0-22-14-38Z" fill="url(#mf)" stroke="#d9962e" strokeWidth="1.300" strokeLinejoin="round" />
      <path d="M30 24c-6 8-8 14-5 19 2 3 5 4 5 4s3-1 5-4c3-5 1-11-5-19Z" fill="#fff4cf" opacity=".7" />
      {/* face */}
      <circle cx="24" cy="38" r="2" fill="#3a0f1c" />
      <circle cx="36" cy="38" r="2" fill="#3a0f1c" />
      <circle cx="23.500" cy="37.400" r=".6" fill="#fff" />
      <circle cx="35.500" cy="37.400" r=".6" fill="#fff" />
      <path d="M26 43c1.500 2.500 6.500 2.500 8 0" stroke="#3a0f1c" strokeWidth="1.400" strokeLinecap="round" fill="none" />
      <circle cx="19.500" cy="42" r="2.600" fill="#ff7a8a" opacity=".55" />
      <circle cx="40.500" cy="42" r="2.600" fill="#ff7a8a" opacity=".55" />
    </svg>
  );
}

/* ---------- the candle (160 x 260). The flame is drawn separately so it can light up. ---------- */

export function CandleArt({ className = '', strokeWidth = 1.5 }: P) {
  return (
    <Svg viewBox="0 0 160 260" className={className} strokeWidth={strokeWidth}>
      {/* dish */}
      <ellipse cx="80" cy="238" rx="58" ry="11" />
      <path d="M44 234c10 9 62 9 72 0" opacity=".6" />
      {/* body */}
      <path d="M57 234V96c0-8 6-13 13-13h20c7 0 13 5 13 13v138" />
      <path d="M57 96c8 6 38 6 46 0" />
      {/* drip + wick */}
      <path d="M92 99v18c0 5 8 5 8 0V99" opacity=".7" />
      <path d="M80 94V76" />
      {/* lines of light on the wax */}
      <path d="M66 120v90" opacity=".25" />
    </Svg>
  );
}

export function FlameArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 260" className={className} aria-hidden>
      <defs>
        <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ffb347" />
          <stop offset="1" stopColor="#ffe08a" />
        </linearGradient>
      </defs>
      <path d="M80 74C66 58 68 40 80 20c12 20 14 38 0 54Z" fill="url(#fl)" stroke="#d9962e" strokeWidth="1.2" />
      <path d="M80 68c-6-8-5-16 0-25 5 9 6 17 0 25Z" fill="#fff6d6" />
    </svg>
  );
}

/* ---------- two glasses, clinking (120 x 110) ---------- */

export function ClinkArt({ className = '', strokeWidth = 1.3 }: P) {
  const glass = (
    <>
      <path d="M-14 -44h28c2 22-2 38-14 44-12-6-16-22-14-44Z" />
      <path d="M-13 -26c9 5 17 5 26 0" opacity=".6" />
      <path d="M0 0v34M-11 42c6-6 16-6 22 0" />
    </>
  );
  return (
    <Svg viewBox="0 0 120 110" className={className} strokeWidth={strokeWidth}>
      <g transform="translate(38 62) rotate(12)">{glass}</g>
      <g transform="translate(82 62) rotate(-12)">{glass}</g>
      <path d="M60 8v9M50 11l4 7M70 11l-4 7M44 20l6 3M76 20l-6 3" opacity=".9" />
    </Svg>
  );
}
