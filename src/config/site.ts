/**
 * ONE FILE TO EDIT.
 * Every personal detail and every word on the page lives here: names, date, place,
 * the question, the runaway "No" lines, your letter, button labels, phone number.
 * Nothing in /components needs to be touched.
 *
 * After editing, run `npm run og` to regenerate the share preview image
 * (public/og.jpg) with her name on it.
 *
 * Placeholders you can use in any string: {her} {you} {date} {time}
 */

import { opening, pool } from './noLines';

export const site = {
  /** Her name. */
  herName: 'Naomi',

  /** Your first name. Used in "Send to {you}", the letter sign-off and the calendar event. */
  yourName: 'Jephthah',

  /**
   * Local date and time of the dinner, as YYYY-MM-DDTHH:mm (no timezone, so it
   * lands at the same wall-clock time wherever her phone is).
   */
  dateTime: '2026-11-28T19:30',
  durationMinutes: 150,
  /** BCP 47 locale used to format the date for display. */
  locale: 'en-GB',

  /** Step 1: the envelope. */
  envelope: {
    to: 'For {her}',
    hint: 'Tap to open',
  },

  /** Step 2: the question, held up on a sign by the mascot. */
  question: {
    sign: '{her}, will you go on a dinner date with me?',
    yes: 'Yes 💖',
    no: 'No',
    /** Shown under the sign before she tries to tap No. */
    idleLine: 'There is only one right answer 😌',
    /**
     * What the mascot says each time she tries to tap No: 580 lines in config/noLines.ts, so it never
     * runs out. The first few play in order, the rest are shuffled (and reshuffled if she gets through them all).
     */
    escape: { opening, pool },
  },

  /** Step 3: the celebration. */
  celebrate: {
    title: 'SHE SAID YES!! 🎉',
    sub: 'Best answer. Ever.',
    next: 'There’s a letter for you 💌',
  },

  /** Step 4: the letter, typed out after she says yes. */
  note: {
    greeting: '{her},',
    lines: [
      'You said yes, and I have been grinning at my screen like a fool ever since.',
      'Thank you for giving me an evening of your time. I promise to make every minute of it worth it.',
      'I am looking forward to your laugh, to long conversations that make us forget the time, and to watching you walk in, my queen, looking exactly like yourself.',
      'Wear something that makes you feel wonderful and sexy. I will be the one trying not to stare 😏',
    ],
    signoff: 'Yours, {you}',
    skipHint: 'tap to skip the typing',
    next: 'See our date',
  },

  /** Step 5: the confirmation ticket. */
  confirm: {
    eyebrow: 'Date confirmed 💌',
    guestLabel: 'Guest',
    party: 'Table for two',
    line: 'It’s a date, my queen.',
    dateLabel: 'Date',
    timeLabel: 'Time',
    calendar: 'Add to calendar',
    tell: 'Send to {you}',
    closing: 'See you soon.',
    stamp: 'Approved',
  },

  /** Digits only, with country code, no + or spaces. Your number: +234 906 893 7365. */
  whatsapp: {
    number: '2349068937365',
    /** Placeholders: {her} {date} {time} */
    message: 'Yes 💖 I’m in!\n\n📅 {date}\n🕖 {time}',
  },

  /** Wording inside the calendar file she downloads. */
  calendar: {
    title: 'Dinner with {you} 🕯️',
    description: 'A table for two. Wear something wonderful.',
    reminderSameDay: 'Dinner tonight',
    reminderDayBefore: 'Dinner tomorrow',
  },

  /**
   * Email-me-when-she-answers. Needs the /api/notify function and env vars on Vercel
   * (see README). Set `enabled: false` to remove the feature entirely; the front-end
   * will never call the endpoint.
   */
  notify: {
    enabled: true,
    endpoint: '/api/notify',
  },

  /** Used for og:url / og:image if Vercel's production URL is not available at build. */
  siteUrl: 'https://your-site.vercel.app',
} as const;

/* ---------- derived values (no need to edit) ---------- */

const when = new Date(site.dateTime);

export const derived = {
  title: `A little question for you, ${site.herName}`,
  description: `${site.yourName} has a question for you. It involves candlelight and a table for two.`,
  dateLong: new Intl.DateTimeFormat(site.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(when),
  dateShort: new Intl.DateTimeFormat(site.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(when),
  time: new Intl.DateTimeFormat(site.locale, { hour: 'numeric', minute: '2-digit', hour12: true })
    .format(when)
    .replace(/\s/g, '')
    .toLowerCase(),
};

/** Fill {you}, {her}, {date}, {time} in any config string. */
export function fill(text: string): string {
  return text
    .replaceAll('{you}', site.yourName)
    .replaceAll('{her}', site.herName)
    .replaceAll('{date}', derived.dateLong)
    .replaceAll('{time}', derived.time);
}
