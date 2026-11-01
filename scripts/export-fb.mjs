// Exports the Facebook Page images (profile picture + cover) as PNG.
// Usage:
//   node scripts/build-preview.mjs fb-page
//   node scripts/export-fb.mjs [outDir] [--guides]
// --guides also writes copies with the Facebook crop guides drawn on top (for review).
// Needs Playwright with Chromium (see export-mp4.mjs).
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const withGuides = args.includes('--guides');
const outDir = resolve(args.find((a) => !a.startsWith('--')) ?? 'dist-fb');
mkdirSync(outDir, { recursive: true });
const page = pathToFileURL(resolve('dist-preview/fb-page.preview.html')).href;

const browser = await chromium.launch();
try {
  const p = await browser.newPage();
  p.on('pageerror', (e) => console.error('[page]', e.message));
  await p.goto(page);
  await p.waitForFunction(() => window.__posters);
  if (!(await p.evaluate(() => window.__posters.ready))) console.warn('Font Itim not loaded, using fallback font');

  const grab = (withOverlay) =>
    p.evaluate((overlay) => {
      const out = {};
      for (const name of ['profile', 'cover']) {
        const src = window.__posters[name];
        const c = document.createElement('canvas');
        c.width = src.width;
        c.height = src.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(src, 0, 0);
        if (overlay) ctx.drawImage(document.getElementById(`${name}-guides`), 0, 0);
        out[name] = c.toDataURL('image/png').split(',')[1];
      }
      return out;
    }, withOverlay);

  const names = { profile: 'chuyen-nha-tao-avatar-720.png', cover: 'chuyen-nha-tao-cover-1640x624.png' };
  const clean = await grab(false);
  for (const [k, file] of Object.entries(names)) writeFileSync(join(outDir, file), Buffer.from(clean[k], 'base64'));
  if (withGuides) {
    await p.evaluate(() => {
      const g = document.getElementById('guides');
      g.checked = true;
      g.dispatchEvent(new Event('change'));
    });
    const guided = await grab(true);
    for (const [k, file] of Object.entries(names)) writeFileSync(join(outDir, file.replace('.png', '-guides.png')), Buffer.from(guided[k], 'base64'));
  }
  console.log(`Wrote PNGs to ${outDir}`);
} finally {
  await browser.close();
}
