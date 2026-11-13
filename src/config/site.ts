/**
 * ONE FILE TO EDIT.
 * Every personal detail and every word on the page lives here: names, date, place,
 * your note, the menu options and her cheeky reactions, button labels, thank-you
 * messages, phone number. Nothing in /components needs to be touched.
 *
 * After editing, run `npm run og` to regenerate the share preview image
 * (public/og.jpg) with her name on it.
 *
 * Placeholders you can use in any string: {her} {you} {when} {where} {menu}
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
    address: 'Akoka, Lagos Mainland',
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
      'But first, my queen, I need your help. Every good dinner starts with a menu, and I want this one to be yours.',
    ],
    signoff: 'Yours, {you}',
    next: 'Build our menu',
  },

  /**
   * Step 4: she builds her order from the real menu (the dishes live in config/menu.ts).
   * Set showPrices to true to show ₦ prices on the cards, in the order sheet and on the ticket.
   */
  menu: {
    showPrices: false,
    title: 'Build your plate 🍽️',
    subtitle: 'Tap what you like. Swipe for more.',
    surpriseLabel: 'Surprise me 👀',
    decideLabel: 'I’ll decide there',
    orderPill: '{her}’s order ({n})',
    sheetTitle: 'Your order',
    sheetEmpty: 'Nothing yet. Tap something yummy.',
    sheetBack: 'Keep browsing',
    remove: 'Remove',
    total: 'Total',
    done: 'That’s my order',
    limitWarning: 'That’s the limit! Tap one to swap.',
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

  /** Step 6: the confirmation card. */
  confirm: {
    eyebrow: 'Date confirmed 💌',
    /** A little ink stamp that thumps onto the card. */
    stamp: 'Approved',
    guestLabel: 'Guest',
    partyLabel: 'Party',
    party: 'Table for two',
    dateLabel: 'Date',
    timeLabel: 'Time',
    whereLabel: 'Where',
    menuLabel: 'Your order',
    calendar: 'Add to calendar',
    tell: 'Send to {you}',
    closing: 'See you soon.',
  },

  /** Digits only, with country code, no + or spaces. 15555550123 is a dummy number. */
  whatsapp: {
    number: '15555550123',
    /** Placeholders: {her} {when} {where} {menu} */
    messages: {
      yes: 'Yes 🥂 I’m in!\n\n📅 {when}\n📍 {where}, Akoka\n\nMy order:\n{menu}',
      obviously: 'Obviously yes 😌\n\n📅 {when}\n📍 {where}, Akoka\n\nMy order:\n{menu}',
    } satisfies Record<Choice, string>,
  },

  /** Wording inside the calendar file she downloads. */
  calendar: {
    title: 'Dinner with {you} 🕯️',
    description: 'A table for two at {where}. Her order: {menu}',
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

/** Fill {you}, {her}, {when}, {where} (and {menu} / {n} / {total} when given) in any config string. */
export function fill(text: string, extra: Record<string, string | number> = {}): string {
  let out = text
    .replaceAll('{you}', site.yourName)
    .replaceAll('{her}', site.herName)
    .replaceAll('{when}', `${derived.dateLong}, ${derived.time}`)
    .replaceAll('{where}', site.restaurant.name);
  for (const [k, v] of Object.entries(extra)) out = out.replaceAll(`{${k}}`, String(v));
  return out;
}
