#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchStrollers } from '../js/kinderwagen-matcher.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data/kinderwagen-navigator');
const segments = JSON.parse(fs.readFileSync(path.join(dataDir, 'persona-segments.v0.2.json'), 'utf8'));
const profiles = JSON.parse(fs.readFileSync(path.join(dataDir, 'reference-profiles.v0.1.json'), 'utf8')).profiles;
const criteriaData = JSON.parse(fs.readFileSync(path.join(dataDir, 'criteria.v0.1.json'), 'utf8'));
const products = fs.readdirSync(path.join(dataDir, 'products'))
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(dataDir, 'products', name), 'utf8')));
const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
const errors = [];
const rows = [];

for (const segment of segments.segments ?? []) {
  const profile = profileById.get(segment.profileId);
  if (!profile) {
    errors.push(`${segment.id}: Profil ${segment.profileId} fehlt`);
    continue;
  }
  const result = matchStrollers({ answers: profile.answers, products, criteriaData });
  const top = result.results[0];
  const publishedCount = result.results.length;
  const solid = Boolean(top && top.matchScore >= segments.guardrails.minimumPublishedScore);
  const good = Boolean(top && top.matchScore >= segments.guardrails.goodMatchScore);
  if (publishedCount < segment.requiredPublishedMatches) {
    errors.push(`${segment.id}: ${publishedCount} veröffentlichte Treffer, benötigt ${segment.requiredPublishedMatches}`);
  }
  rows.push({
    segment: segment.id,
    top: top ? `${top.productId} ${top.matchScore}%` : 'kein Match',
    publishedCount,
    solid,
    good,
    desiredCountReached: publishedCount >= segment.desiredPublishedMatches
  });
}

const percent = (count) => rows.length ? Math.round((count / rows.length) * 100) : 0;
const matchCoverage = percent(rows.filter((row) => row.solid).length);
const goodCoverage = percent(rows.filter((row) => row.good).length);
const alternativeCoverage = percent(rows.filter((row) => row.publishedCount >= 2).length);

if (segments.researchMaturity?.validatedPersonas !== false || segments.researchMaturity?.status !== 'hypothesis_archetypes') {
  errors.push('Profile müssen bis zur Nutzerforschung ausdrücklich als unvalidierte Hypothesen-Archetypen markiert bleiben');
}
if (matchCoverage < segments.betaTargets.archetypesWithPublishedMatchPercent) {
  errors.push(`Match-Abdeckung ${matchCoverage}% liegt unter ${segments.betaTargets.archetypesWithPublishedMatchPercent}%`);
}
if (goodCoverage < segments.betaTargets.archetypesWithGoodMatchPercent) {
  errors.push(`Gute-Match-Abdeckung ${goodCoverage}% liegt unter ${segments.betaTargets.archetypesWithGoodMatchPercent}%`);
}

for (const row of rows) {
  console.log(`${row.segment}: ${row.top}; ${row.publishedCount} veröffentlichte Treffer; ${row.good ? 'gut' : row.solid ? 'solide' : 'unzureichend'}`);
}
console.log(`Archetypen-Abdeckung: ${matchCoverage}% mit solidem Match, ${goodCoverage}% mit gutem Match, ${alternativeCoverage}% mit mindestens zwei Treffern.`);
if (alternativeCoverage < segments.betaTargets.archetypesWithAtLeastTwoPublishedMatchesPercent) {
  errors.push(`Alternativen-Abdeckung ${alternativeCoverage}% liegt unter dem Beta-Ziel ${segments.betaTargets.archetypesWithAtLeastTwoPublishedMatchesPercent}%`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Archetypen-Coverage-Gate bestanden: ${rows.length} Hypothesen-Segmente gegen ${products.length} Pilotmodelle geprüft.`);
