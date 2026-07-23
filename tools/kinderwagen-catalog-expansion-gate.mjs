#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchStrollers } from '../js/kinderwagen-matcher.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data/kinderwagen-navigator');
const backlog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog-expansion.v0.2.json'), 'utf8'));
const personas = JSON.parse(fs.readFileSync(path.join(dataDir, 'persona-segments.v0.2.json'), 'utf8'));
const profiles = JSON.parse(fs.readFileSync(path.join(dataDir, 'reference-profiles.v0.1.json'), 'utf8')).profiles;
const criteriaData = JSON.parse(fs.readFileSync(path.join(dataDir, 'criteria.v0.1.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const products = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8'))
);
const errors = [];
const warnings = [];
const ids = new Set(products.map((product) => product.productId));
const candidateIds = new Set();
const promotedIds = new Set();
const urls = new Set();
const allowedRoutes = new Set(['supported_combo_from_birth', 'future_travel_buggy', 'future_siblings_twins', 'future_jogger']);
const allowedPriorities = new Set(['P0', 'P1', 'P2']);
const allowedStatuses = new Set([
  'ready_for_data_research',
  'researched_pending_safety_gate',
  'future_scope_candidate',
  'needs_official_url_verification',
  'blocked_missing_exact_bundle_price'
]);
const profileById = new Map(profiles.map((profile) => [profile.id, profile]));

if (backlog.policy?.affiliateProgramAvailabilityDoesNotChangeCandidatePriority !== true) {
  errors.push('Affiliate-Verfügbarkeit darf die Kandidatenpriorität nicht verändern');
}

for (const candidate of backlog.candidates ?? []) {
  if (!candidate.canonicalModelId || candidateIds.has(candidate.canonicalModelId)) {
    errors.push(`Doppelte oder fehlende Kandidaten-ID: ${candidate.canonicalModelId ?? 'leer'}`);
  }
  candidateIds.add(candidate.canonicalModelId);
  if (ids.has(candidate.canonicalModelId)) errors.push(`${candidate.canonicalModelId} ist bereits veröffentlicht und darf nicht im Backlog bleiben`);
  if (!String(candidate.officialUrl ?? '').startsWith('https://')) errors.push(`${candidate.canonicalModelId}: offizielle HTTPS-URL fehlt`);
  if (urls.has(candidate.officialUrl)) errors.push(`${candidate.canonicalModelId}: doppelte kanonische URL`);
  urls.add(candidate.officialUrl);
  if (!allowedRoutes.has(candidate.scopeRoute)) errors.push(`${candidate.canonicalModelId}: unbekannte Route ${candidate.scopeRoute}`);
  if (!allowedPriorities.has(candidate.priority)) errors.push(`${candidate.canonicalModelId}: ungültige Priorität`);
  if (!allowedStatuses.has(candidate.status)) errors.push(`${candidate.canonicalModelId}: ungültiger Status`);
  if (candidate.status.startsWith('blocked_') && !candidate.blocker) errors.push(`${candidate.canonicalModelId}: blockierter Kandidat benötigt eine konkrete Begründung`);
  if (!candidate.reason || !(candidate.coverageTargets ?? []).length) errors.push(`${candidate.canonicalModelId}: Priorisierungsbegründung oder Zielsegment fehlt`);
}

for (const promotion of backlog.promotedPilotModels ?? []) {
  if (!promotion.canonicalModelId || promotedIds.has(promotion.canonicalModelId)) {
    errors.push(`Doppelte oder fehlende Pilot-Promotion: ${promotion.canonicalModelId ?? 'leer'}`);
  }
  promotedIds.add(promotion.canonicalModelId);
  if (!ids.has(promotion.canonicalModelId)) errors.push(`${promotion.canonicalModelId}: Pilot-Promotion fehlt im Katalog`);
  if (candidateIds.has(promotion.canonicalModelId)) errors.push(`${promotion.canonicalModelId}: darf nicht zugleich Pilot-Promotion und aktiver Backlog-Kandidat sein`);
  if (promotion.status !== 'pilot_pending_manual_safety_gate') errors.push(`${promotion.canonicalModelId}: unbekannter Pilotstatus`);
  if (!promotion.promotedAt || !promotion.note) errors.push(`${promotion.canonicalModelId}: Promotionsdatum oder transparenter Hinweis fehlt`);
}

const comboCandidates = backlog.candidates.filter((candidate) => candidate.scopeRoute === 'supported_combo_from_birth');
if (products.length + comboCandidates.length < backlog.targets.publishedComboModelsForIndexing) {
  errors.push(`Veröffentlichter Katalog plus Combo-Backlog deckt das Indexierungsziel von ${backlog.targets.publishedComboModelsForIndexing} Modellen nicht ab`);
}
for (const segment of personas.segments) {
  const profile = profileById.get(segment.profileId);
  if (!profile) {
    errors.push(`${segment.id}: Referenzprofil fehlt`);
    continue;
  }
  const publishedCount = matchStrollers({
    answers: profile.answers,
    products,
    criteriaData
  }).results.length;
  const candidateCount = comboCandidates.filter((candidate) => candidate.coverageTargets.includes(segment.id)).length;
  if (publishedCount < backlog.targets.publishedModelsPerCorePersona && !candidateCount) {
    errors.push(`${segment.id}: Zielabdeckung nicht erreicht und kein gezielter Ausbaukandidat`);
  }
  if (publishedCount < backlog.targets.publishedModelsPerCorePersonaPreferred && candidateCount < 2) {
    warnings.push(`${segment.id}: Zielabdeckung noch nicht bevorzugt und nur ${candidateCount} gezielter Ausbaukandidat`);
  }
}
for (const route of ['future_travel_buggy', 'future_siblings_twins', 'future_jogger']) {
  if (!backlog.candidates.some((candidate) => candidate.scopeRoute === route)) errors.push(`${route}: kein getrennt erfasster Zukunftskandidat`);
}

warnings.forEach((warning) => console.warn(`WARN ${warning}`));
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Katalogausbau-Gate bestanden: ${products.length} Pilotmodelle, ${backlog.promotedPilotModels?.length ?? 0} dokumentierte Pilot-Promotionen, ${comboCandidates.length} Combo-Kandidaten und ${backlog.candidates.length - comboCandidates.length} getrennte Zukunftskandidaten.`);
