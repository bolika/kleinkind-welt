#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { importOffers, parseCsv } from './import-awin-babyprofi-offers.mjs';
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
assert(displayableOffer(document.offers[0], now), 'Vollständiges verfügbares Angebot muss darstellbar sein.');
assert(!displayableOffer(document.offers[1], now), 'Teilkonfiguration darf nicht als Kaufangebot erscheinen.');
assert(offersForProduct(document.offers, 'bugaboo-fox-5-renew', now).length === 1, 'UI-Auswahl muss Teilkonfiguration ausfiltern.');
assert(isFreshDate(document.offers[0].price.freshUntil, now), 'Importierter Preis muss frisch sein.');
assert(trackingLink(document.offers[0], 'navigator_result_1').includes('clickref=navigator_result_1'), 'Awin-Clickref fehlt.');
const staleOutOfStock = structuredClone(document.offers[0]);
staleOutOfStock.availability = { status: 'out_of_stock', freshUntil: '2026-07-21' };
assert(displayableOffer(staleOutOfStock, now), 'Abgelaufener Nicht-verfügbar-Status darf den Händler nicht dauerhaft ausblenden.');

console.log('Awin-Babyprofi-Importtest bestanden: exakte Zuordnung, Konfigurationsschutz, Frische und Clickref geprüft.');
