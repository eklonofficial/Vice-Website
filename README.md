# Vice Website

Marketing site for [Vice](https://github.com/eklonofficial/Vice), instant-replay game clipping for Linux.

Live at: https://eklonofficial.github.io/Vice-Website/

## Stack

- [Vite](https://vite.dev) + vanilla TypeScript, no framework
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for entrance reveals and the stacked-panel scroll transitions
- [Lenis](https://lenis.darkroom.engineering) smooth scrolling

The page degrades gracefully: with `prefers-reduced-motion` or without JS entirely, every section stays readable as a plain scrolling page.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173/Vice-Website/
npm run build      # production build into dist/
npm run preview    # serve the production build
```

`scripts/shoot.mjs` and `scripts/shoot-wheel.mjs` are dev-only screenshot harnesses (need a local Chromium at /usr/bin/chromium).

## Deploy

Pushes to `main` build and deploy via GitHub Actions (`.github/workflows/deploy.yml`). In the repo settings, set Pages → Source to "GitHub Actions" once.

The Vite base path is `/Vice-Website/` (the repo name). For a custom domain later: build with `VITE_BASE=/`, add a `public/CNAME` file, and update the `og:url` / `og:image` tags in `index.html`.
