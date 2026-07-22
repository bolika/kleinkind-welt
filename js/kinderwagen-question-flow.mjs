export function hasAnswerValue(answers, questionId) {
  const value = answers[questionId];
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.values(value).some((entry) => entry !== '' && entry !== null && entry !== undefined);
  return value !== '' && value !== null && value !== undefined;
}

export function matchesQuestionCondition(condition, answers) {
  if (!condition) return true;
  if (condition.operator === 'any_answered') return condition.questionIds.some((questionId) => hasAnswerValue(answers, questionId));
  const value = answers[condition.questionId];
  if (condition.operator === 'answered') return hasAnswerValue(answers, condition.questionId);
  if (condition.operator === 'equals') return value === condition.value;
  if (condition.operator === 'in') return condition.value.includes(value);
  return true;
}

export function getVisibleQuestions(questions, answers) {
  return questions.filter((question) => matchesQuestionCondition(question.showWhen, answers));
}

export function validateQuestionValue(question, value) {
  if (question.required) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return 'Bitte beantwortet diese Frage.';
    if (question.type === 'dimensions' && Object.values(value).some((entry) => entry === null)) return 'Bitte gebt alle drei nutzbaren Innenmaße an.';
  }
  if (question.type === 'multi_choice') {
    const min = question.validation?.minimumSelections ?? 0;
    const max = question.validation?.maximumSelections ?? Infinity;
    if (value.length < min) return `Bitte wählt mindestens ${min} ${min === 1 ? 'Option' : 'Optionen'}.`;
    if (value.length > max) return `Bitte wählt höchstens ${max} Optionen.`;
  }
  const numericValues = question.type === 'dimensions' ? Object.values(value) : (question.type === 'number_list' ? value : [value]);
  for (const numeric of numericValues) {
    if (numeric === undefined || numeric === null) continue;
    if (numeric < question.validation?.minimum || numeric > question.validation?.maximum) {
      return `Bitte bleibt zwischen ${question.validation.minimum} und ${question.validation.maximum} ${question.validation.unit ?? ''}.`;
    }
  }
  return null;
}
