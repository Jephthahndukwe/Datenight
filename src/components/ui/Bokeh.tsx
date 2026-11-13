/** Soft, slow, warm bokeh. Pure CSS (transform + opacity only), so the main thread stays free. */
const far = [
  { x: 8, y: 62, s: 110, d: 22, o: 0.42, c: '255,196,110' },
  { x: 78, y: 70, s: 140, d: 26, o: 0.34, c: '255,176,96' },
  { x: 66, y: 34, s: 60, d: 19, o: 0.45, c: '255,214,140' },
  { x: 20, y: 26, s: 48, d: 24, o: 0.36, c: '255,206,130' },
  { x: 90, y: 20, s: 90, d: 28, o: 0.28, c: '255,170,120' },
  { x: 44, y: 84, s: 78, d: 21, o: 0.3, c: '255,190,110' },
  { x: 12, y: 92, s: 56, d: 17, o: 0.3, c: '240,150,110' },
  { x: 72, y: 10, s: 44, d: 23, o: 0.34, c: '255,220,150' },
];
const near = [
  { x: -8, y: 70, s: 230, d: 30, o: 0.2, c: '255,170,90' },
  { x: 74, y: 84, s: 280, d: 34, o: 0.16, c: '230,120,90' },
  { x: 60, y: 8, s: 190, d: 28, o: 0.14, c: '255,190,110' },
];

export function Bokeh({ variant = 'far' }: { variant?: 'far' | 'near' }) {
  const dots = variant === 'near' ? near : far;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((b, i) => (
        <span
          key={i}
          className="bokeh absolute block rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.s,
            height: b.s,
            opacity: b.o,
            background: `radial-gradient(circle, rgba(${b.c},0.85) 0%, rgba(${b.c},0.35) 38%, rgba(${b.c},0) 70%)`,
            animationDuration: `${b.d}s`,
            animationDelay: `${-i * 3.1}s`,
          }}
        />
      ))}
    </div>
  );
}
