# Kinderwagen-Navigator: Produktplan

Status: Entscheidungsmodell Version 0.1
Öffentliche Route: `/kinderwagen-navigator`  
Indexierung: bis zur funktionsfähigen Beta deaktiviert

## 1. Produktziel

Der Kinderwagen-Navigator findet nicht den pauschal „besten“ Kinderwagen, sondern die Modelle, die am besten zu den konkreten Rahmenbedingungen und Prioritäten einer Familie passen.

Das Ergebnis ist unabhängig von:

- Amazon-Verfügbarkeit
- Affiliate-Provisionen
- Händlerbeziehungen
- Hersteller-Sponsoring

### Nutzerproblem

Eltern müssen harte Einschränkungen wie Kofferraum, Treppen, Aufzug oder Geschwisteroption gleichzeitig mit weicheren Wünschen wie Komfort, Gelände, Design und Preis abwägen. Bestehende Hersteller-Finder lösen dies nur innerhalb des eigenen Sortiments. Shop-Filter erklären häufig nicht, warum ein Modell wirklich zum Alltag passt oder wo der Kompromiss liegt.

### Kernversprechen

> Finde den Kinderwagen, der am besten zu eurem Alltag passt – herstellerübergreifend, transparent und ohne bezahlten Einfluss auf das Ergebnis.

„Allumfassend“ wird erst verwendet, wenn die Marktabdeckung messbar hoch ist. Bis dahin lautet die belastbare Positionierung „herstellerübergreifend“.

### Eigenständiges Qualitätsmerkmal

Der Match-Score allein ist nicht die Differenzierung. Jede Empfehlung erhält einen **Kleinkind-Welt Passungsnachweis**, der Muss-Kriterien, persönliche Passung, wichtigsten Kompromiss, offene Prüfungen und Datenqualität getrennt zeigt.

Der verbindliche Standard steht in [`docs/kinderwagen-navigator-quality-standard.md`](kinderwagen-navigator-quality-standard.md). Er stellt ausdrücklich keine pauschale Sicherheits-, Qualitäts- oder Testnote für einen Kinderwagen dar.

## 2. Wettbewerbsbild und Differenzierung

### Beobachtete Angebote

- CYBEX bietet einen Finder für das eigene Sortiment: <https://www.cybex-online.com/de/de/stroller-advisor.html>
- Joolz bietet ein Quiz für das eigene Sortiment: <https://www.joolz.com/de/de/kinderwagen?buggy-finder=open>
- My Junior fragt unter anderem Untergrund, Babywanne, Liegefläche, Design und Zubehör ab und liefert drei Modelle aus dem eigenen Sortiment: <https://my-junior.com/de/module/gekstrollerconfigurator/configurator>
- BabyOne kombiniert Sortimentsfilter mit Beratung und stationärer Probefahrt: <https://www.babyone.de/kinderwagen>
- Stiftung Warentest bietet unabhängige Testdaten und Filter, aber keinen frei zugänglichen, adaptiven Alltag-Matching-Flow: <https://www.test.de/Kinderwagen-im-Test-4805700-0/>

### Unser Vorteil

1. Mehrere Hersteller und Händler statt geschlossenem Sortiment.
2. Harte Ausschlusskriterien vor Marketing- und Komfortpräferenzen.
3. Persönliche Gewichtung statt pauschaler Bestenliste.
4. Belegter Passungsnachweis statt eines Blackbox-Scores.
5. Datenqualität und fehlende Angaben werden angezeigt.
6. Jeder Treffer erklärt auch den wichtigsten Kompromiss.
7. Sponsoring und Match-Berechnung sind technisch und redaktionell getrennt.

## 3. Zielgruppe und MVP-Scope

### Primäre Zielgruppe

Werdende Eltern oder Eltern eines Neugeborenen, die ihren ersten Kombi-Kinderwagen für ein einzelnes Kind suchen.

### Im MVP enthalten

- ein Kind
- Nutzung ab Geburt
- Kombi-Kinderwagen mit Babywanne und späterer Sitzeinheit
- Stadt, gemischter Alltag und moderates Gelände
- Budget-, Gewichts-, Faltmaß-, Kofferraum- und Wohnsituationsanforderungen
- 15 bis 25 recherchierte Modelle aus mehreren Preisstufen und Marken
- drei Empfehlungen: beste Passung, Alternative, anderer Schwerpunkt

### Bewusst nicht im MVP

- Reisebuggys
- Jogger
- Fahrradanhänger
- Geschwister- und Zwillingswagen
- Reha-Kinderwagen
- Live-Preisvergleich
- Nutzerkonto
- native App
- Kaufabschluss auf Kleinkind-Welt
- gesponserte Platzierungen

Die erste Frage erkennt diese Fälle trotzdem. Nicht unterstützte Nutzer erhalten eine klare Rückmeldung; die Nachfrage wird anonym gemessen.

## 4. Nutzerfluss

### Einstieg

- starkes Versprechen
- „ca. 2 Minuten“ erst nach realer Messung kommunizieren
- Unabhängigkeit direkt sichtbar
- kein Login

### Adaptive Fragen

#### A. Suchkontext

1. Was suchst du?
   - erster Kombi-Kinderwagen ab Geburt
   - Buggy für ein älteres Kind
   - Geschwister-/Zwillingswagen
   - noch unsicher

2. Für wie viele Kinder soll der Wagen gleichzeitig passen?

#### B. Harte Anforderungen

3. Gibt es Treppen und wie häufig muss der Wagen getragen werden?
4. Gibt es einen Aufzug oder eine maximale Türbreite?
5. Wird der Wagen regelmäßig im Auto transportiert?
6. Sind konkrete maximale Kofferraummaße bekannt?
7. Gibt es ein verbindliches Maximalgewicht?
8. Wie hoch ist das maximale Budget?
9. Welche Funktionen sind zwingend erforderlich?

#### C. Alltag und Prioritäten

10. Auf welchen Untergründen wird der Wagen überwiegend genutzt?
11. Welches Verkehrsmittel prägt den Alltag?
12. Welche zwei Eigenschaften sind am wichtigsten?
13. Wie groß sind die hauptsächlich schiebenden Personen?
14. Welche Komfortfunktionen sind wünschenswert, aber nicht zwingend?

Nicht jede Person sieht alle Fragen. Auto- und Kofferraumfragen entfallen beispielsweise ohne Autonutzung.

### Ergebnis

Jedes Ergebnis enthält:

- Match-Score
- Match-Stufe
- drei bis fünf Hauptgründe
- einen klaren Kompromiss
- erfüllte harte Anforderungen
- Datenqualität
- Prüfdaten und Quellen
- Vergleich mit zwei Alternativen
- Hinweis auf sinnvolle Probefahrt oder Maßprüfung

## 5. Matching-Modell Version 0.1

Die maschinenlesbare Kriterienmatrix liegt in `data/kinderwagen-navigator/criteria.v0.1.json`. Fragenbaum und Referenzprofile verwenden dieselbe Modellversion und werden automatisiert gegeneinander geprüft.

### Stufe 1: Eligibility Gate

Ein Produkt wird ausgeschlossen, wenn ein verifiziertes hartes Kriterium nicht erfüllt ist:

- falscher Einsatzzweck oder Altersbereich
- falsche Kinderanzahl
- zu breit für die angegebene Öffnung
- Faltmaß überschreitet ein verbindliches Limit
- Gewicht überschreitet ein verbindliches Limit
- Budget überschreitet eine strikt gesetzte Obergrenze
- notwendige Babywanne oder Geschwisteroption fehlt

Fehlt bei einem Produkt eine Angabe zu einem harten Kriterium, wird es nicht als Top-Empfehlung ausgegeben.

### Stufe 2: Gewichtete Passung

Für jedes anwendbare Kriterium wird ein Erfüllungswert vergeben:

- vollständig erfüllt: `1.0`
- teilweise erfüllt: `0.5`
- nicht erfüllt: `0.0`

Formel:

`Match = Summe(Kriteriumsgewicht × Erfüllung) / Summe(anwendbare Gewichte) × 100`

Die Nutzerprioritäten verändern die Gewichte. Zwei ausgewählte Top-Prioritäten erhalten beispielsweise Faktor 1,5.

### Stufe 3: Datenabdeckung

`Datenabdeckung = bekannte gewichtete Kriterien / alle relevanten gewichteten Kriterien × 100`

Regeln:

- Unter 85 Prozent Datenabdeckung wird kein numerischer Match-Score veröffentlicht.
- Fehlende harte Kriterien verhindern eine Top-Empfehlung.
- Datenabdeckung beeinflusst nicht heimlich den Match-Score, sondern wird separat gezeigt.

### Ergebnisstufen

- 90–100: sehr passend
- 75–89: gut passend
- 60–74: passend mit deutlichen Kompromissen
- unter 60: nicht als Empfehlung ausgeben

Der Score ist ausdrücklich keine Sicherheits-, Qualitäts- oder Testnote.

## 6. Produktdatenmodell

Jedes Attribut benötigt Wert, Quelle, Prüfdatum und Datenstatus.

### Identität und Marktstatus

- Hersteller
- Modell
- Modelljahr/Generation
- Kategorie
- aktuell erhältlich / ausgelaufen / gebraucht relevant
- offizielle Produktseite

### Maße und Transport

- Gesamtgewicht
- Gewicht von Gestell, Sitz und Babywanne getrennt
- Faltmaß mit und ohne Sitz
- aufgeklappte Maße
- Gesamtbreite
- selbststehend gefaltet
- Einhand-Faltung

### Kind und Familie

- Nutzung ab Geburt
- Babywanne inklusive/optional
- nutzbare Maße der Babywanne, soweit verfügbar
- Sitzrichtung
- Belastungsgrenze
- Geschwister-/Zwillingsoption
- Babyschalenadapter

### Alltag und Komfort

- Radtyp und Radgröße
- Federung
- Eignung nach Untergrund
- Schieberhöhe
- Einkaufskorb und Belastbarkeit
- waschbare/abnehmbare Bezüge
- Regen- und Sonnenschutz
- Ersatzteile, Reparatur und Garantie

### Evidenz

- Herstellerquelle
- unabhängige Testquelle
- redaktionell geprüft am
- Datenkonflikte
- Datenabdeckungsgrad
- Hinweis „kein eigener Produkttest“, sofern zutreffend

### Monetarisierung getrennt speichern

- Händlerlinks
- Affiliate-Programm
- Sponsoringstatus
- Verfügbarkeit

Diese Felder werden von der Match-Berechnung nicht gelesen.

## 7. Unabhängigkeitsregeln

1. Produkte werden nach Marktrelevanz und Profilabdeckung aufgenommen, nicht nach Provision.
2. Sponsoring darf Score, Eligibility und organische Reihenfolge nicht verändern.
3. Gesponserte Treffer erscheinen nur separat und nur, wenn die harten Anforderungen erfüllt sind.
4. Hersteller dürfen Daten liefern, aber keine Bewertung festlegen.
5. Änderungen an Gewichten und Regeln werden versioniert.
6. Unvollständige Daten werden sichtbar gemacht.
7. Sicherheits- und Schadstoffaussagen werden nur aus geeigneten Quellen übernommen.
8. Geschützte Testtabellen werden nicht ohne Lizenz reproduziert.

## 8. Messkonzept

### North-Star-Metrik

`Hilfreiche abgeschlossene Empfehlungen`

Eine Empfehlung zählt, wenn der Nutzer den Flow abschließt und das Ergebnis als hilfreich bewertet oder eine qualifizierte Folgeaktion ausführt.

### Events

- `navigator_viewed`
- `navigator_started`
- `navigator_question_answered`
- `navigator_question_back`
- `navigator_abandoned`
- `navigator_completed`
- `navigator_result_helpful`
- `navigator_result_not_helpful`
- `navigator_match_explained_opened`
- `navigator_product_compared`
- `navigator_product_clicked`
- `navigator_restarted`

### Erste Erfolgsschwellen

- Start-zu-Abschluss mindestens 60 Prozent
- weniger als 5 Prozent ohne verwertbares Ergebnis
- mindestens 70 Prozent hilfreiche Bewertungen
- mindestens 15 Prozent qualifizierte Produkt- oder Händlerklicks
- kein einzelner Frageschritt verursacht mehr als 20 Prozentpunkte zusätzlichen Abbruch

Die Schwellen werden nach der ersten realen Stichprobe kalibriert.

## 9. Umsetzungsphasen

### Phase 1: Entscheidungsmodell

- MVP-Zielgruppe finalisieren
- harte und weiche Kriterien definieren
- Fragenbaum und Abhängigkeiten festlegen
- Gewichte und Score-Regeln dokumentieren
- zehn realistische Familienprofile als Testfälle anlegen

**Stand:** Kriterienmatrix, adaptiver Fragenbaum und zehn Referenzprofile sind als versionierte JSON-Daten angelegt. Der Quality-Gate prüft IDs, Abhängigkeiten, Antwortwerte, Muss-Kriterien und erwartete Ergebnisregeln. Die vollständige Reproduzierbarkeit des Rankings kann erst mit der Match-Engine und ersten Produktdaten geprüft werden.

**Gate:** Zwei Personen mit gleichen Angaben erhalten reproduzierbar das gleiche Ergebnis; harte Anforderungen können nicht durch weiche Vorteile überstimmt werden.

### Phase 2: Datenbasis

- Produktschema als JSON definieren
- Marken- und Preissegmentabdeckung festlegen
- 15 bis 25 Produkte recherchieren
- jede relevante Eigenschaft mit Quelle und Prüfdatum versehen
- Datenqualitätsprüfung automatisieren

**Gate:** Kein Top-Match besitzt unbekannte harte Kriterien; mindestens 85 Prozent gewichtete Datenabdeckung.

### Phase 3: Interaktiver Prototyp

- mobile One-Question-per-Screen-Oberfläche
- Fortschrittsanzeige, Zurück-Funktion und Antwortzusammenfassung
- adaptiver Fragenbaum
- lokale Match-Berechnung
- Ergebnisdarstellung mit Score, Gründen und Kompromiss
- vollständiges Tracking

**Gate:** Zehn vorbereitete Profile liefern die erwarteten Ergebnisstufen und funktionieren per Tastatur sowie auf kleinen Smartphones.

### Phase 4: Geschlossene Beta

- Seite bleibt `noindex`
- begrenzter Traffic aus direktem Link oder ausgewählten Pinterest-Pins
- Abbrüche und „nicht hilfreich“-Feedback auswerten
- fehlende Fragen und Produkttypen priorisieren

**Gate:** Abschlussrate und Hilfreichkeitswert erreichen die vorläufigen Schwellen; keine systematischen Fehlmatches.

### Phase 5: Öffentlicher Start

- `noindex` entfernen
- Sitemap, interne Links, strukturierte Daten und `llms.txt` ergänzen
- Methodikseite veröffentlichen
- SEO-Landingtext und FAQ ergänzen
- regelmäßigen Produkt- und Quellencheck aktivieren

## 10. Nächster konkreter Arbeitsschritt

Die drei Grundlagen aus Phase 1 sind umgesetzt:

1. `data/kinderwagen-navigator/criteria.v0.1.json`
2. `data/kinderwagen-navigator/questions.v0.1.json`
3. `data/kinderwagen-navigator/reference-profiles.v0.1.json`

Der nächste sinnvolle Risikotest ist noch nicht die komplette Benutzeroberfläche. Zuerst muss bewiesen werden, dass die für den Passungsnachweis benötigten Produktdaten belastbar und markenübergreifend verfügbar sind:

1. Produktschema mit Wert, Quelle, Prüfdatum, Modellgeneration und Konfliktstatus definieren.
2. Fünf bewusst unterschiedliche Kombi-Kinderwagen als Daten-Pilot erfassen.
3. Prüfen, welche Muss- und Präferenzfelder aus Handbuch und Herstellerquelle tatsächlich vergleichbar sind.
4. Eine deterministische Match-Engine gegen die zehn Referenzprofile laufen lassen.
5. Erst danach den interaktiven Mobile-Flow bauen und auf 15 bis 25 Modelle erweitern.

**Pilot-Gate:** Kein Wert wird geschätzt, Preisbestandteile werden vollständig getrennt, unterschiedliche Gewichtsdefinitionen werden nicht vermischt und die Match-Engine kann Affiliate-Felder technisch nicht lesen.
