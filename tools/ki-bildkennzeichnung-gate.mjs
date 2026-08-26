#!/usr/bin/env node

// Prueft das risikobasierte Herkunfts- und Kennzeichnungsregister fuer Bilder.
//
// Die Regeln sind eine interne Arbeitsbewertung und keine Rechtsberatung. Das
// Gate entscheidet nicht selbst, ob eine gesetzliche Kennzeichnungspflicht
// besteht. Es erzwingt nachvollziehbare Metadaten und behandelt eine noch nicht
// menschlich freigegebene Reduktion konservativ wie "Badge beibehalten".
//
// Geprueft wird:
//   1. Jedes verwendete lokale Rasterbild ist im Herkunftsregister eingeordnet.
//   2. Jedes KI-Motiv hat Git-Evidenz, Risikoklasse, Arbeitsvorschlag und einen
//      expliziten Status der menschlichen Einzelfallfreigabe.
//   3. Die datierte Bestandsbaseline schuetzt vorhandene Hinweise. Bei Motiven,
//      die nach dem Stichtag entstehen, greift zusaetzlich die Risikologik.
//   4. Eine spaeter freigegebene zentrale Offenlegung braucht auf jeder
//      betroffenen Seite einen sichtbaren .ki-herkunft-hinweis.
//   5. Die Vorschaugrafik enthaelt weiterhin keinen fotorealistischen Anteil.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const register = JSON.parse(fs.readFileSync(path.join(root, 'data/bildherkunft.json'), 'utf8'));
const fehler = [];
const pruefe = (bedingung, meldung) => { if (!bedingung) fehler.push(meldung); };

const BADGE = 'ki-badge';
const ZENTRALER_HINWEIS = 'ki-herkunft-hinweis';
const RISIKOKLASSEN = new Set(['niedrig', 'mittel', 'hoch']);
const VORSCHLAEGE = new Set(['badge-beibehalten', 'zentral-offenlegen', 'manuell-pruefen']);
const FREIGABESTATUS = new Set(['nicht-aus-git-ableitbar', 'freigegeben', 'abgelehnt']);

const istIsoDatum = (wert) => typeof wert === 'string'
  && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(wert)
  && !Number.isNaN(Date.parse(wert));

const schemaMajor = Number.parseInt(String(register.schemaVersion ?? '').split('.')[0], 10);
pruefe(schemaMajor >= 2, 'bildherkunft.json braucht schemaVersion 2 oder neuer');
pruefe(typeof register.arbeitsbewertung === 'string'
  && register.arbeitsbewertung.includes('keine Rechtsberatung'),
'Das Register muss die Einordnung ausdruecklich als Arbeitsbewertung und nicht als Rechtsberatung bezeichnen');
pruefe(/^\d{4}-\d{2}-\d{2}$/.test(register.stichtagArbeitsbewertung ?? ''),
  'stichtagArbeitsbewertung fehlt oder ist ungueltig');

const gruppen = register.gruppen ?? {};
const kiGruppe = gruppen.ki_generiert ?? {};
const motive = kiGruppe.motive ?? {};
const motiveMetadaten = kiGruppe.motiveMetadaten ?? {};
const gitEvidenz = register.gitEvidenz ?? {};
const badgeBaseline = register.sichtbareBadgeBaseline ?? {};
const baselineSeiten = badgeBaseline.seiten ?? {};
const baselineBadgeAnzahl = Object.values(baselineSeiten)
  .reduce((summe, anzahl) => summe + (Number.isInteger(anzahl) ? anzahl : 0), 0);
const stichtag = Date.parse(`${register.stichtagArbeitsbewertung}T00:00:00Z`);

pruefe(/^\d{4}-\d{2}-\d{2}$/.test(badgeBaseline.erfasstAm ?? ''),
  'sichtbareBadgeBaseline braucht ein gueltiges Erfassungsdatum');
pruefe(typeof badgeBaseline.zweck === 'string' && badgeBaseline.zweck.length > 40,
  'sichtbareBadgeBaseline braucht eine nachvollziehbare Begruendung');
for (const [seite, anzahl] of Object.entries(baselineSeiten)) {
  pruefe(Number.isInteger(anzahl) && anzahl > 0,
    `${seite}: Badge-Baseline muss eine positive Ganzzahl sein`);
  pruefe(fs.existsSync(path.join(root, seite)), `${seite}: Seite aus Badge-Baseline fehlt`);
}

pruefe(Object.keys(motive).length > 0, 'Keine KI-Motive im Register vorhanden');
pruefe(Object.keys(motive).length === Object.keys(motiveMetadaten).length,
  'KI-Motive und motiveMetadaten muessen dieselbe Anzahl Eintraege haben');

const dateiZuGruppe = new Map();
const dateiZuKiMotiv = new Map();

const registriereDatei = (datei, gruppe, motiv = null) => {
  const basis = path.basename(datei);
  pruefe(!dateiZuGruppe.has(basis), `${basis} ist im Herkunftsregister mehrfach eingeordnet`);
  dateiZuGruppe.set(basis, gruppe);
  if (motiv) dateiZuKiMotiv.set(basis, motiv);
};

for (const [gruppenname, gruppe] of Object.entries(gruppen)) {
  pruefe(typeof gruppe.begruendung === 'string' && gruppe.begruendung.length > 20,
    `Gruppe ${gruppenname} im Register hat keine belastbare Begruendung`);
  for (const datei of gruppe.dateien ?? []) registriereDatei(datei, gruppenname);
}

for (const [name, dateien] of Object.entries(motive)) {
  pruefe(Array.isArray(dateien) && dateien.length > 0,
    `KI-Motiv ${name} hat keine Dateien`);
  for (const datei of dateien ?? []) registriereDatei(datei, 'ki_generiert', name);

  const meta = motiveMetadaten[name];
  pruefe(!!meta, `KI-Motiv ${name} hat keine pruefbaren Metadaten`);
  if (!meta) continue;

  const zeit = meta.entstehungszeit ?? {};
  pruefe(zeit.actualCreatedAt === null || istIsoDatum(zeit.actualCreatedAt),
    `KI-Motiv ${name}: actualCreatedAt muss null oder ein ISO-Zeitpunkt sein`);
  pruefe(istIsoDatum(zeit.repositoryFirstSeenAt),
    `KI-Motiv ${name}: repositoryFirstSeenAt fehlt oder ist ungueltig`);
  pruefe(zeit.evidenceType === 'git-first-seen',
    `KI-Motiv ${name}: evidenceType muss git-first-seen sein`);
  pruefe(/^[0-9a-f]{40}$/.test(zeit.evidenceCommit ?? ''),
    `KI-Motiv ${name}: evidenceCommit ist keine vollstaendige Git-SHA`);

  const ersterCommit = gitEvidenz[zeit.evidenceCommit];
  pruefe(!!ersterCommit, `KI-Motiv ${name}: evidenceCommit fehlt in gitEvidenz`);
  if (ersterCommit && istIsoDatum(zeit.repositoryFirstSeenAt)) {
    pruefe(ersterCommit.committedAt === zeit.repositoryFirstSeenAt,
      `KI-Motiv ${name}: repositoryFirstSeenAt stimmt nicht mit gitEvidenz ueberein`);
    pruefe(zeit.beforeStichtag === (Date.parse(zeit.repositoryFirstSeenAt) < stichtag),
      `KI-Motiv ${name}: beforeStichtag stimmt nicht mit repositoryFirstSeenAt ueberein`);
  }

  pruefe(RISIKOKLASSEN.has(meta.risikoklasse),
    `KI-Motiv ${name}: unbekannte Risikoklasse ${meta.risikoklasse}`);
  pruefe(Array.isArray(meta.risikofaktoren) && meta.risikofaktoren.length > 0,
    `KI-Motiv ${name}: Risikofaktoren fehlen`);
  pruefe(VORSCHLAEGE.has(meta.arbeitsvorschlag),
    `KI-Motiv ${name}: unbekannter Arbeitsvorschlag ${meta.arbeitsvorschlag}`);
  pruefe(!(meta.risikoklasse === 'hoch' && meta.arbeitsvorschlag === 'zentral-offenlegen'),
    `KI-Motiv ${name}: hohes Risiko darf nicht automatisch nur zentral offengelegt werden`);

  const freigabe = meta.menschlicheFreigabe ?? {};
  pruefe(FREIGABESTATUS.has(freigabe.status),
    `KI-Motiv ${name}: Status der menschlichen Freigabe fehlt oder ist unbekannt`);
  pruefe(/^[0-9a-f]{40}$/.test(freigabe.evidenceCommit ?? '')
    && !!gitEvidenz[freigabe.evidenceCommit],
  `KI-Motiv ${name}: Freigabe-Evidenz ist nicht im Register belegt`);

  if (freigabe.status === 'freigegeben') {
    pruefe(typeof freigabe.reviewedBy === 'string' && freigabe.reviewedBy.trim().length > 0,
      `KI-Motiv ${name}: Freigabe braucht reviewedBy`);
    pruefe(istIsoDatum(freigabe.reviewedAt),
      `KI-Motiv ${name}: Freigabe braucht reviewedAt als ISO-Zeitpunkt`);
  } else {
    pruefe(freigabe.reviewedBy === null && freigabe.reviewedAt === null,
      `KI-Motiv ${name}: Ohne Freigabe muessen reviewedBy und reviewedAt null bleiben`);
  }
}

for (const name of Object.keys(motiveMetadaten)) {
  pruefe(Object.hasOwn(motive, name),
    `motiveMetadaten enthaelt unbekanntes KI-Motiv ${name}`);
}

const brauchtDirektenBadge = (name) => {
  const meta = motiveMetadaten[name];
  if (!meta) return true;
  if (meta.risikoklasse === 'hoch') return true;
  if (meta.arbeitsvorschlag !== 'zentral-offenlegen') return true;
  return meta.menschlicheFreigabe?.status !== 'freigegeben';
};

const seiten = [];
const sammle = (verzeichnis) => {
  for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
    const voll = path.join(verzeichnis, eintrag.name);
    const rel = path.relative(root, voll);
    if (eintrag.isDirectory()) {
      if (['node_modules', '.git', 'claude-seo', 'docs', 'freebies',
        'playwright-report', 'kleinkind-welt.de-audit', 'test-results'].includes(eintrag.name)) continue;
      sammle(voll);
    } else if (eintrag.name.endsWith('.html')) {
      seiten.push(rel);
    }
  }
};
sammle(root);

const bildDateienImBlock = (text) => {
  const dateien = new Set();
  for (const treffer of text.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    for (const kandidat of treffer[1].split(',')) {
      const url = kandidat.trim().split(/\s+/)[0];
      if (!url || /^(?:https?:|data:|\/\/)/.test(url)) continue;
      const ohneQuery = url.split(/[?#]/)[0];
      if (/\.(jpg|jpeg|png|webp)$/i.test(ohneQuery)) dateien.add(path.basename(ohneQuery));
    }
  }
  return dateien;
};

let gepruefteKiEinbindungen = 0;
let direktKennzeichnungspflichtigeEinbindungen = 0;
let zentralFreigegebeneEinbindungen = 0;
const verwendeteBilder = new Set();

for (const seite of seiten) {
  const html = fs.readFileSync(path.join(root, seite), 'utf8');
  const bloecke = [];

  for (const m of html.matchAll(/<picture\b[\s\S]*?<\/picture>/g)) {
    bloecke.push({ start: m.index, ende: m.index + m[0].length, text: m[0] });
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (bloecke.some((block) => block.start <= m.index && m.index < block.ende)) continue;
    bloecke.push({ start: m.index, ende: m.index + m[0].length, text: m[0] });
  }

  let neueDirekteHinweise = 0;
  let brauchtZentralenHinweis = false;

  for (const block of bloecke) {
    const dateien = bildDateienImBlock(block.text);
    for (const datei of dateien) verwendeteBilder.add(datei);

    const kiMotive = new Set([...dateien].map((datei) => dateiZuKiMotiv.get(datei)).filter(Boolean));
    if (!kiMotive.size) continue;
    gepruefteKiEinbindungen += 1;

    const metadaten = [...kiMotive].map((name) => motiveMetadaten[name]).filter(Boolean);
    const nachStichtag = metadaten.some((meta) => meta.entstehungszeit?.beforeStichtag === false);
    if (nachStichtag && [...kiMotive].some(brauchtDirektenBadge)) {
      neueDirekteHinweise += 1;
      direktKennzeichnungspflichtigeEinbindungen += 1;
    } else if (metadaten.length && metadaten.every((meta) =>
      meta.arbeitsvorschlag === 'zentral-offenlegen'
      && meta.menschlicheFreigabe?.status === 'freigegeben')) {
      brauchtZentralenHinweis = true;
      zentralFreigegebeneEinbindungen += 1;
    }
  }

  const benoetigteBadges = (baselineSeiten[seite] ?? 0) + neueDirekteHinweise;
  const badges = (html.match(/class="[^"]*\bki-badge\b[^"]*"/g) ?? []).length;
  pruefe(badges >= benoetigteBadges,
    `${seite}: ${benoetigteBadges} direkte KI-Hinweise erforderlich, aber nur ${badges} vorhanden`);

  if (brauchtZentralenHinweis) {
    pruefe(new RegExp(`class="[^"]*\\b${ZENTRALER_HINWEIS}\\b[^"]*"[^>]*>\\s*\\S`).test(html),
      `${seite}: freigegebene zentrale Offenlegung braucht sichtbaren .${ZENTRALER_HINWEIS}`);
  }
}

for (const seite of Object.keys(baselineSeiten)) {
  pruefe(seiten.includes(seite), `${seite}: Badge-Baseline verweist nicht auf eine gepruefte HTML-Seite`);
}

pruefe(gepruefteKiEinbindungen > 0,
  'Keine registrierte KI-Bild-Einbindung gefunden - die Pruefung greift ins Leere');

for (const datei of [...verwendeteBilder].sort()) {
  pruefe(dateiZuGruppe.has(datei),
    `${datei} ist verwendet, aber in data/bildherkunft.json nicht eingeordnet`);
}

if (baselineBadgeAnzahl + direktKennzeichnungspflichtigeEinbindungen > 0) {
  const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
  const badgeRegel = new RegExp(`\\.${BADGE}\\s*\\{[^}]*\\}`).exec(css);
  pruefe(!!badgeRegel, `CSS-Regel .${BADGE} fehlt`);
  if (badgeRegel) {
    pruefe(!/content\s*:/.test(badgeRegel[0]),
      `.${BADGE} darf den Hinweis nicht per CSS-content erzeugen`);
  }
  const irgendwoText = seiten.some((seite) =>
    new RegExp(`class="[^"]*\\b${BADGE}\\b[^"]*"[^>]*>\\s*\\S`)
      .test(fs.readFileSync(path.join(root, seite), 'utf8')));
  pruefe(irgendwoText, `Kein .${BADGE} enthaelt sichtbaren Text`);
}

pruefe(gruppen.og_grafik?.kennzeichnung === 'Foto-Anteil entfernt',
  'Das Register muss festhalten, dass die Vorschaugrafik keinen fotorealistischen Inhalt enthaelt');

if (fehler.length) {
  fehler.forEach((meldung) => console.error(`ERROR ${meldung}`));
  process.exit(1);
}

console.log(`KI-Herkunftsgate bestanden: ${gepruefteKiEinbindungen} KI-Einbindungen, `
  + `${baselineBadgeAnzahl} geschuetzte Bestandsbadges, `
  + `${direktKennzeichnungspflichtigeEinbindungen} neue direkte Hinweise nach Stichtag, `
  + `${zentralFreigegebeneEinbindungen} zentral freigegeben, `
  + `${verwendeteBilder.size} verwendete lokale Rasterbilder eingeordnet.`);
