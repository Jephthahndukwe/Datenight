export type Mood = 'happy' | 'plead' | 'sweat' | 'cry' | 'shy' | 'joy';

const DARK = '#3a0f1c';

/** The mascot's face for each mood (drawn in a 60 x 72 box). */
function Face({ mood }: { mood: Mood }) {
  const blush = (r: number, o: number) => (
    <>
      <circle cx="19.5" cy="42" r={r} fill="#ff7a8a" opacity={o} />
      <circle cx="40.5" cy="42" r={r} fill="#ff7a8a" opacity={o} />
    </>
  );
  switch (mood) {
    case 'plead':
      return (
        <>
          <path d="M19 31l7 -2.500M41 31l-7 -2.500" stroke={DARK} strokeWidth="1.300" strokeLinecap="round" />
          <circle cx="24" cy="38" r="3.800" fill={DARK} />
          <circle cx="36" cy="38" r="3.800" fill={DARK} />
          <circle cx="22.800" cy="36.500" r="1.400" fill="#fff" /><circle cx="25.300" cy="39.500" r=".7" fill="#fff" />
          <circle cx="34.800" cy="36.500" r="1.400" fill="#fff" /><circle cx="37.300" cy="39.500" r=".7" fill="#fff" />
          <path d="M27 45.500q3 -2.500 6 0" stroke={DARK} strokeWidth="1.400" strokeLinecap="round" fill="none" />
          {blush(2.600, 0.5)}
        </>
      );
    case 'sweat':
      return (
        <>
          <path d="M19 31.500l7 -1.500M41 31.500l-7 -1.500" stroke={DARK} strokeWidth="1.300" strokeLinecap="round" />
          <circle cx="24" cy="38" r="2" fill={DARK} /><circle cx="36" cy="38" r="2" fill={DARK} />
          <path d="M25 45q1.500 -2.500 3 0t3 0 3 0 2 0" stroke={DARK} strokeWidth="1.300" strokeLinecap="round" fill="none" />
          <path d="M45 24c-3 4-3 7 0 7s3-3 0-7Z" fill="#9fd8ff" stroke="#5aa7d8" strokeWidth=".8" />
          <path d="M14 30c-2 3-2 5 0 5s2-2 0-5Z" fill="#9fd8ff" stroke="#5aa7d8" strokeWidth=".8" />
          {blush(2.400, 0.3)}
        </>
      );
    case 'cry':
      return (
        <>
          <path d="M19 31l7 -3M41 31l-7 -3" stroke={DARK} strokeWidth="1.300" strokeLinecap="round" />
          <path d="M21 38.500q3 3.500 6 0M33 38.500q3 3.500 6 0" stroke={DARK} strokeWidth="1.500" strokeLinecap="round" fill="none" />
          <path d="M23 41c-2 4-2 8-1 12M37 41c2 4 2 8 1 12" stroke="#7cc4f5" strokeWidth="2.200" strokeLinecap="round" fill="none" opacity=".9" />
          <path d="M22 55c-2 3-2 5 0 5s2-2 0-5ZM38 55c-2 3-2 5 0 5s2-2 0-5Z" fill="#9fd8ff" stroke="#5aa7d8" strokeWidth=".7" />
          <ellipse cx="30" cy="46.500" rx="3.600" ry="3" fill={DARK} />
          <path d="M27.800 47.500q2.200 2 4.400 0" stroke="#ff7a8a" strokeWidth="1.600" strokeLinecap="round" fill="none" />
          {blush(2.800, 0.5)}
        </>
      );
    case 'shy':
      return (
        <>
          <path d="M20.500 38.500q3.500 -3.500 7 0M32.500 38.500q3.500 -3.500 7 0" stroke={DARK} strokeWidth="1.500" strokeLinecap="round" fill="none" />
          <path d="M27 44.500q3 2.600 6 0" stroke={DARK} strokeWidth="1.400" strokeLinecap="round" fill="none" />
          {blush(3.800, 0.85)}
          <path d="M47 24c-1.500-3-6-1.500-4 2l4 4 4-4c2-3.500-2.500-5-4-2Z" fill="#ff5d7a" opacity=".9" />
        </>
      );
    case 'joy':
      return (
        <>
          <path d="M20.500 39q3.500 -4.500 7 0M32.500 39q3.500 -4.500 7 0" stroke={DARK} strokeWidth="1.600" strokeLinecap="round" fill="none" />
          <path d="M24 43h12c0 5-3 8-6 8s-6-3-6-8Z" fill={DARK} />
          <path d="M27 48.500q3 2.500 6 0" stroke="#ff7a8a" strokeWidth="1.600" strokeLinecap="round" fill="none" />
          {blush(2.800, 0.6)}
        </>
      );
    default:
      return (
        <>
          <circle cx="24" cy="38" r="2" fill={DARK} /><circle cx="36" cy="38" r="2" fill={DARK} />
          <circle cx="23.500" cy="37.400" r=".6" fill="#fff" /><circle cx="35.500" cy="37.400" r=".6" fill="#fff" />
          <path d="M26 43c1.500 2.500 6.500 2.500 8 0" stroke={DARK} strokeWidth="1.400" strokeLinecap="round" fill="none" />
          {blush(2.600, 0.55)}
        </>
      );
  }
}

/** The mascot: a tiny, friendly candle flame (60 x 72). `arms="up"` raises both arms for joy. */
export function MascotArt({ className = '', mood = 'happy', arms = 'none' }: { className?: string; mood?: Mood; arms?: 'none' | 'up' }) {
  return (
    <svg viewBox="0 0 60 72" className={className} overflow="visible" aria-hidden>
      <defs>
        <linearGradient id="mf" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff9d3c" />
          <stop offset="1" stopColor="#ffd96a" />
        </linearGradient>
      </defs>
      {/* little candle stub */}
      <rect x="20" y="52" width="20" height="16" rx="3" fill="#fbf4e4" stroke="#b8862b" strokeWidth="1.300" />
      <path d="M30 50v4" stroke="#6b3a45" strokeWidth="1.400" strokeLinecap="round" />
      {arms === 'up' && (
        <g stroke="#ff9d3c" strokeWidth="4.500" strokeLinecap="round" fill="none">
          <path d="M16 46Q6 44 5 30" /><path d="M44 46Q54 44 55 30" />
          <circle cx="5" cy="28" r="3.600" fill="#ffb347" stroke="none" /><circle cx="55" cy="28" r="3.600" fill="#ffb347" stroke="none" />
        </g>
      )}
      {/* flame body */}
      <path d="M30 6C16 22 12 34 16 44c3 6 9 8 14 8s11-2 14-8c4-10 0-22-14-38Z" fill="url(#mf)" stroke="#d9962e" strokeWidth="1.300" strokeLinejoin="round" />
      <path d="M30 24c-6 8-8 14-5 19 2 3 5 4 5 4s3-1 5-4c3-5 1-11-5-19Z" fill="#fff4cf" opacity=".7" />
      <Face mood={mood} />
    </svg>
  );
}
