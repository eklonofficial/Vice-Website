export function initCopyButtons(): void {
  const status = document.querySelector<HTMLElement>('[data-copy-status]');

  document.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLElement>('[data-copy]');
    if (!btn) return;
    const text = btn.dataset.copy;
    if (!text) return;

    void copyText(text).then((ok) => {
      if (!ok) return;
      btn.classList.add('is-copied');
      if (status) status.textContent = 'Command copied to clipboard';
      window.setTimeout(() => {
        btn.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, 1600);
    });
  });
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Plain-http fallback (e.g. LAN preview): clipboard API needs a secure context
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
