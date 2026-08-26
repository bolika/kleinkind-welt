# SEO-Pilot fuer verlorene Seiten

Stand: 26.08.2026  
Rolle: SEO-Analyse, Codex-Aufgabe 4  
Scope: vier bestehende Artikel; keine HTML-Aenderung in dieser Aufgabe

## Kurzentscheidung

Als einziger kontrollierter Pilot wird `spielzeug-unter-20-euro` gewaehlt.

Die Seite hat von den vier Kandidaten die belastbarste Datenbasis: Die eindeutige Query
`spielzeug unter 20 euro` wurde im Gesamtzeitraum 39-mal ausschliesslich dieser URL
zugeordnet. Es gibt damit derzeit keinen sichtbaren Hinweis auf Kannibalisierung. Der
Pilot veraendert nur den SEO-Title. Meta-Description, H1, Aufbau, interne Links und
Affiliate-Elemente bleiben waehrend des Messfensters unveraendert.

Die anderen drei Seiten werden nicht gleichzeitig angepasst. Ihre Datenmenge ist zu
klein oder die sichtbaren Queries passen nicht eindeutig genug zur verlorenen guten
Position.

## Datenbasis und Grenzen

### Beobachtung

- GSC-Dokument: `docs/gsc-analyse-2026-07-28.md`, Zeitraum 29.04.-25.07.2026.
- GSC-Dokument: `docs/business-plan-relevanz-traffic-affiliate-2026-08-26.md`,
  28-Tage-Vergleich 29.06.-26.07.2026 gegen 27.07.-23.08.2026.
- Ergaenzende GSC-API-Abfragen am 26.08.2026 mit Seitenfilter und Dimension `query`:
  - Vergleichsfenster: 29.06.-26.07.2026 und 27.07.-23.08.2026.
  - Gesamtfenster: 29.04.-23.08.2026.
  - Kannibalisierungspruefung mit `query,page` im Gesamtfenster.
- Lokale Pruefung der vier HTML-Dateien: Title, Meta-Description, H1, Einstiegsbereich,
  Ueberschriftenfolge und interne Links.
- Inbound-Link-Pruefung ueber alle lokalen HTML-Dateien, jeweils ohne Selbstverlinkung.

### Einschraenkung

- Die Datenmengen sind sehr klein. GSC anonymisiert bei geringem Volumen einen Teil der
  Queries. Deshalb koennen Seitenwerte vorhanden sein, obwohl keine Query-Zeile
  ausgegeben wird.
- Eine Position von `0` bei null Impressionen ist keine reale Rankingposition, sondern
  bedeutet: keine messbare Auslieferung in diesem Zeitraum.
- Korrelation ist keine Ursache. Der Verlust kann durch Rankingvolatilitaet, Wettbewerb,
  Nachfrage, Crawlingzeitpunkt oder Seitenqualitaet entstanden sein.
- `spielzeug-unter-20-euro.html` enthaelt aktuell lokale, noch nicht vollstaendig
  veroeffentlichte Babywalz-/Banner-Aenderungen. Ein Title-Pilot waere vor deren Deploy,
  Recrawl und kurzer Stabilisierung nicht sauber interpretierbar.

## Vergleich der vier Seiten

| Seite | GSC-Gesamtfenster 29.04.-23.08. | Vorher 29.06.-26.07. | Aktuell 27.07.-23.08. | Entscheidung |
|---|---:|---:|---:|---|
| `spielzeug-unter-20-euro` | 1 Klick, 53 Impr., Pos. 18,2 | 1 Klick, 24 Impr., Pos. 22,6 | 0 Klicks, 2 Impr., Pos. 24,5 | Pilot nach Stabilisierung |
| `spielzeug-12-18-monate` | 2 Klicks, 16 Impr., Pos. 15,4 | 2 Klicks, 6 Impr., Pos. 16,7 | 0 Klicks, 0 Impr. | Unveraendert lassen |
| `motorikspielzeug-test` | 2 Klicks, 49 Impr., Pos. 41,4 | 1 Klick, 6 Impr., Pos. 10,3 | 0 Klicks, 0 Impr. | Erst Query-Signal abwarten |
| `duplo-vergleich` | 2 Klicks, 4 Impr., Pos. 9,2 | 2 Klicks, 2 Impr., Pos. 12,5 | 0 Klicks, 0 Impr. | Stichprobe zu klein |

## 1. Spielzeug unter 20 Euro

### Beobachtung

- Title: `Spielzeug unter 20 Euro: 8 Ideen nach Alter | Kleinkind-Welt`
- Meta-Description: `Spielzeug unter 20 Euro: 8 recherchierte Ideen fuer Babys und
  Kleinkinder - nach Alter sortiert, mit Preisregel, Grenzen und Sicherheitshinweisen.`
- H1: `Spielzeug unter 20 Euro: 8 Ideen fuer 0-3 Jahre`
- Die Hauptquery ist klar: `spielzeug unter 20 euro` erreichte im Gesamtfenster 39
  Impressionen bei Position 18,9 und wurde nur dieser URL zugeordnet.
- Im vorherigen 28-Tage-Fenster hatte die Query 17 sichtbare Impressionen bei Position
  22,1. Im aktuellen Fenster blieb eine sichtbare Impression bei Position 41.
- Title, Description und H1 nennen das Budget bereits explizit. Es fehlt keine grundlegende
  Keyword-Zuordnung.
- Der Einstieg beantwortet die Auswahl schnell: Kurzantwort, 20-Euro-Regel, Kaufbox und
  Schnellvergleich stehen vor der langen Erklaerung.
- Der Aufbau deckt Kaufentscheidung, acht Ideen, Alterszuordnung, Sicherheitskriterien,
  Negativauswahl und FAQs ab. Er ist umfangreich, aber suchintentionsnah.
- Es bestehen 21 interne Links aus 12 anderen HTML-Dateien. Relevante Quellen sind die
  Homepage, der Geschenk-Hub, Sommer-Hub, Geschenkartikel, Reisespielzeug und
  `was-wir-nicht-kaufen`.
- Mehrere Anker sind praezise, etwa `Spielzeug unter 20 Euro`, `Budget-Ratgeber unter 20
  Euro` und `Spielzeug-Ideen unter 20 Euro`.
- Die lokale Seite wurde nach dem letzten in GSC dokumentierten Crawl weiter veraendert.
  Der GSC-Bericht nennt als letzten Crawl den 03.08.2026.

### Hypothese

- Der Sichtbarkeitsverlust ist eher ein Ranking-/Autoritaets- oder Volatilitaetsproblem
  als ein grundlegender Intent- oder Internal-Link-Fehler.
- Der aktuelle Title ist korrekt, aber `Ideen nach Alter` ist als Nutzenversprechen
  generischer als die bereits im Inhalt belegte Positionierung `sinnvolle Ideen fuer
  Kleinkinder`.
- Weitere gleichzeitige Content-, CTA- oder Linkaenderungen wuerden die Wirkung eines
  Snippet-Tests unlesbar machen.

### Kannibalisierungspruefung

- Im Query-Page-Abgleich rankt fuer `spielzeug unter 20 euro` ausschliesslich diese URL.
- `geschenke-kleinkind` behaelt den Anlass-/Geschenk-Intent.
- Die Altersartikel behalten ihre jeweiligen Alterskorridore.
- Der Pilot darf deshalb weder `Geschenke unter 20 Euro` als Primaerbegriff setzen noch
  einen neuen Budget-Artikel erzeugen.

## 2. Spielzeug 12-18 Monate

### Beobachtung

- Title: `Spielzeug 12-18 Monate: Ideen & Auswahl | Kleinkind-Welt`
- Meta-Description und H1 nennen das Altersfenster eindeutig.
- Im vorherigen 28-Tage-Fenster entstanden zwei Klicks aus sechs Impressionen bei
  Position 16,7. Diese hohe CTR basiert auf einer sehr kleinen Stichprobe.
- Im aktuellen Fenster gab es keine Impression. Die geklickten Queries werden von GSC
  anonymisiert.
- Im Gesamtfenster sind 16 Impressionen bei Position 15,4 vorhanden. Als einzige offene
  Query erscheint `spielzeug ab 18 monate` mit einer Impression bei Position 29.
- Die Seite trennt die Grenze zu 18-24 Monaten in einem eigenen Abschnitt und verweist
  fuer den Wechsel direkt auf `spielzeug-18-24-monate`.
- Der Aufbau ist stark altersbezogen: Entwicklung, Auswahl, Empfehlungen, eigener
  Elternpraxis-Abschnitt, Vergleich und FAQ.
- Mit 42 Links aus 22 Dateien besitzt die Seite das staerkste interne Linknetz der vier
  Kandidaten. Alters-Hub, Homepage, angrenzende Altersseiten und Geschenkartikel setzen
  ueberwiegend eindeutige Anker.

### Hypothese

- Der Verlust ist bei sechs Impressionen eher geringe Nachfrage oder Volatilitaet als
  ein Snippetproblem. Die vorherige CTR liefert keinen Grund fuer einen Title-Test.
- Der Abschnitt `Spielzeug ab 18 Monate` kann einzelne Grenz-Queries anziehen, leitet die
  Nutzerintention aber korrekt an die naechste Altersseite weiter. Eine Ausweitung dieses
  Begriffs wuerde Kannibalisierung wahrscheinlicher machen.

### Entscheidung

Keine Aenderung. Erst handeln, wenn GSC wieder mindestens zehn nicht anonymisierte
Impressionen fuer eine klar benennbare 12-18-Monate-Query zeigt.

## 3. Motorikspielzeug

### Beobachtung

- Title: `Motorikspielzeug: 8 Empfehlungen | Kleinkind-Welt`
- Meta-Description und H1 ergaenzen `fuer Kleinkinder`, Altersangaben und Produkttypen.
- Im vorherigen 28-Tage-Fenster gab es einen Klick aus sechs Impressionen bei Position
  10,3; im aktuellen Fenster keine Impression.
- Das Gesamtfenster umfasst 49 Impressionen bei Position 41,4. Sichtbare Queries sind
  unter anderem `motorikwuerfel test` (4 Impr., Pos. 58,8), `beste motorikwuerfel`
  (2 Impr., Pos. 58,0) und `motorik spielgeraete` (5 Impr., Pos. 70,8).
- Der Slug enthaelt `test`, Title und H1 positionieren die Seite redaktionell korrekt als
  Empfehlungen, nicht als eigenen Produkttest.
- Der Aufbau ist fachlich breit: Feinmotorik, Grobmotorik, Altersstufen, Motorikwuerfel,
  Auswahl, Sicherheit, acht Produkte und FAQ.
- Auswahlmethode und Hauptempfehlung werden im oberen Seitenteil mehrfach erklaert. Das
  macht den Einstieg laenger, ist aber kein belegter Grund fuer den GSC-Verlust.
- Es bestehen 34 interne Links aus 22 Dateien. Viele sind Footer- oder Sammellinks;
  hochwertige Kontextlinks kommen unter anderem aus Altersartikeln, Geschenkartikeln,
  Materialvergleich und Sicherheitsratgeber.

### Hypothese

- Google testet die breite Seite auch fuer engere Motorikwuerfel- und Spielgeraete-Queries.
  Diese Unterintentionen sind mit den derzeitigen Daten zu klein fuer eine eigene URL.
- Eine neue Seite `motorikwuerfel-test` wuerde aktuell eher Kannibalisierung und duennen
  Content erzeugen als zusaetzliche Nachfrage abdecken.
- Der anonymisierte Klick auf guter Position kann zu einer anderen Query gehoert haben.
  Ein Title-Umbau auf Basis der sichtbaren Motorikwuerfel-Queries waere daher spekulativ.

### Entscheidung

Keine Aenderung und keine neue Motorikwuerfel-Seite. Bei mehr Daten soll zuerst geprueft
werden, ob eine Query-Familie mindestens 20 Impressionen in 28 Tagen auf derselben URL
erreicht.

## 4. DUPLO-Vergleich

### Beobachtung

- Title: `DUPLO Vergleich: Alternativen im Check | Kleinkind-Welt`
- Meta-Description nennt DUPLO, Mega Bloks, Magnet- und Holzbausteine.
- H1: `DUPLO vs. andere Bausteine - Welches Bausystem gewinnt?`
- Im Gesamtfenster gab es zwei Klicks aus vier Impressionen bei Position 9,2. Im
  vorherigen 28-Tage-Fenster waren es zwei Klicks aus zwei Impressionen bei Position
  12,5; danach keine Impression.
- GSC gibt wegen des geringen Volumens keine Query-Zeile aus.
- Der Aufbau ist klar vergleichend: Kurzantwort, Kaufbox, Vergleichstabelle und einzelne
  Systeme. Die Gewinner-Sprache ist staerker als die sonst konservative redaktionelle
  Positionierung, erklaert aber nicht den Verlust von nur zwei Impressionen.
- Es bestehen 15 interne Links aus 12 Dateien. Besonders passend sind Links aus den
  Altersseiten 18-24 Monate, 2 Jahre und 3 Jahre sowie aus den Geschenkartikeln fuer zwei
  und drei Jahre.

### Hypothese

- Die fruehere gute Position kann aus einer einzelnen Longtail-Query stammen. Ohne offene
  Query ist weder ein Title- noch ein Content-Test kontrollierbar.
- Eine Ausweitung auf `DUPLO ab 2 Jahre` wuerde mit den Altersartikeln konkurrieren. Die
  Seite sollte den Vergleichsintent behalten.

### Entscheidung

Keine Aenderung. Erst ab einer sichtbaren Query-Familie oder mindestens zehn Impressionen
in einem 28-Tage-Fenster erneut bewerten.

## Kontrollierter Pilot

### Pilot-URL

`https://kleinkind-welt.de/artikel/spielzeug-unter-20-euro`

### Eine Aenderung

Nur den SEO-Title austauschen:

- Bestehend: `Spielzeug unter 20 Euro: 8 Ideen nach Alter | Kleinkind-Welt`
- Vorschlag: `Spielzeug unter 20 Euro: 8 sinnvolle Ideen fuer Kleinkinder`

Nicht veraendern:

- Meta-Description
- H1 und Lead
- Artikelstruktur und Text
- interne Links und Ankertexte
- Kaufbox, Produktkarten, Preise, CTA-Reihenfolge und Banner
- Canonical und URL

### Begruendung

Der Vorschlag behaelt die exakte Hauptquery am Anfang, macht die Zielgruppe explizit und
uebersetzt die bestehende redaktionelle Positionierung in ein konkreteres
Nutzenversprechen. Er eroeffnet keine neue Suchintention und bleibt klar vom Geschenk-Hub
und den Altersseiten getrennt.

### Startbedingungen

1. Die bereits laufenden Babywalz-, Preis- und Layout-Aenderungen muessen veroeffentlicht
   und danach eingefroren sein.
2. GSC URL Inspection muss einen Crawl nach diesem Deploy ausweisen.
3. Danach 14 Tage ohne weitere Aenderung an der Seite als Stabilisierung messen.
4. Erst dann den vorgeschlagenen Title als einzige Pilot-Aenderung veroeffentlichen und
   erneut einen Recrawl anstossen.

### Messplan

- Primaer: Impressionen und durchschnittliche Position der exakten Query
  `spielzeug unter 20 euro`.
- Sekundaer: SERP-CTR der Pilot-URL sowie Impressionen der Query-Familie mit `unter 20`.
- Guardrail: Es darf keine zweite URL fuer die exakte Hauptquery in `query,page`
  erscheinen.
- Messpunkte: 14 und 28 Tage nach dem ersten bestaetigten Crawl des neuen Titles.
- Kontextkontrolle: Die drei nicht veraenderten Verliererseiten und die siteweiten
  Impressionen werden nur genutzt, um allgemeine Nachfrage- oder Rankingbewegungen zu
  erkennen. Sie sind keine statistische Kontrollgruppe.

### Erfolg und Abbruch

Der Pilot gilt als positives Signal, wenn nach 28 Tagen:

- mindestens zehn Impressionen fuer die exakte Hauptquery vorliegen,
- die durchschnittliche Position wieder bei 20 oder besser liegt,
- und keine zweite URL fuer dieselbe Query sichtbar wird.

Der Pilot ist nicht bestaetigt, wenn die Stichprobe unter zehn Impressionen bleibt. Er
gilt als negativ, wenn bei mindestens zehn Impressionen die Position schlechter als 25
bleibt oder eine zweite URL fuer die Hauptquery auftaucht. In diesem Fall wird der alte
Title wiederhergestellt; es folgt keine automatische Content-Ausweitung.

## Nicht Teil dieses Piloten

- Keine neue Budget-, Motorikwuerfel-, DUPLO- oder Altersseite.
- Keine gleichzeitige Meta-, H1-, FAQ- oder Internal-Link-Aenderung.
- Keine Aussage, dass der Title allein verlorene Autoritaet zurueckholen kann.
- Kein Hochskalieren auf weitere Seiten ohne zwei Messpunkte nach 14 und 28 Tagen.
