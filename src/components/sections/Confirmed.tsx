import { m } from 'framer-motion';
import { fill, derived, menuSummary, pickedOptions, site, type Choice, type Picks } from '../../config/site';
import { downloadIcs } from '../../lib/ics';
import { whatsappUrl } from '../../lib/share';
import { Button, LinkButton } from '../ui/Button';
import { RoseArt } from '../ui/Illustrations';
import { Ornament } from '../ui/Ornament';

/** 6. Reservation confirmed, with her name, the date and her own menu. */
export function Confirmed({ choice, picks, reduced, fresh }: { choice: Choice; picks: Picks; reduced: boolean; fresh: boolean }) {
  const ease = [0.22, 0.61, 0.36, 1] as const;
  const rows = pickedOptions(picks);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.restaurant.name} ${site.restaurant.address}`)}`;
  const delay = fresh && !reduced ? 1.2 : 0; // let the petals fly first, then the card rises
  const show = (extra: number) => ({
    initial: fresh && !reduced ? { opacity: 0, y: 14 } : (false as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay: delay + extra, ease },
  });

  return (
    <m.div
      initial={fresh && !reduced ? { opacity: 0, y: 90 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay, ease }}
      className="flex w-full max-w-[350px] flex-col items-center"
    >
      <div className="card-paper relative w-full rounded-[8px] p-[9px]">
        <div className="rounded-[4px] border border-gold-600/45 px-5 pb-6 pt-6 text-center">
          <RoseArt className="mx-auto h-[52px] w-auto text-ruby-600" />
          <m.div
            aria-hidden
            initial={fresh && !reduced ? { opacity: 0, scale: 1.7, rotate: -4 } : false}
            animate={{ opacity: 0.88, scale: 1, rotate: -13 }}
            transition={{ duration: 0.7, delay: delay + 1.5, ease: [0.3, 1.2, 0.5, 1] }}
            className="pointer-events-none absolute right-2 top-2 rounded-[6px] border-2 border-ruby-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-ruby-600 mix-blend-multiply"
          >
            {site.confirm.stamp}
          </m.div>
          <p className="mt-3 text-[10px] uppercase tracking-[0.46em] text-gold-600">{site.confirm.eyebrow}</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.34em] text-ink-soft">{site.confirm.guestLabel}</p>
          <h2 className="font-script text-[3.4rem] leading-[0.95] text-ruby-600">{site.herName}</h2>
          <p className="mt-1 font-display text-[1.15rem] italic text-ink-soft">{site.confirm.party}</p>
          <p className="mx-auto mt-3 max-w-[22ch] font-hand text-[1.4rem] leading-[1.1] text-ink [text-wrap:balance]">{site.thanks[choice]}</p>
          <Ornament className="mx-auto mt-3 w-32" tone="ink" />

          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 text-left">
            <div>
              <dt className="text-[9px] uppercase tracking-[0.34em] text-ink-soft">{site.confirm.dateLabel}</dt>
              <dd className="mt-1 font-display text-[1.25rem] font-medium leading-tight text-ink">{derived.dateLong}</dd>
            </div>
            <div>
              <dt className="text-[9px] uppercase tracking-[0.34em] text-ink-soft">{site.confirm.timeLabel}</dt>
              <dd className="mt-1 font-display text-[1.25rem] font-medium leading-tight text-ink">{derived.time}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[9px] uppercase tracking-[0.34em] text-ink-soft">{site.confirm.whereLabel}</dt>
              <dd className="mt-1 font-display text-[1.25rem] font-medium leading-tight text-ink">{site.restaurant.name}</dd>
              <dd>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="font-sans text-[12px] text-ink-soft underline decoration-gold-600/50 underline-offset-4">{site.restaurant.address}</a>
              </dd>
            </div>
            {rows.length > 0 && (
              <div className="col-span-2 border-t border-dashed border-gold-600/45 pt-3">
                <dt className="text-[9px] uppercase tracking-[0.34em] text-ink-soft">{site.confirm.menuLabel}</dt>
                <dd className="mt-2 space-y-1.5">
                  {rows.map(({ course, option }) => (
                    <p key={course.id} className="flex items-baseline justify-between gap-3 font-display text-[1.1rem] leading-tight text-ink">
                      <span className="text-[10px] font-sans uppercase tracking-[0.28em] text-ink-soft">{course.name}</span>
                      <span className="font-medium">{option.label}</span>
                    </p>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <m.div {...show(0.9)} className="mt-6 flex w-full flex-col items-center gap-3">
        <Button className="w-full" onClick={() => downloadIcs(menuSummary(picks))}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
          {site.confirm.calendar}
        </Button>
        <LinkButton className="w-full" href={whatsappUrl(choice, picks)} target="_blank" rel="noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29z" /></svg>
          {fill(site.confirm.tell)}
        </LinkButton>
        <p className="mt-1 font-display text-base italic text-ink-soft">{site.confirm.closing}</p>
      </m.div>
    </m.div>
  );
}
