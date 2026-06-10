import { defineConfig } from 'vite';

// GitHub Pages project site: https://eklonofficial.github.io/Vice-Website/
// For a custom domain later, build with VITE_BASE=/ and add public/CNAME.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/Vice-Website/',
  build: {
    target: 'es2022',
    assetsInlineLimit: 2048,
  },
});
