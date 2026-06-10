import gsap from 'gsap';

/** Quick reveals, count-ups, one typing effect, and the stacked-panel scroll. */
export function initSections(): void {
  initHero();
  initStackMorph();
  initReveals();
  initCounts();
  initFilenameTyping();
}

/**
 * The signature scroll: each section sticks once it has fully scrolled and
 * the next panel slides over it while the covered one sinks back and dims.
 * Pure sticky positioning plus one scrubbed tween per seam, so any section
 * height works and the page remains plain scrolling underneath.
 */
function initStackMorph(): void {
  if (window.innerWidth < 880 || window.innerHeight < 560) return;

  const panels = gsap.utils.toArray<HTMLElement>('main > section, .footer');
  if (panels.length < 2) return;

  document.documentElement.classList.add('js-stack');

  const setTops = () => {
    panels.forEach((panel) => {
      panel.style.top = `${Math.min(0, innerHeight - panel.offsetHeight)}px`;
    });
  };
  setTops();
  window.addEventListener('resize', setTops);

  panels.forEach((panel, i) => {
    if (i === 0) return;
    const prev = panels[i - 1];
    const targets = Array.from(prev.children).filter(
      (el) => !el.classList.contains('sr-only'),
    );
    gsap.to(targets, {
      scale: 0.95,
      opacity: 0.35,
      transformOrigin: 'center 30%',
      ease: 'none',
      scrollTrigger: {
        trigger: panel,
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      },
    });
  });
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
