#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { matchStrollers, matcherInternals } from '../js/kinderwagen-matcher.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const productsDir = path.join(dataDir, 'products');
const criteriaData = JSON.parse(fs.readFileSync(path.join(dataDir, 'criteria.v0.1.json'), 'utf8'));
const profileData = JSON.parse(fs.readFileSync(path.join(dataDir, 'reference-profiles.v0.1.json'), 'utf8'));
const products = fs.readdirSync(productsDir)
  .filter((name) => name.endsWith('.json'))
  .sort()
  .map((name) => JSON.parse(fs.readFileSync(path.join(productsDir, name), 'utf8')));
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function allEligible(result) {
  return [...(result.results ?? []), ...(result.preliminary ?? [])];
}

function ids(items) {
  return items.map((item) => item.productId).sort();
}

const outputs = new Map();
for (const profile of profileData.profiles) {
  const result = matchStrollers({ answers: profile.answers, products, criteriaData });
  outputs.set(profile.id, result);
  assert(result.route === profile.expected.route, `${profile.id}: Route ${result.route}, erwartet ${profile.expected.route}`);

  for (const recommendation of result.results ?? []) {
    assert(recommendation.eligible, `${profile.id}: nicht berechtigtes Modell in Ergebnissen`);
    assert(recommendation.dataCoverage >= criteriaData.scoreRules.minimumCoverageForNumericScore, `${profile.id}: Score trotz zu niedriger Datenabdeckung`);
    assert(recommendation.matchScore >= criteriaData.scoreRules.minimumScoreToRecommend, `${profile.id}: zu niedriger Score veröffentlicht`);
    assert(recommendation.compromise, `${profile.id}: Empfehlung ohne Kompromiss`);
    assert(recommendation.testingDisclosure.startsWith('Kein eigener Produkttest'), `${profile.id}: Testing-Disclosure fehlt`);
  }

  const reversed = matchStrollers({ answers: profile.answers, products: [...products].reverse(), criteriaData });
  assert(
    JSON.stringify(ids(result.results ?? [])) === JSON.stringify(ids(reversed.results ?? [])) &&
      JSON.stringify(ids(result.excluded ?? [])) === JSON.stringify(ids(reversed.excluded ?? [])),
    `${profile.id}: Ergebnis hängt von der Eingabereihenfolge des Katalogs ab`
  );
}

const cityWalkup = outputs.get('city_walkup_daily_transit');
const cityJoolz = cityWalkup.excluded.find((item) => item.productId === 'joolz-hub2');
assert(cityJoolz?.failures.some((failure) => failure.code === 'budget'), 'city_walkup_daily_transit: Joolz Hub2 muss am 900-Euro-Budget scheitern');
assert(!cityJoolz?.failures.some((failure) => failure.code === 'lift_weight'), 'city_walkup_daily_transit: Joolz Hub2 darf nicht zusätzlich fälschlich am 11-kg-Gate scheitern');
assert(!ids(allEligible(cityWalkup)).includes('cybex-balios-s-lux-current'), 'city_walkup_daily_transit: CYBEX überschreitet 11 kg und darf nicht berechtigt sein');

const compactCar = outputs.get('elevator_compact_car');
assert(compactCar.excluded.some((item) => item.productId === 'cybex-balios-s-lux-current' && item.failures.some((failure) => failure.code === 'feature_fold_with_seat_unknown')), 'elevator_compact_car: unbekannte Muss-Faltfunktion muss CYBEX ausschließen');

const narrowElevator = outputs.get('narrow_elevator');
assert(JSON.stringify(ids(allEligible(narrowElevator))) === JSON.stringify(['joolz-hub2', 'my-junior-liyo']), 'narrow_elevator: Nur LIYO und Joolz Hub2 dürfen das 59-cm-Gate erfüllen');

const rural = outputs.get('rural_rough_terrain');
assert(!ids(rural.results).includes('my-junior-liyo'), 'rural_rough_terrain: LIYO darf bei null Erfüllung der priorisierten Geländepassung nicht veröffentlicht werden');
assert(rural.preliminary.some((item) => item.productId === 'my-junior-liyo' && item.priorityConflicts.some((conflict) => conflict.criterionId === 'rough_surface_fit')), 'rural_rough_terrain: Prioritätskonflikt des LIYO muss sichtbar bleiben');

const dailyCar = outputs.get('daily_car_one_hand_requirements');
assert(JSON.stringify(ids(allEligible(dailyCar))) === JSON.stringify(['bugaboo-fox-5-renew']), 'daily_car_one_hand_requirements: Nur Bugaboo erfüllt beide belegten Muss-Faltfunktionen im Budget');

const lowBudget = outputs.get('strict_low_budget');
assert(allEligible(lowBudget).length === 0, 'strict_low_budget: Es darf kein künstlicher Treffer innerhalb von 500 Euro entstehen');
assert(lowBudget.excluded.some((item) => item.failures.some((failure) => failure.code === 'price_unknown')), 'strict_low_budget: unbekannter Gesamtpreis muss sichtbar ausschließen');

const estimated = outputs.get('estimated_measurements');
assert(allEligible(estimated).every((item) => item.openChecks.some((check) => check.includes('geschätzte Maße') || check.includes('nachmessen') || check.includes('Tragegrenze'))), 'estimated_measurements: geschätzte Maße müssen offene Prüfungen erzeugen');
assert(estimated.excluded.every((item) => !item.failures.some((failure) => ['access_width', 'folded_fit', 'lift_weight'].includes(failure.code))), 'estimated_measurements: geschätzte Maße dürfen keine harten Maß-Gates auslösen');

const tallParents = outputs.get('tall_parents_service_focus');
assert(allEligible(tallParents).every((item) => item.openChecks.some((check) => check.startsWith('Schieberhöhe'))), 'tall_parents_service_focus: extreme Körpergrößen benötigen immer einen Schieber-Praxistest');

const retiredProduct = structuredClone(products[0]);
retiredProduct.facts.marketStatus.value = 'retired';
const retiredResult = matchStrollers({ answers: profileData.profiles.find((profile) => profile.id === 'rural_rough_terrain').answers, products: [retiredProduct], criteriaData });
assert(retiredResult.excluded[0]?.failures.some((failure) => failure.code === 'not_current'), 'Marktstatus: eingestellte Modelle müssen ausgeschlossen werden');

const temporaryProduct = structuredClone(products[0]);
temporaryProduct.facts.marketStatus.value = 'current_temporarily_unavailable_manufacturer';
const temporaryResult = matchStrollers({ answers: profileData.profiles.find((profile) => profile.id === 'rural_rough_terrain').answers, products: [temporaryProduct], criteriaData });
assert(allEligible(temporaryResult).some((item) => item.openChecks.some((check) => check.includes('Lieferbarkeit'))), 'Marktstatus: temporär nicht verfügbare aktuelle Modelle benötigen einen Lieferbarkeits-Hinweis');

assert(matcherInternals.permutationsFit({ length: 45, width: 60, height: 90 }, { width: 92, height: 48, depth: 72 }) === true, 'Faltmaß-Permutation: erwarteter Fit wurde nicht erkannt');
assert(matcherInternals.permutationsFit({ length: 86, width: 63, height: 42 }, { width: 70, height: 40, depth: 90 }) === false, 'Faltmaß-Permutation: zu geringe Höhe wurde nicht abgelehnt');

const liyo = products.find((product) => product.productId === 'my-junior-liyo');
const abc = products.find((product) => product.productId === 'abc-design-salsa-5-air');
const joolz = products.find((product) => product.productId === 'joolz-hub2');
assert(matcherInternals.liftWeightFor(liyo, 'frame_with_seat')?.value === 7.3, 'Tragegewicht: LIYO mit Sitz muss aus exakt passenden Komponenten 7,3 kg ergeben');
assert(matcherInternals.liftWeightFor(liyo, 'frame_with_carrycot')?.value === 10, 'Tragegewicht: LIYO mit Babywanne muss 10 kg ergeben');
assert(matcherInternals.liftWeightFor(abc, 'frame_with_carrycot') === null, 'Tragegewicht: fehlendes ABC-Babywannengewicht darf nicht durch Sitzgewicht ersetzt werden');
assert(matcherInternals.liftWeightFor(joolz, 'frame_only') === null, 'Tragegewicht: unbekanntes Joolz-Gestellgewicht darf nicht aus Gesamtgewicht geraten werden');

for (const [profileId, result] of outputs) {
  if (result.route !== 'supported') {
    console.log(`${profileId}: Route ${result.route}`);
    continue;
  }
  const resultText = result.results.map((item) => `${item.productId} ${item.matchScore}%`).join(', ') || 'keine veröffentlichungsfähige Empfehlung';
  console.log(`${profileId}: ${resultText}; ${result.preliminary.length} vorläufig; ${result.excluded.length} ausgeschlossen`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Matcher-Test bestanden: ${profileData.profiles.length} Referenzprofile, ${products.length} Pilotprodukte, deterministische Reihenfolge und Gate-Invarianten geprüft.`);
