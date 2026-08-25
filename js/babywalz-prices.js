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
    return offer?.availability === 'in_stock' &&
      offer.currency === 'EUR' &&
      Number.isFinite(offer.productPrice) && offer.productPrice > 0 &&
      Number.isFinite(offer.shipping) && offer.shipping >= 0 &&
      Number.isFinite(offer.totalPrice) && offer.totalPrice <= PRICE_LIMIT &&
      Math.abs(offer.totalPrice - (offer.productPrice + offer.shipping)) < 0.011;
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
    return link.closest('.kw-product-card, .kaufbox-hero, .kaufbox-option');
  }

  function actionAreaFor(link) {
    return link.closest('.kw-product-actions, .kaufbox-actions') || link;
  }

  function renderOffer(link, offer, generatedAt) {
    const scope = scopeFor(link);
    if (!scope || scope.classList.contains('has-fresh-babywalz-offer')) return;

    const actionArea = actionAreaFor(link);
    const row = priceRow(offer, generatedAt);
    actionArea.parentNode.insertBefore(row, actionArea);
    scope.classList.add('has-fresh-babywalz-offer');
    link.classList.add('kw-offer-primary');

    const amazon = scope.querySelector('a[data-affiliate="amazon"]');
    if (amazon) {
      amazon.dataset.originalLabel = amazon.textContent.trim();
      amazon.textContent = 'Amazon-Preis prüfen';
      amazon.classList.add('kw-offer-secondary');
    }
  }

  async function init() {
    const links = [...document.querySelectorAll('a[data-merchant="babywalz"][data-offer-id]')];
    if (!links.length) return;

    try {
      const response = await fetch(SNAPSHOT_URL, { cache: 'no-store', credentials: 'same-origin' });
      if (!response.ok) return;
      const snapshot = await response.json();
      if (!validSnapshot(snapshot)) return;

      for (const link of links) {
        const offer = snapshot.offers?.[link.dataset.offerId];
        if (validOffer(offer)) renderOffer(link, offer, snapshot.generatedAt);
      }
    } catch {
      // Links bleiben als unaufdringlicher Fallback nutzbar, wenn Preisdaten fehlen.
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
