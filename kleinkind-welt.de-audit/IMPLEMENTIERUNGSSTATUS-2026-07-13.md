# Implementierungsstatus der Prioritäten-Roadmap

Stand: 13.07.2026  
Scope: lokaler Repository-Stand, noch nicht veröffentlicht

## Ergebnis

Die lokal umsetzbaren P0- und P1-Maßnahmen sind weitgehend abgeschlossen. Der Stand besteht den erweiterten SEO-Smoke-Test für alle 30 Sitemap-Seiten. Die frühere Sternelogik wurde durch eine offen gekennzeichnete redaktionelle Einordnung ersetzt; Produktempfehlungen behaupten keinen eigenen vollständigen Produkttest.

## Erledigt

### P0 – Evidenz und Publish-Gates

- 127 sichtbare Produktempfehlungen tragen jetzt Evidenz-ID, Evidenztyp, Prüftag und den Hinweis „Kein eigener Produkttest“.
- 127 zugehörige Datensätze liegen in `data/editorial-evidence.json`; HTML und Datensatz werden vom Smoke-Test gegeneinander geprüft.
- Auf den 30 Sitemap-Seiten verbleiben 0 sichtbare Sternzeichen und 0 numerische `x/5`-Produktbewertungen.
- `bewertungsmethode.html`, Über-uns-Seite, Design-System und `llms.txt` beschreiben die neue Methodik konsistent.
- Der Smoke-Test blockiert unter anderem unbelegte Test-/Siegerbegriffe, falsche CE-Aussagen, Review-/Rating-Schema ohne Evidenz, fehlende Evidenzdatensätze, inkonsistente Änderungsdaten, nicht zugängliche FAQ-Komponenten und unbeschriftete Tabellen.
- `Article.dateModified` und Sitemap-`lastmod` wurden für den substanziellen Release auf den 13.07.2026 aktualisiert.

### P1 – priorisierte Seiten und UX

- `/artikel/spielzeug-unter-20-euro`: Preis-, Safety- und Förderversprechen abgeschwächt; Snippet, FAQ und Empfehlungen evidenzkonform überarbeitet.
- `/artikel/spielzeug-12-18-monate`: Entwicklungsversprechen und Lauflernwagen-Aussagen korrigiert; Seitenausrichtung geschärft.
- `/artikel/nachhaltiges-spielzeug-siegel`: CE, GS, FSC, GOTS und OEKO-TEX sachlich getrennt; offizieller, versionierter Siegel-Datensatz unter `data/spielzeug-siegel.json` ergänzt.
- `/artikel/motorikspielzeug-test`: sichtbare Seite als redaktionelle Empfehlung statt eigener Produkttest eingeordnet; Sterne und überzogene Wirkversprechen entfernt; URL aus SEO-Gründen stabil gelassen.
- Alle 20 früher skriptgesteuerten FAQ-Blöcke nutzen jetzt echte Buttons mit `aria-expanded`, `aria-controls`, Enter-/Leertasten-Unterstützung und sichtbarem Fokus. Ohne JavaScript bleiben die Antworten lesbar.
- `docs/*` erhält über `_headers` `X-Robots-Tag: noindex, nofollow`.
- Die Hubs Spielzeug nach Alter, Geschenke und Sommer-Spielzeug enthalten zusätzliche Auswahl- und Abgrenzungslogik.
- Alle 30 Sitemap-Seiten besitzen einen Skip-Link; alle 21 Tabellen eine zugängliche Beschriftung.
- Newsletter-Honeypots wurden für assistive Technik konsistent umgesetzt; `prefers-reduced-motion` wird berücksichtigt.

### P2 – sofort sinnvolle Arbeiten

- Die drei überlangen Titles für Outdoor-, Reise- und Balkon-Spielzeug wurden gekürzt.
- Der Siegel-Datensatz ist als erstes zitierfähiges First-Party-Asset angelegt.
- Responsive Bilder wurden geprüft, aber nicht pauschal umgebaut: Viele vermeintlich fehlende `srcset`-Attribute liegen bereits in `picture`-Elementen mit WebP-Quelle, sind kleine Autorenbilder oder SVGs. Bei sehr guten bestehenden Performance-Werten wäre eine Massenänderung ohne messbaren Nutzen unverhältnismäßig.

## Verifikation

- SEO-Smoke-Test: **30/30 Sitemap-Seiten bestanden**.
- Evidenz-Parität: **127 Marker / 127 Datensätze**.
- Produktbewertungen auf Sitemap-Seiten: **0 Sternzeichen**.
- Skip-Links: **30/30 Seiten**.
- Tabellen: **21/21 beschriftet**.
- Statischer Accessibility-Scan, Schweregrad `critical`: **0 Befunde in 53 Dateien**.
- Mobile DOM-Prüfung bei 390 px: `clientWidth = 390`, `scrollWidth = 390`; kein horizontaler Seitenüberlauf.
- FAQ-Browserprobe: 6/6 Fragen der Stichprobenseite als ARIA-Buttons erzeugt und zunächst korrekt eingeklappt.
- JavaScript-Syntax, beide JSON-Datensätze und `git diff --check`: bestanden.

## Noch offen oder extern abhängig

1. **Deployment und Live-Prüfung:** Der Stand wurde absichtlich nicht veröffentlicht. Nach Freigabe müssen Deploy, Live-Smoke-Test, Response-Header von `/docs/*` und wichtige Mobilansichten geprüft werden.
2. **Menschliche Schlussredaktion:** Safety-, Alters- und Gesundheitsthemen brauchen weiterhin eine verantwortliche Endfreigabe. „AI only“ sollte technisch als AI-operated, evidenzgebunden und menschlich verantwortet verstanden werden.
3. **Produktgenauigkeit:** Die aktuelle Kennzeichnung ist ehrlich, ersetzt aber keine Prüfung jeder Modellnummer, Lieferumfangsänderung oder aktuellen Händlerangabe. Preise und Verfügbarkeit müssen vor Veröffentlichung beziehungsweise regelmäßig live geprüft werden.
4. **GSC/Plausible-Lernphase:** CTR- und Rankingwirkung lässt sich erst nach Deployment und etwa 6–8 Wochen mit ausreichend Impressionen bewerten.
5. **Authority-Aufbau:** Outreach und Backlinkgewinnung erfordern externe Ansprache und wurden nicht automatisch ausgelöst.
6. **Weitere Bildoptimierung:** Nur datenbasiert nachziehen, falls echte LCP-, Transfergrößen- oder Conversion-Daten einen Engpass zeigen.

## Empfohlener nächster Release-Ablauf

1. Inhaltlichen Diff stichprobenartig gegenlesen.
2. Den aktuellen Stand deployen.
3. `node tools/seo-smoke-test.mjs --base-url=https://kleinkind-welt.de` ausführen.
4. Header von `/docs/integrations/brevo-doi-template.html` auf `X-Robots-Tag` prüfen.
5. GSC- und Plausible-Baseline am Releasetag notieren und nach 2, 4 und 8 Wochen vergleichen.
