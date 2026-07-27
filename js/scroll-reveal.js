/* Design-System v2: einmaliger Scroll-Reveal auf Sektions-Ebene.
   Progressive Enhancement: ohne IntersectionObserver oder mit
   prefers-reduced-motion bleibt alles sofort sichtbar. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var targets = document.querySelectorAll(
    'main > section, main > .situation-section, main > .trust-bar'
  );
  if (!targets.length) return;

  document.documentElement.classList.add('reveal-init');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  targets.forEach(function (el, i) {
    // Erste Sektion (Hero) nie verzoegern: sofort sichtbar.
    if (i === 0) return;
    el.classList.add('reveal');
    observer.observe(el);
  });
})();
