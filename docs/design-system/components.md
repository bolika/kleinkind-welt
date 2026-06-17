# Components And Layout

Stand: 2026-06-17

Dieses Dokument beschreibt die vorhandenen Komponenten und wie sie kuenftig eingesetzt werden sollen.

## Layout-Grundlagen

Maximale Inhaltsbreiten:

- Navigation und Startseitenbereiche: ca. 1100px
- Artikeltext: ca. 760px
- Artikel-Hero: ca. 760px

Abstaende:

- Desktop-Sektionen: grosszuegig, aber nicht landingpage-artig ueberladen
- Mobile-Sektionen: kompakt, klare Reihenfolge, keine horizontalen Layouts erzwingen

Wichtig:

- Keine Karten in Karten verschachteln.
- Wiederholte Inhalte duerfen Karten sein.
- Ganze Seitenbereiche bleiben ungerahmt oder als ruhige Flaechen.

## Header

Bestandteile:

- Logo links: `images/logo-horizontal.svg`
- Navigation rechts: Nach Alter, Ratgeber, Aktuell, Ueber uns
- Mobile: Burger-Menue

Regeln:

- Header bleibt sticky.
- Logo darf auf Mobile kleiner werden, aber nicht unter ca. 40px Hoehe.
- Navigation nicht ueberladen. Maximal 4 Hauptpunkte.

## Startseiten-Hero

Komponente:

- `.hero-image`
- `.hero-image-photo`
- `.hero-image-text`
- `.btn-hero`

Aufgabe:

- sofort erklaeren, was die Seite macht
- emotionaler Einstieg ohne Marketing-Sprech
- schneller Einstieg zu Empfehlungen

Aktueller Copy-Rahmen:

- H1: "Das richtige Spielzeug finden - ohne stundenlang suchen."
- Subline: "Kuratiert von echten Eltern. Kein Hersteller beeinflusst unsere Empfehlungen."
- CTA: "Empfehlungen entdecken"

Mobile-Regel:

- Hero-Bild zuerst, Text darunter.
- H1 bewusst kompakt halten.
- Kein horizontaler Overflow.

## Trust-Bar

Komponente:

- `.trust-bar`
- `.trust-inner`
- `.trust-item`

Aktuelle Inhalte:

- Transparent
- Von Eltern
- Recherchiert
- Aktuell

Regeln:

- Desktop: 4 Spalten sind gut.
- Mobile: 1 Spalte.
- Trust-Bar nutzt `--primary`.
- Text knapp halten, keine langen Erklaerungen.

## Situation Quick Entry

Komponente:

- `.situation-section`
- `.situation-grid`
- `.situation-tile`

Aufgabe:

- Nutzer nach Alltagssituation abholen.
- Besonders gut fuer Eltern und Grosseltern, die nicht wissen, welches Altersthema passt.

Regeln:

- Tiles kurz halten.
- Mobile horizontal scrollbar ist erlaubt, wenn dadurch kein Layout bricht.
- Jede Situation muss auf einen wirklich passenden Artikel zeigen.

## Cards

Komponenten:

- `.card-grid`
- `.card`
- `.card-img-placeholder`
- `.card-badge`
- `.card-tag`
- `.card-link`

Regeln:

- Cards sind fuer Artikelteaser.
- Emojis sind erlaubt, aber nur als leichte Orientierung, nicht als Hauptdesign.
- Badges sparsam verwenden: "Neu", "Beliebt".
- Titel muessen konkret sein.

Gute Card-Titel:

- "Spielzeug fuer 2-Jaehrige - Die besten Empfehlungen 2026"
- "DUPLO vs. andere Bausteine - welches Bausystem gewinnt?"

Schlechte Card-Titel:

- "Unsere tollen Tipps"
- "Alles ueber Spielzeug"

## Artikel-Hero

Komponenten:

- `.article-hero`
- `.article-hero-inner`
- `.article-meta`
- `.lead`

Regeln:

- Metadaten: Datum, Lesezeit, Kategorie.
- H1 beschreibt den konkreten Suchintent.
- Lead beantwortet knapp, was Nutzer bekommen.

## Artikelmodule

Wichtige Module:

- `.artikel-autor-line`: Autor und Trust
- `.kurzantwort-box`: direkte Antwort fuer Nutzer und AI/Search
- `.kaufbox`: schnelle Entscheidung
- `.affiliate-hinweis`: kommerzielle Transparenz
- `.toc`: Orientierung
- `.produkt-box`: Produktbewertung
- `.produkt-pros` und `.produkt-cons`: Vorteile und Nachteile
- `.produkt-geeignet`: geeignet/nicht ideal
- `.vergleich-tabelle`: Vergleichstabellen
- `.quellenbox`: Quellen und Transparenz

Reihenfolge in starken Kaufartikeln:

1. Article Hero
2. Autorzeile
3. Kurzantwort
4. Kaufbox
5. Affiliate-Hinweis
6. Inhaltsverzeichnis
7. Einordnung/Kaufkriterien
8. Produktboxen
9. Quellenbox
10. FAQ

## Footer

Regeln:

- Footer nutzt `--primary-dark`.
- Logo im Footer als Mark/Icon.
- Links auf Rechtliches und wichtigste Themen.
- Keine ueberlangen Linklisten.

## Cookie Banner

Regeln:

- Kurz halten.
- Kein Claim "keine Tracking-Cookies", wenn Plausible aktiv ist, ohne Plausible direkt zu erklaeren.
- Mobile muss voll umbrechen und darf nicht horizontal abschneiden.

