# Kinderwagen-Navigator als Hauptprodukt — Langfriststrategie

Stand: 28.07.2026 · Nächste Überprüfung: nach Abschluss von Phase 1

Ziel: Der Navigator ist nicht länger ein Feature neben 29 Artikeln, sondern das Produkt,
auf das die Seite hinarbeitet. Kurzfristig soll er Reichweite bringen, langfristig Leads
und Affiliate-Umsatz.

---

## 1. Ausgangslage (verifiziert, nicht geschätzt)

**Was funktioniert.** Technisch ist die Seite sauber: alle 37 Sitemap-URLs antworten mit
200, kein versehentliches `noindex`, Clean-URLs und 301-Weiterleitungen korrekt,
`robots.txt` erlaubt alle relevanten Bots. Das Schema-Markup ist über alle Artikel hinweg
vollständig (Article, FAQPage, Question/Answer, BreadcrumbList, Speakable). Der
Content-Median liegt bei 1834 Wörtern.

**Was nicht funktioniert.** 90 Tage GSC-Daten (29.04.–25.07.2026): **7 Klicks, 448
Impressionen.** Fast alle Suchanfragen liegen auf Position 50–90. Das ist das erwartbare
Bild einer jungen Domain ohne Backlinks auf kommerziellen Head-Terms.

**Der Befund, der diese Strategie in einem Punkt widerlegt.** Das Kinderwagen-Cluster war
Google **unbekannt** — nicht schlecht platziert, sondern nie entdeckt. Die URL-Inspection-API
meldete für `/kinderwagen` und alle Kinderwagen-Artikel „URL is unknown to Google", ohne
Crawl-Zeitpunkt. Ursache: Google hat die Sitemap genau einmal gelesen, am 14.07.2026, mit
damals 30 URLs. Die sieben später ergänzten URLs — das komplette Kinderwagen-Cluster — waren
nie angekündigt. Am 28.07.2026 neu eingereicht; Details in `gsc-analyse-2026-07-28.md`.

**Die zweite Korrektur betrifft die Personas.** Über 130 der 448 Impressionen entfallen auf
Geschenk-Anfragen („geschenke für kleinkinder", „was schenkt man zur geburt"), meistgesehene
Seite ist `/geschenke-kleinkind`. Die tatsächliche Nachfrage kommt also von
**Geschenkekäufern** — häufig Großeltern und Freunde, nicht die Eltern. Die sieben
Navigator-Personas beschreiben dagegen Eltern, die für sich selbst auswählen. Ein
Kinderwagen ist kein typisches Geschenk.

Daraus folgt: **Das Publikum des Navigators lässt sich nicht vom bestehenden Traffic erben.**
Die Annahme, vorhandene Autorität in den Kinderwagen-Bereich lenken zu können, trägt nicht
— die vorhandene Autorität sitzt in einem anderen Bedürfnis. Kurzfristiger Traffic
(Spielzeug/Geschenke) und das strategische Produkt (Navigator) sind zwei getrennte
Arbeitsfelder.

**Der Widerspruch, der die Strategie bestimmt.** Der Navigator ist der einzige Teil der
Seite, den kein Wettbewerber hat: 20 Kombi-Kinderwagen mit einzeln belegten Fakten, ein
gewichtetes Kriterienmodell, eine Policy, die Schätzungen verbietet und Datenlücken
ausweist, dazu zehn dokumentierte Kofferraumprofile. Genau dieser Teil steht auf
`noindex`. Das Austauschbare ist sichtbar, das Einzigartige ist abgeschaltet.

---

## 2. Die strategische These

Ein Tool rankt nicht breit. Eine Tool-Seite bedient eine Handvoll Suchanfragen — das
allein trägt kein Geschäft.

**Aber die Daten hinter dem Tool können viele Seiten tragen.** Nicht als
Massenproduktion, sondern als kleine Zahl echter Antworten auf echte Einschränkungen.
Eltern suchen nicht „den besten Kinderwagen", sondern „einen Kinderwagen, der in meinen
Kofferraum passt und unter 800 Euro bleibt". Das ist eine Filterabfrage — und genau die
kann der Navigator beantworten, mit Begründung und offengelegten Kompromissen.

Daraus folgt der Mechanismus: **Nicht 200 dünne Kombinationsseiten, sondern rund zehn
sehr gute Bedingungsseiten**, die jeweils eine reale Einschränkung auflösen und ins Tool
führen. Zehn Seiten, die man ernst nehmen kann, schlagen zweihundert, die nach
Doorway-Pages aussehen — zumal Google bei neuen Domains ohne Autorität dafür besonders
empfindlich ist.

---

## 3. Der Reichweiten-Mechanismus

### 3.1 Bedingungsseiten aus den Persona-Segmenten

Die sieben Segmente in `persona-segments.v0.2.json` sind bereits definiert und mit
Referenzprofilen hinterlegt. Jedes entspricht einer anderen Suchintention:

| Segment | Einschränkung | Suchintention (Hypothese) |
|---|---|---|
| `compact_car_fixed_budget` | kleiner Kofferraum, Budget 800 € hart | Kinderwagen für kleines Auto |
| `low_budget_city_walkup` | Treppen + ÖPNV, Budget 600 € hart | leichter Kinderwagen ohne Aufzug |
| `tight_access_transit` | enger Aufzug, ÖPNV | schmaler Kinderwagen |
| `rural_rough_routes` | Feld- und Waldwege | Kinderwagen für unebene Wege |
| `mid_budget_function_first` | Stauraum, lange Nutzung | Kinderwagen Preis-Leistung |
| `service_weather_long_use` | Ersatzteile, Wetterschutz | langlebiger Kinderwagen |
| `premium_mobile_family` | viel unterwegs, Budget offen | Kinderwagen für Vielreisende |

Jede Seite bekommt: die konkrete Fragestellung, den gefilterten Ausschnitt des Katalogs mit
Begründung, den wichtigsten Kompromiss je Modell, die offenen Prüfpunkte, und einen
Einstieg ins Tool für die individuelle Verfeinerung. Damit ist jede Seite eigenständig
nützlich und keine Dublette.

**Reihenfolge:** Zuerst `compact_car_fixed_budget` und `low_budget_city_walkup`. Nicht
wegen vermuteter Suchvolumina, sondern weil für beide bereits Referenzprofile,
Kriteriengewichte und der ausgebaute Kofferraum-Artikel als Ankerpunkt existieren.

### 3.2 Datenartikel als Linkmagnet

Der Kofferraum-Artikel ist am 28.07.2026 von 446 auf 1844 Wörter ausgebaut worden — mit
zwei Datentabellen aus dem Navigator-Katalog und einem Befund, der die verbreitete Annahme
umdreht: Die Faltbreite ist nie das Problem (45–65,5 cm gegen 99,7–101 cm zwischen den
Radkästen), die Bodenlänge ist es. Bei zehn der zwanzig Modelle ist die größte Faltkante
länger als der Ladeboden eines VW T-Cross.

Solche Aussagen sind zitierbar. Das ist der Unterschied zwischen Inhalt, der Links
bekommt, und Inhalt, der nur existiert. Dieselbe Behandlung brauchen:

- **`kinderwagen-gesamtpreis` (391 Wörter, dünnster Artikel).** Material liegt bereit:
  dokumentierte Geburtskonfigurationspreise aller 20 Modelle von 179 € bis 1299 €, je mit
  Quelle und Frischedatum.
- **`kinderwagen-arten` (507 Wörter).** Material: das Kriterienmodell mit den gewichteten
  Dimensionen.
- `kinderwagen-gebraucht-kaufen` (428) und `kinderwagen-stadt-oder-land` (464) — hier gibt
  es keine proprietären Daten, also klassische Recherchearbeit mit weniger
  Differenzierung. Nachrangig.

### 3.3 Typ-Erweiterung als Cluster-Erweiterung

Die Architektur kennt bereits vier weitere Segmente (`travel_buggy`, `buggy`,
`siblings_twins`, `unsure`) mit eigenen Routen und teils eigenen Referenzprofilen. Jeder
neue Typ ist gleichzeitig ein neues Keyword-Cluster und eine bessere Antwortfähigkeit des
Tools — Reichweite und Qualität fallen hier zusammen.

**Seit 28.07.2026 ist die Typ-Frage wieder die erste Frage im Flow.** Wer einen Reisebuggy
sucht, erfährt das nach einer Frage statt nach sechs, bekommt eine ehrliche Begründung und
eine Warteliste mit Double-Opt-In. Damit wird aus einem Totalverlust ein Lead — und die
Verteilung der Wartelisten-Segmente sagt, welcher Typ als Nächstes gebaut werden sollte.
Diese Reihenfolge wird also gemessen, nicht geraten.

---

## 4. Phasenplan

### Phase 0 — Fundament (jetzt, 4 Wochen)

Ziel: Der Navigator wird indexierbar, und die Anfragen mit Vorlaufzeit sind gestartet.

1. Herstelleranfragen an Kinderkraft und my junior raus (Spezifikationen **und**
   Bildrechte in einer Mail, Vorlage liegt vor). Startet die zwei langsamsten Gates
   parallel.
2. `foldingConvenience`-Regel schriftlich festlegen, danach den ganzen Katalog neu
   bewerten. Schließt ein Persona-Gate ohne neue Daten.
3. Screenreader-Durchlauf mit VoiceOver (Tastatur und Smartphone sind automatisiert grün).
4. Fünf moderierte Eltern-Tests terminieren.
5. Die 50 Beta-Durchläufe **nicht** aus der Suche erwarten: Elternforen, Facebook-Gruppen,
   ein Reddit-Beitrag, notfalls 50 € Testbudget. Das löst die Zirkularität, dass ein Gate
   Traffic braucht, den es selbst freischalten soll.

**Gate zu Phase 1:** `node tools/kinderwagen-index-readiness.mjs --strict` läuft durch.

### Phase 1 — Sichtbarkeit (Monat 2–3)

1. `noindex` entfernen, Sitemap-Eintrag mit `lastmod`, `llms.txt` auf öffentlich
   umstellen, Open-Graph-Vorschau für den Navigator, Indexierung in der GSC anstoßen.
2. Zwei Bedingungsseiten live: kleines Auto, leichter Kinderwagen ohne Aufzug.
3. `kinderwagen-gesamtpreis` und `kinderwagen-arten` auf Datenbasis ausbauen.
4. Interne Verlinkung: Der Navigator ist aus 11 Seiten erreichbar. Die Bedingungsseiten
   müssen gegenseitig und aus den Artikeln verlinkt sein, damit die wenige Autorität dort
   ankommt, wo sie wirken soll.

**Messgröße:** Impressionen in der GSC für Navigator und Bedingungsseiten. Nicht Klicks —
die kommen später. Impressionen zeigen, ob Google die Seiten überhaupt als Antwort auf
etwas versteht.

### Phase 2 — Umsatz und erste Erweiterung (Monat 3–6)

1. Awin-Angebote einbauen, sobald Freigaben da sind. `offers.v0.1.json` ist leer;
   drei der sechs Programme haben noch keine `advertiserId`. Erst damit wird aus Reichweite
   Umsatz, weil Kinderwagen bei 400–1300 € Warenkorb liegen und Amazon dort schwach ist.
2. Das per Warteliste am stärksten nachgefragte Segment aufbauen — nach heutigem
   Architekturstand am wahrscheinlichsten Reisebuggy.
3. Lead-Strecke: Aus Ergebnis-Mail und Warteliste eine Sequenz machen, die bei der
   Kaufentscheidung hilft statt zu verkaufen. Verkauft wird über den Nutzen des Tools.
4. Restliche fünf Bedingungsseiten.

### Phase 3 — Burggraben (Monat 6–12)

1. Katalog über 20 Modelle hinaus, weitere Typen.
2. Fahrzeugdaten über Volkswagen hinaus. Die Kofferraum-Frage ist ein
   Alleinstellungsmerkmal, solange niemand sonst sie mit Belegen beantwortet.
3. Die Datenlücken-Transparenz aktiv als Argument nutzen: Ein Vergleich, der offenlegt, was
   er nicht weiß, ist für Journalisten und Foren zitierfähig. Das ist der realistischste
   Weg zu ersten Backlinks.

---

## 5. Umsatzarchitektur

**Heute:** Nur Amazon-Zubehörsuchlinks mit `tag=kleinkindwelt-21`. Die konvertieren
schlecht, weil sie auf Suchergebnisseiten führen, und Zubehör hat kleine Warenkörbe.

**Leads (Ziel b).** Zwei Quellen, beide seit dieser Woche funktionsfähig: die
Ergebnis-Mail über Brevo und die neue Warteliste mit Double-Opt-In. Der Lead ist wertvoll,
weil der Kaufzeitpunkt bei Kinderwagen planbar ist — wer in der Schwangerschaft sucht,
kauft in Wochen, nicht Minuten. Eine E-Mail-Strecke überbrückt genau diese Lücke.

**Affiliate (Ziel a).** Der Umsatz liegt bei den Händlerangeboten, nicht beim Zubehör.
Voraussetzung sind die Awin-Freigaben. Wichtig für die Glaubwürdigkeit und in der Policy
bereits verankert: Provision verändert weder Match-Score noch Reihenfolge, und die
Angebotsverfügbarkeit beeinflusst die Aufnahme eines Modells nicht.

---

## 6. Qualitätsschleife (dauerhaft, parallel)

Reichweite ohne Qualität wäre kurzlebig, weil der ganze Vorteil auf Belegbarkeit beruht.

- **Datenlücken sichtbar halten.** `data-gaps.v0.1.json` erfasst seit 28.07.2026 auch
  `oneHandFold` (10 von 20 unbekannt) und `selfStandingFold` (14 von 20) — vorher waren
  ausgerechnet die entscheidungsrelevantesten Lücken nicht getrackt, obwohl die Policy es
  verlangt.
- **Bewertungsregeln vor Bewertungen.** Der dokumentierte Fall in
  `kinderwagen-navigator-mismatch-review-2026-07-28.md` zeigt, was sonst passiert: fünf
  Modelle mit identischem Beleg-Profil, eines doppelt so hoch bewertet.
- **Frischedaten respektieren.** Preise tragen `freshUntil`. Ein Vergleich mit abgelaufenen
  Preisen ist schlechter als keiner.
- **Regressionstests.** Der Kernpfad ist über drei Browser-Engines automatisiert, die
  Typ-Weiche seit heute ebenfalls.

---

## 7. Was in diesem Plan bewusst offen bleibt

**Suchvolumina und Wettbewerbsdichte sind Hypothesen.** Ich habe keinen Zugriff auf
Keyword-Daten; die verfügbare Websuche ist auf die USA beschränkt und für deutsche
Suchanfragen ungeeignet. Die Priorisierung der Bedingungsseiten beruht daher auf
Datenverfügbarkeit und logischer Nähe zum Katalog, nicht auf gemessener Nachfrage.

**Zu prüfen, bevor Phase 1 startet:** Die Segment-Hypothesen aus Abschnitt 3.1 gegen echte
Keyword-Daten halten (Sistrix, DataForSEO oder Google Keyword Planner). Wenn eine
Bedingung kaum gesucht wird, fällt sie nach hinten.

**Der GSC-Abdeckungsstatus ist seit 28.07.2026 geklärt** und in
`gsc-analyse-2026-07-28.md` dokumentiert: Spielzeugbereich indexiert aber zu tief,
Kinderwagenbereich Google unbekannt. Damit ist die Reihenfolge in Phase 0 und 1 nicht mehr
Hypothese, sondern Konsequenz.

**Backlink-Ausgangslage unbekannt.** Ohne diese Zahl ist nicht abschätzbar, wie lange
Phase 1 bis zur Wirkung braucht.

**Nicht nutzbar:** PageSpeed- und CrUX-API (kein `GOOGLE_API_KEY`), GA4 (keine
`ga4_property_id`). Beides in `~/.config/claude-seo/google-api.json` nachtragbar und würde
Ladezeit-Felddaten und Nutzerverhalten erschließen.

---

## 8. Am 28.07.2026 umgesetzt

- Typ-Frage als erste Frage im Flow (`flowVersion` 0.4.0), Routing sofort nach der Antwort
  statt am Ende des Fragebogens
- Warteliste mit Double-Opt-In auf allen vier nicht unterstützten Routen, inklusive
  neuer Netlify-Funktion `navigator-waitlist` und Segment-Attribut für Brevo
- Optionale `hint`-Zeile für Antwortoptionen (Rendering plus CSS)
- Kofferraum-Artikel von 446 auf 1844 Wörter, zwei Datentabellen, FAQ von 2 auf 6
- 24 bislang ungetrackte Datenlücken erfasst
- Sieben neue Tests für die Typ-Weiche, Regressionssuite über drei Engines grün

**Noch einzurichten (nur von Boris möglich):** In Brevo eine Warteliste anlegen, ein
Double-Opt-In-Template dafür, und die Umgebungsvariablen `BREVO_WAITLIST_LIST_ID`,
`BREVO_WAITLIST_DOI_TEMPLATE_ID` sowie optional `BREVO_SEGMENT_ATTRIBUTE` in Netlify
setzen. Ohne diese Konfiguration antwortet der Endpunkt mit einer ehrlichen
Fehlermeldung statt eine Anmeldung vorzutäuschen.
