(() => {
  'use strict';

  document.querySelectorAll('.kw-moment-path').forEach((path) => {
    const links = [...path.querySelectorAll('.kw-moment-nav a[href^="#"]')];
    const moments = links
      .map((link) => ({ link, target: document.querySelector(link.getAttribute('href')) }))
      .filter(({ target }) => target);
    if (!moments.length) return;

    let frame = 0;

    function markCurrent(activeLink) {
      links.forEach((link) => {
        if (link === activeLink) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    function syncCurrent() {
      const navigation = path.querySelector('.kw-moment-nav-wrap');
      const navigationBottom = navigation ? navigation.getBoundingClientRect().bottom : 0;
      const marker = navigationBottom + Math.min(160, window.innerHeight * .18);
      const current = moments.find(({ target }) => {
        const bounds = target.getBoundingClientRect();
        return bounds.top <= marker && bounds.bottom > marker;
      });

      if (current) markCurrent(current.link);
      else links.forEach((link) => link.removeAttribute('aria-current'));
      frame = 0;
    }

    function requestSync() {
      if (frame) return;
      frame = window.requestAnimationFrame(syncCurrent);
    }

    links.forEach((link) => link.addEventListener('click', () => markCurrent(link)));
    window.addEventListener('scroll', requestSync, { passive: true });
    window.addEventListener('resize', requestSync, { passive: true });
    requestSync();
  });
})();
