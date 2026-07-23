#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'data', 'kinderwagen-navigator');
const offers = JSON.parse(fs.readFileSync(path.join(dataRoot, 'offers.v0.1.json'), 'utf8'));
const programs = JSON.parse(fs.readFileSync(path.join(dataRoot, 'awin-programs.v0.1.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataRoot, 'catalog.v0.1.json'), 'utf8'));
const productIds = new Set(catalog.products.map((filename) => JSON.parse(fs.readFileSync(path.join(dataRoot, 'products', filename), 'utf8')).productId));
const errors = [];
const ids = new Set();
const sourceKeys = new Set((offers.sources ?? []).map((source) => `${source.network}:${source.advertiserId}`));
const programByAdvertiser = new Map((programs.programs ?? [])
  .filter((program) => Number.isInteger(program.advertiserId))
  .map((program) => [program.advertiserId, program]));

function errorIf(condition, message) {
  if (condition) errors.push(message);
}

errorIf(offers.schemaVersion !== 1, 'Angebotsdaten benötigen schemaVersion 1.');
errorIf(!Array.isArray(offers.offers), 'offers muss eine Liste sein.');
for (const source of offers.sources ?? []) {
  if (source.network !== 'awin') continue;
  const program = programByAdvertiser.get(source.advertiserId);
  errorIf(!program, `Awin-Quelle ${source.advertiserId} ist nicht in der Programm-Registry bestätigt`);
  if (program) errorIf(source.advertiserName !== program.advertiserName, `Awin-Quelle ${source.advertiserId}: Advertiser-Name weicht von Registry ab`);
}

for (const offer of offers.offers ?? []) {
  errorIf(ids.has(offer.offerId), `Doppelte offerId ${offer.offerId}`);
  ids.add(offer.offerId);
  errorIf(!productIds.has(offer.productId), `${offer.offerId}: unbekannte productId ${offer.productId}`);
  errorIf(offer.network?.id !== 'awin', `${offer.offerId}: falsches Affiliate-Netzwerk`);
  errorIf(!sourceKeys.has(`${offer.network?.id}:${offer.network?.advertiserId}`), `${offer.offerId}: zugehörige Angebotsquelle fehlt`);
  const program = programByAdvertiser.get(offer.network?.advertiserId);
  errorIf(!program, `${offer.offerId}: Advertiser-ID ist nicht in der Programm-Registry bestätigt`);
  if (program) {
    errorIf(program.applicationStatus !== 'joined', `${offer.offerId}: Programm ${program.merchant.id} ist noch nicht freigegeben`);
    errorIf(offer.merchant?.id !== program.merchant.id || offer.merchant?.name !== program.merchant.name, `${offer.offerId}: Händler passt nicht zur Programm-Registry`);
    if (offer.imageUrl) errorIf(program.feedImageUsageStatus !== 'approved_for_feed_only', `${offer.offerId}: Produktbild ohne freigegebene Feed-Bildnutzung`);
  }
  errorIf(Boolean(offer.imageUrl) !== (offer.imageRightsStatus === 'approved_for_feed_only'), `${offer.offerId}: Bild-URL und Bildrechte-Status müssen gemeinsam gesetzt sein`);
  errorIf(!/^https:\/\//.test(offer.deeplink ?? ''), `${offer.offerId}: kein HTTPS-Deeplink`);
  try {
    const hostname = new URL(offer.deeplink).hostname;
    if (offer.network?.id === 'awin') errorIf(!/(^|\.)awin1\.com$/i.test(hostname), `${offer.offerId}: Awin-Angebot nutzt keinen awin1.com-Trackinglink`);
  } catch {
    errors.push(`${offer.offerId}: ungültiger Deeplink`);
  }
  errorIf(/productdata\.awin\.com\/.*(?:apikey|api_key)/i.test(offer.deeplink ?? ''), `${offer.offerId}: Feed-API-Schlüssel darf nie veröffentlicht werden`);
  errorIf(!['exact_required_configuration', 'partial_configuration', 'unclear'].includes(offer.configuration?.status), `${offer.offerId}: Konfigurationsstatus fehlt`);
  errorIf(!offer.configuration?.verifiedAt, `${offer.offerId}: Konfiguration wurde nicht datiert geprüft`);
  errorIf(!(offer.price?.amount > 0) || offer.price?.currency !== 'EUR', `${offer.offerId}: ungültiger Preis`);
  errorIf(typeof offer.title !== 'string' || offer.title.length < 3, `${offer.offerId}: Produkttitel fehlt`);
  errorIf(!offer.price?.freshUntil || !offer.availability?.freshUntil, `${offer.offerId}: Preis oder Bestand ohne Ablaufdatum`);
}
errorIf(/commission|provision|epc|approvalRate/i.test(JSON.stringify(offers)), 'Angebotsdaten dürfen keine Provisions- oder Programmrankingfelder enthalten.');

const matcher = fs.readFileSync(path.join(root, 'js', 'kinderwagen-matcher.mjs'), 'utf8');
errorIf(/offers\.v0\.1|merchantProductId|advertiserId|commission|provision(?!al)/i.test(matcher), 'Matcher darf Händler-, Angebots- oder Provisionsdaten nicht lesen.');

if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  process.exit(1);
}

console.log(`Händlerdaten-Gate bestanden: ${offers.offers.length} veröffentlichte Angebote; Matching bleibt kommerziell getrennt.`);
