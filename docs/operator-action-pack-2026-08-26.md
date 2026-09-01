# Betreiber-Aufgaben nach der Optimierungswelle

Stand: 26.08.2026  
Ziel: Die technischen Vorarbeiten in Betrieb nehmen und die fehlenden Primaerdaten liefern. Die Schritte sind nach Wirkung und Abhaengigkeiten geordnet.

## 1. Babywalz-Feed dauerhaft aktivieren

Der lokale Preisstand ist nur eine Momentaufnahme. Fuer aktuelle Preise und Versandkosten benoetigt der taegliche GitHub-Workflow die vollstaendige Awin-Feed-URL.

1. In Awin den Babywalz-Datenfeed oeffnen und die manuelle Download-URL kopieren. Nicht den gekuerzten Produkt-Deeplink und nicht die lokale Datei `imports/awin/babywalz.csv.gz` verwenden.
2. In GitHub das Repository oeffnen: `Settings` -> `Secrets and variables` -> `Actions`.
3. `New repository secret` waehlen.
4. Name exakt: `AWIN_BABYWALZ_FEED_URL`
5. Als Wert die vollstaendige Awin-Download-URL einfuegen und speichern.
6. Unter `Actions` den Workflow `Refresh Babywalz prices` oeffnen und `Run workflow` ausloesen.

Erfolgsmerkmale:

- Secret-Preflight ist gruen.
- Feed-Health meldet `fresh`.
- Sechs von sechs zugeordneten Angeboten sind nutzbar.
- Falls Preise geaendert sind, erzeugt der Workflow automatisch einen Commit.

Die URL ist ein Geheimnis und darf nicht in Chat, Issue, HTML oder Git committed werden. Fuer die gemeinsame Kontrolle reicht danach die Nachricht `Workflow gelaufen` plus ein Screenshot der Workflow-Zusammenfassung.

## 2. Drei URLs in GSC pruefen

In der Google Search Console jeweils `URL-Pruefung` verwenden, die vollstaendige URL einfuegen und danach `Indexierung beantragen` ausloesen:

- `https://kleinkind-welt.de/kinderwagen`
- `https://kleinkind-welt.de/artikel/puzzle-ab-1-jahr`
- nach dem naechsten Deploy: `https://kleinkind-welt.de/artikel/spielzeug-unter-20-euro`

Bei den ersten beiden URLs liegt derzeit kein abgeschlossener Google-Crawl vor. Die API kann den Status auslesen, aber keine normale Indexierungsanfrage fuer uns absenden.

## 3. 90-Tage-Exporte fuer die KPI-Baseline

Zeitraum fuer alle Quellen: die letzten 90 vollstaendigen Tage. Nur aggregierte Berichte exportieren, keine Kontaktlisten oder E-Mail-Adressen.

| Quelle | Erforderliche Werte |
|---|---|
| Plausible | Datum, Sitzungen/Besucher, Seitenaufrufe, Affiliate-Klicks; sinnvoll zusaetzlich Seite, Partner und Placement |
| Amazon | Datum, Klicks, bestellte und versandte Produkte, Bestellwert, Einnahmen, Tracking-ID |
| Awin | Datum, Klicks, Transaktionen, Status, Umsatz, Provision |
| Brevo | Datum, Anmeldungen, DOI-Bestaetigungen, zugestellte E-Mails, eindeutige Oeffnungen/Klicks, Abmeldungen |

Die CSV-Dateien koennen anschliessend lokal in `tools/kpi-dashboard/index.html` importiert werden. Das Dashboard sendet nichts ins Netz und speichert nichts dauerhaft.

## 4. Eigene Erfahrung fuer den Stapelbecher-Pilot

Noch nicht als Produkttest veroeffentlichen. Zuerst in `docs/experience-pilot-stapelbecher.md` dokumentieren:

- exakter Produktname, Hersteller, Modell und Bezugsquelle;
- ob es genau das verlinkte Produkt ist;
- drei eigene Fotos ohne erkennbares Kindergesicht;
- Beobachtungen an Tag 1, 7, 14 und 30;
- Reinigung, Platzbedarf, benoetigte Hilfe und erkennbare Grenzen.

Bis dieser Nachweis vollstaendig ist, bleibt die sichtbare Kennzeichnung korrekt bei `Redaktionelle Einordnung` und `Kein eigener Produkttest`.

## 5. Fuenf bis acht kurze Elterninterviews

Passende Teilnehmende: Eltern, Grosseltern oder Paten, die in den letzten sechs Monaten Spielzeug fuer ein Kind zwischen 0 und 3 Jahren gesucht oder gekauft haben.

Leitfragen fuer 15 Minuten:

1. Was war bei deinem letzten Kauf am schwierigsten?
2. Welche Information haette einen Fehlkauf verhindert?
3. Was verstehst du auf der Produktkarte unter `Redaktionelle Einordnung`?
4. Welchem der beiden Haendlerbuttons wuerdest du folgen und warum?
5. Hilft dir der Gesamtpreis inklusive Versand bei der Entscheidung?
6. Wie wirkt der Hinweis auf KI-gestuetzte Bilder auf dein Vertrauen?
7. Was muesste Kleinkind-Welt zeigen, damit du wiederkommst oder die Seite empfiehlst?

Keine Zustimmung vorwegnehmen und nicht erklaeren, was die richtige Antwort sein soll. Fuer jede Person nur Rolle, Datum und Kernaussagen notieren; keine Namen veroeffentlichen.

## 6. Babywalz um Produktbildfreigabe bitten

Die offizielle Awin-Banner-Einbindung ist durch die Betreiberangabe zur Akzeptanzmail dokumentiert und bereits integriert. Fuer Produktbilder aus dem Feed ist weiterhin eine separate schriftliche Bestaetigung sinnvoll.

Anfrage an Babywalz/Awin:

> Hallo, ich bin mit Kleinkind-Welt als Publisher im Babywalz-Partnerprogramm freigeschaltet. Darf ich die im Awin-Produktfeed bereitgestellten Produktbilder auf redaktionellen Affiliate-Seiten einbinden, solange Bild-URL, Produktzuordnung und Deeplink aus dem Feed stammen und die Bilder nicht veraendert werden? Gilt die Freigabe auch fuer lokale Zwischenspeicherung oder ausschliesslich fuer die von Awin gelieferte Bild-URL? Vielen Dank fuer eine kurze schriftliche Bestaetigung.

Update 01.09.2026: Der Betreiber hat die Nutzung der Babywalz-Produktfeed-Bilder im Affiliate-Kontext bestätigt. Babywalz-Bilder dürfen deshalb direkt von der Feed-URL geladen werden; lokale Speicherung oder Bearbeitung bleibt ohne separate Bestätigung ausgeschlossen. Für andere Programme gilt die bisherige Sperre weiterhin.

## 7. Realistische Pflegekapazitaet festlegen

Einmal entscheiden, wie viele Stunden pro Woche dauerhaft fuer Aktualisierung, eigene Tests, Interviews und Outreach verfuegbar sind. Der 90-Tage-Plan wird danach auf diese Kapazitaet reduziert; neue Artikel haben bis dahin keine Prioritaet.

## Empfohlene Reihenfolge

1. Feed-Secret setzen und Workflow starten.
2. Drei GSC-Anfragen absenden.
3. Vier 90-Tage-Exporte erstellen.
4. Konkreten Stapelbecher fuer den Erfahrungspilot festlegen.
5. Interviewpersonen ansprechen.
6. Babywalz-Bildfreigabe schriftlich klaeren.
7. Wochenkapazitaet festlegen.
