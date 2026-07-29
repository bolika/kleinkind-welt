# Aktionsplan kleinkind-welt.de · 29.07.2026

Abgeleitet aus `FULL-AUDIT-2026-07-29.md`. Sortiert nach Wirkung pro Aufwand, nicht nach
Kategorie. Health Score aktuell 84 von 100.

**Grundannahme:** Die Seite hat kein Handwerksproblem. Technik, Schema, Bilder und On-Page
sind sauber. Was fehlt, ist Autorität und die Bedienung der Suchintentionen, die schon
Impressionen erzeugen. Die Maßnahmen unten sind entsprechend gewichtet: wenig Technik, viel
Inhalt und Positionierung.

---

## Phase 1 — Woche 1

### 1.1 Navigator-CLS beheben (High)

CLS 0,455 gegen eine „schlecht"-Schwelle von 0,25. Ursache: Die Ladekarte
(`.navigator-loading-card`) ist deutlich niedriger als die Fragekarte, die sie nach dem
JSON-Laden ersetzt.

Fix: `min-height` auf dem Container `[data-navigator-app]` setzen, die der ersten Fragekarte
entspricht — gemessen etwa 460 px auf Mobil, 380 px auf Desktop. Alternativ ein Skeleton mit
gleicher Höhe.

Dringlichkeit: Solange `noindex` gesetzt ist, wertet Google es nicht. Vor dem Launch muss es
weg sein, und es ist ein Zehn-Minuten-Fix.

### 1.2 Geschenke-Hub von 818 KB entlasten (High)

Meistgesehene Seite der Site. `geschenke-3-jahre.jpg` bringt 423 KB, obwohl
`geschenke-3-jahre.webp` bereits im Repo liegt und ungenutzt ist.

Fix: `<img>` durch `<picture>` mit WebP-Quelle und JPG-Fallback ersetzen — dasselbe Muster,
das andere Artikel schon verwenden. Erwartete Ersparnis rund 350 KB.

Anschließend die 14 Dateien über 200 KB prüfen, besonders
`geschenke-1-jahr-hero.jpg` (691 KB) und `outdoor-spielzeug-kleinkind.jpg` (617 KB).

### 1.3 `loading="lazy"` vervollständigen (Medium)

Nur 69 von 209 `img`-Tags haben es. Regel: alles außer dem Hero-Bild oberhalb der Falz lazy
laden. Beim Hero bewusst **nicht**, weil es meist das LCP-Element ist.

### 1.4 Indexierung nachverfolgen (High, kein Eingriff)

```bash
python3 tools/gsc-sitemap-submit.py --status
python3 claude-seo/scripts/gsc_inspect.py --batch /tmp/all_urls.txt \
  --site-url sc-domain:kleinkind-welt.de --json
```

Wöchentlich. Ziel: die sieben nicht indexierten URLs wechseln auf „Submitted and indexed".
Wenn nach vier Wochen noch etwas auf „unknown" steht, ist es Autorität und nicht Technik —
dann greift Phase 3.

---

## Phase 2 — Woche 2 bis 3

### 2.1 Eigene Seite für `lauflerngitter` (High, bester Quick Win)

Rankt auf **Position 10,8** mit einer Nebenerwähnung in `spielzeug-6-12-monate`. Eine eigene
Seite sollte deutlich weiter kommen.

Anforderungen: echte Recherche zu Sicherheitsnormen (EN 12227 für Laufgitter), Maße,
Materialien, Altersfreigaben. Keine Produktbehauptungen ohne Quelle — die Evidenzpolitik der
Seite gilt auch hier. Interne Links aus `spielzeug-6-12-monate` und `spielzeug-12-18-monate`,
Aufnahme in `/kaufhilfen` und die Sitemap.

### 2.2 Eigene Seite für `stapelbecher ab welchem alter` (High)

Position 18,3, Erwähnungen in vier Artikeln, keine eigene Seite. Die Anfrage ist explizit eine
Altersfrage — der Seitentyp muss also eine Altersantwort liefern, keine Produktliste.

### 2.3 Positionsverlust bei `spielzeug unter 20 euro` klären (Medium)

Von Position 18,3 (90 Tage) auf 23,6 (28 Tage) gerutscht. Es war die beste kommerzielle
Position der Seite. Prüfen: Was hat sich am Artikel geändert, welche Wettbewerber sind neu in
den Top 20, ist der Inhalt noch aktuell.

### 2.4 Erste Bedingungsseite: „Kinderwagen für kleines Auto" (High)

Keine der sieben Navigator-Personas hat eine eigene Seite. Diese ist am günstigsten zu bauen,
weil der Kofferraum-Artikel die Datenbasis bereits enthält: Faltmaße von 20 Modellen, zehn
Kofferraumprofile und der Befund, dass bei zehn Modellen die größte Faltkante länger ist als
der Ladeboden eines VW T-Cross.

Inhalt: die Einschränkung, der gefilterte Ausschnitt des Katalogs mit Begründung, der
wichtigste Kompromiss je Modell, die offenen Prüfpunkte, Einstieg ins Tool.

### 2.5 Heading-Hierarchie glätten (Low)

34 Seiten springen `h1` → `h4` → `h2`, verursacht durch die `h4` in Methoden- und Quellenbox.
Fix: dort auf ein Element ohne Überschriften-Semantik wechseln, etwa
`<p class="methodenbox-title"><strong>…</strong></p>`, oder als `h2` einordnen. Ein Durchlauf
über alle Artikel, mechanisch.

### 2.6 `llms.txt` aktualisieren (Low)

Stand 23.07., kennt die Datentabellen vom 28.07. nicht. Die Datei ist das Aushängeschild für
LLM-Crawler. Bei jeder inhaltlichen Erweiterung mitziehen.

### 2.7 Fehlende `.html`-Weiterleitungen ergänzen (Low)

`_redirects` hat keine explizite Regel für `kinderwagen.html` und `kaufhilfen.html`. Zwei
Zeilen im etablierten Muster, beseitigt jedes Duplikat-Risiko.

---

## Phase 3 — Monat 2

### 3.1 Autorität aufbauen (Critical für alles andere)

Ohne Backlinks bleibt die Obergrenze bei Position 50 bis 70. Zur Ausgangslage gibt es keine
Messung, weil keine API konfiguriert ist — die Annahme „nahe null" ist plausibel, aber
ungeprüft.

Der realistischste Hebel ist der Kinderwagen-Datensatz. Er enthält Aussagen, die kein
Wettbewerber belegen kann:

- Korrelation +0,90 zwischen Hinterraddurchmesser und aufgeklappter Breite über elf Modelle
- Alle vier Modelle unter 500 Euro enthalten Babywanne und Regenschutz, während drei Modelle
  für je 1299 Euro ohne Regenschutz kommen
- Bei zehn von 20 Modellen ist die größte Faltkante länger als der Ladeboden eines Kleinwagens
- Garantiedauer schwankt um Faktor fünf, von 2 bis 10 Jahren
- Der Rückrufstatus ist bei keinem der 20 Modelle dokumentiert — offen ausgewiesen

Der letzte Punkt ist der stärkste: Ein Vergleich, der offenlegt, was er nicht weiß, ist für
Journalisten und Foren zitierfähig. Konkret ansprechbar sind Elternforen, deutschsprachige
Eltern-Subreddits, regionale Elternportale und Fachredaktionen, die über Kinderwagen
schreiben. Kein Linktausch, kein Kauf — die Daten selbst sind das Argument.

### 3.2 Kannibalisierung im Geschenke- und Alterscluster auflösen (Medium)

Altersstaffel (sechs Artikel) und Geschenke-Serie (fünf Artikel) konkurrieren bei Anfragen wie
„geschenk 3 jahre". Intent-Trennung in Titles, H1 und interner Verlinkung: Alter =
informational („Was braucht ein Kind mit 3 Jahren?"), Geschenk = commercial („Geschenke zum
3. Geburtstag"). Der Alters-Artikel verlinkt auf den Geschenke-Artikel, nicht umgekehrt.

### 3.3 Geschenkekäufer-Persona bedienen (Medium)

Über 130 der 457 Impressionen kommen von Geschenk-Anfragen, oft von Großeltern und Freunden:
kurzfristige Suche, kleines Budget, kein Detailwissen. `/geschenke-kleinkind` ist ein Hub und
liefert diese Antwort nicht direkt. Prüfen, ob die Seite oben in drei Zeilen eine
Kaufentscheidung ermöglicht — Budget, Alter, fertig.

### 3.4 `kinderwagen-arten` nachziehen (Medium)

815 Wörter gegen 1081 bis 1844 bei den übrigen vier, und nur 2 FAQ-Einträge gegen 6. Es ist
der Einstiegsartikel der Kategorie und mit vier internen Eingangslinks der bestvernetzte.

### 3.5 Restliche Bedingungsseiten (Medium)

Nach „kleines Auto" die nächsten aus den Persona-Segmenten, in dieser Reihenfolge:
`low_budget_city_walkup` (leichter Kinderwagen ohne Aufzug), `tight_access_transit` (schmaler
Kinderwagen), `rural_rough_routes` (unebene Wege). Vorher gegen echte Keyword-Daten prüfen —
die Priorisierung beruht auf Datenverfügbarkeit, nicht auf gemessener Nachfrage.

---

## Phase 4 — Laufend

| Turnus | Aufgabe | Werkzeug |
|---|---|---|
| Nach jeder Sitemap-Änderung | Sitemap neu einreichen | `tools/gsc-sitemap-submit.py` |
| Wöchentlich | Indexierungsstatus der offenen URLs | `gsc_inspect.py --batch` |
| Wöchentlich | Positionen der Quick-Win-Anfragen | `gsc_query.py --dimensions query` |
| Monatlich | Impressionsverlauf gegen Vormonat | `gsc_query.py --dimensions date` |
| Bei Inhaltsänderung | `llms.txt` und `lastmod` mitziehen | manuell |
| Bei Änderungen am Navigator | Regressionstests | `npx playwright test` |

**Erfolgsmaß der nächsten acht Wochen sind Impressionen im Kinderwagen-Cluster, nicht
Klicks.** Impressionen zeigen, dass Google die Seiten als Antwort auf etwas versteht. Klicks
folgen erst mit besseren Positionen, und die folgen der Autorität.

---

## Kostenlos nachtragbar

Ein `GOOGLE_API_KEY` ist gratis und schaltet PageSpeed Insights sowie CrUX frei. Damit gäbe es
echte Felddaten zu Core Web Vitals statt der Lab-Werte in diesem Audit — besonders relevant
für den Navigator-CLS, wo Lab und Feld deutlich auseinanderliegen können. Eintragen in
`~/.config/claude-seo/google-api.json` unter `api_key`.

GA4 bleibt bewusst außen vor, weil Plausible im Einsatz ist.
