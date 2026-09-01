#!/usr/bin/env node

import assert from 'node:assert/strict';
import { generateSnapshot } from './generate-babywalz-price-snapshot.mjs';

const mappingData = {
  advertiserId: 12387,
  feedImageUsageStatus: 'approved_for_feed_only',
  merchant: { id: 'babywalz', name: 'Babywalz' },
  mappings: [{
    offerId: 'babywalz-123',
    productId: 'test-product',
    title: 'Geprüftes Produkt',
    merchantProductIds: ['123'],
    gtins: ['4000000000001'],
    deeplink: 'https://www.awin1.com/pclick.php?p=222&a=2998119&m=12387'
  }]
};
const baseRow = {
  merchant_id: '12387',
  merchant_product_id: '123',
  product_name: 'Geprüftes Produkt',
  product_GTIN: '4000000000001',
  search_price: '9.90',
  delivery_cost: '4.99',
  currency: 'EUR',
  in_stock: '1',
  stock_status: 'verfügbar',
  aw_image_url: 'https://example.com/noimage.gif',
  large_image: 'https://cdn.example.com/geprueftes-produkt.jpg'
};
const now = new Date('2026-08-25T08:00:00.000Z');
const snapshot = generateSnapshot({
  mappingData,
  now,
  rows: [
    { ...baseRow, aw_product_id: '111', aw_deep_link: 'https://www.awin1.com/pclick.php?p=111&a=2998119&m=12387' },
    { ...baseRow, aw_product_id: '222', aw_deep_link: 'https://www.awin1.com/pclick.php?p=222&a=2998119&m=12387' }
  ]
});

assert.equal(snapshot.generatedAt, '2026-08-25T08:00:00.000Z');
assert.equal(snapshot.freshUntil, '2026-08-27T08:00:00.000Z');
assert.equal(snapshot.offers['babywalz-123'].productPrice, 9.9);
assert.equal(snapshot.offers['babywalz-123'].shipping, 4.99);
assert.equal(snapshot.offers['babywalz-123'].totalPrice, 14.89);
assert.equal(snapshot.offers['babywalz-123'].availability, 'in_stock');
assert.equal(snapshot.offers['babywalz-123'].title, 'Geprüftes Produkt');
assert.equal(snapshot.offers['babywalz-123'].imageUrl, 'https://cdn.example.com/geprueftes-produkt.jpg');
assert.equal(snapshot.offers['babywalz-123'].imageRightsStatus, 'approved_for_feed_only');

const alternateFeedSnapshot = generateSnapshot({
  mappingData,
  now,
  rows: [{ ...baseRow, aw_product_id: '111', aw_deep_link: 'https://www.awin1.com/pclick.php?p=111&a=2998119&m=12387' }]
});
assert.equal(alternateFeedSnapshot.offers['babywalz-123'].totalPrice, 14.89);

assert.throws(() => generateSnapshot({ mappingData, now, rows: [] }), /keine Feed-Zeile/);
assert.throws(() => generateSnapshot({
  mappingData,
  now,
  rows: [{ ...baseRow, product_GTIN: '4000000000999', aw_deep_link: 'https://www.awin1.com/pclick.php?p=222&a=2998119&m=12387' }]
}), /GTIN passt nicht/);
assert.throws(() => generateSnapshot({
  mappingData,
  now,
  rows: [{ ...baseRow, delivery_cost: '', aw_deep_link: 'https://www.awin1.com/pclick.php?p=222&a=2998119&m=12387' }]
}), /Versandkosten fehlt/);
assert.throws(() => generateSnapshot({
  mappingData,
  now,
  rows: [
    { ...baseRow, aw_deep_link: 'https://www.awin1.com/pclick.php?p=111&a=2998119&m=12387' },
    { ...baseRow, search_price: '10.90', aw_deep_link: 'https://www.awin1.com/pclick.php?p=222&a=2998119&m=12387' }
  ]
}), /widersprüchliche Preis-/);

console.log('Babywalz-Preis-Snapshot-Test bestanden.');
