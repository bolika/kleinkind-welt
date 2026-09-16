# Status am 14. September 2026

Read-only-Pruefung von Produktion und GSC. Keine Website-Aenderung, keine Indexierungsanfrage, kein Push. Plausible-Export fuer die neue Woche steht aus.

## Ergebnis

Technische Erreichbarkeit und gepruefte Auswahlwege funktionieren. Die Google-Sichtbarkeit bleibt sehr gering und ist in den verglichenen Zeitraeumen ruecklaeufig. Ein Effekt des am 11. September gepushten Releases laesst sich daraus noch nicht ableiten.

## Suchleistung

Quelle: authentifizierte Search-Analytics-API, Property sc-domain:kleinkind-welt.de, Suchtyp web, dataState final. Gesamtzahlen stammen aus Abfragen ohne Dimensionen, nicht aus der Summe der sichtbaren Suchanfragen. Abfragedatum 14.09.; konservativer Datenabschluss 11.09.

| Kennzahl | 05.-11.09. | 29.08.-04.09. |
| --- | ---: | ---: |
| Impressionen | 32 | 43 |
| Klicks | 0 | 0 |
| Durchschnittliche Position | 60,3 | 68,6 |

Das sind 11 Impressionen weniger (-25,6 Prozent). Die durchschnittliche Position ist rechnerisch besser, kann bei wenigen und wechselnden Suchanfragen aber keinen stabilen Rankinggewinn belegen.

| Kennzahl | 15.08.-11.09. | 18.07.-14.08. |
| --- | ---: | ---: |
| Impressionen | 196 | 334 |
| Klicks | 0 | 1 |
| Durchschnittliche Position | 67,9 | 68,4 |

Im 28-Tage-Vergleich fehlen 138 Impressionen (-41,3 Prozent). Das ist ein Rueckgang auf kleiner absoluter Basis, kein Beleg fuer eine technische Abstrafung oder einen durch das neue Design verursachten Verlust. Diese Zeitfenster unterscheiden sich vom Audit am 09.09.; dessen 271 Impressionen sind kein direkt vergleichbarer Vorperiodenwert.

### Seiten mit Suchkontakten

| Seite | Impressionen letzte 28 Tage | Vorherige 28 Tage | Position aktuell |
| --- | ---: | ---: | ---: |
| Geschenke-Hub | 117 | 169 | 71,1 |
| Montessori | 33 | 70 | 62,1 |
| Startseite | 21 | 1 | 72,1 |
| Geschenke 2 Jahre | 11 | 39 | 65,8 |
| Geschenke 1 Jahr | 4 | 1 | 84,5 |
| Geschenke 3 Jahre | 3 | 28 | 75,3 |

In der letzten Woche entfielen 21 der 32 seitenbezogen gezaehlten Impressionen auf den Geschenke-Hub. Sichtbare Suchanfragen betreffen vor allem geschenke fuer kleinkinder, geschenk kleinkind und kleinkinder geschenke. Die Budget-Seite hatte zwei Impressionen bei Durchschnittsposition 6,5: ein kleiner Ansatz, noch kein belastbarer Top-10-Erfolg. Suchanfragen werden bei kleinen Mengen teilweise nicht ausgegeben; keine Nachfrage aus fehlenden Query-Zeilen ausschliessen.

## Indexierung aller 40 Sitemap-URLs

32 indexiert, dieselben acht wie am 09.09. weiterhin nicht indexiert. Kein abweichendes Google-Canonical bei den URLs, fuer die Google ein Canonical liefert.

| URL | Aktueller gespeicherter Status |
| --- | --- |
| https://kleinkind-welt.de/artikel/kinderwagen-arten | Google unbekannt |
| https://kleinkind-welt.de/artikel/kinderwagen-stadt-oder-land | Google unbekannt |
| https://kleinkind-welt.de/artikel/kinderwagen-kofferraum | Google unbekannt |
| https://kleinkind-welt.de/artikel/kinderwagen-gesamtpreis | Google unbekannt |
| https://kleinkind-welt.de/artikel/kinderwagen-gebraucht-kaufen | Gefunden, derzeit nicht indexiert |
| https://kleinkind-welt.de/artikel/spielzeug-rotieren-kleinkind | Google unbekannt |
| https://kleinkind-welt.de/artikel/adventskalender-kleinkind | Gefunden, derzeit nicht indexiert |
| https://kleinkind-welt.de/artikel/nikolausgeschenke-kleinkind | Gefunden, derzeit nicht indexiert |

Adventskalender, Nikolaus und Gebrauchtkauf waren am 09.09. noch als unbekannt ausgewiesen. Kofferraum und Rotation waren damals als gefunden ausgewiesen und werden jetzt als unbekannt gemeldet. Diese Statuswechsel bedeuten keine belegte Entfernung aus dem Index: Beide waren auch damals nicht indexiert. Unbekannt ist eine Meldung des gespeicherten API-Standes, kein Nachweis, dass eine manuelle Einreichung unterblieben ist.

Sitemap: zuletzt am 09.09. um 14:37 UTC gelesen, 40 Eintraege statt zuvor 38, null Fehler und null Warnungen. Das API-Sitemapfeld indexed=0 wird nicht als Indexierungszahl verwendet; massgeblich sind die einzelnen URL-Pruefungen.

### Letzte gemeldete Crawls

| Seite | Datum |
| --- | --- |
| Kinderwagen-Hub | 13.09.2026 |
| Geschenke-Hub | 13.09.2026 |
| Montessori | 11.09.2026 |
| DUPLO | 28.08.2026 |
| Geschenke zur Geburt | 23.08.2026 |
| Geschenke 2 Jahre | 29.07.2026 |
| Startseite | 04.07.2026 |

Die [URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect) liefert den gespeicherten Indexstand, keinen Live-Indexierungstest. Ein neues Crawl-Datum belegt nicht allein, welche konkrete Inhaltsversion verarbeitet wurde.

## Live-Pruefung

- SEO-Smoke-Test fuer alle 40 Sitemap-Seiten lokal und live bestanden, einschliesslich der im Test enthaltenen Redirect-/Canonical-Pruefungen.
- Geschenke 2 Jahre, Geschenke-Hub und Montessori live bei 360, 390, 768 und 1440 Pixeln geprueft: keine horizontalen Ueberlaeufe oder JavaScript-Fehler; Anker, Produktbilder und FAQ-/Schema-Abgleich bestanden. Geschenke-Alternativen auch ohne JavaScript bedienbar.
- Erster Haendlerbutton bei Geschenke 2 Jahre auf 390 Pixeln nach 1391 Pixeln Dokumenthoehe. Die vereinfachte Fassung ist live.
- Babywalz-Feed: Stand 13.09. um 08:33 UTC, 23 von 23 Angeboten in_stock, gueltig bis 15.09. um 08:33 UTC. Keine Zusage der zukuenftigen Verfuegbarkeit.
- Kein neuer Lighthouse-/Core-Web-Vitals-Test und keine Pruefung manueller Google-Massnahmen oder Sicherheitsmeldungen in der GSC-Oberflaeche. Kein Nachweis bestaetigter Verkaeufe ohne Haendlerberichte.

## Naechste Schritte

1. Bereits eingereichte URLs nicht taeglich erneut beantragen. Die acht Status am 21.09. erneut lesen. Falls bisher noch nicht beantragt: insbesondere Advent und Nikolaus einmal ueber die GSC-Oberflaeche live testen und Indexierung beantragen.
2. Bei stark veraenderten, lange nicht gecrawlten Seiten wie Startseite, Geschenke 2 Jahre und Geburt einmal nachfassen, sofern dies nach der Veroeffentlichung noch nicht geschehen ist. Keine Aufnahme garantieren.
3. Design und Titel vorerst stabil lassen. Echte Produkterfahrungen bleiben ein sinnvoller naechster inhaltlicher Beitrag; keine neue breite Artikelserie aus diesen geringen Query-Mengen ableiten.
4. Den angekuendigten Plausible-ZIP mit Datumsbereich ergaenzen: Einstiegsseiten, Quellen einschliesslich KI-Assistenten, Affiliate-Klicker und Ereignisse getrennt, interne Weiterklicks und Newsletter-Ziele. Quellen und Klickziele aus aggregierten Exporten nicht zu erfundenen Nutzerreisen verbinden.
5. GSC und Plausible nur mit expliziten Zeitraeumen vergleichen. Der GSC-Vergleich hier endet am 11.09.; ein aktueller Plausible-Bericht kann bereits den 13.09. enthalten. Der Release vom 11.09. ist in diesem GSC-Fenster praktisch noch nicht bewertbar.

Rohdaten liegen privat unter /tmp/kw-status-20260914.json und wurden nicht ins Repository uebernommen. Browser-Screenshots sind temporaere lokale Pruefartefakte. Dieser Bericht wurde lokal abgelegt, nicht gepusht.
