#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchStrollers } from '../js/kinderwagen-matcher.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const catalog = readJson('catalog.v0.1.json');
const criteriaData = readJson('criteria.v0.1.json');
const profilesData = readJson('reference-profiles.v0.1.json');
const personas = readJson('persona-segments.v0.2.json');
const expansion = readJson('catalog-expansion.v0.2.json');
const readiness = readJson('release-readiness.v0.1.json');
const products = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8'))
);
const profileById = new Map(profilesData.profiles.map((profile) => [profile.id, profile]));
const html = read('kinderwagen-navigator.html');
const sitemap = read('sitemap.xml');
const llms = read('llms.txt');
const blockers = [];
const strict = process.argv.includes('--strict');
const indexTarget = expansion.targets?.publishedComboModelsForIndexing ?? 20;

if (products.length < indexTarget) {
  blockers.push(`Katalog: ${products.length} von mindestens ${indexTarget} Modellen veröffentlicht`);
}

for (const segment of personas.segments ?? []) {
  const profile = profileById.get(segment.profileId);
  if (!profile) {
    blockers.push(`${segment.id}: Referenzprofil fehlt`);
    continue;
  }
  const result = matchStrollers({ answers: profile.answers, products, criteriaData });
  const minimumForIndexing = Math.max(2, segment.requiredPublishedMatches ?? 1);
  if (result.results.length < minimumForIndexing) {
    blockers.push(`${segment.id}: ${result.results.length} von mindestens ${minimumForIndexing} veröffentlichungsfähigen Matches`);
  }
}

for (const [id, gate] of Object.entries(readiness.manualGates ?? {})) {
  if (gate.status !== 'complete') {
    const progress = Number.isInteger(gate.completed) && Number.isInteger(gate.target)
      ? ` (${gate.completed}/${gate.target})`
      : '';
    blockers.push(`Manueller Gate ${id}: ${gate.status}${progress}`);
  }
}

if (!/data-navigator-app/.test(html) || html.indexOf('data-navigator-app') > html.indexOf('navigator-quick-proof')) {
  blockers.push('UX: Tool ist nicht vor den vertiefenden Inhalten verankert');
}
if (!/"@type": "WebApplication"/.test(html)) blockers.push('SEO: WebApplication-Strukturdaten fehlen');
if (!/bewertungsmethode/.test(html)) blockers.push('Vertrauen: Bewertungsmethode ist nicht verlinkt');

const noindex = /<meta name="robots" content="noindex,follow">/.test(html);
if (blockers.length && !noindex) {
  console.error('ERROR Unfertiger Navigator ist indexierbar. noindex,follow muss bis zur Freigabe aktiv bleiben.');
  process.exit(1);
}

if (!blockers.length) {
  if (noindex) blockers.push('Launch: noindex muss nach finaler Freigabe entfernt werden');
  if (!sitemap.includes('https://kleinkind-welt.de/kinderwagen-navigator')) blockers.push('Launch: Navigator fehlt in sitemap.xml');
  if (!llms.includes('https://kleinkind-welt.de/kinderwagen-navigator')) blockers.push('Launch: Navigator fehlt in llms.txt');
}

if (blockers.length) {
  console.log('Indexierungsstatus: NICHT BEREIT');
  blockers.forEach((blocker) => console.log(`- ${blocker}`));
  if (strict) process.exit(1);
} else {
  console.log(`Indexierungsstatus: BEREIT – ${products.length} Modelle, alle Persona-, Beta- und Discovery-Gates erfüllt.`);
}
