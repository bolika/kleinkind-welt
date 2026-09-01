#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

const affiliate = read('js/affiliate-tracking.js');
const newsletter = read('js/newsletter-form.js');
const toolsPage = read('kaufhilfen.html');
const confirmation = read('newsletter-bestaetigt.html');

for (const property of ['seite', 'produkt', 'produkt_id', 'platzierung', 'partner', 'haendler', 'angebot', 'ziel_host', 'event_schema']) {
  check(affiliate.includes(`${property}:`), `Affiliate-Klick: Property ${property} fehlt.`);
}
check(affiliate.includes("event_schema: '3'"), 'Affiliate-Klick: Schema muss Version 3 sein.');
for (const eventName of ['Affiliate-Babywalz', 'Affiliate-Amazon', 'Affiliate-Anderer-Haendler']) {
  check(affiliate.includes(`'${eventName}'`), `${eventName}: Händler-Event fehlt.`);
}
check(affiliate.includes('{ interactive: false }'), 'Händler-Aufschlüsselung muss als nicht-interaktives Zusatzereignis gesendet werden.');

for (const [file, source] of [['js/newsletter-form.js', newsletter], ['kaufhilfen.html', toolsPage]]) {
  check(source.includes("plausible('Newsletter-Formular'"), `${file}: Newsletter-Formular-Event fehlt.`);
  for (const property of ['seite', 'platzierung', 'status', 'segment', 'quelle', 'event_schema']) {
    check(source.includes(`${property}:`), `${file}: Newsletter-Property ${property} fehlt.`);
  }
  check(source.includes("event_schema: '2'"), `${file}: Newsletter-Formular muss Schema 2 verwenden.`);
}

check(confirmation.includes("plausible('Newsletter bestätigt'"), 'DOI-Bestätigungs-Event fehlt.');
check(confirmation.includes("plausible('Freebie Download'"), 'Freebie-Download-Event fehlt.');
check((confirmation.match(/event_schema: '1'/g) ?? []).length >= 2, 'Bestätigung und Download müssen Schema 1 verwenden.');
check(fs.existsSync(path.join(root, 'docs/analytics-event-taxonomy.md')), 'Dokumentierte Event-Taxonomie fehlt.');

if (errors.length) {
  console.error(`Analytics-Contract-Gate fehlgeschlagen (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Analytics-Contract-Gate bestanden: Affiliate-, Händler-, Newsletter-, DOI- und Download-Events sind versioniert.');
