/**
 * Renders the 1200x630 share preview (public/og.jpg): a cream paper card with a gold
 * line-art candle and her name in script. Reads names from src/config/site.ts.
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

const candle = `<svg viewBox="0 0 160 260" width="250" height="406" fill="none" stroke="#b8862b" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
<ellipse cx="80" cy="238" rx="58" ry="11"/><path d="M44 234c10 9 62 9 72 0" opacity=".6"/>
<path d="M57 234V96c0-8 6-13 13-13h20c7 0 13 5 13 13v138"/><path d="M57 96c8 6 38 6 46 0"/>
<path d="M92 99v18c0 5 8 5 8 0V99" opacity=".7"/><path d="M80 94V76"/>
<defs><linearGradient id="f" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#ffe08a"/></linearGradient></defs>
<path d="M80 74C66 58 68 40 80 20c12 20 14 38 0 54Z" fill="url(#f)" stroke="#d9962e" stroke-width="1.2"/><path d="M80 68c-6-8-5-16 0-25 5 9 6 17 0 25Z" fill="#fff6d6" stroke="none"/></svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Corm;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')})}
@font-face{font-family:Corm;font-style:italic;font-weight:400;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2')})}
@font-face{font-family:Ital;src:url(${font('@fontsource/italianno/files/italianno-latin-400-normal.woff2')})}
@font-face{font-family:Int;src:url(${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;position:relative;color:#3a0f1c;font-family:Corm,serif;
  background:radial-gradient(70% 90% at 78% 45%,rgba(255,196,120,.55),rgba(255,196,120,0) 65%),radial-gradient(120% 100% at 50% 40%,#fbf3e2 0%,#f1e3c6 70%,#e6d2ab 100%)}
.frame{position:absolute;inset:28px;border:1px solid rgba(184,134,43,.55)}
.frame::after{content:"";position:absolute;inset:9px;border:1px solid rgba(184,134,43,.3)}
.txt{position:absolute;left:110px;top:0;bottom:0;width:640px;display:flex;flex-direction:column;justify-content:center}
.k{font:600 15px Int;letter-spacing:.46em;text-transform:uppercase;color:#b8862b}
.l{font-style:italic;font-size:50px;margin-top:30px;color:#6b3a45}
.n{font-family:Ital;font-size:200px;line-height:.9;margin-top:6px;color:#9b1b30}
.c{position:absolute;right:150px;top:112px}
.glow{position:absolute;right:30px;top:20px;width:480px;height:480px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,170,70,.5),rgba(255,170,70,0))}
</style></head><body>
<div class="glow"></div><div class="c">${candle}</div><div class="frame"></div>
<div class="txt"><div class="k">A table for two</div><div class="l">A little question for you,</div><div class="n">${site.herName}</div></div>
</body></html>`;

const tmp = resolve(root, 'scripts/.og.html');
writeFileSync(tmp, html);
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
mkdirSync(resolve(root, 'public'), { recursive: true });
await page.screenshot({ path: resolve(root, 'public/og.jpg'), type: 'jpeg', quality: 88 });
await browser.close();
rmSync(tmp);
console.log('wrote public/og.jpg', (readFileSync(resolve(root, 'public/og.jpg')).length / 1024).toFixed(0) + ' KB');
