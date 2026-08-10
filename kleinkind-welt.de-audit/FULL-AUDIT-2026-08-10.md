# SEO-Audit kleinkind-welt.de · 10.08.2026

Folge-Audit zu `FULL-AUDIT-2026-07-29.md` (Score 82). Zwölf Tage Abstand.
Geschäftstyp: redaktionelle Affiliate-Kaufberatung, 37 URLs, deutschsprachig,
Domain seit Ende Mai 2026 live.

**Health Score: 88 von 100** (vorher 82)

*Korrigiert von zunächst 86: Die Bildkategorie war zu hart bewertet, weil ich
übersehen hatte, dass die toten Bilder ohnehin ausgeblendet waren.*

| Kategorie | Gewicht | 29.07. | 10.08. |
|---|---|---|---|
| Technical SEO | 22 % | 88 | 87 |
| Content Quality | 23 % | 72 | **84** |
| On-Page SEO | 20 % | 82 | **92** |
| Schema | 10 % | 92 | **96** |
| Performance | 10 % | 72 | **84** |
| AI Search Readiness | 10 % | 90 | 92 |
| Images | 5 % | 82 | **78** |

Alle sieben Kategorien liegen über 78. Die Bildkategorie verliert leicht, weil
26 Einbindungen auf einen abgeschalteten Host zeigten — inzwischen entfernt.

---

## 26 tote Produktbilder — Einstufung nachträglich korrigiert

**Korrektur vom 10.08.2026, nach Rückfrage:** Ich hatte das als kritisch
eingestuft und geschrieben, die Empfehlungen verlören an Glaubwürdigkeit. **Das
war falsch.** Alle 26 Bilder liegen in `.produkt-img-link`, und dieser Container
steht site-weit auf `display: none` — mit dem Kommentar „Temporär ausgeblendet,
Platzhalter bis echte Fotos da sind". Kein Besucher hat diese Bilder je gesehen.

Richtige Einstufung: **niedrig**. Es war totes Markup, das 26 Anfragen an einen
nicht mehr existierenden Host auslöste — messbar in der Konsole, unsichtbar auf
der Seite.

Was dagegen wirklich sichtbar kaputt war: das Kidpop-Bild im Hero-Teaser und in
der Kaufbox von `geschenke-1-jahr`. Diese beiden lagen **nicht** in dem
ausgeblendeten Container. Genau die hat Boris gemeldet, und sie sind am 05.08.
entfernt worden.

**Erledigt am 10.08.:** Alle 26 Anker entfernt. Site-weit null Verweise auf
`amazon-adsystem.com/widgets` mehr.

Amazon hat die alten Bild-Widget-Hosts abgeschaltet. Belegt durch vergleichende
DNS-Auflösung:

| Host | Auflösung |
|---|---|
| `amazon.de` | löst auf |
| `m.media-amazon.com` | löst auf |
| `images-eu.ssl-images-amazon.com` | löst auf |
| `amazon-adsystem.com` | löst auf |
| **`ws-eu.amazon-adsystem.com`** | **ENOTFOUND** |
| **`ws-na.amazon-adsystem.com`** | **ENOTFOUND** |

Da die übergeordnete Domain auflöst, ist das keine Netzsperre auf meiner Seite,
sondern das Fehlen genau dieser Subdomains. Deckungsgleich mit der Beobachtung
von Boris, dass ein solches Bild bei ihm nicht angezeigt wurde.

**Umfang: 26 Einbindungen, 24 ASINs, 6 Seiten.**

| Seite | tote Bilder |
|---|---|
| `artikel/outdoor-spielzeug-kleinkind` | 6 |
| `artikel/spielzeug-2-jahre` | 5 |
| `artikel/spielzeug-6-12-monate` | 5 |
| `artikel/spielzeug-12-18-monate` | 4 |
| `artikel/geschenke-1-jahr` | 3 |
| `artikel/montessori-spielzeug-kleinkind` | 3 |

**Warum es trotzdem weg musste.** Jede Einbindung löste einen DNS-Fehlschlag
aus, sechs Seiten trugen zwischen drei und sechs davon. Kein Nutzerschaden, aber
auch kein Nutzen.

**Der Weg zurück ist unbequem.** Amazon hat den einfachen Bildweg für
Partner geschlossen: Die SiteStripe-Bildlinks wurden 2024 eingeschränkt, und die
`ws-*`-Hosts sind jetzt weg. Bleibt die Product Advertising API 5.0, die
qualifizierende Verkäufe voraussetzt — bei sieben Klicks in 90 Tagen keine
realistische Option. Oder eigene Fotos.

**Für die Zukunft:** Sollen dort echte Produktbilder erscheinen, bleiben nur
eigene Fotos oder die Product Advertising API. Keine KI-Bilder — ein erzeugtes
Bild eines konkreten kaufbaren Produkts führt in die Irre, auch mit Kennzeichnung.

---

## Wirkungsmessung: hat die Umsetzung vom 29.07. gewirkt?

### Ja, bei der Sichtbarkeit

| Kennzahl (90 Tage) | 29.07. | 10.08. |
|---|---|---|
| Impressionen | 448 | **588** (+31 %) |
| Klicks | 7 | 7 |
| Anfragen mit Impressionen | 58 | **109** (+88 %) |

Die Zahl der Anfragen, für die die Seite überhaupt erscheint, hat sich nahezu
verdoppelt. Das ist die erwartbare erste Reaktion auf mehr und besseren Inhalt.

### Nein, bei den Klicks — und der Grund ist eindeutig

Von 109 Anfragen liegen fast alle jenseits Position 50. Die Geschenk-Anfragen,
die mit **252 von 459 Impressionen (55 %)** die Nachfrage tragen, stehen
zwischen Position 63 und 80:

| Anfrage | Impressionen | Position |
|---|---|---|
| geschenke für kleinkinder | 33 | 68,5 |
| geschenkideen für kleinkinder | 27 | 74,5 |
| geschenk kleinkind | 26 | 66,9 |
| kleinkinder geschenke | 26 | 65,8 |
| kleinkinder geschenkideen | 23 | 72,4 |

Auf Seite 7 bis 8 gibt es keine Klicks. Das ist keine On-Page-Frage mehr.

### Der Beweis, dass es an der Autorität liegt

`artikel/montessori-spielzeug-kleinkind` ist der klarste Fall, den dieser Audit
liefert:

| Merkmal | Wert |
|---|---|
| Anfrage | „montessori spielzeug 1 jahr", 25 Impressionen |
| Title | „Montessori Spielzeug ab 1 Jahr: Top 5" |
| H1 | „Montessori Spielzeug ab 1 Jahr: was wirklich sinnvoll ist" |
| Umfang | 1942 Wörter, 8 FAQ |
| Interne Eingangslinks | 9 |
| **Position** | **60,5** |

Title, H1, Umfang, Struktur und interne Verlinkung sind auf die Anfrage
ausgerichtet. Die Seite steht auf Position 60. **Weitere On-Page-Arbeit an dieser
Seite wird daran nichts ändern.** Was fehlt, ist externe Autorität.

---

## Indexierung: Bewegung, aber der Cluster-Eingang fehlt weiter

| Zustand | Anzahl |
|---|---|
| Submitted and indexed | **30** |
| Discovered – currently not indexed | 6 |
| URL is unknown to Google | 1 |

**Discovered, aber nicht indexiert:** die fünf Kinderwagen-Artikel und
`spielzeug-rotieren-kleinkind`. Gegenüber dem Voraudit ist das Fortschritt —
Google kennt sie jetzt — aber Indexierung ist es nicht.

**`/kinderwagen` ist Google unverändert unbekannt.** Und das, obwohl die Seite:

- HTTP 200 liefert (23.510 Bytes)
- in der Sitemap steht
- `index, follow` trägt
- ein korrektes selbstreferenzielles Canonical hat
- von robots.txt nicht ausgeschlossen ist
- acht redaktionelle Eingangslinks besitzt
- am 29.07. von 301 auf 1149 Wörter ausgebaut wurde

Technisch ist an dieser Seite nichts zu reparieren. Dass Google sie nach zwölf
Tagen nicht einmal kennt, ist ein Autoritätssignal, kein Fehler.

**Folge:** Der gesamte Kinderwagen-Cluster erzeugt in 90 Tagen **null
Impressionen** — nicht eine einzige Anfrage mit „kinderwagen". Fünf Artikel, ein
ausgebauter Hub, ein Datensatz mit 20 Modellen, dichtere Verlinkung: bislang ohne
jede Sichtbarkeit.

**Die Sitemap wurde seit dem 29.07. nicht erneut gelesen** (letzter Lesezugriff
2026-07-29T11:10:44Z). Erneutes Einreichen bringt hier nichts mehr; das Signal
ist angekommen und wird nicht priorisiert.

---

## Neue Chance, die der Voraudit übersehen hat: Montessori

Der Voraudit hat diesen Cluster nicht erwähnt. Er ist inzwischen der zweitgrößte:

| Anfrage | Impressionen | Position |
|---|---|---|
| montessori spielzeug 1 jahr | 25 | 60,5 |
| montessori 1 jahr | 10 | 83,9 |
| montessori ab 1 jahr | 5 | 62,4 |
| **montessori puzzle 1 jahr** | 4 | **35,2** |
| montessori spielzeug ab 1 jahr | 3 | 58,0 |
| montessori spielzeug 1 jahre | 2 | 56,0 |

12 Anfragen, 73 Impressionen auf der Seite. `montessori puzzle 1 jahr` auf 35,2
ist die beste Position im Cluster und deutet auf eine Unterseite hin, die es
nicht gibt.

---

## Korrektur am Voraudit

**Der behauptete Positionsverlust bei „spielzeug unter 20 euro" war Rauschen.**
Der Voraudit meldete einen Rutsch von 18,3 auf 23,6 und empfahl eine Ursachen­
suche. Im 90-Tage-Fenster steht die Anfrage jetzt bei **18,9** mit 39
Impressionen — praktisch unverändert zum Ausgangswert. Der Unterschied kam vom
kürzeren Messfenster, nicht von der Seite. Die empfohlene Untersuchung entfällt.

Die Seite ist mit 53 Impressionen, **1 Klick** und Position 18,2 nach wie vor
die beste kommerzielle Position der Domain.

---

## Was die Umsetzung nachweisbar verbessert hat

Alles hier gemessen, nicht angenommen:

| Prüfung | 29.07. | 10.08. |
|---|---|---|
| JSON-LD-Blöcke ungültig | 0 | 0 (38 geprüft) |
| FAQ-Schema weicht vom sichtbaren Text ab | 26 von 145 | **0 von 157** |
| Überschriftensprünge | 34 Seiten | **0** |
| Seiten mit falscher h1-Anzahl | – | 0 |
| Titles über 60 Zeichen | – | 0 |
| Seiten ohne Meta-Description | – | 0 |
| Navigator-CLS | 0,455 | 0 |
| Dünne Hubs (< 500 Wörter) | 3 | **0** |
| Hub-Umfang | 301/415/422 | 1149/1215/1589 |

Zusätzlich seit dem Voraudit: KI-Bildkennzeichnung nach Artikel 50 der
KI-Verordnung an 62 Einbindungen, Vorschaugrafik ohne fotorealistischen Inhalt,
Begriffsklärung Laufgitter/Lauflernwagen/Gehfrei.

---

## Wirkung der KI-Badges: ein Regress, gefunden und behoben

Die 62 sichtbaren Hinweise waren nötig, hatten aber eine Nebenwirkung:

**Der Hauptinhalt der Startseite begann mit dem Wort „KI-Bild".** Der Hinweis
stand im Markup zwischen Bild und Textblock, also vor der H1. Für
Screenreader war „KI-Bild" das erste Wort im Hauptinhalt, und für Googles
Textextraktion der Anfang der Seite.

Behoben: Der Hinweis steht jetzt hinter dem Textblock. Da er absolut positioniert
ist, sieht man keinen Unterschied. Der Hauptinhalt beginnt wieder mit
„Kaufhilfen für Babys und Kleinkinder".

Auf den 21 Artikelseiten steht der Hinweis zwischen Breadcrumb und Artikel-Meta.
Das ist als Bildbeschriftung in Leserichtung unbedenklich und bleibt so.

Die Prüfregel im CI war ebenfalls zu eng („Hinweis innerhalb von 200 Zeichen
nach dem Bild") und hat die Korrektur zunächst blockiert. Sie ist jetzt eine
Zählregel: mindestens so viele Hinweise wie KI-Bilder je Seite. Gegenprobe mit
entferntem Hinweis bestanden.

Textanteil der Hinweise: 1,2 % der Wörter auf der Startseite, 0,4 % auf dem
Geschenke-Hub. Kein Verdünnungsproblem.

---

## Persona-Abdeckung der sieben Navigator-Segmente

| Segment | Begriffe gefunden | gefunden |
|---|---|---|
| rural_rough_routes | 5/5 | unebene Wege, Feldweg, Waldweg, Kopfsteinpflaster, Schotter |
| small_car_trunk | 4/4 | kleines Auto, Kofferraum, Faltmaß, Ladeboden |
| travel_light | 3/3 | Reisebuggy, Handgepäck, Flugzeug |
| first_combo_from_birth | 3/3 | ab Geburt, Babywanne, Kombi-Kinderwagen |
| twins_siblings | 2/3 | Zwilling, Geschwisterwagen |
| tight_access_transit | 2/5 | enge Tür, ÖPNV |
| **low_budget_city_walkup** | **1/7** | nur „kleine Wohnung" |

`low_budget_city_walkup` hat sich von 0/7 auf 1/7 verbessert — durch den neuen
Abschnitt „Spielzeug in einer kleinen Wohnung" auf dem Spielzeug-Hub. **„ohne
Aufzug" kommt site-weit weiterhin nicht vor.** Das bleibt der größte
Abdeckungsmangel, jetzt aber mit der Einschränkung: Solange der Cluster nicht
indexiert ist, ändert eine weitere Seite dort nichts an der Sichtbarkeit.

---

## Seiten ohne jede Sichtbarkeit

**12 der 37 URLs haben in 90 Tagen keine einzige Impression.** Darunter der
gesamte Kinderwagen-Bereich und `spielzeug-rotieren-kleinkind`.

Die 25 Seiten mit Impressionen, oben:

| Seite | Impr. | Klicks | Position |
|---|---|---|---|
| /geschenke-kleinkind | 193 | 0 | 70,8 |
| /artikel/montessori-spielzeug-kleinkind | 73 | 0 | 51,4 |
| /artikel/spielzeug-unter-20-euro | 53 | 1 | 18,2 |
| /artikel/motorikspielzeug-test | 49 | 2 | 41,4 |
| /artikel/geschenke-zur-geburt | 44 | 0 | 73,3 |
| / | 40 | 0 | 60,9 |
| /artikel/spielzeug-12-18-monate | 16 | **2** | **15,4** |

Bemerkenswert: `spielzeug-12-18-monate` hat mit Position 15,4 die beste Position
und mit 2 von 7 Klicks die beste Ausbeute — bei nur 16 Impressionen. Dort wirkt
die Passung, es fehlt die Nachfrage. Umgekehrt beim Geschenke-Hub: 193
Impressionen, Position 70,8, null Klicks.

---

## Grenzen dieses Audits

- **Keine Felddaten zu Core Web Vitals.** Kein `GOOGLE_API_KEY`, also kein
  PageSpeed und kein CrUX. Der CLS-Wert von 0 ist eine Labormessung.
- **Keine Backlink-Daten.** Keine Moz- oder Bing-Zugangsdaten konfiguriert. Die
  Autoritätsdiagnose stützt sich auf das Muster „gut optimierte Seite auf
  Position 60", nicht auf gemessene verweisende Domains.
- **Die Bildabschaltung ist per DNS belegt, nicht per HTTP-Antwort.** Dass die
  `ws-*`-Hosts nicht auflösen, während die Elterndomain auflöst, ist ein starker
  Beleg. Eine 404-Antwort von Amazon wäre der endgültige.
- **Zwölf Tage sind für Ranking-Wirkung kurz.** Impressionen reagieren schnell,
  Positionen langsam. Der Ausbau vom 29.07. ist bei den Positionen noch nicht
  bewertbar.
- **Inline durchgeführt**, ohne Fachagenten. Beim Voraudit sind acht von zehn vor
  dem Schreiben abgebrochen; die hier tragenden Fragen sind direkt messbar.
