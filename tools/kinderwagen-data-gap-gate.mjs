#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(dataDir, 'data-gaps.v0.1.json'), 'utf8'));
const products = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8'))
);
const productById = new Map(products.map((product) => [product.productId, product]));
const criticalFacts = [
  'marketStatus',
  'newbornApproved',
  'newbornConfiguration',
  'carrycotIncluded',
  'requiredConfigurationPriceEur',
  'unfoldedWidthCm',
  'foldedDimensionsCm',
  'liftReadyWeightKg',
  'liftReadyConfiguration'
];
const allowedStatuses = new Set([
  'manufacturer_confirmation_required',
  'independent_measurement_required',
  'official_update_pending'
]);
const today = new Date().toISOString().slice(0, 10);
const errors = [];
const tracked = new Set();

function isUnknown(fact) {
  return !fact || fact.value === null || fact.value === undefined || ['unknown', 'stale'].includes(fact.status);
}

for (const gap of registry.gaps ?? []) {
  const key = `${gap.productId}:${gap.field}`;
  if (tracked.has(key)) errors.push(`${key}: Datenlücke doppelt erfasst`);
  tracked.add(key);
  const product = productById.get(gap.productId);
  if (!product) {
    errors.push(`${key}: Produkt ist nicht im veröffentlichten Katalog`);
    continue;
  }
  if (!criticalFacts.includes(gap.field)) errors.push(`${key}: Feld ist keine definierte kritische Angabe`);
  if (!isUnknown(product.facts?.[gap.field])) errors.push(`${key}: Registry meldet Lücke, Produktwert ist aber belegt`);
  if (!allowedStatuses.has(gap.status)) errors.push(`${key}: unbekannter Bearbeitungsstatus ${gap.status}`);
  if (!String(gap.officialSourceUrl ?? '').startsWith('https://')) errors.push(`${key}: offizielle HTTPS-Quelle fehlt`);
  if (!(product.sources ?? []).some((source) => source.url === gap.officialSourceUrl)) {
    errors.push(`${key}: offizielle Quelle ist nicht in der Produktdatei referenziert`);
  }
  if (!gap.sourceCheckedAt || gap.sourceCheckedAt > today) errors.push(`${key}: ungültiges Quellen-Prüfdatum`);
  if (!gap.nextReviewAt || gap.nextReviewAt < today) errors.push(`${key}: nächste Prüfung ist überfällig`);
  if (!gap.reason || !gap.resolution) errors.push(`${key}: Begründung oder Lösungsweg fehlt`);
}

for (const product of products) {
  for (const field of criticalFacts) {
    if (isUnknown(product.facts?.[field]) && !tracked.has(`${product.productId}:${field}`)) {
      errors.push(`${product.productId}:${field}: kritische Datenlücke ist nicht in der Registry erfasst`);
    }
  }
}

if (registry.policy?.missingCriticalFactsMustBeTracked !== true) errors.push('Trackingpflicht für kritische Datenlücken fehlt');
if (registry.policy?.automaticEstimationForbidden !== true) errors.push('Verbot automatischer Schätzungen fehlt');
if (registry.policy?.inferenceFromFoldedDimensionsForbidden !== true) errors.push('Verbot der Ableitung aus Faltmaßen fehlt');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Datenlücken-Gate bestanden: ${tracked.size} kritische Lücken vollständig belegt und terminiert.`);
