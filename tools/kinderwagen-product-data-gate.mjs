#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const productsDir = path.join(dataDir, 'products');
const schema = JSON.parse(fs.readFileSync(path.join(dataDir, 'product.schema.json'), 'utf8'));
const criteria = JSON.parse(fs.readFileSync(path.join(dataDir, 'criteria.v0.1.json'), 'utf8'));
const files = fs.readdirSync(productsDir).filter((name) => name.endsWith('.json')).sort();
const errors = [];
const warnings = [];
const reports = [];
const productIds = new Set();
const today = new Date().toISOString().slice(0, 10);

const requiredRoot = schema.required ?? [];
const requiredFacts = schema.properties?.facts?.required ?? [];
const requiredSignals = schema.properties?.signals?.required ?? [];
const allowedFactStatuses = new Set(schema.$defs?.fact?.properties?.status?.enum ?? []);
const allowedSignalStatuses = new Set(schema.$defs?.signal?.properties?.status?.enum ?? []);
const allowedMarketStatuses = new Set(schema.$defs?.marketStatusFact?.allOf?.[1]?.properties?.value?.enum ?? []);
const allowedLiftConfigurations = new Set(schema.$defs?.liftConfigurationFact?.allOf?.[1]?.properties?.value?.enum ?? []);
const allowedColorDirections = new Set(schema.properties?.editorial?.properties?.colorDirections?.items?.enum ?? []);
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

function exists(value) {
  return value !== null && value !== undefined && value !== '';
}

function containsCommercialRankingField(value) {
  return /affiliate|commission|provision|sponsor|campaignbudget|merchantpriority/i.test(JSON.stringify(value));
}

for (const file of files) {
  const relative = `data/kinderwagen-navigator/products/${file}`;
  let product;
  try {
    product = JSON.parse(fs.readFileSync(path.join(productsDir, file), 'utf8'));
  } catch (error) {
    errors.push(`${relative}: ungültiges JSON (${error.message})`);
    continue;
  }

  for (const field of requiredRoot) if (!(field in product)) errors.push(`${relative}: Root-Feld ${field} fehlt`);
  if (product.modelVersion !== criteria.modelVersion) errors.push(`${relative}: Model-Version passt nicht zur Kriterienmatrix`);
  if (!product.productId || productIds.has(product.productId)) errors.push(`${relative}: fehlende oder doppelte productId`);
  productIds.add(product.productId);
  if (product.identity?.market !== 'DE' || product.identity?.category !== 'single-combi-from-birth' || product.identity?.supportedChildren !== 1) {
    errors.push(`${relative}: Produkt liegt außerhalb des MVP-Scopes`);
  }
  if (product.review?.reviewDueAt < today) errors.push(`${relative}: Review überfällig seit ${product.review?.reviewDueAt}`);
  if (containsCommercialRankingField(product)) errors.push(`${relative}: kommerzielles Ranking-Feld in Match-Daten gefunden`);

  const sourceIds = new Set();
  for (const source of product.sources ?? []) {
    if (!source.id || sourceIds.has(source.id)) errors.push(`${relative}: fehlende oder doppelte Quellen-ID`);
    sourceIds.add(source.id);
    if (!String(source.url ?? '').startsWith('https://')) errors.push(`${relative}: Quelle ${source.id} nutzt kein HTTPS`);
    if (!source.checkedAt) errors.push(`${relative}: Quelle ${source.id} ohne Prüfdatum`);
  }

  let knownFacts = 0;
  for (const key of requiredFacts) {
    const fact = product.facts?.[key];
    if (!fact) {
      errors.push(`${relative}: Pflicht-Fakt ${key} fehlt`);
      continue;
    }
    if (!allowedFactStatuses.has(fact.status)) errors.push(`${relative}: Fakt ${key} hat ungültigen Status ${fact.status}`);
    if (!Array.isArray(fact.sourceIds)) errors.push(`${relative}: Fakt ${key} benötigt sourceIds`);
    for (const sourceId of fact.sourceIds ?? []) if (!sourceIds.has(sourceId)) errors.push(`${relative}: Fakt ${key} referenziert unbekannte Quelle ${sourceId}`);
    if (!fact.checkedAt) errors.push(`${relative}: Fakt ${key} ohne Prüfdatum`);
    if (fact.freshUntil && fact.freshUntil < today) errors.push(`${relative}: Fakt ${key} ist seit ${fact.freshUntil} abgelaufen`);
    if (['officially_documented', 'independently_observed'].includes(fact.status) && !(fact.sourceIds ?? []).length) {
      errors.push(`${relative}: belegter Fakt ${key} ohne Quelle`);
    }
    if (exists(fact.value) && !['unknown', 'stale'].includes(fact.status)) knownFacts += 1;
  }

  let knownSignals = 0;
  for (const key of requiredSignals) {
    const signal = product.signals?.[key];
    if (!signal) {
      errors.push(`${relative}: Signal ${key} fehlt`);
      continue;
    }
    if (!allowedSignalStatuses.has(signal.status)) errors.push(`${relative}: Signal ${key} hat ungültigen Status ${signal.status}`);
    if (!Array.isArray(signal.evidenceFields) || !signal.rationale) errors.push(`${relative}: Signal ${key} ist nicht erklärt`);
    for (const factKey of signal.evidenceFields ?? []) if (!requiredFacts.includes(factKey)) errors.push(`${relative}: Signal ${key} nutzt unbekanntes Fakt-Feld ${factKey}`);
    if (signal.value !== null) knownSignals += 1;
  }

  const hasIndependentSource = (product.sources ?? []).some((source) => source.kind === 'independent_test');
  for (const signalId of ['cityManeuverability', 'roughSurfaceFit']) {
    const signal = product.signals?.[signalId];
    if (!hasIndependentSource && signal?.value > 0.5) errors.push(`${relative}: ${signalId} darf ohne unabhängige Quelle höchstens 0,5 betragen`);
  }

  const unknownCritical = criticalFacts.filter((key) => !exists(product.facts?.[key]?.value) || ['unknown', 'stale'].includes(product.facts?.[key]?.status));
  if (!allowedMarketStatuses.has(product.facts?.marketStatus?.value)) errors.push(`${relative}: ungültiger Marktstatus ${product.facts?.marketStatus?.value}`);
  if (!product.facts?.marketStatus?.freshUntil) errors.push(`${relative}: Marktstatus benötigt ein Ablaufdatum`);
  if (!allowedLiftConfigurations.has(product.facts?.liftReadyConfiguration?.value)) errors.push(`${relative}: ungültige Tragekonfiguration ${product.facts?.liftReadyConfiguration?.value}`);
  if (unknownCritical.length) warnings.push(`${relative}: nicht bereit für alle strikten Matches (${unknownCritical.join(', ')})`);
  if (!(product.editorial?.tradeoffs ?? []).length) errors.push(`${relative}: kein Kompromiss dokumentiert`);
  if (!(product.editorial?.colorDirections ?? []).length) errors.push(`${relative}: keine dokumentierte Farbrichtung`);
  for (const color of product.editorial?.colorDirections ?? []) if (!allowedColorDirections.has(color)) errors.push(`${relative}: unbekannte Farbrichtung ${color}`);
  if (product.editorial?.testingDisclosure !== 'Kein eigener Produkttest; Passung aus dokumentierten Produktdaten und ausgewiesenen Proxys abgeleitet.') {
    errors.push(`${relative}: Testing-Disclosure fehlt oder wurde verändert`);
  }

  reports.push({
    id: product.productId,
    factCoverage: Math.round((knownFacts / requiredFacts.length) * 100),
    signalCoverage: Math.round((knownSignals / requiredSignals.length) * 100),
    unknownCritical
  });
}

if (files.length < 5) errors.push(`Pilot benötigt mindestens 5 Produkte, gefunden: ${files.length}`);

for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const report of reports) {
  console.log(`${report.id}: Fakten ${report.factCoverage}%, Signale ${report.signalCoverage}%, kritische Lücken ${report.unknownCritical.length}`);
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

const averageFacts = Math.round(reports.reduce((sum, report) => sum + report.factCoverage, 0) / reports.length);
console.log(`Produktdaten-Gate bestanden: ${reports.length} Pilotmodelle, durchschnittlich ${averageFacts}% Faktenabdeckung, ${warnings.length} Warnungen.`);
