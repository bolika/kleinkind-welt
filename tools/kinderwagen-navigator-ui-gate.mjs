#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const html = read('kinderwagen-navigator.html');
const css = read('css/kinderwagen-navigator.css');
const app = read('js/kinderwagen-navigator-app.mjs');
const questions = JSON.parse(read('data/kinderwagen-navigator/questions.v0.1.json'));
const catalog = JSON.parse(read('data/kinderwagen-navigator/catalog.v0.1.json'));
const vehicleCatalog = JSON.parse(read('data/kinderwagen-navigator/vehicles.v0.1.json'));
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(/<meta name="robots" content="noindex,follow">/.test(html), 'Pilotseite muss noindex,follow bleiben');
assert(/data-navigator-app/.test(html), 'App-Mountpoint fehlt');
assert(/data-navigator-hero-start/.test(html), 'Hero-CTA startet den Flow nicht direkt');
assert(/type="module" src="\/js\/kinderwagen-navigator-app\.mjs/.test(html), 'Browser-App wird nicht als Modul geladen');
assert(/Daten-Pilot · 6 Modelle/.test(html), 'Hero kommuniziert Kataloggröße nicht korrekt');
assert(/Sechs Modelle sind ein Testkatalog/.test(html), 'Pilotgrenze des Katalogs fehlt');
assert(!/95%/.test(html), 'Statischer Beispielscore darf den echten Matcher nicht überlagern');

assert(/@media \(max-width: 640px\)/.test(css), 'Mobile Breakpoint fehlt');
assert(/\.navigator-choice/.test(css) && /\.navigator-app-actions/.test(css), 'Zentrale Form-Styles fehlen');
assert(/min-height: 48px/.test(css), 'Touch-Ziel-Mindesthöhe fehlt');

assert(!/\.innerHTML\s*=/.test(app), 'App darf dynamische Daten nicht per innerHTML rendern');
assert(!/localStorage|sessionStorage/.test(app), 'Pilot soll keine Antworten im Browser speichern');
for (const action of ['gestartet', 'frage_beantwortet', 'zurueck', 'zusammenfassung_angesehen', 'ergebnis_berechnet', 'ergebnis_bewertet', 'route_nicht_unterstuetzt']) {
  assert(app.includes(`'${action}'`), `Plausible-Aktion ${action} fehlt`);
}

const supportedTypes = new Set(['single_choice', 'multi_choice', 'budget', 'number', 'dimensions', 'number_list', 'confirmation', 'vehicle_select']);
for (const question of questions.questions) assert(supportedTypes.has(question.type), `Nicht unterstützter Fragetyp ${question.type} bei ${question.id}`);

const expectedAnswerKeys = [
  'search_goal', 'children_count', 'budget', 'budget_strictness', 'stairs_frequency', 'lift_unit',
  'maximum_lift_weight', 'access_context', 'elevator_visual_type', 'maximum_access_width', 'car_frequency', 'trunk_measurement_known',
  'vehicle_selection', 'trunk_dimensions', 'public_transport_frequency', 'terrain', 'pusher_heights', 'required_features',
  'visual_style', 'top_priorities', 'measurement_confirmation'
];
assert(JSON.stringify(questions.questions.map((question) => question.id)) === JSON.stringify(expectedAnswerKeys), 'Frage-IDs passen nicht zum Matcher-Vertrag');
assert(questions.questions.find((question) => question.id === 'top_priorities')?.validation?.minimumSelections === 2, 'Zwei Top-Prioritäten müssen erzwungen werden');
assert(questions.questions.find((question) => question.id === 'top_priorities')?.validation?.maximumSelections === 3, 'Höchstens drei Top-Prioritäten dürfen gewählt werden');
assert(/Maximum erreicht/.test(app) && /input\.disabled/.test(app), 'Mehrfachauswahl muss ihr Maximum live ankündigen und weitere Optionen sperren');
assert(/navigator-choice__visual/.test(css), 'Visuelle Aufzug- und Stiloptionen fehlen');
assert(/vehicleSelectControl/.test(app) && /fahrzeug_ausgewaehlt/.test(app), 'Fahrzeugauswahl oder Tracking fehlt');
assert(/fahrzeugquelle_geoeffnet/.test(app), 'Tracking für geöffnete Fahrzeugquelle fehlt');
assert(questions.questions.find((question) => question.id === 'measurement_confirmation')?.showWhen?.operator === 'any_answered', 'Maßbestätigung muss adaptiv erscheinen');

assert(vehicleCatalog.vehicles.length >= 10, `Fahrzeugpilot benötigt mindestens 10 Profile, gefunden ${vehicleCatalog.vehicles.length}`);
assert(vehicleCatalog.vehicles.every((vehicle) => vehicle.source?.url && vehicle.cargo?.usableHeightCm === null), 'Fahrzeugprofile müssen Quelle enthalten und unbekannte nutzbare Höhe offenlassen');

assert(catalog.products.length >= 6, `Katalogpilot benötigt mindestens 6 Modelle, gefunden ${catalog.products.length}`);
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

console.log(`Navigator-UI-Gate bestanden: ${questions.questions.length} adaptive Fragen, ${catalog.products.length} Kinderwagen, ${vehicleCatalog.vehicles.length} Fahrzeugprofile, Mobile- und Tracking-Vertrag geprüft.`);
