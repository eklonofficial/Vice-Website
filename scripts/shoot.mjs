// Dev-only screenshot harness: node scripts/shoot.mjs [mode]
// mode "static": reduced motion, capture each section
// mode "scroll": full motion, capture scroll positions through the pins
import puppeteer from 'puppeteer-core';

const mode = process.argv[2] ?? 'static';
const url = 'http://localhost:4173/Vice-Website/';
const outDir = '/tmp/vice-shots';

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu-sandbox', '--use-gl=angle', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

if (mode === 'static') {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
}

await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 1200));

if (mode === 'static') {
  const sections = await page.$$eval('section, footer', (els) =>
    els.map((el, i) => ({ i, top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight })),
  );
  let n = 0;
  for (const s of sections) {
    for (let off = 0; off < s.h; off += 860) {
      await page.evaluate((y) => window.scrollTo(0, y), s.top + off);
      await new Promise((r) => setTimeout(r, 350));
      await page.screenshot({ path: `${outDir}/static-${String(n).padStart(2, '0')}.png` });
      n++;
    }
  }
} else {
  const total = await page.evaluate(() => document.body.scrollHeight - innerHeight);
  const steps = 24;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((total * i) / steps);
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await new Promise((r) => setTimeout(r, 450));
    await page.screenshot({ path: `${outDir}/scroll-${String(i).padStart(2, '0')}.png` });
  }
}

await browser.close();
console.log('done');
