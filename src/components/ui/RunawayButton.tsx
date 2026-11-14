import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { animate, m, useMotionValue } from 'framer-motion';

type Rect = { l: number; t: number; r: number; b: number };

const HEADER = 64; // the header strip: never a landing spot
const MARGIN = 14;
const CLEARANCE = 20; // breathing room around things it must not touch

const hit = (a: Rect, b: Rect) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
const inflate = (r: DOMRect, by: number): Rect => ({ l: r.left - by, t: r.top - by, r: r.right + by, b: r.bottom + by });

function safeInsets() {
  // read env(safe-area-inset-*) through a probe element
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';
  document.body.appendChild(probe);
  const cs = getComputedStyle(probe);
  const out = { t: parseFloat(cs.paddingTop) || 0, r: parseFloat(cs.paddingRight) || 0, b: parseFloat(cs.paddingBottom) || 0, l: parseFloat(cs.paddingLeft) || 0 };
  probe.remove();
  return out;
}

type Props = {
  label: string;
  /** an empty box where the button first sits, so the layout never shifts */
  slotRef: RefObject<HTMLElement | null>;
  /** things it must never land on: the Yes button, the sign, the mascot, the line under it */
  avoidRefs: RefObject<HTMLElement | null>[];
  onEscape: (count: number) => void;
  reduced: boolean;
  /** fade in once the screen has finished arriving */
  showAfter?: number;
};

/**
 * A "No" button that cannot be tapped. It leaps away on pointerdown / touchstart (before a click can
 * register), when a mouse gets close, and on keyboard focus. It always lands fully inside the visible
 * screen, inside the safe areas, and never on top of anything listed in `avoidRefs`.
 */
export function RunawayButton({ label, slotRef, avoidRefs, onEscape, reduced, showAfter = 1.8 }: Props) {
  const btn = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const rot = useMotionValue(0);
  const pos = useRef({ x: -300, y: -300 });
  const escapes = useRef(0);
  const last = useRef(0);
  const placed = useRef(false);
  const insets = useRef({ t: 0, r: 0, b: 0, l: 0 });
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => { insets.current = safeInsets(); }, []);

  // sit in the slot until the first escape (the slot moves while the screen animates in)
  useEffect(() => {
    let raf = 0;
    const track = () => {
      if (escapes.current === 0 && slotRef.current) {
        const r = slotRef.current.getBoundingClientRect();
        if (r.width > 0) {
          x.set(r.left); y.set(r.top);
          pos.current = { x: r.left, y: r.top };
          if (!placed.current) { placed.current = true; }
        }
        raf = requestAnimationFrame(track);
      }
    };
    track();
    const id = window.setTimeout(() => setVisible(true), showAfter * 1000);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(id); };
  }, [slotRef, x, y, showAfter]);

  const place = (px?: number, py?: number, count = true) => {
    const el = btn.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const ins = insets.current;
    const minX = ins.l + MARGIN;
    const maxX = vw - ins.r - MARGIN - w;
    const minY = ins.t + HEADER + MARGIN;
    const maxY = vh - ins.b - MARGIN - h;
    const forbid = avoidRefs.map((r) => r.current?.getBoundingClientRect()).filter((r): r is DOMRect => !!r).map((r) => inflate(r, CLEARANCE));

    const prevC = { x: pos.current.x + w / 2, y: pos.current.y + h / 2 };
    const score = (nx: number, ny: number) => {
      const c = { x: nx + w / 2, y: ny + h / 2 };
      const dPrev = Math.hypot(c.x - prevC.x, c.y - prevC.y);
      const dPtr = px === undefined || py === undefined ? 999 : Math.hypot(c.x - px, c.y - py);
      return Math.min(dPrev, dPtr * 0.9);
    };
    const ok = (nx: number, ny: number) => {
      const rect = { l: nx, t: ny, r: nx + w, b: ny + h };
      return !forbid.some((f) => hit(rect, f));
    };

    let best: { x: number; y: number; s: number } | null = null;
    const consider = (nx: number, ny: number) => {
      if (nx < minX || nx > maxX || ny < minY || ny > maxY || !ok(nx, ny)) return;
      const s = score(nx, ny);
      if (!best || s > best.s) best = { x: nx, y: ny, s };
    };
    // random tries first: that is what makes it feel unpredictable
    for (let i = 0; i < 70; i++) consider(minX + Math.random() * Math.max(0, maxX - minX), minY + Math.random() * Math.max(0, maxY - minY));
    // if the screen is crowded (a huge Yes button), scan the whole safe area on a grid
    if (!best) for (let gx = minX; gx <= maxX; gx += 16) for (let gy = minY; gy <= maxY; gy += 16) consider(gx, gy);
    const target = best ?? { x: Math.min(Math.max(pos.current.x, minX), maxX), y: Math.min(Math.max(pos.current.y, minY), maxY), s: 0 };

    pos.current = { x: target.x, y: target.y };
    if (reduced) {
      x.set(target.x); y.set(target.y); rot.set(0);
    } else {
      const spring = { type: 'spring' as const, stiffness: 560, damping: 24, mass: 0.7 };
      animate(x, target.x, spring);
      animate(y, target.y, spring);
      rot.set((Math.random() - 0.5) * 36);
      animate(rot, 0, { type: 'spring', stiffness: 260, damping: 12 });
    }
    if (count) {
      escapes.current += 1;
      onEscape(escapes.current);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  // every way of "pressing" it makes it run, before a click can ever register
  useEffect(() => {
    const el = btn.current;
    if (!el) return;
    const run = (e: Event, px?: number, py?: number) => {
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      if (now - last.current < 140) return; // pointerdown + touchstart both fire on phones
      last.current = now;
      place(px, py);
    };
    const onPointerDown = (e: PointerEvent) => run(e, e.clientX, e.clientY);
    const onTouchStart = (e: TouchEvent) => run(e, e.touches[0]?.clientX, e.touches[0]?.clientY);
    const onMouseDown = (e: MouseEvent) => run(e, e.clientX, e.clientY);
    const swallow = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') run(e); };
    const onFocus = (e: Event) => run(e);
    el.addEventListener('pointerdown', onPointerDown, { capture: true });
    el.addEventListener('touchstart', onTouchStart, { passive: false, capture: true }); // non-passive so preventDefault also cancels the click
    el.addEventListener('mousedown', onMouseDown, { capture: true });
    el.addEventListener('click', swallow, { capture: true }); // the click handler can never fire
    el.addEventListener('keydown', onKey);
    el.addEventListener('focus', onFocus);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown, { capture: true });
      el.removeEventListener('touchstart', onTouchStart, { capture: true });
      el.removeEventListener('mousedown', onMouseDown, { capture: true });
      el.removeEventListener('click', swallow, { capture: true });
      el.removeEventListener('keydown', onKey);
      el.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // desktop: run when the cursor gets close, not just on hover
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !placed.current) return;
      const el = btn.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) > 96) return;
      const now = performance.now();
      if (now - last.current < 160) return;
      last.current = now;
      place(e.clientX, e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep it on screen if the phone rotates or the window changes size
  useEffect(() => {
    const onResize = () => { insets.current = safeInsets(); if (escapes.current > 0) place(undefined, undefined, false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createPortal(
    <m.button
      ref={btn}
      type="button"
      tabIndex={-1}
      style={{ position: 'fixed', left: 0, top: 0, x, y, rotate: rot, touchAction: 'none', zIndex: 50 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="no-callout flex h-12 w-24 items-center justify-center rounded-full border border-ink/30 bg-cream-50/80 font-sans text-[14px] font-medium text-ink-soft will-change-transform"
    >
      {label}
    </m.button>,
    document.body,
  );
}
