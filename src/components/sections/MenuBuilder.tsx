import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { fill, pickedOptions, site, type MenuCourse, type Picks } from '../../config/site';
import { Button } from '../ui/Button';
import { MenuIcon } from '../ui/Illustrations';
import { Ornament } from '../ui/Ornament';

const ease = [0.22, 0.61, 0.36, 1] as const;

/** A few tiny gold sparks that drift out of the card she picked. */
function Sparks() {
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <m.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[38%] h-1.5 w-1.5 rounded-full bg-gold-500"
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
            animate={{ x: Math.cos(a) * 46, y: Math.sin(a) * 46 - 8, opacity: 0, scale: 0.3 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
          />
        );
      })}
    </>
  );
}

function Course({ course, index, total, picked, onPick, reduced }: { course: MenuCourse; index: number; total: number; picked?: string; onPick: (id: string) => void; reduced: boolean }) {
  const chosen = course.options.find((o) => o.id === picked);
  return (
    <m.div
      key={course.id}
      initial={reduced ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.8, ease }}
      className="flex w-full max-w-[350px] flex-col items-center text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.42em] text-gold-600">{fill(site.menu.courseLabel, { n: index + 1, total })}</p>
      <h2 className="mt-2 font-display text-[2.6rem] font-medium leading-none text-ink">{course.name}</h2>
      <p className="mt-2 font-display text-[1.1rem] italic text-ink-soft">{course.prompt}</p>

      <div className="mt-7 grid w-full grid-cols-3 gap-3">
        {course.options.map((o) => {
          const on = picked === o.id;
          const dim = !!picked && !on;
          return (
            <m.button
              key={o.id}
              type="button"
              disabled={!!picked}
              onClick={() => onPick(o.id)}
              aria-pressed={on}
              animate={{ opacity: dim ? 0.45 : 1, scale: on ? 1.04 : dim ? 0.97 : 1, y: on ? -4 : 0 }}
              transition={{ duration: 0.7, ease }}
              whileTap={picked ? undefined : { scale: 0.96 }}
              className={`no-callout card-paper relative flex aspect-[3/4.4] flex-col items-center justify-between rounded-[12px] border px-1.5 pb-3 pt-4 transition-colors duration-500 ${on ? 'border-ruby-600' : 'border-gold-600/35'}`}
            >
              <m.span
                className={`block w-[82%] transition-colors duration-500 ${on ? 'text-ruby-600' : 'text-ink'}`}
                animate={on && !reduced ? { scale: [1, 1.16, 1], rotate: [0, -4, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
              >
                <MenuIcon name={o.icon} strokeWidth={1.7} className="h-full w-full" />
              </m.span>
              <span className={`font-display text-[1.02rem] font-medium leading-tight ${on ? 'text-ruby-600' : 'text-ink'}`}>{o.label}</span>
              {on && !reduced && <Sparks />}
            </m.button>
          );
        })}
      </div>

      <div className="mt-6 flex h-[4.6rem] items-start justify-center">
        <AnimatePresence mode="wait">
          {chosen && (
            <m.p key={chosen.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, delay: 0.4, ease }} className="max-w-[26ch] font-hand text-[1.55rem] leading-[1.15] text-ruby-600">
              {chosen.reaction}
            </m.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex gap-2" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-ruby-600' : i < index ? 'w-1.5 bg-ruby-600/60' : 'w-1.5 bg-ink/20'}`} />
        ))}
      </div>
    </m.div>
  );
}

function Summary({ picks, onNext, reduced }: { picks: Picks; onNext: () => void; reduced: boolean }) {
  const rows = pickedOptions(picks);
  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease }}
      className="flex w-full max-w-[340px] flex-col items-center"
    >
      <div className="card-paper w-full rounded-[8px] p-[9px]">
        <div className="rounded-[4px] border border-gold-600/45 px-6 pb-7 pt-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold-600">{site.menu.doneEyebrow}</p>
          <p className="mt-3 font-script text-[2.7rem] leading-none text-ruby-600">{fill(site.menu.doneTitle)}</p>
          <Ornament className="mx-auto mt-3 w-36" tone="ink" />
          <ul className="mt-5 space-y-4">
            {rows.map(({ course, option }, i) => (
              <m.li key={course.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.5 + i * 0.35, ease }} className="flex items-center gap-3 text-left">
                <MenuIcon name={option.icon} className="h-11 w-11 shrink-0 text-ruby-600" />
                <span>
                  <span className="block text-[10px] uppercase tracking-[0.34em] text-ink-soft">{course.name}</span>
                  <span className="block font-display text-[1.5rem] font-medium leading-tight text-ink">{option.label}</span>
                </span>
              </m.li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-7">
        <Button onClick={onNext}>{site.menu.next}</Button>
      </div>
    </m.div>
  );
}

/** 4. She builds the menu: one illustrated card per course, a cheeky reaction after each pick. */
export function MenuBuilder({ picks, onPick, onNext, reduced }: { picks: Picks; onPick: (course: string, option: string) => void; onNext: () => void; reduced: boolean }) {
  const courses = site.menu.courses;
  const firstOpen = courses.findIndex((c) => !picks[c.id]);
  const [idx, setIdx] = useState(firstOpen === -1 ? courses.length : firstOpen);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pick = (course: MenuCourse, option: string) => {
    onPick(course.id, option);
    if (navigator.vibrate) navigator.vibrate(14);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setIdx((i) => i + 1), reduced ? 1400 : 2900);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {idx < courses.length ? (
        <Course key={courses[idx].id} course={courses[idx]} index={idx} total={courses.length} picked={picks[courses[idx].id]} onPick={(o) => pick(courses[idx], o)} reduced={reduced} />
      ) : (
        <Summary key="summary" picks={picks} onNext={onNext} reduced={reduced} />
      )}
    </AnimatePresence>
  );
}
