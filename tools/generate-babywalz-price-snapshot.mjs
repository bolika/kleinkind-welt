#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './import-awin-offers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FRESHNESS_HOURS = 48;

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

function readFeed(filename) {
  const buffer = fs.readFileSync(filename);
  return filename.endsWith('.gz') ? zlib.gunzipSync(buffer).toString('utf8') : buffer.toString('utf8');
}

function money(value, field, offerId) {
  const source = String(value ?? '').trim();
  if (!source) throw new Error(`${offerId}: ${field} fehlt.`);
  const parsed = Number(source.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${offerId}: ${field} ist ungültig.`);
  return Math.round(parsed * 100) / 100;
}

function trackingProduct(value) {
  try {
    const url = new URL(value);
    return url.hostname === 'www.awin1.com' ? url.searchParams.get('p') : null;
  } catch {
    return null;
  }
}

function availability(row) {
  const value = `${row.in_stock || ''} ${row.stock_status || ''}`.toLowerCase();
  if (/nicht.?verf|out.?of.?stock|unavailable|^(0|false|no)$/.test(value.trim())) return 'out_of_stock';
  if (/verf|in.?stock|lieferbar|\b1\b|true|yes/.test(value)) return 'in_stock';
  return 'unknown';
}

function rowGtins(row) {
  return [...new Set([row.product_GTIN, row.product_gtin, row.ean]
    .map((value) => String(value ?? '').replace(/\D/g, ''))
    .filter((value) => /^[0-9]{8,14}$/.test(value)))];
}

export function generateSnapshot({ rows, mappingData, now = new Date() }) {
  const generatedAt = now.toISOString();
  const freshUntil = new Date(now.getTime() + FRESHNESS_HOURS * 60 * 60 * 1000).toISOString();
  const offers = {};

  for (const mapping of mappingData.mappings ?? []) {
    const expectedAwinProductId = trackingProduct(mapping.deeplink);
    if (!expectedAwinProductId) throw new Error(`${mapping.offerId}: Awin-Produktreferenz fehlt im Mapping.`);

    const exactRows = rows.filter((row) =>
      row.merchant_id === String(mappingData.advertiserId) &&
      trackingProduct(row.aw_deep_link) === expectedAwinProductId
    );
    if (exactRows.length !== 1) {
      throw new Error(`${mapping.offerId}: genau eine Feed-Zeile für Awin-Produkt ${expectedAwinProductId} erwartet, gefunden ${exactRows.length}.`);
    }

    const row = exactRows[0];
    const gtins = rowGtins(row);
    if (!(mapping.merchantProductIds ?? []).includes(row.merchant_product_id)) {
      throw new Error(`${mapping.offerId}: Händlerprodukt-ID passt nicht zum geprüften Mapping.`);
    }
    if (!(mapping.gtins ?? []).some((gtin) => gtins.includes(gtin))) {
      throw new Error(`${mapping.offerId}: GTIN passt nicht zum geprüften Mapping.`);
    }
    if (row.product_name !== mapping.title) {
      throw new Error(`${mapping.offerId}: Produkttitel weicht vom geprüften Mapping ab.`);
    }
    if ((row.currency || 'EUR').toUpperCase() !== 'EUR') {
      throw new Error(`${mapping.offerId}: nur EUR-Preise dürfen veröffentlicht werden.`);
    }

    const productPrice = money(row.search_price || row.store_price, 'Produktpreis', mapping.offerId);
    const shipping = money(row.delivery_cost, 'Versandkosten', mapping.offerId);
    const totalPrice = Math.round((productPrice + shipping) * 100) / 100;
    offers[mapping.offerId] = {
      productId: mapping.productId,
      merchantProductId: row.merchant_product_id,
      productPrice,
      shipping,
      totalPrice,
      currency: (row.currency || 'EUR').toUpperCase(),
      availability: availability(row)
    };
  }

  return {
    schemaVersion: 1,
    merchant: { id: mappingData.merchant.id, name: mappingData.merchant.name },
    shippingPolicy: mappingData.shippingPolicy,
    generatedAt,
    freshUntil,
    freshnessHours: FRESHNESS_HOURS,
    priceIncludesShipping: true,
    offers
  };
}

export function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  if (!args.input || !args.mapping || !args.output) {
    console.error('Aufruf: node tools/generate-babywalz-price-snapshot.mjs --input <feed.csv|feed.csv.gz> --mapping <mapping.json> --output <snapshot.json>');
    process.exit(2);
  }

  const input = path.resolve(root, args.input);
  const mappingFile = path.resolve(root, args.mapping);
  const output = path.resolve(root, args.output);
  const rows = parseCsv(readFeed(input));
  const mappingData = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  const snapshot = generateSnapshot({ rows, mappingData });
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(`Babywalz-Preis-Snapshot aktualisiert: ${Object.keys(snapshot.offers).length} Angebote, gültig bis ${snapshot.freshUntil}.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) runCli();
