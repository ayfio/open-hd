import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base so the build works at any mount path (GitHub Pages
  // serves at /open-human-design/, local preview at /).
  base: './',
  build: {
    outDir: 'dist'
  }
});
