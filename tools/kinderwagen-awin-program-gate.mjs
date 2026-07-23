#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const registry = JSON.parse(fs.readFileSync(path.join(dataDir, 'awin-programs.v0.1.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const expansion = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog-expansion.v0.2.json'), 'utf8'));
const productIds = new Set(catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8')).productId
));
const candidateIds = new Set(expansion.candidates.map((candidate) => candidate.canonicalModelId));
const allowedStatuses = new Set(['pending', 'joined', 'rejected', 'suspended', 'closed']);
const allowedModes = new Set(['awin_feed', 'manual_awin_link']);
const allowedPriorities = new Set(['P0', 'P1', 'P2']);
const allowedImageStatuses = new Set(['terms_review_required', 'approved_for_feed_only', 'prohibited', 'no_feed']);
const errors = [];
const merchantIds = new Set();
const advertiserIds = new Set();

for (const program of registry.programs ?? []) {
  const merchantId = program.merchant?.id;
  if (!merchantId || merchantIds.has(merchantId)) errors.push(`Doppelte oder fehlende Händler-ID: ${merchantId ?? 'leer'}`);
  merchantIds.add(merchantId);
  if (!allowedStatuses.has(program.applicationStatus)) errors.push(`${merchantId}: ungültiger Bewerbungsstatus`);
  if (!allowedModes.has(program.integrationMode)) errors.push(`${merchantId}: ungültiger Integrationsmodus`);
  if (!allowedPriorities.has(program.priority)) errors.push(`${merchantId}: ungültige Priorität`);
  if (!allowedImageStatuses.has(program.feedImageUsageStatus)) errors.push(`${merchantId}: ungültiger Bildrechte-Status`);
  if (program.applicationStatus === 'joined' && !(program.advertiserId > 0)) errors.push(`${merchantId}: freigegebenes Programm ohne Advertiser-ID`);
  if (program.advertiserId !== null) {
    if (!Number.isInteger(program.advertiserId) || program.advertiserId < 1) errors.push(`${merchantId}: ungültige Advertiser-ID`);
    if (advertiserIds.has(program.advertiserId)) errors.push(`${merchantId}: Advertiser-ID doppelt`);
    advertiserIds.add(program.advertiserId);
  }
  if (program.integrationMode === 'awin_feed' && program.productFeedAvailable !== true) errors.push(`${merchantId}: Feed-Integration ohne verfügbaren Feed`);
  if (program.productFeedAvailable && program.feedImageUsageStatus !== 'terms_review_required' && program.applicationStatus !== 'joined') {
    errors.push(`${merchantId}: Bildrechte dürfen vor Freigabe nicht als geklärt gelten`);
  }
  if (!program.mappingFile || !fs.existsSync(path.join(root, program.mappingFile))) {
    errors.push(`${merchantId}: Mapping-Datei fehlt`);
    continue;
  }
  const mapping = JSON.parse(fs.readFileSync(path.join(root, program.mappingFile), 'utf8'));
  if (mapping.merchant?.id !== merchantId || mapping.merchant?.name !== program.merchant.name) errors.push(`${merchantId}: Mapping-Händler passt nicht zur Registry`);
  if (mapping.advertiserId !== program.advertiserId) errors.push(`${merchantId}: Mapping-Advertiser-ID passt nicht zur Registry`);
  if (mapping.advertiserName !== program.advertiserName) errors.push(`${merchantId}: Mapping-Advertiser-Name passt nicht zur Registry`);
  for (const item of mapping.mappings ?? []) {
    if (!productIds.has(item.productId)) errors.push(`${merchantId}: Mapping referenziert unbekanntes Produkt ${item.productId}`);
    if (!(item.merchantProductIds?.length || item.gtins?.length)) errors.push(`${merchantId}/${item.productId}: kuratierte Produkt-ID oder GTIN fehlt`);
    if (!item.configuration?.status || !item.configuration?.verifiedAt) errors.push(`${merchantId}/${item.productId}: Konfigurationsprüfung fehlt`);
  }
  for (const productId of program.catalogProductIds ?? []) if (!productIds.has(productId)) errors.push(`${merchantId}: unbekannte Katalog-productId ${productId}`);
  for (const candidateId of program.plannedModelIds ?? []) if (!candidateIds.has(candidateId)) errors.push(`${merchantId}: unbekannter Ausbaukandidat ${candidateId}`);
}

if (merchantIds.size !== 6) errors.push(`Genau sechs angefragte Programme erwartet, gefunden: ${merchantIds.size}`);
const babyprofi = registry.programs.find((program) => program.merchant?.id === 'babyprofi');
if (babyprofi?.advertiserId !== 14986) errors.push('Babyprofi Advertiser-ID 14986 fehlt');
if (registry.policy?.programAvailabilityDoesNotAffectMatchScore !== true) errors.push('Unabhängigkeitsregel für Programmverfügbarkeit fehlt');
if (registry.policy?.commissionDoesNotAffectOfferOrder !== true) errors.push('Provision darf Angebotsreihenfolge nicht beeinflussen');
if (registry.policy?.unknownAdvertiserIdBlocksImport !== true) errors.push('Unbekannte Advertiser-ID muss Import blockieren');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Awin-Programm-Gate bestanden: ${merchantIds.size} Bewerbungen vorbereitet, ${advertiserIds.size} bestätigte Advertiser-ID, Matching und Provision getrennt.`);
