import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works at any mount path (GitHub Pages
  // serves at /open-hd/, local preview at /).
  base: './',
  build: {
    outDir: 'dist'
  }
});
