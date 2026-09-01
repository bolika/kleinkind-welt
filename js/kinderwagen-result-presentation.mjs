export function resultBadge(result, rank, results) {
  const best = results[0];
  const tiedAtTop = typeof best?.matchScore === 'number' && result.matchScore === best.matchScore && results.filter((item) => item.matchScore === best.matchScore).length > 1;
  const exactTiesAtTop = tiedAtTop
    ? results.filter((item) => item.matchScore === best.matchScore && item.provisionalScore === best.provisionalScore && item.dataCoverage === best.dataCoverage)
    : [];
  const isExactTie = exactTiesAtTop.some((item) => item.productId === result.productId);
  if (exactTiesAtTop.length > 1 && isExactTie) return { label: 'Gleichauf', kind: 'alternative' };
  if (tiedAtTop) return { label: rank === 1 ? 'Vorn nach Kriterien' : 'Gleicher Wert', kind: rank === 1 ? 'recommended' : 'alternative' };
  if (rank === 1) return { label: 'Beste Passung', kind: 'recommended' };
  const facts = result.comparisonFacts ?? {};
  const bestFacts = best?.comparisonFacts ?? {};
  const pricedAlternatives = results
    .slice(1)
    .filter((item) => typeof item.priceEur === 'number' && typeof best?.priceEur === 'number' && item.priceEur < best.priceEur)
    .sort((a, b) => a.priceEur - b.priceEur);
  if (pricedAlternatives[0]?.productId === result.productId) {
    return { label: 'Günstiger', kind: 'price' };
  }
  if (typeof facts.liftWeightKg === 'number' && typeof bestFacts.liftWeightKg === 'number' && facts.liftWeightKg <= bestFacts.liftWeightKg - 0.5) {
    return { label: 'Leichter', kind: 'compact' };
  }
  if (typeof facts.unfoldedWidthCm === 'number' && typeof bestFacts.unfoldedWidthCm === 'number' && facts.unfoldedWidthCm <= bestFacts.unfoldedWidthCm - 1) {
    return { label: 'Schmaler', kind: 'compact' };
  }
  if (typeof facts.basketVolumeL === 'number' && typeof bestFacts.basketVolumeL === 'number' && facts.basketVolumeL >= bestFacts.basketVolumeL + 5) {
    return { label: 'Mehr Stauraum', kind: 'feature' };
  }
  if (typeof facts.basketLoadKg === 'number' && typeof bestFacts.basketLoadKg === 'number' && facts.basketLoadKg >= bestFacts.basketLoadKg + 2) {
    return { label: 'Mehr Traglast', kind: 'feature' };
  }
  return {
    label: rank === 2 ? 'Gute Alternative' : 'Weitere Option',
    kind: 'alternative'
  };
}

export function rankingNote(result, rank, results) {
  const best = results[0];
  if (!best || typeof result.matchScore !== 'number' || typeof best.matchScore !== 'number') return '';
  if (result.matchScore < best.matchScore) return `${best.matchScore - result.matchScore} Punkte hinter der höchsten Passung`;

  const displayedTies = results.filter((item) => item.matchScore === best.matchScore);
  if (displayedTies.length < 2) return '';
  const exactTies = displayedTies.filter((item) =>
    item.provisionalScore === best.provisionalScore && item.dataCoverage === best.dataCoverage
  );
  const isExactTie = result.provisionalScore === best.provisionalScore && result.dataCoverage === best.dataCoverage;

  if (rank === 1 && exactTies.length > 1) {
    return `${exactTies.length} Modelle sind rechnerisch gleichauf. Ihre Reihenfolge ist keine Präferenz.`;
  }
  if (rank === 1) {
    return 'Gleicher angezeigter Wert. Rang 1 erfüllt die übrigen gewichteten Kriterien stärker.';
  }
  if (isExactTie) return 'Rechnerisch gleichauf mit Rang 1. Die Reihenfolge ist keine Präferenz.';
  return 'Gleicher angezeigter Wert; bei den übrigen gewichteten Kriterien knapp dahinter.';
}
