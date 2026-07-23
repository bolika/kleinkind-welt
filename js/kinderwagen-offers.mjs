const DISPLAYABLE_CONFIGURATION = 'exact_required_configuration';

export function isFreshDate(date, today = new Date()) {
  if (!date) return false;
  const current = today instanceof Date ? today.toISOString().slice(0, 10) : String(today).slice(0, 10);
  return date >= current;
}

export function displayableOffer(offer, today = new Date()) {
  const currentlyUnavailable = offer?.availability?.status === 'out_of_stock' && isFreshDate(offer.availability?.freshUntil, today);
  return Boolean(
    offer?.productId &&
    offer?.configuration?.status === DISPLAYABLE_CONFIGURATION &&
    !currentlyUnavailable &&
    typeof offer?.deeplink === 'string' &&
    offer.deeplink.startsWith('https://') &&
    offer?.merchant?.name
  );
}

export function offersForProduct(offers, productId, today = new Date()) {
  return (offers ?? [])
    .filter((offer) => offer.productId === productId && displayableOffer(offer, today))
    .sort((left, right) => {
      const availabilityRank = (offer) => {
        if (!isFreshDate(offer.availability?.freshUntil, today)) return 3;
        return { in_stock: 0, preorder: 1, unknown: 2 }[offer.availability?.status] ?? 3;
      };
      const leftAvailability = availabilityRank(left);
      const rightAvailability = availabilityRank(right);
      if (leftAvailability !== rightAvailability) return leftAvailability - rightAvailability;
      const leftFresh = isFreshDate(left.price?.freshUntil, today);
      const rightFresh = isFreshDate(right.price?.freshUntil, today);
      if (leftFresh !== rightFresh) return leftFresh ? -1 : 1;
      const leftShippingKnown = typeof left.price?.shippingAmount === 'number';
      const rightShippingKnown = typeof right.price?.shippingAmount === 'number';
      if (leftShippingKnown !== rightShippingKnown) return leftShippingKnown ? -1 : 1;
      const leftPrice = leftFresh && leftShippingKnown ? left.price.amount + left.price.shippingAmount : Number.POSITIVE_INFINITY;
      const rightPrice = rightFresh && rightShippingKnown ? right.price.amount + right.price.shippingAmount : Number.POSITIVE_INFINITY;
      if (leftPrice !== rightPrice) return leftPrice - rightPrice;
      return left.merchant.name.localeCompare(right.merchant.name, 'de');
    });
}

export function trackingLink(offer, placement) {
  try {
    const url = new URL(offer.deeplink);
    if (/(^|\.)awin1\.com$/i.test(url.hostname)) url.searchParams.set('clickref', placement);
    return url.toString();
  } catch {
    return offer.deeplink;
  }
}
