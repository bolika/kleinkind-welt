#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recordPath = path.join(root, 'data/product-experience/stapelbecher.v0.1.json');
const mappingPath = path.join(root, 'data/affiliate-offers/babywalz.mapping.v0.1.json');
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
const html = fs.readFileSync(path.join(root, record.page), 'utf8');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const isDate = (value) => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const isText = (value) => typeof value === 'string' && value.trim().length > 0;

const allowedStatuses = new Set(['planned', 'observing', 'approved', 'retired']);
const offer = mapping.mappings.find((entry) => entry.productId === record.productId);
const evidencePattern = new RegExp(
  `<[^>]+data-evidence-id=["']${record.evidenceId}["'][^>]*>`,
  'i'
);
const evidenceTag = html.match(evidencePattern)?.[0] ?? '';

check(record.schemaVersion === 1, 'Erfahrungsdatensatz braucht schemaVersion 1.');
check(allowedStatuses.has(record.status), `Unbekannter Pilotstatus: ${record.status}`);
check(offer, `Kein Affiliate-Mapping für ${record.productId} gefunden.`);
check(record.identity?.title === offer?.title, 'Produktname stimmt nicht mit dem exakten Feed-Mapping überein.');
check(record.identity?.merchantProductId === offer?.merchantProductIds?.[0], 'Babywalz-Artikelnummer stimmt nicht überein.');
check(record.identity?.gtin === offer?.gtins?.[0], 'GTIN stimmt nicht mit dem Feed-Mapping überein.');
check(record.method?.minimumObservationDays >= 7, 'Der Pilot braucht mindestens sieben Beobachtungstage.');
check(record.method?.minimumSessions >= 3, 'Der Pilot braucht mindestens drei dokumentierte Situationen.');
check((record.method?.requiredContexts ?? []).length >= 3, 'Drei unterschiedliche Nutzungskontexte sind erforderlich.');
check((record.method?.requiredContexts ?? []).every((context) => isText(context.id) && isText(context.label)),
  'Jeder Nutzungskontext braucht ID und Bezeichnung.');
check(record.method?.minimumOwnedPhotos >= 3, 'Mindestens drei eigene Fotos sind erforderlich.');
check(record.privacy?.childNameStored === false, 'Kindernamen dürfen nicht gespeichert werden.');
check(record.privacy?.recognizableChildFaceAllowed === false, 'Erkennbare Kindergesichter sind für den Pilot nicht freigegeben.');
check(record.privacy?.preciseBirthDateStored === false, 'Exakte Geburtsdaten dürfen nicht gespeichert werden.');
check(evidenceTag, `Evidenzhinweis ${record.evidenceId} fehlt auf der Pilotseite.`);

if (record.status !== 'approved') {
  check(/data-evidence-type=["']editorial-assessment["']/i.test(evidenceTag),
    'Vor Freigabe muss die sichtbare Evidenzart redaktionelle Einordnung bleiben.');
  check(/kein eigener Produkttest/i.test(html),
    'Vor Freigabe muss die Seite ausdrücklich auf den fehlenden eigenen Produkttest hinweisen.');
  check(!/data-evidence-type=["']first-hand-observation["']/i.test(html),
    'Eigene Erfahrung darf vor Freigabe nicht als Evidenzart erscheinen.');
} else {
  const observations = record.observations ?? {};
  const approval = record.approval ?? {};
  const sessions = observations.sessions ?? [];
  const photos = observations.photos ?? [];
  check(observations.ownershipConfirmed === true, 'Freigabe braucht bestätigten Besitz des exakten Produkts.');
  check(isText(observations.acquisitionSource), 'Bezugsquelle fehlt.');
  check(isDate(observations.acquisitionDate), 'Kauf- oder Bezugsdatum fehlt.');
  check(isDate(observations.startDate), 'Beobachtungsstart fehlt.');
  check(isDate(observations.endDate), 'Beobachtungsende fehlt.');
  if (isDate(observations.startDate) && isDate(observations.endDate)) {
    const days = Math.floor((Date.parse(`${observations.endDate}T00:00:00Z`)
      - Date.parse(`${observations.startDate}T00:00:00Z`)) / 86400000) + 1;
    check(days >= record.method.minimumObservationDays,
      `Beobachtungszeitraum umfasst nur ${days} statt ${record.method.minimumObservationDays} Kalendertage.`);
  }
  check(isText(observations.participantAgeBand), 'Eine grobe Altersgruppe fehlt.');
  check(sessions.length >= record.method.minimumSessions, 'Zu wenige Beobachtungssituationen.');
  const requiredContextIds = new Set(record.method.requiredContexts.map((context) => context.id));
  const observedContextIds = new Set(sessions.map((session) => session.contextId));
  for (const contextId of requiredContextIds) {
    check(observedContextIds.has(contextId), `Pflichtkontext ${contextId} wurde nicht dokumentiert.`);
  }
  for (const [index, session] of sessions.entries()) {
    check(isDate(session.date), `Situation ${index + 1}: Datum fehlt.`);
    check(requiredContextIds.has(session.contextId), `Situation ${index + 1}: unbekannter Kontext.`);
    for (const field of ['whatWorked', 'assistance', 'cleaning', 'limits']) {
      check(isText(session[field]), `Situation ${index + 1}: Feld ${field} fehlt.`);
    }
  }
  check(photos.length >= record.method.minimumOwnedPhotos, 'Zu wenige eigene Fotos.');
  for (const [index, photo] of photos.entries()) {
    check(isText(photo.file), `Foto ${index + 1}: Dateipfad fehlt.`);
    check(isDate(photo.capturedAt), `Foto ${index + 1}: Aufnahmedatum fehlt.`);
    check(photo.rightsStatus === 'owned_original', `Foto ${index + 1}: eigene Bildrechte fehlen.`);
    check(photo.childFaceVisible === false, `Foto ${index + 1}: erkennbares Kindergesicht ist nicht erlaubt.`);
  }
  check(record.sourceEvidence?.ageClaimVerifiedOnOwnedProduct === true,
    'Die Altersangabe muss am konkreten Produkt geprüft sein.');
  check(approval.status === 'approved' && isText(approval.reviewedBy)
    && typeof approval.reviewedAt === 'string' && !Number.isNaN(Date.parse(approval.reviewedAt)),
    'Die Betreiberfreigabe ist unvollständig.');
  check(/data-evidence-type=["']first-hand-observation["']/i.test(evidenceTag),
    'Freigegebene Eigenerfahrung muss auf der Seite als solche ausgezeichnet sein.');
  check(/Eigene Erfahrung mit diesem Produkt/i.test(html),
    'Der sichtbare Hinweis auf eigene Erfahrung fehlt.');
}

if (errors.length) {
  console.error(`Erfahrungs-Pilot-Gate fehlgeschlagen (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Erfahrungs-Pilot-Gate bestanden: ${record.identity.title} bleibt im Status ${record.status} korrekt gekennzeichnet.`);
