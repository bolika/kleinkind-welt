#!/usr/bin/env node

// Prueft veroeffentlichte Kennzahlen gegen den Kinderwagen-Datensatz.
//
// Anlass: Am 14.08.2026 enthielten vier der sechs auf /kinderwagen
// veroeffentlichten "Befunde" eine falsche Zahl — unter anderem war der Median
// als Mittelwert bezeichnet und die Ersatzteil-Zahl widersprach der Tabelle auf
// derselben Seite. Zahlen sind das Einzige, womit diese Website Autoritaet
// aufbauen kann. Eine falsche Zahl in zitierfaehigem Material ist schaedlicher
// als gar keine Zahl.
//
// Verfahren: Jede Kennzahl wird aus data/kinderwagen-navigator/catalog.bundle
// neu berechnet. Ein Kontextmuster sucht die Aussage in allen HTML-Seiten und
// vergleicht die dort GESCHRIEBENE Zahl mit der berechneten. Damit schlaegt das
// Gate in beide Richtungen an: wenn der Datensatz sich aendert und wenn jemand
// die Zahl im Text verstellt.
//
// Zusaetzlich muss jede Kennzahl mindestens einmal gefunden werden. Sonst
// koennte eine Umformulierung die Pruefung stillschweigend aushebeln.
//
// Aufruf:
//   node tools/kinderwagen-kennzahlen-gate.mjs           Pruefung
//   node tools/kinderwagen-kennzahlen-gate.mjs --zeige   berechnete Werte

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const katalog = JSON.parse(fs.readFileSync(
  path.join(root, 'data/kinderwagen-navigator/catalog.bundle.v0.1.json'), 'utf8'));
const fahrzeuge = JSON.parse(fs.readFileSync(
  path.join(root, 'data/kinderwagen-navigator/vehicles.v0.1.json'), 'utf8')).vehicles;

const produkte = katalog.products;
const wert = (p, feld) => (p.facts?.[feld] ?? {}).value;
const status = (p, feld) => (p.facts?.[feld] ?? {}).status;
const preis = (p) => wert(p, 'requiredConfigurationPriceEur');

// --- Berechnung ---------------------------------------------------------------

const preise = produkte.map(preis).filter((v) => typeof v === 'number').sort((a, b) => a - b);
const mittel = preise.reduce((s, v) => s + v, 0) / preise.length;
const median = preise.length % 2
  ? preise[(preise.length - 1) / 2]
  : (preise[preise.length / 2 - 1] + preise[preise.length / 2]) / 2;

const unter500 = produkte.filter((p) => preis(p) < 500);
const ab500 = produkte.filter((p) => preis(p) >= 500);

// Der Datensatz unterscheidet drei Zustaende, und diese Unterscheidung ist der
// Kern der Glaubwuerdigkeit: true = enthalten, false = ausdruecklich nicht
// enthalten, fehlend = vom Hersteller nicht dokumentiert. "Fehlt" darf nur
// heissen, was ausdruecklich als nicht enthalten ausgewiesen ist.
const regen = (p) => wert(p, 'rainCoverIncluded');

const paare = produkte
  .map((p) => [wert(p, 'wheelDiameterRearCm'), wert(p, 'unfoldedWidthCm')])
  .filter(([a, b]) => typeof a === 'number' && typeof b === 'number');
const pearson = (xs, ys) => {
  const mx = xs.reduce((s, v) => s + v, 0) / xs.length;
  const my = ys.reduce((s, v) => s + v, 0) / ys.length;
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const den = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0)
    * ys.reduce((s, y) => s + (y - my) ** 2, 0));
  return num / den;
};
const korrelation = pearson(paare.map(([a]) => a), paare.map(([, b]) => b));

const tCross = fahrzeuge.find((f) => f.id === 'vw-t-cross-current');
const ladeboden = tCross.cargo.floorLengthSecondRowCm;
const groessteKante = (p) => {
  const fd = wert(p, 'foldedDimensionsCm');
  if (!fd || typeof fd !== 'object') return null;
  return Math.max(...Object.values(fd).filter((v) => typeof v === 'number'));
};
const ueberLadeboden = produkte.filter((p) => (groessteKante(p) ?? 0) > ladeboden);

const garantien = produkte.map((p) => wert(p, 'warrantyYears')).filter((v) => typeof v === 'number');
const myJuniorZehn = produkte.filter((p) =>
  p.identity?.brand === 'my junior' && wert(p, 'warrantyYears') === 10);
const ohneGarantie = produkte.filter((p) => typeof wert(p, 'warrantyYears') !== 'number');
const ersatzteileOffen = produkte.filter((p) => status(p, 'sparePartsAvailability') !== 'officially_documented');
const rueckrufOffen = produkte.filter((p) => status(p, 'officialSafetyNoticeStatus') !== 'officially_documented');

// --- Zahlwoerter -------------------------------------------------------------

const WOERTER = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben',
  'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn',
  'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn', 'zwanzig'];

// Aus dem Text gelesene Zahl vereinheitlichen: "Sechs", "sechs", "6" -> 6.
const alsZahl = (roh) => {
  const t = roh.trim().toLowerCase().replace(/\.$/, '');
  const i = WOERTER.indexOf(t === 'eine' || t === 'einem' || t === 'einer' ? 'ein' : t);
  if (i >= 0) return i;
  const n = Number(t.replace(/\./g, '').replace(',', '.'));
  return Number.isNaN(n) ? null : n;
};

// --- Kennzahlen und ihre Aussagen im Text ------------------------------------

const ZAHL = '([0-9]+(?:[.,][0-9]+)?|[A-Za-zÄÖÜäöüß]+)';

const KENNZAHLEN = [
  {
    id: 'preis-min',
    wert: preise[0],
    muster: new RegExp(`[Vv]on ${ZAHL} ?(?:Euro|€) bis`, 'g'),
  },
  {
    // An 179 gebunden, sonst wuerde das Muster auf den Spielzeugseiten jedes
    // "bis 20 Euro" einsammeln und falschen Alarm schlagen.
    id: 'preis-max',
    wert: preise.at(-1),
    muster: new RegExp(`179 ?(?:Euro|€) bis ${ZAHL}`, 'g'),
  },
  {
    id: 'preis-median',
    wert: Math.round(median),
    muster: new RegExp(`Median (?:von |liegt bei |bei )?(?:rund )?${ZAHL} ?(?:Euro|€)`, 'g'),
  },
  {
    id: 'preis-mittelwert',
    wert: Math.round(mittel),
    muster: new RegExp(`Mittelwert (?:von |liegt bei |bei )?(?:rund )?${ZAHL} ?(?:Euro|€)`, 'g'),
  },
  {
    id: 'preis-600-bis-700',
    wert: preise.filter((v) => v > 600 && v < 700).length,
    muster: new RegExp(`liegt nur ${ZAHL} einziges der 20 Modelle`, 'g'),
  },
  {
    id: 'unter-500-babywanne',
    wert: unter500.filter((p) => wert(p, 'carrycotIncluded') === true).length,
    muster: new RegExp(`${ZAHL} Modelle unter 500 ?(?:Euro|€) enthalten eine Babywanne`, 'g'),
  },
  {
    id: 'unter-500-regenschutz',
    wert: unter500.filter((p) => regen(p) === true).length,
    muster: new RegExp(`bei ${ZAHL} davon (?:ist|kommt) (?:zusätzlich )?(?:auch )?ein Regenschutz`, 'g'),
  },
  {
    id: 'ab-500-ohne-regenschutz',
    wert: ab500.filter((p) => regen(p) === false).length,
    muster: new RegExp(`(?:Bei|bei) ${ZAHL} Modellen ab 500 ?(?:Euro|€) (?:weist|ist)`, 'g'),
  },
  {
    // Nur was der Hersteller ausdruecklich als nicht enthalten ausweist. Der
    // Unterschied zu "nicht dokumentiert" ist die Glaubwuerdigkeit der Website.
    id: 'ab-500-regenschutz-undokumentiert',
    wert: ab500.filter((p) => regen(p) === undefined || regen(p) === null).length,
    muster: new RegExp(`Bei ${ZAHL} weiteren ist der Regenschutz gar nicht dokumentiert`, 'g'),
  },
  {
    id: 'teuerste-ohne-regenschutz',
    wert: produkte.filter((p) => preis(p) === preise.at(-1) && regen(p) === false).length,
    muster: new RegExp(`${ZAHL} (?:davon )?für je 1299`, 'g'),
  },
  {
    id: 'korrelation',
    wert: Math.round(korrelation * 100),
    muster: new RegExp(`Korrelation \\+0,${ZAHL}`, 'g'),
  },
  {
    id: 'korrelation-n',
    wert: paare.length,
    muster: new RegExp(`über die ${ZAHL} Modelle, für die beide Angaben`, 'g'),
  },
  {
    id: 'faltkante-anzahl',
    wert: ueberLadeboden.length,
    muster: new RegExp(`${ZAHL} von 20 Modellen (?:haben|hat) eine größte Faltkante`, 'g'),
  },
  {
    id: 'ladeboden-cm',
    wert: ladeboden,
    muster: new RegExp(`Faltkante über ${ZAHL} ?cm`, 'g'),
  },
  {
    id: 'garantie-faktor',
    wert: Math.round(Math.max(...garantien) / Math.min(...garantien)),
    muster: new RegExp(`Garantiedauer schwankt um den Faktor ${ZAHL}`, 'g'),
  },
  {
    id: 'my-junior-zehn-jahre',
    wert: myJuniorZehn.length,
    muster: new RegExp(`${ZAHL} Modelle von my junior nennen zehn Jahre`, 'g'),
  },
  {
    id: 'ohne-garantieangabe',
    wert: ohneGarantie.length,
    muster: new RegExp(`bei ${ZAHL} Modellen ist keine (?:Garantie)?[Dd]auer dokumentiert`, 'g'),
  },
  {
    id: 'ersatzteile-offen',
    wert: ersatzteileOffen.length,
    muster: new RegExp(`${ZAHL} (?:von|der) (?:20|zwanzig) (?:von uns erfassten )?Modellen? ist die Ersatzteilversorgung offiziell nicht dokumentiert`, 'g'),
  },
  {
    id: 'rueckruf-offen',
    wert: rueckrufOffen.length,
    muster: new RegExp(`für keines der ${ZAHL} Modelle`, 'g'),
  },
];

if (process.argv.includes('--zeige')) {
  console.log('Berechnete Kennzahlen aus dem Datensatz:\n');
  for (const k of KENNZAHLEN) console.log(`  ${k.id.padEnd(26)} ${k.wert}`);
  console.log(`\n  Modelle im Datensatz       ${produkte.length}`);
  console.log(`  Preise erfasst             ${preise.length}`);
  console.log(`  Mittelwert exakt           ${mittel.toFixed(2)}`);
  console.log(`  Median exakt               ${median.toFixed(2)}`);
  console.log(`  Korrelation exakt          ${korrelation.toFixed(3)} (n=${paare.length})`);
  console.log(`  T-Cross Ladeboden          ${ladeboden} cm`);
  process.exit(0);
}

// --- Pruefung ----------------------------------------------------------------

const seiten = [];
const sammle = (verzeichnis) => {
  for (const eintrag of fs.readdirSync(verzeichnis, { withFileTypes: true })) {
    const voll = path.join(verzeichnis, eintrag.name);
    if (eintrag.isDirectory()) {
      if (['node_modules', '.git', 'claude-seo', 'docs', 'freebies', 'playwright-report',
           'kleinkind-welt.de-audit', 'test-results'].includes(eintrag.name)) continue;
      sammle(voll);
    } else if (eintrag.name.endsWith('.html')) {
      seiten.push(path.relative(root, voll));
    }
  }
};
sammle(root);

const fehler = [];
const gefunden = new Map(KENNZAHLEN.map((k) => [k.id, 0]));

for (const seite of seiten) {
  // Tags entfernen, damit Kennzahlen im sichtbaren Text und im JSON-LD gleich
  // geprueft werden. Beides wird veroeffentlicht, beides muss stimmen.
  const text = fs.readFileSync(path.join(root, seite), 'utf8')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\\u[0-9a-fA-F]{4}/g, ' ')
    .replace(/\s+/g, ' ');

  for (const k of KENNZAHLEN) {
    for (const treffer of text.matchAll(k.muster)) {
      gefunden.set(k.id, gefunden.get(k.id) + 1);
      const geschrieben = alsZahl(treffer[1]);
      if (geschrieben === null) {
        fehler.push(`${seite}: ${k.id} — "${treffer[1]}" ist keine lesbare Zahl in "${treffer[0].trim()}"`);
      } else if (Math.abs(geschrieben - k.wert) > 0.01) {
        fehler.push(`${seite}: ${k.id} — geschrieben ${geschrieben}, `
          + `aus dem Datensatz berechnet ${k.wert}  ·  "${treffer[0].trim()}"`);
      }
    }
  }
}

for (const [id, anzahl] of gefunden) {
  if (anzahl === 0) {
    fehler.push(`Kennzahl ${id} kommt site-weit nicht mehr vor — `
      + `entweder wurde die Aussage entfernt oder umformuliert. `
      + `Muster anpassen oder Aussage wiederherstellen.`);
  }
}

if (fehler.length) {
  fehler.forEach((f) => console.error(`ERROR ${f}`));
  process.exit(1);
}

const summe = [...gefunden.values()].reduce((s, v) => s + v, 0);
console.log(`Kinderwagen-Kennzahlen bestanden: ${KENNZAHLEN.length} Kennzahlen, `
  + `${summe} Textstellen gegen ${produkte.length} Datensätze geprüft.`);
