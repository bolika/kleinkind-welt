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

  // Frueh triggern (240px bevor die Sektion sichtbar wird), damit beim
  // Scrollen nie eine scheinbar leere Flaeche entsteht.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 240px 0px', threshold: 0 });

  var pending = [];
  targets.forEach(function (el, i) {
    // Erste Sektion (Hero) nie verzoegern: sofort sichtbar.
    if (i === 0) return;
    el.classList.add('reveal');
    pending.push(el);
    observer.observe(el);
  });

  // Sicherheitsnetz: Nach 3s alles aufdecken, falls der Observer auf
  // einem Geraet nicht wie erwartet feuert.
  setTimeout(function () {
    pending.forEach(function (el) {
      if (!el.classList.contains('reveal-visible')) {
        el.classList.add('reveal-visible');
        observer.unobserve(el);
      }
    });
  }, 3000);
})();
