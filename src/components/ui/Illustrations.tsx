import type { ReactNode } from 'react';
import type { IconName } from '../../config/site';

/** All artwork is thin line-art in currentColor, so a single text colour class restyles it (gold, ink, wine). */
type P = { className?: string; strokeWidth?: number };

function Svg({ viewBox, className, strokeWidth = 1.4, children }: P & { viewBox: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/* ---------- menu cards (64 x 64) ---------- */

const icons: Record<IconName, ReactNode> = {
  bruschetta: (
    <>
      <path d="M8 40C6 24 17 15 32 15s26 9 24 25c-.6 7-5.500 11-12 11H20c-6.500 0-11.400-4-12-11Z" />
      <path d="M13 38c1-9 9-15 19-15s18 6 19 15" opacity=".45" />
      <circle cx="23" cy="33" r="5.500" />
      <path d="M20 33h6M23 30v6" opacity=".5" />
      <circle cx="38" cy="30" r="5.500" />
      <path d="M35 30h6M38 27v6" opacity=".5" />
      <circle cx="45" cy="41" r="4.500" />
      <path d="M26 42c3-1 6 0 8 2-3 2-6 1-8-2Z" />
      <path d="M30 10c0 4 2 6 5 7 1-4-1-7-5-7Z" />
    </>
  ),
  garlic: (
    <>
      <rect x="6" y="26" width="46" height="16" rx="8" transform="rotate(-24 29 34)" />
      <path d="M20 22l6 14M29 18l6 14M38 14l6 14" opacity=".6" transform="translate(-2 3)" />
      <path d="M47 52c-7 0-8-5-5-9 3-3 4-4 5-8 1 4 2 5 5 8 3 4 2 9-5 9Z" />
      <path d="M47 52v-7" opacity=".5" />
    </>
  ),
  surprise: (
    <>
      <rect x="13" y="29" width="38" height="24" rx="2" />
      <rect x="10" y="22" width="44" height="8" rx="2" />
      <path d="M32 22v31" />
      <path d="M32 22c-4-9-14-10-14-4 0 5 9 5 14 4Zm0 0c4-9 14-10 14-4 0 5-9 5-14 4Z" />
      <path d="M52 10l1.500 3.500L57 15l-3.500 1.500L52 20l-1.500-3.500L47 15l3.500-1.500Z" />
    </>
  ),
  pasta: (
    <>
      <ellipse cx="30" cy="44" rx="25" ry="8" />
      <ellipse cx="30" cy="43" rx="17" ry="4.500" opacity=".5" />
      <path d="M15 41c3-14 27-14 30 0M19 39c3-9 19-9 22 0M24 37c2-5 10-5 12 0" />
      <path d="M54 10v16M50.500 10v8M57.500 10v8M54 26v14" />
    </>
  ),
  pizza: (
    <>
      <path d="M10 16c14-7 30-7 44 0L32 56Z" />
      <path d="M10 16c14-7 30-7 44 0" strokeWidth="2.800" opacity=".6" />
      <circle cx="26" cy="26" r="4" />
      <circle cx="39" cy="27" r="3.500" />
      <circle cx="32" cy="38" r="3.500" />
      <path d="M30 20l2 2M36 34l2 1" opacity=".6" />
    </>
  ),
  risotto: (
    <>
      <path d="M8 34h48c-1 14-11 20-24 20S9 48 8 34Z" />
      <path d="M13 34c3-13 35-13 38 0" />
      <path d="M22 29l1 1M30 25l1 1M38 28l1 1M27 31l1 1M35 31l1 1" opacity=".7" />
      <path d="M24 8c-4 4 0 6 0 10M32 6c-4 4 0 7 0 11M40 8c-4 4 0 6 0 10" opacity=".6" />
    </>
  ),
  tiramisu: (
    <>
      <path d="M10 30h40v20H10Z" />
      <path d="M10 37h40M10 44h40" opacity=".6" />
      <path d="M50 30l7-7v20l-7 7M10 30l7-7h40" />
      <path d="M20 26l2 2M30 25l2 2M40 26l2 2M25 22l2 2M36 22l2 2M46 24l2 2" opacity=".6" />
      <path d="M31 14c3 0 4 2 4 4s-2 3-4 3-4-1-4-3 1-4 4-4Z" />
    </>
  ),
  gelato: (
    <>
      <path d="M21 34l11 24 11-24" />
      <path d="M25 41l14 0M28 48l8 0M24 36l12 20M40 36L28 56" opacity=".5" />
      <path d="M19 34c-4-12 3-22 13-22s17 10 13 22c-3 4-6 1-6.500 0-2 3-5 3-6.500 0-1.500 3-5 3-6.500 0-1 1-4 4-6.500 0Z" />
      <path d="M32 12c0-3 2-5 5-6M30 8c-3-1-5 1-5 3s2 3 4 2" opacity=".7" />
    </>
  ),
  heart: (
    <>
      <path d="M32 54C8 38 9 16 23 16c6 0 9 4 9 7 0-3 3-7 9-7 14 0 15 22-9 38Z" />
      <path d="M17 23c0-3 2-5 5-5" opacity=".6" />
      <path d="M52 8v7M48.500 11.500h7M10 8v5M7.500 10.500h5" opacity=".8" />
    </>
  ),
};

export function MenuIcon({ name, className = '', strokeWidth = 1.4 }: P & { name: IconName }) {
  return (
    <Svg viewBox="0 0 64 64" className={className} strokeWidth={strokeWidth}>
      {icons[name]}
    </Svg>
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

/* ---------- a rose (60 x 110) ---------- */

export function RoseArt({ className = '', strokeWidth = 1.3 }: P) {
  return (
    <Svg viewBox="0 0 60 110" className={className} strokeWidth={strokeWidth}>
      <path d="M30 16c-9 0-15 7-14 15 1 8 10 13 17 9 6-4 4-12-3-12-4 0-6 4-3 6" />
      <path d="M16 31c-6-7-3-19 10-21 11-2 22 4 20 16-1 9-8 17-17 18" />
      <path d="M18 38c4 6 10 8 15 7" opacity=".6" />
      <path d="M30 45v60" />
      <path d="M30 72c-10-3-15-11-13-18 8 1 13 8 13 18Zm0 18c10-3 14-11 12-18-8 1-12 8-12 18Z" />
    </Svg>
  );
}
