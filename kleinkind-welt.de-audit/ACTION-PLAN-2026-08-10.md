# Aktionsplan kleinkind-welt.de · 10.08.2026

Abgeleitet aus `FULL-AUDIT-2026-08-10.md`. Score 86 von 100.

**Die Lage in einem Satz:** Am Handwerk ist nichts mehr zu holen — sechs von
sieben Kategorien liegen über 84, die technische Prüfung ist fehlerfrei. Was
fehlt, ist externe Autorität, und ein Dienstleister hat 26 Bilder abgeschaltet.

---

## Phase 1 — diese Woche

### 1.1 Die 26 toten Produktbilder entfernen (Kritisch)

Amazon hat `ws-eu.amazon-adsystem.com` und `ws-na.amazon-adsystem.com` aus dem
DNS genommen. Alle darüber eingebundenen Bilder sind kaputt, auf sechs
kommerziellen Seiten.

Vorgehen wie bereits bei `geschenke-1-jahr` erprobt: `img`-Tag entfernen, die
Produktbox textgeführt lassen, tot gewordene CSS-Regeln aufräumen. Aufwand rund
eine Stunde für alle sechs Seiten.

Kein Ersatz durch KI-Bilder. Ein erzeugtes Bild eines konkreten kaufbaren
Produkts führt in die Irre, auch mit Kennzeichnung.

Betroffen: `outdoor-spielzeug-kleinkind` (6), `spielzeug-2-jahre` (5),
`spielzeug-6-12-monate` (5), `spielzeug-12-18-monate` (4),
`montessori-spielzeug-kleinkind` (3), `geschenke-1-jahr` (3).

### 1.2 Eine Seite für „montessori puzzle 1 jahr" (Hoch)

Position **35,2** — die beste Position im Montessori-Cluster, erzeugt von einem
Nebenabsatz. Der Cluster bringt 73 Impressionen auf 12 Anfragen. Eine eigene
Seite ist der günstigste Sichtbarkeitsgewinn im Bestand.

Anforderungen wie üblich: echte Altersbegründung, Sicherheitsbezug unter drei
Jahren, interne Links aus `montessori-spielzeug-kleinkind` und
`spielzeug-12-18-monate`, Aufnahme in `/kaufhilfen` und die Sitemap.

### 1.3 Sitemap NICHT erneut einreichen (kein Aufwand)

Google hat sie am 29.07. gelesen und seither nicht wieder. Erneutes Einreichen
sendet kein neues Signal. Der Grund für die fehlende Indexierung liegt nicht bei
der Sitemap.

---

## Phase 2 — die eigentliche Aufgabe

### 2.1 Autorität aufbauen (Kritisch für alles andere)

**Das ist ab jetzt die einzige Maßnahme, die Klicks bewegen kann.** Der Beweis
liegt vor: `montessori-spielzeug-kleinkind` hat 1942 Wörter, Title und H1 exakt
auf der Anfrage, 8 FAQ und 9 interne Eingangslinks — und steht auf Position 60,5.
Auf dieser Seite ist On-Page-Arbeit erschöpft.

Der belastbarste Hebel bleibt der Kinderwagen-Datensatz mit Aussagen, die kein
Wettbewerber belegen kann:

- Korrelation +0,90 zwischen Hinterraddurchmesser und aufgeklappter Breite
- Alle vier Modelle unter 500 Euro enthalten Babywanne und Regenschutz, während
  drei Modelle für je 1299 Euro ohne Regenschutz kommen
- Bei zehn von 20 Modellen ist die größte Faltkante länger als der Ladeboden
  eines VW T-Cross
- Garantiedauer schwankt um Faktor fünf
- Bei sechs von 20 Modellen ist die Ersatzteilversorgung offiziell nicht
  dokumentiert
- Der Rückrufstatus ist für keines der 20 Modelle dokumentiert, offen ausgewiesen

Der letzte Punkt bleibt der stärkste: Ein Vergleich, der offenlegt, was er nicht
weiß, ist zitierfähig.

**Bitterer Zusatz:** Genau dieser Datensatz liegt im Cluster, den Google nicht
indexiert. Die Daten müssen also dorthin, wo sie gefunden werden — als Abschnitt
auf einer indexierten Seite, nicht nur im unbekannten Hub. Ein erster Schritt ist
mit den sechs Befunden auf `/kinderwagen` schon getan, nur nützt er nichts,
solange die Seite unbekannt ist. Erwägen: die Kernzahlen zusätzlich auf
`/kaufhilfen` unterbringen, die indexiert ist.

### 2.2 Warum `/kinderwagen` unbekannt bleibt, praktisch angehen (Hoch)

Technisch ist die Seite fehlerfrei. Es bleiben drei Hebel:

1. **Von der Startseite prominenter verlinken.** Aktuell ein Link im Hero-Bereich.
2. **Aus indexierten Artikeln heraus verlinken.** Die fünf Kinderwagen-Artikel
   verlinken auf den Hub, sind aber selbst nicht indexiert — das hilft nicht.
   Nötig sind Links aus `geschenke-zur-geburt`, `spielzeug-0-6-monate` und
   anderen indexierten Seiten. Zwei davon bestehen schon.
3. **Einen externen Link auf den Hub** setzen lassen. Ein einziger genügt oft,
   damit Google eine unbekannte URL entdeckt und priorisiert.

### 2.3 Geschenke-Hub: 193 Impressionen, null Klicks (Mittel)

Die Seite mit der meisten Nachfrage steht auf Position 70,8. Bei dieser Position
sind Snippet-Optimierungen wirkungslos — es gibt keine Impression auf Seite 1,
die man in einen Klick verwandeln könnte. Erst Autorität, dann CTR.

Der einzige sinnvolle Zwischenschritt: prüfen, ob das Großeltern-Modul die
Aufenthaltsdauer und die interne Weiterleitung verbessert, sobald Klicks kommen.
Ohne Klicks nicht messbar.

---

## Phase 3 — später, mit Begründung fürs Später

### 3.1 `low_budget_city_walkup` bedienen (Mittel, aber vertagt)

Abdeckung 1/7, „ohne Aufzug" kommt site-weit nicht vor. Eine Seite dafür wäre
inhaltlich richtig — **aber sie landete im nicht indexierten Cluster.** Erst
Phase 2.2 lösen, dann diese Seite bauen. Sonst entsteht Arbeit ohne Sichtbarkeit.

### 3.2 `kinderwagen-arten` nachziehen (Niedrig)

Mit 895 Wörtern der kürzeste der fünf Kinderwagen-Ratgeber. Gleiche
Einschränkung wie 3.1.

### 3.3 `GOOGLE_API_KEY` eintragen (Niedrig, kostenlos)

Kostet nichts und schaltet PageSpeed sowie CrUX frei. Damit gäbe es Felddaten
statt Labormessungen — besonders für den Navigator-CLS relevant. Eintragen in
`~/.config/claude-seo/google-api.json` unter `api_key`.

---

## Phase 4 — laufend

| Turnus | Aufgabe | Werkzeug |
|---|---|---|
| Wöchentlich | Indexierung der 7 offenen URLs | `gsc_inspect.py --batch` |
| Wöchentlich | Erscheint erstmals eine Kinderwagen-Anfrage? | `gsc_query.py --dimensions query` |
| Monatlich | Impressionen und Positionen gegen Vormonat | `gsc_query.py --dimensions date` |
| Bei Inhaltsänderung | `llms.txt` und `lastmod` mitziehen | manuell |
| Bei neuen Bildern | Einordnung im Register erzwingen | `ki-bildkennzeichnung-gate.mjs` |
| Bei Änderungen am Navigator | Regressionstests | `npx playwright test` |

**Erfolgsmaß der nächsten acht Wochen:** die erste Kinderwagen-Anfrage mit einer
Impression, und der erste Klick auf eine Position unter 20. Impressionen sind
schon gestiegen — sie zu steigern ist nicht mehr das Problem.

---

## Was ausdrücklich NICHT mehr zu tun ist

Das ist die wichtigste Liste in diesem Plan.

- **Keine weitere On-Page-Optimierung an gut optimierten Seiten.** Der
  Montessori-Artikel beweist, dass das ausgereizt ist.
- **Kein erneutes Einreichen der Sitemap.** Signal ist angekommen.
- **Keine Untersuchung des „Positionsverlusts" bei „spielzeug unter 20 euro".**
  Der Voraudit hat Rauschen aus einem kurzen Messfenster als Trend gelesen; die
  Anfrage steht bei 18,9 und damit unverändert.
- **Keine neuen Seiten im Kinderwagen-Cluster**, bis die Indexierung gelöst ist.
- **Keine KI-Bilder als Ersatz für Produktfotos.**
