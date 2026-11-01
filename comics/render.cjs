// Renders comics to PNG with headless Chromium. Usage: node comics/render.cjs [outDir] [name ...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const here = __dirname;
const [outDir = path.join(here, 'out', 'render'), ...names] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage();
  p.on('console', (m) => console.log('console:', m.text()));
  p.on('pageerror', (e) => console.log('err', e.message));
  await p.setContent('<html><body></body></html>');
  await p.evaluate(([f, n]) => { window.FONT = f; window.NAMES = n; }, [fs.readFileSync(path.join(here, 'itim.ttf')).toString('base64'), names]);
  await p.addScriptTag({ content: fs.readFileSync(path.join(here, 'build', 'bundle.js'), 'utf8') });
  await p.waitForFunction(() => window.OUT, null, { timeout: 60000 });
  const out = await p.evaluate(() => window.OUT);
  for (const [k, v] of Object.entries(out)) {
    fs.writeFileSync(path.join(outDir, k + '.png'), Buffer.from(v.split(',')[1], 'base64'));
    console.log('wrote', k + '.png');
  }
  await b.close();
})();
