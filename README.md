# Reserved for Naomi

A tiny interactive date invitation, built to be played with rather than scrolled. A sealed envelope, a question on a sign held by a candle-flame mascot, a No button that cannot be caught, a celebration, a letter that is typed out as her reward, and a date ticket.

Vite + React + TypeScript, Tailwind, Framer Motion. No photos, no 3D: line-art, paper textures and type, so it loads fast and feels hand-made.

## The flow

1. **Envelope.** "For Naomi" with a heart wax seal and the mascot peeking over the top. She taps; the seal breaks, the flap opens, the mascot pops out and warm light spreads over the dark room.
2. **The question.** The mascot holds a sign: "Naomi, will you go on a dinner date with me?" with **Yes 💖** and **No**.
3. **Yes.** The mascot jumps for joy, hearts and rose petals burst, "SHE SAID YES!! 🎉".
4. **The letter.** Her reward: your letter, typed out gently, with a shy, blushing mascot peeking over the card. Tap the card to skip the typing.
5. **Date confirmed 💌.** A ticket with the date and time (no location: it stays a surprise), the dancing mascot, "Add to calendar" and "Send to Jephthah" (WhatsApp).

If she comes back after saying yes, the page opens straight on the ticket. Add `?step=question` (or `envelope`, `celebrate`, `note`, `done`) to the URL to preview any screen, and `?reset` to forget a saved answer.

### The runaway No

The No button cannot be tapped. It leaps away on `pointerdown` / `touchstart` (before a click can register, and the click handler never fires), on keyboard focus, and, on desktop, as soon as the cursor gets within about 100px. Every landing spot is fully inside the screen and its safe areas, below the header (so never on the music button), and clear of the Yes button, the sign, the mascot and the line under it. It moves with a quick spring, and the Yes button grows and glows a little more each time. With each escape the mascot goes from pleading, to sweating, to dramatic crying, and a new line appears under the sign. It sits in an empty slot at first, so nothing shifts when it leaves. Reduced motion: it still escapes, but with an instant jump.

## 1. Make it yours (one file)

Edit **`src/config/site.ts`**. Nothing in `components/` needs touching. Every word on screen is in there:

| Field | What it does |
| --- | --- |
| `herName`, `yourName` | Her name on the card, your name on the note and the WhatsApp button |
| `dateTime`, `durationMinutes`, `locale` | The fixed date and time, shown on the ticket and in the `.ics` file |
| `envelope`, `question` | Envelope text, the sign, the Yes/No labels and the lines the mascot says as No runs away |
| `celebrate`, `note` | Celebration text and your letter (it is typed out line by line; use `{her}` and `{you}`) |
| `confirm`, `calendar`, `whatsapp` | Ticket labels, calendar wording and the WhatsApp message (`{date}`, `{time}`) |
| `notify.enabled` | Email-me-when-she-answers (see below) |
| `music` | On or off, volume, file path |

The mascot is a small candle flame (`MascotArt` in `components/ui/Illustrations.tsx`).

Regenerate the share preview with her name on it:

```bash
npx playwright install chromium   # first time only
npm run og                        # writes public/og.jpg (1200x630)
```

## 2. Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview
```

## 3. Music

`public/audio/dinner.mp3` is a short loop of a fingerpicked guitar progression, synthesised by `scripts/make-music.mjs` (`npm run music`, needs ffmpeg). It is original, so there is nothing to license. Replace it with any royalty-free track by dropping a file at the same path (or change `music.src`). It is off by default and only starts after she taps the small music button in the top corner, which lives in its own header strip and never sits on top of content.

## 4. Optional: email when she answers (Resend)

`api/notify.ts` is a tiny Vercel function that calls Resend. Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | |
| --- | --- |
| `RESEND_API_KEY` | required |
| `NOTIFY_TO_EMAIL` | required, where the email goes |
| `NOTIFY_FROM_EMAIL` | optional, e.g. `Dinner for Two <hello@yourdomain.com>` (needs a verified Resend domain). Default is Resend's sandbox sender, which only delivers to the address you signed up with |

Disable it any time: set `notify.enabled: false` in `site.ts` (the page never calls the endpoint) or leave the env vars unset (the function returns 204 and does nothing).

## 5. Deploy to Vercel

**Git route (recommended)**

1. Push this repo to GitHub.
2. vercel.com → Add New → Project → import it. Framework preset: Vite (auto-detected, `vercel.json` already sets build and output).
3. Add the env vars from section 4 if you want the email ping.
4. Deploy. The Open Graph URL is filled in automatically from `VERCEL_PROJECT_PRODUCTION_URL`. If you attach a custom domain, set `SITE_URL=https://your.domain` as an env var and redeploy so link previews use it.

**CLI route**

```bash
npm i -g vercel
vercel          # first deploy, answer the prompts
vercel --prod
```

After deploying, paste the link into WhatsApp or iMessage to check the preview. Platforms cache previews aggressively; if you change the image later, test with a fresh query string (`?v=2`).

## Structure

```
src/
  config/site.ts          every word and detail
  components/
    sections/             Envelope, Question, Celebrate, Note, Confirmed
    ui/                   Illustrations (mascot), RunawayButton, Button, Bokeh, Ornament, MusicToggle
  lib/                    ics, share, music, storage, petals (canvas)
api/notify.ts             optional Resend email
scripts/                  make-og.mjs, make-music.mjs
```

## Motion and accessibility

- Every transition is slow and soft (transform, opacity and clip-path only). The only playful extras are the Yes glow, the mascot's moods and the runaway No.
- `prefers-reduced-motion`: the wobble, glow, flicker, drifting lights and petals are switched off, transitions become simple fades, the room lights up with a quick fade, the letter appears at once, and No still runs away but with an instant jump.
- Text is always dark ink on cream paper (or cream on the dark opening screen); nothing sits on imagery.

## Performance

No images to download: the whole experience is HTML, CSS, inline SVG and two small web fonts, with the 3D and photo code removed entirely. The petal burst is a single canvas that removes itself after a few seconds.
