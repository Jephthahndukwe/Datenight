/** Pure CSS/SVG candle. Shows instantly (LCP-friendly), and is the permanent fallback without WebGL. */
export function StaticCandle({ lit, className = '' }: { lit: boolean; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 flex justify-center ${className}`} aria-hidden>
      <svg viewBox="0 0 200 420" className="h-full w-auto overflow-visible">
        <defs>
          <radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe6a0" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#ffb85a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff9040" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="wax" x1="0" x2="1">
            <stop offset="0" stopColor="#d9c9a4" />
            <stop offset="0.45" stopColor="#f6ecd2" />
            <stop offset="1" stopColor="#cdb98f" />
          </linearGradient>
          <linearGradient id="brass" x1="0" x2="1">
            <stop offset="0" stopColor="#8c6422" />
            <stop offset="0.5" stopColor="#e0b052" />
            <stop offset="1" stopColor="#8c6422" />
          </linearGradient>
        </defs>
        <g style={{ opacity: lit ? 1 : 0, transition: 'opacity 1.6s ease' }}>
          <circle cx="100" cy="92" r="150" fill="url(#cg)" className="glow-breathe" style={{ transformOrigin: '100px 92px' }} />
        </g>
        <ellipse cx="100" cy="398" rx="78" ry="14" fill="url(#brass)" />
        <ellipse cx="100" cy="392" rx="58" ry="9" fill="#e0b052" />
        <rect x="70" y="150" width="60" height="244" rx="3" fill="url(#wax)" />
        <ellipse cx="100" cy="150" rx="30" ry="6" fill="#fff0cc" />
        <rect x="98.500" y="128" width="3" height="24" rx="1.500" fill="#1a0d08" />
        <g className="flame" style={{ opacity: lit ? 1 : 0, transition: 'opacity 1.4s ease 0.2s', transformOrigin: '100px 130px' }}>
          <path d="M100 66c15 20 19 34 10 48-3 5-6 8-10 8s-7-3-10-8c-9-14-5-28 10-48z" fill="#ffb347" />
          <path d="M100 92c7 11 9 19 4 26-1.500 2.500-3 3.500-4 3.500s-2.500-1-4-3.500c-5-7-3-15 4-26z" fill="#fff4d0" />
        </g>
      </svg>
    </div>
  );
}
