# Content-Architektur / Themen-Cluster-Audit — kleinkind-welt.de

**Methodik-Hinweis:** Diese Analyse verzichtet bewusst auf SERP-Overlap-Abfragen per WebSearch
(auf Anweisung des Auftraggebers, da die verfügbare Suche auf US-Ergebnisse beschränkt ist und
für deutsche Anfragen irreführende Daten liefern würde). Stattdessen basiert die Bewertung auf:
(1) den bereitgestellten echten GSC-Positionsdaten, (2) einer vollständigen Crawl-Analyse aller
29 Artikel + 4 Hub-Seiten im Repo (Title/H1/Meta, Wortzahl ohne HTML-Markup, Produkt-Picks, FAQ-
Blöcke) und (3) einem programmatischen Abgleich aller internen `href`-Links gegen alle Artikel-
Slugs, um reale Inbound-Link-Zahlen zu ermitteln (nicht nur stichprobenartige Sichtprüfung).

## Score: 58 / 100 (Cluster-Architektur)

Eine frühere Analyse (`findings/clustering.md`, oberflächlicher Pass) kam auf 68/100. Der
vorliegende, tiefere Crawl-Pass (echte Wortzahlen nach Tag-Stripping, echte Inbound-Link-Zählung
statt Stichprobe) deckt zusätzliche strukturelle Lücken auf, die den Score nach unten korrigieren:
dünne Hub-Seiten, ein fehlendes komplettes Produktkategorie-Layer, ein Near-Orphan-Artikel und ein
strukturell schwach vernetzter Kinderwagen-Cluster.

## Was funktioniert

- Zwei klar erkennbare Cluster (Spielzeug/Geschenke, Kinderwagen) mit dedizierten Hub-Seiten,
  `ItemList`/`BreadcrumbList`-Schema und sinnvoller Vor-/Zurück-Verlinkung im Altersstaffel-Set
  (`spielzeug-12-18-monate.html` → `spielzeug-18-24-monate.html` usw.).
- `kaufhilfen.html` fungiert als sitenweites Sicherheitsnetz: Es verlinkt 27 von 29 Artikeln plus
  alle 4 Hubs unter einer Überschrift „Alle Ratgeber im Überblick" (Zeile 397+) — das verhindert
  echte Orphan-Pages fast vollständig.
- Die situativen Spielzeug-Artikel (Outdoor, Balkon, Reise, Bad) verlinken bereits gut
  untereinander und in den Sommer-Spielzeug-Hub — das am saubersten gebaute Sub-Cluster der Seite.
- Alters- und Geschenke-Cluster sind auf Title/H1/Meta-Ebene sauber getrennt (siehe
  Kannibalisierungs-Check unten) — keine Meta-Ebene-Duplikate.
- Der Kinderwagen-Cluster hat ein legitimes „Datenartikel als Linkmagnet"-Konzept
  (`docs/navigator-produktstrategie.md:87-97`): `kinderwagen-kofferraum.html` wurde bereits von
  446 auf ~1900 Wörter mit zwei proprietären Datentabellen ausgebaut — die richtige Strategie für
  eine zwei Monate alte Domain ohne Backlink-Autorität.

---

## Findings

### F1 — Hub-Seiten sind strukturell dünne Kategorieseiten, keine Content-Pillars
**Severity:** High

**Evidenz:** Reale Wortzahl nach HTML-Tag-Stripping (Skripte/Styles entfernt):

| Seite | Wörter | Hub-Spoke-Vorgabe (Pillar) |
|---|---|---|
| `spielzeug-nach-alter.html` | 478 | 2.500–4.000 |
| `geschenke-kleinkind.html` | 482 | 2.500–4.000 |
| `kinderwagen.html` | 353 | 2.500–4.000 |
| `kaufhilfen.html` | 1.081 | (kein klassischer Pillar, Tool-Hub) |

Alle drei Themen-Hubs liegen bei 9–19 % der methodisch vorgesehenen Pillar-Tiefe. Sie sind mit
`CollectionPage`-Schema korrekt als Kategorieseiten ausgezeichnet (kein Etikettenschwindel), aber
sie können dadurch nicht selbst für die breiten Kopfbegriffe ranken, die sie eigentlich besetzen
sollen. Das deckt sich mit den GSC-Daten: Genau die Begriffe, die diese Hub-Seiten targeten sollen,
liegen am schlechtesten — „kleinkindspielzeug" Pos. 72,3, „geschenke für kleinkinder" Pos. 71,2,
„kleinkinder geschenke" Pos. 68,5 — während fokussierte Spokes wie `spielzeug-unter-20-euro.html`
(2.001 Wörter, eigene FAQ, eigenes H1) auf Pos. 18,3 liegen.

**Einschränkung:** Die Domain ist erst zwei Monate alt; für breite Kopfbegriffe ist geringe
Domain-Autorität wahrscheinlich der dominante Faktor, nicht allein die Hub-Tiefe. Dennoch limitiert
die aktuelle Tiefe strukturell die Fähigkeit der Hubs, überhaupt konkurrenzfähig zu werden, sobald
die Domain reift.

**Empfehlung:** Hubs nicht zu 4.000-Wörter-Textwüsten aufblasen (das würde die klare
Card-Grid-Navigation zerstören), sondern gezielt 800–1.200 Wörter echten Fließtext ergänzen: ein
einleitender Entscheidungsbaum/FAQ-Block direkt auf der Hub-Seite (analog zur bereits vorhandenen
Alters-Matrix in `kaufhilfen.html`), der die breiten Kopfbegriffe („Kleinkindspielzeug",
„Geschenke für Kleinkinder") in H2/H1-nahem Fließtext natürlich aufgreift, statt sie nur implizit
über die Card-Titel zu transportieren.

---

### F2 — Komplette Produktkategorie-Ebene fehlt: erklärt beide Quick-Win-Keywords
**Severity:** High

**Evidenz:** `lauflerngitter` (Pos. 10,8, keine eigene Seite) und `stapelbecher ab welchem alter`
(Pos. 18,3, keine eigene Seite) sind die zwei stärksten Nicht-Zufallssignale im gesamten
GSC-Datensatz — die Domain rankt sonst überall auf Pos. 50–90, hier aber auf Seite 1–2, **ohne**
dass eine dedizierte Seite existiert. Das ist kein Zufall, sondern ein Strukturmuster:

- **Lauflerngitter:** kommt sitzweit genau **einmal** vor — `artikel/spielzeug-6-12-monate.html:489`
  — und zwar als Negativ-Empfehlung ("Baby-Walkers (Lauflerngitter auf Rädern): In manchen Ländern
  bereits verboten … Besser: ein Lauflernwagen"). Die Seite rankt trotzdem auf Pos. 10,8, weil
  offenbar thematische Nähe/Rassenzugehörigkeit ausreicht — mit einer dedizierten Seite
  ("Lauflerngitter vs. Lauflernwagen: Was ist sicherer?") ließe sich das potenziell in Top 5–10
  festigen.
- **Stapelbecher:** wird in **mindestens 10 Artikeln** erwähnt (`geschenke-1-jahr`,
  `montessori-spielzeug-kleinkind`, `reisespielzeug-kleinkind`, `spielzeug-0-6-monate`,
  `spielzeug-12-18-monate`, `spielzeug-unter-20-euro`, `spielzeug-6-12-monate`,
  `weihnachtsgeschenke-kleinkind`, `was-wir-nicht-kaufen`, `kaufhilfen.html`,
  `spielzeug-nach-alter.html`, `geschenke-kleinkind.html`) — aber **keine einzige Seite** heißt
  „Stapelbecher" oder hat es als primäres H1/Title-Keyword. Die Relevanz ist über zehn+ Seiten
  verteilt, statt auf einer kanonischen Seite gebündelt zu werden — genau die
  Selbstkannibalisierung, vor der die Cluster-Methodik warnt ("nie über zehn+ Seiten verteilen,
  wenn eine Seite den Kopfbegriff besitzen sollte").
- **Umgekehrter Fehler bei „motorikwürfel test"** (Pos. 58,8, schwächster Wert im Datensatz trotz
  vorhandenem Content): Der Motorikwürfel wird ausführlich behandelt, aber **innerhalb** von
  `artikel/motorikspielzeug-test.html`, das im Title "Motorikspielzeug: 8 Empfehlungen" heißt und
  vier verschiedene Produktarten bündelt (Motorikbretter, Kugelbahnen, Pikler-Dreiecke,
  Motorikwürfel). Die Suchintention „motorikwürfel test" bekommt kein eigenes Title/H1 — das ist
  das Gegenteil des Stapelbecher-Problems: hier ist die Relevanz zu stark auf eine
  Sammel-Seite konsolidiert statt fokussiert.

**Das eigentliche Muster:** Es existiert bislang genau **eine** echte Produktkategorie-Seite auf
der ganzen Domain (`duplo-vergleich.html`). Alle anderen 28 Artikel sind nach **Alter** oder
**Anlass** organisiert, nie nach **Produkttyp**. Genau diese fehlende Ebene erklärt, warum ein
Quick-Win-Begriff (Stapelbecher) trotz Textmasse nur Pos. 18 erreicht und ein anderer
(Motorikwürfel) trotz vorhandenem Text nur Pos. 59, während der einzige echte Produkttyp-Artikel
(DUPLO-Vergleich) gut ins Cluster eingebunden ist (13 Inbound-Links, siehe F7).

**Empfehlung:** Neues drittes Cluster unterhalb des Spielzeug-Hubs: **„Produktkategorien"**, initial
mit 3–4 Spokes: `stapelbecher` (kanonisiert die Anker `#stapelbecher` aus
`spielzeug-unter-20-euro.html` und `spielzeug-12-18-monate.html` zu einer eigenen Seite),
`lauflerngitter-vs-lauflernwagen` (greift direkt den Pos.-10,8-Erfolg auf, bevor ein Wettbewerber
es tut), `motorikwuerfel` (extrahiert den Abschnitt aus `motorikspielzeug-test.html:512-518` in
eine eigene fokussierte Review-Seite; `motorikspielzeug-test.html` bleibt als Vergleichs-Hub
für die Produktgruppe bestehen und verlinkt auf die neue Einzelseite). Jede neue Seite muss
mandatory auf den Spielzeug-Hub und auf die passenden Alters-Spokes zurückverlinken (siehe
Verlinkungsmatrix unten), sonst wiederholt sich das Fragmentierungsproblem nur eine Ebene tiefer.

---

### F3 — Kein Hub für die „Entwicklung & Förderung" / „Ratgeber & Vergleiche"-Gruppen
**Severity:** Medium-High (bestätigt und quantifiziert Finding 1 aus `findings/clustering.md`)

**Evidenz:** `kaufhilfen.html` selbst gruppiert bereits implizit sieben bzw. vier Artikel unter den
Zwischenüberschriften „Entwicklung & Förderung" (Motorikspielzeug, Sprache fördern,
Montessori-Spielzeug — plus Outdoor/Balkon/Reise/Bad, die aber eher „Situatives Spielen" sind) und
„Ratgeber & Vergleiche" (Holz vs. Plastik, Nachhaltige Siegel, DUPLO-Vergleich, Was wir nicht
kaufen) — siehe `kaufhilfen.html:420-436`. Diese Taxonomie existiert also bereits in der Seiten-
Kopie, wurde aber nie zu einer echten Hub-Seite mit eigenem `ItemList`-Schema, Breadcrumb-Parent
und mandatory Rückverlinkung ausgebaut. Die betroffenen Artikel hängen strukturell in der Luft und
beziehen ihre Linkkraft nur aus Zufallserwähnungen in Alters-/Geschenke-Artikeln.

**Empfehlung:** Zwei neue Hubs bauen, exakt entlang der bereits in `kaufhilfen.html` verwendeten
Taxonomie (keine neue Nomenklatur erfinden):
- `/entwicklung-spielzeug/`: Motorikspielzeug-Test, Sprache fördern, Montessori-Spielzeug (3 Spokes)
- `/sicheres-spielzeug/`: Holz vs. Plastik, Nachhaltige Siegel, DUPLO-Vergleich, Was wir nicht
  kaufen (4 Spokes)

Beide Hubs bekommen `ItemList`-Schema, werden in die Hauptnavigation/Footer aufgenommen und in
`kaufhilfen.html` sowie `spielzeug-nach-alter.html` kontextuell verlinkt.

---

### F4 — Kinderwagen-Cluster: schwaches Spoke-zu-Spoke-Geflecht
**Severity:** Medium

**Evidenz:** Programmatischer Inbound-Link-Crawl über alle HTML-Dateien zeigt für 2 von 5
Kinderwagen-Artikeln nur den Hub- und den Kaufhilfen-Link, **keine einzige kontextuelle
Nennung** durch ein Geschwister-Artikel:

| Artikel | Reale Inbound-Links (ohne Selbstlink) | Quellen |
|---|---|---|
| `kinderwagen-arten.html` | 6 | Hub, Kaufhilfen, Navigator, `geschenke-zur-geburt`, `spielzeug-0-6-monate`, Newsletter |
| `kinderwagen-gesamtpreis.html` | 6 | Hub, Kaufhilfen, Navigator, `kinderwagen-arten`, `geschenke-zur-geburt`, `spielzeug-0-6-monate` |
| `kinderwagen-kofferraum.html` | 6 | Hub, Kaufhilfen, Navigator, `kinderwagen-arten`, `reisespielzeug-kleinkind`, Newsletter |
| **`kinderwagen-gebraucht-kaufen.html`** | **2** | **nur** Hub + Kaufhilfen |
| **`kinderwagen-stadt-oder-land.html`** | **2** | **nur** Hub + Kaufhilfen |

Die Hub-Spoke-Mindestvorgabe („jeder Spoke braucht ≥ 3 Inbound-Links, 2–3 Sibling-Links pro
Cluster") wird von genau diesen zwei Artikeln verfehlt. Beide sind laut
`docs/navigator-produktstrategie.md:95-97` ohnehin als „nachrangig" für den geplanten Content-
Ausbau eingestuft ("hier gibt es keine proprietären Daten") — das erklärt die schwache Priorisierung,
löst aber das strukturelle Verlinkungsproblem nicht.

Zusätzlich: `kinderwagen-arten.html` (868 Wörter), `kinderwagen-gesamtpreis.html` (1.132 Wörter)
und `kinderwagen-stadt-oder-land.html` (1.161 Wörter) liegen unter der Spoke-Mindestvorgabe von
1.200 Wörtern — konsistent mit dem in `navigator-produktstrategie.md` dokumentierten,
bereits laufenden Ausbauplan (kofferraum wurde zuerst von ca. 450 auf ~1.900 Wörter ausgebaut).

**Empfehlung:** Vor jedem neuen Content-Ausbau zunächst die bestehenden 5 Spokes zu zwei
benannten Sub-Clustern gruppieren und gegenseitig verlinken (siehe Verlinkungsmatrix): „Kaufent-
scheidung Grundlagen" (Arten, Gesamtpreis, Gebraucht-Kaufen) und „Alltagstauglichkeit"
(Kofferraum, Stadt-oder-Land). Das kostet nur Linksetzen, keinen neuen Content, und behebt das
Problem sofort.

---

### F5 — Near-Orphan-Seite: `spielzeug-rotieren-kleinkind.html`
**Severity:** Medium

**Evidenz:** Einziger realer Inbound-Link (neben Selbstverweis) kommt von der Startseite
(`index.html:458`, Bento-Grid-Kachel). Der Artikel fehlt in `kaufhilfen.html`s eigener
„Sämtliche Artikel auf Kleinkind-Welt.de"-Übersicht (`kaufhilfen.html:397-445`, die ausdrücklich
Vollständigkeit beansprucht, aber nur 28 statt 29 Artikel listet), fehlt im
`spielzeug-nach-alter.html`-Hub und wird von keinem der sechs Altersstaffel-Artikel kontextuell
erwähnt — obwohl "wie viel Spielzeug ist genug" ein natürlicher Cross-Link-Kandidat für jeden
Altersartikel wäre.

**Empfehlung:** Sofortiger Fix (kein neuer Content nötig): Eintrag in
`kaufhilfen.html`s Ratgeber-Übersicht ergänzen, kontextuellen Link aus mindestens zwei
Altersartikeln setzen (z. B. `spielzeug-2-jahre.html`, `spielzeug-3-jahre.html` — dort, wo
"Wie viel Spielzeug braucht mein Kind" bereits als FAQ existiert), und einen Link von
`spielzeug-nach-alter.html` aus setzen.

---

### F6 — `weihnachtsgeschenke-kleinkind.html` unterverlinkt trotz massivem Themen-Overlap
**Severity:** Low-Medium

**Evidenz:** Nur 2 reale Inbound-Links (Hub `geschenke-kleinkind.html` + `kaufhilfen.html`), obwohl
der Artikel Produkte (DUPLO, Pikler-Dreieck, Motorikbrett, Spielküche) und FAQ-Struktur nahezu
1:1 aus `geschenke-1-jahr.html`, `geschenke-2-jahre.html`, `geschenke-3-jahre.html` und
`motorikspielzeug-test.html` recycelt (eigene H2-Abschnitte "Weihnachtsgeschenke für 1-/2-/3-
Jährige" spiegeln exakt die drei Geburtstags-Geschenkartikel). Diese vier Artikel verlinken aber
nicht zurück auf die Weihnachtsseite, obwohl die Suchintention (saisonal, "Weihnachtsgeschenke
Kleinkind") klar verschieden und nicht kannibalisierend ist.

**Empfehlung:** Kontextuellen Link von `geschenke-1-jahr.html`, `geschenke-2-jahre.html`,
`geschenke-3-jahre.html` auf `weihnachtsgeschenke-kleinkind.html` ergänzen ("Diese Ideen eignen
sich auch als Weihnachtsgeschenk – mehr dazu in unserem Weihnachtsgeschenke-Guide"), um die
saisonale Seite vor dem Q4-Traffic-Fenster zu stärken.

---

### F7 — DUPLO-Suitability-FAQ über 6 Seiten fragmentiert
**Severity:** Medium

**Evidenz:** Nahezu identische FAQ-Fragen zur DUPLO-Eignung erscheinen auf sechs verschiedenen
Seiten mit jeweils eigenem `FAQPage`-Schema-Eintrag:

| Seite | FAQ-Frage |
|---|---|
| `spielzeug-18-24-monate.html` | "Ist DUPLO schon für 18 Monate geeignet?" |
| `spielzeug-2-jahre.html` | "Ab wann ist LEGO DUPLO geeignet?" |
| `geschenke-2-jahre.html` | "Ist LEGO DUPLO für 2-Jährige geeignet?" |
| `spielzeug-3-jahre.html` | "Ist LEGO DUPLO noch das Richtige mit 3 Jahren?" |
| `geschenke-3-jahre.html` | "Warum ist DUPLO so gut für 3-Jährige?" |
| `duplo-vergleich.html` | (eigentlicher kanonischer Vergleichs-Artikel) |

Das ist kein harter Kannibalisierungsfall (unterschiedliche Alters-Frames), aber sechs
konkurrierende `FAQPage`-Rich-Result-Kandidaten für eng verwandte Fragen bedeuten, dass Google
selbst entscheiden muss, welche Seite die Frage "beantwortet" — unvorhersehbar und
Linkkraft-verwässernd, zumal `spielzeug-2-jahre.html` (Bausteinbox als Nr.-1-Pick) und
`geschenke-2-jahre.html` (identischer Pick) hier am stärksten kollidieren.

**Empfehlung:** `duplo-vergleich.html` als kanonischen Owner der "Ab wann DUPLO"-Frage
festlegen; die anderen fünf Artikel behalten ihre kurze kontextuelle DUPLO-Erwähnung, aber ohne
eigenes `FAQPage`-Item dafür — stattdessen ein Inline-Link "→ Ausführlich: Ab wann ist DUPLO
geeignet?" zu `duplo-vergleich.html`.

---

## Kannibalisierungs-Check (Frage 2)

**Ergebnis: Kein hartes Kannibalisierungsproblem auf Title/H1/Meta-Ebene — moderates Risiko auf
Produkt-Pick- und FAQ-Ebene.**

| Paar | Title/H1-Differenzierung | Produkt-Overlap | Risiko |
|---|---|---|---|
| `spielzeug-2-jahre` vs. `geschenke-2-jahre` | Klar getrennt ("beste Empfehlungen" vs. "Geschenkideen") | LEGO DUPLO als Top-Pick in **beiden**, fast identische DUPLO-FAQ | Medium (F7) |
| `spielzeug-3-jahre` vs. `geschenke-3-jahre` | Klar getrennt | LEGO DUPLO als Top-Pick in **beiden**, fast identische FAQ | Medium (F7) |
| `spielzeug-12-18-monate` vs. `geschenke-1-jahr` | Klar getrennt (Alter vs. Anlass) | Lauflernwagen, Stapelbecher, Pappbilderbücher in beiden (~3 von 5 Produkten) | Low — plausibel, da gleiche Altersspanne |
| `geschenke-zur-geburt` vs. `spielzeug-0-6-monate` | Klar getrennt | Spielbogen, Greifrassel in beiden; fast identische FAQ "Ab wann braucht ein Baby Spielzeug?" | Low |
| `weihnachtsgeschenke-kleinkind` vs. `geschenke-1/2/3-jahre` | Klar getrennt (saisonal vs. Geburtstag) | Hoch (DUPLO, Pikler-Dreieck, Motorikbrett, Spielküche) | Low für Rankings, aber Redundanz (F6) |

Titel und H1 folgen konsequent zwei verschiedenen Mustern — Alter: „Spielzeug für X – Die besten
Empfehlungen 2026", Anlass: „Geschenke zum X. Geburtstag – Y Ideen" — das ist korrekt und
verhindert Meta-Ebene-Duplikate. Das eigentliche Risiko liegt eine Ebene tiefer: identische
Produkt-Empfehlungen und nahezu wortgleiche FAQ-Antworten (v. a. DUPLO, siehe F7) zwischen
Alters- und Geschenke-Pendants am 2- und 3-Jahre-Punkt. Empfehlung aus der Vorgänger-Analyse
bleibt gültig und wird hier bestätigt: Altersartikel führen mit Entwicklungsmeilensteinen,
Geschenkartikel mit Budget/Anlass-Framing — aber zusätzlich: Produktüberschneidung pro Paar auf
maximal ~40 % begrenzen und FAQ-Duplikate wie in F7 beschrieben konsolidieren.

## Intent-Zuordnung (Frage 3)

| Cluster | Intent | Template im Einsatz | Passt? |
|---|---|---|---|
| Altersstaffel (6 Artikel) | Commercial (Best-of) mit informationalem Rahmen | Listicle + Affiliate-Kaufboxen | Ja |
| Geschenke-Anlässe (5 Artikel) | Commercial (Gift-Guide) | Listicle + Affiliate-Kaufboxen | Ja |
| Situatives Spielen (4 Artikel) | Commercial-informational hybrid | Listicle | Ja |
| Entwicklung/Förderung (3 Artikel) | Informational (Motorik, Sprache) + Montessori | Explainer/Listicle | Größtenteils ja — **Ausnahme:** `motorikspielzeug-test.html` bündelt vier Produkttypen unter einem Titel, obwohl die Suchintention "motorikwürfel test" ein fokussiertes Review-Template verlangt (siehe F2) |
| Ratgeber & Vergleiche (4 Artikel) | Commercial-Comparison / Informational-Explainer | Comparison/Explainer | Ja |
| Kinderwagen-Spokes (5 Artikel) | Informational-Explainer / Commercial-Comparison | Explainer/Comparison | Ja |
| Hub-Seiten (4) | Navigational/Collection | CollectionPage | Formal korrekt, aber zu dünn für die Kopfbegriffe, die sie tragen sollen (F1) |

Die einzige echte Intent-Template-Fehlpassung ist die Bündelung mehrerer Produkttypen unter einem
Test-/Review-Titel im Entwicklungscluster (F2). Alle anderen Cluster zeigen eine saubere,
konsistente Zuordnung von Suchintention zu Seitentyp.

## Lücken im Spielzeug-Cluster (Frage 4) — Top 3

1. **Produktkategorie-Ebene fehlt komplett** (F2) — direkt durch beide Quick-Win-Keywords
   (Lauflerngitter, Stapelbecher) belegt. Höchste Priorität, weil bereits nachgewiesene Nachfrage
   ohne Kannibalisierungsrisiko (aktuell keine Seite besitzt den Begriff).
2. **Entwicklung/Sicherheit-Gruppe ohne Hub** (F3) — betrifft 7 Artikel, die bereits in
   `kaufhilfen.html` taxonomisch vorgruppiert sind, aber strukturell nie zu Hubs ausgebaut wurden.
3. **Situationsbezogene Lücken jenseits von Outdoor/Reise** (aus Vorgänger-Audit bestätigt, hier
   nicht neu geprüft, aber weiterhin offen): "Spielzeug für Geschwisterkinder/Teilen lernen" und
   "Spielzeug für Regentage/kleine Wohnung" haben nachweislich keine eigene Seite, obwohl das
   bestehende Situations-Cluster (Outdoor, Balkon, Reise, Bad) zeigt, dass dieses Format
   funktioniert und gut interlinkt.

## Kinderwagen-Cluster: reicht das? (Frage 5)

**Nein — es fehlt die mittlere Cluster-Ebene, nicht nur mehr Content.** Aktuell: 1 Hub + 5 Spokes
als **eine flache Liste**, keine Sub-Cluster-Gruppierung, und 2 der 5 Spokes strukturell isoliert
(F4). Das ist an der unteren Grenze der Methodik-Vorgabe (2–5 Cluster à 2–4 Posts) und wird von
der Praxis bereits als unzureichend erkannt: `docs/navigator-produktstrategie.md` plant explizit
**sieben Bedingungsseiten** aus validierten Persona-Segmenten
(`compact_car_fixed_budget`, `low_budget_city_walkup`, `tight_access_transit`,
`rural_rough_routes`, `mid_budget_function_first`, `service_weather_long_use`,
`premium_mobile_family`) plus vier weitere Typ-Segmente (`travel_buggy`, `buggy`,
`siblings_twins`, `unsure`) als Cluster-Erweiterung.

**Empfehlung — dreistufige Zielarchitektur statt Ad-hoc-Ausbau:**

1. Bestehende 5 Spokes sofort in zwei benannte Cluster umgruppieren (kostet nur Verlinkung, siehe
   F4): „Kaufentscheidung Grundlagen" (Arten, Gesamtpreis, Gebraucht-Kaufen) und
   „Alltagstauglichkeit" (Kofferraum, Stadt-oder-Land).
2. Neues drittes Cluster „Bedingungsseiten" für die 7 Persona-Segmente, aufgeteilt in zwei
   Sub-Cluster à 3–4 Posts (Methodik-Konform): „Platz & Budget"
   (`compact_car_fixed_budget`, `low_budget_city_walkup`, `tight_access_transit`) und
   „Gelände & Langzeitnutzung" (`rural_rough_routes`, `mid_budget_function_first`,
   `service_weather_long_use`, `premium_mobile_family`).
3. Jede neue Bedingungsseite MUSS (mandatory) auf `kinderwagen.html` (Hub) und auf
   `kinderwagen-navigator.html` (Tool) verlinken, PLUS mindestens 2 Sibling-Links innerhalb ihres
   Sub-Clusters sowie mindestens 1 Link auf den passenden bestehenden Datenartikel (z. B.
   `compact_car_fixed_budget` → `kinderwagen-kofferraum.html`, weil dort bereits die
   Faltmaß-Datentabelle liegt, die die Seite braucht). Sonst wiederholt sich das F4-Muster beim
   Siebenfachen des Cluster-Umfangs.
4. Die Typ-Segmente (`travel_buggy`, `buggy`, `siblings_twins`, `unsure`) bilden langfristig ein
   viertes Cluster „Kinderwagen-Typen" — aber erst nachdem Cluster 3 sauber verlinkt live ist,
   sonst überschreitet der Kinderwagen-Bereich die Methodik-Obergrenze von 5 Clustern gleichzeitig
   im Aufbau.

Der aktuelle NULL-Impressionen-Befund in GSC ist bei einer zwei Monate alten Domain mit nur 5
dünnen, schwach vernetzten Spokes nicht überraschend — er ist eher ein Symptom der fehlenden
mittleren Ebene als ein separates Problem.

---

## Interne Verlinkungsmatrix — Empfehlung (Frage 6)

Legende: **M** = mandatory (muss), **E** = empfohlen (sollte), **O** = optional.

### Spielzeug-Cluster: neue/fehlende Links

| Von | Nach | Typ | Begründung |
|---|---|---|---|
| `spielzeug-2-jahre.html`, `spielzeug-3-jahre.html` | `spielzeug-rotieren-kleinkind.html` | E | Schließt F5, thematisch passend an "wie viel Spielzeug" |
| `spielzeug-nach-alter.html` | `spielzeug-rotieren-kleinkind.html` | M | Hub muss alle Spokes verlinken (F5) |
| `kaufhilfen.html` (Ratgeber-Übersicht) | `spielzeug-rotieren-kleinkind.html` | M | Liste behauptet Vollständigkeit, muss stimmen (F5) |
| `geschenke-1-jahr.html`, `geschenke-2-jahre.html`, `geschenke-3-jahre.html` | `weihnachtsgeschenke-kleinkind.html` | E | Saisonale Brücke, kein Kannibalisierungsrisiko (F6) |
| `spielzeug-18-24-monate.html`, `spielzeug-2-jahre.html`, `spielzeug-3-jahre.html`, `geschenke-2-jahre.html`, `geschenke-3-jahre.html` | `duplo-vergleich.html` (statt eigenem FAQ-Item) | E | Konsolidiert DUPLO-FAQ auf einen kanonischen Owner (F7) |
| Neue Seite `stapelbecher.html` | `spielzeug-6-12-monate.html`, `spielzeug-12-18-monate.html`, `geschenke-1-jahr.html`, `spielzeug-unter-20-euro.html` | M (zurück) / E (hin) | Bündelt zehn+ verstreute Erwähnungen (F2) |
| Neue Seite `lauflerngitter-vs-lauflernwagen.html` | `spielzeug-6-12-monate.html`, `spielzeug-12-18-monate.html` | M (zurück) / E (hin) | Greift Pos.-10,8-Erfolg auf (F2) |
| Neue Seite `motorikwuerfel.html` | `motorikspielzeug-test.html` (bleibt Eltern-Vergleichsseite) | M (beide Richtungen) | Löst Bündelungsproblem (F2) |
| Neues Hub `/entwicklung-spielzeug/` | `motorikspielzeug-test.html`, `sprache-foerdern-spielzeug.html`, `montessori-spielzeug-kleinkind.html` | M (beide Richtungen) | Schließt F3 |
| Neues Hub `/sicheres-spielzeug/` | `holzspielzeug-vs-plastikspielzeug.html`, `nachhaltiges-spielzeug-siegel.html`, `duplo-vergleich.html`, `was-wir-nicht-kaufen.html` | M (beide Richtungen) | Schließt F3 |

### Kinderwagen-Cluster: neue/fehlende Links

| Von | Nach | Typ | Begründung |
|---|---|---|---|
| `kinderwagen-gebraucht-kaufen.html` | `kinderwagen-gesamtpreis.html`, `kinderwagen-arten.html` | E | Aktuell 0 Sibling-Links (F4) |
| `kinderwagen-stadt-oder-land.html` | `kinderwagen-arten.html`, `kinderwagen-kofferraum.html` | E | Aktuell 0 Sibling-Links (F4) |
| `kinderwagen-gesamtpreis.html` | `kinderwagen-gebraucht-kaufen.html` | E | Bisher nur Einbahnstraße Richtung Gesamtpreis |
| `kinderwagen-kofferraum.html` | `kinderwagen-stadt-oder-land.html` | E | Thematische Nähe (Gelände/Auto) ungenutzt |
| Neue Bedingungsseite `compact_car_fixed_budget` | `kinderwagen-kofferraum.html`, `kinderwagen.html`, `kinderwagen-navigator.html` | M | Nutzt bestehende Faltmaß-Datentabelle |
| Neue Bedingungsseite `low_budget_city_walkup` | `kinderwagen-gesamtpreis.html`, `kinderwagen.html`, `kinderwagen-navigator.html` | M | Preisdaten bereits vorhanden |
| Alle 7 neuen Bedingungsseiten | `kinderwagen.html` (Hub) und `kinderwagen-navigator.html` (Tool) | M | Kein Orphan-Risiko beim Skalieren (Lehre aus F4) |
| Jede Bedingungsseite | 2 Sibling-Seiten im gleichen Sub-Cluster | E | Methodik-Vorgabe 2–3 Sibling-Links |

### Validierungs-Checkliste (Ergebnis)

- [x] Keine zwei Seiten teilen exakt dasselbe primäre Keyword (Title/H1-Ebene sauber getrennt)
- [ ] Jeder Spoke hat ≥ 3 Inbound-Links — **verletzt** bei `kinderwagen-gebraucht-kaufen`,
      `kinderwagen-stadt-oder-land` (je 2), `spielzeug-rotieren-kleinkind` (1),
      `weihnachtsgeschenke-kleinkind` (2)
- [x] Jeder Kinderwagen-Spoke verlinkt auf den Hub (mandatory erfüllt)
- [x] Der Hub verlinkt auf jeden Spoke (mandatory erfüllt, in allen 4 Hubs)
- [ ] Keine Orphan-Pages — **fast** erfüllt, `spielzeug-rotieren-kleinkind.html` ist Near-Orphan
- [ ] Template-Auswahl passt zur Intent-Klassifikation — **eine Ausnahme**: `motorikspielzeug-test.html` bündelt vier Produkttypen unter einem Review-Titel (F2)
- [ ] Wortzahl-Zielvorgaben eingehalten — **verletzt** bei allen 4 Hubs (353–1.081 statt 2.500–4.000) und bei 3 Kinderwagen-Spokes (868–1.161 statt 1.200–1.800)
- [x] Cluster-Gesamtgröße innerhalb der Konstante (2 etablierte Cluster, geplante Erweiterung methodik-konform)
- [x] SERP-Daten (hier: GSC-Positionsdaten) stützen die Cluster-Gruppierung — Lauflerngitter/Stapelbecher-Befund bestätigt die Notwendigkeit des neuen Produktkategorie-Clusters

---

## Zusammenfassung für den Auftraggeber

**Score Cluster-Architektur: 58/100.** Die zwei Hauptcluster (Spielzeug/Geschenke, Kinderwagen)
sind konzeptionell richtig angelegt, mit sauberer Alters-/Anlass-Trennung auf Title/H1-Ebene und
einem funktionierenden sitenweiten Sicherheitsnetz (`kaufhilfen.html`). Der Abzug kommt von vier
strukturellen Defiziten: (1) alle vier Hub-Seiten sind mit 353–1.081 Wörtern zu dünn, um die
breiten Kopfbegriffe selbst zu tragen, die sie besetzen sollen; (2) eine komplette
Produktkategorie-Ebene fehlt, was direkt zwei bereits nachgewiesene Quick-Win-Keywords
(Lauflerngitter Pos. 10,8, Stapelbecher Pos. 18,3 — beide ohne eigene Seite) ungenutzt lässt;
(3) der Kinderwagen-Cluster hat mit nur 5 Spokes und 2 davon strukturell isoliert (0
Sibling-Links, 2 Inbound-Links) keine tragfähige mittlere Ebene für die geplante Erweiterung um
7 Persona-Bedingungsseiten; (4) eine Near-Orphan-Seite (`spielzeug-rotieren-kleinkind.html`) und
eine unterverlinkte Saisonseite (`weihnachtsgeschenke-kleinkind.html`).

**Kannibalisierung:** Kein hartes Problem auf Title/H1/Meta-Ebene — die Alters- vs. Geschenke-
Trennung ist sauber. Das reale Risiko liegt eine Ebene tiefer: nahezu identische
LEGO-DUPLO-Produkt-Picks und -FAQ-Antworten zwischen `spielzeug-2-jahre`/`geschenke-2-jahre` und
`spielzeug-3-jahre`/`geschenke-3-jahre`, verteilt über sechs Seiten mit je eigenem FAQ-Schema-
Item — verwässert, wem Google die Antwort zuordnet, ohne die Rankings hart zu kannibalisieren.

**Die drei wichtigsten Lücken:**
1. Fehlende Produktkategorie-Ebene (Stapelbecher, Lauflerngitter, Motorikwürfel als eigene
   Seiten) — höchste Priorität, weil bereits durch echte GSC-Positionen belegt.
2. Kein Hub für die 7 bereits in `kaufhilfen.html` vorgruppierten „Entwicklung & Förderung"- und
   „Ratgeber & Vergleiche"-Artikel.
3. Kinderwagen-Cluster ohne mittlere Sub-Cluster-Ebene — die geplanten 7 Persona-
   Bedingungsseiten brauchen eine Zwei-Cluster-Struktur und mandatory Rückverlinkung, sonst
   erben sie das gleiche Isolations-Muster wie `kinderwagen-gebraucht-kaufen.html` und
   `kinderwagen-stadt-oder-land.html` heute schon zeigen.
