# Dinner for Two

A one-page, scroll-driven private invitation to dinner. It is meant to feel like a love letter, not a destination: near-black rooms, a single candle, a glass of red, one rose, and your words, one screen at a time. Everything is in English, and any Italian-restaurant mood comes only from the light, the photos, the card and the music.

Vite + React + TypeScript, Tailwind, Framer Motion, Lenis. Close-up photography, graded as one film, with all depth coming from motion and layering. Static site on Vercel, plus one optional serverless function.

## 1. Make it yours (one file)

Edit **`src/config/site.ts`**. Nothing in `components/` needs touching.

| Field | What it does |
| --- | --- |
| `herName`, `yourName` | Script headline, "Tell {you}" button, calendar title |
| `eyebrow`, `hero` | Small title, greeting ("Hey,"), tagline |
| `dateTime`, `durationMinutes`, `locale` | Menu, confirmation, `.ics` file |
| `restaurant` | Menu, confirmation, maps link, `.ics` location |
| `whyLines` | The 2 or 3 sincere lines over the terrace scene (add or remove freely) |
| `menu`, `question`, `thanks`, `confirm`, `calendar` | All other copy: the four courses (name, label, value), the two yes buttons, the two thank-you lines, confirmation labels, calendar wording |
| `whatsapp` | Digits-only number with country code, plus the pre-filled message per button |
| `notify.enabled` | Email-me-when-she-answers (see below) |
| `music` | Toggle on or off, volume, file path |

Then regenerate the share preview with her name on it:

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

Handy URL flag while testing:

- `?reset` forgets a saved answer (the page remembers her answer in `localStorage`, so a refresh shows the confirmation instead of asking again)

## 3. Photography

Four close-up Unsplash photos live in `public/img/` as WebP at 640 and 1200 px wide (5 to 71 KB each): a candle flame, red wine in a glass, out-of-focus fairy lights, and a single rose. They go through one warm grade (burgundy shadows, golden highlights, a breath of film grain) so they read as a single film.

To swap a photo, change its `photo` id in `scripts/images.json` (the part of the Unsplash image URL after `images.unsplash.com/`), then:

```bash
npm run images
```

Credits are listed in `photoCredits` in `site.ts` and shown as a small line at the bottom of the page.

## 4. Motion, at a glance

- **Hello:** the candle photo slowly pushes in and dissolves into black, a soft glow breathes at the flame, and her name arrives letter by letter
- **Your words:** one line per screen, fading up and dissolving away over a dim glass of wine, with bokeh drifting at two different speeds
- **The card:** CSS 3D flip, slow scroll tilt, plus phone-orientation tilt. On iOS the motion permission is requested from the first tap on the card; if it is declined or unsupported the card keeps its scroll and hover tilt
- **The question:** the page dims to candlelight behind a single rose, with equal glowing pulses on both buttons
- **Yes:** a short canvas rose-petal burst, then the details card rises in
- `prefers-reduced-motion`: smooth scroll, parallax, push-in, bokeh, pulses and petals are all switched off; content simply appears

## 5. Music

`public/audio/dinner.mp3` is a short loop of a fingerpicked guitar progression, synthesised by `scripts/make-music.mjs` (`npm run music`, needs ffmpeg). It is original, so there is nothing to license. Replace it with any royalty-free track by dropping a file at the same path (or change `music.src`). It is off by default and only starts after she taps the toggle.

## 6. Optional: email when she answers (Resend)

`api/notify.ts` is a tiny Vercel function that calls Resend. Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | |
| --- | --- |
| `RESEND_API_KEY` | required |
| `NOTIFY_TO_EMAIL` | required, where the email goes |
| `NOTIFY_FROM_EMAIL` | optional, e.g. `Dinner for Two <hello@yourdomain.com>` (needs a verified Resend domain). Default is Resend's sandbox sender, which only delivers to the address you signed up with |

Disable it any time: set `notify.enabled: false` in `site.ts` (the page never calls the endpoint) or leave the env vars unset (the function returns 204 and does nothing).

## 7. Deploy to Vercel

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
  config/site.ts          every personal detail
  components/
    sections/             Opening, Mood, Menu, Question
    ui/                   Picture, Bokeh, Overlays, MusicToggle, Ornament
  lib/                    ics, share, music, storage, petals (canvas), useTilt, hooks
public/img/               graded WebP photos (generated)
api/notify.ts             optional Resend email
scripts/                  make-images.mjs, make-og.mjs, make-music.mjs
```

## Performance notes

- No 3D, no WebGL. First paint is HTML, CSS and one preloaded 5 KB hero WebP. Lighthouse mobile (simulated 4G) measured performance 98, LCP 0.8 s, TBT about 100 ms.
- Every moving thing is transform or opacity, so it stays on the compositor. Bokeh and the Ken Burns are pure CSS; the petal burst is a single canvas that removes itself after about 6 seconds.
- Images carry explicit width and height, are lazy-loaded below the fold, and use `srcset` so phones fetch the 640 px file.
