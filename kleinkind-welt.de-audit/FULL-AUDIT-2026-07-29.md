# SEO-Audit kleinkind-welt.de · 29.07.2026

**SEO Health Score: 82 / 100** (nach Einarbeitung der Fachberichte, siehe Nachtrag)

Geschäftstyp: Content-/Affiliate-Publisher, deutschsprachig, Nische Baby und Kleinkind
(Spielzeug, Geschenke, Kinderwagen). Betrieben von einer Einzelperson. Monetarisierung über
Amazon PartnerNet, Awin-Programme in Beantragung.

Prüfumfang: 43 HTML-Seiten im Repo, davon 37 in der Sitemap. Live-Prüfung gegen
`https://kleinkind-welt.de`. Datenquellen: Search Console API (Property
`sc-domain:kleinkind-welt.de`), Repo-Analyse, Lab-Messungen mit Playwright über drei
Browser-Engines.

**Methodenhinweis:** Der Audit wurde überwiegend inline durchgeführt. Zehn Fach-Subagenten
wurden gestartet; acht brachen vor dem Ablegen ihrer Berichte ab. **Zwei haben geliefert und sind
eingearbeitet:** `findings/sxo.md` und `findings/cluster.md` (beide 29.07.2026). Ihre Befunde sind
im Nachtrag am Ende dieses Dokuments zusammengefasst und haben den Score von 84 auf 82 korrigiert.
Der Visual-Agent hat 42 Screenshots geschrieben. Alle unten genannten Zahlen sind deshalb selbst
gemessen und nachprüfbar, nicht von Subagenten übernommen. Die Dateien in `findings/` datieren
auf den 30.06.2026 und stammen aus einem früheren Audit — sie wurden **nicht** überschrieben.

**Fehlende Datenquellen:** Kein `GOOGLE_API_KEY`, daher keine CrUX-Felddaten und keine
PageSpeed-Insights-Werte. Kein GA4 (der Betreiber nutzt Plausible). Keine Backlink-API
(Moz/Bing nicht konfiguriert, bezahlte Tools ausdrücklich nicht gewünscht). Core Web Vitals
sind deshalb ausschließlich Lab-Werte, und zur Autorität gibt es keine belastbare Messung.

---

## Kategorien

| Kategorie | Score | Gewicht | Beitrag |
|---|---|---|---|
| Technical SEO | 88 | 22 % | 19,4 |
| Content Quality | 72 | 23 % | 16,6 |
| On-Page SEO | 82 | 20 % | 16,4 |
| Schema / Structured Data | 92 | 10 % | 9,2 |
| Performance (CWV) | 72 | 10 % | 7,2 |
| AI Search Readiness | 90 | 10 % | 9,0 |
| Images | 82 | 5 % | 4,1 |
| **Gesamt** | **82** | | |

---

## Ausgangslage in Zahlen

| Kennzahl | Wert |
|---|---|
| Klicks, 90 Tage | **7** |
| Impressionen, 90 Tage | **457** |
| Durchschnittsposition, 90 Tage | 53,1 |
| Klicks, 28 Tage | 4 |
| Impressionen, 28 Tage | 268 |
| Durchschnittsposition, 28 Tage | 65,1 |
| Suchanfragen mit Impressionen | 87 |
| Indexierte URLs | **30 von 37** |

**Monatsverlauf:** Juni 189 Impressionen / 3 Klicks → Juli 268 / 4. Impressionen wachsen um
42 Prozent, Klicks stagnieren. Das ist das exakte Muster einer jungen Domain, die Google
zunehmend ausliefert, aber auf Positionen, die niemand anklickt.

---

## Die fünf wichtigsten Befunde

### 1. Das Kinderwagen-Cluster ist noch nicht indexiert (High, in Behebung)

Sieben URLs sind nicht im Index:

| URL | GSC-Status |
|---|---|
| `/artikel/kinderwagen-arten` | Discovered – currently not indexed |
| `/artikel/kinderwagen-gebraucht-kaufen` | Discovered – currently not indexed |
| `/kinderwagen` | URL is unknown to Google |
| `/artikel/kinderwagen-gesamtpreis` | URL is unknown to Google |
| `/artikel/kinderwagen-kofferraum` | URL is unknown to Google |
| `/artikel/kinderwagen-stadt-oder-land` | URL is unknown to Google |
| `/artikel/spielzeug-rotieren-kleinkind` | URL is unknown to Google |

Die Ursache ist bekannt und behoben: Google hatte die Sitemap nur einmal gelesen
(14.07.2026) und kannte 30 statt 37 URLs. Am 28.07. neu eingereicht, seither kennt Google
alle 37. Zwei URLs sind bereits von „unknown" auf „Discovered" gewechselt.

Der verbleibende Rückstand ist normale Latenz bei geringer Domain-Autorität. **Kein weiterer
technischer Eingriff nötig**, aber wöchentlich nachprüfen. Wenn nach vier Wochen noch URLs
auf „unknown" stehen, ist es ein Autoritätsproblem und kein Sitemap-Problem.

### 2. Der Geschenke-Bereich hat Nachfrage, aber die falsche Position (High)

`/geschenke-kleinkind` ist mit 113 Impressionen die meistgesehene Seite — bei
**Position 71,9 und null Klicks**. Dasselbe Bild über den ganzen Cluster:

| Suchanfrage | Impressionen (28 T.) | Position |
|---|---|---|
| geschenke für kleinkinder | 28 | 70,9 |
| kleinkinder geschenke | 21 | 68,4 |
| geschenkideen für kleinkinder | 20 | 75,5 |
| kleinkinder geschenkideen | 20 | 73,2 |
| geschenk kleinkind | 19 | 68,3 |
| sinnvolle geschenke zur geburt | 11 | 87,5 |

Über 130 der 457 Impressionen entfallen auf Geschenk-Anfragen. Das ist die tatsächliche
Nachfrage-Persona — häufig Großeltern und Freunde, nicht die Eltern. Position 68 bis 88
heißt: Google hält die Seite für thematisch passend, aber nicht für eine der besten
Antworten.

### 3. Zwei Anfragen ranken auf Seite 1 bis 2 ohne eigene Seite (High, Quick Win)

| Position | Suchanfrage | Stand |
|---|---|---|
| **10,8** | lauflerngitter | nur Nebenerwähnung in `spielzeug-6-12-monate` |
| **18,3** | stapelbecher ab welchem alter | Erwähnungen in vier Artikeln |
| 23,6 | spielzeug unter 20 euro | eigene Seite vorhanden, von 18,3 auf 23,6 abgerutscht |

Wenn eine Nebenerwähnung Position 10,8 erreicht, sollte eine eigene, gute Seite deutlich
weiter kommen. Das ist die billigste Traffic-Chance im ganzen Datensatz und liegt im
Spielzeug-Cluster, wo die Seite bereits Relevanz hat.

Dass `spielzeug unter 20 euro` von 18,3 auf 23,6 abgerutscht ist, verdient eine eigene
Prüfung — es war die beste kommerzielle Position der Seite.

### 4. Navigator: CLS 0,455 (High)

| Seite | LCP | CLS | Gewicht | Requests |
|---|---|---|---|---|
| Startseite | 444 ms | 0 | 89 KB | 11 |
| Geschenke-Hub | 320 ms | 0 | **818 KB** | 13 |
| Kofferraum-Artikel | 304 ms | 0 | 33 KB | 9 |
| Motorikspielzeug | 596 ms | 0 | 155 KB | 12 |
| **Navigator** | 920 ms | **0,455** | 34 KB | 19 |

Lab-Werte, Mobil 390 × 844, ungedrosselt — also optimistisch. Trotzdem eindeutig: Alle
Inhaltsseiten haben **CLS 0**, was ausgezeichnet ist. Der Navigator verschiebt dagegen mit
0,455 fast das Doppelte der „schlecht"-Schwelle von 0,25.

Ursache: Die Ladekarte wird nach dem Laden der JSON-Kataloge durch die deutlich höhere
Fragekarte ersetzt. Aktuell verdeckt der `noindex` das Problem, aber es ist genau die Seite,
die zum Hauptprodukt werden soll — vor der Indexierung muss das behoben sein.

### 5. Der Geschenke-Hub lädt 818 KB, obwohl ein WebP bereitliegt (Medium)

Die meistgesehene Seite der Site wiegt 818 KB. Allein `geschenke-3-jahre.jpg` bringt
**423 KB** — und `geschenke-3-jahre.webp` liegt daneben im Repo, wird aber nicht genutzt:

```html
<img src="/images/articles/geschenke-3-jahre.jpg" ... loading="lazy" width="1200" height="800">
```

Kein `<picture>`-Element, also kein WebP-Fallback. 14 Bilddateien liegen über 200 KB, die
größte bei 691 KB. Von 209 `img`-Tags haben nur 69 `loading="lazy"`.

---

## Was ausgezeichnet ist

Diese Punkte sind besser als bei den meisten Seiten dieser Größe und sollten nicht angefasst
werden.

**Bilder-Barrierefreiheit: fehlerfrei.** 209 `img`-Tags, **null ohne `alt`-Attribut, null
ohne `width` und `height`**. Genau das ist der Grund, warum CLS auf allen Inhaltsseiten 0
ist. Drei bewusst leere `alt`-Attribute für dekorative Bilder — auch das ist korrekt.

**Security-Header: vollständig.** Content-Security-Policy mit expliziten Quellen,
HSTS mit `includeSubDomains` und `preload`, `X-Frame-Options: DENY`,
`X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` mit deaktivierter Kamera, Mikrofon, Geolocation und Payment.

**On-Page-Hygiene: keine Fehler.** Title-Längen median 52, maximal 60 Zeichen — keiner zu
lang. Meta-Descriptions median 144, maximal 156. **Null doppelte Titles, null doppelte
Descriptions.** Genau ein H1 pro Seite.

**Strukturierte Daten: dicht und konsistent.** Article, FAQPage, BreadcrumbList, Speakable
und teils ItemList auf allen Artikeln, Organization-Knoten mit `@id` als zentrale Referenz.
FAQPage-Schema und sichtbare Fragen stimmen auf allen 29 Artikeln überein — am 28.07. wurden
drei Abweichungen behoben.

**AI-Search-Vorbereitung: überdurchschnittlich.** `llms.txt` mit Lizenzangabe, Maintainer
und thematischer Gliederung. robots.txt erlaubt OAI-SearchBot, GPTBot, PerplexityBot,
ClaudeBot, anthropic-ai, Applebot-Extended und cohere-ai explizit. Speakable-Markup zeigt auf
die Kurzantwort-Boxen. Das Evidenzregister ist als JSON öffentlich verlinkt.

**Interne Verlinkung: keine Fehler.** 43 Dateien geprüft, **null defekte interne Links**,
Redirect-Auflösung eingerechnet.

**Ladezeit der Inhaltsseiten.** LCP zwischen 304 und 596 ms, deutlich unter der
2500-ms-Schwelle. Der Kofferraum-Artikel liefert 1844 Wörter und zwei Datentabellen in 33 KB.

**Die Evidenzpolitik als Substanz.** Produktfakten tragen Quelle und Prüfdatum, Schätzungen
sind untersagt, Datenlücken werden ausgewiesen statt gefüllt. Daraus entstehen Aussagen, die
kein Wettbewerber hat — etwa die belegte Korrelation von +0,90 zwischen Hinterraddurchmesser
und Kinderwagenbreite, oder der Befund, dass alle Modelle unter 500 Euro Babywanne und
Regenschutz enthalten, während drei Modelle für 1299 Euro ohne Regenschutz kommen.

---

## Weitere Befunde

### Content

**Kannibalisierungs-Risiko (Medium).** Zwei Serien laufen parallel: die Altersstaffel
(`spielzeug-0-6-monate` bis `spielzeug-3-jahre`, sechs Artikel) und die Geschenke-Serie
(`geschenke-1-jahr`, `-2-jahre`, `-3-jahre`, `-zur-geburt`, `weihnachtsgeschenke`). Bei
Anfragen wie „geschenk 3 jahre" konkurrieren `geschenke-3-jahre` und `spielzeug-3-jahre`
gegeneinander. Die GSC zeigt für beide Muster Impressionen ohne Klicks. Eine
Intent-Trennung — Alter = informational, Geschenk = commercial — müsste in Titles, H1 und
interner Verlinkung deutlicher werden.

**`kinderwagen-arten` bleibt der schwächste Artikel (Medium).** 815 Wörter gegen 1081 bis
1844 bei den übrigen vier, und nur **2 FAQ-Einträge** gegen 6 bei den anderen. Es ist
gleichzeitig der Einstiegsartikel der Kategorie und mit vier internen Eingangslinks der
bestvernetzte.

**`/artikel/spielzeug-2-jahre` hat 2353 Wörter und null Impressionen (Info).** Länge allein
löst das Wettbewerbsproblem also nicht — ein wichtiges Gegenbeispiel für die Annahme, mehr
Text bringe Rankings.

### On-Page

**Heading-Hierarchie springt auf 34 Seiten (Low).** Muster: `h1` → `h4` → `h2`. Ursache ist
die Methodenbox („Wofür dieser Ratgeber gedacht ist") mit einem `h4` vor der ersten `h2`,
ebenso die Quellenbox. Für Screenreader und maschinelles Verständnis der Dokumentstruktur
ist das eine Unsauberkeit. Fix: In der Methoden- und Quellenbox `h4` durch ein Element ohne
Überschriften-Semantik ersetzen oder als `h2` einordnen.

**`google390434218d78aff9.html` ohne Title, Description und H1 (Info).** Die
Search-Console-Verifizierungsdatei. Nicht in der Sitemap, für Google bedeutungslos. Wenn
Ordnung gewünscht ist, ein `noindex` setzen — sonst ignorieren.

### Technisch

**Fehlende explizite `.html`-Weiterleitungen (Low, unbestätigt).** `_redirects` enthält
explizite `301!`-Regeln für alle Artikel und die meisten Root-Seiten, aber **nicht** für
`kinderwagen.html` und `kaufhilfen.html`. Netlify liefert Clean-URLs automatisch aus, und
`/kaufhilfen` antwortet live mit 200. Ob `/kaufhilfen.html` parallel erreichbar ist und damit
ein Duplikat bildet, wurde nicht geprüft — nachtragen kostet zwei Zeilen und beseitigt das
Risiko.

**`/artikel/spielzeug-3-jahre.html` erscheint separat in der GSC (Info).** Eine Impression auf
Position 42 für die `.html`-Variante neben der Clean-URL. Die 301 löst das mit der Zeit; kein
Handlungsbedarf.

### AI Search

**`llms.txt` ist vom 23.07. und damit veraltet (Low).** Sie beschreibt die
Kinderwagen-Artikel noch in ihrem alten Zustand und kennt die am 28.07. ergänzten
Datentabellen nicht. Sie führt außerdem den Navigator als „nicht indexierte Beta" — korrekt,
aber beim Launch anzupassen. Die Datei ist ein Aushängeschild für LLM-Crawler und sollte mit
dem Inhalt Schritt halten.

### Persona-Abdeckung

Der Navigator definiert sieben Persona-Segmente in `persona-segments.v0.2.json`. **Keines hat
eine eigene Landingpage:**

| Segment | Einschränkung | Eigene Seite |
|---|---|---|
| compact_car_fixed_budget | kleiner Kofferraum, 800 € hart | nein |
| low_budget_city_walkup | Treppen und ÖPNV, 600 € hart | nein |
| tight_access_transit | enger Aufzug | nein |
| rural_rough_routes | Feld- und Waldwege | nein |
| mid_budget_function_first | Stauraum, lange Nutzung | nein |
| service_weather_long_use | Ersatzteile, Wetterschutz | nein |
| premium_mobile_family | viel unterwegs | nein |

Die fünf Kinderwagen-Artikel deckt Themen ab (Arten, Kofferraum, Preis, Gelände, Gebraucht),
nicht Bedingungen. Eine Seite „Kinderwagen für kleines Auto" existiert nicht, obwohl der
Kofferraum-Artikel die Datenbasis dafür bereits enthält.

**Die eigentliche Nachfrage-Persona wird ebenfalls nicht gezielt bedient.** Die GSC zeigt
Geschenkekäufer, häufig Großeltern: kurzfristige Suche, kleines Budget, kein Detailwissen.
`/geschenke-kleinkind` ist ein Hub, keine auf diese Persona zugeschnittene Antwort.

---

## Prognose und Erwartungsmanagement

Die Domain ist zwei Monate alt. Impressionen wachsen um 42 Prozent im Monat, was ein
gesundes Signal ist. Klicks entstehen erst, wenn Positionen unter etwa 20 fallen.

Bei den Head-Terms des Geschenke-Clusters („geschenke für kleinkinder") konkurriert die Seite
mit Amazon, Otto, baby-walz und Eltern.de. Dort ist ein Sprung von Position 70 auf unter 20
ohne Backlink-Aufbau unrealistisch.

Realistisch sind die Long-Tail-Anfragen, bei denen die Seite schon nahe Seite 1 steht, und das
Kinderwagen-Cluster, sobald es indexiert ist — dort gibt es Daten, die sonst niemand hat.

**Ohne Linkaufbau bleibt die Obergrenze niedrig.** Zur Backlink-Ausgangslage gibt es keine
belastbare Messung, weil keine API konfiguriert ist. Für eine Domain dieses Alters ist die
Annahme „nahe null" plausibel, aber sie ist nicht gemessen und sollte nicht als Tatsache
behandelt werden.

---

# Nachtrag: Befunde der Fachberichte (eingearbeitet 29.07.2026)

Zwei Subagenten haben eigenständige Berichte abgelegt. Ihre Befunde ergänzen und **korrigieren**
Teile des Hauptberichts. Alle unten genannten Zahlen habe ich unabhängig nachgemessen.

Quellen: `findings/sxo.md` (SXO Gap Score 52/100), `findings/cluster.md` (Cluster-Architektur
58/100).

## Korrektur 1: Meine Kannibalisierungs-Einschätzung war zu grob

Im Hauptbericht steht „Kannibalisierungs-Risiko (Medium)" für die Alters- und Geschenke-Serie.
**Beide Fachberichte kommen unabhängig zum Gegenteil:** Auf Title-, H1- und Meta-Ebene ist die
Trennung sauber. Zwei konsequent verschiedene Muster — Alter: „Spielzeug für X — Die besten
Empfehlungen", Anlass: „Geschenke zum X. Geburtstag — Y Ideen". Jeder Spoke besitzt in zwei
GSC-Snapshots seine eigene Long-Tail-Anfrage.

**Das echte Risiko liegt eine Ebene tiefer:** LEGO DUPLO ist Top-Pick in `spielzeug-2-jahre`
**und** `geschenke-2-jahre`, ebenso bei den 3-Jahre-Pendants. Und die DUPLO-Eignungsfrage
erscheint auf **sechs Seiten mit je eigenem FAQPage-Schema-Eintrag**:

| Seite | FAQ-Frage |
|---|---|
| spielzeug-18-24-monate | „Ist DUPLO schon für 18 Monate geeignet?" |
| spielzeug-2-jahre | „Ab wann ist LEGO DUPLO geeignet?" |
| geschenke-2-jahre | „Ist LEGO DUPLO für 2-Jährige geeignet?" |
| spielzeug-3-jahre | „Ist LEGO DUPLO noch das Richtige mit 3 Jahren?" |
| geschenke-3-jahre | „Warum ist DUPLO so gut für 3-Jährige?" |
| duplo-vergleich | der eigentliche kanonische Artikel |

Sechs konkurrierende Rich-Result-Kandidaten für eng verwandte Fragen: Google entscheidet selbst,
welche Seite die Frage „besitzt". **Fix:** `duplo-vergleich.html` als kanonischen Owner
festlegen, die anderen fünf behalten die kontextuelle Erwähnung, aber ohne eigenes
FAQPage-Item — stattdessen ein Inline-Link.

## Befund A: Die Hub-Seiten sind zu dünn — und genau sie ranken am schlechtesten (High)

Diesen Befund habe ich im Hauptbericht komplett übersehen, weil ich nur Artikel gemessen habe.
Eigene Nachmessung:

| Hub | Wörter | Zielanfrage | Position |
|---|---|---|---|
| `kinderwagen.html` | **301** | — | nicht indexiert |
| `spielzeug-nach-alter.html` | **415** | kleinkindspielzeug | 74,8 |
| `geschenke-kleinkind.html` | **422** | geschenke für kleinkinder | 70,9 (113 Impr.) |
| `kaufhilfen.html` | 1029 | — | 2,0 (navigational) |

Der Zusammenhang ist auffällig: Die drei Themen-Hubs tragen die breiten Kopfbegriffe, haben aber
301 bis 422 Wörter — während der fokussierte Spoke `spielzeug-unter-20-euro` mit rund 2000
Wörtern auf Position 18 bis 24 liegt. Die Hubs sind mit `CollectionPage` korrekt ausgezeichnet,
also kein Etikettenschwindel — aber strukturell nicht in der Lage, die Begriffe zu tragen, die
sie besetzen sollen.

**Einschränkung:** Bei einer zwei Monate alten Domain ist geringe Autorität wahrscheinlich der
dominante Faktor. Die Hub-Tiefe limitiert aber die Fähigkeit, überhaupt konkurrenzfähig zu
werden, sobald die Domain reift.

**Fix (nicht zu 4000-Wörter-Textwüsten aufblasen):** 800 bis 1200 Wörter echten Fließtext
ergänzen — ein Entscheidungsbaum oder FAQ-Block direkt auf dem Hub, analog zur bereits
vorhandenen Alters-Matrix in `kaufhilfen.html`, der die Kopfbegriffe natürlich aufgreift statt
sie nur über Card-Titel zu transportieren.

## Befund B: Eine komplette Produktkategorie-Ebene fehlt (High)

**Es gibt genau eine echte Produktkategorie-Seite auf der ganzen Domain:**
`duplo-vergleich.html`. Alle anderen 28 Artikel sind nach **Alter** oder **Anlass** organisiert,
nie nach **Produkttyp**. Das erklärt drei GSC-Auffälligkeiten auf einmal:

| Anfrage | Position | Ursache |
|---|---|---|
| lauflerngitter | 10,8 | genau **eine** Erwähnung sitzenweit, keine eigene Seite |
| stapelbecher ab welchem alter | 18,3 | in **über zehn** Artikeln erwähnt, keine Seite besitzt den Begriff |
| motorikwürfel test | 58,8 | umgekehrter Fehler: ausführlich behandelt, aber **innerhalb** von „Motorikspielzeug: 8 Empfehlungen", das vier Produkttypen bündelt |

Stapelbecher und Motorikwürfel sind dieselbe Münze von zwei Seiten: einmal zu weit verteilt,
einmal zu stark gebündelt. Bezeichnend ist der Gegenbeweis: `duplo-vergleich.html` als einzige
echte Produkttyp-Seite hat 13 Eingangslinks und ist gut eingebunden.

**Fix:** Drittes Cluster „Produktkategorien" unter dem Spielzeug-Hub, initial mit `stapelbecher`,
`lauflerngitter-vs-lauflernwagen` und `motorikwuerfel` (extrahiert aus dem Sammelartikel, der
als Vergleichs-Hub bestehen bleibt).

## Befund C: Sicherheitsrelevante Begriffsverwechslung bei „Lauflerngitter" (High)

Der wichtigste Einzelbefund der Fachberichte, von mir verifiziert. `spielzeug-6-12-monate.html`
enthält die **einzige** Erwähnung des Begriffs, und zwar so:

> **Baby-Walkers (Lauflerngitter auf Rädern):** In manchen Ländern bereits verboten. Verlangsamt
> das natürliche Laufen lernen und erhöht Unfallrisiko.

Der Bericht stellt fest, dass „Lauflerngitter" in der realen Marktverwendung ein **stationäres
Laufgitter** bezeichnet — ein anderes, unbedenkliches Produkt — nicht die Lauflernhilfe auf
Rädern, vor der Kinderärzte warnen. Der SERP-Check ergab ausschließlich Gebrauchtmarkt-Anzeigen
für stationäre Laufgitter.

Das ist gleich dreifach relevant:

1. Es ist die **beste Position der ganzen Domain** (10,8).
2. Wer ein Laufgitter sucht, landet auf einer Sicherheitswarnung über ein anderes Produkt.
3. Eine neue Seite auf dieser Begriffsverwechslung aufzubauen würde falsche Sicherheitshinweise
   unter einem stark gesuchten Begriff verbreiten.

**Fix, und zwar vor jeder neuen Seite:** Die Begriffe im bestehenden Artikel trennen —
Laufgitter (stationär), Lauflernhilfe oder Babywalker (auf Rädern, kritisch), Lauflernwagen
(Schiebewagen). Danach die eigene Seite bauen.

Einschränkung zur Belastbarkeit: Die Aussage zur Marktverwendung stammt aus dem SERP-Check des
Fachberichts, nicht aus einer eigenen Quellenprüfung. Die Begriffsverwendung im Artikel ist
jedenfalls uneindeutig und sollte unabhängig davon geschärft werden.

## Befund D: Interne Verlinkung schwächer als im Hauptbericht angenommen (Medium)

Der Hauptbericht nennt „null defekte interne Links" — das stimmt, sagt aber nichts über die
Verteilung. Programmatische Zählung, nur Links innerhalb von `<main>`, eigene Nachmessung:

| Seite | Eingangslinks | Quellen |
|---|---|---|
| `spielzeug-rotieren-kleinkind` | **1** | nur Startseite |
| `weihnachtsgeschenke-kleinkind` | 2 | Hub, Kaufhilfen |
| `kinderwagen-gebraucht-kaufen` | 2 | Hub, Kaufhilfen — **null Sibling-Links** |
| `kinderwagen-stadt-oder-land` | 2 | Hub, Kaufhilfen — **null Sibling-Links** |

`spielzeug-rotieren-kleinkind` ist ein Near-Orphan — und **fehlt in der Ratgeber-Übersicht auf
`/kaufhilfen`**, die ausdrücklich „Sämtliche Artikel auf Kleinkind-Welt.de" verspricht. Eigene
Prüfung: null Vorkommen des Slugs in `kaufhilfen.html`. Die Liste führt 28 statt 29 Artikel.

`weihnachtsgeschenke-kleinkind` ist die Saisonseite vor dem Q4-Fenster und bekommt von den drei
Geburtstags-Geschenkartikeln keinen Link, obwohl sie deren Produkte und FAQ-Struktur spiegelt.

**Fix:** Reines Linksetzen, kein neuer Content. Die fünf Kinderwagen-Spokes in zwei benannte
Sub-Cluster gruppieren („Kaufentscheidung Grundlagen" und „Alltagstauglichkeit") und gegenseitig
verlinken. Das behebt auch die Isolation, die sich sonst bei den geplanten sieben
Bedingungsseiten verzehnfacht.

## Befund E: Die Geschenkekäufer-Persona hat einen bedienten Wettbewerbsmarkt (High)

Im Hauptbericht steht, die Persona werde „nicht gezielt bedient". Der Fachbericht quantifiziert
das: „Großeltern" erscheint über alle fünf Geschenke-Artikel hinweg **genau dreimal**, immer als
Budget-Nebensatz („Großeltern können sich an einem größeren Geschenk zusammentun") — nie als
Adressierung der eigentlichen Hürde: *Ich sehe das Kind nicht täglich, weiß nicht was es schon
hat, und will nichts Falsches schenken.*

Der SERP-Check zeigt, dass Wettbewerber dafür eigene Artikel führen („Geschenke zum 1. Geburtstag
von Oma und Opa", „Geschenke zur Geburt von Oma und Opa"). Es ist also eine bediente Nische, in
der die Seite nichts hat.

**Fix mit dem besten Aufwand-Ertrag-Verhältnis im ganzen Audit:** Ein Modul „Kennst du das Kind
nicht so gut? So gehst du sicher" oben auf `/geschenke-kleinkind` und in den fünf
Geschenke-Artikeln — vier Fragen (Was hat das Kind schon? Wie viel Platz? Altersgerecht?
Rücksprache mit den Eltern?) plus zwei bis drei sichere Standardempfehlungen je Altersband. Es
schlägt auf die Seite auf, die schon heute die meisten Impressionen erzeugt.

## Befund F: `/geschenke-kleinkind` ist ein reines Linkverzeichnis (Medium)

Der SERP für „geschenke für kleinkinder" besteht laut Fachbericht fast ausschließlich aus
kommerziellen Geschenkefindern, die konkrete Produkte **direkt auf der Seite** zeigen — Smyths
Toys, XXXLutz, BabyOne, ToyAcademy. `/geschenke-kleinkind` zeigt dagegen sechs Karten, die auf
Unterseiten verlinken, und keine einzige konkrete Empfehlung auf der Hub-Seite selbst.

**Fix:** Zwei bis drei konkrete Top-Empfehlungen mit Preis, Alter und Link je Anlass-Karte direkt
auf dem Hub. Das löst gleichzeitig Befund A, weil es echten eigenen Inhalt schafft statt reiner
Navigation.

## Ergänzung zur Persona-Bewertung

Der SXO-Bericht bewertet die Personas einzeln. Zwei Werte sind bemerkenswert:

- **`low_budget_city_walkup`: 0 von 100.** Site-weite Suche nach „ohne Aufzug" und „kleine
  Wohnung" ergibt **null Treffer**. Kein Inhalt existiert unter irgendeinem passenden Begriff.
- **Die Dimension „Action" ist site-weit die schwächste** (0 bis 12 von 25), immer dann, wenn der
  natürliche nächste Schritt der Navigator ist — weil dieser CTA auf eine Seite führt, die Google
  nicht als Ergebnis zeigen kann.

Wichtige Einschränkung, die der Bericht selbst nennt: Die sieben Segmente sind in
`persona-segments.v0.2.json` durch das Produktteam ausdrücklich als
**„Hypothesen-Archetypen, nicht validierte Personas"** gekennzeichnet. Der Audit bewertet die
Abdeckung gegen sie wie vorgegeben, nicht ihre Gültigkeit.

## Auswirkung auf den Score

| Kategorie | vorher | nachher | Grund |
|---|---|---|---|
| Content Quality | 78 | **72** | Hub-Tiefe (301–422 Wörter), fehlende Produktkategorie-Ebene, Near-Orphan, Begriffsverwechslung |
| On-Page SEO | 85 | **82** | Hubs tragen Kopfbegriffe ohne Substanz, sechsfach dupliziertes FAQ-Item |
| **Gesamt** | **84** | **82** | |

Die Korrektur ist inhaltlich eine Verbesserung des Audits, keine Verschlechterung der Seite: Es
sind Befunde, die vorher unentdeckt waren.
