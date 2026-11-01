import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the built film also works from a sub-folder or file share.
  base: './',
  build: {
    // three.js alone is ~600 kB minified; that is expected for this project.
    chunkSizeWarningLimit: 1000,
  },
});
