#!/usr/bin/env node

import { rankingNote, resultBadge } from '../js/kinderwagen-result-presentation.mjs';

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

assert(resultBadge(best, 1, [best]).label === 'Beste Passung', 'Rang eins muss als beste Passung benannt werden.');
assert(
  resultBadge({ productId: 'cheap', priceEur: 800, comparisonFacts: {} }, 2, [best, { productId: 'cheap', priceEur: 800, comparisonFacts: {} }]).label === 'Günstiger',
  'Niedrigerer belegter Preis muss als preisgünstigere Alternative erscheinen.'
);
assert(
  resultBadge(
    { productId: 'not-cheapest', priceEur: 850, comparisonFacts: {} },
    3,
    [best, { productId: 'cheapest', priceEur: 800, comparisonFacts: {} }, { productId: 'not-cheapest', priceEur: 850, comparisonFacts: {} }]
  ).label !== 'Günstiger',
  'Nur die tatsächlich günstigste Alternative darf das Preis-Badge tragen.'
);
assert(
  resultBadge({ productId: 'light', priceEur: 950, comparisonFacts: { liftWeightKg: 11 } }, 2, [best, { productId: 'light', priceEur: 950, comparisonFacts: { liftWeightKg: 11 } }]).label === 'Leichter',
  'Eine belegbar leichtere Alternative muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'narrow', priceEur: 950, comparisonFacts: { unfoldedWidthCm: 58 } }, 2, [best, { productId: 'narrow', priceEur: 950, comparisonFacts: { unfoldedWidthCm: 58 } }]).label === 'Schmaler',
  'Eine belegbar schmalere Alternative muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'storage', priceEur: 950, comparisonFacts: { basketVolumeL: 40 } }, 2, [best, { productId: 'storage', priceEur: 950, comparisonFacts: { basketVolumeL: 40 } }]).label === 'Mehr Stauraum',
  'Ein belegbar größerer Korb muss relational benannt werden.'
);
assert(
  resultBadge({ productId: 'fallback', priceEur: null, comparisonFacts: {}, rankRole: 'Stärkste Alternative' }, 2, [best, { productId: 'fallback', priceEur: null, comparisonFacts: {} }]).label === 'Gute Alternative',
  'Fehlende Vergleichsdaten dürfen kein erfundenes Vorteil-Badge erzeugen.'
);

const tied = [
  { ...best, matchScore: 84, provisionalScore: 92, dataCoverage: 100 },
  { ...best, productId: 'equal', matchScore: 84, provisionalScore: 92, dataCoverage: 100 },
  { ...best, productId: 'capped', matchScore: 84, provisionalScore: 91, dataCoverage: 100 }
];
assert(resultBadge(tied[0], 1, tied).label === 'Gleichauf', 'Ein rechnerischer Gleichstand darf nicht als eindeutiger Sieger erscheinen.');
assert(resultBadge(tied[1], 2, tied).label === 'Gleichauf', 'Gleichauf liegende Alternativen müssen als solche erkennbar sein.');
assert(resultBadge(tied[2], 3, tied).label === 'Gleicher Wert', 'Ein nur im sichtbaren Prozentwert gleiches Modell muss vom rechnerischen Gleichstand unterscheidbar bleiben.');
assert(rankingNote(tied[0], 1, tied).includes('Reihenfolge ist keine Präferenz'), 'Technischer Gleichstand muss an Rang eins erklärt werden.');
assert(rankingNote(tied[1], 2, tied).includes('Rechnerisch gleichauf'), 'Ein exakt gleichauf liegendes Modell benötigt eine klare Erklärung.');
assert(rankingNote(tied[2], 3, tied).includes('übrigen gewichteten Kriterien'), 'Ein nur im angezeigten Wert gleiches Modell benötigt die sachliche Tie-Break-Erklärung.');

console.log('Ergebnisrollen-Test bestanden: Empfehlung, Gleichstand und relationale Alternativen bleiben datengebunden.');
