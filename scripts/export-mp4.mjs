// Exports the 2D film to MP4 without real-time recording:
//   1. opens the single-file preview in headless Chromium (Playwright),
//   2. seeks every drawing (12 per second) and grabs the 1920x1080 film canvas,
//   3. renders the soundtrack offline (OfflineAudioContext) to WAV,
//   4. pipes everything into ffmpeg (H.264 + AAC, 30 fps).
//
// Usage:
//   npm run build:preview
//   node scripts/export-mp4.mjs [out.mp4] [--fonts DIR] [--page ENTRY]
// Needs: ffmpeg on PATH, and Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
// --fonts DIR: serve Google Fonts from a local folder (itim.css + the .woff2 files) when the
//              browser has no internet access.
// --page ENTRY: export another page with the same window.__film contract, e.g.
//              experiments/apple-2d/index (build it first with build-preview.mjs ENTRY).
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const fontsIdx = args.indexOf('--fonts');
const fontsDir = fontsIdx >= 0 ? args.splice(fontsIdx, 2)[1] : null;
const pageIdx = args.indexOf('--page');
const entry = pageIdx >= 0 ? args.splice(pageIdx, 2)[1] : 'index';
const out = resolve(args[0] ?? 'tao-muon-bay.mp4');
const page = pathToFileURL(resolve(`dist-preview/${entry}.preview.html`)).href;

const work = mkdtempSync(join(tmpdir(), 'tao-export-'));
const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  if (fontsDir) {
    await ctx.route('https://fonts.googleapis.com/**', (r) =>
      r.fulfill({ contentType: 'text/css', body: readFileSync(join(fontsDir, 'itim.css'), 'utf8') }),
    );
    await ctx.route('https://fonts.gstatic.com/**', (r) =>
      r.fulfill({ contentType: 'font/woff2', body: readFileSync(join(fontsDir, basename(new URL(r.request().url()).pathname))) }),
    );
  }
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.error('[page]', e.message));
  await p.goto(page);
  await p.waitForFunction(() => window.__film);
  if (!(await p.evaluate(() => window.__film.fontsReady()))) console.warn('Font Itim not loaded, using fallback font');

  const { duration, drawFps } = await p.evaluate(() => ({ duration: window.__film.duration, drawFps: window.__film.drawFps }));
  const frames = Math.ceil(duration * drawFps);
  console.log(`Rendering ${frames} drawings (${duration}s at ${drawFps}/s)...`);

  const wav = join(work, 'audio.wav');
  writeFileSync(wav, Buffer.from(await p.evaluate(() => window.__film.renderAudioWav()), 'base64'));

  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(drawFps), '-i', '-',
    '-i', wav,
    '-r', '30', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-af', 'alimiter=limit=0.89:level=disabled', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart',
    out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)))));

  for (let i = 0; i < frames; i++) {
    const b64 = await p.evaluate((t) => {
      window.__film.seek(t);
      return window.__film.filmCanvas.toDataURL('image/png').split(',')[1];
    }, i / drawFps);
    if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 120 === 0) console.log(`  ${Math.round((i / frames) * 100)}%`);
  }
  ff.stdin.end();
  await done;
  console.log(`Done: ${out}`);
} finally {
  await browser.close();
  rmSync(work, { recursive: true, force: true });
}
