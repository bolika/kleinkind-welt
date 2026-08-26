# Lokales Analytics-KPI-Dashboard

## Zweck

Das Dashboard verbindet exportierte CSV-Daten aus Plausible, Amazon PartnerNet,
Awin und Brevo zu einer gemeinsamen Wochenansicht. Die Auswertung laeuft vollstaendig
im Browser:

- keine API und keine externen Bibliotheken;
- keine Netzwerkverbindung aus dem Dashboard;
- keine Cookies, kein Local Storage und keine dauerhafte Speicherung;
- ein Neuladen der Seite entfernt alle importierten Daten.

Das Dashboard zeigt fehlende Werte als `Fehlt`. Eine nicht importierte oder nicht
erkannte Kennzahl wird nie stillschweigend als Null behandelt.

## Start

Die Datei `tools/kpi-dashboard/index.html` kann direkt im Browser geoeffnet werden.
Alternativ startet ein lokaler Webserver im Repository:

```bash
python3 -m http.server 8765 --directory tools/kpi-dashboard
```

Danach `http://127.0.0.1:8765/` aufrufen.

## CSV-Dateien importieren

1. Beim jeweiligen Anbieter einen CSV-Export erstellen.
2. Im Dashboard unter der passenden Quelle `CSV-Dateien auswaehlen` anklicken.
3. Eine oder mehrere Dateien derselben Quelle waehlen. Mehrere Plausible-Dateien
   sind sinnvoll, wenn Traffic und Events getrennt exportiert wurden.
4. Unter der Quelle kontrollieren, wie viele Zeilen und Kennzahlen erkannt wurden.
5. Fehlerhafte oder unvollstaendige Exporte durch eine neue Auswahl ersetzen.

Pro Auswahl werden die bisherigen Dateien dieser Quelle ersetzt. CSV, TSV,
Semikolon-CSV, UTF-8-BOM, maskierte Anfuehrungszeichen, deutsche Dezimalzahlen und
gaengige deutsche oder englische Spaltennamen werden unterstuetzt.

## Empfohlene Exportspalten

| Quelle | Benoetigte Basis | Zusaetzlich sinnvoll |
|---|---|---|
| Plausible | Datum, Besucher oder Sitzungen | Seitenaufrufe, `Affiliate-Klicks`; alternativ Eventname plus Eventanzahl |
| Amazon | Datum, Klicks, bestellte Produkte | Bestellwert, versandte Produkte, Einnahmen |
| Awin | Datum, Klicks, Transaktionen | Umsatz, Provision; in Transaktionsberichten Transaktions-ID und Status |
| Brevo | Datum, Anmeldungen | DOI-Bestaetigungen, zugestellte E-Mails, eindeutige Oeffnungen/Klicks, Abmeldungen |

Fuer die Wochenansicht muss jede Datei eine lesbare Datumsspalte enthalten. Ein
Export ohne Datum kann Gesamt-KPIs liefern, wird aber mit einem Hinweis markiert und
nicht auf Kalenderwochen verteilt.

Brevo-Kontaktlisten mit E-Mail-Adressen sind fuer dieses Dashboard ungeeignet und
sollten aus Datenschutzgruenden nicht verwendet werden. Benoetigt werden aggregierte
Kampagnen- oder Anmeldestatistiken.

## Kennzahlenlogik

- `Affiliate-Outbound-CTR`: Plausible Affiliate-Klicks / Sitzungen
- `Partner-Conversion`: Amazon- und Awin-Bestellungen / deren Klicks
- `Provision pro 1.000 Sitzungen`: Amazon- und Awin-Provision / Plausible-Sitzungen
- `DOI-Rate`: Brevo DOI-Bestaetigungen / Anmeldungen
- `E-Mail-Klickrate`: eindeutige Brevo-Klicks / zugestellte E-Mails
- Kalenderwochen laufen von Montag bis Sonntag nach ISO-Logik.

Amazon und Awin werden nur bei Partner-Klicks, Bestellungen und Provision addiert.
Plausible misst dagegen den Klick auf der eigenen Website. Diese Werte koennen wegen
Adblockern, Zeitraeumen und Anbieterzuordnung voneinander abweichen und werden nicht
automatisch gleichgesetzt.

## Beispieldaten und Validierung

Vier synthetische Beispielexporte liegen unter `tools/kpi-dashboard/fixtures/`.
Sie enthalten keine echten Nutzer- oder Umsatzdaten und koennen zum Kennenlernen
direkt importiert werden.

Validator aus dem Repository ausfuehren:

```bash
node tools/kpi-dashboard/validate.cjs
```

Der Validator prueft CSV-Parsing, deutsche und englische Zahlen/Datumsformate,
Spaltenalias-Erkennung, Plausible-Event- und Awin-Transaktionsableitungen,
Quellenzusammenfuehrung, ISO-Wochen, KPI-Berechnung, fehlende Daten sowie das Fehlen
externer Ressourcen und Browser-Speichermechanismen.
