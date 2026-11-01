import { defineConfig } from 'vite';

const preview = process.env.PREVIEW_ENTRY;

export default defineConfig({
  // Relative base so the built film also works from a sub-folder or file share.
  base: './',
  build: {
    // three.js alone is ~600 kB minified; that is expected for this project.
    chunkSizeWarningLimit: 1000,
    // PREVIEW_ENTRY builds just one page (used by scripts/build-preview.mjs to inline it).
    outDir: preview ? 'dist-preview' : 'dist',
    rollupOptions: {
      input: preview
        ? { [preview]: `${preview}.html` }
        : {
            index: 'index.html',
            'apple-test': 'apple-test.html', // character test reel for Táo Lém
          },
    },
  },
});
