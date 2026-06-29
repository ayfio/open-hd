// vite.config.js — проверьте или создайте
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    sourcemap: false, 
  },
});
