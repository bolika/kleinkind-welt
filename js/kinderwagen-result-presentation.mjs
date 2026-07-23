export function resultBadge(result, rank, results) {
  if (rank === 1) return { label: 'Beste Passung zu euren Angaben', kind: 'recommended' };
  const best = results[0];
  const facts = result.comparisonFacts ?? {};
  const bestFacts = best?.comparisonFacts ?? {};
  const pricedAlternatives = results
    .slice(1)
    .filter((item) => typeof item.priceEur === 'number' && typeof best?.priceEur === 'number' && item.priceEur < best.priceEur)
    .sort((a, b) => a.priceEur - b.priceEur);
  if (pricedAlternatives[0]?.productId === result.productId) {
    return { label: 'Preisgünstigere Alternative', kind: 'price' };
  }
  if (typeof facts.liftWeightKg === 'number' && typeof bestFacts.liftWeightKg === 'number' && facts.liftWeightKg <= bestFacts.liftWeightKg - 0.5) {
    return { label: 'Leichtere Alternative', kind: 'compact' };
  }
  if (typeof facts.unfoldedWidthCm === 'number' && typeof bestFacts.unfoldedWidthCm === 'number' && facts.unfoldedWidthCm <= bestFacts.unfoldedWidthCm - 1) {
    return { label: 'Schmalere Alternative', kind: 'compact' };
  }
  if (typeof facts.basketVolumeL === 'number' && typeof bestFacts.basketVolumeL === 'number' && facts.basketVolumeL >= bestFacts.basketVolumeL + 5) {
    return { label: 'Mehr Stauraum', kind: 'feature' };
  }
  if (typeof facts.basketLoadKg === 'number' && typeof bestFacts.basketLoadKg === 'number' && facts.basketLoadKg >= bestFacts.basketLoadKg + 2) {
    return { label: 'Mehr Korb-Traglast', kind: 'feature' };
  }
  return {
    label: rank === 2 ? 'Stärkste Alternative' : 'Weitere gute Passung',
    kind: 'alternative'
  };
}
