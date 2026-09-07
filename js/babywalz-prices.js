(() => {
  'use strict';

  const SNAPSHOT_URL = '/data/affiliate-offers/babywalz-prices.v0.1.json';
  const PRICE_LIMIT = 20;
  const money = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
  const date = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  function validSnapshot(snapshot) {
    if (snapshot?.schemaVersion !== 1 || snapshot?.priceIncludesShipping !== true) return false;
    const generatedAt = Date.parse(snapshot.generatedAt);
    const freshUntil = Date.parse(snapshot.freshUntil);
    const now = Date.now();
    return Number.isFinite(generatedAt) && Number.isFinite(freshUntil) && generatedAt <= now && now <= freshUntil;
  }

  function validOffer(offer) {
    const pageLimit = Number(document.body.dataset.priceLimit) ||
      (document.body.classList.contains('page-spielzeug-unter-20-euro') ? PRICE_LIMIT : Infinity);
    const withinPageLimit = offer?.totalPrice <= pageLimit;
    return offer?.availability === 'in_stock' &&
      offer.currency === 'EUR' &&
      Number.isFinite(offer.productPrice) && offer.productPrice > 0 &&
      Number.isFinite(offer.shipping) && offer.shipping >= 0 &&
      Number.isFinite(offer.totalPrice) && offer.totalPrice > 0 && withinPageLimit &&
      Math.abs(offer.totalPrice - (offer.productPrice + offer.shipping)) < 0.011;
  }

  function validImage(offer) {
    return offer?.imageRightsStatus === 'approved_for_feed_only' &&
      typeof offer.imageUrl === 'string' &&
      /^https:\/\//.test(offer.imageUrl) &&
      !/noimage|placeholder|kein[-_]?bild/i.test(offer.imageUrl);
  }

  function priceRow(offer, generatedAt) {
    const row = document.createElement('div');
    row.className = 'kw-live-offer';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', 'Aktueller Gesamtpreis bei Babywalz');

    const total = document.createElement('strong');
    total.className = 'kw-live-offer-total';
    total.textContent = `Gesamt inkl. Versand: ${money.format(offer.totalPrice)}`;

    const details = document.createElement('span');
    details.className = 'kw-live-offer-details';
    details.textContent = `Produkt ${money.format(offer.productPrice)} + Versand ${money.format(offer.shipping)}`;

    const checked = document.createElement('small');
    checked.className = 'kw-live-offer-checked';
    checked.textContent = `Stand ${date.format(new Date(generatedAt))}`;

    row.append(total, details, checked);
    return row;
  }

  function scopeFor(link) {
    return link.closest('.kw-product-card, .kaufbox-hero, .kaufbox-option, .pilot-product, .produkt-box, .kw-moment-action');
  }

  function actionAreaFor(link) {
    return link.closest('.kw-product-actions, .kaufbox-actions, .pilot-actions') || link;
  }

  function renderOffer(link, offer, generatedAt) {
    const scope = scopeFor(link);
    if (!scope || scope.classList.contains('has-fresh-babywalz-offer')) return;

    const actionArea = actionAreaFor(link);
    if (validImage(offer) && !scope.querySelector('.kw-offer-media')) {
      const mediaLink = document.createElement('a');
      mediaLink.className = 'kw-offer-media';
      mediaLink.href = link.href;
      mediaLink.target = '_blank';
      mediaLink.rel = 'sponsored noopener nofollow';
      mediaLink.dataset.affiliate = 'awin';
      mediaLink.dataset.merchant = 'babywalz';
      mediaLink.dataset.productId = offer.productId;
      mediaLink.dataset.offerId = link.dataset.offerId;
      mediaLink.dataset.placement = 'product-image';
      mediaLink.setAttribute('aria-label', `${offer.title} bei Babywalz ansehen`);

      const image = document.createElement('img');
      image.src = offer.imageUrl;
      image.alt = offer.title;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer-when-downgrade';
      mediaLink.append(image);
      scope.insertBefore(mediaLink, scope.firstChild);
    }
    const row = priceRow(offer, generatedAt);
    actionArea.parentNode.insertBefore(row, actionArea);
    scope.classList.add('has-fresh-babywalz-offer');
    link.classList.add('kw-offer-primary');

    const amazon = scope.querySelector('a[data-affiliate="amazon"]');
    if (scope.dataset.merchantChoice === 'single') {
      link.hidden = false;
      if (amazon) amazon.hidden = true;
      return;
    }

    if (amazon) {
      amazon.dataset.originalLabel = amazon.textContent.trim();
      amazon.textContent = 'Amazon-Preis prüfen';
      amazon.classList.add('kw-offer-secondary');
    }
  }

  async function init() {
    const links = [...document.querySelectorAll('a[data-merchant="babywalz"][data-offer-id]')];
    if (!links.length) return;

    // A named product must keep its own merchant destination when prices expire.
    for (const link of links) {
      if (scopeFor(link)?.dataset.merchantChoice !== 'single') continue;
      link.hidden = false;
      const amazon = scopeFor(link).querySelector('a[data-affiliate="amazon"]');
      if (amazon) amazon.hidden = true;
    }

    try {
      const response = await fetch(SNAPSHOT_URL, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return;
      const snapshot = await response.json();
      if (!validSnapshot(snapshot)) return;

      for (const link of links) {
        const offer = snapshot.offers?.[link.dataset.offerId];
        if (validOffer(offer)) renderOffer(link, offer, snapshot.generatedAt);
        else if (offer?.availability === 'out_of_stock') link.textContent = 'Verfügbarkeit bei Babywalz prüfen';
        else if (Number(document.body.dataset.priceLimit) > 0 && offer?.totalPrice > Number(document.body.dataset.priceLimit)) {
          link.textContent = 'Aktuell über Budget: bei Babywalz prüfen';
        }
      }
    } catch {
      // The merchant CTA remains usable; only freshness-bound price UI is omitted.
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
