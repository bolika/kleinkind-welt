#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const args = process.argv.slice(2);

function option(name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function isIsoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

function daysBetween(earlier, later) {
  return Math.floor((Date.parse(`${later}T00:00:00Z`) - Date.parse(`${earlier}T00:00:00Z`)) / 86_400_000);
}

const asOf = option('--as-of') ?? new Date().toISOString().slice(0, 10);
const reportPath = option('--report');
const strict = args.includes('--strict');

if (!isIsoDate(asOf)) {
  console.error(`ERROR Ungültiges --as-of-Datum: ${asOf}`);
  process.exit(2);
}

const readiness = readJson('data/kinderwagen-navigator/release-readiness.v0.1.json');
const operations = readiness.dataOperations;
const allowedStates = new Set(['paused', 'active']);
const allowedModes = new Set(['report_only', 'blocking']);

if (!operations || !allowedStates.has(operations.navigatorState) || !allowedModes.has(operations.ciFreshnessMode)) {
  console.error('ERROR release-readiness benötigt dataOperations.navigatorState und einen gültigen ciFreshnessMode.');
  process.exit(2);
}
if (operations.navigatorState === 'paused' && operations.ciFreshnessMode !== 'report_only') {
  console.error('ERROR Ein pausierter Navigator muss Datenfrische im Modus report_only prüfen.');
  process.exit(2);
}
if (operations.navigatorState === 'active' && operations.ciFreshnessMode !== 'blocking') {
  console.error('ERROR Ein aktiver Navigator muss Datenfrische blockierend prüfen.');
  process.exit(2);
}
if (!operations.reason || !isIsoDate(operations.stateChangedAt)) {
  console.error('ERROR Der Betriebszustand benötigt Begründung und gültiges Änderungsdatum.');
  process.exit(2);
}

const items = [];

function addIfOverdue({ type, id, productId = null, field, dueAt, sourceFile }) {
  if (!isIsoDate(dueAt)) {
    console.error(`ERROR ${sourceFile}: ${field} hat kein gültiges Fälligkeitsdatum.`);
    process.exit(2);
  }
  if (dueAt >= asOf) return;
  items.push({
    type,
    id,
    productId,
    field,
    dueAt,
    daysOverdue: daysBetween(dueAt, asOf),
    sourceFile
  });
}

const productFiles = fs.readdirSync(path.join(dataDir, 'products'))
  .filter((name) => name.endsWith('.json'))
  .sort();

for (const filename of productFiles) {
  const sourceFile = `data/kinderwagen-navigator/products/${filename}`;
  const product = readJson(sourceFile);
  addIfOverdue({
    type: 'product_review',
    id: `${product.productId}:review`,
    productId: product.productId,
    field: 'review.reviewDueAt',
    dueAt: product.review?.reviewDueAt,
    sourceFile
  });
  for (const [factName, fact] of Object.entries(product.facts ?? {})) {
    if (!fact.freshUntil) continue;
    addIfOverdue({
      type: 'product_fact',
      id: `${product.productId}:fact:${factName}`,
      productId: product.productId,
      field: `facts.${factName}.freshUntil`,
      dueAt: fact.freshUntil,
      sourceFile
    });
  }
}

const gaps = readJson('data/kinderwagen-navigator/data-gaps.v0.1.json');
for (const gap of gaps.gaps ?? []) {
  addIfOverdue({
    type: 'data_gap_review',
    id: `${gap.productId}:gap:${gap.field}`,
    productId: gap.productId,
    field: `${gap.field}.nextReviewAt`,
    dueAt: gap.nextReviewAt,
    sourceFile: 'data/kinderwagen-navigator/data-gaps.v0.1.json'
  });
}

const offers = readJson('data/kinderwagen-navigator/offers.v0.1.json');
for (const offer of offers.offers ?? []) {
  for (const area of ['price', 'availability']) {
    addIfOverdue({
      type: `offer_${area}`,
      id: `${offer.offerId}:${area}`,
      productId: offer.productId,
      field: `${area}.freshUntil`,
      dueAt: offer[area]?.freshUntil,
      sourceFile: 'data/kinderwagen-navigator/offers.v0.1.json'
    });
  }
}

const media = readJson('data/kinderwagen-navigator/media.v0.1.json');
for (const asset of media.assets ?? []) {
  if (!asset.validUntil) continue;
  addIfOverdue({
    type: 'media_rights',
    id: `${asset.assetId}:rights`,
    productId: asset.productId,
    field: 'validUntil',
    dueAt: asset.validUntil,
    sourceFile: 'data/kinderwagen-navigator/media.v0.1.json'
  });
}

items.sort((a, b) => a.dueAt.localeCompare(b.dueAt) || a.id.localeCompare(b.id));
const countsByType = Object.fromEntries(
  [...new Set(items.map((item) => item.type))].sort().map((type) => [type, items.filter((item) => item.type === type).length])
);
const affectedProducts = [...new Set(items.map((item) => item.productId).filter(Boolean))].sort();
const configuredMode = operations.ciFreshnessMode;
const effectiveMode = strict ? 'blocking' : configuredMode;
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  asOf,
  navigatorState: operations.navigatorState,
  enforcement: {
    configuredMode,
    effectiveMode,
    staleDataBlocksCi: effectiveMode === 'blocking',
    reason: operations.reason
  },
  summary: {
    overdueItems: items.length,
    affectedProducts: affectedProducts.length,
    countsByType,
    earliestDueAt: items[0]?.dueAt ?? null,
    maximumDaysOverdue: items.length ? Math.max(...items.map((item) => item.daysOverdue)) : 0
  },
  affectedProductIds: affectedProducts,
  items
};

const serialized = `${JSON.stringify(report, null, 2)}\n`;
if (reportPath) {
  const absoluteReportPath = path.resolve(root, reportPath);
  fs.mkdirSync(path.dirname(absoluteReportPath), { recursive: true });
  fs.writeFileSync(absoluteReportPath, serialized);
  console.log(`Maschinenlesbarer Frische-Report: ${absoluteReportPath}`);
} else {
  process.stdout.write(serialized);
}

const summary = `${items.length} überfällige Punkte bei ${affectedProducts.length} Produkten (Stand ${asOf}, Modus ${effectiveMode})`;
if (items.length && effectiveMode === 'blocking') {
  console.error(`ERROR Kinderwagen-Datenfrische fehlgeschlagen: ${summary}.`);
  process.exit(1);
}
if (items.length) console.warn(`WARN Kinderwagen-Datenfrische: ${summary}. Navigator ist bewusst pausiert; Struktur-Gates bleiben blockierend.`);
else console.log(`Kinderwagen-Datenfrische bestanden: keine überfälligen Punkte (Stand ${asOf}).`);
