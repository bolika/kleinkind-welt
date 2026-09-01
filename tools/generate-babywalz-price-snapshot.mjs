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

function sameCommercialData(left, right) {
  return left.productPrice === right.productPrice &&
    left.shipping === right.shipping &&
    left.totalPrice === right.totalPrice &&
    left.currency === right.currency &&
    left.availability === right.availability;
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

function usableImageUrl(row, preferredField) {
  const imageFields = ['aw_image_url', 'merchant_image_url', 'large_image'];
  const orderedFields = imageFields.includes(preferredField)
    ? [preferredField, ...imageFields.filter((field) => field !== preferredField)]
    : imageFields;
  const candidates = [];
  for (const field of orderedFields) {
    const value = row[field];
    const source = String(value ?? '').trim();
    if (!source.startsWith('https://')) continue;
    if (/noimage|placeholder|kein[-_]?bild/i.test(source)) continue;
    candidates.push(source);
  }
  return candidates.find((source) => /\.cdn\.aboutyou\.cloud\//i.test(source)) ?? candidates[0] ?? null;
}

export function generateSnapshot({ rows, mappingData, now = new Date() }) {
  const generatedAt = now.toISOString();
  const freshUntil = new Date(now.getTime() + FRESHNESS_HOURS * 60 * 60 * 1000).toISOString();
  const offers = {};

  for (const mapping of mappingData.mappings ?? []) {
    const expectedAwinProductId = trackingProduct(mapping.deeplink);
    if (!expectedAwinProductId) throw new Error(`${mapping.offerId}: Awin-Produktreferenz fehlt im Mapping.`);

    const merchantRows = rows.filter((row) =>
      row.merchant_id === String(mappingData.advertiserId) &&
      (mapping.merchantProductIds ?? []).includes(row.merchant_product_id)
    );
    if (merchantRows.length === 0) {
      throw new Error(`${mapping.offerId}: keine Feed-Zeile für die geprüfte Händlerprodukt-ID gefunden.`);
    }

    const identityRows = merchantRows.filter((row) => {
      const gtins = rowGtins(row);
      return (mapping.gtins ?? []).some((gtin) => gtins.includes(gtin));
    });
    if (identityRows.length === 0) {
      throw new Error(`${mapping.offerId}: GTIN passt nicht zum geprüften Mapping.`);
    }

    const normalizedRows = identityRows.map((row) => {
      if (row.product_name !== mapping.title) {
        throw new Error(`${mapping.offerId}: Produkttitel weicht vom geprüften Mapping ab.`);
      }
      const currency = (row.currency || 'EUR').toUpperCase();
      if (currency !== 'EUR') {
        throw new Error(`${mapping.offerId}: nur EUR-Preise dürfen veröffentlicht werden.`);
      }
      const productPrice = money(row.search_price || row.store_price, 'Produktpreis', mapping.offerId);
      const shipping = money(row.delivery_cost, 'Versandkosten', mapping.offerId);
      return {
        row,
        productPrice,
        shipping,
        totalPrice: Math.round((productPrice + shipping) * 100) / 100,
        currency,
        availability: availability(row)
      };
    });

    const preferred = normalizedRows.find(({ row }) => trackingProduct(row.aw_deep_link) === expectedAwinProductId) ?? normalizedRows[0];
    if (!normalizedRows.every((candidate) => sameCommercialData(candidate, preferred))) {
      throw new Error(`${mapping.offerId}: mehrere Feed-Zeilen enthalten widersprüchliche Preis-, Versand- oder Verfügbarkeitsdaten.`);
    }

    offers[mapping.offerId] = {
      productId: mapping.productId,
      merchantProductId: preferred.row.merchant_product_id,
      title: preferred.row.product_name,
      productPrice: preferred.productPrice,
      shipping: preferred.shipping,
      totalPrice: preferred.totalPrice,
      currency: preferred.currency,
      availability: preferred.availability
    };
    const imageUrl = usableImageUrl(preferred.row, mapping.preferredImageField);
    if (mappingData.feedImageUsageStatus === 'approved_for_feed_only' && imageUrl) {
      offers[mapping.offerId].imageUrl = imageUrl;
      offers[mapping.offerId].imageRightsStatus = 'approved_for_feed_only';
    }
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
