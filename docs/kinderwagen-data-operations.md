# Kinderwagen-Datenbetrieb

## Zweck

Die Kinderwagen-Prüfungen unterscheiden zwei Fehlerklassen:

1. **Strukturelle Qualität** blockiert Pull Requests und `main`. Dazu gehören unter anderem ungültiges JSON, fehlende Pflichtfelder, unbekannte Quellen-IDs, ungültige Statuswerte und kommerzielle Ranking-Felder in Match-Daten.
2. **Zeitkritische Datenfrische** wird separat geprüft. Dazu gehören fällige Produktreviews, abgelaufene Produktfakten, fällige Nachprüfungen offener Datenlücken, Angebotsfristen und Medienrechte.

Ein pausierter Navigator darf das allgemeine SEO- und Editorial-Gate nicht täglich rot färben. Er darf dadurch aber auch nicht als aktuell gelten. Die abgelaufenen Werte bleiben im Report sichtbar und werden nicht automatisch verlängert oder als bestätigt behandelt.

## Betriebszustand

Der verbindliche Zustand steht in `data/kinderwagen-navigator/release-readiness.v0.1.json` unter `dataOperations`:

- `navigatorState: paused` verlangt `ciFreshnessMode: report_only`. Überfällige Daten erzeugen Warnungen und einen Report, aber keinen fehlgeschlagenen CI-Job.
- `navigatorState: active` verlangt `ciFreshnessMode: blocking`. Jeder überfällige Eintrag lässt den separaten Frische-Job fehlschlagen.
- Eine inkonsistente Kombination oder eine fehlende Begründung ist immer ein Fehler.

Der Navigator darf erst wieder auf `active` gesetzt werden, wenn alle `resumeRequirements` erfüllt sind. Ein Datum darf nur nach einer tatsächlichen erneuten Quellenprüfung geändert werden.

## CI-Ablauf

`Local content and SEO gates` führt weiterhin `tools/kinderwagen-beta-gate.mjs` aus. Die darin enthaltenen Produkt-, Datenlücken-, Angebots- und Medien-Gates prüfen nur strukturelle Verträge und bleiben blockierend.

Der separate Job `Kinderwagen data freshness` führt `tools/kinderwagen-data-freshness-gate.mjs` aus und lädt `kinderwagen-stale-report.json` für 30 Tage als GitHub-Actions-Artefakt hoch. So ist im Pull Request erkennbar, ob ein Fehler strukturell oder zeitbedingt ist.

## Lokale Befehle

Struktur prüfen:

```bash
node tools/kinderwagen-beta-gate.mjs
```

Frische mit aktuellem Datum prüfen und Report schreiben:

```bash
node tools/kinderwagen-data-freshness-gate.mjs --report=/tmp/kinderwagen-stale-report.json
```

Reproduzierbaren Report für einen Stichtag erzeugen:

```bash
node tools/kinderwagen-data-freshness-gate.mjs --as-of=2026-08-26 --report=/tmp/kinderwagen-stale-report.json
```

Blockierendes Verhalten unabhängig vom Betriebszustand testen:

```bash
node tools/kinderwagen-data-freshness-gate.mjs --strict
```

Ohne `--report` wird das JSON auf Standardausgabe geschrieben. Der Report enthält den Stichtag, Betriebs- und Enforcement-Modus, Summen pro Fehlerklasse, betroffene Produkt-IDs und jeden überfälligen Eintrag mit Quelldatei, Feld, Fälligkeitsdatum und Tagen Überzug.

## Daten aktualisieren

1. Den jüngsten Stale-Report herunterladen oder lokal erzeugen.
2. Jeden Eintrag an der in `sourceFile` genannten Datei und der dokumentierten Quelle prüfen.
3. Nur bestätigte Fakten, Prüfzeitpunkte und Fristen ändern. Keine Marktverfügbarkeit, Preise oder Produktdetails aus alten Werten fortschreiben.
4. Struktur-Gate und Frische-Gate ausführen.
5. Erst bei null überfälligen Punkten den Navigator auf `active` und den Frischemodus auf `blocking` setzen.

Der Report ist eine Arbeitsliste, keine Aussage darüber, dass ein Produkt nicht mehr erhältlich oder ein alter Fakt falsch ist. Er sagt ausschließlich, dass die bisher dokumentierte Aktualitätsfrist überschritten ist.
