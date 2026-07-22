const FEATURE_FACTS = {
  reversible_seat: 'reversibleSeat',
  travel_system: 'travelSystem',
  one_hand_fold: 'oneHandFold',
  fold_with_seat: 'foldWithSeat',
  self_standing: 'selfStandingFold'
};

const SIGNAL_MAP = {
  city_maneuverability: 'cityManeuverability',
  rough_surface_fit: 'roughSurfaceFit',
  folding_convenience: 'foldingConvenience',
  storage_capacity: 'storageCapacity',
  weather_protection: 'weatherProtection',
  repairability_service: 'repairabilityService',
  long_term_flexibility: 'longTermFlexibility'
};

const PRIORITY_MAP = {
  easy_to_carry: ['frequent_carrying_fit'],
  compact_in_car: ['car_transport_fit', 'folding_convenience'],
  city_transit: ['city_maneuverability', 'public_transport_fit'],
  rough_terrain: ['rough_surface_fit'],
  storage: ['storage_capacity'],
  easy_folding: ['folding_convenience'],
  long_use: ['long_term_flexibility'],
  service: ['repairability_service'],
  weather: ['weather_protection']
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function fact(product, key) {
  return product.facts?.[key];
}

function isKnown(item) {
  return Boolean(item) && item.value !== null && item.value !== undefined && !['unknown', 'stale'].includes(item.status);
}

function combinedWeight(product, attachmentFactKey) {
  const frame = fact(product, 'frameWeightKg');
  const attachment = fact(product, attachmentFactKey);
  if (!isKnown(frame) || !isKnown(attachment) || typeof frame.value !== 'number' || typeof attachment.value !== 'number') return null;
  return {
    value: Math.round((frame.value + attachment.value) * 100) / 100,
    status: frame.status === 'officially_documented' && attachment.status === 'officially_documented' ? 'officially_documented' : 'derived_proxy'
  };
}

function liftWeightFor(product, liftUnit) {
  if (liftUnit === 'frame_only') return isKnown(fact(product, 'frameWeightKg')) ? fact(product, 'frameWeightKg') : null;
  if (liftUnit === 'frame_with_seat') {
    const combined = combinedWeight(product, 'seatWeightKg');
    if (combined) return combined;
  }
  if (liftUnit === 'frame_with_carrycot') {
    const combined = combinedWeight(product, 'carrycotWeightKg');
    if (combined) return combined;
  }
  const documentedConfiguration = fact(product, 'liftReadyConfiguration');
  const documentedWeight = fact(product, 'liftReadyWeightKg');
  return documentedConfiguration?.value === liftUnit && isKnown(documentedWeight) ? documentedWeight : null;
}

function liftUnitLabel(liftUnit) {
  return {
    frame_only: 'Gestell',
    frame_with_seat: 'Gestell mit Sitzeinheit',
    frame_with_carrycot: 'Gestell mit Babywanne'
  }[liftUnit] ?? 'gewählte Trageeinheit';
}

function permutationsFit(productDimensions, containerDimensions) {
  if (!productDimensions || !containerDimensions) return null;
  const productValues = [productDimensions.length, productDimensions.width, productDimensions.height].sort((a, b) => a - b);
  const containerValues = [containerDimensions.width, containerDimensions.height, containerDimensions.depth].sort((a, b) => a - b);
  if ([...productValues, ...containerValues].some((value) => typeof value !== 'number')) return null;
  return productValues.every((value, index) => value <= containerValues[index]);
}

function routeFor(answers) {
  if (answers.search_goal === 'siblings_twins' || answers.children_count === 'more_than_one') return 'unsupported_siblings';
  if (answers.search_goal === 'buggy') return 'unsupported_buggy';
  if (answers.search_goal === 'unsure') return 'scope_help';
  if (answers.search_goal !== 'first_combo_from_birth' || answers.children_count !== 'one') return 'incomplete';
  return 'supported';
}

function topPriorityCriteria(answers) {
  return new Set((answers.top_priorities ?? []).flatMap((priority) => PRIORITY_MAP[priority] ?? []));
}

function eligibility(product, answers) {
  const failures = [];
  const passed = [];
  const openChecks = [];
  const measured = answers.measurement_confirmation === 'measured';

  const marketStatus = fact(product, 'marketStatus');
  if (['discontinued', 'retired'].includes(marketStatus?.value)) {
    failures.push({ code: 'not_current', text: 'Das Modell ist laut erfasster Quelle eingestellt oder aus dem Katalog genommen.' });
  } else if (!isKnown(marketStatus) || marketStatus.value === 'unknown') {
    openChecks.push('Aktuellen Marktstatus und Lieferbarkeit vor der Entscheidung prüfen.');
  } else if (marketStatus.value !== 'current_available') {
    openChecks.push('Lieferbarkeit der vollständigen Geburtskonfiguration bei Hersteller oder seriösem Händler aktuell prüfen.');
  }

  if (fact(product, 'officialSafetyNoticeStatus')?.value === 'active_official_warning') {
    failures.push({ code: 'official_warning', text: 'Eine erfasste aktive offizielle Sicherheitswarnung blockiert die Empfehlung.' });
  }

  if (fact(product, 'newbornApproved')?.value !== true) {
    failures.push({ code: 'newborn_configuration', text: 'Keine belegte Konfiguration ab Geburt.' });
  } else {
    passed.push({ code: 'newborn_configuration', text: 'Konfiguration ab Geburt dokumentiert.' });
  }

  if (product.identity?.category !== 'single-combi-from-birth' || product.identity?.supportedChildren !== 1) {
    failures.push({ code: 'scope', text: 'Modell liegt außerhalb des unterstützten MVP-Scopes.' });
  } else {
    passed.push({ code: 'scope', text: 'Kombi-Kinderwagen für ein Kind.' });
  }

  const budget = answers.budget;
  const price = fact(product, 'requiredConfigurationPriceEur');
  const budgetMode = answers.budget_strictness;
  const budgetLimit = budgetMode === 'flexible_10' ? budget * 1.1 : budget;
  if (typeof budget === 'number' && budgetMode !== 'orientation') {
    if (!isKnown(price)) {
      failures.push({ code: 'price_unknown', text: 'Gesamtpreis der benötigten Geburtskonfiguration ist nicht belastbar bekannt.' });
    } else if (price.value > budgetLimit) {
      failures.push({ code: 'budget', text: `Gesamtpreis ${price.value.toFixed(2)} € liegt über der berücksichtigten Obergrenze.` });
    } else {
      passed.push({ code: 'budget', text: `Gesamtpreis ${price.value.toFixed(2)} € liegt innerhalb der berücksichtigten Obergrenze.` });
    }
  }

  const widthLimit = answers.maximum_access_width;
  const width = fact(product, 'unfoldedWidthCm');
  if (typeof widthLimit === 'number') {
    if (!measured) {
      openChecks.push(`Engsten Zugang nachmessen; ${product.identity.model} ist laut Quelle ${width?.value ?? 'unbekannt'} cm breit.`);
    } else if (!isKnown(width)) {
      failures.push({ code: 'width_unknown', text: 'Wagenbreite fehlt für den gemessenen Zugang.' });
    } else if (width.value > widthLimit) {
      failures.push({ code: 'access_width', text: `${width.value} cm Wagenbreite überschreiten das Limit von ${widthLimit} cm.` });
    } else {
      passed.push({ code: 'access_width', text: `${width.value} cm liegen innerhalb des gemessenen Limits von ${widthLimit} cm.` });
    }
  }

  const trunkDimensions = answers.trunk_dimensions;
  const folded = fact(product, 'foldedDimensionsCm');
  if (trunkDimensions) {
    if (!measured) {
      openChecks.push('Kofferraummaße nachmessen; geschätzte Maße gelten nicht als belegter Fit.');
    } else if (!isKnown(folded)) {
      failures.push({ code: 'folded_unknown', text: 'Faltmaß fehlt für den gemessenen Kofferraum.' });
    } else if (!permutationsFit(folded.value, trunkDimensions)) {
      failures.push({ code: 'folded_fit', text: 'Das dokumentierte Faltmaß passt in keiner rechteckigen Orientierung in die angegebenen Innenmaße.' });
    } else {
      passed.push({ code: 'folded_fit', text: 'Das dokumentierte Faltmaß passt rechnerisch in die angegebenen Innenmaße.' });
      openChecks.push('Kofferraumöffnung, Radkästen und reale Ladebewegung zusätzlich praktisch prüfen.');
    }
  } else if (answers.trunk_measurement_known === 'measure_later') {
    openChecks.push('Kofferraum an der tatsächlich nutzbaren Stelle ausmessen.');
  }

  const maxLift = answers.maximum_lift_weight;
  const liftWeight = liftWeightFor(product, answers.lift_unit);
  if (typeof maxLift === 'number') {
    if (!measured) {
      openChecks.push(`Tragegrenze für ${liftUnitLabel(answers.lift_unit)} praktisch prüfen; dokumentiertes Vergleichsgewicht: ${liftWeight?.value ?? 'unbekannt'} kg.`);
    } else if (!isKnown(liftWeight)) {
      failures.push({ code: 'lift_weight_unknown', text: `Gewicht für ${liftUnitLabel(answers.lift_unit)} ist nicht belastbar bekannt.` });
    } else if (liftWeight.value > maxLift) {
      failures.push({ code: 'lift_weight', text: `${liftWeight.value} kg für ${liftUnitLabel(answers.lift_unit)} überschreiten die bestätigte Tragegrenze von ${maxLift} kg.` });
    } else {
      passed.push({ code: 'lift_weight', text: `${liftWeight.value} kg für ${liftUnitLabel(answers.lift_unit)} liegen innerhalb der bestätigten Tragegrenze.` });
    }
  }

  for (const featureId of answers.required_features ?? []) {
    const factKey = FEATURE_FACTS[featureId];
    const feature = fact(product, factKey);
    if (!isKnown(feature)) failures.push({ code: `feature_${featureId}_unknown`, text: `Muss-Funktion ${featureId} ist nicht belastbar dokumentiert.` });
    else if (feature.value !== true) failures.push({ code: `feature_${featureId}`, text: `Muss-Funktion ${featureId} wird nicht erfüllt.` });
    else passed.push({ code: `feature_${featureId}`, text: `Muss-Funktion ${featureId} ist dokumentiert.` });
  }

  const heights = answers.pusher_heights ?? [];
  if (heights.length) {
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);
    if (minHeight < 160 || maxHeight > 190 || maxHeight - minHeight >= 25) {
      const minPushbar = fact(product, 'pushbarMinCm')?.value;
      const maxPushbar = fact(product, 'pushbarMaxCm')?.value;
      const documentedRange = typeof minPushbar === 'number' && typeof maxPushbar === 'number'
        ? ` Dokumentierter Schieberbereich: ${minPushbar}–${maxPushbar} cm.`
        : '';
      openChecks.push(`Schieberhöhe mit allen regelmäßig schiebenden Personen praktisch testen.${documentedRange}`);
    }
  }

  return { eligible: failures.length === 0, failures, passed, openChecks };
}

function staticEvaluation(product, criterionId) {
  const signal = product.signals?.[SIGNAL_MAP[criterionId]];
  if (!signal || signal.value === null) return { criterionId, value: null, status: 'unknown', rationale: signal?.rationale ?? 'Keine belastbare Datengrundlage.' };
  return { criterionId, value: signal.value, status: signal.status, rationale: signal.rationale };
}

function average(values) {
  const known = values.filter((value) => typeof value === 'number');
  if (!known.length) return null;
  return known.reduce((sum, value) => sum + value, 0) / known.length;
}

function applicableEvaluations(product, answers) {
  const evaluations = [];
  const terrain = answers.terrain ?? [];
  const priorities = topPriorityCriteria(answers);
  const addStatic = (criterionId) => evaluations.push(staticEvaluation(product, criterionId));

  if (terrain.some((value) => ['smooth_city', 'mixed'].includes(value)) || answers.public_transport_frequency !== 'never') {
    addStatic('city_maneuverability');
  }
  if (terrain.some((value) => ['cobblestone', 'gravel_park', 'forest_field', 'mixed'].includes(value))) {
    addStatic('rough_surface_fit');
  }

  if (answers.public_transport_frequency && answers.public_transport_frequency !== 'never') {
    const city = staticEvaluation(product, 'city_maneuverability');
    let carrying = null;
    if (typeof answers.maximum_lift_weight === 'number' && answers.measurement_confirmation === 'measured') carrying = 1;
    evaluations.push({
      criterionId: 'public_transport_fit',
      value: average([city.value, carrying]),
      status: 'proxy',
      rationale: carrying === null
        ? 'Aus dokumentierter Stadtpassung abgeleitet; persönliche Tragegrenze fehlt.'
        : 'Aus Stadtpassung und bestätigter Tragegrenze abgeleitet.'
    });
  }

  if (answers.car_frequency && answers.car_frequency !== 'never') {
    const folding = staticEvaluation(product, 'folding_convenience');
    const exactFit = answers.trunk_dimensions && answers.measurement_confirmation === 'measured'
      ? permutationsFit(fact(product, 'foldedDimensionsCm')?.value, answers.trunk_dimensions)
      : null;
    evaluations.push({
      criterionId: 'car_transport_fit',
      value: average([exactFit === true ? 1 : null, folding.value]),
      status: exactFit === true ? 'documented-plus-proxy' : 'proxy',
      rationale: exactFit === true
        ? 'Rechnerischer Kofferraum-Fit und dokumentierte Faltmerkmale kombiniert.'
        : 'Ohne gemessenen Kofferraum nur aus dokumentierten Faltmerkmalen abgeleitet.'
    });
  }

  if (answers.stairs_frequency && answers.stairs_frequency !== 'never') {
    const liftWeight = liftWeightFor(product, answers.lift_unit);
    const hasMeasuredLimit = typeof answers.maximum_lift_weight === 'number' && answers.measurement_confirmation === 'measured';
    evaluations.push({
      criterionId: 'frequent_carrying_fit',
      value: hasMeasuredLimit && isKnown(liftWeight) ? 1 : null,
      status: hasMeasuredLimit ? 'documented' : 'unknown',
      rationale: hasMeasuredLimit
        ? 'Dokumentiertes Gewicht liegt innerhalb der bestätigten persönlichen Tragegrenze.'
        : 'Ohne persönliche Tragegrenze wird aus dem Gewicht kein scheinpräziser Komfort-Score erzeugt.'
    });
  }

  if (answers.car_frequency !== 'never' || priorities.has('folding_convenience')) addStatic('folding_convenience');
  for (const criterionId of ['storage_capacity', 'weather_protection', 'repairability_service', 'long_term_flexibility']) {
    if (priorities.has(criterionId)) addStatic(criterionId);
  }

  return [...new Map(evaluations.map((evaluation) => [evaluation.criterionId, evaluation])).values()];
}

function scoreProduct(product, answers, criteriaData, eligibilityResult) {
  const criteriaById = new Map((criteriaData.criteria ?? []).map((criterion) => [criterion.id, criterion]));
  const priorityCriteria = topPriorityCriteria(answers);
  const evaluations = applicableEvaluations(product, answers).map((evaluation) => {
    const criterion = criteriaById.get(evaluation.criterionId);
    const baseWeight = criterion?.baseWeight ?? 0;
    const weight = baseWeight * (priorityCriteria.has(evaluation.criterionId) ? criteriaData.scoreRules.priorityMultiplier : 1);
    return { ...evaluation, weight };
  }).filter((evaluation) => evaluation.weight > 0);

  const applicableWeight = evaluations.reduce((sum, evaluation) => sum + evaluation.weight, 0);
  const known = evaluations.filter((evaluation) => typeof evaluation.value === 'number');
  const knownWeight = known.reduce((sum, evaluation) => sum + evaluation.weight, 0);
  const weightedScore = known.reduce((sum, evaluation) => sum + (evaluation.value * evaluation.weight), 0);
  const dataCoverage = applicableWeight ? Math.round((knownWeight / applicableWeight) * 100) : 0;
  const rawScore = knownWeight ? Math.round((weightedScore / knownWeight) * 100) : null;
  const numericScore = dataCoverage >= criteriaData.scoreRules.minimumCoverageForNumericScore ? rawScore : null;
  const priorityConflicts = evaluations.filter((evaluation) => priorityCriteria.has(evaluation.criterionId) && evaluation.value === 0);
  let scoreBand = numericScore === null
    ? 'Datenlage ergänzen'
    : (criteriaData.scoreRules.scoreBands.find((band) => numericScore >= band.min && numericScore <= band.max)?.label ?? 'keine Empfehlung');
  if (priorityConflicts.length) scoreBand = 'Priorität nicht erfüllt';

  const sortedStrengths = known.filter((evaluation) => evaluation.value >= 0.5).sort((a, b) => (b.value * b.weight) - (a.value * a.weight));
  const weakest = known.slice().sort((a, b) => a.value - b.value)[0];
  const calculatedCompromise = weakest && weakest.value < 1 ? weakest.rationale : null;

  return {
    productId: product.productId,
    brand: product.identity.brand,
    model: product.identity.model,
    generation: product.identity.generation,
    priceEur: fact(product, 'requiredConfigurationPriceEur')?.value ?? null,
    marketStatus: fact(product, 'marketStatus')?.value ?? 'unknown',
    eligible: eligibilityResult.eligible,
    matchScore: numericScore,
    provisionalScore: rawScore,
    matchBand: scoreBand,
    dataCoverage,
    priorityConflicts: priorityConflicts.map((evaluation) => ({ criterionId: evaluation.criterionId, rationale: evaluation.rationale })),
    mustCriteria: eligibilityResult.passed,
    failures: eligibilityResult.failures,
    evaluations,
    reasons: sortedStrengths.slice(0, 3).map((evaluation) => evaluation.rationale),
    compromise: calculatedCompromise ?? product.editorial.tradeoffs[0],
    openChecks: unique([...eligibilityResult.openChecks, ...product.editorial.openChecks]),
    sourceCount: product.sources.length,
    sources: product.sources.map((source) => ({ id: source.id, title: source.title, url: source.url, kind: source.kind, checkedAt: source.checkedAt })),
    bestFor: product.editorial.bestFor,
    tradeoffs: product.editorial.tradeoffs,
    testingDisclosure: product.editorial.testingDisclosure
  };
}

export function matchStrollers({ answers, products, criteriaData }) {
  const route = routeFor(answers);
  if (route !== 'supported') return { modelVersion: criteriaData.modelVersion, route, results: [], excluded: [] };

  const scored = products.map((product) => {
    const eligibilityResult = eligibility(product, answers);
    return scoreProduct(product, answers, criteriaData, eligibilityResult);
  });

  const eligible = scored
    .filter((result) => result.eligible)
    .sort((a, b) => {
      const aScore = a.matchScore ?? -1;
      const bScore = b.matchScore ?? -1;
      if (bScore !== aScore) return bScore - aScore;
      if (b.dataCoverage !== a.dataCoverage) return b.dataCoverage - a.dataCoverage;
      return a.productId.localeCompare(b.productId);
    });

  const publishable = eligible.filter((result) => result.matchScore !== null && result.matchScore >= criteriaData.scoreRules.minimumScoreToRecommend && result.priorityConflicts.length === 0);
  const preliminary = eligible.filter((result) => !publishable.includes(result));

  return {
    modelVersion: criteriaData.modelVersion,
    route,
    results: publishable.slice(0, 3),
    preliminary,
    excluded: scored.filter((result) => !result.eligible),
    resultCount: publishable.length,
    catalogSize: products.length
  };
}

export const matcherInternals = {
  eligibility,
  permutationsFit,
  routeFor,
  applicableEvaluations,
  liftWeightFor
};
