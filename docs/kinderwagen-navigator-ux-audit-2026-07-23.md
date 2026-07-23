# UX- und UI-System-Audit: Kinderwagen-Navigator

Stand: 23. Juli 2026  
Scope: Kernflow, Ergebnisdarstellung, Vergleich, sieben Hypothesen-Archetypen, 320/390 Pixel Mobile und 1280 Pixel Desktop

## Evidenz

Dieser Audit kombiniert:

- heuristische Prüfung von Informationsarchitektur, Fehlervermeidung, Verständlichkeit und Entscheidungslast,
- deterministische Szenariotests gegen 15 Pilotmodelle,
- lokale interaktive Device-Emulation,
- statische Accessibility- und Designsystem-Gates.

Er ersetzt keine Untersuchung mit echten Eltern. Beobachtungen aus realen Sessions, Aussagen und belastbare Zeitwerte liegen noch nicht vor.

## Ergebnis

Der Kernflow ist technisch und strukturell gut nutzbar: fünf Pflichtfragen, nur bei regelmäßigem Tragen eine sechste Frage, eine Frage je Ansicht, keine manuelle Eingabe von Auto- oder Aufzugsmaßen und ein No-Match-Pfad ohne Neustart.

Nach den Korrekturen gelten folgende lokale Befunde:

- 390 Pixel: kein Seiten-Overflow, alle Fragekarten und Hauptaktionen mindestens 48 Pixel hoch.
- 320 Pixel: kein Seiten-Overflow; Auswahlkarten bleiben 254 Pixel breit und mindestens 54 Pixel hoch.
- Auswahlgruppen sind echte `fieldset`-Gruppen mit zugänglicher Legende.
- Desktop-Vergleich: 598 Pixel sichtbare Breite und 598 Pixel Tabellenbreite, also kein horizontaler Zwangsscroll.
- Mobile-Vergleich: 322 Pixel sichtbare Breite und 610 Pixel Tabellenbreite. Die Kriterien-Spalte bleibt stehen; weitere Modelle werden bewusst horizontal gewischt.
- Badge-Kontraste liegen je nach Variante zwischen 5,54:1 und 11,91:1 und erfüllen damit WCAG AA für normalen Text.

## Behobene Findings

| Priorität | Finding | Änderung |
| --- | --- | --- |
| P0 | Ein vollständig beantworteter Erstkauf ohne Logistik-Sonderfall konnte ohne numerischen Match enden. | Faltung, Stauraum und Langzeitflexibilität bilden nun die Baseline für jeden Kombi-Kinderwagen. Keine zusätzliche Frage nötig. |
| P1 | „Unsere beste Passung“ wirkte wie ein redaktionelles Testurteil. | Badge heißt jetzt „Beste Passung zu euren Angaben“. |
| P1 | Mehrere günstigere Modelle erhielten dasselbe Preis-Badge. | Nur die tatsächlich günstigste Alternative erhält diese Rolle; weitere Ergebnisse bekommen einen anderen belegten oder neutralen Differenziator. |
| P1 | Desktop musste die Vergleichstabelle horizontal scrollen. | Tabelle passt sich auf Desktop an die Tool-Spalte an und bleibt nur auf Mobile horizontal. |
| P1 | Vergleich enthielt lange Begründungsabsätze und war schwer scannbar. | Tabelle zeigt kurze Kriteriennamen; ausführliche Evidenz bleibt in den Karten. |
| P1 | Generisches „Gewicht“ konnte unterschiedliche Konfigurationen verschleiern. | Zeilenname nennt Gestell, Sitz oder Babywanne; ein Bestwert wird nur bei gleicher Konfiguration markiert. |
| P2 | Geöffneter Vergleich sagte weiterhin „Vergleich öffnen“. | Zustände heißen nun eindeutig „öffnen“ und „schließen“. |
| P2 | Produktnamen im Vergleich sowie Score- und Quellen-Details waren teils unter 44 Pixel hoch. | Mindesthöhe über Design-Token vereinheitlicht. |
| P2 | Automatisches Scrollen ignorierte reduzierte Bewegung. | JavaScript und CSS respektieren `prefers-reduced-motion`. |
| P2 | Vergleichsnutzung war auf Desktop und Mobile analytisch nicht sauber unterscheidbar. | Sichtbarkeit, Öffnen, horizontales Scrollen und Modellsprung werden getrennt gemessen. |
| P2 | Hero und erste Hilfestellung beanspruchten unnötig viel Mobile-Höhe. | Einstieg und Scope-Hilfe wurden gekürzt, ohne fachliche Grenzen zu entfernen. |

## Personas und Research-Archetypen

Die sieben bisherigen „Personas“ sind nun ausdrücklich als Hypothesen-Archetypen markiert. Sie beschreiben Entscheidungen, Risiken und Vergleichsbedarfe statt erfundener Demografie.

Zusätzliche Querschnittslinsen:

1. Erstkauf ohne Vorwissen: prüft Begriffsverständnis und Score-Interpretation.
2. Erfahrener Schnellpfad: prüft, ob Vertiefungen den Flow nicht bremsen.
3. Visuelle Shortlist: prüft Bilder und Farbrichtungen nach dem funktionalen Match; Optik verändert den Score nicht.

Aktuelle deterministische Abdeckung:

- 100 Prozent der sieben Archetypen erhalten mindestens einen Match ab 75 Prozent.
- 86 Prozent erhalten mindestens einen guten Match ab 85 Prozent.
- 71 Prozent erhalten mindestens zwei veröffentlichungsfähige Optionen.
- Der neue Erstkauf-Querschnitt erhält drei Matches mit 92 Prozent statt eines unbegründeten No-Match.

Diese Werte belegen die Abdeckung des Modells, nicht die Richtigkeit angenommener Nutzersegmente.

## Offene Punkte mit Nutzer- oder Partnerinput

1. Sieben moderierte Smartphone-Sessions nach `docs/kinderwagen-navigator-beta-testplan.md`.
2. Freigabe von Awin-Programmen und Feed-Bildrechten; bis dahin erscheinen bewusst keine gescrapten Produktbilder.
3. Nach mindestens 50 abgeschlossenen Ergebnis-Sessions: Frageverluste, Vergleichsnutzung, No-Match-Quote und Feedbackgründe auswerten.
4. Mit echten Tests entscheiden, ob der mobile Vergleich standardmäßig geschlossen bleiben soll oder ein kompaktes Vorschaufenster besser funktioniert.

## UI-System-Vertrag

Die Navigator-Komponenten nutzen semantische Auswahlgruppen, sichtbare Fokuszustände, Touchziele ab 44 Pixel, sparsame Badge-Varianten und getrennte Mobile-/Desktop-Zustände. Neue Komponenten oder Ergebnisrollen müssen über `tools/kinderwagen-navigator-ui-gate.mjs` und `tools/kinderwagen-result-presentation-test.mjs` abgesichert werden.
