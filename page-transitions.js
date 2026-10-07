(() => {
  'use strict';
  const overlay = document.querySelector('[data-page-transition]');
  if (!overlay) return;
  const main = document.querySelector('main');
  let timer = null;
  let trigger = null;
  const reset = () => {
    clearTimeout(timer);
    timer = null;
    overlay.hidden = true;
    document.documentElement.classList.remove('is-page-leaving');
    main?.removeAttribute('aria-busy');
    if (main) main.inert = false;
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-page-link]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const destination = new URL(link.href, location.href);
    if (!['http:', 'https:', 'file:'].includes(destination.protocol) || destination.origin !== location.origin) return;
    event.preventDefault();
    if (timer !== null) return;
    trigger = link;
    overlay.hidden = false;
    document.documentElement.classList.add('is-page-leaving');
    main?.setAttribute('aria-busy', 'true');
    if (main) main.inert = true;
    overlay.focus({preventScroll:true});
    timer = setTimeout(() => location.assign(destination.href), 1000);
  });
  document.addEventListener('keydown', event => {
    if (timer === null) return;
    if (event.key === 'Tab') event.preventDefault();
    if (event.key === 'Escape') {
      event.preventDefault();
      reset();
      trigger?.focus({preventScroll:true});
    }
  });
  // A browser Back operation can restore the previous page from its page cache.
  addEventListener('pageshow', reset);
})();
