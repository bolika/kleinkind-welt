#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('kinderwagen-navigator.html');
const css = read('css/kinderwagen-navigator.css');
const app = read('js/kinderwagen-navigator-app.mjs');
const offers = read('js/kinderwagen-offers.mjs');
const linkTracking = read('js/navigator-link-tracking.js');
const siteCss = read('css/style.css');
const entryPages = {
  home: read('index.html'),
  kaufhilfen: read('kaufhilfen.html'),
  geburt: read('artikel/geschenke-zur-geburt.html'),
  bewertungsmethode: read('bewertungsmethode.html')
};
const questions = JSON.parse(read('data/kinderwagen-navigator/questions.v0.1.json'));
const catalog = JSON.parse(read('data/kinderwagen-navigator/catalog.v0.1.json'));
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(/<meta name="robots" content="noindex,follow">/.test(html), 'Pilotseite muss noindex,follow bleiben');
assert(/data-navigator-app/.test(html), 'App-Mountpoint fehlt');
assert(/data-navigator-hero-start/.test(html), 'Hero-CTA startet den Flow nicht direkt');
assert(/type="module" src="\/js\/kinderwagen-navigator-app\.mjs/.test(html), 'Browser-App wird nicht als Modul geladen');
assert(/affiliate-tracking\.js/.test(html), 'Zentrales Affiliate-Klicktracking fehlt auf der Navigator-Seite');
assert(/data-navigator-model-count/.test(html), 'Hero benötigt einen dynamischen Katalogzähler');
assert(/Der aktuelle Katalog ist ein Testkatalog/.test(html), 'Pilotgrenze des Katalogs fehlt');
assert(!/95%/.test(html), 'Statischer Beispielscore darf den echten Matcher nicht überlagern');

assert(/@media \(max-width: 640px\)/.test(css), 'Mobile Breakpoint fehlt');
assert(/\.navigator-choice/.test(css) && /\.navigator-app-actions/.test(css), 'Zentrale Form-Styles fehlen');
assert(/min-height: 48px/.test(css), 'Touch-Ziel-Mindesthöhe fehlt');

assert(!/\.innerHTML\s*=/.test(app), 'App darf dynamische Daten nicht per innerHTML rendern');
assert(!/localStorage|sessionStorage/.test(app), 'Pilot soll keine Antworten im Browser speichern');
for (const action of ['gestartet', 'frage_angezeigt', 'frage_beantwortet', 'zurueck', 'zusammenfassung_angesehen', 'ergebnis_berechnet', 'ergebnis_bewertet', 'route_nicht_unterstuetzt']) {
  assert(app.includes(`'${action}'`), `Plausible-Aktion ${action} fehlt`);
}
for (const action of ['match_gesehen', 'haendlerangebot_geoeffnet', 'score_erlaeuterung_geoeffnet']) {
  assert(app.includes(`'${action}'`), `Plausible-Ergebnisaktion ${action} fehlt`);
}
for (const action of ['budget_gewaehlt', 'kompromiss_akzeptiert']) {
  assert(app.includes(`'${action}'`), `Plausible-Detailaktion ${action} fehlt`);
}
assert(/flow_version/.test(app), 'Tracking muss die Flow-Version mitsenden');
assert(/offers\.v0\.1\.json/.test(app), 'Separate Händlerangebotsdaten werden nicht geladen');
assert(/haendlerangebot_gesehen/.test(app), 'Sichtbares Händlerangebot wird nicht gemessen');
assert(/dataset\.affiliate/.test(app) && /sponsored nofollow noopener/.test(app), 'Affiliate-Angebote benötigen Trackingdaten und rel-Kennzeichnung');
assert(/exact_required_configuration/.test(offers), 'Nur bestätigte vollständige Konfigurationen dürfen angezeigt werden');
assert(/clickref/.test(offers), 'Awin-Link benötigt eine placement-spezifische Clickref');
assert(!/offersForProduct\([^)]*matchStrollers/.test(app), 'Händlerangebote dürfen nicht in den Matcher gelangen');

const supportedTypes = new Set(['single_choice', 'multi_choice', 'budget', 'number', 'number_list', 'confirmation']);
for (const question of questions.questions) assert(supportedTypes.has(question.type), `Nicht unterstützter Fragetyp ${question.type} bei ${question.id}`);

const expectedAnswerKeys = [
  'search_goal', 'daily_context', 'lift_unit', 'terrain', 'budget', 'top_priorities'
];
assert(JSON.stringify(questions.questions.map((question) => question.id)) === JSON.stringify(expectedAnswerKeys), 'Frage-IDs passen nicht zum Matcher-Vertrag');
assert(questions.flowVersion === '0.2.0', 'Flow-Version 0.2.0 fehlt');
assert(questions.designRules?.showAnswerSummaryBeforeResult === false, 'Der zusätzliche Bestätigungsscreen muss im Kurzflow entfallen');
assert(/else renderResults\(\)/.test(app), 'Die letzte Frage muss direkt zum Ergebnis führen');
assert(questions.questions.find((question) => question.id === 'search_goal')?.options?.some((option) => option.value === 'travel_buggy'), 'Reisebuggy-Segment fehlt');
assert(questions.questions.find((question) => question.id === 'top_priorities')?.validation?.minimumSelections === 2, 'Zwei Top-Prioritäten müssen erzwungen werden');
assert(questions.questions.find((question) => question.id === 'top_priorities')?.validation?.maximumSelections === 2, 'Genau zwei Top-Prioritäten dürfen gewählt werden');
assert(/Maximum erreicht/.test(app) && /input\.disabled/.test(app), 'Mehrfachauswahl muss ihr Maximum live ankündigen und weitere Optionen sperren');
assert(/budgetControl/.test(app) && /navigator-budget-feedback/.test(app), 'Budgetregler mit Live-Katalogfeedback fehlt');
assert(/navigator-budget-modes/.test(css) && /budget_strictness/.test(app), 'Budgetmodus muss in den Regler-Screen integriert sein');
assert(/result\.closest/.test(app) && /Gezielt einen Abstrich wählen/.test(app), 'Lösungsorientierter No-Match-Pfad fehlt');
assert(/90–100 %/.test(app) && /85–89 %/.test(app) && /75–84 %/.test(app), 'Nutzerverständliche Match-Stufen fehlen im Ergebnis');
assert(/unbekannte Kernpassung verhindert/.test(app) && /teilweise belegte Kernpassung begrenzt/.test(app), 'Score-Erklärung muss die Kernkontext-Begrenzung offenlegen');
assert(/applicableCriteriaCount/.test(app) && /knownCriteriaCount/.test(app), 'Ergebnis muss die bewertete Kriterienbasis offenlegen');
assert(/resultHeading.*focus/.test(app), 'Ergebnis benötigt sichtbares Fokusmanagement für Tastatur und Screenreader');
assert(/state\.products\.length.*Kinderwagen/.test(app), 'Startkarte muss die Kataloggröße dynamisch ausgeben');
assert(/data-navigator-model-count/.test(app) && /products\.length/.test(app), 'Hero-Katalogzähler muss aus dem geladenen Katalog aktualisiert werden');
assert(!/vehicleSelectControl|trunk_dimensions/.test(app), 'Komplexe Fahrzeug- oder Kofferraummaßstrecke darf nicht im Hauptflow bleiben');
assert(!expectedAnswerKeys.some((id) => ['maximum_lift_weight', 'maximum_access_width', 'pusher_heights'].includes(id)), 'Manuelle Maße dürfen nicht im Kernflow liegen');

assert(catalog.products.length >= 6, `Katalogpilot benötigt mindestens 6 Modelle, gefunden ${catalog.products.length}`);
for (const [page, source] of Object.entries(entryPages)) {
  assert(/href="\/kinderwagen-navigator"/.test(source), `${page}: interner Navigator-Link fehlt`);
  assert(/data-navigator-link/.test(source), `${page}: Navigator-Einstieg benötigt Klicktracking`);
  assert(/navigator-link-tracking\.js/.test(source), `${page}: Navigator-Linktracking wird nicht geladen`);
}
assert(/home-navigator-section/.test(entryPages.home) && /home-navigator-demo/.test(entryPages.home), 'Startseite benötigt eine prominente Navigator-Vorschau');
assert(/data-navigator-catalog-count/.test(entryPages.home), 'Startseiten-Vorschau benötigt einen dynamischen Katalogzähler');
assert(/home-navigator-section/.test(siteCss) && /navigator-inline-card/.test(siteCss), 'Styles für Startseiten-Vorschau und kontextuelle Links fehlen');
assert(/interner_einstieg/.test(linkTracking) && /data-navigator-catalog-count/.test(linkTracking), 'Internes Navigator-Tracking oder Katalogzählersynchronisierung fehlt');
assert(!/95\s*%/.test(entryPages.home), 'Startseiten-Vorschau darf keinen überhöhten Beispielscore versprechen');
for (const filename of catalog.products) {
  const file = path.join(root, 'data', 'kinderwagen-navigator', 'products', filename);
  assert(fs.existsSync(file), `Katalogdatei fehlt: ${filename}`);
  if (!fs.existsSync(file)) continue;
  const product = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert(product.modelVersion === catalog.modelVersion, `${filename}: Model-Version passt nicht zum Katalog`);
  assert((product.sources ?? []).every((source) => source.url.startsWith('https://')), `${filename}: nicht sichere Quellen-URL`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Navigator-UI-Gate bestanden: ${questions.questions.length} adaptive Fragen, ${catalog.products.length} Kinderwagen, Kurzflow-, Budget- und No-Match-Vertrag geprüft.`);
