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
assert(visibleIds({ search_goal: 'first_combo_from_birth' }).includes('children_count'), 'Kinderanzahl muss im unterstützten Flow erscheinen');
assert(!visibleIds({ search_goal: 'first_combo_from_birth', children_count: 'one', car_frequency: 'never' }).includes('trunk_measurement_known'), 'Kofferraumfrage muss ohne Autonutzung entfallen');
assert(visibleIds({ search_goal: 'first_combo_from_birth', children_count: 'one', car_frequency: 'weekly' }).includes('trunk_measurement_known'), 'Kofferraumfrage muss bei regelmäßiger Autonutzung erscheinen');
assert(visibleIds({ trunk_measurement_known: 'yes' }).includes('trunk_dimensions'), 'Kofferraummaße müssen nach Ja erscheinen');
assert(!visibleIds({ trunk_measurement_known: 'measure_later' }).includes('trunk_dimensions'), 'Kofferraummaße dürfen nach später messen nicht erzwungen werden');
assert(visibleIds({ maximum_access_width: 59 }).includes('measurement_confirmation'), 'Maßbestätigung muss nach Zugangsmaß erscheinen');
assert(!visibleIds({}).includes('measurement_confirmation'), 'Maßbestätigung darf ohne Maßangabe nicht erscheinen');
assert(visibleIds({ stairs_frequency: 'daily', lift_unit: 'frame_with_carrycot' }).includes('maximum_lift_weight'), 'Tragegrenze muss für Gestell mit Babywanne angeboten werden');

assert(validateQuestionValue(byId.get('budget'), 199) !== null, 'Budget unter Minimum muss abgelehnt werden');
assert(validateQuestionValue(byId.get('budget'), 900) === null, 'Gültiges Budget muss akzeptiert werden');
assert(validateQuestionValue(byId.get('trunk_dimensions'), { width: 90, height: null, depth: 70 }) !== null, 'Unvollständige Pflichtmaße müssen abgelehnt werden');
assert(validateQuestionValue(byId.get('trunk_dimensions'), { width: 90, height: 50, depth: 70 }) === null, 'Vollständige gültige Pflichtmaße müssen akzeptiert werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit']) !== null, 'Nur eine Top-Priorität muss abgelehnt werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['city_transit', 'easy_to_carry']) === null, 'Genau zwei Top-Prioritäten müssen akzeptiert werden');
assert(hasAnswerValue({ pusher_heights: [] }, 'pusher_heights') === false, 'Leere optionale Liste darf nicht als beantwortet gelten');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log('Fragefluss-Test bestanden: adaptive Sichtbarkeit, Pflichtfelder, Maße und Auswahlgrenzen geprüft.');
