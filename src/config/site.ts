/**
 * ONE FILE TO EDIT.
 * Every personal detail and every word on the page lives here: names, date, place,
 * your note, the pickup times, button labels, thank-you
 * messages, phone number. Nothing in /components needs to be touched.
 *
 * After editing, run `npm run og` to regenerate the share preview image
 * (public/og.jpg) with her name on it.
 *
 * Placeholders you can use in any string: {her} {you} {when} {where} {date} {pickup}
 */

export type Choice = 'yes' | 'obviously';

export const site = {
  /** Her name. */
  herName: 'Naomi',

  /** Your first name. Used in "Tell {you}", the note sign-off and the calendar event. */
  yourName: 'Chika',

  /**
   * Local date and time of the dinner, as YYYY-MM-DDTHH:mm (no timezone, so it
   * lands at the same wall-clock time wherever her phone is).
   */
  dateTime: '2026-11-28T19:30',
  durationMinutes: 150,
  /** BCP 47 locale used to format the date for display. */
  locale: 'en-GB',

  restaurant: {
    name: 'Mila Kitchen & Cocktail Bar',
    area: 'Akoka',
    address: 'Lagos Mainland',
  },

  /** Step 1: the reservation card on the dark opening screen. */
  arrival: {
    eyebrow: 'Reservation for',
    party: 'Table for two',
    detail: 'One night only',
    button: 'Come in',
    /** Small label at the top of every later screen. */
    headerLabel: 'Reserved for {her}',
  },

  /** Step 2: lighting the candle. */
  candle: {
    prompt: 'Tap to light the candle',
    lit: 'There. That’s better.',
    next: 'Continue',
  },

  /** Step 3: your handwritten note. Fades in line by line. */
  note: {
    greeting: '{her},',
    lines: [
      'I have been thinking about a table for two, a candle, and you sitting across from me.',
      'So I made a reservation. It is the best table in the house, and it has your name on it.',
      'But first, my queen, I need your help with one small detail of the plan.',
    ],
    signoff: 'Yours, {you}',
    next: 'Continue',
  },

  /**
   * Step 4: she picks a pickup time. `time` is 24h HH:mm on the dinner date above;
   * `reaction` is the mascot's cheeky line when she taps it.
   */
  pickup: {
    title: 'When should I pick you up?',
    subtitle: 'Pick a time. I will be on time, promise.',
    next: 'Confirm our date',
    options: [
      { time: '17:30', reaction: 'Super early. Traffic-proof, smart queen 🚗' },
      { time: '18:00', reaction: 'Perfect. Plenty of time to look amazing ✨' },
      { time: '18:15', reaction: 'A quarter past six. Precise. I like it.' },
      { time: '18:30', reaction: 'Just right. Not early, not late 😌' },
      { time: '18:45', reaction: 'Cutting it close. I like a little drama 😏' },
      { time: '19:00', reaction: 'Living dangerously, my queen. Traffic is watching 👀' },
    ],
  },

  /** Step 5: the big question. */
  question: {
    headline: 'So, my queen… will you have dinner with me?',
    yesPrimary: 'Yes',
    yesSecondary: 'Obviously yes',
    underline: 'I made this easy for you.',
    easterEgg: "Take your time, the candle's still burning 🕯️",
  },

  /** Thank-you line shown depending on which button she tapped. */
  thanks: {
    yes: 'Perfect. It’s a date, my queen.',
    obviously: 'I knew you had great taste, my queen.',
  } satisfies Record<Choice, string>,

  /** Step 6: the confirmation ticket. */
  confirm: {
    eyebrow: 'Date confirmed 💌',
    guestLabel: 'Guest',
    party: 'Table for two',
    dateLabel: 'Date',
    pickupLabel: 'Pickup',
    dinnerLabel: 'Dinner',
    whereLabel: 'Where',
    calendar: 'Add to calendar',
    tell: 'Send to {you}',
    closing: 'See you soon.',
    stamp: 'Approved',
  },

  /** Digits only, with country code, no + or spaces. 15555550123 is a dummy number. */
  whatsapp: {
    number: '15555550123',
    /** Placeholders: {her} {date} {pickup} */
    messages: {
      yes: 'Yes 🥂 I’m in!\n\n📅 {date}\n🕒 Pick me up at {pickup}',
      obviously: 'Obviously yes 😌\n\n📅 {date}\n🕒 Pick me up at {pickup}',
    } satisfies Record<Choice, string>,
  },

  /** Wording inside the calendar file she downloads. */
  calendar: {
    title: 'Dinner with {you} 🕯️',
    description: 'Pickup at {pickup}. Dinner at {time}, a table for two at {where}.',
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

  /** Optional music. Drop your own mp3 at /public/audio/dinner.mp3 to replace the synthesised placeholder. */
  music: {
    enabled: true,
    label: 'Music',
    src: '/audio/dinner.mp3',
    volume: 0.4,
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

/** "6:30pm" for a 24h "18:30" on the dinner date. */
export function clock(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(site.dateTime);
  d.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat(site.locale, { hour: 'numeric', minute: '2-digit', hour12: true }).format(d).replace(/\s/g, '').toLowerCase();
}

/** Fill {you}, {her}, {when}, {where}, {date}, {time} (and {pickup} etc. when given) in any config string. */
export function fill(text: string, extra: Record<string, string | number> = {}): string {
  let out = text
    .replaceAll('{you}', site.yourName)
    .replaceAll('{her}', site.herName)
    .replaceAll('{when}', `${derived.dateLong}, ${derived.time}`)
    .replaceAll('{date}', derived.dateLong)
    .replaceAll('{time}', derived.time)
    .replaceAll('{where}', site.restaurant.name);
  for (const [k, v] of Object.entries(extra)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}
