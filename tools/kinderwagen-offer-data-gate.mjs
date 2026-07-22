#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'data', 'kinderwagen-navigator');
const offers = JSON.parse(fs.readFileSync(path.join(dataRoot, 'offers.v0.1.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataRoot, 'catalog.v0.1.json'), 'utf8'));
const productIds = new Set(catalog.products.map((filename) => JSON.parse(fs.readFileSync(path.join(dataRoot, 'products', filename), 'utf8')).productId));
const errors = [];
const ids = new Set();

function errorIf(condition, message) {
  if (condition) errors.push(message);
}

errorIf(offers.schemaVersion !== 1, 'Angebotsdaten benötigen schemaVersion 1.');
const babyprofiSource = (offers.sources ?? []).find((source) => source.network === 'awin' && source.advertiserId === 14986);
errorIf(!babyprofiSource, 'Vorbereitete Babyprofi-Awin-Quelle mit Advertiser-ID 14986 fehlt.');
errorIf(!Array.isArray(offers.offers), 'offers muss eine Liste sein.');

for (const offer of offers.offers ?? []) {
  errorIf(ids.has(offer.offerId), `Doppelte offerId ${offer.offerId}`);
  ids.add(offer.offerId);
  errorIf(!productIds.has(offer.productId), `${offer.offerId}: unbekannte productId ${offer.productId}`);
  errorIf(offer.network?.id !== 'awin' || offer.network?.advertiserId !== 14986, `${offer.offerId}: falsches Affiliate-Netzwerk oder Advertiser-ID`);
  errorIf(offer.merchant?.id !== 'babyprofi', `${offer.offerId}: falscher Händler`);
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

const matcher = fs.readFileSync(path.join(root, 'js', 'kinderwagen-matcher.mjs'), 'utf8');
errorIf(/offers\.v0\.1|merchantProductId|advertiserId|commission|provision(?!al)/i.test(matcher), 'Matcher darf Händler-, Angebots- oder Provisionsdaten nicht lesen.');

if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  process.exit(1);
}

console.log(`Händlerdaten-Gate bestanden: ${offers.offers.length} veröffentlichte Angebote; Matching bleibt kommerziell getrennt.`);
