#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/kinderwagen-navigator/source-registry.v0.1.json'), 'utf8'));
const errors = [];
const ids = new Set();

for (const source of registry.sources ?? []) {
  if (!source.id || ids.has(source.id)) errors.push(`Ungültige oder doppelte Source-ID: ${source.id}`);
  ids.add(source.id);
  if (!['manufacturer', 'affiliate_feed', 'official_notice'].includes(source.kind)) errors.push(`${source.id}: unbekannter Source-Typ`);
  if (!source.status || !source.notes) errors.push(`${source.id}: Status oder Notiz fehlt`);
  if (source.automatedDiscovery && !source.discoveryUrl) errors.push(`${source.id}: automatische Discovery ohne URL`);
  if (source.discoveryUrl && !source.discoveryUrl.startsWith('https://')) errors.push(`${source.id}: Discovery-URL muss HTTPS nutzen`);
  if (source.automatedDiscovery && !source.candidatePattern) errors.push(`${source.id}: Kandidatenmuster fehlt`);
}

if (registry.policy?.automaticPublication !== false) errors.push('Registry muss automatische Veröffentlichung ausschließen');
if (!registry.policy?.imagesRequireExplicitFeedOrRightsApproval) errors.push('Bildrechte-Regel fehlt');
if (!registry.sources?.some((source) => source.kind === 'official_notice')) errors.push('Quelle für offizielle Warnungen fehlt');
if (!registry.sources?.some((source) => source.kind === 'affiliate_feed')) errors.push('Affiliate-Feed-Quelle fehlt');
if ((registry.sources ?? []).filter((source) => source.kind === 'manufacturer').length < 6) errors.push('Mindestens sechs Herstellerquellen erforderlich');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Source-Registry-Gate bestanden: ${registry.sources.length} Quellen, automatische Veröffentlichung gesperrt, Bildrechte und Reviewpflicht dokumentiert.`);
