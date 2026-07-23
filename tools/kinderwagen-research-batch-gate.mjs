#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data/kinderwagen-navigator');
const batch = JSON.parse(fs.readFileSync(path.join(dataDir, 'research-batch-01.v0.1.json'), 'utf8'));
const backlog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog-expansion.v0.2.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const errors = [];
const ids = new Set();
const candidateById = new Map(backlog.candidates.map((candidate) => [candidate.canonicalModelId, candidate]));
const promotionById = new Map((backlog.promotedPilotModels ?? []).map((promotion) => [promotion.canonicalModelId, promotion]));
const publishedIds = new Set(
  catalog.products.map((filename) => JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8')).productId)
);
const requiredRecordIds = new Set([
  'joie-finiti',
  'kinderkraft-vesto-2-2in1',
  'cybex-mios-current',
  'joolz-day5',
  'joolz-geo5'
]);
const allowedStatuses = new Set(['blocked_source_conflict', 'researched_pending_safety_gate', 'ready_for_catalog_modeling', 'promoted_to_pilot_pending_safety_gate']);

function present(value) {
  return value !== null && value !== undefined && value !== '';
}

if (batch.policy?.affiliateAvailabilityDoesNotAffectResearchPriority !== true) {
  errors.push('Affiliate-Verfügbarkeit darf die Research-Priorität nicht verändern');
}
if (batch.policy?.manufacturerFactsRequiredForHardFit !== true) {
  errors.push('Harte Fit-Fakten müssen aus Herstellerquellen stammen');
}
if (batch.policy?.noAutomaticCatalogPromotion !== true) {
  errors.push('Research-Datensätze dürfen nicht automatisch in den Live-Katalog gelangen');
}
if (batch.policy?.manualSafetyGateCheckBeforePromotion !== true || batch.policy?.absenceOfKnownAlertIsNotSafetyApproval !== true) {
  errors.push('Safety-Gate-Guardrail fehlt oder ist zu stark formuliert');
}
if (/affiliate|commission|provision|epc|approvalrate/i.test(JSON.stringify(batch.records))) {
  errors.push('Kommerzielle Programmdaten dürfen nicht in der Produktrecherche stehen');
}

for (const record of batch.records ?? []) {
  if (!record.canonicalModelId || ids.has(record.canonicalModelId)) {
    errors.push(`Doppelte oder fehlende Research-ID: ${record.canonicalModelId ?? 'leer'}`);
  }
  ids.add(record.canonicalModelId);
  if (!requiredRecordIds.has(record.canonicalModelId)) errors.push(`${record.canonicalModelId}: nicht Teil von Research Batch 01`);
  const isPilotPromotion = record.status === 'promoted_to_pilot_pending_safety_gate';
  if (!candidateById.has(record.canonicalModelId) && !promotionById.has(record.canonicalModelId)) {
    errors.push(`${record.canonicalModelId}: weder aktiver Backlog-Kandidat noch dokumentierte Pilot-Promotion`);
  }
  if (publishedIds.has(record.canonicalModelId) && !isPilotPromotion) {
    errors.push(`${record.canonicalModelId}: im Pilotkatalog, aber Research-Status nicht archiviert`);
  }
  if (isPilotPromotion && !publishedIds.has(record.canonicalModelId)) {
    errors.push(`${record.canonicalModelId}: als Pilot-Promotion markiert, aber nicht im Katalog`);
  }
  if (!allowedStatuses.has(record.status)) errors.push(`${record.canonicalModelId}: unbekannter Research-Status ${record.status}`);
  if (!String(record.sourceUrl ?? '').startsWith('https://')) errors.push(`${record.canonicalModelId}: offizielle HTTPS-Quelle fehlt`);
  if (!(record.tradeoffs ?? []).length) errors.push(`${record.canonicalModelId}: ehrlicher Kompromiss fehlt`);
  if (!(record.blockers ?? []).length) errors.push(`${record.canonicalModelId}: verbleibender Blocker fehlt`);

  if (record.status === 'researched_pending_safety_gate' || record.status === 'ready_for_catalog_modeling' || isPilotPromotion) {
    for (const field of [
      'officialModelName',
      'requiredConfiguration',
      'currentPriceEur',
      'priceCheckedAt',
      'priceFreshUntil',
      'marketStatus',
      'unfoldedWidthCm',
      'foldedDimensionsCm',
      'liftReadyWeightKg',
      'liftReadyConfiguration',
      'carrycotIncluded'
    ]) {
      if (!present(record[field])) errors.push(`${record.canonicalModelId}: Pflichtfeld ${field} fehlt`);
    }
    for (const field of ['length', 'width', 'height', 'configuration']) {
      if (!present(record.foldedDimensionsCm?.[field])) errors.push(`${record.canonicalModelId}: Faltmaß ${field} fehlt`);
    }
    if (!isPilotPromotion && candidateById.get(record.canonicalModelId)?.status !== record.status) {
      errors.push(`${record.canonicalModelId}: Research-Status und Backlog-Status weichen ab`);
    }
    if (isPilotPromotion && promotionById.get(record.canonicalModelId)?.status !== 'pilot_pending_manual_safety_gate') {
      errors.push(`${record.canonicalModelId}: dokumentierte Pilot-Promotion fehlt oder ist inkonsistent`);
    }
  }

  if (record.status === 'ready_for_catalog_modeling') {
    if (record.safetyGate?.status !== 'manual_search_documented' || !record.safetyGate?.checkedAt) {
      errors.push(`${record.canonicalModelId}: Veröffentlichungsvorbereitung ohne dokumentierte Safety-Gate-Suche`);
    }
  } else if (record.safetyGate?.status !== 'manual_search_pending') {
    errors.push(`${record.canonicalModelId}: offener Safety-Gate-Status muss sichtbar bleiben`);
  }
}

for (const id of requiredRecordIds) if (!ids.has(id)) errors.push(`${id}: fehlt in Research Batch 01`);

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

const researched = batch.records.filter((record) => record.status === 'researched_pending_safety_gate').length;
const promoted = batch.records.filter((record) => record.status === 'promoted_to_pilot_pending_safety_gate').length;
const blocked = batch.records.filter((record) => record.status === 'blocked_source_conflict').length;
console.log(`Research-Batch-Gate bestanden: ${researched} recherchiert, ${promoted} als Pilot-Promotion archiviert, ${blocked} transparent blockiert.`);
