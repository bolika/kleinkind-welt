#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compromiseOptions, matchStrollers, matcherInternals } from '../js/kinderwagen-matcher.mjs';

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

function rankedIds(result) {
  return (result.results ?? []).map((item) => item.productId);
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
    assert(recommendation.rankRole, `${profile.id}: Ergebnisrolle fehlt`);
  }

  const reversed = matchStrollers({ answers: profile.answers, products: [...products].reverse(), criteriaData });
  assert(
    JSON.stringify(rankedIds(result)) === JSON.stringify(rankedIds(reversed)),
    `${profile.id}: Rangfolge hängt von der Eingabereihenfolge des Katalogs ab`
  );
}

const low = outputs.get('persona_low_budget_city_no_elevator');
assert(low.results[0]?.productId === 'my-junior-liyo', 'Persona 1: LIYO muss wegen Budget, dokumentiertem Gewicht und Faltung die beste verfügbare Passung sein');
assert(low.results.every((item) => item.priceEur <= 600), 'Persona 1: feste 600-Euro-Grenze darf nicht überschritten werden');
assert(low.results[0]?.evaluations.some((item) => item.criterionId === 'frequent_carrying_fit'), 'Persona 1: Tragepassung fehlt');
assert(low.results[0]?.evaluations.some((item) => item.criterionId === 'public_transport_fit'), 'Persona 1: ÖPNV-Passung fehlt');

const high = outputs.get('persona_high_budget_frequent_travel');
assert(high.results.length >= 1, 'Persona 2: Bei hohem Orientierungsbudget muss mindestens ein belastbarer Treffer erscheinen');
assert(high.results.every((item) => item.evaluations.some((evaluation) => evaluation.criterionId === 'car_transport_fit')), 'Persona 2: Autotransport muss jeden Treffer differenzieren');
assert(high.results.every((item) => item.evaluations.some((evaluation) => evaluation.criterionId === 'public_transport_fit')), 'Persona 2: ÖPNV-Nutzung muss jeden Treffer differenzieren');

const mid = outputs.get('persona_mid_budget_functionality');
assert(mid.results.length >= 1, 'Persona 3: Das mittlere Budget muss mindestens einen belastbaren Funktionstreffer liefern');
assert(mid.results.every((item) => item.priceEur <= 950), 'Persona 3: feste 950-Euro-Grenze darf nicht überschritten werden');
assert(mid.results[0]?.evaluations.some((item) => item.criterionId === 'storage_capacity'), 'Persona 3: Stauraum-Priorität fehlt');
assert(mid.results[0]?.evaluations.some((item) => item.criterionId === 'long_term_flexibility'), 'Persona 3: Nutzungsflexibilität fehlt');

const strictLow = outputs.get('strict_low_budget');
assert(strictLow.results.length === 0, 'Sehr niedriges Budget: Es darf kein künstlicher veröffentlichter Treffer innerhalb von 500 Euro entstehen');
assert(strictLow.preliminary.every((item) => item.matchScore === null || item.matchScore < criteriaData.scoreRules.minimumScoreToRecommend), 'Sehr niedriges Budget: nicht veröffentlichte Optionen müssen nachvollziehbar unter der Match-Schwelle bleiben');
const strictAnswers = profileData.profiles.find((profile) => profile.id === 'strict_low_budget').answers;
const budgetCompromise = compromiseOptions({ answers: strictAnswers, excluded: strictLow.excluded }).find((option) => option.id === 'budget_to_next');
assert(budgetCompromise?.value === 550, 'Sehr niedriges Budget: nächster konkrete Reglerstufe muss 550 Euro betragen');
const afterBudgetCompromise = matchStrollers({ answers: { ...strictAnswers, budget: budgetCompromise?.value }, products, criteriaData });
assert(afterBudgetCompromise.results.length > 0, 'Der angebotene Budgetkompromiss muss direkt mindestens eine veröffentlichungsfähige Option öffnen');

const tight = outputs.get('tight_access_transit');
assert(tight.results[0]?.evaluations.some((item) => item.criterionId === 'compact_access_fit'), 'Enge Zugänge: relativer Breiten-Score fehlt');
assert(allEligible(tight).every((item) => item.openChecks.some((check) => check.includes('Aufzugstür') || check.includes('Durchgangsöffnung'))), 'Enge Zugänge: realer Maßabgleich muss offen bleiben');
assert(tight.excluded.every((item) => !item.failures.some((failure) => failure.code === 'access_width')), 'Enge Zugänge: grobe Angabe darf kein hartes Breiten-Gate erzeugen');
assert(tight.results[0]?.matchScore <= 89, 'Enge Zugänge: nur teilweise belegter zentraler Nutzungskontext darf keine sehr hohe Übereinstimmung erzeugen');
assert(allEligible(tight).find((item) => item.productId === 'my-junior-miyo2')?.matchScore === null, 'Enge Zugänge: unbekannte Wagenbreite muss einen numerischen Score blockieren');

const rural = outputs.get('rural_rough_terrain');
assert(rural.results.every((item) => item.matchScore <= 84), 'Unebene Wege: nur teilweise belegte Geländepassung muss den Score auf eine solide Übereinstimmung begrenzen');

const travel = outputs.get('travel_buggy_out_of_scope');
assert(travel.route === 'unsupported_travel_buggy', 'Reisebuggy muss als eigene, noch nicht unterstützte Route erfasst werden');

const retiredProduct = structuredClone(products[0]);
retiredProduct.facts.marketStatus.value = 'retired';
const retiredResult = matchStrollers({ answers: profileData.profiles[1].answers, products: [retiredProduct], criteriaData });
assert(retiredResult.excluded[0]?.failures.some((failure) => failure.code === 'not_current'), 'Eingestellte Modelle müssen ausgeschlossen werden');

const liyo = products.find((product) => product.productId === 'my-junior-liyo');
const abc = products.find((product) => product.productId === 'abc-design-salsa-5-air');
const joolz = products.find((product) => product.productId === 'joolz-hub2');
assert(matcherInternals.liftWeightFor(liyo, 'frame_with_seat')?.value === 7.3, 'LIYO mit Sitz muss aus exakt passenden Komponenten 7,3 kg ergeben');
assert(matcherInternals.liftWeightFor(abc, 'frame_with_carrycot') === null, 'Fehlendes Babywannengewicht darf nicht durch Sitzgewicht ersetzt werden');
assert(matcherInternals.relativeCarryingScore(liyo, 'frame_with_seat') === 1, 'Leichtes dokumentiertes Tragegewicht muss relativ voll gewertet werden');
assert(matcherInternals.relativeAccessScore(joolz) === 1, '52,5 cm Breite müssen im Pilotkatalog die höchste relative Zugangspassung erhalten');
assert(matcherInternals.foldedCompactness(liyo) === 1, 'Sehr kompaktes LIYO-Faltmaß muss volle relative Kompaktheit erhalten');

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

console.log(`Matcher-Test bestanden: ${profileData.profiles.length} Referenzprofile, drei Kernpersonas und ${products.length} Pilotprodukte geprüft.`);
