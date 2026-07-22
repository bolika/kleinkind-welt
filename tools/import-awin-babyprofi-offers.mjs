#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith('--')) continue;
    args[key.slice(2)] = argv[index + 1];
    index += 1;
  }
  return args;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? '';
  const candidates = [',', ';', '\t'];
  return candidates.sort((left, right) => firstLine.split(right).length - firstLine.split(left).length)[0];
}

export function parseCsv(text) {
  const source = text.replace(/^\uFEFF/, '');
  const delimiter = detectDelimiter(source);
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (!quoted && character === delimiter) {
      row.push(field);
      field = '';
      continue;
    }
    if (!quoted && (character === '\n' || character === '\r')) {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += character;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value !== '')) rows.push(row);
  }
  if (quoted) throw new Error('CSV enthält ein nicht geschlossenes Anführungszeichen.');
  if (rows.length < 1) return [];

  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] ?? '').trim()])));
}

function readFeed(filename) {
  const buffer = fs.readFileSync(filename);
  return filename.endsWith('.gz') ? zlib.gunzipSync(buffer).toString('utf8') : buffer.toString('utf8');
}

function first(row, keys) {
  for (const key of keys) if (row[key] !== undefined && row[key] !== '') return row[key];
  return '';
}

function parseMoney(value) {
  if (typeof value === 'number') return value;
  const source = String(value ?? '').trim().replace(/[^0-9,.-]/g, '');
  if (!source) return null;
  let normalized = source;
  if (source.includes(',') && source.includes('.')) {
    normalized = source.lastIndexOf(',') > source.lastIndexOf('.')
      ? source.replace(/\./g, '').replace(',', '.')
      : source.replace(/,/g, '');
  } else if (source.includes(',')) {
    normalized = source.replace(',', '.');
  }
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function normalizeGtins(row) {
  return [...new Set([
    first(row, ['product_GTIN', 'product_gtin', 'gtin']),
    first(row, ['ean', 'EAN'])
  ].map((value) => String(value).replace(/\D/g, '')).filter((value) => /^[0-9]{8,14}$/.test(value)))];
}

function slug(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isAwinTrackingLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /(^|\.)awin1\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
}

function plusDays(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function availabilityFor(row) {
  const inStock = first(row, ['in_stock', 'stock_status']).toLowerCase();
  if (/pre.?order|vorbestell/.test(inStock)) return 'preorder';
  if (/out.?of.?stock|nicht.?verf|unavailable|^(0|false|no)$/.test(inStock)) return 'out_of_stock';
  if (/in.?stock|verf|lieferbar|^(1|true|yes)$/.test(inStock)) return 'in_stock';
  return 'unknown';
}

function mappingForRow(row, mappings) {
  const merchantProductId = first(row, ['merchant_product_id']);
  const gtins = normalizeGtins(row);
  const matches = mappings.filter((mapping) =>
    (mapping.merchantProductIds ?? []).includes(merchantProductId) ||
    (mapping.gtins ?? []).some((gtin) => gtins.includes(gtin))
  );
  if (matches.length > 1) throw new Error(`Mehrdeutige Zuordnung für Händlerprodukt ${merchantProductId || 'ohne ID'}.`);
  return matches[0] ?? null;
}

export function importOffers({ rows, mappingData, now = new Date() }) {
  const advertiserId = Number(mappingData.advertiserId);
  const importedAt = now.toISOString();
  const freshUntil = plusDays(now, 2);
  const offers = [];
  const unmatched = [];

  for (const row of rows) {
    const rowAdvertiserId = Number(first(row, ['merchant_id', 'advertiser_id']));
    if (rowAdvertiserId && rowAdvertiserId !== advertiserId) continue;
    const mapping = mappingForRow(row, mappingData.mappings ?? []);
    if (!mapping) {
      unmatched.push(first(row, ['merchant_product_id', 'aw_product_id', 'product_name']) || 'unbekannt');
      continue;
    }

    const merchantProductId = first(row, ['merchant_product_id']);
    const deeplink = first(row, ['aw_deep_link']);
    const title = first(row, ['product_name']);
    const amount = parseMoney(first(row, ['search_price', 'store_price']));
    const currency = (first(row, ['currency']) || 'EUR').toUpperCase();
    if (!merchantProductId || title.length < 3 || !isAwinTrackingLink(deeplink) || !(amount > 0) || currency !== 'EUR') {
      throw new Error(`Pflichtdaten fehlen oder sind ungültig bei ${merchantProductId || first(row, ['product_name']) || 'unbekanntem Produkt'}.`);
    }

    const price = { amount, currency: 'EUR', freshUntil };
    const oldAmount = parseMoney(first(row, ['product_price_old', 'rrp_price']));
    const shippingAmount = parseMoney(first(row, ['delivery_cost']));
    if (oldAmount && oldAmount > amount) price.oldAmount = oldAmount;
    if (shippingAmount !== null && shippingAmount >= 0) price.shippingAmount = shippingAmount;

    const availability = { status: availabilityFor(row), freshUntil };
    const quantityValue = first(row, ['stock_quantity']);
    const quantity = quantityValue === '' ? null : Number(quantityValue);
    if (Number.isInteger(quantity) && quantity >= 0) availability.stockQuantity = quantity;

    const offer = {
      offerId: `babyprofi-${slug(merchantProductId)}`,
      productId: mapping.productId,
      merchant: mappingData.merchant,
      network: { id: 'awin', advertiserId },
      merchantProductId,
      title,
      deeplink,
      price,
      availability,
      configuration: mapping.configuration,
      identifiers: { gtins: normalizeGtins(row) },
      importedAt
    };
    const awinProductId = first(row, ['aw_product_id']);
    const imageUrl = first(row, ['aw_image_url', 'merchant_image_url', 'large_image']);
    const feedUpdatedAt = first(row, ['last_updated']);
    if (awinProductId) offer.awinProductId = awinProductId;
    if (imageUrl.startsWith('https://')) offer.imageUrl = imageUrl;
    if (feedUpdatedAt) offer.feedUpdatedAt = feedUpdatedAt;
    offers.push(offer);
  }

  const ids = offers.map((offer) => offer.offerId);
  if (new Set(ids).size !== ids.length) throw new Error('Der Feed erzeugt doppelte offerIds. Händlerprodukt-IDs müssen eindeutig sein.');

  return {
    document: {
      schemaVersion: 1,
      generatedAt: importedAt,
      sources: [{
        network: 'awin',
        advertiserId,
        advertiserName: mappingData.advertiserName,
        mode: 'feed'
      }],
      offers
    },
    report: {
      feedRows: rows.length,
      mappedOffers: offers.length,
      displayableOffers: offers.filter((offer) => offer.configuration.status === 'exact_required_configuration').length,
      unmatchedRows: unmatched.length
    }
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input || !args.mapping || !args.output) {
    console.error('Aufruf: node tools/import-awin-babyprofi-offers.mjs --input <feed.csv|feed.csv.gz> --mapping <mapping.json> --output <offers.json>');
    process.exit(2);
  }
  const input = path.resolve(root, args.input);
  const mappingFile = path.resolve(root, args.mapping);
  const output = path.resolve(root, args.output);
  const rows = parseCsv(readFeed(input));
  const mappingData = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const { document, report } = importOffers({ rows, mappingData });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Awin-Import abgeschlossen: ${report.feedRows} Feed-Zeilen, ${report.mappedOffers} zugeordnet, ${report.displayableOffers} als vollständige Konfiguration freigegeben, ${report.unmatchedRows} nicht zugeordnet.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) run();
