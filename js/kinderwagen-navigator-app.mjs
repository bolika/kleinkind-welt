import { matchStrollers } from '/js/kinderwagen-matcher.mjs';
import { getVisibleQuestions, hasAnswerValue, matchesQuestionCondition, validateQuestionValue } from '/js/kinderwagen-question-flow.mjs';

const DATA_ROOT = '/data/kinderwagen-navigator';
const app = document.querySelector('[data-navigator-app]');
const heroStart = document.querySelector('[data-navigator-hero-start]');

const state = {
  answers: {},
  skipped: new Set(),
  questions: [],
  criteriaData: null,
  products: [],
  currentQuestionId: null,
  started: false,
  ready: false,
  pendingStart: false
};

const marketLabels = {
  current_available: 'Beim Hersteller verfügbar',
  current_color_dependent: 'Verfügbarkeit hängt von der Variante ab',
  current_temporarily_unavailable_manufacturer: 'Beim Hersteller vorübergehend nicht verfügbar',
  current_retailer_only: 'Aktuell über Händler erhältlich',
  discontinued: 'Eingestellt',
  retired: 'Nicht mehr im Katalog',
  unknown: 'Verfügbarkeit vor Kauf prüfen'
};

function track(action, props = {}) {
  if (!window.plausible) return;
  window.plausible('Kinderwagen-Navigator', {
    props: {
      aktion: action,
      version: state.criteriaData?.modelVersion ?? '0.1.0',
      device: window.innerWidth <= 640 ? 'mobile' : 'desktop',
      ...props
    }
  });
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function optionLabel(question, value) {
  if (Array.isArray(value)) return value.map((item) => optionLabel(question, item)).join(', ');
  return question.options?.find((option) => option.value === value)?.label ?? String(value ?? '');
}

function hasAnswer(questionId) {
  return hasAnswerValue(state.answers, questionId);
}

function matchesCondition(condition) {
  return matchesQuestionCondition(condition, state.answers);
}

function visibleQuestions() {
  return getVisibleQuestions(state.questions, state.answers);
}

function pruneHiddenAnswers() {
  let changed = true;
  while (changed) {
    changed = false;
    for (const question of state.questions) {
      if (!question.showWhen || matchesCondition(question.showWhen)) continue;
      if (hasAnswer(question.id) || state.skipped.has(question.id)) {
        delete state.answers[question.id];
        state.skipped.delete(question.id);
        changed = true;
      }
    }
  }
}

function progressFor(question) {
  const visible = visibleQuestions();
  const index = Math.max(0, visible.findIndex((item) => item.id === question.id));
  return { index, total: visible.length, percent: Math.round(((index + 1) / visible.length) * 100) };
}

function renderProgress(question) {
  const progress = progressFor(question);
  const wrap = element('div', 'navigator-app-progress');
  const labels = element('div', 'navigator-app-progress__labels');
  labels.append(element('span', '', `Frage ${progress.index + 1} von derzeit ${progress.total}`), element('span', '', `${progress.percent}%`));
  const bar = element('div', 'navigator-app-progress__bar');
  const fill = element('span');
  fill.style.width = `${progress.percent}%`;
  bar.append(fill);
  wrap.append(labels, bar);
  return wrap;
}

function choiceControl(question, multi = false) {
  const group = element('div', `navigator-choice-grid${multi ? ' is-multi' : ''}`);
  const selected = state.answers[question.id];
  for (const option of question.options) {
    const label = element('label', 'navigator-choice');
    const input = document.createElement('input');
    input.type = multi ? 'checkbox' : 'radio';
    input.name = question.id;
    input.value = option.value;
    input.checked = multi ? (selected ?? []).includes(option.value) : selected === option.value;
    const marker = element('span', 'navigator-choice__marker');
    const copy = element('span', 'navigator-choice__copy', option.label);
    label.append(input, marker, copy);
    group.append(label);
  }
  return group;
}

function numberControl(question, idSuffix = '', value = '') {
  const wrap = element('label', 'navigator-number');
  const input = document.createElement('input');
  input.type = 'number';
  input.name = `${question.id}${idSuffix}`;
  input.inputMode = 'decimal';
  input.min = question.validation?.minimum ?? '';
  input.max = question.validation?.maximum ?? '';
  input.step = question.validation?.step ?? 1;
  input.value = value ?? '';
  input.setAttribute('aria-label', question.prompt);
  const unit = element('span', 'navigator-number__unit', question.validation?.currency === 'EUR' ? '€' : question.validation?.unit ?? '');
  wrap.append(input, unit);
  return wrap;
}

function dimensionsControl(question) {
  const wrap = element('div', 'navigator-dimensions');
  const existing = state.answers[question.id] ?? {};
  const labels = { width: 'Breite', height: 'Höhe', depth: 'Tiefe' };
  for (const field of question.validation.fields) {
    const item = element('label', 'navigator-dimension');
    item.append(element('span', '', labels[field]));
    const input = document.createElement('input');
    input.type = 'number';
    input.name = `${question.id}.${field}`;
    input.inputMode = 'decimal';
    input.min = question.validation.minimum;
    input.max = question.validation.maximum;
    input.step = question.validation.step;
    input.value = existing[field] ?? '';
    item.append(input, element('small', '', 'cm'));
    wrap.append(item);
  }
  return wrap;
}

function numberListControl(question) {
  const wrap = element('div', 'navigator-height-list');
  const values = state.answers[question.id]?.length ? state.answers[question.id] : ['', ''];
  const count = Math.min(Math.max(values.length, 2), question.validation.maximumEntries);
  for (let index = 0; index < count; index += 1) {
    const item = element('label', 'navigator-dimension');
    item.append(element('span', '', `${index + 1}. Person`));
    const input = document.createElement('input');
    input.type = 'number';
    input.name = `${question.id}.${index}`;
    input.inputMode = 'numeric';
    input.min = question.validation.minimum;
    input.max = question.validation.maximum;
    input.step = 1;
    input.value = values[index] ?? '';
    item.append(input, element('small', '', 'cm'));
    wrap.append(item);
  }
  if (count < question.validation.maximumEntries) {
    const add = element('button', 'navigator-text-button', '+ weitere Person');
    add.type = 'button';
    add.addEventListener('click', () => {
      const current = collectNumberList(question);
      state.answers[question.id] = [...current, ''];
      renderQuestion(question.id);
    });
    wrap.append(add);
  }
  return wrap;
}

function renderControl(question) {
  if (question.type === 'single_choice' || question.type === 'confirmation') return choiceControl(question);
  if (question.type === 'multi_choice') return choiceControl(question, true);
  if (question.type === 'dimensions') return dimensionsControl(question);
  if (question.type === 'number_list') return numberListControl(question);
  return numberControl(question, '', state.answers[question.id] ?? '');
}

function valuesFromInputs(question) {
  if (question.type === 'single_choice' || question.type === 'confirmation') {
    return app.querySelector(`input[name="${question.id}"]:checked`)?.value;
  }
  if (question.type === 'multi_choice') {
    return [...app.querySelectorAll(`input[name="${question.id}"]:checked`)].map((input) => input.value);
  }
  if (question.type === 'dimensions') {
    return Object.fromEntries(question.validation.fields.map((field) => {
      const value = app.querySelector(`input[name="${question.id}.${field}"]`)?.value;
      return [field, value === '' ? null : Number(value)];
    }));
  }
  if (question.type === 'number_list') return collectNumberList(question);
  const raw = app.querySelector(`input[name="${question.id}"]`)?.value;
  return raw === '' || raw === undefined ? undefined : Number(raw);
}

function collectNumberList(question) {
  return [...app.querySelectorAll(`input[name^="${question.id}."]`)]
    .map((input) => input.value === '' ? null : Number(input.value))
    .filter((value) => value !== null);
}

function validate(question, value) {
  return validateQuestionValue(question, value);
}

function immediateRoute(question, value) {
  if (question.id === 'search_goal') return question.options.find((option) => option.value === value)?.route;
  if (question.id === 'children_count' && value === 'more_than_one') return 'unsupported_siblings';
  return null;
}

function nextQuestionId(currentId) {
  const visible = visibleQuestions();
  const index = visible.findIndex((question) => question.id === currentId);
  return visible[index + 1]?.id ?? null;
}

function previousQuestionId(currentId) {
  const visible = visibleQuestions();
  const index = visible.findIndex((question) => question.id === currentId);
  return index > 0 ? visible[index - 1].id : null;
}

function showError(message) {
  const error = app.querySelector('[data-question-error]');
  if (!error) return;
  error.textContent = message;
  error.hidden = false;
}

function saveAndContinue(question, skip = false) {
  const value = skip ? undefined : valuesFromInputs(question);
  const error = skip ? null : validate(question, value);
  if (error) {
    showError(error);
    return;
  }
  if (skip) {
    delete state.answers[question.id];
    state.skipped.add(question.id);
  } else {
    state.answers[question.id] = value;
    state.skipped.delete(question.id);
  }
  pruneHiddenAnswers();
  track('frage_beantwortet', { frage: question.id, typ: question.type });

  const route = immediateRoute(question, value);
  if (route && route !== 'supported') {
    renderUnsupported(route);
    return;
  }
  const nextId = nextQuestionId(question.id);
  if (nextId) renderQuestion(nextId);
  else renderSummary();
}

function renderQuestion(questionId) {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) return;
  state.currentQuestionId = questionId;
  const card = element('div', 'navigator-app-card navigator-question-card');
  card.append(renderProgress(question));
  const kicker = element('span', 'navigator-card-kicker', question.required ? 'Für das Matching erforderlich' : 'Optional – verbessert die Passung');
  const title = element('h2', '', question.prompt);
  title.id = 'navigator-question-title';
  card.setAttribute('aria-labelledby', title.id);
  card.append(kicker, title);
  if (question.help) card.append(element('p', 'navigator-question-help', question.help));

  const form = element('form', 'navigator-question-form');
  form.append(renderControl(question));
  const error = element('p', 'navigator-question-error');
  error.dataset.questionError = '';
  error.hidden = true;
  form.append(error);

  const actions = element('div', 'navigator-app-actions');
  const previousId = previousQuestionId(question.id);
  if (previousId) {
    const back = element('button', 'navigator-secondary-button', 'Zurück');
    back.type = 'button';
    back.addEventListener('click', () => {
      track('zurueck', { von_frage: question.id });
      renderQuestion(previousId);
    });
    actions.append(back);
  }
  if (!question.required) {
    const skip = element('button', 'navigator-text-button', 'Überspringen');
    skip.type = 'button';
    skip.addEventListener('click', () => saveAndContinue(question, true));
    actions.append(skip);
  }
  const next = element('button', 'navigator-primary-button', nextQuestionId(question.id) ? 'Weiter' : 'Angaben prüfen');
  next.type = 'submit';
  actions.append(next);
  form.append(actions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveAndContinue(question);
  });
  card.append(form);
  app.replaceChildren(card);
  card.querySelector('input')?.focus({ preventScroll: true });
  app.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function answerSummary(question, value) {
  if (question.type === 'dimensions') return `${value.width} × ${value.height} × ${value.depth} cm (B × H × T)`;
  if (question.type === 'number_list') return `${value.join(' cm, ')} cm`;
  if (question.type === 'budget') return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
  if (question.type === 'number') return `${value} ${question.validation?.unit ?? ''}`.trim();
  return optionLabel(question, value);
}

function renderSummary() {
  state.currentQuestionId = null;
  const card = element('div', 'navigator-app-card navigator-summary-card');
  card.append(element('span', 'navigator-card-kicker', 'Fast geschafft'));
  card.append(element('h2', '', 'Prüft eure Angaben'));
  card.append(element('p', 'navigator-question-help', 'Der Navigator nutzt nur diese Angaben. Harte Anforderungen werden vor persönlichen Vorlieben geprüft.'));
  const list = element('dl', 'navigator-answer-summary');
  for (const question of visibleQuestions()) {
    if (!hasAnswer(question.id)) continue;
    const row = element('div');
    row.append(element('dt', '', question.prompt), element('dd', '', answerSummary(question, state.answers[question.id])));
    list.append(row);
  }
  card.append(list);
  const actions = element('div', 'navigator-app-actions');
  const lastQuestion = visibleQuestions().at(-1);
  const back = element('button', 'navigator-secondary-button', 'Zurück');
  back.type = 'button';
  back.addEventListener('click', () => {
    track('zurueck', { von_frage: 'zusammenfassung' });
    renderQuestion(lastQuestion.id);
  });
  const calculate = element('button', 'navigator-primary-button', 'Passung berechnen');
  calculate.type = 'button';
  calculate.addEventListener('click', renderResults);
  actions.append(back, calculate);
  card.append(actions);
  app.replaceChildren(card);
  track('zusammenfassung_angesehen', { fragen: String(Object.keys(state.answers).length) });
  app.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderUnsupported(route) {
  const copy = {
    unsupported_buggy: ['Der Pilot vergleicht noch keine reinen Buggys', 'Damit die Ergebnisse belastbar bleiben, startet Version 0.1 mit Kombi-Kinderwagen ab Geburt.'],
    unsupported_siblings: ['Geschwister- und Zwillingswagen folgen später', 'Diese Wagen brauchen eigene Kriterien für Sitzkombinationen, Breite und Gewichtsverteilung. Wir mischen sie nicht in ein unpassendes Ranking.'],
    scope_help: ['Der Pilot hilft aktuell bei der ersten Geburtskonfiguration', 'Wenn ihr einen Kinderwagen ab Geburt sucht, könnt ihr den unterstützten Weg testen. Für einen reinen Buggy oder Geschwisterwagen folgt ein eigener Vergleich.']
  }[route] ?? ['Dieser Weg ist noch nicht unterstützt', 'Der Pilot beschränkt sich bewusst auf eine belastbar definierte Produktgruppe.'];
  const card = element('div', 'navigator-app-card navigator-route-card');
  card.append(element('span', 'navigator-card-kicker', 'Ehrliche Grenze des Piloten'));
  card.append(element('h2', '', copy[0]), element('p', 'navigator-question-help', copy[1]));
  const restart = element('button', 'navigator-primary-button', 'Zum unterstützten Finder');
  restart.type = 'button';
  restart.addEventListener('click', restartNavigator);
  card.append(restart);
  app.replaceChildren(card);
  track('route_nicht_unterstuetzt', { route });
}

function formatPrice(value) {
  if (typeof value !== 'number') return 'Gesamtpreis noch offen';
  return `Geburtskonfiguration: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value)}`;
}

function resultCard(result, rank, preliminary = false) {
  const card = element('article', `navigator-live-result${preliminary ? ' is-preliminary' : ''}`);
  const header = element('div', 'navigator-live-result__header');
  const heading = element('div');
  heading.append(element('span', 'navigator-card-kicker', preliminary ? 'Noch nicht belastbar genug' : `${rank}. Match`));
  heading.append(element('h3', '', `${result.brand} ${result.model}`));
  const score = element('div', 'navigator-score');
  if (preliminary || result.matchScore === null) {
    score.classList.add('is-data-gap');
    score.append(element('strong', '', `${result.dataCoverage}%`), element('span', '', 'Datenlage'));
  } else {
    score.setAttribute('aria-label', `${result.matchScore} Prozent Passung`);
    score.append(element('strong', '', `${result.matchScore}%`), element('span', '', 'Passung'));
  }
  header.append(heading, score);
  card.append(header);

  const meta = element('div', 'navigator-result-meta');
  meta.append(
    element('span', '', formatPrice(result.priceEur)),
    element('span', '', marketLabels[result.marketStatus] ?? marketLabels.unknown),
    element('span', '', 'Daten-Match · kein eigener Produkttest')
  );
  card.append(meta);

  if (result.priorityConflicts?.length) {
    const warning = element('div', 'navigator-priority-warning');
    warning.append(element('strong', '', 'Eine eurer Top-Prioritäten wird nicht erfüllt'), element('span', '', result.priorityConflicts[0].rationale));
    card.append(warning);
  }

  const list = element('ul', 'navigator-match-list');
  const reasons = result.reasons.length ? result.reasons : result.bestFor.slice(0, 2);
  for (const reason of reasons.slice(0, 3)) list.append(element('li', 'is-match', reason));
  if (result.compromise) list.append(element('li', 'is-compromise', result.compromise));
  card.append(list);

  const proof = element('div', 'navigator-proof-metrics');
  const must = element('div');
  must.append(element('strong', '', `${result.mustCriteria.length}`), element('span', '', 'belegte Muss-Prüfungen'));
  const coverage = element('div');
  coverage.append(element('strong', '', `${result.dataCoverage}%`), element('span', '', 'relevante Datenabdeckung'));
  const sources = element('div');
  sources.append(element('strong', '', `${result.sourceCount}`), element('span', '', 'geprüfte Quellen'));
  proof.append(must, coverage, sources);
  card.append(proof);

  if (result.openChecks.length) {
    const checks = element('div', 'navigator-open-check');
    checks.append(element('strong', '', 'Vor dem Kauf prüfen'));
    const checkList = element('ul');
    result.openChecks.slice(0, 3).forEach((check) => checkList.append(element('li', '', check)));
    checks.append(checkList);
    card.append(checks);
  }

  const details = element('details', 'navigator-source-details');
  details.append(element('summary', '', `Datenbasis und ${result.sourceCount} Quellen`));
  details.append(element('p', '', result.testingDisclosure));
  const sourceList = element('ul');
  result.sources.forEach((source) => {
    const item = element('li');
    const link = element('a', '', source.title);
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.addEventListener('click', () => track('quelle_geoeffnet', { produkt: result.productId, quelle: source.id }));
    item.append(link, document.createTextNode(` · geprüft ${source.checkedAt}`));
    sourceList.append(item);
  });
  details.append(sourceList);
  card.append(details);
  return card;
}

function blockerSummary(excluded) {
  const counts = new Map();
  for (const result of excluded) {
    for (const failure of result.failures) counts.set(failure.text, (counts.get(failure.text) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([text]) => text);
}

function renderResults() {
  const result = matchStrollers({ answers: state.answers, products: state.products, criteriaData: state.criteriaData });
  const wrap = element('div', 'navigator-results');
  const intro = element('div', 'navigator-results__intro');
  intro.append(element('span', 'navigator-card-kicker', 'Euer unabhängiger Passungsnachweis'));
  intro.append(element('h2', '', result.results.length ? `${result.results.length === 1 ? 'Ein belastbares Match' : `${result.results.length} belastbare Matches`}` : 'Noch kein belastbares Match'));
  intro.append(element('p', '', result.results.length
    ? 'Die Reihenfolge entsteht ausschließlich aus euren Anforderungen und der dokumentierten Datenlage – nicht aus Provisionen oder Verfügbarkeit bei Amazon.'
    : 'Wir zeigen lieber ehrlich eine Daten- oder Kataloglücke als ein künstlich passendes Produkt.'));
  wrap.append(intro);

  const cards = element('div', 'navigator-live-results');
  result.results.forEach((item, index) => cards.append(resultCard(item, index + 1)));
  if (!result.results.length && result.preliminary.length) {
    cards.append(resultCard(result.preliminary[0], 1, true));
  }
  wrap.append(cards);

  if (!result.results.length) {
    const blockers = blockerSummary(result.excluded);
    const panel = element('aside', 'navigator-no-match');
    panel.append(element('h3', '', 'Warum gerade kein Match entsteht'));
    const list = element('ul');
    blockers.forEach((blocker) => list.append(element('li', '', blocker)));
    if (!blockers.length) list.append(element('li', '', 'Für relevante Kriterien fehlen noch genug belastbare Daten für einen Prozentwert.'));
    panel.append(list);
    wrap.append(panel);
  }

  const note = element('p', 'navigator-result-disclaimer', 'Der Prozentwert ist eine Passung zu euren Angaben – keine Sicherheits-, Qualitäts- oder Testnote. Produktdaten und Verfügbarkeit vor dem Kauf beim Anbieter prüfen.');
  wrap.append(note);
  const feedback = element('div', 'navigator-feedback');
  feedback.append(element('strong', '', 'War dieses Ergebnis hilfreich?'));
  const feedbackActions = element('div', 'navigator-feedback__actions');
  for (const [value, label] of [['ja', 'Ja'], ['nein', 'Nein']]) {
    const button = element('button', 'navigator-secondary-button', label);
    button.type = 'button';
    button.addEventListener('click', () => {
      track('ergebnis_bewertet', { hilfreich: value, matches: String(result.results.length) });
      feedbackActions.querySelectorAll('button').forEach((item) => { item.disabled = true; });
      feedback.append(element('span', 'navigator-feedback__thanks', 'Danke – das hilft uns, den Pilot zu verbessern.'));
    }, { once: true });
    feedbackActions.append(button);
  }
  feedback.append(feedbackActions);
  wrap.append(feedback);
  const actions = element('div', 'navigator-app-actions');
  const change = element('button', 'navigator-secondary-button', 'Angaben ändern');
  change.type = 'button';
  change.addEventListener('click', () => {
    track('angaben_aendern');
    renderSummary();
  });
  const restart = element('button', 'navigator-primary-button', 'Neu starten');
  restart.type = 'button';
  restart.addEventListener('click', restartNavigator);
  actions.append(change, restart);
  wrap.append(actions);
  app.replaceChildren(wrap);
  track('ergebnis_berechnet', {
    route: result.route,
    matches: String(result.results.length),
    vorlaeufig: String(result.preliminary.length),
    top_produkt: result.results[0]?.productId ?? 'kein_match',
    top_score: result.results[0]?.matchScore ? String(result.results[0].matchScore) : 'kein_score'
  });
  app.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function restartNavigator() {
  state.answers = {};
  state.skipped = new Set();
  state.started = true;
  track('neu_gestartet');
  renderQuestion(state.questions[0].id);
}

function startNavigator(source = 'tool') {
  state.started = true;
  track('gestartet', { einstieg: source });
  renderQuestion(state.questions[0].id);
}

function renderStart() {
  const card = element('div', 'navigator-app-card navigator-start-card');
  const copy = element('div');
  copy.append(element('span', 'navigator-card-kicker', 'Daten-Pilot · 6 aktuelle Modelle'));
  copy.append(element('h2', '', 'Findet heraus, welcher Kinderwagen zu eurem Alltag passt'));
  copy.append(element('p', 'navigator-question-help', 'Ihr beantwortet je nach Alltag etwa 9 bis 15 Fragen. Maße werden nur dann als Ausschlusskriterium genutzt, wenn ihr sie als gemessen bestätigt.'));
  const facts = element('ul', 'navigator-start-facts');
  ['Gesamtpreis inklusive benötigter Babywanne', 'Harte Anforderungen werden zuerst geprüft', 'Offene Daten und Kompromisse bleiben sichtbar'].forEach((fact) => facts.append(element('li', '', fact)));
  copy.append(facts);
  const start = element('button', 'navigator-primary-button navigator-start-button', 'Navigator starten');
  start.type = 'button';
  start.addEventListener('click', () => startNavigator('tool'));
  copy.append(start);
  card.append(copy);
  app.replaceChildren(card);
}

async function loadData() {
  const [questionsData, criteriaData, catalog] = await Promise.all([
    fetch(`${DATA_ROOT}/questions.v0.1.json`).then((response) => response.json()),
    fetch(`${DATA_ROOT}/criteria.v0.1.json`).then((response) => response.json()),
    fetch(`${DATA_ROOT}/catalog.v0.1.json`).then((response) => response.json())
  ]);
  const products = await Promise.all(catalog.products.map((filename) => fetch(`${DATA_ROOT}/products/${filename}`).then((response) => response.json())));
  state.questions = questionsData.questions.sort((a, b) => a.order - b.order);
  state.criteriaData = criteriaData;
  state.products = products;
  state.ready = true;
  if (state.pendingStart) startNavigator('hero');
  else renderStart();
}

if (app) {
  heroStart?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.ready) startNavigator('hero');
    else state.pendingStart = true;
    app.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  loadData().catch(() => {
    const error = element('div', 'navigator-app-card navigator-route-card');
    error.append(element('h2', '', 'Der Daten-Pilot konnte nicht geladen werden'));
    error.append(element('p', 'navigator-question-help', 'Bitte ladet die Seite neu. Falls das Problem bleibt, ist der Navigator vorübergehend nicht verfügbar.'));
    app.replaceChildren(error);
  });
}
