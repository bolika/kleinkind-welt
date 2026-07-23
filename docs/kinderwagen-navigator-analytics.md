# Analytics-Vertrag für den Kinderwagen-Navigator

Status: technisch vorbereitet, Auswertung startet mit echtem Beta-Traffic.

## Messziel

Der Funnel soll drei Fragen beantworten:

1. Beginnen Nutzer nach dem Laden tatsächlich mit der Auswahl?
2. An welcher Frage oder Ergebnislage verlieren wir sie?
3. Führt ein belastbares Match später zu sichtbaren und geöffneten Händlerangeboten?

Die Events enthalten keine frei eingegebenen Texte, exakten Maße oder dauerhaften Nutzer-IDs. Budget wird nur als grobe Stufe gemessen.

## Plausible-Funnel

Vor dem eigentlichen Funnel messen zwei vorgeschaltete Events die neue
Themenarchitektur:

- `Themenbereich-Klick` mit `thema`, `seite` und `platzierung`
- `Kinderwagen-Kaufhilfe` mit `ratgeber`, `seite` und `platzierung`

Damit lassen sich Startseiten-Einstiege in Spielzeug und Kinderwagen sowie die
Nutzung der fünf Kaufhilfen getrennt beurteilen. Die bestehenden
`Kinderwagen-Navigator`-Einstiege bleiben die Brücke in den Tool-Funnel.

1. `Kinderwagen-Navigator · navigator_bereit`
2. `Kinderwagen-Navigator · gestartet`
3. `Kinderwagen-Navigator · frage_beantwortet`
4. `Kinderwagen-Navigator · ergebnis_berechnet`
5. `Kinderwagen-Navigator · match_gesehen`
6. `Kinderwagen-Navigator · haendlerangebot_gesehen`
7. `Kinderwagen-Navigator · haendlerangebot_geoeffnet`
8. `Kinderwagen-Navigator · vergleich_gesehen`
9. `Kinderwagen-Navigator · vergleich_geoeffnet`
10. `Kinderwagen-Navigator · vergleich_gescrollt`
11. `Kinderwagen-Navigator · vergleich_modell_geoeffnet`
12. `Kinderwagen-Navigator · produktbild_geoeffnet`
13. `Kinderwagen-Navigator · ergebnis_feedbackgrund` nach negativem Feedback
14. zentrales Event `Affiliate-Klick`

`navigator_bereit` liefert zusätzlich Modellzahl, Angebotszahl und einen groben Ladezeit-Bucket. `ladefehler` macht technische Abbrüche sichtbar. Frage-Events übertragen nur Frage-ID und Fragetyp, nicht die konkrete Antwort.

## Verbindliche Kennzahlen

- Startquote = eindeutige `gestartet` / eindeutige `navigator_bereit`
- Abschlussquote = eindeutige `ergebnis_berechnet` / eindeutige `gestartet`
- Frageverlust = angezeigte Frage ohne folgende gültige Antwort, getrennt nach `frage`
- Kein-Match-Quote = `ergebnis_berechnet` mit `matches = 0`
- Hilfreichkeitsquote = `ergebnis_bewertet` mit `hilfreich = ja` / alle Ergebnisbewertungen
- Häufigster negativer Grund = `ergebnis_feedbackgrund`, getrennt nach `grund`
- Match-Sichtquote = eindeutige `match_gesehen` / eindeutige `ergebnis_berechnet`
- Angebots-Sichtquote = eindeutige `haendlerangebot_gesehen` / eindeutige `match_gesehen`
- Händler-Klickrate = eindeutige `haendlerangebot_geoeffnet` / eindeutige `haendlerangebot_gesehen`
- Vergleichs-Sichtquote = eindeutige `vergleich_gesehen` / eindeutige `ergebnis_berechnet` mit mindestens zwei Matches
- Vergleichs-Öffnungsquote auf Mobile = eindeutige `vergleich_geoeffnet` / eindeutige `vergleich_gesehen` mit `zustand = geschlossen`
- Horizontale Vergleichsnutzung = eindeutige `vergleich_gescrollt` / eindeutige `vergleich_gesehen`
- Vergleich-zu-Detail-Quote = eindeutige `vergleich_modell_geoeffnet` / eindeutige `vergleich_gesehen`
- Produktbild-Klickrate = eindeutige `produktbild_geoeffnet` / eindeutige `match_gesehen` mit freigegebenem Produktbild

Die ersten Werte sind Lernwerte, keine belastbaren Benchmarks. Vor Änderungen am Fragenbaum müssen mindestens 50 abgeschlossene Ergebnis-Sessions vorliegen oder wiederholt eindeutige qualitative Probleme beobachtet werden.

## Diagnose-Reihenfolge

1. `ladefehler` oder Ladezeit über vier Sekunden prüfen.
2. Startquote nach Gerät vergleichen.
3. Frageverluste nach Frage-ID prüfen.
4. Kein-Match-Fälle und akzeptierte Kompromisse einzeln gegen die Referenzprofile testen.
5. Erst nach echten Händlerangeboten Angebots-Sicht- und Klickrate bewerten.

Eine geringe Händler-Klickrate darf nicht durch bezahlten Einfluss auf Score oder Reihenfolge „optimiert“ werden. Verbessert werden dürfen Erklärung, Angebotsqualität, Lieferumfang, Preisfrische und CTA-Verständlichkeit.
