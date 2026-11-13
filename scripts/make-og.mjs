/**
 * Renders the 1200x630 share preview (public/og.jpg) with her name on it.
 * Uses the same fonts and palette as the site. Reads names from src/config/site.ts.
 *
 * Run: npm run og
 * First time only: npx playwright install chromium
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { site } from '../src/config/site.ts';

const root = resolve(import.meta.dirname, '..');
const font = (p) => pathToFileURL(resolve(root, 'node_modules', p)).href;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Corm;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')})}
@font-face{font-family:Corm;font-style:italic;font-weight:400;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2')})}
@font-face{font-family:Ital;src:url(${font('@fontsource/italianno/files/italianno-latin-400-normal.woff2')})}
@font-face{font-family:Int;src:url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#12040a;position:relative;color:#f4ead2;font-family:Corm,serif}
.bg{position:absolute;inset:0;background:
  radial-gradient(520px 420px at 78% 62%,rgba(236,160,70,.42),rgba(150,50,50,.2) 55%,transparent 75%),
  radial-gradient(900px 700px at 20% 110%,#431022,transparent 70%),
  radial-gradient(130% 100% at 50% 50%,#2c0b19 0%,#12040a 75%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 45%,rgba(8,1,4,.65) 100%)}
.frame{position:absolute;inset:26px;border:1px solid rgba(236,189,98,.32)}
.frame::after{content:"";position:absolute;inset:8px;border:1px solid rgba(236,189,98,.14)}
.txt{position:absolute;left:96px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}
.k{font:600 15px Int;letter-spacing:.42em;text-transform:uppercase;color:#ecbd62}
.l{font-style:italic;font-size:46px;margin-top:34px;color:#e9dab8}
.n{font-family:Ital;font-size:210px;line-height:.9;margin-top:4px;color:#fbf6ea;text-shadow:0 0 60px rgba(236,160,70,.35)}
.s{font:400 15px Int;letter-spacing:.3em;text-transform:uppercase;color:rgba(233,218,184,.7);margin-top:34px}
.candle{position:absolute;right:178px;bottom:98px;width:84px;height:250px}
.wax{position:absolute;bottom:0;left:0;right:0;height:210px;border-radius:5px;background:linear-gradient(90deg,#cdb98f,#f6ecd2 48%,#c9b489)}
.dish{position:absolute;bottom:-14px;left:-50px;right:-50px;height:28px;border-radius:50%;background:linear-gradient(90deg,#8c6422,#e0b052 50%,#8c6422)}
.flame{position:absolute;left:50%;bottom:208px;width:34px;height:76px;margin-left:-17px;border-radius:50% 50% 50% 50%/62% 62% 38% 38%;background:linear-gradient(#ffd27a,#ff9f3a);box-shadow:0 0 50px 24px rgba(255,170,70,.55),0 0 120px 60px rgba(255,140,50,.28)}
.flame::after{content:"";position:absolute;left:9px;right:9px;bottom:6px;height:40px;border-radius:50%;background:#fff4d0}
.wick{position:absolute;left:50%;bottom:208px;width:3px;height:16px;margin-left:-1.5px;background:#1a0d08}
</style></head><body>
<div class="bg"></div>
<div class="candle"><div class="wax"></div><div class="dish"></div><div class="wick"></div><div class="flame"></div></div>
<div class="vig"></div><div class="frame"></div>
<div class="txt">
  <div class="k">Una cena per due</div>
  <div class="l">A little question for you,</div>
  <div class="n">${site.herName}</div>
</div>
</body></html>`;

const tmp = resolve(root, 'scripts/.og.html');
writeFileSync(tmp, html);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
mkdirSync(resolve(root, 'public'), { recursive: true });
await page.screenshot({ path: resolve(root, 'public/og.jpg'), type: 'jpeg', quality: 86 });
await browser.close();
rmSync(tmp);
console.log('wrote public/og.jpg', (readFileSync(resolve(root, 'public/og.jpg')).length / 1024).toFixed(0) + ' KB');
