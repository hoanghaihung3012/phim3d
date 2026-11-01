// Builds a single self-contained HTML file (JS + CSS inlined) for sharing a preview,
// e.g. as a claude.ai Artifact. Output: dist/preview.html
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

execSync('npx vite build', { stdio: 'inherit' });

const assets = readdirSync('dist/assets');
const js = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.js'))}`, 'utf8');
const css = readFileSync(`dist/assets/${assets.find((f) => f.endsWith('.css'))}`, 'utf8');
if (js.includes('</script')) throw new Error('Bundle contains "</script", cannot inline safely');

const body = readFileSync('dist/index.html', 'utf8').match(/<body>([\s\S]*)<\/body>/)[1];

// The artifact host wraps the page in its own <html>/<head>/<body>, so emit only
// title, styles, markup and the script. Downloads are blocked inside artifacts,
// so the export button is hidden in this preview.
const html = `<title>Mochi Muốn Bay</title>
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
writeFileSync('dist/preview.html', html);
console.log(`dist/preview.html: ${(html.length / 1024).toFixed(0)} KB`);
