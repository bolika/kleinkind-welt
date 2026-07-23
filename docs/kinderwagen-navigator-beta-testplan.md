# Moderierter Beta-Test für den Kinderwagen-Navigator

Ziel: Mit fünf kurzen Tests erkennen, ob Eltern den Flow verstehen, dem Ergebnis vertrauen und den nächsten sinnvollen Schritt finden.

## Testpersonen

1. erste Kinderwagenentscheidung, Stadt, begrenztes Budget, kein Aufzug
2. häufig mit Auto und ÖPNV unterwegs
3. kleines Auto und feste Budgetgrenze
4. gemischte Wege mit Pflaster, Park und unebenen Abschnitten
5. funktionalitätsorientiert, mittleres Budget, mehrere Alltagsschwerpunkte

Es müssen keine echten Namen, Adressen, Schwangerschafts- oder Kinderdaten protokolliert werden.

## Ablauf pro Test

1. Aufgabe vorlesen: „Findet mit dem Navigator einen Kinderwagen, den ihr anschließend näher prüfen würdet.“
2. Nicht erklären, wie die Fragen funktionieren.
3. Beobachten, wo gelesen, gezögert, zurückgegangen oder abgebrochen wird.
4. Nach dem Ergebnis fragen:
   - Was ist eure Hauptempfehlung?
   - Warum passt sie laut Navigator?
   - Welchen Kompromiss müsstet ihr prüfen?
   - Was bedeutet der Prozentwert?
   - Was würdet ihr als Nächstes tun?
5. Ergebnis mit „hilfreich“ oder „nicht hilfreich“ bewerten lassen.

## Protokoll

| Feld | Erfassung |
| --- | --- |
| Abschluss | ja / nein |
| unklare Frage | Frage-ID oder keine |
| Ergebnis verstanden | ja / teilweise / nein |
| Kompromiss erkannt | ja / nein |
| Score richtig verstanden | ja / teilweise / nein |
| gewünschte nächste Aktion | Händler, Probefahrt, Maße prüfen, weitere Recherche |
| negatives Feedback | eine der integrierten Kategorien |

## Freigaberegel

Der Test ist bestanden, wenn:

- mindestens vier von fünf Personen den Flow ohne Hilfe abschließen,
- mindestens vier die Hauptempfehlung und den wichtigsten Kompromiss korrekt wiedergeben,
- niemand den Match-Score als Sicherheits- oder Testnote versteht,
- kein wiederkehrender kritischer Fehlmatch auftritt,
- Tastatur- und Smartphone-Kernpfad zusätzlich manuell funktionieren.

Nach Abschluss werden nur aggregierte Befunde in `release-readiness.v0.1.json` aktualisiert. Einzelne Aussagen oder personenbezogene Angaben gehören nicht in Git.
