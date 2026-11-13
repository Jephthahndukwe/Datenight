/** Soft, slow, warm bokeh. Pure CSS (transform + opacity only), so the main thread stays free. */
const dots = [
  { x: 8, y: 62, s: 120, d: 22, o: 0.5, c: '255,196,110' },
  { x: 78, y: 70, s: 150, d: 26, o: 0.42, c: '255,176,96' },
  { x: 62, y: 38, s: 70, d: 19, o: 0.5, c: '255,214,140' },
  { x: 24, y: 28, s: 56, d: 24, o: 0.4, c: '255,206,130' },
  { x: 90, y: 22, s: 96, d: 28, o: 0.32, c: '255,170,120' },
  { x: 44, y: 82, s: 84, d: 21, o: 0.36, c: '255,190,110' },
  { x: 14, y: 90, s: 64, d: 17, o: 0.34, c: '240,150,110' },
  { x: 70, y: 12, s: 48, d: 23, o: 0.38, c: '255,220,150' },
];

export function Bokeh() {
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
