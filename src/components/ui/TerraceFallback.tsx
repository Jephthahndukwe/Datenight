/** Static illustration of the terrace for devices without WebGL / low-power mode (and while the 3D scene loads). */
export function TerraceFallback() {
  const bulbs = Array.from({ length: 15 }, (_, i) => {
    const u = (i / 14) * 2 - 1;
    return { x: 200 + u * 196, y: 80 + 64 * (1 - u * u) };
  });
  return (
    <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="tf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#150b33" />
          <stop offset="0.2" stopColor="#3e2166" />
          <stop offset="0.32" stopColor="#7a3a72" />
          <stop offset="0.38" stopColor="#c0506a" />
          <stop offset="0.43" stopColor="#e8895a" />
        </linearGradient>
        <linearGradient id="tf-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a4458" />
          <stop offset="0.2" stopColor="#3a2a5c" />
          <stop offset="1" stopColor="#1d1840" />
        </linearGradient>
        <radialGradient id="tf-glow"><stop offset="0" stopColor="#ffd48a" stopOpacity=".95" /><stop offset=".4" stopColor="#ffa850" stopOpacity=".3" /><stop offset="1" stopColor="#ff9040" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="700" fill="url(#tf-sky)" />
      <rect y="300" width="400" height="400" fill="url(#tf-sea)" />
      <path d="M0 300l34-26 30 14 40-40 46 52 40-20 24 20H0z" fill="#33203f" />
      <path d="M270 300l40-12 50 6 40 6z" fill="#3a2850" />
      <g fill="#ffc872" opacity=".8">{[30, 52, 70, 88, 104, 120].map((x, i) => <circle key={x} cx={x} cy={282 + (i % 3) * 5} r="1.2" />)}</g>
      <g opacity=".5" stroke="#ffc98a" strokeWidth="1.2" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${70 + i * 6} ${312 + i * 11}h${30 - i * 3}`} />)}
      </g>
      {/* terrace floor, parapet */}
      <rect y="420" width="400" height="280" fill="#7a3a28" />
      <rect y="366" width="400" height="56" fill="#cfa57a" />
      <rect y="358" width="400" height="10" fill="#ecd5ae" />
      {/* string lights */}
      <path d="M4 80 Q200 208 396 80" stroke="#1b0d0d" strokeWidth="1.2" fill="none" />
      {bulbs.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y + 2} r="9" fill="url(#tf-glow)" />
          <circle cx={b.x} cy={b.y + 2} r="1.8" fill="#fff1cf" />
        </g>
      ))}
      {/* table for two */}
      <circle cx="200" cy="430" r="140" fill="url(#tf-glow)" opacity=".4" />
      <path d="M130 468l-14 58h168l-14-58z" fill="#e8dbbc" />
      <ellipse cx="200" cy="468" rx="76" ry="12" fill="#f4ead2" />
      <rect x="191" y="410" width="18" height="56" rx="2" fill="#f4ead2" />
      <path d="M200 380c9 12 11 20 6 27-1 1.5-3.5 2.5-6 2.5s-5-1-6-2.5c-5-7-3-15 6-27z" fill="#ffb347" />
      <path d="M156 440c4 0 6 8 6 14l-5 .8c-3-4-3-10-1-14.800zM244 440c-4 0-6 8-6 14l5 .8c3-4 3-10 1-14.800z" fill="#8a1636" opacity=".85" />
      <rect x="92" y="436" width="8" height="58" rx="2" fill="#566330" />
      <rect x="300" y="436" width="8" height="58" rx="2" fill="#566330" />
    </svg>
  );
}
