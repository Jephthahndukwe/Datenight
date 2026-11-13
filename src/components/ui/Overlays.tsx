import { useEffect, useRef } from 'react';

/** A tiny noise tile painted once on a canvas (cheap, no SVG filter, no blend mode). */
function makeGrain(): string | null {
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 160;
    const g = c.getContext('2d');
    if (!g) return null;
    const img = g.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() < 0.5 ? 255 : 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = Math.random() * 9;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  } catch {
    return null;
  }
}

/** Film grain + vignette. Both are fixed, pointer-transparent and GPU-composited. */
export function Overlays({ warm }: { warm: boolean }) {
  const grain = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!warm) return;
    const paint = () => {
      const url = makeGrain();
      if (url && grain.current) grain.current.style.backgroundImage = `url(${url})`;
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(paint, { timeout: 2500 }) : window.setTimeout(paint, 800);
    return () => {
      (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback?.(id);
      window.clearTimeout(id);
    };
  }, [warm]);
  return (
    <>
      <div ref={grain} className="grain" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  );
}
