import gsap from 'gsap';

/** Quick reveals, the hero showcase flatten, ambient glow drift, count-ups. */
export function initSections(): void {
  initHero();
  initHeroShowcase();
  initAmbient();
  initReveals();
  initCounts();
  initFilenameTyping();
}

/**
 * The hero screenshot leans back in perspective and flattens to face-on as
 * it scrolls toward center. Transform-only; without JS it renders flat.
 */
function initHeroShowcase(): void {
  const frame = document.querySelector<HTMLElement>('.hero-shot .frame');
  if (!frame) return;

  gsap.set(frame, {
    rotateX: 16,
    scale: 0.96,
    transformPerspective: 1100,
    transformOrigin: 'center top',
  });

  gsap.to(frame, {
    rotateX: 0,
    scale: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-shot',
      start: 'top 85%',
      end: 'top 30%',
      scrub: 0.5,
    },
  });
}

/**
 * Ambient glow drift: two fixed background blobs slowly travel as the page
 * scrolls, so the lighting mood shifts from section to section.
 */
function initAmbient(): void {
  const a = document.querySelector<HTMLElement>('.ambient .blob-a');
  const b = document.querySelector<HTMLElement>('.ambient .blob-b');
  if (!a || !b) return;

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1 },
  });

  // Waypoints in viewport-relative percents; transform and opacity only
  tl.to(a, { xPercent: -55, yPercent: 35, opacity: 0.7, duration: 1 }, 0)
    .to(a, { xPercent: 10, yPercent: 60, opacity: 0.5, duration: 1 }, 1)
    .to(a, { xPercent: -25, yPercent: 30, opacity: 0.65, duration: 1 }, 2);

  tl.to(b, { xPercent: 50, yPercent: -40, opacity: 0.5, duration: 1 }, 0)
    .to(b, { xPercent: -15, yPercent: -10, opacity: 0.35, duration: 1 }, 1)
    .to(b, { xPercent: 30, yPercent: -45, opacity: 0.5, duration: 1 }, 2);
}

function initHero(): void {
  gsap.from('.nav-pill', { y: -16, autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.4 });

  gsap.from('[data-hero]', {
    y: 18,
    autoAlpha: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 0.1,
    clearProps: 'all',
  });
}

function initReveals(): void {
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    const siblings = el.parentElement
      ? Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'))
      : [];
    const idx = Math.max(0, siblings.indexOf(el));

    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: (idx % 3) * 0.07,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function initCounts(): void {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? '0');
    if (!Number.isFinite(target) || target <= 0) return;
    const proxy = { v: 0 };
    gsap.to(proxy, {
      v: target,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(proxy.v));
      },
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

function initFilenameTyping(): void {
  const el = document.getElementById('filename-typed');
  if (!el) return;
  const full = el.textContent ?? '';
  const proxy = { n: 0 };
  gsap.to(proxy, {
    n: full.length,
    duration: 1.2,
    ease: 'none',
    onUpdate: () => {
      el.textContent = full.slice(0, Math.round(proxy.n));
    },
    scrollTrigger: { trigger: '#filename-demo', start: 'top 88%', once: true },
  });
}
