# Wachstum: Bestandsaufnahme und naechste Schritte

Stand: 9. September 2026. Analyse, keine Aenderung oder Veroeffentlichung der Website.

Fortschritt: Die anschliessend beauftragte lokale Umsetzung und die verbleibenden Betreiberaufgaben stehen in [growth-implementation-2026-09-09.md](growth-implementation-2026-09-09.md). Dieser Bericht dokumentiert weiterhin den Zustand vor der Umsetzung.

## Entscheidung

Der primaere Engpass ist die geringe Suchsichtbarkeit. Ein grundsaetzliches Conversion- oder Designversagen ist mit diesen Daten nicht nachgewiesen. Bestehende Seiten gezielt staerken, statt weitere breite Themen oder einen erneuten Komplettumbau zu starten.

## Umfang und Grenzen

- Alle 40 aktuellen Sitemap-URLs live abgerufen und einzeln ueber die authentifizierte GSC URL Inspection API geprueft. Der lokale API-Zugang funktioniert.
- SEO-Smoke-Test und interner Link-Audit bestanden: 40 Seiten, 569 eindeutige interne Verbindungen, maximale Klicktiefe zwei im geprueften Graphen.
- Zehn repraesentative Seiten bei 390 und 1440 Pixeln Breite im Browser untersucht: Startseite, Alters- und Geschenke-Hub, Unter 20 Euro, DUPLO, Montessori, Geschenke 2 Jahre, Geburt, Weihnachten und Kinderwagen-Navigator. Geometrie und Browserfehler automatisiert geprueft, ausgewaehlte Screenshots visuell angesehen.
- Kein horizontaler Ueberlauf und keine JavaScript-Fehler in diesen 20 Ansichten. Kein vollstaendiger Funktionstest aller Formulare und Navigator-Pfade; kein neuer Lighthouse-/CWV-Test. Noch nicht geladene Lazy-Images sind damit nicht vollstaendig geprueft.
- Plausible: bereitgestellter ZIP-Export vom 12. August bis 8. September. GSC: finale Daten vom 10. August bis 6. September; deshalb kein exakt identischer Zeitraum.
- Der Export enthaelt noch keine Wirkung der am 9. September veroeffentlichten DUPLO- und Geburt-Ueberarbeitung. Rohdaten bleiben ausserhalb des Repositorys.

## Was die Daten zeigen

| Kennzahl | Befund | Einordnung |
| --- | --- | --- |
| Plausible | 22 Besucher, 22 Besuche, 45 Seitenaufrufe | Sehr kleine Stichprobe, keine belastbaren Designvergleiche |
| Organische Suche | 6 Besucher: Ecosia 3, Bing 2, Yandex 1 | Im Export keine Google-Zugriffe |
| KI-Assistenten | 3 Besucher von ChatGPT | Positives Signal, keine belastbare Wachstumskurve |
| Affiliate-Klick | 4 eindeutige Besucher, 7 Ereignisse | Nicht mit den 8 allgemeinen Outbound-Klicks addieren |
| Google aktuell | 271 Impressionen, 0 Klicks, Position 69,1 | Geringe Sichtbarkeit weit hinter den vorderen Ergebnissen |
| Google Vorperiode | 270 Impressionen, 1 Klick, Position 67,6 | In diesem Vergleich kein starker Impressionseinbruch |

Vier Babywalz-Klickereignisse lassen sich ueber die vorhandenen clickref-URLs der Budget-Seite zuordnen. Bezahlte Custom Properties sind fuer diese Zuordnung nicht erforderlich. Die aggregierten CSVs erlauben keine Verbindung von ChatGPT-Quelle, konkreter Landingpage und Kaufabschluss. Bestaetigte Provisionen fehlen.

Die Budget-Seite hatte vier Besucher, aber nur einen Einstieg. Ihre 100 Prozent Absprungrate sind deshalb nicht als vier verlorene Interessenten zu lesen. DUPLO hatte vier Einstiege; die Geburt-Seite drei Besucher mit hoher gemessener Lesetiefe. Daraus folgt keine statistisch belastbare Aussage ueber die neuen Designs.

## Indexierung

Alle 40 URLs antworten mit HTTP 200, haben eine passende Canonical-URL, genau eine H1 und keine JSON-LD-Parsefehler. Das ist keine Garantie fuer Ranking oder vollstaendige Schema-Konformitaet.

GSC meldet 32 als indexiert. Offen sind:

| URL-Pfad | Gespeicherter GSC-Status |
| --- | --- |
| /artikel/kinderwagen-arten | Google unbekannt |
| /artikel/kinderwagen-stadt-oder-land | Google unbekannt |
| /artikel/kinderwagen-kofferraum | Gefunden, derzeit nicht indexiert |
| /artikel/kinderwagen-gesamtpreis | Google unbekannt |
| /artikel/kinderwagen-gebraucht-kaufen | Google unbekannt |
| /artikel/spielzeug-rotieren-kleinkind | Gefunden, derzeit nicht indexiert |
| /artikel/adventskalender-kleinkind | Google unbekannt |
| /artikel/nikolausgeschenke-kleinkind | Google unbekannt |

Weihnachtsgeschenke, DUPLO, Geburt und der Kinderwagen-Hub sind bereits indexiert. Der letzte gespeicherte Homepage-Crawl stammt vom 4. Juli. Die Sitemap wurde zuletzt am 5. September gelesen, ohne gemeldete Fehler; die API nennt noch 38 eingereichte URLs, aktuell sind es 40. Das Sitemap-Feld indexed=0 ist hier kein Beleg fuer null indexierte Seiten.

Die URL Inspection API zeigt den gespeicherten Indexstand, keinen Live-Indexierungstest. Eine Indexierungsanfrage erfolgt ueber die GSC-Oberflaeche, nicht ueber diesen API-Read. Wiederholte Anfragen beschleunigen die Aufnahme nicht garantiert.

## Priorisierter Arbeitsplan

### 1. Kleine technische Regression beheben

Auf DUPLO und Geburt laden mobile Browser zwei Hero-Dateien: den vollen WebP-Preload und die responsive 480er-Datei. Gemessen wurden rund 51,6 plus 15,7 KB bei DUPLO und 50,1 plus 12,3 KB bei Geburt. Die neuen responsiven Bilder und der bestehende Preload sind nicht synchron.

**Codex:** Preload mit imagesrcset/imagesizes abstimmen oder redundanten Preload entfernen; fetchpriority beibehalten, Netzwerk-Regressionstest ergaenzen. Abnahme: pro Seite nur ein passender Hero-Kandidat bei mobilen und Desktop-Viewports. Kein versprochener Rankinggewinn.

### 2. Bestehende Seiten bei Google nachfassen

**Codex:** Die acht offenen Seiten auf eigenstaendigen Nutzen und passende Kontextlinks pruefen. Schwerpunkt zunaechst Adventskalender, Nikolaus, Kinderwagen-Arten und Kofferraum. Nicht einfach weitere Links in den Footer legen. Monitoring um diese Seiten und aktuelle Release-Daten ergaenzen.

**Boris:** In GSC fuer diese priorisierten URLs den Live-Test ausfuehren und, sofern moeglich, einmal Indexierung beantragen. Auch die deutlich aktualisierte Startseite nachfassen; aktuelle Sitemap einmal erneut senden, falls noch nicht seit den neuen Saisonseiten erfolgt. Keine taeglichen Wiederholungen. Nach 7-14 Tagen Status erneut lesen; Aufnahme ist nicht garantiert.

### 3. Geschenke zum zweiten Geburtstag vereinfachen

Mobil steht der erste direkte Affiliate-Link erst bei rund 6.220 Pixeln Dokumentposition; auf Desktop rund 4.210. Auswahlhilfen und Hintergrundtexte gehen den Empfehlungen voraus. Das ist eine nachgewiesene lange Strecke, kein gemessener Abbruchgrund.

**Codex:** Drei Einstiege nach Spielmoment, eine begruendete Empfehlung je Moment, Produktbild und ein primaerer Haendler-CTA. Methodik, Entwicklung, Budget-Details und weitere Fragen nach der Auswahl. Bestehende relevante Antworten, URLs und Anker erhalten. Keine neuen geschlechtsspezifischen Duplikatseiten.

Abnahme: Auf 390 Pixeln Breite ist die Auswahl im ersten oder unmittelbar folgenden Bildschirm erreichbar; direkte Empfehlung ohne mehrere Ratgeberabschnitte. Keine Textueberlappungen, konsistente Preise und Affiliate-Hinweise, SEO-Test bestanden.

### 4. Eigene Substanz statt weiterer austauschbarer Artikel

Aktuelle GSC-Ansaetze: Geschenke-Hub 136 Impressionen / Position 71,3; Montessori 62 / 62,5; Geschenke 2 Jahre 32 / 71,7. Diese Seiten haben bereits Suchkontakte, aber noch keine starken Rankings.

**Codex:** Montessori auf den bestehenden Intent ab einem Jahr schaerfen: konkrete Spielsituation, Altersgrenze, was das Kind selbst tun kann, Grenzen des Produkts. Geschenke-Hub direkt nach Alter und Anlass fuehren, wiederholte Einleitungen kuerzen. DUPLO und Budget vorerst strukturell stabil halten.

**Boris:** Fuer zwei bis drei vorhandene Produkte echte Beobachtungen und eigene Bilder liefern: Was funktioniert? Was nervt? Wie viel Platz braucht es? Was nutzt das Kind wirklich? Haende und Produkt reichen; Kinder muessen nicht erkennbar sein. Keine neuen Produkte nur fuer vermeintlichen SEO-Bedarf kaufen.

**Codex:** Erfahrungen redaktionell einarbeiten und von Herstellerangaben trennen. Gesundheits-/Entwicklungsbehauptungen pruefen, besonders Outdoor-Aussagen zu Immunabwehr/Stresshormonen und die pauschale Ueberlegenheit offenen Spielzeugs auf der 2-Jahre-Seite. Quellen ergaenzen oder Aussagen einschraenken. Kein behaupteter Google-Penalty-Befund.

### 5. Vorhandenen Saison-Content nutzbar machen

Weihnachtsgeschenke, Adventskalender und Nikolaus existieren bereits. Nicht drei neue Artikel daneben erstellen.

**Codex:** Sortiment, Lieferbarkeit, Alterseignung und Babywalz-Angebote pruefen; pro Anlass wenige passende Empfehlungen. Bestehende Geschenke-Navigation saisonal ergaenzen. Adventskalender: sinnvolle kleine Inhalte und Wiederverwendung; Nikolaus: kleine Geschenke; Weihnachten: groessere gemeinsame Spielmomente. Keine identischen Listen auf drei URLs.

**Boris und Codex:** Aus einem wirklich hilfreichen Beitrag ein kleines teilbares Format entwickeln, etwa drei konkrete Spielideen mit eigenen Bildern. Zunaechst ein passender vorhandener Kanal statt mehrerer neuer Accounts. Externe Veroeffentlichung nur nach Freigabe; keine kuenstlichen Reddit-Erwaehnungen oder gekauften Links.

### 6. Wirkung und Wirtschaftlichkeit nachvollziehbar messen

**Codex:** Einen woechentlichen Bericht mit absoluten Werten aufsetzen: indexierte Prioritaetsseiten, Impressionen/Klicks pro Cluster, Einstiege, eindeutige Affiliate-Klicker und Babywalz-clickrefs. Newsletter-Abschluss getrennt von blossem Formularaufruf pruefen. Bestehende Ereignisse nutzen, keine kostenpflichtigen Properties voraussetzen.

**Boris:** Monatliche Hosting-/Trackingkosten sowie bestaetigte Amazon-/Awin-Provisionen nennen. Wirtschaftlichkeit mit echten Werten berechnen: monatliche Kosten geteilt durch durchschnittliche bestaetigte Provision pro Bestellung. Stornos und Freigabe-Verzoegerungen beachten.

Die Releases vom 9. September markieren und nach vier Wochen erneut auswerten. Bei weiterhin kleinen Fallzahlen nur beschreibend vergleichen, keine A/B-Tests und keine kausalen Uplift-Versprechen. Technische Fehler sofort beheben; ansonsten Layout und Titel nicht jede Woche neu aendern.

## Bewusst nicht priorisiert

- Erneuter kompletter Designwechsel oder wahlloses Ausrollen neuer Produktlisten.
- Mehr Kinderwagenmodelle ohne zusaetzlichen Nutzerbedarf; zuerst bestehende Inhalte auffindbar machen.
- Extra AI-Schema, llms.txt als vermeintlicher Wachstumstrick oder massenhaft eng verwandte KI-Artikel.
- Bezahlte Reichweite, bevor Kosten, bestaetigte Provisionen und organische Auswahlwege nachvollziehbar sind.

## Quellen und Einordnung

- Eigener Plausible-Export, authentifizierte GSC-Abfragen und Live-Browserpruefungen vom 9. September 2026. API-Rohdaten und Screenshots liegen temporaer unter /tmp/kw-audit-20260909 und sind keine dauerhaft archivierten Projektdateien.
- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): SEO-Grundlagen gelten weiter; keine spezielle AI-Auszeichnung erforderlich.
- [Google: High-quality reviews](https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews?hl=en): eigene Evidenz, nachvollziehbare Unterschiede und relevante Entscheidungshilfen statt Textmenge.
- [Google: URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect): gespeicherter Indexstand, kein Live-Test.
- [Google: Recrawl requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl): Anfrage garantiert keine Aufnahme; wiederholte Anfragen sind keine Beschleunigungsstrategie.
