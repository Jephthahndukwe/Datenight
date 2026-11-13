/**
 * ONE FILE TO EDIT.
 * Every personal detail and every word on the page lives here: names, date, place,
 * your lines, button labels, menu items, thank-you messages, phone number.
 * Nothing in /components needs to be touched.
 *
 * After editing, run `npm run og` to regenerate the share preview image
 * (public/og.jpg) with her name on it.
 */

export type Choice = 'yes' | 'obviously';

export const site = {
  /** Her name, in the script font. */
  herName: 'Naomi',

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
    name: 'Your Restaurant',
    address: '12 Your Street, Your City',
  },

  /** The small caps title used on the hero, the menu card and the share image. */
  eyebrow: 'Dinner for Two',

  hero: {
    /** Shown above her name, in script. Try "Hi," or "Hey" or "Well, hello,". */
    greeting: 'Hey,',
    /** Your pet name for her. Fades in under her name, softly glowing. Set to '' to leave it out. */
    nickname: 'my queen',
    /** A tiny gold line-art crown above the nickname. Set false if it ever feels like too much. */
    crown: true,
    tagline: 'I have something to ask you.',
  },

  /** Your words, one per screen while she scrolls. Two to four is the sweet spot. */
  whyLines: [
    'You make ordinary evenings feel like they have candles in them.',
    'I would like one long dinner where neither of us checks the time.',
    'So, a table for two. I will handle the rest.',
  ],

  /**
   * The menu card. Each course has a name, a small label and a value.
   * {when} and {where} are filled in from the date and restaurant above.
   */
  menu: {
    coverTop: 'Tonight’s',
    coverTitle: 'Menu',
    coverBottom: 'for two',
    title: 'Dinner for Two',
    hint: 'Tap the card to turn it',
    hintTouch: 'Tap the card to turn it, or tilt your phone',
    courses: [
      { name: 'To Start', label: 'When', value: '{when}' },
      { name: 'The Main', label: 'Where', value: '{where}' },
      { name: 'On the Side', label: 'With', value: 'Good conversation' },
      { name: 'For Dessert', label: 'Finally', value: 'A surprise' },
    ],
    note: 'Wear something you feel wonderful in. x',
  },

  /** The big question. */
  question: {
    headline: 'My queen, will you have dinner with me?',
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

  /** Labels on the confirmation card. {you} is replaced with yourName. */
  confirm: {
    whenLabel: 'When',
    whereLabel: 'Where',
    calendar: 'Add to calendar',
    tell: 'Tell {you}',
    closing: 'See you soon.',
  },

  /** Digits only, with country code, no + or spaces. 15555550123 is a dummy number. */
  whatsapp: {
    number: '15555550123',
    /** Placeholders: {her} {when} {where} */
    messages: {
      yes: 'Yes 🥂 I’m in. See you {when} at {where}.',
      obviously: 'Obviously yes 😌 See you {when} at {where}.',
    } satisfies Record<Choice, string>,
  },

  /** Wording inside the calendar file she downloads. */
  calendar: {
    title: 'Dinner with {you} 🕯️',
    description: 'A table for two at {where}. Good food, good conversation, and a surprise for dessert.',
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

  /** Photographers behind the images in /public/img (see scripts/images.json). Shown as a small credit line. */
  photoCredits: [
    { name: 'Huma Kabakci', url: 'https://unsplash.com/photos/bMLxl5Orl5s' },
    { name: 'Shutter Speed', url: 'https://unsplash.com/photos/md1BpelShuU' },
    { name: 'Bruno Figueiredo', url: 'https://unsplash.com/photos/FXfUYwQi9lc' },
    { name: 'engin akyurt', url: 'https://unsplash.com/photos/YXPE-wHpaH4' },
  ],
  photoCreditPrefix: 'Photos on Unsplash:',

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

/** Fill {you}, {her}, {when}, {where} in any config string. */
export function fill(text: string): string {
  return text
    .replaceAll('{you}', site.yourName)
    .replaceAll('{her}', site.herName)
    .replaceAll('{when}', `${derived.dateLong}, ${derived.time}`)
    .replaceAll('{where}', site.restaurant.name);
}
