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

// Flow 0.4.0: Die Produktart wird wieder gefragt, statt intern auf
// 'first_combo_from_birth' festgelegt zu sein. Wer eine nicht abgedeckte Art
// sucht, bekommt eine begründete Absage statt eines unpassenden Rankings.
assert(questionsData.flowVersion === '0.4.0', 'Der Beta-Kombi-Flow benötigt die Flow-Version 0.4.0');
assert(visibleIds({})[0] === 'search_goal', 'Der Ablauf muss mit der Produktart beginnen');
assert(byId.has('search_goal'), 'Die Produktart muss auswählbar sein, damit nicht abgedeckte Arten offen abgesagt werden können');
const suchziele = (byId.get('search_goal')?.options ?? []).map((option) => option.value);
assert(suchziele.includes('first_combo_from_birth'), 'Der abgedeckte Fall Kombi-Kinderwagen ab Geburt muss auswählbar sein');
assert(suchziele.length >= 4, `Nicht abgedeckte Arten müssen auswählbar sein, gefunden: ${suchziele.length}`);
assert(!visibleIds({ daily_context: ['regular_car'] }).includes('lift_unit'), 'Trageeinheit darf ohne Tragekontext nicht erscheinen');
assert(visibleIds({ daily_context: ['regular_carrying'] }).includes('lift_unit'), 'Trageeinheit muss nur bei regelmäßigem Tragen erscheinen');

const baseAnswers = {
  search_goal: 'first_combo_from_birth',
  daily_context: ['regular_car'],
  terrain: ['mixed'],
  budget: 900,
  top_priorities: ['easy_folding', 'storage']
};
// Fünf Fragen im Standardpfad, sechs mit der Tragefrage. Diese Zahlen müssen mit
// den Aufwandsangaben auf den Einstiegsseiten übereinstimmen.
assert(visibleIds(baseAnswers).length === 5, `Der Standardpfad muss genau fünf Fragen enthalten, gezählt: ${visibleIds(baseAnswers).length}`);
const tragepfad = visibleIds({ ...baseAnswers, daily_context: ['regular_carrying'], lift_unit: 'frame_with_seat' });
assert(tragepfad.length === 6, `Der Tragepfad muss genau eine Zusatzfrage enthalten, gezählt: ${tragepfad.length}`);
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

console.log('Fragefluss-Test bestanden: Produktart zuerst, fuenf Fragen im Standardpfad, sechs mit Tragefrage, Auswahlgrenzen geprueft.');
