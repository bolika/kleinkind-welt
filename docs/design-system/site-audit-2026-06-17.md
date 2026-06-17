# Site Audit: Fit Zum Design System

Stand: 2026-06-17

Audit-Basis:

- 26 lokale HTML-Dateien
- `css/style.css`
- Design-System-Dokumente in `docs/design-system/`
- lokaler Linkcheck fuer `href`/`src`
- Musterpruefung fuer Header, Cookie-Texte, Trust-Module, Canonicals, Jahreszahlen und Affiliate-/Empfehlungssprache

## Umsetzungsstand Nach Bereinigung

Stand: 2026-06-17, nach dem ersten Fix-Durchlauf.

- P0 Mobile Navigation: umgesetzt. Alle normalen HTML-Seiten mit mobiler Navigation nutzen jetzt `nav-toggle`, `nav-menu` und das zugehoerige Script.
- P0 Cookie-/Datenschutzsprache: umgesetzt. Cookie-Banner sind vereinheitlicht, `datenschutz.html` erklaert Plausible ohne Cookies und den lokalen Hinweis-Status konsistent.
- P0 2025-Signale: umgesetzt, soweit sichtbar. Historische `datePublished`-Werte bleiben bewusst erhalten; sichtbare Titel, Meta-Beschreibungen, Footer und alte Jahresclaims wurden bereinigt.
- P1 Artikelstandard: weitgehend umgesetzt. Alle Artikel haben Autorzeile, Kurzantwort und Quellenbox; produktbezogene Kaufboxen bleiben redaktionell dort, wo sie sinnvoll gepflegt sind.
- P1 Empfehlungs-Wording: umgesetzt. Sichtbare "Test"/"Testsieger"-Claims wurden auf Empfehlungen, Vergleiche und Auswahlkriterien umgestellt.
- P1 Affiliate-Sprache: umgesetzt. Impressum und Affiliate-Links orientieren sich an `rel="sponsored noopener nofollow"`.
- P2 OG-Bild: umgesetzt. `images/og-kleinkind-welt.png` ist erstellt und auf der Startseite als `og:image` eingebunden.
- P2 technische Entduplizierung: offen. Header/Footer/Cookie sind in statischen HTML-Dateien weiterhin dupliziert; fuer echte Entduplizierung braucht es einen Build-/Include-Schritt.

## Executive Summary

Die Seite ist visuell bereits auf einem guten Weg: neues Logo ist fast ueberall eingebunden, die Farbwelt wurde an Teal/Coral angepasst, Canonicals sind bei allen indexierbaren Hauptseiten/Artikeln sauber und lokale Links sind aktuell nicht kaputt.

Der groesste Abstand zum Design System lag vor der Bereinigung in der Konsistenz aelterer Seiten:

- Mobile Navigation fehlt auf vielen Artikeln, weil der Burger-Button/Script nicht ueberall vorhanden ist.
- Cookie-/Datenschutz-Sprache ist uneinheitlich und teilweise nicht im Einklang mit Plausible.
- Viele Artikel haben noch 2025-Signale oder alte Copyright-Zeilen.
- Nur wenige Artikel nutzen den neuen starken Artikelstandard mit Autorzeile, Kurzantwort und Quellenbox.
- "Test"/"Testsieger" kommt noch in sichtbaren Texten vor, soll aber kuenftig durch Empfehlungs-Wording ersetzt werden.

## Prioritaeten

### P0 - Sofort Beheben

Diese Punkte betreffen Vertrauen, Mobile-Nutzbarkeit oder rechtliche Konsistenz.

#### 1. Mobile Navigation Vereinheitlichen

Problem:

- Nur ein Teil der Seiten enthaelt `nav-toggle`.
- CSS blendet mobile Navigation aus, erwartet aber einen Burger-Button.
- Auf Seiten ohne Burger kann die Navigation auf Mobile verschwinden.

Gefunden mit Burger:

- `index.html`
- `ueber-uns.html`
- `bewertungsmethode.html`
- `artikel/motorikspielzeug-test.html`
- `artikel/spielzeug-0-6-monate.html`
- `artikel/spielzeug-18-24-monate.html`
- `artikel/spielzeug-3-jahre.html`
- `artikel/spielzeug-unter-20-euro.html`
- `artikel/was-wir-nicht-kaufen.html`

Fehlt also auf vielen Artikel- und Rechtsseiten.

Empfohlene Arbeit:

- Einen einheitlichen Header-Snippet definieren.
- Burger-Button und Script auf alle normalen Inhaltsseiten uebernehmen.
- Danach Mobile-Screenshot auf Startseite, altem Artikel und neuem Artikel pruefen.

Zielzustand:

- Alle Seiten nutzen neues Logo, gleiche Hauptnavigation, Burger-Menue auf Mobile.

#### 2. Cookie- Und Datenschutzsprache Harmonisieren

Problem:

- Viele Seiten sagen: "Diese Website verwendet keine Tracking-Cookies."
- Gleichzeitig ist Plausible eingebunden.
- Datenschutz sagt einerseits, es wuerden keine Analyse-Tools eingesetzt, erklaert danach aber Plausible.
- Cookie-Banner-Texte unterscheiden sich stark.

Betroffene Muster:

- `index.html`
- viele Artikel mit altem Cookie-Satz
- `datenschutz.html`
- `ueber-uns.html`
- `bewertungsmethode.html`

Empfohlene Arbeit:

- Einen Standard-Cookie-Text fuer alle Seiten verwenden:

```text
Keine Werbe- oder Tracking-Cookies. Wir nutzen Plausible fuer datenschutzfreundliche Reichweitenmessung. Mehr erfahren.
```

- Datenschutz aktualisieren:
  - Stand auf Juni 2026
  - Abschnitt "keine Analyse-Tools" entfernen oder praezisieren
  - Plausible konsistent erklaeren
  - localStorage statt "Cookie" korrekt benennen, falls nur localStorage genutzt wird

Zielzustand:

- Cookie-Banner, Datenschutz und Design-System sagen dasselbe.

#### 3. Alte Jahreszahlen Und 2025-Signale Bereinigen

Problem:

- Mehrere sichtbare Titel, H1, Meta Descriptions oder Footer stehen noch auf 2025.
- Das wirkt neben aktuellen 2026-Artikeln uneinheitlich.

Beispiele:

- `index.html`: Startseitenkarten fuer 12-18 Monate und Motorikspielzeug nennen 2025.
- `artikel/spielzeug-6-12-monate.html`: Title, Meta, Datum, Footer 2025.
- `artikel/spielzeug-12-18-monate.html`: Title, Meta, H1, Datum, Footer 2025.
- `artikel/motorikspielzeug-test.html`: Title/H1 2025, aber aktualisiert Juni 2026.
- `artikel/montessori-spielzeug-kleinkind.html`: Title/Datum/Footer 2025.
- `artikel/geschenke-1-jahr.html`: Datum/Footer 2025.
- `404.html` und `datenschutz.html`: Copyright 2025.
- `llms.txt`: Motorikspielzeug Empfehlungen.

Empfohlene Arbeit:

- Entweder konsequent "Aktualisiert Juni 2026" einsetzen oder Jahreszahl aus Titeln entfernen.
- Sichtbare Footer auf 2026 vereinheitlichen.
- `dateModified` dort setzen, wo Artikel aktualisiert wurden.

Zielzustand:

- Keine veralteten 2025-Signale ausser bewusst `datePublished`.

### P1 - Hoch Priorisieren

Diese Punkte verbessern Trust, SEO und Design-System-Konsistenz deutlich.

#### 4. Artikelstandard Auf Alle Wichtigen Artikel Uebertragen

Problem:

- Der neue Standard mit Autorzeile, Kurzantwort und Quellenbox ist erst auf wenigen Artikeln voll umgesetzt.

Bereits stark:

- `artikel/motorikspielzeug-test.html`
- `artikel/spielzeug-unter-20-euro.html`
- `artikel/was-wir-nicht-kaufen.html`

Fehlt bei vielen:

- `artikel/spielzeug-6-12-monate.html`
- `artikel/spielzeug-12-18-monate.html`
- `artikel/spielzeug-2-jahre.html`
- `artikel/geschenke-1-jahr.html`
- `artikel/montessori-spielzeug-kleinkind.html`
- `artikel/holzspielzeug-vs-plastikspielzeug.html`
- weitere aeltere Ratgeber

Empfohlene Arbeit:

- Prioritaet nach Traffic-/SEO-Wert:
  1. `spielzeug-12-18-monate`
  2. `spielzeug-2-jahre`
  3. `motorikspielzeug-test` Feinschliff, weil schon nah dran
  4. `geschenke-1-jahr`
  5. `montessori-spielzeug-kleinkind`
  6. `holzspielzeug-vs-plastikspielzeug`

Zielzustand je Artikel:

- Autorzeile
- Kurzantwort
- Kaufbox bei Kaufintent
- Affiliate-Hinweis vor Produktlinks
- Quellenbox
- FAQ sichtbar passend zu FAQPage

#### 5. "Test" / "Testsieger" Aus Sichtbaren Texten Entfernen

Problem:

- Die neue redaktionelle Richtung ist Empfehlungsbasis statt Pruef-Wording.
- Bestehende sichtbare Texte nutzen noch "Test" oder "Testsieger".
- Das kann nach Laborprüfung wirken, obwohl die Seite bewusst als Recherche- und Empfehlungsratgeber auftritt.

Beispiele:

- `index.html`: frueher Card-Tag "Test & Vergleich", Titel "Motorikspielzeug im Test".
- `artikel/duplo-vergleich.html`: frueher "Testsieger" in Label, TOC und H2.
- `artikel/badespielzeug-kleinkind.html`: frueher "unser Testsieger" in Inline-Produkt.
- mehrere Footer-Links: frueher "Motorikspielzeug Test".
- `llms.txt`: frueher "Motorikspielzeug Test 2025".

Empfohlene Arbeit:

- Sichtbare Texte ersetzen:

```text
Test & Vergleich -> Empfehlungen & Vergleich
Motorikspielzeug im Test -> Motorikspielzeug: 8 Empfehlungen
Testsieger -> Top-Empfehlung
Testsieger nach unseren Auswahlkriterien -> Empfehlung nach unseren Auswahlkriterien
Motorikspielzeug Test -> Motorikspielzeug Empfehlungen
```

- Alte Slugs wie `motorikspielzeug-test` nur mit separatem Redirect-Plan aendern. Sichtbares Wording hat Vorrang.

Zielzustand:

- Nutzer verstehen sofort: redaktionelle Empfehlungen nach Auswahlkriterien, kein Laborvergleich.

#### 6. Footer Und Rechtliches Vereinheitlichen

Problem:

- Footer unterscheiden sich zwischen Seiten.
- `impressum.html` hat kein Plausible, keine Canonical, keine Meta Description.
- `datenschutz.html` hat `noindex`, keine Canonical, alte Jahreszahl.
- Impressum sagt Affiliate-Links seien mit `rel="nofollow"` gekennzeichnet, waehrend Designsystem `sponsored noopener nofollow` vorgibt.

Empfohlene Arbeit:

- Einheitlichen Footer-Snippet fuer:
  - Startseite
  - Artikel
  - Ueber uns / Bewertungsmethode
  - Rechtliches
- Impressum-Affiliate-Hinweis aktualisieren:

```text
Alle Affiliate-Links sind mit rel="sponsored noopener nofollow" gekennzeichnet.
```

- Datenschutz aktualisieren, siehe P0.

Zielzustand:

- Rechtliche Seiten wirken nicht wie alter Website-Stand.

### P2 - Danach Optimieren

Diese Punkte sind weniger kritisch, aber gut fuer Qualitaet, Skalierbarkeit und Marke.

#### 7. Komponentensystem Technisch Entduplizieren

Problem:

- Header, Footer, Cookie-Banner und Scripts sind in vielen HTML-Dateien dupliziert.
- Dadurch entstehen genau die aktuellen Inkonsistenzen.

Empfohlene Arbeit:

- Wenn die Seite statisch bleiben soll:
  - kleine Build-/Template-Strategie einfuehren
  - oder Snippets mit einem einfachen Generator zusammenbauen
- Falls bewusst kein Build-System:
  - klare Snippet-Dateien in `docs/design-system/` pflegen
  - Aenderungen per Script ueber alle HTML-Dateien anwenden

Zielzustand:

- Neue Logo-/Header-/Cookie-Aenderungen muessen nur einmal gepflegt werden.

#### 8. Startseite Inhaltlich Schaerfen

Positiv:

- Startseite ist visuell stimmig.
- Quick Entries sind gut.
- Artikelkarten sind klar.

Verbesserungen:

- 2025-Karten aktualisieren.
- Doppelte Holz-vs-Plastik-Karten im Ratgeberbereich pruefen: aktuell gibt es zwei Karten mit aehnlichem Ziel.
- "Aktuell" sollte wirklich die neuesten 2026-Artikel zeigen.
- Cookie-Banner-Text aktualisieren.

Zielzustand:

- Startseite fuehlt sich wie aktueller Hub an, nicht wie Mischung aus altem und neuem Stand.

#### 9. `llms.txt` Aktualisieren

Problem:

- `llms.txt` nennt noch "Motorikspielzeug Empfehlungen".
- Neue Design-/Trust-Sprache fehlt dort.

Empfohlene Arbeit:

- 2026-Signale aktualisieren.
- Bewertungsmethode und KI-/Redaktionstransparenz knapp ergaenzen.
- Wichtigste neue Artikel pruefen.

Zielzustand:

- AI/Search bekommt denselben aktuellen Kontext wie Nutzer.

#### 10. OG-/Social-Bild Als Eigenes Asset Erstellen

Problem:

- `og:image` zeigt jetzt auf das Hero-Foto, das technisch vorhanden ist.
- Besser waere ein eigenes 1200x630-Bild mit Logo, Mark, Hero und Claim.

Empfohlene Arbeit:

- `images/og-kleinkind-welt.jpg` oder `.png` erstellen.
- Open Graph auf dieses Asset zeigen lassen.

Zielzustand:

- Geteilte Links wirken markenkonsistent.

## Positive Befunde

- Keine alten Emoji-Logos mehr gefunden.
- Neues Logo ist auf fast allen echten Seiten eingebunden.
- Lokaler Linkcheck fuer `href`/`src` ist sauber.
- Canonicals sind bei allen Artikeln und wichtigen indexierbaren Seiten clean.
- `sitemap.xml` ist vorhanden und deckt die Artikelstruktur ab.
- Designsystem und aktuelle CSS-Farbwelt sind jetzt im Einklang.
- Artikel mit neuer Struktur zeigen klar, wie der Zielzustand aussehen sollte.

## Empfohlene Abarbeitungsreihenfolge

1. Mobile Header/Burger auf alle Seiten ausrollen.
2. Cookie-Banner und Datenschutztext vereinheitlichen.
3. 2025-Signale bereinigen und `llms.txt` aktualisieren.
4. Impressum/Affiliate-Rel-Sprache korrigieren.
5. Artikelstandard auf Top-Artikel ausrollen: Autorzeile, Kurzantwort, Quellenbox.
6. "Test"/"Testsieger" aus sichtbarer Copy entfernen und durch Empfehlungs-Wording ersetzen.
7. Footer-Snippets vereinheitlichen.
8. Startseite inhaltlich final schaerfen.
9. Optional: statisches Snippet-/Build-System einfuehren.
10. Eigenes OG-Bild erstellen.

## Aufwandsschaetzung

- P0 komplett: ca. 0.5 bis 1 Tag
- P1 komplett: ca. 1 bis 2 Tage, je nachdem wie tief die Artikel redaktionell angefasst werden
- P2 komplett: ca. 0.5 bis 1.5 Tage

## Empfehlung

Zuerst keine neuen Artikel bauen. Erst P0 und die ersten zwei P1-Punkte erledigen. Danach ist die Website als System stabil genug, dass neue Inhalte nicht wieder Inkonsistenzen erben.
