import { site, derived, fill, clock } from '../config/site';

const pad = (n: number) => String(n).padStart(2, '0');

/** Floating local time: YYYYMMDDTHHMMSS (no Z), so it lands at 19:30 wherever she is. */
function fmtLocal(d: Date) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}
function fmtUtc(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** RFC 5545 line folding at 75 octets (approximated with characters; fine for our ASCII-ish copy). */
function fold(line: string) {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    out.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  out.push(rest);
  return out.join('\r\n');
}

/** The event starts when she is picked up and ends when dinner does. */
export function buildIcs(pickup: string): string {
  const dinner = new Date(site.dateTime);
  const [h, m] = pickup.split(':').map(Number);
  const start = new Date(dinner);
  start.setHours(h, m, 0, 0);
  const end = new Date(dinner.getTime() + site.durationMinutes * 60_000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dinner for Two//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:dinner-${fmtLocal(start)}@dinner-for-two`,
    `DTSTAMP:${fmtUtc(new Date())}`,
    `DTSTART:${fmtLocal(start)}`,
    `DTEND:${fmtLocal(end)}`,
    `SUMMARY:${esc(fill(site.calendar.title))}`,
    `LOCATION:${esc(`${site.restaurant.name}, ${site.restaurant.area}, ${site.restaurant.address}`)}`,
    `DESCRIPTION:${esc(fill(site.calendar.description, { pickup: clock(pickup) }))}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(site.calendar.reminderSameDay)}`,
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(site.calendar.reminderDayBefore)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadIcs(pickup: string) {
  const blob = new Blob([buildIcs(pickup)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dinner-for-two.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export const whenLabel = `${derived.dateLong}, ${derived.time}`;
