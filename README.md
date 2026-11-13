# Reserved for Naomi

A tiny interactive experience instead of a page to scroll: a private little restaurant that exists for one night, for one guest. She taps through six screens, and it ends with a reservation that has her own menu on it.

Vite + React + TypeScript, Tailwind, Framer Motion. No photos, no 3D: everything is line-art illustration, paper texture and type, so it loads fast and feels hand-made.

## The flow

1. **Arrival.** A dark screen and a small reservation card with her name. She taps "Come in".
2. **Light the candle.** An unlit line-art candle. She taps it: the flame catches, warm light blooms, and the dark room turns to cream paper.
3. **A note from you.** A handwritten-style card that fades in line by line.
4. **Build your menu.** One illustrated card per course. Each pick gets a small animation and a cheeky one-line reaction. Her choices are saved.
5. **The question.** Two yeses, "Yes" and "Obviously yes", with a soft glow and a gentle wobble.
6. **Reservation confirmed.** Rose petals and hearts, then a card with her name, the date, the place and her menu, plus "Add to calendar" and a WhatsApp button whose message includes her menu picks.

If she comes back after answering, the page opens straight on the confirmation. Add `?step=candle` (or `note`, `menu`, `question`, `done`) to the URL to preview any screen, and `?reset` to forget a saved answer.

## 1. Make it yours (one file)

Edit **`src/config/site.ts`**. Nothing in `components/` needs touching. Every word on screen is in there:

| Field | What it does |
| --- | --- |
| `herName`, `yourName` | Her name on the card, your name on the note and the WhatsApp button |
| `dateTime`, `durationMinutes`, `locale` | Confirmation card and `.ics` file |
| `restaurant` | Confirmation card, maps link, `.ics` location |
| `arrival`, `candle` | Reservation card and candle screen copy |
| `note` | Your handwritten note, line by line (use `{her}` and `{you}`) |
| `menu.courses` | Courses, options, their illustrations and her cheeky reactions |
| `question`, `thanks` | The big question, the two yes labels, the two thank-you lines |
| `confirm`, `calendar`, `whatsapp` | Confirmation labels, calendar wording, WhatsApp text (`{menu}` is her picks) |
| `notify.enabled` | Email-me-when-she-answers (see below) |
| `music` | On or off, volume, file path |

Illustration names for menu options: `bruschetta`, `garlic`, `surprise`, `pasta`, `pizza`, `risotto`, `tiramisu`, `gelato`, `heart`. To add a new dish, draw it in `components/ui/Illustrations.tsx` and add its name to the `IconName` type in the config.

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
    sections/             Arrival, Candle, Note, MenuBuilder, Question, Confirmed
    ui/                   Illustrations (line-art), Button, Bokeh, Ornament, MusicToggle
  lib/                    ics, share, music, storage, petals (canvas)
api/notify.ts             optional Resend email
scripts/                  make-og.mjs, make-music.mjs
```

## Motion and accessibility

- Every transition is slow and soft (transform, opacity and clip-path only). The yes buttons have a gentle glow and a tiny wobble; nothing bounces.
- `prefers-reduced-motion`: the wobble, glow, flicker, drifting lights and petals are switched off, transitions become simple fades, and the room lights up with a quick fade instead of the spreading circle.
- Text is always dark ink on cream paper (or cream on the dark opening screen); nothing sits on imagery.

## Performance

No images to download: the whole experience is HTML, CSS, inline SVG and two small web fonts, with the 3D and photo code removed entirely. The petal burst is a single canvas that removes itself after a few seconds.
