import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { fill, site } from '../../config/site';
import {
  categories, formatPrice, menu, orderCount, orderGroups, orderTotal, reactionFor, specials, subcategoryNotes,
  type Category, type Dish, type Order,
} from '../../config/menu';
import { Button } from '../ui/Button';
import { DishIcon } from '../ui/DishIcons';
import { MascotArt } from '../ui/Illustrations';

const ease = [0.22, 0.61, 0.36, 1] as const;
const isSpecial = (id: string) => id === 'surprise' || id === 'decide';

function Check() {
  return (
    <m.span
      aria-hidden
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: [0, 1.25, 1], rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ruby-600 text-cream-50 shadow-[0_3px_8px_-2px_rgba(126,18,38,0.7)]"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.500 8.500l3 3 6-7" />
      </svg>
    </m.span>
  );
}

function DishCard({ dish, selected, onToggle }: { dish: Dish; selected: boolean; onToggle: () => void }) {
  return (
    <m.button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      animate={selected ? { scale: [1, 0.9, 1.05, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileTap={{ scale: 0.95 }}
      className={`no-callout card-paper relative flex flex-col items-center rounded-[16px] border px-3 pb-4 pt-5 text-center transition-colors duration-500 ${selected ? 'border-ruby-600 !bg-[#fdf0e4]' : 'border-gold-600/30'}`}
    >
      <AnimatePresence>{selected && <Check />}</AnimatePresence>
      <m.span
        className={`block h-[64px] w-[64px] transition-colors duration-500 ${selected ? 'text-ruby-600' : 'text-ink'}`}
        animate={selected ? { rotate: [0, -7, 5, 0] } : { rotate: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DishIcon name={dish.icon} className="h-full w-full" />
      </m.span>
      <span className="mt-3 font-display text-[1.12rem] font-semibold leading-[1.1] text-ink">{dish.name}</span>
      {dish.description && <span className="mt-1.5 line-clamp-4 font-sans text-[11px] leading-snug text-ink-soft">{dish.description}</span>}
      {site.menu.showPrices && <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gold-600">{formatPrice(dish.price)}</span>}
    </m.button>
  );
}

function SpecialCard({ id, selected, onToggle }: { id: 'surprise' | 'decide'; selected: boolean; onToggle: () => void }) {
  const s = specials[id];
  return (
    <m.button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      animate={selected ? { scale: [1, 0.92, 1.04, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileTap={{ scale: 0.95 }}
      className={`no-callout relative flex items-center gap-2.5 rounded-[14px] border border-dashed px-3 py-3 text-left transition-colors duration-500 ${selected ? 'border-ruby-600 bg-[#fdf0e4]' : 'border-gold-600/55 bg-cream-50/40'}`}
    >
      <AnimatePresence>{selected && <Check />}</AnimatePresence>
      <DishIcon name={s.icon} strokeWidth={1.7} className={`h-9 w-9 shrink-0 transition-colors duration-500 ${selected ? 'text-ruby-600' : 'text-ink'}`} />
      <span className="pr-5 font-display text-[1.02rem] font-semibold leading-[1.1] text-ink">{id === 'surprise' ? site.menu.surpriseLabel : site.menu.decideLabel}</span>
    </m.button>
  );
}

/** The list for one category: the two specials, then the dishes grouped by subcategory. */
function CategoryList({ cat, order, onToggle }: { cat: Category; order: Order; onToggle: (id: string) => void }) {
  const picked = order[cat.id] ?? [];
  const groups = useMemo(() => {
    const out: { name?: string; dishes: Dish[] }[] = [];
    for (const d of menu.filter((x) => x.category === cat.id)) {
      let g = out.find((x) => x.name === d.subcategory);
      if (!g) { g = { name: d.subcategory, dishes: [] }; out.push(g); }
      g.dishes.push(d);
    }
    return out;
  }, [cat.id]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <SpecialCard id="surprise" selected={picked.includes('surprise')} onToggle={() => onToggle('surprise')} />
        <SpecialCard id="decide" selected={picked.includes('decide')} onToggle={() => onToggle('decide')} />
      </div>
      {groups.map((g) => (
        <section key={g.name ?? 'all'} className="mt-7">
          {g.name && (
            <div className="mb-3 flex items-center gap-3">
              <h3 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-600">{g.name}</h3>
              <span className="h-px flex-1 bg-gold-600/30" />
            </div>
          )}
          {g.name && subcategoryNotes[g.name] && <p className="-mt-1 mb-3 font-display text-[0.95rem] italic text-ink-soft">{subcategoryNotes[g.name]}</p>}
          <div className="grid grid-cols-2 gap-3">
            {g.dishes.map((d) => (
              <DishCard key={d.id} dish={d} selected={picked.includes(d.id)} onToggle={() => onToggle(d.id)} />
            ))}
          </div>
        </section>
      ))}
      <p className="mt-8 text-center font-display text-sm italic text-ink-soft/70">That’s the whole {cat.label.toLowerCase()} menu.</p>
    </>
  );
}

function OrderSheet({ open, order, onRemove, onClose, onDone }: { open: boolean; order: Order; onRemove: (cat: Category['id'], id: string) => void; onClose: () => void; onDone: () => void }) {
  const groups = orderGroups(order);
  const count = orderCount(order);
  return (
    <AnimatePresence>
      {open && (
        <m.div className="absolute inset-0 z-40 flex items-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/35" />
          <m.div
            role="dialog"
            aria-label={site.menu.sheetTitle}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => { if (info.offset.y > 90) onClose(); }}
            className="card-paper relative flex max-h-[82%] w-full flex-col rounded-t-[26px] px-5 pb-[max(18px,env(safe-area-inset-bottom))] pt-3"
          >
            <span className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-ink/20" aria-hidden />
            <h3 className="font-display text-[1.7rem] font-medium leading-none text-ink">{site.menu.sheetTitle}</h3>
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              {count === 0 && <p className="py-6 text-center font-hand text-[1.4rem] text-ink-soft">{site.menu.sheetEmpty}</p>}
              {groups.map((g) => (
                <div key={g.category.id} className="mb-4">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-600">{g.category.label}</p>
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false}>
                      {g.items.map((it) => (
                        <m.li key={it.id} layout exit={{ opacity: 0, x: 30, height: 0 }} transition={{ duration: 0.3 }} className="flex items-center gap-3 rounded-xl bg-cream-50/70 px-3 py-2">
                          <DishIcon name={it.icon} className="h-8 w-8 shrink-0 text-ruby-600" />
                          <span className="flex-1 font-display text-[1.1rem] font-medium leading-tight text-ink">{it.name}</span>
                          {site.menu.showPrices && !it.special && <span className="text-[11px] text-ink-soft">{formatPrice(it.price)}</span>}
                          <button type="button" onClick={() => onRemove(g.category.id, it.id)} aria-label={`${site.menu.remove} ${it.name}`} className="no-callout flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink-soft active:scale-90">
                            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.800" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
                          </button>
                        </m.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              ))}
            </div>
            {site.menu.showPrices && count > 0 && (
              <p className="mt-1 flex justify-between border-t border-dashed border-gold-600/45 pt-3 font-display text-[1.2rem] text-ink">
                <span>{site.menu.total}</span><span className="font-semibold">{formatPrice(orderTotal(order))}</span>
              </p>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="ghost" onClick={onClose} className="whitespace-nowrap px-2 !tracking-[0.02em]">{site.menu.sheetBack}</Button>
              <Button onClick={onDone} disabled={count === 0} className="whitespace-nowrap px-2 !tracking-[0.02em] disabled:opacity-45">{site.menu.done}</Button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

/** 4. She builds her order from the real menu. Tabs, swipeable lists, a mascot with opinions. */
export function MenuBuilder({ order, onChange, onNext, reduced }: { order: Order; onChange: (o: Order) => void; onNext: () => void; reduced: boolean }) {
  const [tab, setTab] = useState(0);
  const [dir, setDir] = useState(1);
  const [sheet, setSheet] = useState(false);
  const [talk, setTalk] = useState<{ text: string; n: number } | null>(null);
  const talkTimer = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const cat = categories[tab];
  const count = orderCount(order);

  useEffect(() => () => window.clearTimeout(talkTimer.current), []);
  useEffect(() => { listRef.current?.scrollTo({ top: 0 }); }, [tab]);

  const say = (text: string) => {
    window.clearTimeout(talkTimer.current);
    setTalk((t) => ({ text, n: (t?.n ?? 0) + 1 }));
    talkTimer.current = window.setTimeout(() => setTalk(null), 4200);
  };

  const goTab = (i: number) => {
    if (i === tab || i < 0 || i >= categories.length) return;
    setDir(i > tab ? 1 : -1);
    setTab(i);
    if (navigator.vibrate) navigator.vibrate(8);
  };

  const toggle = (c: Category, id: string) => {
    const cur = order[c.id] ?? [];
    if (cur.includes(id)) {
      onChange({ ...order, [c.id]: cur.filter((x) => x !== id) });
      return;
    }
    let next: string[];
    if (isSpecial(id)) next = [id];
    else {
      const base = cur.filter((x) => !isSpecial(x));
      if (c.limit === 1) next = [id];
      else if (base.length >= c.limit) { say(site.menu.limitWarning); return; }
      else next = [...base, id];
    }
    onChange({ ...order, [c.id]: next });
    say(reactionFor(c.id, id));
    if (navigator.vibrate) navigator.vibrate(12);
  };

  const remove = (cid: Category['id'], id: string) => onChange({ ...order, [cid]: (order[cid] ?? []).filter((x) => x !== id) });

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * 48 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduced ? 0 : d * -48 }),
  };

  return (
    <div className="relative flex h-[calc(100svh-3.5rem)] w-full max-w-md flex-col">
      {/* title + mascot */}
      <div className="flex shrink-0 items-center gap-3 px-5 pb-1 pt-1">
        <m.div
          key={talk?.n ?? 0}
          className="h-[66px] w-[55px] shrink-0"
          initial={false}
          animate={talk && !reduced ? { scale: [1, 0.86, 1.1, 1], rotate: [0, -6, 4, 0] } : { scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <m.div animate={reduced ? undefined : { y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
            <MascotArt className="h-full w-full" />
          </m.div>
        </m.div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[1.9rem] font-medium leading-none text-ink">{site.menu.title}</h2>
          <div className="relative mt-1.5 h-[2.6rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={talk ? `t${talk.n}` : 'sub'}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className={talk ? 'font-hand text-[1.3rem] leading-[1.05] text-ruby-600' : 'font-display text-[1rem] italic leading-tight text-ink-soft'}
              >
                {talk ? talk.text : site.menu.subtitle}
              </m.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* category pills */}
      <div className="no-scrollbar shrink-0 overflow-x-auto px-5 py-2.5" role="tablist" aria-label="Menu categories">
        <div className="flex gap-2">
          {categories.map((c, i) => {
            const n = order[c.id]?.length ?? 0;
            const on = i === tab;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => goTab(i)}
                className={`no-callout relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-sans text-[13px] font-medium transition-colors duration-300 ${on ? 'border-ruby-700 bg-ruby-600 text-cream-50 shadow-[0_6px_16px_-8px_rgba(126,18,38,0.8)]' : 'border-gold-600/40 bg-cream-50/50 text-ink'}`}
              >
                {c.label}
                {n > 0 && (
                  <m.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${on ? 'bg-cream-50 text-ruby-600' : 'bg-ruby-600 text-cream-50'}`}>
                    {n >= c.limit ? '✓' : n}
                  </m.span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p className="shrink-0 px-5 pb-1 text-[10px] uppercase tracking-[0.3em] text-gold-600">{cat.hint}</p>

      {/* the list: swipe left and right between categories */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <m.div
            key={cat.id}
            ref={listRef}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease }}
            onTouchStart={(e) => { const t = e.touches[0]; swipe.current = { x: t.clientX, y: t.clientY }; }}
            onTouchEnd={(e) => {
              const s0 = swipe.current;
              swipe.current = null;
              if (!s0) return;
              const t = e.changedTouches[0];
              const dx = t.clientX - s0.x;
              const dy = t.clientY - s0.y;
              if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return; // a scroll, not a swipe
              goTab(tab + (dx < 0 ? 1 : -1));
            }}
            className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain px-5 pb-32 pt-2"
          >
            <CategoryList cat={cat} order={order} onToggle={(id) => toggle(cat, id)} />
          </m.div>
        </AnimatePresence>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#f6ecd9]/90 to-transparent" />
      </div>

      {/* floating order bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#f6ecd9] via-[#f6ecd9]/90 to-transparent px-5 pb-[max(14px,env(safe-area-inset-bottom))] pt-8">
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="no-callout flex h-12 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-ruby-600/50 bg-cream-50 px-3.5 font-sans text-[12.5px] font-medium text-ruby-700 shadow-[0_8px_20px_-12px_rgba(126,18,38,0.6)] active:scale-[0.97]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.700" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 9h14l-1.500 10h-11Z" /><path d="M9 9V7a3 3 0 0 1 6 0v2" /></svg>
            <m.span key={count} initial={reduced ? false : { scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
              {fill(site.menu.orderPill, { n: count })}
            </m.span>
          </button>
          <Button onClick={onNext} disabled={count === 0} className="flex-1 whitespace-nowrap px-3 !tracking-[0.03em] disabled:opacity-45">
            {site.menu.done}
          </Button>
        </div>
      </div>

      <OrderSheet open={sheet} order={order} onRemove={remove} onClose={() => setSheet(false)} onDone={() => { setSheet(false); onNext(); }} />
    </div>
  );
}
