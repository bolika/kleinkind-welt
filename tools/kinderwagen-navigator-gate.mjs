#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const errors = [];

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
  } catch (error) {
    errors.push(`${name}: ungültiges oder fehlendes JSON (${error.message})`);
    return {};
  }
}

function duplicateIds(items, label) {
  const seen = new Set();
  for (const item of items) {
    if (!item?.id) {
      errors.push(`${label}: Eintrag ohne id`);
      continue;
    }
    if (seen.has(item.id)) errors.push(`${label}: doppelte id ${item.id}`);
    seen.add(item.id);
  }
  return seen;
}

function collectCriterionReferences(value, target = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectCriterionReferences(item, target));
    return target;
  }
  if (!value || typeof value !== 'object') return target;
  if (typeof value.criterionId === 'string') target.add(value.criterionId);
  if (Array.isArray(value.criteriaIds)) value.criteriaIds.forEach((id) => target.add(id));
  Object.values(value).forEach((item) => collectCriterionReferences(item, target));
  return target;
}

function isAnswered(answers, id) {
  return Object.prototype.hasOwnProperty.call(answers, id) && answers[id] !== null && answers[id] !== '';
}

function isVisible(question, answers) {
  const condition = question.showWhen;
  if (!condition) return true;
  if (condition.operator === 'any_answered') {
    return (condition.questionIds ?? []).some((id) => isAnswered(answers, id));
  }
  const answer = answers[condition.questionId];
  if (condition.operator === 'answered') return isAnswered(answers, condition.questionId);
  if (condition.operator === 'equals') return answer === condition.value;
  if (condition.operator === 'in') return (condition.value ?? []).includes(answer);
  return false;
}

function validateAnswer(question, answer, profileId) {
  const prefix = `Profil ${profileId}, Frage ${question.id}`;
  if (['single_choice', 'confirmation'].includes(question.type)) {
    const values = (question.options ?? []).map((option) => option.value);
    if (!values.includes(answer)) errors.push(`${prefix}: unbekannte Antwort ${JSON.stringify(answer)}`);
  }
  if (question.type === 'multi_choice') {
    if (!Array.isArray(answer)) {
      errors.push(`${prefix}: Antwort muss eine Liste sein`);
      return;
    }
    const values = new Set((question.options ?? []).map((option) => option.value));
    for (const item of answer) if (!values.has(item)) errors.push(`${prefix}: unbekannte Auswahl ${item}`);
    const min = question.validation?.minimumSelections ?? 0;
    const max = question.validation?.maximumSelections ?? Infinity;
    if (answer.length < min || answer.length > max) errors.push(`${prefix}: ${answer.length} Auswahlen, erwartet ${min} bis ${max}`);
  }
  if (['number', 'budget'].includes(question.type)) {
    if (typeof answer !== 'number') {
      errors.push(`${prefix}: Antwort muss eine Zahl sein`);
      return;
    }
    const { minimum = -Infinity, maximum = Infinity } = question.validation ?? {};
    if (answer < minimum || answer > maximum) errors.push(`${prefix}: Wert ${answer} außerhalb ${minimum} bis ${maximum}`);
  }
  if (question.type === 'number_list') {
    if (!Array.isArray(answer)) {
      errors.push(`${prefix}: Antwort muss eine Zahlenliste sein`);
      return;
    }
    const { minimum = -Infinity, maximum = Infinity, maximumEntries = Infinity } = question.validation ?? {};
    if (answer.length > maximumEntries) errors.push(`${prefix}: zu viele Werte`);
    answer.forEach((value) => {
      if (typeof value !== 'number' || value < minimum || value > maximum) errors.push(`${prefix}: ungültiger Wert ${value}`);
    });
  }
  if (question.type === 'dimensions') {
    const fields = question.validation?.fields ?? [];
    const { minimum = -Infinity, maximum = Infinity } = question.validation ?? {};
    if (!answer || typeof answer !== 'object' || Array.isArray(answer)) {
      errors.push(`${prefix}: Maße müssen ein Objekt sein`);
      return;
    }
    for (const field of fields) {
      const value = answer[field];
      if (typeof value !== 'number' || value < minimum || value > maximum) errors.push(`${prefix}: ungültiges Maß ${field}`);
    }
  }
}

const criteriaData = load('criteria.v0.1.json');
const questionsData = load('questions.v0.1.json');
const profilesData = load('reference-profiles.v0.1.json');

const versions = [criteriaData.modelVersion, questionsData.modelVersion, profilesData.modelVersion];
if (new Set(versions).size !== 1 || versions.some((version) => !version)) {
  errors.push(`Model-Versionen stimmen nicht überein: ${versions.join(', ')}`);
}

const criteria = criteriaData.criteria ?? [];
const criterionIds = duplicateIds(criteria, 'Kriterien');
const allowedKinds = new Set(['gate', 'preference', 'information']);
for (const criterion of criteria) {
  if (!allowedKinds.has(criterion.kind)) errors.push(`Kriterium ${criterion.id}: ungültige Art ${criterion.kind}`);
  if (!criterion.label || !criterion.dimension || !criterion.evaluation || !criterion.explanation) {
    errors.push(`Kriterium ${criterion.id}: unvollständige redaktionelle Erklärung`);
  }
  if (!Array.isArray(criterion.productFields) || !criterion.productFields.length) errors.push(`Kriterium ${criterion.id}: keine Produktfelder`);
  if (!Array.isArray(criterion.sourceRequirement) || !criterion.sourceRequirement.length) errors.push(`Kriterium ${criterion.id}: keine Quellenanforderung`);
  if (!criterion.missingPolicy) errors.push(`Kriterium ${criterion.id}: keine Missing-Data-Regel`);
  if (criterion.kind === 'gate' && criterion.baseWeight !== 0) errors.push(`Kriterium ${criterion.id}: Gate darf kein Score-Gewicht haben`);
  if (criterion.kind === 'preference' && !(criterion.baseWeight > 0)) errors.push(`Kriterium ${criterion.id}: Präferenz benötigt positives Gewicht`);
  if (criterion.kind === 'information' && criterion.baseWeight !== 0) errors.push(`Kriterium ${criterion.id}: Information darf den Score nicht verändern`);
}

const scoreRules = criteriaData.scoreRules ?? {};
if (!scoreRules.eligibilityBeforeScoring) errors.push('Score-Regel: Eligibility muss vor dem Scoring stehen');
if (scoreRules.minimumCoverageForNumericScore < 80) errors.push('Score-Regel: Datenabdeckung für einen numerischen Score ist zu niedrig');
if (!scoreRules.unknownHardCriterionBlocksTopResult) errors.push('Score-Regel: unbekannte Muss-Kriterien müssen Top-Ergebnisse blockieren');
if (!criteriaData.qualityPromise?.notAClaim) errors.push('Qualitätsversprechen benötigt eine klare Abgrenzung');

const questions = questionsData.questions ?? [];
const questionIds = duplicateIds(questions, 'Fragen');
const questionById = new Map(questions.map((question) => [question.id, question]));
const orders = new Set();
for (const question of questions) {
  if (!Number.isInteger(question.order) || orders.has(question.order)) errors.push(`Frage ${question.id}: ungültige oder doppelte Reihenfolge`);
  orders.add(question.order);
  if (!question.prompt || typeof question.required !== 'boolean') errors.push(`Frage ${question.id}: Prompt oder Pflichtstatus fehlt`);
  if (question.showWhen?.questionId) {
    const dependency = questionById.get(question.showWhen.questionId);
    if (!dependency) errors.push(`Frage ${question.id}: unbekannte Abhängigkeit ${question.showWhen.questionId}`);
    else if (dependency.order >= question.order) errors.push(`Frage ${question.id}: Abhängigkeit muss früher stehen`);
  }
  for (const dependencyId of question.showWhen?.questionIds ?? []) {
    const dependency = questionById.get(dependencyId);
    if (!dependency) errors.push(`Frage ${question.id}: unbekannte Abhängigkeit ${dependencyId}`);
    else if (dependency.order >= question.order) errors.push(`Frage ${question.id}: Abhängigkeit ${dependencyId} muss früher stehen`);
  }
}

for (const criterionId of collectCriterionReferences(questionsData)) {
  if (!criterionIds.has(criterionId)) errors.push(`Fragenbaum verweist auf unbekanntes Kriterium ${criterionId}`);
}

const profiles = profilesData.profiles ?? [];
duplicateIds(profiles, 'Referenzprofile');
if (profiles.length < 10) errors.push(`Es werden mindestens 10 Referenzprofile benötigt, gefunden: ${profiles.length}`);

for (const profile of profiles) {
  const answers = profile.answers ?? {};
  for (const [questionId, answer] of Object.entries(answers)) {
    const question = questionById.get(questionId);
    if (!question) {
      errors.push(`Profil ${profile.id}: Antwort für unbekannte Frage ${questionId}`);
      continue;
    }
    validateAnswer(question, answer, profile.id);
  }

  const expectedRoute = profile.expected?.route;
  if (!expectedRoute) errors.push(`Profil ${profile.id}: erwartete Route fehlt`);
  if (expectedRoute === 'supported') {
    for (const question of questions) {
      if (question.required && isVisible(question, answers) && !isAnswered(answers, question.id)) {
        errors.push(`Profil ${profile.id}: sichtbare Pflichtfrage ${question.id} ist unbeantwortet`);
      }
    }
  }

  for (const criterionId of [...(profile.expected?.mustUseGates ?? []), ...(profile.expected?.dominantCriteria ?? [])]) {
    if (!criterionIds.has(criterionId)) errors.push(`Profil ${profile.id}: unbekanntes erwartetes Kriterium ${criterionId}`);
  }
  for (const criterionId of profile.expected?.mustUseGates ?? []) {
    const criterion = criteria.find((item) => item.id === criterionId);
    if (criterion && criterion.kind !== 'gate') errors.push(`Profil ${profile.id}: ${criterionId} ist kein Gate`);
  }
  if (!Array.isArray(profile.expected?.mustExplain) || profile.expected.mustExplain.length < 2) {
    errors.push(`Profil ${profile.id}: zu wenige erwartete Erklärungen`);
  }
  if (!Array.isArray(profile.expected?.requiredOpenChecks)) errors.push(`Profil ${profile.id}: offene Prüfungen fehlen`);
  if (!profile.expected?.resultPolicy) errors.push(`Profil ${profile.id}: Ergebnisregel fehlt`);
}

const counts = criteria.reduce((result, criterion) => {
  result[criterion.kind] = (result[criterion.kind] ?? 0) + 1;
  return result;
}, {});

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(
  `Kinderwagen-Navigator-Gate bestanden: ${criteria.length} Kriterien ` +
  `(${counts.gate ?? 0} Gates, ${counts.preference ?? 0} Präferenzen, ${counts.information ?? 0} Informationen), ` +
  `${questions.length} adaptive Fragen und ${profiles.length} Referenzprofile geprüft.`
);
