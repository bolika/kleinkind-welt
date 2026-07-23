# Moderierter Mobile-Beta-Test für den Kinderwagen-Navigator

Ziel: Mit sieben kurzen Smartphone-Tests erkennen, ob Eltern den Kernflow ohne Hilfe abschließen, drei Ergebnisse sinnvoll vergleichen und den Prozentwert korrekt als Passung zu ihren Angaben verstehen.

## Forschungsstatus

Die heutigen Profile sind Hypothesen-Archetypen aus Produktannahmen und deterministischen Matcher-Tests. Sie sind noch keine validierten Personas. Erst reale Beobachtungen aus mindestens fünf qualitativen Sessions plus eine zweite Datenquelle, etwa aggregierte Plausible-Daten, dürfen die Profile bestätigen, zusammenführen oder widerlegen.

## Forschungsfragen

1. Verstehen Eltern jede Frage ohne Kinderwagen-Fachwissen?
2. Können sie die beste Passung, eine günstigere Alternative und einen entscheidenden Abstrich unterscheiden?
3. Hilft der Vergleich bei einer Shortlist oder erzeugt er auf dem Smartphone neue Bedienlast?
4. Wird der Match-Score als persönliche Passung verstanden und nicht als Sicherheits-, Qualitäts- oder Testnote?
5. Finden Nutzer nach einem No-Match ohne Neustart zu einer vertretbaren Lösung?

## Teilnehmende und Screening

Sieben Personen, jeweils mit einer realen oder bevorstehenden Kinderwagenentscheidung. Die Entscheidungskontexte sollen die sieben Hypothesen-Archetypen abdecken:

1. begrenztes Budget, Stadt, kein Aufzug,
2. häufig Auto und ÖPNV,
3. mittleres Budget, Funktion und Stauraum,
4. Wald-, Feld- oder Schotterwege,
5. enger Zugang und ÖPNV,
6. Service-, Wetterschutz- und Langzeitfokus,
7. kleines Auto und feste Budgetgrenze.

Querschnitt über diese sieben Tests:

- mindestens drei Erstkäufer ohne fundiertes Kinderwagenwissen,
- mindestens zwei Personen mit früherer Kinderwagenerfahrung,
- mindestens zwei Personen, denen die optische Auswahl für die Shortlist wichtig ist.

Es werden keine echten Namen, Adressen, Schwangerschafts- oder Kinderdaten in Git protokolliert.

## Aufgaben pro Test

1. **Erster Eindruck:** „Schaut euch die erste Ansicht an und sagt, was dieses Tool für euch tun kann.“
2. **Kernflow:** „Findet einen Kinderwagen, den ihr anschließend näher prüfen würdet.“ Keine Bedienhinweise geben.
3. **Vergleich:** „Vergleicht die Ergebnisse und nennt eure zwei interessantesten Modelle.“
4. **Verständnis:** „Warum steht Modell 1 vorn, und welcher Abstrich bleibt?“
5. **Score:** „Was bedeutet der Prozentwert – und was bedeutet er ausdrücklich nicht?“
6. **Stressfall in zwei Sessions:** Mit einer festen Grenze unterhalb des günstigsten Treffers testen und beobachten, ob der angebotene Kompromiss ohne Neustart verstanden wird.

Nach jeder Aufgabe: Schwierigkeit von 1 bis 5, beobachtete Fehler und ein neutraler Nachfragesatz wie „Was habt ihr an dieser Stelle erwartet?“

## Messplan

| Feld | Ziel oder Erfassung |
| --- | --- |
| Abschluss Kernflow | mindestens 6 von 7 ohne Hilfe |
| Zeit bis Ergebnis | beobachten; erst nach Pilot einen belastbaren Zielwert setzen |
| kritische Fehler | 0 wiederkehrende Blocker |
| unklare Frage | Frage-ID und beobachtetes Verhalten |
| Vergleich erfolgreich | mindestens 6 von 7 bilden eine begründete Top-2-Shortlist |
| Empfehlung verstanden | mindestens 6 von 7 nennen Hauptgrund und größten Abstrich |
| Score verstanden | mindestens 6 von 7: Passung zu Angaben, keine Test- oder Sicherheitsnote |
| No-Match-Erholung | beide Stressfall-Personen kommen ohne Neustart zu einer Option |
| visuelle Orientierung | erkennen Nutzer Bild, Badge und Produktname als zusammengehörig? |
| nächste Aktion | Händler, Praxistest, Maße prüfen oder weitere Recherche |

Ergänzende aggregierte Signale in Plausible: `gestartet`, `frage_angezeigt`, `zurueck`, `ergebnis_berechnet`, `vergleich_gesehen`, `vergleich_geoeffnet`, `vergleich_gescrollt`, `vergleich_modell_geoeffnet`, `ergebnis_bewertet` und Feedbackgrund.

## Schweregrad

- **Kritisch:** verhindert Abschluss oder führt zu fachlich falscher Entscheidung.
- **Major:** verursacht deutliche Unsicherheit, Fehlbedienung oder Abbruchgedanken.
- **Minor:** erzeugt Zögern, Nutzer erholt sich selbst.
- **Kosmetisch:** sichtbar, aber ohne Einfluss auf die Aufgabe.

## Freigaberegel

Der Test ist bestanden, wenn:

- die oben genannten Abschluss-, Vergleichs- und Verständnisziele erreicht sind,
- niemand den Match-Score als Sicherheits- oder Testnote versteht,
- kein wiederkehrender kritischer Fehlmatch auftritt,
- Tastatur- und Smartphone-Kernpfad zusätzlich manuell funktionieren.

Nach Abschluss werden nur aggregierte Befunde in `release-readiness.v0.1.json` aktualisiert. Aussagen einzelner Personen und personenbezogene Angaben gehören nicht in Git.
