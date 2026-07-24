import { compromiseOptions, matchStrollers } from '/js/kinderwagen-matcher.mjs?v=20260723-ux-audit';
import { getVisibleQuestions, hasAnswerValue, matchesQuestionCondition, validateQuestionValue } from '/js/kinderwagen-question-flow.mjs?v=20260723-3';
import { isFreshDate, offersForProduct, trackingLink } from '/js/kinderwagen-offers.mjs?v=20260723-images';
import { resultBadge } from '/js/kinderwagen-result-presentation.mjs?v=20260723-ux-audit';

const DATA_ROOT = '/data/kinderwagen-navigator';
const BETA_SEARCH_GOAL = 'first_combo_from_birth';
const app = document.querySelector('[data-navigator-app]');
const affiliateDisclosure = document.querySelector('[data-navigator-affiliate-disclosure]');
const loadStartedAt = performance.now();
let mobileQuestionActionObserver = null;

function preferredScrollBehavior() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function resetMobileQuestionAction() {
  mobileQuestionActionObserver?.disconnect();
  mobileQuestionActionObserver = null;
}

function observeMobileQuestionAction(card, action) {
  resetMobileQuestionAction();
  if (!('IntersectionObserver' in window)) {
    action.classList.add('is-mobile-action-visible');
    return;
  }
  mobileQuestionActionObserver = new IntersectionObserver(([entry]) => {
    action.classList.toggle('is-mobile-action-visible', entry.isIntersecting);
  }, { threshold: 0 });
  mobileQuestionActionObserver.observe(card);
}

const state = {
  answers: { search_goal: BETA_SEARCH_GOAL },
  skipped: new Set(),
  questions: [],
  flowVersion: '0.3.0',
  criteriaData: null,
  products: [],
  offers: [],
  mediaAssets: [],
  currentQuestionId: null,
  started: false,
  ready: false,
  acceptedCompromises: []
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
      flow_version: state.flowVersion,
      device: window.innerWidth <= 640 ? 'mobile' : 'desktop',
      ...props
    }
  });
}

function loadTimeBucket(milliseconds) {
  if (milliseconds < 1000) return 'unter_1s';
  if (milliseconds < 2000) return '1_bis_2s';
  if (milliseconds < 4000) return '2_bis_4s';
  return 'ueber_4s';
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
  const coreQuestionIds = new Set(['daily_context', 'terrain', 'budget', 'top_priorities']);
  const sequence = state.questions.filter((item) => {
    if (coreQuestionIds.has(item.id)) return true;
    return item.id === 'lift_unit' && matchesCondition(item.showWhen);
  });
  const index = Math.max(0, sequence.findIndex((item) => item.id === question.id));
  return { index, total: sequence.length, percent: Math.round(((index + 1) / sequence.length) * 100) };
}

function renderProgress(question) {
  const progress = progressFor(question);
  const wrap = element('div', 'navigator-app-progress');
  const labels = element('div', 'navigator-app-progress__labels');
  labels.append(element('span', '', `Frage ${progress.index + 1} von ${progress.total}`), element('span', '', `${progress.percent}%`));
  const bar = element('div', 'navigator-app-progress__bar');
  const fill = element('span');
  fill.style.width = `${progress.percent}%`;
  bar.append(fill);
  wrap.append(labels, bar);
  return wrap;
}

function choiceControl(question, multi = false) {
  const wrap = element('div', 'navigator-choice-control');
  const group = element('fieldset', `navigator-choice-grid${multi ? ' is-multi' : ''}`);
  group.append(element('legend', 'visually-hidden', question.prompt));
  const selected = state.answers[question.id];
  for (const option of question.options) {
    const label = element('label', 'navigator-choice');
    if (option.visual) label.classList.add('has-visual');
    const input = document.createElement('input');
    input.type = multi ? 'checkbox' : 'radio';
    input.name = question.id;
    input.value = option.value;
    input.checked = multi ? (selected ?? []).includes(option.value) : selected === option.value;
    const marker = element('span', 'navigator-choice__marker');
    const copy = element('span', 'navigator-choice__copy', option.label);
    label.append(input);
    if (option.visual) {
      const visual = element('span', `navigator-choice__visual is-${option.visual}`);
      visual.setAttribute('aria-hidden', 'true');
      label.append(visual);
    }
    label.append(marker, copy);
    group.append(label);
  }
  wrap.append(group);
  if (multi) {
    const status = element('p', 'navigator-selection-status');
    status.setAttribute('aria-live', 'polite');
    const updateLimit = () => {
      const inputs = [...group.querySelectorAll('input')];
      const count = inputs.filter((input) => input.checked).length;
      const min = question.validation?.minimumSelections ?? 0;
      const max = question.validation?.maximumSelections ?? Infinity;
      inputs.forEach((input) => { input.disabled = Number.isFinite(max) && count >= max && !input.checked; });
      if (Number.isFinite(max) && count >= max) {
        status.textContent = `${count} ausgewählt · Maximum erreicht. Zum Ändern zuerst eine Auswahl entfernen.`;
      } else if (min && Number.isFinite(max)) {
        status.textContent = `${count} ausgewählt · mindestens ${min}, höchstens ${max}`;
      } else if (Number.isFinite(max)) {
        status.textContent = `${count} ausgewählt · höchstens ${max}`;
      } else {
        status.textContent = `${count} ausgewählt`;
      }
    };
    group.addEventListener('change', (event) => {
      const changed = event.target;
      const exclusive = question.validation?.exclusiveOptions ?? [];
      if (changed.checked && exclusive.includes(changed.value)) {
        group.querySelectorAll('input').forEach((input) => { if (input !== changed) input.checked = false; });
      } else if (changed.checked) {
        group.querySelectorAll('input').forEach((input) => {
          if (exclusive.includes(input.value)) input.checked = false;
        });
        for (const exclusiveGroup of question.validation?.exclusiveGroups ?? []) {
          if (!exclusiveGroup.includes(changed.value)) continue;
          group.querySelectorAll('input').forEach((input) => {
            if (input !== changed && exclusiveGroup.includes(input.value)) input.checked = false;
          });
        }
      }
      updateLimit();
    });
    updateLimit();
    wrap.append(status);
  }
  return wrap;
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

function productPrice(product) {
  const item = product.facts?.requiredConfigurationPriceEur;
  if (!item || typeof item.value !== 'number' || ['unknown', 'stale'].includes(item.status)) return null;
  return item.value;
}

function budgetControl(question) {
  const wrap = element('div', 'navigator-budget-control');
  const value = state.answers[question.id] ?? question.validation.suggested ?? question.validation.minimum;
  const valueRow = element('div', 'navigator-budget-value');
  valueRow.append(element('span', '', 'Gesamtbudget'), element('output', '', `${Math.round(value)} €`));
  const input = document.createElement('input');
  input.type = 'range';
  input.name = question.id;
  input.min = question.validation.minimum;
  input.max = question.validation.maximum;
  input.step = question.validation.step ?? 50;
  input.value = value;
  input.setAttribute('aria-label', question.prompt);
  const scale = element('div', 'navigator-budget-scale');
  scale.append(element('span', '', `${question.validation.minimum} €`), element('span', '', `${question.validation.maximum} €`));
  const feedback = element('div', 'navigator-budget-feedback');
  feedback.setAttribute('aria-live', 'polite');
  const update = () => {
    const budget = Number(input.value);
    valueRow.querySelector('output').textContent = `${budget.toLocaleString('de-DE')} €`;
    input.setAttribute('aria-valuetext', `${budget.toLocaleString('de-DE')} Euro Gesamtbudget`);
    const prices = state.products.map(productPrice).filter((price) => price !== null).sort((a, b) => a - b);
    const within = prices.filter((price) => price <= budget).length;
    const unknown = state.products.length - prices.length;
    const next = prices.find((price) => price > budget);
    feedback.replaceChildren();
    feedback.append(element('strong', '', `${within} von ${prices.length} Modellen mit bekanntem Gesamtpreis liegen innerhalb.`));
    const nextStep = next ? Math.ceil(next / Number(question.validation.step ?? 50)) * Number(question.validation.step ?? 50) : null;
    const detail = nextStep
      ? ` Ab ${nextStep.toLocaleString('de-DE')} € käme mindestens eine weitere dokumentierte Option hinzu.`
      : ' Alle Modelle mit bekanntem Gesamtpreis sind im Rahmen.';
    feedback.append(element('span', '', `${detail}${unknown ? ` Bei ${unknown} Modell ist der Gesamtpreis noch offen.` : ''}`));
  };
  input.addEventListener('input', update);
  update();
  const modes = element('fieldset', 'navigator-budget-modes');
  modes.append(element('legend', '', 'Wie verbindlich ist das Budget?'));
  const selectedMode = state.answers.budget_strictness ?? question.defaultBudgetMode ?? 'strict';
  for (const mode of question.budgetModes ?? []) {
    const label = element('label', 'navigator-budget-mode');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = `${question.id}_mode`;
    radio.value = mode.value;
    radio.checked = selectedMode === mode.value;
    label.append(radio, element('span', '', mode.label));
    modes.append(label);
  }
  wrap.append(valueRow, input, scale, feedback, modes);
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
  if (question.type === 'budget') return budgetControl(question);
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
  if (!state.started) {
    state.started = true;
    track('gestartet', { einstieg: 'erste_gueltige_antwort' });
  }
  if (skip) {
    delete state.answers[question.id];
    state.skipped.add(question.id);
  } else {
    state.answers[question.id] = value;
    if (question.type === 'budget') {
      state.answers.budget_strictness = app.querySelector(`input[name="${question.id}_mode"]:checked`)?.value ?? question.defaultBudgetMode ?? 'strict';
    }
    state.skipped.delete(question.id);
  }
  pruneHiddenAnswers();
  track('frage_beantwortet', { frage: question.id, typ: question.type });
  if (question.id === 'budget') {
    const knownPrices = state.products.map(productPrice).filter((price) => price !== null);
    track('budget_gewaehlt', {
      budget_stufe: value < 600 ? 'unter_600' : value < 900 ? '600_bis_899' : value < 1200 ? '900_bis_1199' : 'ab_1200',
      budget_modus: state.answers.budget_strictness,
      modelle_im_budget: String(knownPrices.filter((price) => price <= value).length)
    });
  }

  const route = immediateRoute(question, value);
  if (route && route !== 'supported') {
    renderUnsupported(route);
    return;
  }
  const nextId = nextQuestionId(question.id);
  if (nextId) renderQuestion(nextId);
  else renderResults();
}

function renderQuestion(questionId, options = {}) {
  const question = state.questions.find((item) => item.id === questionId);
  if (!question) return;
  const shouldScroll = options.scroll !== false;
  const shouldFocus = options.focus !== false;
  state.currentQuestionId = questionId;
  const progress = progressFor(question);
  track('frage_angezeigt', { frage: question.id, position: String(progress.index + 1), fragen_gesamt: String(progress.total) });
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
  error.id = 'navigator-question-error';
  error.dataset.questionError = '';
  error.setAttribute('role', 'alert');
  error.setAttribute('aria-live', 'assertive');
  error.setAttribute('aria-atomic', 'true');
  error.hidden = true;
  form.setAttribute('aria-describedby', error.id);
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
  const next = element('button', 'navigator-primary-button', question.id === 'top_priorities' ? 'Ergebnis anzeigen' : 'Weiter');
  next.type = 'submit';
  next.dataset.mobileFixedAction = '';
  actions.append(next);
  form.append(actions);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveAndContinue(question);
  });
  card.append(form);
  app.replaceChildren(card);
  observeMobileQuestionAction(card, next);
  if (shouldFocus) {
    title.tabIndex = -1;
    title.focus({ preventScroll: true });
  }
  if (shouldScroll) app.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
}

function answerSummary(question, value) {
  if (question.type === 'number_list') return `${value.join(' cm, ')} cm`;
  if (question.type === 'budget') {
    const budget = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
    return `${budget} · ${state.answers.budget_strictness === 'orientation' ? 'als Orientierung' : 'feste Obergrenze'}`;
  }
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
  app.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
}

function renderUnsupported(route) {
  resetMobileQuestionAction();
  const copy = {
    unsupported_buggy: ['Der Pilot vergleicht noch keine reinen Buggys', 'Damit die Ergebnisse belastbar bleiben, startet Version 0.1 mit Kombi-Kinderwagen ab Geburt.'],
    unsupported_travel_buggy: ['Reisebuggys sind jetzt als eigenes Segment erfasst', 'Für ein belastbares Reisebuggy-Ranking brauchen wir eigene Daten zu Gewicht, Handgepäckmaßen, Faltmechanik und Reisealltag. Eure Auswahl wird als Nachfrage gemessen und nicht mit Kombi-Kinderwagen vermischt.'],
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

function offerAvailability(offer) {
  if (!isFreshDate(offer.availability?.freshUntil)) return 'Verfügbarkeit beim Händler prüfen';
  return {
    in_stock: 'Online verfügbar',
    preorder: 'Vorbestellbar',
    unknown: 'Verfügbarkeit prüfen'
  }[offer.availability?.status] ?? 'Verfügbarkeit prüfen';
}

function offerPrice(offer) {
  if (!isFreshDate(offer.price?.freshUntil) || typeof offer.price?.amount !== 'number') return 'Aktuellen Preis prüfen';
  const format = (amount) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  if (typeof offer.price.shippingAmount !== 'number') return `${format(offer.price.amount)} · Versand prüfen`;
  const total = offer.price.amount + offer.price.shippingAmount;
  return offer.price.shippingAmount > 0
    ? `${format(total)} gesamt inkl. Versand`
    : `${format(total)} inkl. Versand`;
}

function offerSection(result, rank) {
  const offers = offersForProduct(state.offers, result.productId).slice(0, 3);
  if (!offers.length) return null;
  const section = element('section', 'navigator-offers');
  section.setAttribute('aria-label', `Händlerangebote für ${result.brand} ${result.model}`);
  const heading = element('div', 'navigator-offers__heading');
  heading.append(element('strong', '', offers.length === 1 ? 'Passendes Händlerangebot' : `${offers.length} passende Händlerangebote`));
  heading.append(element('span', '', 'Affiliate-Links · ohne Einfluss auf den Match-Score'));
  section.append(heading);

  const list = element('div', 'navigator-offer-list');
  for (const offer of offers) {
    const placement = `navigator_result_${rank}`;
    const row = element('div', 'navigator-offer');
    row.dataset.offerImpression = '';
    row.dataset.offerId = offer.offerId;
    row.dataset.productId = result.productId;
    row.dataset.merchant = offer.merchant.name;
    row.dataset.resultRank = String(rank);
    row.dataset.matchScore = String(result.matchScore ?? 'kein_score');
    const copy = element('div', 'navigator-offer__copy');
    copy.append(element('strong', '', offer.merchant.name));
    copy.append(element('span', 'navigator-offer__price', offerPrice(offer)));
    copy.append(element('small', '', `${offerAvailability(offer)} · ${offer.configuration.label}`));
    const link = element('a', 'navigator-offer__cta', `Bei ${offer.merchant.name} ansehen`);
    link.href = trackingLink(offer, placement);
    link.target = '_blank';
    link.rel = 'sponsored nofollow noopener';
    link.dataset.affiliate = offer.network.id;
    link.dataset.product = `${result.brand} ${result.model}`;
    link.dataset.productId = result.productId;
    link.dataset.placement = placement;
    link.dataset.merchant = offer.merchant.name;
    link.dataset.offerId = offer.offerId;
    link.dataset.resultRank = String(rank);
    link.dataset.matchScore = String(result.matchScore ?? 'kein_score');
    link.dataset.clickref = placement;
    link.addEventListener('click', () => track('haendlerangebot_geoeffnet', {
      produkt: result.productId,
      haendler: offer.merchant.name,
      angebot: offer.offerId,
      rang: String(rank),
      match_score: String(result.matchScore ?? 'kein_score')
    }));
    row.append(copy, link);
    list.append(row);
  }
  section.append(list);
  section.append(element('p', 'navigator-offers__note', 'Preis und Lieferbarkeit können sich kurzfristig ändern. Maßgeblich sind die Angaben beim Händler.'));
  return section;
}

function observeOfferImpressions(root) {
  const offerNodes = [...root.querySelectorAll('[data-offer-impression]')];
  if (!offerNodes.length) return;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
      const node = entry.target;
      track('haendlerangebot_gesehen', {
        produkt: node.dataset.productId,
        haendler: node.dataset.merchant,
        angebot: node.dataset.offerId,
        rang: node.dataset.resultRank,
        match_score: node.dataset.matchScore
      });
      observer.unobserve(node);
    }
  }, { threshold: 0.5 });
  offerNodes.forEach((node) => observer.observe(node));
}

function observeResultImpressions(root) {
  const resultNodes = [...root.querySelectorAll('[data-result-impression]')];
  if (!resultNodes.length || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.5) continue;
      const node = entry.target;
      track('match_gesehen', {
        produkt: node.dataset.productId,
        rang: node.dataset.resultRank,
        match_score: node.dataset.matchScore,
        match_stufe: node.dataset.matchBand
      });
      observer.unobserve(node);
    }
  }, { threshold: 0.5 });
  resultNodes.forEach((node) => observer.observe(node));
}

function observeComparisonImpression(root) {
  const comparison = root.querySelector('[data-comparison-impression]');
  if (!comparison || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    const entry = entries.find((item) => item.isIntersecting);
    if (!entry) return;
    track('vergleich_gesehen', {
      modelle: comparison.dataset.modelCount,
      zustand: comparison.open ? 'offen' : 'geschlossen'
    });
    observer.unobserve(comparison);
  }, { threshold: 0.1 });
  observer.observe(comparison);
}

function approvedImageOffer(result) {
  return offersForProduct(state.offers, result.productId)
    .find((offer) => offer.imageUrl && offer.imageRightsStatus === 'approved_for_feed_only') ?? null;
}

function approvedProductMedia(result) {
  const today = new Date().toISOString().slice(0, 10);
  return state.mediaAssets.find((asset) =>
    asset.productId === result.productId &&
    (asset.status ?? 'approved') === 'approved' &&
    (!asset.validUntil || asset.validUntil >= today) &&
    (asset.localPath || asset.remoteUrl)
  ) ?? null;
}

function productMedia(result, rank) {
  const asset = approvedProductMedia(result);
  if (asset) {
    const figure = element('figure', 'navigator-product-media');
    const image = element('img');
    image.src = asset.localPath ?? asset.remoteUrl;
    image.alt = asset.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    figure.append(image, element('figcaption', '', 'Produktbild · Nutzungsrecht dokumentiert'));
    return figure;
  }
  const offer = approvedImageOffer(result);
  if (!offer) return null;
  const figure = element('figure', 'navigator-product-media');
  const link = element('a', 'navigator-product-media__link');
  link.href = trackingLink(offer, `navigator_result_${rank}_image`);
  link.target = '_blank';
  link.rel = 'sponsored nofollow noopener';
  link.dataset.affiliate = offer.network.id;
  link.dataset.product = result.productId;
  link.dataset.merchant = offer.merchant.name;
  link.setAttribute('aria-label', `${result.brand} ${result.model} bei ${offer.merchant.name} ansehen`);
  const image = element('img');
  image.src = offer.imageUrl;
  image.alt = `${result.brand} ${result.model}`;
  image.loading = 'lazy';
  image.decoding = 'async';
  link.append(image, element('span', 'navigator-product-media__cta', 'Produkt ansehen ↗'));
  link.addEventListener('click', () => track('produktbild_geoeffnet', {
    produkt: result.productId,
    haendler: offer.merchant.name,
    rang: String(rank)
  }));
  figure.append(link, element('figcaption', '', `Produktbild: ${offer.merchant.name} · Affiliate-Link`));
  return figure;
}

function formatDimensions(value) {
  if (!value || !['length', 'width', 'height'].every((key) => typeof value[key] === 'number')) return 'Nicht belegt';
  return `${value.length} × ${value.width} × ${value.height} cm`;
}

function formatComparisonPrice(value) {
  if (typeof value !== 'number') return 'Nicht belegt';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatYesNo(value) {
  if (value === true) return 'Ja';
  if (value === false) return 'Nein';
  return 'Nicht belegt';
}

function formatStorage(facts) {
  const formatNumber = (value) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value);
  const parts = [];
  if (typeof facts?.basketVolumeL === 'number') parts.push(`${formatNumber(facts.basketVolumeL)} l`);
  if (typeof facts?.basketLoadKg === 'number') parts.push(`${formatNumber(facts.basketLoadKg)} kg`);
  return parts.length ? parts.join(' · ') : 'Nicht belegt';
}

function comparisonCriterionLabel(criterionId) {
  return state.criteriaData?.criteria?.find((criterion) => criterion.id === criterionId)?.label ?? criterionId;
}

function comparisonStrengths(result, limit = 1) {
  const strengths = (result.evaluations ?? [])
    .filter((evaluation) => typeof evaluation.value === 'number')
    .sort((a, b) => (b.value * b.weight) - (a.value * a.weight))
    .map((evaluation) => comparisonCriterionLabel(evaluation.criterionId));
  const unique = [...new Set(strengths)].slice(0, limit);
  if (unique.length) return unique;
  return result.bestFor.slice(0, limit).length ? result.bestFor.slice(0, limit) : ['Nicht belegt'];
}

function comparisonStrength(result) {
  return comparisonStrengths(result, 1)[0];
}

function comparisonTradeoff(result) {
  const weakest = (result.evaluations ?? [])
    .filter((evaluation) => typeof evaluation.value === 'number')
    .sort((a, b) => a.value - b.value || b.weight - a.weight)[0];
  if (!weakest || weakest.value >= 1) return 'Kein Daten-Abstrich; Praxistest bleibt offen';
  const degree = weakest.value >= 0.75
    ? 'kleiner Abstrich'
    : weakest.value >= 0.5
      ? 'teilweise passend'
      : 'deutlicher Abstrich';
  return `${comparisonCriterionLabel(weakest.criterionId)}: ${degree}`;
}

function comparisonWeightLabel(results) {
  const configurations = new Set(results.map((result) => result.comparisonFacts?.liftConfiguration).filter(Boolean));
  if (configurations.size !== 1) return 'Gewicht der dokumentierten Konfiguration';
  return {
    frame_only: 'Gestellgewicht',
    frame_with_seat: 'Gewicht mit Sitz',
    frame_with_carrycot: 'Gewicht mit Babywanne'
  }[[...configurations][0]] ?? 'Vergleichsgewicht';
}

function comparisonSection(results, badges) {
  if (results.length < 2) return null;
  const details = element('details', 'navigator-comparison');
  details.dataset.comparisonImpression = '';
  details.dataset.modelCount = String(results.length);
  if (window.matchMedia('(min-width: 769px)').matches) details.open = true;
  const summary = element('summary', '');
  const summaryCopy = element('span');
  summaryCopy.append(
    element('strong', '', `${results.length} Modelle direkt vergleichen`),
    element('small', '', 'Preis, Maße und Alltagseigenschaften nebeneinander')
  );
  const summaryCta = element('span', 'navigator-comparison__summary-cta');
  summaryCta.append(
    element('span', 'navigator-comparison__summary-open', 'Vergleich öffnen'),
    element('span', 'navigator-comparison__summary-close', 'Vergleich schließen')
  );
  summary.append(summaryCopy, summaryCta);
  details.append(summary);

  const scroller = element('div', 'navigator-comparison__scroller');
  scroller.tabIndex = 0;
  scroller.setAttribute('aria-label', 'Seitlich scrollbarer Kinderwagenvergleich');
  const table = element('table', 'navigator-comparison__table');
  const productColumnWidth = 190;
  const criterionColumnWidth = 104;
  table.style.setProperty('--navigator-comparison-width', `${criterionColumnWidth + (results.length * productColumnWidth)}px`);
  const colgroup = element('colgroup');
  colgroup.append(element('col', 'navigator-comparison__criterion-col'));
  results.forEach(() => colgroup.append(element('col', 'navigator-comparison__product-col')));
  table.append(colgroup);
  const head = element('thead');
  const headRow = element('tr');
  headRow.append(element('th', 'navigator-comparison__criterion', 'Kriterium'));
  results.forEach((result, index) => {
    const cell = element('th', 'navigator-comparison__product');
    cell.scope = 'col';
    const mediaAsset = approvedProductMedia(result);
    const imageOffer = approvedImageOffer(result);
    if (mediaAsset || imageOffer) {
      const image = element('img', 'navigator-comparison__image');
      image.src = mediaAsset?.localPath ?? mediaAsset?.remoteUrl ?? imageOffer.imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      cell.append(image);
    }
    cell.append(element('span', `navigator-result-badge is-${badges[index].kind}`, badges[index].label));
    const jump = element('button', 'navigator-comparison__jump', `${result.brand} ${result.model}`);
    jump.type = 'button';
    jump.addEventListener('click', () => {
      document.getElementById(`navigator-result-${result.productId}`)?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
      track('vergleich_modell_geoeffnet', { produkt: result.productId, rang: String(index + 1) });
    });
    cell.append(jump);
    headRow.append(cell);
  });
  head.append(headRow);
  table.append(head);

  const numericValues = (getter) => results.map(getter).filter((value) => typeof value === 'number');
  const bestMatch = Math.max(...numericValues((result) => result.matchScore));
  const lowestPrice = Math.min(...numericValues((result) => result.priceEur));
  const lowestWidth = Math.min(...numericValues((result) => result.comparisonFacts?.unfoldedWidthCm));
  const lowestWeight = Math.min(...numericValues((result) => result.comparisonFacts?.liftWeightKg));
  const largestVolume = Math.max(...numericValues((result) => result.comparisonFacts?.basketVolumeL));
  const comparableWeightConfigurations = new Set(results.map((result) => result.comparisonFacts?.liftConfiguration).filter(Boolean));
  const weightBest = comparableWeightConfigurations.size === 1 ? lowestWeight : null;
  const rows = [
    { label: 'Passung', value: (result) => result.matchScore, format: (value) => typeof value === 'number' ? `${value}%` : 'Keine Zahl', best: bestMatch },
    { label: 'Gesamtpreis ab Geburt', value: (result) => result.priceEur, format: formatComparisonPrice, best: lowestPrice },
    { label: 'Wagenbreite', value: (result) => result.comparisonFacts?.unfoldedWidthCm, format: (value) => typeof value === 'number' ? `${value} cm` : 'Nicht belegt', best: lowestWidth },
    { label: comparisonWeightLabel(results), value: (result) => result.comparisonFacts?.liftWeightKg, format: (value) => typeof value === 'number' ? `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(value)} kg` : 'Nicht belegt', best: weightBest },
    { label: 'Faltmaß', value: (result) => result.comparisonFacts?.foldedDimensionsCm, format: formatDimensions },
    { label: 'Korb: Liter · kg', value: (result) => result.comparisonFacts, format: formatStorage, bestValue: (facts) => facts?.basketVolumeL, best: largestVolume },
    { label: 'Einhand-Faltung', value: (result) => result.comparisonFacts?.oneHandFold, format: formatYesNo },
    { label: 'Stärkste Passung', value: comparisonStrength, format: (value) => value ?? 'Nicht belegt', long: true },
    { label: 'Größter Abstrich', value: comparisonTradeoff, format: (value) => value ?? 'Nicht belegt', long: true }
  ];
  const body = element('tbody');
  for (const row of rows) {
    const tableRow = element('tr', row.long ? 'is-long' : '');
    const label = element('th', 'navigator-comparison__criterion', row.label);
    label.scope = 'row';
    tableRow.append(label);
    results.forEach((result) => {
      const rawValue = row.value(result);
      const compareValue = row.bestValue ? row.bestValue(rawValue) : rawValue;
      const isBest = typeof row.best === 'number' && typeof compareValue === 'number' && compareValue === row.best;
      tableRow.append(element('td', isBest ? 'is-best-value' : '', row.format(rawValue)));
    });
    body.append(tableRow);
  }
  table.append(body);
  scroller.append(table);
  const hint = element('p', 'navigator-comparison__hint');
  hint.append(
    element('span', '', 'Seitlich wischen, um alle Modelle zu sehen.'),
    element('strong', 'navigator-comparison__position', `1 von ${results.length}`)
  );
  details.append(hint, scroller);
  details.addEventListener('toggle', () => {
    if (!details.open || details.dataset.tracked) return;
    details.dataset.tracked = 'true';
    track('vergleich_geoeffnet', { modelle: String(results.length) });
  });
  scroller.addEventListener('scroll', () => {
    const position = Math.min(results.length, Math.max(1, Math.round(scroller.scrollLeft / productColumnWidth) + 1));
    hint.querySelector('.navigator-comparison__position').textContent = `${position} von ${results.length}`;
    if (scroller.scrollLeft < 24 || scroller.dataset.trackedScroll) return;
    scroller.dataset.trackedScroll = 'true';
    track('vergleich_gescrollt', { modelle: String(results.length) });
  }, { passive: true });
  return details;
}

function resultCard(result, rank, preliminary = false, fallback = false, badge = null) {
  const card = element('article', `navigator-live-result${preliminary ? ' is-preliminary' : ''}${fallback ? ' is-fallback' : ''}`);
  card.id = `navigator-result-${result.productId}`;
  if (badge?.kind === 'recommended') card.classList.add('is-primary-match');
  card.dataset.resultImpression = '';
  card.dataset.productId = result.productId;
  card.dataset.resultRank = String(rank);
  card.dataset.matchScore = String(result.matchScore ?? 'kein_score');
  card.dataset.matchBand = result.matchBand ?? 'keine_einstufung';
  const header = element('div', 'navigator-live-result__header');
  const heading = element('div');
  const role = result.rankRole ?? `${rank}. Match`;
  const preliminaryLabel = result.matchScore === null ? 'Datenlage reicht noch nicht' : 'Unter der Empfehlungsschwelle';
  const visibleBadge = fallback || preliminary
    ? { label: fallback ? role : preliminaryLabel, kind: 'alternative' }
    : (badge ?? { label: role, kind: 'alternative' });
  heading.append(element('span', `navigator-result-badge is-${visibleBadge.kind}`, visibleBadge.label));
  heading.append(element('h3', '', `${result.brand} ${result.model}`));
  if (!preliminary && result.scoreGapToBest > 0) heading.append(element('p', 'navigator-rank-context', `${result.scoreGapToBest} Punkte hinter der besten Gesamtpassung`));
  const score = element('div', 'navigator-score');
  if (fallback && result.failures.length) {
    score.classList.add('is-data-gap');
    score.append(element('strong', '', String(result.failures.length)), element('span', '', result.failures.length === 1 ? 'Abstrich' : 'Abstriche'));
  } else if (result.matchScore === null) {
    score.classList.add('is-data-gap');
    score.append(element('strong', '', `${result.dataCoverage}%`), element('span', '', 'Datenlage'));
  } else {
    score.setAttribute('aria-label', `${result.matchScore} Prozent Passung`);
    score.append(element('strong', '', `${result.matchScore}%`), element('span', '', 'Passung'));
  }
  header.append(heading, score);
  const lead = element('div', 'navigator-live-result__lead');
  const media = !preliminary && !fallback ? productMedia(result, rank) : null;
  if (media) {
    lead.classList.add('has-media');
    lead.append(media);
  }
  lead.append(header);
  card.append(lead);
  if (result.matchScore !== null) {
    card.append(element('p', 'navigator-score-band', `${result.matchBand} · ${result.knownCriteriaCount} von ${result.applicableCriteriaCount} relevanten Kriterien bewertet`));
  }

  const meta = element('div', 'navigator-result-meta');
  meta.append(
    element('span', '', formatPrice(result.priceEur)),
    element('span', '', marketLabels[result.marketStatus] ?? marketLabels.unknown),
    element('span', '', 'Daten-Match · kein eigener Produkttest')
  );
  card.append(meta);

  if (fallback && result.failures.length) {
    const blockers = element('div', 'navigator-fallback-blockers');
    blockers.append(element('strong', '', 'Was noch nicht zu euren Angaben passt'));
    const list = element('ul');
    result.failures.slice(0, 3).forEach((failure) => list.append(element('li', '', failure.text)));
    blockers.append(list);
    card.append(blockers);
  }

  if (result.priorityConflicts?.length) {
    const warning = element('div', 'navigator-priority-warning');
    warning.append(element('strong', '', 'Eine eurer Top-Prioritäten wird nicht erfüllt'), element('span', '', result.priorityConflicts[0].rationale));
    card.append(warning);
  }

  const list = element('ul', 'navigator-match-list');
  const reasons = result.reasons.length ? result.reasons : result.bestFor.slice(0, 2);
  for (const strength of comparisonStrengths(result, 2)) list.append(element('li', 'is-match', strength));
  if (result.compromise) list.append(element('li', 'is-compromise', `Wichtigster Abstrich: ${comparisonTradeoff(result)}`));
  card.append(list);

  if (!preliminary && !fallback) {
    const offers = offerSection(result, rank);
    if (offers) card.append(offers);
  }

  const evidence = element('details', 'navigator-result-more');
  if (window.matchMedia('(min-width: 769px)').matches) evidence.open = true;
  evidence.append(element('summary', '', 'Details, Prüfpunkte und Quellen'));

  if (reasons.length || result.compromise) {
    const rationale = element('div', 'navigator-result-rationale');
    rationale.append(element('strong', '', 'So entsteht diese Passung'));
    const rationaleList = element('ul');
    reasons.slice(0, 3).forEach((reason) => rationaleList.append(element('li', '', reason)));
    if (result.compromise) rationaleList.append(element('li', '', result.compromise));
    rationale.append(rationaleList);
    evidence.append(rationale);
  }

  const proof = element('div', 'navigator-proof-metrics');
  const must = element('div');
  must.append(element('strong', '', `${result.mustCriteria.length}`), element('span', '', 'belegte Muss-Prüfungen'));
  const coverage = element('div');
  coverage.append(element('strong', '', `${result.dataCoverage}%`), element('span', '', 'relevante Datenabdeckung'));
  const sources = element('div');
  sources.append(element('strong', '', `${result.sourceCount}`), element('span', '', 'geprüfte Quellen'));
  proof.append(must, coverage, sources);
  evidence.append(proof);

  if (result.openChecks.length) {
    const checks = element('div', 'navigator-open-check');
    checks.append(element('strong', '', 'Vor dem Kauf prüfen'));
    const checkList = element('ul');
    result.openChecks.slice(0, 3).forEach((check) => checkList.append(element('li', '', check)));
    checks.append(checkList);
    evidence.append(checks);
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
  evidence.append(details);
  card.append(evidence);
  return card;
}

function scoreExplanation() {
  const details = element('details', 'navigator-score-explanation');
  details.append(element('summary', '', 'Was bedeutet ein Match von 75, 85 oder 90 Prozent?'));
  const list = element('ul');
  [
    ['90–100 %', 'Sehr hohe Übereinstimmung – nahezu alle relevanten Anforderungen sind erfüllt.'],
    ['85–89 %', 'Gute Übereinstimmung – klar passend, mit einzelnen überprüfbaren Kompromissen.'],
    ['75–84 %', 'Solide Übereinstimmung – empfehlbar, der wichtigste Abstrich wird sichtbar genannt.'],
    ['Unter 75 %', 'Keine reguläre Empfehlung; höchstens als transparente Alternative nach einem bewusst gewählten Abstrich.']
  ].forEach(([band, description]) => {
    const item = element('li');
    item.append(element('strong', '', band), document.createTextNode(` ${description}`));
    list.append(item);
  });
  details.append(
    list,
    element('p', '', 'Der Wert misst nur die Passung zu euren Angaben. Er ist keine Sicherheits-, Qualitäts- oder Testnote. Eine unbekannte Kernpassung verhindert einen Prozentwert; eine nur teilweise belegte Kernpassung begrenzt die erreichbare Match-Stufe.')
  );
  details.addEventListener('toggle', () => {
    if (!details.open || details.dataset.tracked) return;
    details.dataset.tracked = 'true';
    track('score_erlaeuterung_geoeffnet');
  });
  return details;
}

function blockerSummary(excluded) {
  const byCode = new Map();
  for (const result of excluded) {
    for (const failure of result.failures) {
      const entry = byCode.get(failure.code) ?? { count: 0, text: failure.text };
      entry.count += 1;
      byCode.set(failure.code, entry);
    }
  }
  const copy = {
    budget: (count) => `${count} ${count === 1 ? 'Modell liegt' : 'Modelle liegen'} über eurer berücksichtigten Budgetgrenze.`,
    price_unknown: (count) => `Bei ${count} ${count === 1 ? 'Modell ist' : 'Modellen ist'} der Gesamtpreis der Geburtskonfiguration noch nicht belastbar bekannt.`,
    folded_fit: (count) => `${count} ${count === 1 ? 'Faltmaß passt' : 'Faltmaße passen'} rechnerisch nicht in den gemessenen Kofferraum.`,
    access_width: (count) => `${count} ${count === 1 ? 'Modell ist' : 'Modelle sind'} breiter als die gemessene Öffnung.`,
    lift_weight: (count) => `${count} ${count === 1 ? 'Modell überschreitet' : 'Modelle überschreiten'} eure bestätigte Tragegrenze.`
  };
  return [...byCode.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([code, entry]) => copy[code]?.(entry.count) ?? entry.text);
}

function applyCompromise(option) {
  if (option.id === 'budget_to_next') state.answers.budget = option.value;
  if (option.id.startsWith('remove_feature:')) {
    const featureId = option.id.split(':')[1];
    state.answers.required_features = (state.answers.required_features ?? []).filter((id) => id !== featureId);
  }
  if (option.id === 'access_as_open_check') delete state.answers.maximum_access_width;
  if (option.id === 'lift_as_open_check') delete state.answers.maximum_lift_weight;
  state.acceptedCompromises.push(option.label);
  pruneHiddenAnswers();
  track('kompromiss_akzeptiert', { kompromiss: option.id });
  renderResults();
}

function renderCompromisePanel(result) {
  const options = compromiseOptions({ answers: state.answers, excluded: result.excluded });
  if (!options.length) return null;
  const panel = element('aside', 'navigator-compromise-panel');
  panel.append(element('span', 'navigator-card-kicker', 'Nur mit eurer Zustimmung'));
  panel.append(element('h3', '', 'Welcher Abstrich wäre für euch denkbar?'));
  panel.append(element('p', '', 'Der Navigator lockert keine Muss-Anforderung still. Wählt nur eine Änderung, die für euch wirklich in Ordnung ist.'));
  const list = element('div', 'navigator-compromise-options');
  for (const option of options) {
    const button = element('button', 'navigator-compromise-option');
    button.type = 'button';
    button.append(element('strong', '', option.label), element('span', '', option.detail), element('small', '', 'Anwenden und Ergebnis aktualisieren →'));
    button.addEventListener('click', () => applyCompromise(option));
    list.append(button);
  }
  panel.append(list);
  return panel;
}

function renderResults() {
  resetMobileQuestionAction();
  const result = matchStrollers({ answers: state.answers, products: state.products, criteriaData: state.criteriaData });
  const adjustedFallback = !result.results.length && state.acceptedCompromises.length > 0 && result.closest[0]?.eligible;
  const wrap = element('div', 'navigator-results');
  const intro = element('div', 'navigator-results__intro');
  intro.append(element('span', 'navigator-card-kicker', 'Euer unabhängiger Passungsnachweis'));
  intro.append(element('h2', '', result.results.length
    ? `${result.results.length === 1 ? 'Ein belastbares Match' : `${result.results.length} belastbare Matches`}`
    : (adjustedFallback ? 'Eure beste verfügbare Lösung' : 'Eure besten Optionen – mit offenen Abstrichen')));
  intro.append(element('p', 'navigator-results__lead-copy', result.results.length
    ? 'Sortiert nach eurer Passung – unabhängig von Provisionen und Händlerverfügbarkeit.'
    : (adjustedFallback
      ? 'Die erste Option erfüllt nach eurer Anpassung die Muss-Anforderungen. Sie bleibt unter unserer Schwelle für eine volle Empfehlung, deshalb zeigen wir die offenen Punkte weiterhin transparent.'
      : 'Ihr müsst nicht von vorne beginnen. Wir zeigen die nächstliegenden Optionen, erklären die Abweichungen und lassen euch gezielt nur den Abstrich ändern, der wirklich blockiert.')));
  if (result.results.length > 0 && result.results.length < 3) {
    intro.append(element('p', 'navigator-result-count-note', `${result.results.length} statt 3: Weitere Modelle scheitern aktuell an Muss-Kriterien oder Datenqualität.`));
  }
  if (state.acceptedCompromises.length) {
    const accepted = element('div', 'navigator-accepted-compromises');
    accepted.append(element('strong', '', 'Von euch akzeptierte Anpassung'));
    const list = element('ul');
    state.acceptedCompromises.forEach((item) => list.append(element('li', '', item)));
    accepted.append(list);
    intro.append(accepted);
  }
  intro.append(scoreExplanation());
  wrap.append(intro);

  const badges = result.results.map((item, index) => resultBadge(item, index + 1, result.results));
  const comparison = comparisonSection(result.results, badges);
  if (comparison) wrap.append(comparison);

  const cards = element('div', 'navigator-live-results');
  result.results.forEach((item, index) => cards.append(resultCard(item, index + 1, false, false, badges[index])));
  if (!result.results.length) result.closest.forEach((item, index) => cards.append(resultCard(item, index + 1, item.eligible, true)));
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
    const compromisePanel = renderCompromisePanel(result);
    if (compromisePanel) wrap.append(compromisePanel);
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
      if (value === 'ja') {
        feedback.append(element('span', 'navigator-feedback__thanks', 'Danke – das hilft uns, den Pilot zu verbessern.'));
        return;
      }
      const reasons = [
        ['kein_passendes_modell', 'Kein passendes Modell'],
        ['passt_nicht_zum_alltag', 'Passt nicht zu unserem Alltag'],
        ['score_nicht_nachvollziehbar', 'Match-Score nicht nachvollziehbar'],
        ['frage_unklar', 'Eine Frage war unklar'],
        ['zu_wenig_information', 'Zu wenig Informationen'],
        ['haendlerangebot_fehlt', 'Passendes Händlerangebot fehlt']
      ];
      const reasonPanel = element('div', 'navigator-feedback-reasons');
      reasonPanel.setAttribute('role', 'group');
      reasonPanel.setAttribute('aria-label', 'Grund für negatives Feedback');
      reasonPanel.append(element('strong', '', 'Was hat euch vor allem gefehlt?'));
      const reasonActions = element('div', 'navigator-feedback-reasons__actions');
      for (const [reasonId, reasonLabel] of reasons) {
        const reasonButton = element('button', 'navigator-feedback-reason', reasonLabel);
        reasonButton.type = 'button';
        reasonButton.addEventListener('click', () => {
          track('ergebnis_feedbackgrund', {
            grund: reasonId,
            matches: String(result.results.length),
            top_produkt: result.results[0]?.productId ?? 'kein_match'
          });
          reasonActions.querySelectorAll('button').forEach((item) => { item.disabled = true; });
          reasonPanel.append(element('span', 'navigator-feedback__thanks', 'Danke – damit wissen wir, wo wir nachbessern müssen.'));
        }, { once: true });
        reasonActions.append(reasonButton);
      }
      reasonPanel.append(reasonActions);
      feedback.append(reasonPanel);
      reasonActions.querySelector('button')?.focus();
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
  const restart = element('button', 'navigator-text-button', 'Komplett neu starten');
  restart.type = 'button';
  restart.addEventListener('click', restartNavigator);
  if (!result.results.length) {
    const compromisePanel = wrap.querySelector('.navigator-compromise-panel');
    if (compromisePanel) {
      const focusCompromise = element('button', 'navigator-primary-button', 'Gezielt einen Abstrich wählen');
      focusCompromise.type = 'button';
      focusCompromise.addEventListener('click', () => compromisePanel.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'center' }));
      actions.append(focusCompromise);
    }
  }
  actions.append(change, restart);
  wrap.append(actions);
  app.replaceChildren(wrap);
  observeOfferImpressions(wrap);
  observeResultImpressions(wrap);
  observeComparisonImpression(wrap);
  track('ergebnis_berechnet', {
    route: result.route,
    matches: String(result.results.length),
    vorlaeufig: String(result.preliminary.length),
    top_produkt: result.results[0]?.productId ?? 'kein_match',
    top_score: result.results[0]?.matchScore ? String(result.results[0].matchScore) : 'kein_score'
  });
  app.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
  const resultHeading = wrap.querySelector('.navigator-results__intro h2');
  resultHeading?.setAttribute('tabindex', '-1');
  resultHeading?.focus({ preventScroll: true });
}

function restartNavigator() {
  state.answers = { search_goal: BETA_SEARCH_GOAL };
  state.skipped = new Set();
  state.acceptedCompromises = [];
  state.started = true;
  track('neu_gestartet');
  renderQuestion(state.questions[0].id);
}

async function loadData() {
  const [questionsData, criteriaData, catalogBundle, offerData, mediaData] = await Promise.all([
    fetch(`${DATA_ROOT}/questions.v0.1.json`).then((response) => response.json()),
    fetch(`${DATA_ROOT}/criteria.v0.1.json`).then((response) => response.json()),
    fetch(`${DATA_ROOT}/catalog.bundle.v0.1.json`).then((response) => response.json()),
    fetch(`${DATA_ROOT}/offers.v0.1.json`).then((response) => response.ok ? response.json() : { offers: [] }).catch(() => ({ offers: [] })),
    fetch(`${DATA_ROOT}/media.v0.1.json`).then((response) => response.ok ? response.json() : { assets: [] }).catch(() => ({ assets: [] }))
  ]);
  const products = catalogBundle.products ?? [];
  if (!Array.isArray(products) || !products.length) throw new Error('catalog_empty');
  if (catalogBundle.modelVersion !== criteriaData.modelVersion) throw new Error('catalog_version_mismatch');
  state.questions = questionsData.questions.sort((a, b) => a.order - b.order);
  state.flowVersion = questionsData.flowVersion ?? '0.3.0';
  state.criteriaData = criteriaData;
  state.products = products;
  state.offers = offerData.offers ?? [];
  state.mediaAssets = mediaData.assets ?? [];
  if (affiliateDisclosure && state.offers.length > 0) {
    affiliateDisclosure.hidden = false;
  }
  document.querySelectorAll('[data-navigator-model-count]').forEach((node) => {
    node.textContent = String(products.length);
  });
  state.ready = true;
  renderQuestion(state.questions[0].id, { scroll: false, focus: false });
  track('navigator_bereit', {
    modelle: String(products.length),
    angebote: String(state.offers.length),
    ladezeit: loadTimeBucket(performance.now() - loadStartedAt)
  });
}

if (app) {
  loadData().catch((loadError) => {
    track('ladefehler', { phase: 'initiale_daten', typ: loadError?.name ?? 'unbekannt' });
    const error = element('div', 'navigator-app-card navigator-route-card');
    error.append(element('h2', '', 'Der Daten-Pilot konnte nicht geladen werden'));
    error.append(element('p', 'navigator-question-help', 'Bitte ladet die Seite neu. Falls das Problem bleibt, ist der Navigator vorübergehend nicht verfügbar.'));
    app.replaceChildren(error);
  });
}
