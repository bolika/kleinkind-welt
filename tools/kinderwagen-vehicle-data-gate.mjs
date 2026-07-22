#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'data', 'kinderwagen-navigator', 'vehicles.v0.1.json');
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const ids = new Set();

if (catalog.schemaVersion !== 1 || !catalog.catalogVersion || !catalog.checkedAt) errors.push('Katalogkopf ist unvollständig');
if (!(catalog.limitations ?? []).some((item) => /darf.*harten Kinderwagen-Fit/i.test(item))) errors.push('Verbot eines ungeprüften harten Fits fehlt');
if ((catalog.vehicles ?? []).length < 10) errors.push('Fahrzeugpilot benötigt mindestens 10 Baureihen');

for (const vehicle of catalog.vehicles ?? []) {
  if (!vehicle.id || ids.has(vehicle.id)) errors.push(`Fehlende oder doppelte Fahrzeug-ID ${vehicle.id ?? ''}`);
  ids.add(vehicle.id);
  if (!vehicle.make || !vehicle.model || !vehicle.generationLabel || !vehicle.powertrainScope) errors.push(`${vehicle.id}: Identität oder Varianten-Scope fehlt`);
  let sourceHost = '';
  try { sourceHost = new URL(vehicle.source?.url).hostname; } catch {}
  if (!vehicle.source?.url?.startsWith('https://') || !sourceHost.endsWith('volkswagen.de') || !vehicle.source?.checkedAt || !vehicle.source?.title) errors.push(`${vehicle.id}: offizielle Primärquelle unvollständig`);
  for (const field of ['widthBetweenWheelArchesCm', 'floorLengthSecondRowCm', 'volumeLiters']) {
    if (!(vehicle.cargo?.[field] > 0)) errors.push(`${vehicle.id}: dokumentierter Wert ${field} fehlt`);
  }
  for (const field of ['usableHeightCm', 'openingWidthCm', 'openingHeightCm']) {
    if (vehicle.cargo?.[field] !== null) errors.push(`${vehicle.id}: ${field} darf ohne gesonderte belastbare Quelle nicht vorbelegt werden`);
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Fahrzeugdaten-Gate bestanden: ${catalog.vehicles.length} generationstreue Pilotdatensätze, unvollständige Fit-Maße transparent gesperrt.`);
