# Una Cena Per Due

A one-page, scroll-driven dinner invitation. Candlelit trattoria on the Amalfi Coast, a low-poly terrace at dusk, a parchment menu that lists the plan, and one question with two ways to say yes.

Vite + React + TypeScript, Tailwind, React Three Fiber + drei, Framer Motion, Lenis. Static site on Vercel, plus one optional serverless function.

## 1. Make it yours (one file)

Edit **`src/config/site.ts`**. Nothing in `components/` needs touching.

| Field | What it does |
| --- | --- |
| `herName`, `yourName` | Script headline, "Tell {you}" button, calendar title |
| `dateTime`, `durationMinutes`, `locale` | Menu, confirmation, `.ics` file |
| `restaurant` | Menu, confirmation, maps link, `.ics` location |
| `whyLines` | The 2 or 3 sincere lines over the terrace scene (add or remove freely) |
| `menu`, `question`, `thanks` | Remaining copy, including the two different thank-you lines |
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

Handy URL flags while testing:

- `?reset` forgets a saved answer (the page remembers her answer in `localStorage`, so a refresh shows the confirmation instead of asking again)
- `?3d=0` forces the static fallback art, `?3d=1` forces 3D

## 3. Music

`public/audio/cena.mp3` is a short loop of a fingerpicked guitar progression, synthesised by `scripts/make-music.mjs` (`npm run music`, needs ffmpeg). It is original, so there is nothing to license. Replace it with any royalty-free track by dropping a file at the same path (or change `music.src`). It is off by default and only starts after she taps the toggle.

## 4. Optional: email when she answers (Resend)

`api/notify.ts` is a tiny Vercel function that calls Resend. Set these in **Vercel → Project → Settings → Environment Variables**:

| Variable | |
| --- | --- |
| `RESEND_API_KEY` | required |
| `NOTIFY_TO_EMAIL` | required, where the email goes |
| `NOTIFY_FROM_EMAIL` | optional, e.g. `Una Cena <hello@yourdomain.com>` (needs a verified Resend domain). Default is Resend's sandbox sender, which only delivers to the address you signed up with |

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
  config/site.ts          every personal detail
  components/
    sections/             Opening, Mood, Menu, Question
    three/                Candle, Flame, TerraceScene, PetalBurst ... (lazy-loaded)
    ui/                   Overlays (grain, vignette), MusicToggle, fallbacks
  lib/                    capabilities, ics, share, music, storage, hooks
api/notify.ts             optional Resend email
scripts/                  make-og.mjs, make-music.mjs
```

## Performance notes

- The 3D chunk (three + R3F, about 240 kB gzipped) is not loaded until her first tap or scroll, or 8 seconds after load. First paint is plain HTML, CSS and a CSS candle.
- Pixel ratio is capped at 1.5, drops to 1 if frame rate sags. Geometry is low-poly with baked-style lighting, one draw call for all glows.
- No WebGL, a low-memory or data-saver device, or `?3d=0`: illustrated static art instead of 3D, DOM petals instead of the WebGL burst.
- `prefers-reduced-motion`: smooth scrolling off, 3D renders a still frame, no petals.
