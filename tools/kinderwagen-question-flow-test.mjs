#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getVisibleQuestions, hasAnswerValue, validateQuestionValue } from '../js/kinderwagen-question-flow.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questions = JSON.parse(fs.readFileSync(path.join(root, 'data/kinderwagen-navigator/questions.v0.1.json'), 'utf8')).questions;
const byId = new Map(questions.map((question) => [question.id, question]));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const visibleIds = (answers) => getVisibleQuestions(questions, answers).map((question) => question.id);

assert(!visibleIds({}).includes('children_count'), 'Kinderanzahl darf vor Wahl des unterstützten Ziels nicht erscheinen');
assert(visibleIds({})[0] === 'experience_level', 'Erfahrungsstand muss zuerst und ohne Fachbegriffe abgefragt werden');
assert(visibleIds({ search_goal: 'first_combo_from_birth' }).includes('children_count'), 'Kinderanzahl muss im unterstützten Flow erscheinen');
assert(!visibleIds({ search_goal: 'first_combo_from_birth', children_count: 'one', car_frequency: 'never' }).includes('car_space'), 'Kofferraum-Einschätzung muss ohne Autonutzung entfallen');
assert(visibleIds({ search_goal: 'first_combo_from_birth', children_count: 'one', car_frequency: 'weekly' }).includes('car_space'), 'Kofferraum-Einschätzung muss bei Autonutzung erscheinen');
assert(!questions.some((question) => ['trunk_measurement_known', 'vehicle_selection', 'trunk_dimensions'].includes(question.id)), 'Komplexe Fahrzeug- und Maßstrecke muss aus dem Hauptflow entfernt sein');
assert(visibleIds({ access_context: 'elevator' }).includes('elevator_visual_type'), 'Aufzugbilder müssen nach Auswahl Aufzug erscheinen');
assert(!visibleIds({ access_context: 'doorway' }).includes('elevator_visual_type'), 'Aufzugbilder dürfen bei normaler Tür nicht erscheinen');
assert(visibleIds({ access_context: 'elevator' }).includes('maximum_access_width'), 'Lichte Breite muss für den Aufzug angeboten werden');
assert(!visibleIds({ access_context: 'none' }).includes('maximum_access_width'), 'Breitenfrage muss ohne Engstelle entfallen');
assert(visibleIds({ access_context: 'elevator', maximum_access_width: 59 }).includes('measurement_confirmation'), 'Maßbestätigung muss nach Zugangsmaß erscheinen');
assert(!visibleIds({}).includes('measurement_confirmation'), 'Maßbestätigung darf ohne Maßangabe nicht erscheinen');
assert(visibleIds({ stairs_frequency: 'daily', lift_unit: 'frame_with_carrycot' }).includes('maximum_lift_weight'), 'Tragegrenze muss für Gestell mit Babywanne angeboten werden');

assert(validateQuestionValue(byId.get('budget'), 199) !== null, 'Budget unter Minimum muss abgelehnt werden');
assert(validateQuestionValue(byId.get('budget'), 900) === null, 'Gültiges Budget muss akzeptiert werden');
assert(validateQuestionValue(byId.get('car_space'), 'unsure') === null, 'Unsichere Kofferraum-Einschätzung muss zulässig sein');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit']) !== null, 'Nur eine Top-Priorität muss abgelehnt werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit', 'easy_to_carry']) === null, 'Zwei Top-Prioritäten müssen akzeptiert werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit', 'easy_to_carry', 'service']) === null, 'Drei Top-Prioritäten müssen akzeptiert werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit', 'easy_to_carry', 'service', 'weather']) !== null, 'Vier Top-Prioritäten müssen abgelehnt werden');
assert(hasAnswerValue({ pusher_heights: [] }, 'pusher_heights') === false, 'Leere optionale Liste darf nicht als beantwortet gelten');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log('Fragefluss-Test bestanden: Einsteigerpfad, grobe Kofferraum-Einschätzung, Pflichtfelder und Auswahlgrenzen geprüft.');
