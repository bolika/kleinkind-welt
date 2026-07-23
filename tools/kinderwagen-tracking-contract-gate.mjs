#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const app = read('js/kinderwagen-navigator-app.mjs');
const linkTracking = read('js/navigator-link-tracking.js');
const affiliateTracking = read('js/affiliate-tracking.js');
const docs = read('docs/kinderwagen-navigator-analytics.md');
const contract = JSON.parse(read('data/kinderwagen-navigator/tracking-contract.v0.1.json'));
const errors = [];
const implementedActions = new Set(
  [...app.matchAll(/track\('([^']+)'/g)].map((match) => match[1])
);

for (const action of contract.requiredActions ?? []) {
  if (!implementedActions.has(action)) errors.push(`Pflichtaktion fehlt im Navigator: ${action}`);
}
for (const property of contract.requiredContextProperties ?? []) {
  if (!app.includes(property)) errors.push(`Pflichtkontext fehlt im Navigator: ${property}`);
}
for (const property of contract.forbiddenPropertyNames ?? []) {
  const propertyPattern = new RegExp(`(?:^|[,{\\s])${property}\\s*:`, 'm');
  if (propertyPattern.test(app)) errors.push(`Verbotene Tracking-Eigenschaft gefunden: ${property}`);
}
if (contract.eventName !== 'Kinderwagen-Navigator' || !app.includes("plausible('Kinderwagen-Navigator'")) {
  errors.push('Zentraler Plausible-Eventname stimmt nicht mit dem Vertrag überein');
}
if (!linkTracking.includes("'Kinderwagen-Navigator'")) errors.push('Internes Einstiegs-Tracking fehlt');
if (!affiliateTracking.includes("'Affiliate-Klick'")) errors.push('Zentrales Affiliate-Klicktracking fehlt');
for (const event of ['navigator_bereit', 'gestartet', 'ergebnis_berechnet', 'match_gesehen', 'haendlerangebot_geoeffnet']) {
  if (!docs.includes(event)) errors.push(`Funnel-Dokumentation enthält ${event} nicht`);
}
if (contract.privacy?.freeTextAnswersForbidden !== true || contract.privacy?.exactMeasurementsForbidden !== true || contract.privacy?.persistentUserIdsForbidden !== true) {
  errors.push('Datenschutz-Guardrails sind im Vertrag nicht vollständig aktiv');
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Tracking-Vertrag bestanden: ${contract.requiredActions.length} Navigator-Aktionen, Einstiegs- und Affiliate-Tracking sowie Privacy-Guardrails geprüft.`);
