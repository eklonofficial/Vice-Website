/**
 * Recreates the app's rolling-buffer waveform card: thin vertical blue bars
 * drifting leftward. The trailing segment ("the last 15 seconds") can be
 * lit up via setHighlight(0..1) from the scroll timeline.
 */
export interface BufferViz {
  setHighlight(value: number): void;
  start(): void;
  stop(): void;
}

const BAR_W = 3;
const GAP = 4;

export function initBufferViz(canvas: HTMLCanvasElement, animate: boolean): BufferViz {
  const ctx = canvas.getContext('2d');
  let highlight = 0;
  let raf = 0;
  let running = false;
  let dpr = 1;

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
  }

  // Smooth pseudo-random bar heights, stable per bar index
  function amp(i: number): number {
    return (
      0.36 +
      0.22 * Math.sin(i * 0.83) +
      0.18 * Math.sin(i * 0.211 + 1.7) +
      0.12 * Math.sin(i * 1.97 + 0.4)
    );
  }

  function draw(t: number): void {
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const step = (BAR_W + GAP) * dpr;
    const count = Math.ceil(w / step) + 2;
    const scroll = animate ? (t * 0.022 * dpr) % step : 0;
    const phase = animate ? Math.floor((t * 0.022 * dpr) / step) : 0;
    const highlightFrom = w * (1 - 0.16 * highlight) - (highlight > 0 ? 0 : w);

    for (let i = 0; i < count; i++) {
      const x = w - i * step + scroll - step;
      const a = amp(i + phase);
      const wob = animate ? 0.06 * Math.sin(t * 0.004 + i * 0.7) : 0;
      const bh = Math.max(3 * dpr, (a + wob) * h * 0.86);
      const y = (h - bh) / 2;

      const lit = highlight > 0 && x >= highlightFrom;
      ctx.fillStyle = lit
        ? `rgba(147, 197, 253, ${0.85 * highlight + 0.25})`
        : 'rgba(59, 130, 246, 0.55)';
      ctx.beginPath();
      ctx.roundRect(x, y, BAR_W * dpr, bh, 2 * dpr);
      ctx.fill();
    }
  }

  function loop(t: number): void {
    if (!running) return;
    draw(t);
    raf = requestAnimationFrame(loop);
  }

  resize();
  draw(0);

  window.addEventListener('resize', () => {
    resize();
    if (!running) draw(0);
  });

  // Only spend frames while the card is on screen
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries[0]?.isIntersecting ?? false;
      if (visible && animate && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.05 },
  );
  io.observe(canvas);

  return {
    setHighlight(value: number) {
      highlight = Math.min(1, Math.max(0, value));
      if (!running) draw(0);
    },
    start() {
      if (animate && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
  };
}
