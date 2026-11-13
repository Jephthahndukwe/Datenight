/** Hairline divider with a tiny olive sprig in the middle. */
export function Ornament({ className = '', tone = 'gold' }: { className?: string; tone?: 'gold' | 'ink' }) {
  const c = tone === 'gold' ? '#d9a441' : '#7a5a2a';
  return (
    <svg viewBox="0 0 220 24" className={className} aria-hidden fill="none" stroke={c} strokeWidth="1" strokeLinecap="round">
      <path d="M0 12h86M134 12h86" opacity=".55" />
      <path d="M110 19V6" />
      <path d="M110 15c-6-1-9-4-9-8 5 0 9 3 9 8zM110 11c6-1 9-4 9-8-5 0-9 3-9 8zM110 17c-5 0-8 2-9 5 4 0 8-1 9-5zM110 17c5 0 8 2 9 5-4 0-8-1-9-5z" fill={c} fillOpacity=".25" />
    </svg>
  );
}
