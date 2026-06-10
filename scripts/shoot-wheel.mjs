// Wheel-driven capture: scrolls like a real user so Lenis + pins behave.
// node scripts/shoot-wheel.mjs <fromY> <toY> <shots>
import puppeteer from 'puppeteer-core';

const fromY = Number(process.argv[2] ?? 0);
const toY = Number(process.argv[3] ?? 4000);
const shots = Number(process.argv[4] ?? 6);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:4173/Vice-Website/', { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 2500));
await page.mouse.move(720, 450);

let current = 0;
async function wheelTo(target) {
  while (current < target - 60) {
    const step = Math.min(600, target - current);
    await page.mouse.wheel({ deltaY: step });
    current += step;
    await new Promise((r) => setTimeout(r, 90));
  }
  await new Promise((r) => setTimeout(r, 1300));
  current = await page.evaluate(() => window.scrollY);
}

await wheelTo(fromY);
for (let i = 0; i < shots; i++) {
  const target = fromY + ((toY - fromY) * i) / Math.max(1, shots - 1);
  await wheelTo(target);
  await page.screenshot({ path: `/tmp/vice-shots/wheel-${String(i).padStart(2, '0')}.png` });
}
await browser.close();
console.log('done');
