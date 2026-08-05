#!/usr/bin/env node

// Prueft die Kennzeichnung KI-generierter Bilder.
//
// Rechtsgrundlage: Artikel 50 Absatz 4 der Verordnung (EU) 2024/1689, anwendbar
// ab 02.08.2026. Fotorealistisch mit KI erzeugte Bilder gelten nach Artikel 3
// Nummer 60 als Deepfake, auch wenn keine real existierende Person abgebildet
// ist. Anders als beim Text gibt es fuer Bilder KEINE redaktionelle Ausnahme.
//
// Geprueft wird:
//   1. Jedes verwendete Rasterbild ist in data/bildherkunft.json eingeordnet.
//      Ein neues Bild ohne Eintrag laesst das Gate scheitern — die Einordnung
//      soll man nicht vergessen koennen.
//   2. Jede Einbindung eines KI-Bildes traegt einen sichtbaren Hinweis im DOM.
//   3. Der Hinweis ist echter Text, kein CSS-generierter Inhalt: Er muss ohne
//      Hilfsmittel wahrnehmbar sein.
//   4. Die Vorschaugrafik enthaelt keinen fotorealistischen Inhalt, weil auf
//      fremden Plattformen kein Label angebracht werden kann.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const register = JSON.parse(fs.readFileSync(path.join(root, 'data/bildherkunft.json'), 'utf8'));
const fehler = [];
const pruefe = (bedingung, meldung) => { if (!bedingung) fehler.push(meldung); };

const BADGE = 'ki-badge';
const KI_PRAEFIXE = [/images\/articles\//, /images\/hero-/];
const AUSGENOMMEN = ['autor-boris', 'Lauflernwagen', 'logo-', 'favicon',
                     'apple-touch', 'og-kleinkind', 'amazon-adsystem', 'siegel'];

const istKiBild = (block) => {
  if (AUSGENOMMEN.some((x) => block.includes(x))) return false;
  return KI_PRAEFIXE.some((p) => p.test(block));
};

// Alle HTML-Seiten der Website einsammeln
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

// --- 1. und 2.: Einbindungen pruefen -----------------------------------------
let gepruefteEinbindungen = 0;
const verwendeteBilder = new Set();

for (const seite of seiten) {
  const html = fs.readFileSync(path.join(root, seite), 'utf8');

  // picture-Bloecke und freistehende img-Tags als Bloecke behandeln
  const bloecke = [];
  for (const m of html.matchAll(/<picture\b[\s\S]*?<\/picture>/g)) {
    bloecke.push({ start: m.index, ende: m.index + m[0].length, text: m[0] });
  }
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (bloecke.some((b) => b.start <= m.index && m.index < b.ende)) continue;
    bloecke.push({ start: m.index, ende: m.index + m[0].length, text: m[0] });
  }

  for (const block of bloecke) {
    for (const treffer of block.text.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
      for (const kandidat of treffer[1].split(',')) {
        const datei = kandidat.trim().split(/\s+/)[0];
        if (/^https?:/.test(datei)) continue;
        if (/\.(jpg|jpeg|png|webp)$/i.test(datei)) {
          verwendeteBilder.add(path.basename(datei));
        }
      }
    }
    if (!istKiBild(block.text)) continue;
    gepruefteEinbindungen += 1;
    const danach = html.slice(block.ende, block.ende + 200);
    pruefe(danach.includes(BADGE),
      `${seite}: KI-Bild ohne sichtbaren Hinweis (${(block.text.match(/images\/[^"\s,]+/) ?? ['?'])[0]})`);
  }
}
pruefe(gepruefteEinbindungen > 0, 'Keine KI-Bild-Einbindung gefunden — die Prüfung greift ins Leere');

// --- 3.: Hinweis ist echter Text ---------------------------------------------
const css = fs.readFileSync(path.join(root, 'css/style.css'), 'utf8');
const badgeRegel = new RegExp(`\\.${BADGE}\\s*\\{[^}]*\\}`).exec(css);
pruefe(!!badgeRegel, `CSS-Regel .${BADGE} fehlt`);
if (badgeRegel) {
  pruefe(!/content\s*:/.test(badgeRegel[0]),
    `.${BADGE} darf den Hinweis nicht per CSS-content erzeugen — er muss ohne Hilfsmittel wahrnehmbar sein`);
}
const irgendwoText = seiten.some((seite) =>
  new RegExp(`class="${BADGE}"[^>]*>\\s*\\S`).test(fs.readFileSync(path.join(root, seite), 'utf8')));
pruefe(irgendwoText, `Kein .${BADGE} enthält sichtbaren Text`);

// --- 1.: Register vollstaendig ------------------------------------------------
const gruppen = register.gruppen ?? {};
const eingeordnet = new Set();
for (const [name, gruppe] of Object.entries(gruppen)) {
  for (const datei of gruppe.dateien ?? []) eingeordnet.add(path.basename(datei));
  for (const varianten of Object.values(gruppe.motive ?? {})) {
    for (const datei of varianten) eingeordnet.add(path.basename(datei));
  }
  pruefe(typeof gruppe.begruendung === 'string' && gruppe.begruendung.length > 20,
    `Gruppe ${name} im Register hat keine belastbare Begründung`);
}
for (const datei of [...verwendeteBilder].sort()) {
  pruefe(eingeordnet.has(datei),
    `${datei} ist verwendet, aber in data/bildherkunft.json nicht eingeordnet`);
}

// --- 4.: Vorschaugrafik ohne Fotorealismus ------------------------------------
pruefe(gruppen.og_grafik?.kennzeichnung === 'Foto-Anteil entfernt',
  'Das Register muss festhalten, dass die Vorschaugrafik keinen fotorealistischen Inhalt enthält');

if (fehler.length) {
  fehler.forEach((f) => console.error(`ERROR ${f}`));
  process.exit(1);
}

console.log(`KI-Bildkennzeichnung bestanden: ${gepruefteEinbindungen} Einbindungen gekennzeichnet, `
  + `${verwendeteBilder.size} verwendete Bilder im Register eingeordnet.`);
