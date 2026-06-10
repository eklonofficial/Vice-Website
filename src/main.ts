import '@fontsource-variable/inter/opsz.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';

import { initCopyButtons } from './scripts/copy-buttons';
import { initBufferViz } from './scripts/buffer-viz';
import { prefersReducedMotion } from './scripts/support';

initCopyButtons();

const reduced = prefersReducedMotion();
const bufferCanvas = document.getElementById('buffer-canvas') as HTMLCanvasElement | null;
const bufferViz = bufferCanvas ? initBufferViz(bufferCanvas, !reduced) : null;
bufferViz?.setHighlight(0.45);

async function boot(): Promise<void> {
  if (reduced) return;

  document.documentElement.classList.add('js-motion');

  try {
    const { initScroll } = await import('./scripts/scroll');
    initScroll();
    const { initSections } = await import('./scripts/sections');
    initSections();
  } catch (err) {
    // If the motion modules fail, fall back to the fully static page
    document.documentElement.classList.remove('js-motion');
    console.error('Vice site: motion disabled,', err);
  }
}

void boot();
