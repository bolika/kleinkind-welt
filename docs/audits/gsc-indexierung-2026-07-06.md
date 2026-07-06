# GSC-Indexierungscheck vom 06.07.2026

## Kurzfazit

Die Search Console zeigt aktuell kein technisches Indexierungsproblem. Sitemap, Redirects, Canonicals und Live-HTTP-Status sind sauber. Die offenen Punkte sind vor allem Crawl-Priorisierung und Indexierungsverzug bei neuen oder saisonalen URLs.

## Geprüfte Signale

- Sitemap live: 30 URLs
- GSC-Sitemap-Status nach erneutem Submit: 30 eingereichte URLs, 0 Fehler, 0 Warnungen
- Letzter Sitemap-Submit: 06.07.2026
- URL Inspection für Sitemap-URLs: 20 indexiert, 10 noch nicht indexiert oder Google noch unbekannt
- Alte `.html`-Artikel-URLs: live 301 auf saubere URLs, kein aktueller Redirect-Fehler
- Canonicals der indexierten URLs: passend

## Prioritäten

### P1: Nicht indexierte, aber wichtige URLs beschleunigen

Diese URLs sind in der Sitemap, aber laut URL Inspection noch nicht indexiert oder Google noch unbekannt:

- `https://kleinkind-welt.de/spielzeug-nach-alter`
- `https://kleinkind-welt.de/geschenke-kleinkind`
- `https://kleinkind-welt.de/saisonale-empfehlungen/sommer-spielzeug`
- `https://kleinkind-welt.de/artikel/badespielzeug-kleinkind`
- `https://kleinkind-welt.de/artikel/was-wir-nicht-kaufen`
- `https://kleinkind-welt.de/artikel/weihnachtsgeschenke-kleinkind`
- `https://kleinkind-welt.de/artikel/sprache-foerdern-spielzeug`
- `https://kleinkind-welt.de/artikel/outdoor-spielzeug-kleinkind`
- `https://kleinkind-welt.de/artikel/spielzeug-balkon-kleinkind`
- `https://kleinkind-welt.de/artikel/reisespielzeug-kleinkind`

Empfehlung: In der GSC für diese URLs manuell "Indexierung beantragen" auslösen. Die API kann URL Inspection lesen, aber für normale Artikel keine Indexierung beantragen.

### P2: Interne Linksignale stärken

Erledigt:

- Homepage verlinkt Reise- und Balkon-Spielzeug zusätzlich im Sommerbereich und in den Situations-Quicklinks.
- Kaufhilfen-Übersicht verlinkt Balkon-Spielzeug und Reisespielzeug.
- Altersartikel 12-18 und 18-24 Monate verlinken den Sprachförderungs-Ratgeber kontextuell.

### P3: Sitemap frisch halten

Erledigt:

- `lastmod` für die geänderten URLs aktualisiert.
- Sitemap über die Search-Console-API neu eingereicht.

## Monitoring

In 3 bis 7 Tagen erneut prüfen:

- Ob die 4 Google-unbekannten URLs entdeckt wurden.
- Ob die 6 "Discovered - currently not indexed"-URLs in Richtung Indexierung wechseln.
- Ob die Hubseiten `spielzeug-nach-alter` und `geschenke-kleinkind` Impressionen bekommen.

Wenn danach noch wichtige URLs neutral bleiben, nächste Welle:

- Weitere kontextuelle Links aus bereits indexierten Money-Artikeln.
- Kurzer Abschnitt auf den betroffenen Seiten mit stärkerer Suchintention und klarerem Nutzen.
- GSC-Live-Test plus erneutes manuelles Indexing in der Oberfläche.
