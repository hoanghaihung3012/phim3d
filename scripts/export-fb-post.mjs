// Exports the Facebook Page post images as PNG (1080x1350).
// Usage:
//   node scripts/build-preview.mjs fb-post
//   node scripts/export-fb-post.mjs [outDir]
// Needs Playwright with Chromium (see export-mp4.mjs).
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const outDir = resolve(process.argv[2] ?? 'dist-fb');
mkdirSync(outDir, { recursive: true });
const page = pathToFileURL(resolve('dist-preview/fb-post.preview.html')).href;
const FILES = { hello: 'chuyen-nha-tao-post-01-hello-1080x1350.png' };

const browser = await chromium.launch();
try {
  const p = await browser.newPage();
  p.on('pageerror', (e) => console.error('[page]', e.message));
  await p.goto(page);
  await p.waitForFunction(() => window.__posts);
  if (!(await p.evaluate(() => window.__posts.ready))) console.warn('Font Itim not loaded, using fallback font');
  for (const [id, file] of Object.entries(FILES)) {
    const data = await p.evaluate((k) => window.__posts.canvases[k].toDataURL('image/png').split(',')[1], id);
    writeFileSync(join(outDir, file), Buffer.from(data, 'base64'));
  }
  console.log(`Wrote PNGs to ${outDir}`);
} finally {
  await browser.close();
}
