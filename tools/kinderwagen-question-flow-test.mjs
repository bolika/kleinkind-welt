#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getVisibleQuestions, hasAnswerValue, validateQuestionValue } from '../js/kinderwagen-question-flow.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const questionsData = JSON.parse(fs.readFileSync(path.join(root, 'data/kinderwagen-navigator/questions.v0.1.json'), 'utf8'));
const questions = questionsData.questions;
const byId = new Map(questions.map((question) => [question.id, question]));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const visibleIds = (answers) => getVisibleQuestions(questions, answers).map((question) => question.id);

assert(questionsData.flowVersion === '0.2.0', 'Der verkürzte Flow benötigt eine eigene Flow-Version 0.2.0');
assert(visibleIds({})[0] === 'search_goal', 'Die Produktart muss ohne Vorfrage zuerst erscheinen');
assert(byId.get('search_goal').options.some((option) => option.value === 'travel_buggy'), 'Reisebuggy fehlt als eigenes Segment');
assert(visibleIds({ search_goal: 'first_combo_from_birth' }).includes('daily_context'), 'Alltagsfrage muss im unterstützten Flow erscheinen');
assert(!visibleIds({ search_goal: 'first_combo_from_birth', daily_context: ['regular_car'] }).includes('lift_unit'), 'Trageeinheit darf ohne Tragekontext nicht erscheinen');
assert(visibleIds({ search_goal: 'first_combo_from_birth', daily_context: ['regular_carrying'] }).includes('lift_unit'), 'Trageeinheit muss nur bei regelmäßigem Tragen erscheinen');

const baseAnswers = {
  search_goal: 'first_combo_from_birth',
  daily_context: ['regular_car'],
  terrain: ['mixed'],
  budget: 900,
  top_priorities: ['easy_folding', 'storage']
};
assert(visibleIds(baseAnswers).length === 5, 'Der Standardpfad muss genau fünf Fragen enthalten');
assert(visibleIds({ ...baseAnswers, daily_context: ['regular_carrying'], lift_unit: 'frame_with_seat' }).length === 6, 'Der Tragepfad muss genau eine Zusatzfrage enthalten');
assert(!questions.some((question) => ['experience_level', 'children_count', 'maximum_lift_weight', 'maximum_access_width', 'pusher_heights', 'measurement_confirmation'].includes(question.id)), 'Manuelle Maße und redundante Vorfragen dürfen nicht im Kernflow bleiben');

assert(validateQuestionValue(byId.get('budget'), 299) !== null, 'Budget unter Minimum muss abgelehnt werden');
assert(validateQuestionValue(byId.get('budget'), 900) === null, 'Gültiges Budget muss akzeptiert werden');
assert(validateQuestionValue(byId.get('daily_context'), ['none_special', 'regular_car']) !== null, 'Exklusive Alltag-Auswahl darf nicht kombiniert werden');
assert(validateQuestionValue(byId.get('daily_context'), ['none_special']) === null, 'Alleinige neutrale Alltag-Auswahl muss zulässig sein');
assert(validateQuestionValue(byId.get('daily_context'), ['regular_car', 'small_trunk']) !== null, 'Die beiden Auto-Platzvarianten dürfen nicht kombiniert werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['easy_folding']) !== null, 'Nur eine Top-Priorität muss abgelehnt werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['easy_folding', 'storage']) === null, 'Genau zwei Top-Prioritäten müssen akzeptiert werden');
assert(validateQuestionValue(byId.get('top_priorities'), ['easy_folding', 'storage', 'weather']) !== null, 'Drei Top-Prioritäten müssen abgelehnt werden');
assert(hasAnswerValue({ daily_context: [] }, 'daily_context') === false, 'Leere Auswahl darf nicht als beantwortet gelten');

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log('Fragefluss-Test bestanden: Reisebuggy-Segment, fünf Kernfragen, adaptive Tragefrage und Auswahlgrenzen geprüft.');
