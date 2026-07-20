# Action Plan: Findings 1–7

Stand: 20.07.2026  
Reihenfolge basiert auf Risiko für Kindersicherheit, Vertrauen, Conversion und mobile Nutzbarkeit.

## Priorität 1 — Affiliate-Integrity-&-Safety-Sprint

**Ziel:** Jede Empfehlung muss zum tatsächlichen Händlerprodukt, zur Marke, Altersfreigabe und Preisregel passen.

**Arbeitsschritte**

1. Produktledger als zentrale Datenquelle anlegen.
2. Alle eindeutigen Amazon-Shortlinks auflösen und finale URL/ASIN erfassen.
3. Händler-Titel, Marke, Kategorie, Altersfreigabe und Preisbereich dokumentieren.
4. Betroffene Seiten und Textstellen automatisch verknüpfen.
5. Kritische Mismatches sofort ausblenden, ersetzen oder redaktionell korrigieren.
6. Harte Preisangaben durch Preisregeln wie „aktuell beim Händler prüfen“ ersetzen, wenn keine frische Datenquelle existiert.
7. Claim- und Sicherheitsprüfung mit menschlicher Freigabe abschließen.

**Abschlusskriterien**

- 0 Alters-, Marken- oder Kategorie-Mismatches.
- 0 tote produktive Affiliate-Ziele.
- 0 nicht belegte aktuelle Preisversprechen.
- Jede Empfehlung enthält lastChecked, Quelle und Einschränkung.

**Abhängigkeit:** Keine. Dieser Schritt startet zuerst und läuft parallel zur Mobile-Reparatur.

## Priorität 2 — Mobile-Vergleichstabellen reparieren

**Ziel:** Tabellen müssen bei 320, 390 und 430 px lesbar bleiben.

**Arbeitsschritte**

1. Caption aus der Block-Transformation herausnehmen bzw. auf volle Breite setzen.
2. Row-Header (th) in js/mobile-tables.js korrekt als mobile Labels berücksichtigen.
3. data-label für alle relevanten Zellen erzeugen.
4. Budget-, Alters-, Kaufhilfen- und Vergleichstabellen testen.
5. Screenshots und Overflow-Checks für alle Breakpoints ausführen.

**Abschlusskriterien**

- Keine vertikale Buchstaben-Caption.
- Keine abgeschnittenen Zellen.
- Keine unerwartete horizontale Überbreite.
- Tabellen bestehen den lokalen Smoke-/Visual-Test.

**Abhängigkeit:** Keine; kann parallel zu Priorität 1 umgesetzt werden.

## Priorität 3 — Alters-Hub und Mobile-Container zentrieren

**Ziel:** Alle Hub-Karten und Kurzantwort-Boxen haben symmetrische Außenabstände.

**Arbeitsschritte**

1. Sonderregel mit max-width:300px und margin-left:0 entfernen oder ersetzen.
2. Gemeinsame fluid Containerregel mit width:100% und margin-inline:auto einführen.
3. Mobile Gutter auf 16–20 px standardisieren.
4. /spielzeug-nach-alter und /geschenke-kleinkind bei 320/390/430 px prüfen.
5. Homepage-Saisonkarten gegenprüfen.

**Abschlusskriterien**

- Differenz zwischen linkem und rechtem Außenabstand maximal 2 px.
- Keine Komponente wirkt links- oder rechtslastig.
- Keine neuen lokalen Breakpoint-Overrides.

**Abhängigkeit:** Kann parallel zu Priorität 2 laufen; vor dem späteren Designsystem-Refactor abschließen.

## Priorität 4 — Deployment- und Release-Gate

**Ziel:** Lokale und öffentliche Version dürfen nicht auseinanderlaufen.

**Arbeitsschritte**

1. Nach den freigegebenen Änderungen lokalen SEO-Smoke-Test, Content-Brief-Gate, Internal-Link-Audit und git diff --check ausführen.
2. Commit erstellen.
3. Nur nach expliziter Push-Freigabe pushen.
4. Live prüfen: Sitemap, llms.txt, neue URLs, Canonicals, Redirects und HTTP-Status.
5. GSC-Sitemap und relevante URL-Inspection nach dem Deployment aktualisieren.

**Abschlusskriterien**

- Live-Sitemap entspricht dem Repository.
- Jede neue URL liefert HTTP 200.
- Keine neue URL steht in Sitemap/llms.txt, bevor sie live erreichbar ist.
- Live-Smoke-Test ohne Fehler.

**Abhängigkeit:** Nach Priorität 1–3; Push bleibt eine separate Freigabe.

## Priorität 5 — Mobile Navigation sichtbar und funktional machen

**Ziel:** Eltern erreichen jede Hauptsektion auch auf kleinen Bildschirmen.

**Arbeitsschritte**

1. Header auf 320/390/430 px prüfen.
2. Sichtbarkeit des Menü-Toggles und JavaScript-Zustand testen.
3. Touch-Target auf mindestens 44 × 44 px bringen.
4. Tastaturfokus und Escape-/Outside-Click-Verhalten prüfen.
5. Menü nach Öffnen mit Screenreader-/Accessibility-Basistest prüfen.

**Abschlusskriterien**

- Menü-Trigger ist sichtbar und eindeutig.
- Alle Hauptnavigationen sind mit maximal zwei Interaktionen erreichbar.
- Kein Layout-Shift und kein horizontaler Overflow.
- Fokuszustand ist sichtbar.

**Abhängigkeit:** Priorität 3 für gemeinsame Container-/Header-Tokens.

## Priorität 6 — Einheitliches Decision-Header-Modul

**Ziel:** Nutzer sehen früh genau eine begründete Primärempfehlung statt mehrerer konkurrierender Kaufebenen.

**Arbeitsschritte**

1. Nach Transparenz-/Autorblock ein standardisiertes Modul definieren.
2. Eine Primärempfehlung, maximal zwei Alternativen und einen Ausschlussgrund anzeigen.
3. Preis-/Altersregel aus dem Produktledger beziehen.
4. Details, Tabellen und weitere Karten erst danach anzeigen.
5. Auf mindestens fünf kaufnahen Artikeln pilotieren.

**Abschlusskriterien**

- Erste begründete Option innerhalb ca. 1.200–1.600 px.
- Keine doppelte Primärentscheidung auf derselben Seite.
- Mobile Kernaufgabe „Option finden und begründen“ in unter 90 Sekunden lösbar.
- Affiliate-Klickrate sinkt im Pilot nicht.

**Abhängigkeit:** Priorität 1 liefert die korrekten Produktdaten; Prioritäten 2–3 liefern stabile mobile Layouts.

## Priorität 7 — CTA-System vereinheitlichen

**Ziel:** Nutzer erkennen sofort, welche Handlung primär und welche sekundär ist.

**Arbeitsschritte**

1. Eine Primärfarbe für „Bei Amazon ansehen“ festlegen.
2. Sekundärlinks für Bewertungsmethode, Alternativen und Quellen definieren.
3. Mindesthöhe, Radius, Abstand, Hover-, Focus- und Disabled-Zustand tokenisieren.
4. .btn-amazon, .btn-inline, .btn-table und Kaufbox-CTAs schrittweise migrieren.
5. CTA-Tracking in Plausible auf ein konsistentes Event-Schema prüfen.

**Abschlusskriterien**

- Gleiche Handlung sieht überall gleich aus.
- Primäre Controls mindestens 44 × 44 px.
- Sichtbarer Focus-visible-Zustand.
- Keine Inline-CTA-Farbabweichungen ohne dokumentierten Ausnahmefall.

**Abhängigkeit:** Nach Priorität 6, damit die endgültige Entscheidungshierarchie feststeht.

## Parallelisierung

| Sofort parallel | Nachgelagert |
|---|---|
| Priorität 1: Produktledger | Priorität 6: Decision Header |
| Priorität 2: Tabellen | Priorität 7: CTA-System |
| Priorität 3: Container | Designsystem-/Token-Refactor |
| Claim-/Quellenprüfung | Bildoptimierung und Newsletter-Modul |

## Messpunkte nach Abschluss der ersten sieben Prioritäten

- Link-/Produktledger: 0 kritische Mismatches.
- Mobile Layout: 0 Zentrierungsfehler, 0 Tabellenfehler.
- Touch/Accessibility: 100 % primäre Controls ≥44 px und fokussierbar.
- UX-Test mit 5–8 Eltern: mindestens 80 % Aufgabenabschluss, unter 90 Sekunden, Vertrauen mindestens 4/5.
- GSC nach 14 und 28 Tagen: Impressionen, Position, CTR und Klicks der priorisierten Query-Cluster.

## Umsetzungsstatus 20.07.2026

- Priorität 1: Ersatz-Shortlinks eingepflegt; Produktledger und Integritätsprüfung angelegt. Neue Ziele bleiben bis zur menschlichen Alters-/Sicherheitsprüfung `pending-human-review`.
- Priorität 2: Budget-, Vergleichs-, Kaufhilfe- und generische Vergleichstabellen verwenden die zentrale Mobile-Komponente; Caption- und Zeilenkopf-Behandlung ergänzt.
- Priorität 3: Alters- und Geschenke-Hubs sowie Karten und Kurzantwort-Boxen auf mobilen Breakpoints zentriert.
- Priorität 5: Navigation auf allen Seiten auf den einheitlichen `.open`-Zustand normalisiert; veraltete `.show`-Zustände entfernt.
- Regression-Gate ergänzt: Tabellen ohne `mobile-tables.js` und veraltete Nav-Zustände schlagen den lokalen SEO-Smoke-Test fehl.
