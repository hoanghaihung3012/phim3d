// Builds a single self-contained HTML file (JS + CSS inlined) for sharing a preview,
// e.g. as a claude.ai Artifact.
// Usage: node scripts/build-preview.mjs [entry]   (entry = html path without .html, e.g.
//   index | apple-test | experiments/apple-2d/index; default index)
// Output: dist-preview/<entry>.preview.html
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const entry = process.argv[2] ?? 'index';
execSync('npx vite build', { stdio: 'inherit', env: { ...process.env, PREVIEW_ENTRY: entry } });
const dir = 'dist-preview';

// Entries in sub-folders put their chunks in nested asset folders, so search recursively.
const assets = readdirSync(`${dir}/assets`, { recursive: true }).map(String);
const js = readFileSync(`${dir}/assets/${assets.find((f) => f.endsWith('.js'))}`, 'utf8');
const css = readFileSync(`${dir}/assets/${assets.find((f) => f.endsWith('.css'))}`, 'utf8');
if (js.includes('</script')) throw new Error('Bundle contains "</script", cannot inline safely');

const body = readFileSync(`${dir}/${entry}.html`, 'utf8').match(/<body>([\s\S]*)<\/body>/)[1];

// The artifact host wraps the page in its own <html>/<head>/<body>, so emit only
// title, styles, markup and the script. Downloads are blocked inside artifacts,
// so the export button is hidden in this preview.
const title = readFileSync(`${entry}.html`, 'utf8').match(/<title>(.*?)<\/title>/)[1];
const html = `<title>${title}</title>
<style>
:root { color-scheme: dark; }
html, body { height: 100%; }
${css}
#btn-record { display: none; }
@media (max-width: 600px) { #scene-label { display: none; } #hud { gap: 8px; } }
</style>
${body.trim()}
<script type="module">
${js}
</script>
`;
const outFile = `${dir}/${entry}.preview.html`;
writeFileSync(outFile, html);
console.log(`${outFile}: ${(html.length / 1024).toFixed(0)} KB`);
