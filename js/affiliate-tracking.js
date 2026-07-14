(function () {
  function cleanText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function pageSlug(link) {
    if (link.dataset.article) return link.dataset.article;
    var parts = window.location.pathname.split('/').filter(Boolean);
    return (parts[parts.length - 1] || 'startseite').replace(/\.html$/, '');
  }

  function placement(link) {
    if (link.dataset.placement) return link.dataset.placement;
    if (link.closest('.kaufbox-hero')) return 'kaufbox-primary';
    if (link.closest('.kaufbox-option')) return 'kaufbox-alternative';
    if (link.closest('.testsieger-box')) return 'top-empfehlung';
    if (link.closest('.produkt-box, .produkt-card, .produkt-karte')) return 'produktbox';
    if (link.closest('.vergleich-tabelle, .comparison-table, table') || link.classList.contains('btn-table')) {
      return 'vergleichstabelle';
    }
    if (link.classList.contains('btn-hero')) return 'hero-cta';
    return 'intext';
  }

  function productName(link) {
    if (link.dataset.product) return cleanText(link.dataset.product);

    var scope = link.closest('.kaufbox-hero, .kaufbox-option');
    var name = scope && scope.querySelector('.kaufbox-name');
    if (name) return cleanText(name.textContent);

    scope = link.closest('.produkt-box, .produkt-card, .produkt-karte, .testsieger-box');
    name = scope && scope.querySelector('[data-product-name], .produkt-name, h3, h2');
    if (name) return cleanText(name.textContent.replace(/^#?\d+\s*[–-]?\s*/, ''));

    scope = link.closest('tr');
    name = scope && scope.querySelector('[data-product-name], .produkt-name, th, td');
    if (name) return cleanText(name.textContent);

    return cleanText(link.getAttribute('aria-label') || link.textContent || 'Affiliate-Link');
  }

  function destinationHost(link) {
    try {
      return new URL(link.href, window.location.href).hostname;
    } catch (error) {
      return 'unbekannt';
    }
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[data-affiliate]') : null;
    if (!link || !window.plausible) return;

    window.plausible('Affiliate-Klick', {
      props: {
        seite: pageSlug(link),
        produkt: productName(link),
        platzierung: placement(link),
        partner: link.dataset.affiliate || destinationHost(link),
        ziel_host: destinationHost(link),
        event_schema: '2'
      }
    });
  });
})();
