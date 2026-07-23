#!/usr/bin/env node

import { resultBadge } from '../js/kinderwagen-result-presentation.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const best = {
  productId: 'best',
  priceEur: 900,
  comparisonFacts: {
    liftWeightKg: 12,
    unfoldedWidthCm: 60,
    basketVolumeL: 30,
    basketLoadKg: 7
  }
};

assert(resultBadge(best, 1, [best]).label === 'Beste Passung zu euren Angaben', 'Rang eins muss die Empfehlung auf die Nutzerangaben begrenzen.');
assert(
  resultBadge({ productId: 'cheap', priceEur: 800, comparisonFacts: {} }, 2, [best, { productId: 'cheap', priceEur: 800, comparisonFacts: {} }]).label === 'Preisgünstigere Alternative',
  'Niedrigerer belegter Preis muss als preisgünstigere Alternative erscheinen.'
);
assert(
  resultBadge(
    { productId: 'not-cheapest', priceEur: 850, comparisonFacts: {} },
    3,
    [best, { productId: 'cheapest', priceEur: 800, comparisonFacts: {} }, { productId: 'not-cheapest', priceEur: 850, comparisonFacts: {} }]
  ).label !== 'Preisgünstigere Alternative',
  'Nur die tatsächlich günstigste Alternative darf das Preis-Badge tragen.'
);
assert(
  resultBadge({ productId: 'light', priceEur: 950, comparisonFacts: { liftWeightKg: 11 } }, 2, [best, { productId: 'light', priceEur: 950, comparisonFacts: { liftWeightKg: 11 } }]).label === 'Leichtere Alternative',
  'Eine belegbar leichtere Alternative muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'narrow', priceEur: 950, comparisonFacts: { unfoldedWidthCm: 58 } }, 2, [best, { productId: 'narrow', priceEur: 950, comparisonFacts: { unfoldedWidthCm: 58 } }]).label === 'Schmalere Alternative',
  'Eine belegbar schmalere Alternative muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'storage', priceEur: 950, comparisonFacts: { basketVolumeL: 40 } }, 2, [best, { productId: 'storage', priceEur: 950, comparisonFacts: { basketVolumeL: 40 } }]).label === 'Mehr Stauraum',
  'Ein belegbar größerer Korb muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'fallback', priceEur: null, comparisonFacts: {}, rankRole: 'Stärkste Alternative' }, 2, [best, { productId: 'fallback', priceEur: null, comparisonFacts: {} }]).label === 'Stärkste Alternative',
  'Fehlende Vergleichsdaten dürfen kein erfundenes Vorteil-Badge erzeugen.'
);

console.log('Ergebnisrollen-Test bestanden: Empfehlung und relationale Alternativen bleiben datengebunden.');
