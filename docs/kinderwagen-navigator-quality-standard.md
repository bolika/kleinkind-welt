# Kleinkind-Welt Passungsnachweis

Version: 0.1  
Status: verbindlicher Qualitätsstandard für den MVP

## Produktentscheidung

Das eigenständige Qualitätsmerkmal ist nicht der Match-Score allein, sondern der **belegte Passungsnachweis** hinter jeder Empfehlung.

Ein Score ohne Herleitung ist leicht kopierbar und kann falsche Präzision erzeugen. Der Passungsnachweis macht stattdessen fünf getrennte Aussagen:

1. Welche zwingenden Anforderungen sind belegt erfüllt?
2. Wie gut passt das Modell zu den persönlichen Prioritäten?
3. Welcher Kompromiss bleibt trotz der Empfehlung?
4. Welche Angaben sind noch offen oder müssen praktisch geprüft werden?
5. Wie vollständig, aktuell und belastbar sind die verwendeten Daten?

Damit bewertet Kleinkind-Welt die **Passung einer Empfehlung**, nicht pauschal die Qualität oder Sicherheit eines Kinderwagens.

## Belastbarer USP

> Herstellerübergreifendes Kinderwagen-Matching mit belegtem Passungsnachweis – ohne bezahlten Einfluss auf Score oder Reihenfolge.

„Allumfassend“ wird nicht verwendet, solange die Marktabdeckung nicht systematisch gemessen und veröffentlicht wird. Affiliate-Links sind möglich, bleiben aber technisch außerhalb der Match-Berechnung.

## Was Nutzer im Ergebnis sehen

### 1. Muss-Kriterien

Jedes relevante harte Kriterium erscheint einzeln als:

- belegt erfüllt
- nicht erfüllt
- unbekannt oder noch zu prüfen

Unbekannte Muss-Kriterien verhindern eine Top-Empfehlung. Geschätzte Nutzermaße zählen nicht als belegt erfüllt.

### 2. Persönliche Passung

Der Prozentwert entsteht ausschließlich aus anwendbaren weichen Kriterien. Die zwei gewählten Top-Prioritäten erhalten ein dokumentiertes höheres Gewicht. Das Regelwerk ist versioniert und reproduzierbar.

### 3. Wichtigster Kompromiss

Jede Empfehlung muss mindestens einen relevanten Nachteil oder Zielkonflikt nennen. Gibt es keinen belastbaren Kompromiss, ist die Datenbasis vermutlich zu oberflächlich.

### 4. Vor-dem-Kauf-Prüfung

Das Ergebnis erzeugt eine konkrete Checkliste, zum Beispiel:

- Kofferraum an der nutzbaren Stelle nachmessen
- gefaltete Einheit selbst anheben
- Schieberhöhe mit allen regelmäßig schiebenden Personen testen
- vollständigen Faltvorgang mit Sitzeinheit ausprobieren

Damit bleibt das Ergebnis nützlich, selbst wenn kein Händlerlink geklickt wird.

### 5. Datenlage

Angezeigt werden:

- gewichtete Datenabdeckung
- Modellgeneration
- letztes Prüfdatum
- verwendete Quellenarten
- offene Datenkonflikte

Unter 85 Prozent gewichteter Datenabdeckung oder bei weniger als vier bekannten anwendbaren Kriterien wird kein numerischer Match-Score veröffentlicht. Fehlt für einen zentralen Nutzungskontext wie regelmäßiges Tragen, enger Zugang, kleiner Kofferraum, ÖPNV oder unebene Wege der relevante Wert, erscheint ebenfalls kein Prozentwert. Eine teilweise erfüllte Kernpassung begrenzt die höchste erreichbare Stufe: bis 0,5 auf höchstens 84 Prozent, unter voller Erfüllung auf höchstens 89 Prozent. Starke Nebenkriterien können einen Kernkonflikt damit nicht zu einer „sehr hohen Übereinstimmung“ überdecken.

Die sichtbaren Match-Stufen sind verbindlich:

- 90–100 Prozent: sehr hohe Übereinstimmung
- 85–89 Prozent: gute Übereinstimmung
- 75–84 Prozent: solide Übereinstimmung mit sichtbarem Kompromiss
- 65–74 Prozent: nur eingeschränkte Alternative nach bewusst gewähltem Abstrich
- unter 65 Prozent: keine Empfehlung

## Was bewusst getrennt bleibt

### Match-Score und unabhängige Tests

Der Match-Score beantwortet: „Wie gut passt dieses Modell zu euren Angaben?“

Unabhängige Tests beantworten andere Fragen, etwa zu Handhabung, Haltbarkeit, Sicherheit oder Schadstoffen. Soweit rechtlich und fachlich verwendbar, werden solche Ergebnisse separat gezeigt. Fehlende Testdaten gelten weder als positiv noch als negativ.

### Matching und Monetarisierung

Die Match-Engine darf diese Felder nicht lesen:

- Affiliate-Programm
- Provisionshöhe
- Händlerpriorität
- Sponsoringstatus
- Kampagnenbudget

Eine spätere gesponserte Alternative muss außerhalb des organischen Rankings stehen, klar gekennzeichnet sein und dennoch alle harten Anforderungen erfüllen.

Händlerangebote werden in einem separaten Datensatz gespeichert und erst nach der fertigen Match-Berechnung an veröffentlichungsfähige Ergebnisse angehängt. Ein Angebot darf nur erscheinen, wenn Händlerprodukt, Modellgeneration und erforderliche Geburtskonfiguration anhand einer kuratierten Produkt-ID oder GTIN-Zuordnung bestätigt wurden. Preis- oder Bestandsdaten erhalten ein Ablaufdatum; abgelaufene Werte werden nicht als aktuell ausgegeben.

### Deterministische Logik und KI

Die KI darf:

- Quellen finden und zur Prüfung vorschlagen
- Produktwerte strukturiert extrahieren
- Datenkonflikte markieren
- eine verständliche Erklärung aus dem berechneten Ergebnis formulieren

Die KI darf nicht:

- harte Kriterien überstimmen
- fehlende Werte schätzen
- Score oder Reihenfolge frei erzeugen
- Herstellerbehauptungen als unabhängigen Beleg umdeuten
- Sicherheits-, Entwicklungs- oder Gesundheitsversprechen ergänzen

Die eigentliche Eligibility- und Score-Berechnung bleibt deterministisch und testbar.

## Qualitäts-Gates vor Veröffentlichung

Ein Produkt darf als Top-Empfehlung erscheinen, wenn:

1. alle anwendbaren Muss-Kriterien belegt erfüllt sind,
2. keine erfasste aktive offizielle Sicherheitswarnung der Empfehlung entgegensteht; ein unbekannter Status gilt nicht als Sicherheitsbestätigung,
3. mindestens 85 Prozent der gewichteten relevanten Daten vorliegen,
4. Modellgeneration und Quellen eindeutig sind,
5. mindestens ein Kompromiss oder eine offene Praxisprüfung gezeigt wird,
6. das Ergebnis durch die Referenzprofile reproduzierbar bleibt.

Ein verbindliches Tragegewicht darf nur gegen dieselbe dokumentierte Konfiguration geprüft werden: Gestell allein, Gestell mit Sportsitz oder Gestell mit Babywanne. Ein Gesamtgewicht mit Sitz darf fehlende Babywannen- oder Gestellwerte nicht ersetzen.

Ein ausdrücklich priorisiertes Kriterium mit Erfüllungswert `0` verhindert eine veröffentlichte Top-Empfehlung, selbst wenn weniger wichtige Vorteile den rechnerischen Gesamtscore über 75 Prozent heben würden.

Ein Flow darf öffentlich indexiert werden, wenn:

1. mindestens 20 relevante Modelle aus mehreren Marken enthalten sind; eine geschlossene Beta darf ab 15 Modellen starten,
2. die zehn Referenzprofile die erwarteten Entscheidungsregeln erfüllen,
3. Tastatur- und Smartphone-Nutzung geprüft sind,
4. Ergebnisabbrüche und „nicht hilfreich“-Feedback messbar sind,
5. kein Affiliate-Feld in Eligibility oder Score einfließt.

## Messbare Marktabdeckung statt „allumfassend“

Für den MVP wird die Abdeckung entlang von Nutzungsprofilen gemessen, nicht nur über die Anzahl der Marken:

- Preisstufen
- Stadt, gemischter Alltag und unebene Wege
- leicht und kompakt versus geländeorientiert
- kleine und große schiebende Personen
- Auto-, ÖPNV- und Treppenalltag
- relevante aktuelle Modellgenerationen

Erst wenn diese Abdeckung definiert und überprüft ist, darf öffentlich eine konkrete Marktabdeckung genannt werden.

## Nicht als Differenzierung verwenden

- möglichst viele Quizfragen
- ein besonders hoher oder bunter Prozentwert
- „KI-gestützte Empfehlung“ ohne erklärbare Regeln
- nicht belegbare Superlative wie „der beste Kinderwagen“
- gekaufte Nutzerbewertungen als Ersatz für technische Daten
- Amazon-Verfügbarkeit als Produktauswahlkriterium

Der Passungsnachweis ist stark, weil er auch dann nützlich bleibt, wenn die passende Empfehlung nicht monetarisierbar ist.
