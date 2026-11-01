import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
export default {
  root: here,
  build: { outDir: 'build', emptyOutDir: true, lib: { entry: 'main.ts', formats: ['iife'], name: 'Comics', fileName: () => 'bundle.js' }, minify: false },
  logLevel: 'warn',
};
