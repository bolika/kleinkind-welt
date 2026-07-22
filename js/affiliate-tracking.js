(function () {
  var ledgerUrl = '/data/affiliate-product-ledger.json';

  function cleanText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function shortCode(link) {
    var match = (link.getAttribute('href') || '').match(/amzn\.to\/([A-Za-z0-9]+)/i);
    return match ? match[1] : null;
  }

  function applyBlockedLinks(ledger) {
    var blocked = new Set((ledger.entries || [])
      .filter(function (entry) { return /^blocked-/.test(entry.status || ''); })
      .map(function (entry) { return entry.shortCode; }));

    document.querySelectorAll('a[href*="amzn.to/"]').forEach(function (link) {
      var code = shortCode(link);
      if (!code || !blocked.has(code)) return;

      link.classList.add('affiliate-link--blocked');
      link.dataset.affiliateBlocked = 'true';
      link.dataset.originalHref = link.href;
      link.removeAttribute('data-affiliate');
      link.setAttribute('aria-disabled', 'true');
      link.setAttribute('title', 'Produktlink vorübergehend deaktiviert: redaktionelle Prüfung ausstehend.');
      link.setAttribute('href', '/bewertungsmethode#produktpruefung');
      if (!link.querySelector('img')) {
        link.textContent = 'Produktprüfung ansehen';
      }
    });
  }

  function loadAffiliateLedger() {
    if (!window.fetch) return;
    fetch(ledgerUrl, { credentials: 'same-origin', cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (ledger) { if (ledger) applyBlockedLinks(ledger); })
      .catch(function () {});
  }

  function pageSlug(link) {
    if (link.dataset.article) return link.dataset.article;
    var parts = window.location.pathname.split('/').filter(Boolean);
    return (parts[parts.length - 1] || 'startseite').replace(/\.html$/, '');
  }

  function placement(link) {
    if (link.dataset.placement) return link.dataset.placement;
    if (link.closest('.top-pick-strip')) return 'top-pick-strip';
    if (link.closest('.kaufbox-hero')) return 'kaufbox-primary';
    if (link.closest('.kaufbox-option')) return 'kaufbox-alternative';
    if (link.closest('.testsieger-box')) return 'top-empfehlung';
    if (link.closest('.kw-product-card, .produkt-box, .produkt-card, .produkt-karte')) return 'produktkarte';
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

    scope = link.closest('.kw-product-card, .produkt-box, .produkt-card, .produkt-karte, .testsieger-box');
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
        produkt_id: link.dataset.productId || 'nicht_gesetzt',
        platzierung: placement(link),
        partner: link.dataset.affiliate || destinationHost(link),
        haendler: link.dataset.merchant || destinationHost(link),
        angebot: link.dataset.offerId || 'nicht_gesetzt',
        ergebnisrang: link.dataset.resultRank || 'nicht_gesetzt',
        match_score: link.dataset.matchScore || 'nicht_gesetzt',
        clickref: link.dataset.clickref || 'nicht_gesetzt',
        ziel_host: destinationHost(link),
        event_schema: '3'
      }
    });
  });

  document.addEventListener('click', function (event) {
    var target = event.target;
    var blockedLink = target && target.closest ? target.closest('a[data-affiliate-blocked="true"]') : null;
    if (!blockedLink) return;
    event.preventDefault();
    window.location.href = '/bewertungsmethode#produktpruefung';
  });

  loadAffiliateLedger();
})();
