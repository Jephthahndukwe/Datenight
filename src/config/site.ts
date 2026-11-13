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

/** Illustrations available for the menu cards (see components/ui/Illustrations.tsx). */
export type IconName =
  | 'bruschetta' | 'garlic' | 'surprise'
  | 'pasta' | 'pizza' | 'risotto'
  | 'tiramisu' | 'gelato' | 'heart';

export type MenuOption = { id: string; label: string; icon: IconName; reaction: string };
export type MenuCourse = { id: string; name: string; prompt: string; options: readonly MenuOption[] };

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
    name: 'Your Restaurant',
    address: '12 Your Street, Your City',
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

  /** Step 4: she picks one card per course. Each pick gets a cheeky reaction. */
  menu: {
    courseLabel: 'Course {n} of {total}',
    doneEyebrow: 'Your menu',
    doneTitle: 'Excellent taste, as always.',
    next: 'Continue',
    courses: [
      {
        id: 'start',
        name: 'To Start',
        prompt: 'Something small to begin with?',
        options: [
          { id: 'bruschetta', label: 'Bruschetta', icon: 'bruschetta', reaction: 'Crunchy and a little bit fancy. Just like you.' },
          { id: 'garlic', label: 'Garlic bread', icon: 'garlic', reaction: 'A woman who knows what she wants. I will be eating it too, obviously.' },
          { id: 'surprise', label: 'Surprise me', icon: 'surprise', reaction: 'Ooh, mysterious. I love that you trust me.' },
        ],
      },
      {
        id: 'main',
        name: 'The Main',
        prompt: 'Now the serious part.',
        options: [
          { id: 'pasta', label: 'Pasta', icon: 'pasta', reaction: 'Pasta it is. Twirling is mandatory.' },
          { id: 'pizza', label: 'Pizza', icon: 'pizza', reaction: 'Correct answer. Sharing is optional, but I will ask.' },
          { id: 'risotto', label: 'Risotto', icon: 'risotto', reaction: 'Patience and style. Very you.' },
        ],
      },
      {
        id: 'dessert',
        name: 'For Dessert',
        prompt: 'Save room for this one.',
        options: [
          { id: 'tiramisu', label: 'Tiramisu', icon: 'tiramisu', reaction: 'Sweet, a little strong, a bit of a mood. Perfect.' },
          { id: 'gelato', label: 'Gelato', icon: 'gelato', reaction: 'We will eat it on a walk, with absolutely no rush.' },
          { id: 'you', label: 'You', icon: 'heart', reaction: 'Oh, you went there. I am blushing. Noted.' },
        ],
      },
    ] as readonly MenuCourse[],
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
    eyebrow: 'Reservation confirmed',
    /** A little ink stamp that thumps onto the card. */
    stamp: 'Approved',
    guestLabel: 'Guest',
    partyLabel: 'Party',
    party: 'Table for two',
    dateLabel: 'Date',
    timeLabel: 'Time',
    whereLabel: 'Where',
    menuLabel: 'Your menu',
    calendar: 'Add to calendar',
    tell: 'Tell {you}',
    closing: 'See you soon.',
  },

  /** Digits only, with country code, no + or spaces. 15555550123 is a dummy number. */
  whatsapp: {
    number: '15555550123',
    /** Placeholders: {her} {when} {where} {menu} */
    messages: {
      yes: 'Yes 🥂 I’m in. See you {when} at {where}. My menu: {menu}.',
      obviously: 'Obviously yes 😌 See you {when} at {where}. My menu: {menu}.',
    } satisfies Record<Choice, string>,
  },

  /** Wording inside the calendar file she downloads. */
  calendar: {
    title: 'Dinner with {you} 🕯️',
    description: 'A table for two at {where}. Her menu: {menu}.',
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

/** Her picks, course id -> option id. */
export type Picks = Record<string, string>;

/** Option objects in course order for the picks made so far. */
export function pickedOptions(picks: Picks): { course: MenuCourse; option: MenuOption }[] {
  return site.menu.courses.flatMap((course) => {
    const option = course.options.find((o) => o.id === picks[course.id]);
    return option ? [{ course, option }] : [];
  });
}

export function menuSummary(picks: Picks): string {
  return pickedOptions(picks).map((p) => p.option.label).join(', ');
}
