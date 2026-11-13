/**
 * ONE FILE TO EDIT.
 * Every personal detail on the site lives here: names, date, place, lines, phone.
 * Nothing in /components needs to be touched.
 *
 * After editing, run `npm run og` to regenerate the share preview image
 * (public/og.jpg) with her name on it.
 */

export type Choice = 'si' | 'obviously';

export const site = {
  /** Her name as it appears in the script font. "Ciao, Bella" works if you want to stay mysterious. */
  herName: 'Bella',

  /** Your first name. Used in "Tell {yourName}" and the calendar event. */
  yourName: 'Your Name',

  /**
   * Local date and time of the dinner, as YYYY-MM-DDTHH:mm (no timezone, so it
   * lands at the same wall-clock time wherever her phone is).
   */
  dateTime: '2026-11-28T19:30',
  durationMinutes: 150,
  /** BCP 47 locale used to format the date for display. */
  locale: 'en-GB',

  restaurant: {
    name: 'Trattoria da Luigi',
    address: '12 Via Roma, Your City',
  },

  /** Sincere lines shown over the terrace scene while she scrolls. Two or three is the sweet spot. */
  whyLines: [
    'You make ordinary evenings feel like they have candles in them.',
    'I would like one long dinner where neither of us checks the time.',
    'So, a table for two. I will handle the rest.',
  ],

  /** The four courses on the menu card. `value` for antipasto and primo is generated from the date and restaurant above. */
  menu: {
    secondo: 'Good conversation',
    dolce: 'A surprise',
    note: 'Wear something you feel wonderful in. x',
  },

  /** Copy for the big question. */
  question: {
    headline: 'Will you have dinner with me?',
    yesPrimary: 'Sì',
    yesSecondary: 'Obviously, sì',
    underline: 'I made this easy for you.',
    easterEgg: "Take your time, the candle's still burning 🕯️",
  },

  /** Thank-you line shown depending on which button she tapped. */
  thanks: {
    si: 'Perfetto. It’s a date.',
    obviously: 'I knew you had great taste.',
  } satisfies Record<Choice, string>,

  /** Digits only, with country code, no + or spaces. 15555550123 is a dummy number. */
  whatsapp: {
    number: '15555550123',
    /** Placeholders: {her} {when} {where} */
    messages: {
      si: 'Sì 🥂 I’m in. See you {when} at {where}.',
      obviously: 'Obviously, sì 😌 See you {when} at {where}.',
    } satisfies Record<Choice, string>,
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

  /** Optional music. Drop your own mp3 at /public/audio/cena.mp3 to replace the synthesised placeholder. */
  music: {
    enabled: true,
    src: '/audio/cena.mp3',
    volume: 0.4,
  },

  /** Used for og:url / og:image if Vercel's production URL is not available at build. */
  siteUrl: 'https://your-site.vercel.app',
} as const;

/* ---------- derived values (no need to edit) ---------- */

const when = new Date(site.dateTime);

export const derived = {
  title: `A little question for you, ${site.herName}`,
  description: `${site.yourName} has a question. It involves candlelight and a table for two.`,
  dateLong: new Intl.DateTimeFormat(site.locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(when),
  dateShort: new Intl.DateTimeFormat(site.locale, { weekday: 'short', day: 'numeric', month: 'short' }).format(when),
  time: new Intl.DateTimeFormat(site.locale, { hour: 'numeric', minute: '2-digit', hour12: true })
    .format(when)
    .replace(/\s/g, '')
    .toLowerCase(),
};
