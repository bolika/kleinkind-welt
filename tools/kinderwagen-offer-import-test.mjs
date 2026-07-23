#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importOffers, mergeOfferDocuments, parseCsv } from './import-awin-offers.mjs';
import { displayableOffer, isFreshDate, offersForProduct, trackingLink } from '../js/kinderwagen-offers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const rows = parseCsv(read('tools/fixtures/awin-babyprofi-sample.csv'));
const mappingData = JSON.parse(read('tools/fixtures/awin-babyprofi-mapping.sample.json'));
const now = new Date('2026-07-22T10:00:00.000Z');
const { document, report } = importOffers({ rows, mappingData, now });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(report.feedRows === 2, 'Beide Feed-Zeilen müssen gelesen werden.');
assert(report.mappedOffers === 2, 'Beide exakt kuratierten Zuordnungen müssen importiert werden.');
assert(report.displayableOffers === 1, 'Nur die vollständige Geburtskonfiguration darf freigegeben werden.');
assert(document.offers[0].price.amount === 799.9, 'Preis wurde nicht korrekt eingelesen.');
assert(document.offers[0].identifiers.gtins[0] === '1234567890123', 'GTIN wurde nicht normalisiert.');
assert(document.offers[0].availability.stockQuantity === undefined, 'Leerer Lagerbestand darf nicht als 0 Stück importiert werden.');
assert(document.offers[0].imageUrl === undefined, 'Feed-Bilder dürfen vor geklärter Bildnutzung nicht importiert werden.');
const approvedImageDocument = importOffers({
  rows,
  mappingData: { ...mappingData, feedImageUsageStatus: 'approved_for_feed_only' },
  now
}).document;
assert(approvedImageDocument.offers[0].imageUrl === 'https://example.invalid/testmodell.jpg', 'Freigegebenes Feed-Bild muss importiert werden.');
assert(approvedImageDocument.offers[0].imageRightsStatus === 'approved_for_feed_only', 'Freigegebenes Feed-Bild benötigt einen expliziten Rechte-Status.');
assert(displayableOffer(document.offers[0], now), 'Vollständiges verfügbares Angebot muss darstellbar sein.');
assert(!displayableOffer(document.offers[1], now), 'Teilkonfiguration darf nicht als Kaufangebot erscheinen.');
assert(offersForProduct(document.offers, 'bugaboo-fox-5-renew', now).length === 1, 'UI-Auswahl muss Teilkonfiguration ausfiltern.');
assert(isFreshDate(document.offers[0].price.freshUntil, now), 'Importierter Preis muss frisch sein.');
assert(trackingLink(document.offers[0], 'navigator_result_1').includes('clickref=navigator_result_1'), 'Awin-Clickref fehlt.');
const bugabooRows = rows.map((row, index) => ({
  ...row,
  merchant_id: '55555',
  merchant_product_id: `BG-TEST-${index + 1}`,
  product_GTIN: `223456789012${index + 3}`,
  ean: `223456789012${index + 3}`
}));
const bugabooMapping = {
  ...mappingData,
  advertiserId: 55555,
  advertiserName: 'Bugaboo DE',
  merchant: { id: 'bugaboo', name: 'Bugaboo' },
  mappings: mappingData.mappings.map((mapping, index) => ({
    ...mapping,
    merchantProductIds: [`BG-TEST-${index + 1}`],
    gtins: [`223456789012${index + 3}`]
  }))
};
const bugabooDocument = importOffers({ rows: bugabooRows, mappingData: bugabooMapping, now }).document;
const merged = mergeOfferDocuments(document, bugabooDocument);
assert(merged.sources.length === 2 && merged.offers.length === 4, 'Mehrhändler-Merge muss beide Quellen und Angebote erhalten.');
assert(merged.offers.some((offer) => offer.offerId === 'bugaboo-bg-test-1'), 'Offer-ID muss die generische Händler-ID verwenden.');
assert(() => {
  try {
    importOffers({ rows, mappingData: { ...mappingData, advertiserId: null }, now });
    return false;
  } catch {
    return true;
  }
}, 'Unbekannte Advertiser-ID muss den Import blockieren.');
const higherBaseLowerTotal = structuredClone(document.offers[0]);
higherBaseLowerTotal.offerId = 'babyprofi-total-low';
higherBaseLowerTotal.price = { amount: 805, currency: 'EUR', shippingAmount: 0, freshUntil: '2026-07-24' };
const lowerBaseHigherTotal = structuredClone(document.offers[0]);
lowerBaseHigherTotal.offerId = 'babyprofi-total-high';
lowerBaseHigherTotal.merchant = { id: 'testshop', name: 'Testshop' };
lowerBaseHigherTotal.price = { amount: 790, currency: 'EUR', shippingAmount: 30, freshUntil: '2026-07-24' };
assert(offersForProduct([lowerBaseHigherTotal, higherBaseLowerTotal], 'bugaboo-fox-5-renew', now)[0].offerId === 'babyprofi-total-low', 'Angebote müssen nach Gesamtpreis inklusive Versand sortieren.');
const cheaperPreorder = structuredClone(higherBaseLowerTotal);
cheaperPreorder.offerId = 'babyprofi-preorder';
cheaperPreorder.price.amount = 700;
cheaperPreorder.availability = { status: 'preorder', freshUntil: '2026-07-24' };
assert(offersForProduct([cheaperPreorder, higherBaseLowerTotal], 'bugaboo-fox-5-renew', now)[0].offerId === 'babyprofi-total-low', 'Frisch verfügbare Angebote müssen vor Vorbestellungen stehen.');
const staleOutOfStock = structuredClone(document.offers[0]);
staleOutOfStock.availability = { status: 'out_of_stock', freshUntil: '2026-07-21' };
assert(displayableOffer(staleOutOfStock, now), 'Abgelaufener Nicht-verfügbar-Status darf den Händler nicht dauerhaft ausblenden.');

console.log('Generischer Awin-Importtest bestanden: Mehrhändler-Merge, exakte Zuordnung, Gesamtpreis, Konfigurationsschutz, Frische und Clickref geprüft.');
