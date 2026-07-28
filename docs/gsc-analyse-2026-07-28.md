# GSC-Analyse, 28.07.2026

Datenquelle: Search Console API, Property `sc-domain:kleinkind-welt.de`, Service Account
`kleinkind-seo@kleinkind-welt-seo.iam.gserviceaccount.com`. Zeitraum 29.04.–25.07.2026.

---

## 1. Der Gesamtbefund

| Kennzahl | Wert |
|---|---|
| Klicks (90 Tage) | **7** |
| Impressionen (90 Tage) | **448** |
| CTR | 1,56 % |
| Suchanfragen mit Impressionen | 85 |
| Seiten mit Impressionen | 24 von 37 |

**Die Seite ist indexiert und wird ausgeliefert.** Es ist also kein Indexierungsproblem im
allgemeinen Sinn — aber es sind zwei getrennte Probleme mit unterschiedlicher Ursache.

---

## 2. Problem A: Der Spielzeug-Bereich rankt zu tief

Fast alle Suchanfragen liegen auf **Position 50 bis 90**, also Seite 5 bis 9. Dort gibt es
keine Klicks, egal wie gut der Inhalt ist.

Beispiele mit den meisten Impressionen:

| Impr. | Position | Suchanfrage |
|---|---|---|
| 38 | 18,3 | spielzeug unter 20 euro |
| 26 | 71,2 | geschenke für kleinkinder |
| 20 | 68,5 | kleinkinder geschenke |
| 20 | 73,2 | kleinkinder geschenkideen |
| 19 | 75,7 | geschenkideen für kleinkinder |
| 19 | 72,3 | kleinkindspielzeug |
| 18 | 68,4 | geschenk kleinkind |

Das ist das erwartbare Bild einer zwei Monate alten Domain ohne Backlinks auf
kommerziellen Head-Terms. Hier hilft kein technischer Eingriff, sondern nur Autorität und
weniger umkämpfte Suchanfragen.

### Die vier Ausnahmen — und sie sind wertvoll

Vier Anfragen liegen bereits auf oder nahe Seite 1 bis 2:

| Position | Impr. | Suchanfrage | Eigene Seite dafür? |
|---|---|---|---|
| **10,8** | 5 | lauflerngitter | **nein** — nur Erwähnung in `spielzeug-6-12-monate` |
| 17,9 | 38 | spielzeug unter 20 euro | ja, `spielzeug-unter-20-euro` |
| **18,3** | 3 | stapelbecher ab welchem alter | **nein** — Erwähnung in vier Artikeln |
| 21,5 | 2 | günstiges spielzeug für kleinkinder | nur indirekt |

`lauflerngitter` rankt auf Position 10,8, **ohne dass es dafür eine Seite gibt** — nur eine
Nebenerwähnung. Dasselbe bei `stapelbecher ab welchem alter` auf 18,3. Das ist die
billigste Traffic-Chance im ganzen Datensatz: Wo eine Erwähnung Seite 1 erreicht, sollte
eine eigene, gute Seite deutlich weiter kommen.

Ebenfalls auffällig: `motorikwürfel test` (58,8) und `beste motorikwürfel` (58,0) laufen auf
`motorikspielzeug-test` — ein Sammelartikel, der gegen produktspezifische Anfragen antritt.

---

## 3. Problem B: Der Kinderwagen-Bereich existiert für Google nicht

**Null Kinderwagen-Anfragen in 90 Tagen.** Keine einzige der 85 Suchanfragen enthält
„kinderwagen", „buggy" oder „kofferraum".

Die URL-Inspection-API liefert die Erklärung:

| URL | Verdict | Coverage |
|---|---|---|
| `/kinderwagen` | NEUTRAL | **URL is unknown to Google** |
| `/artikel/kinderwagen-kofferraum` | NEUTRAL | **URL is unknown to Google** |
| `/artikel/kinderwagen-gesamtpreis` | NEUTRAL | **URL is unknown to Google** |
| `/artikel/kinderwagen-arten` | NEUTRAL | **URL is unknown to Google** |
| `/artikel/spielzeug-2-jahre` | PASS | indexiert |
| `/artikel/spielzeug-unter-20-euro` | PASS | indexiert |

Nicht „gecrawlt, aber nicht indexiert". Nicht „entdeckt". **Unbekannt.**
`lastCrawlTime` ist null, `referringUrls` leer.

### Die Ursache

Der Sitemap-Status in der GSC am 28.07.2026 vor dem Eingriff:

```
zuletzt eingereicht: 2026-07-14T20:38:45Z
zuletzt gelesen:     2026-07-14T20:38:47Z
URLs laut Google:    30
```

Google hat die Sitemap **genau einmal** gelesen — zwei Sekunden nach der Einreichung am
14. Juli — und danach 14 Tage nicht mehr. Die Datei enthält inzwischen 37 URLs.

Der Abgleich mit der Git-Historie zeigt, welche sieben URLs Google in seinem Stand nie
hatte:

```
/kinderwagen
/artikel/kinderwagen-arten
/artikel/kinderwagen-gebraucht-kaufen
/artikel/kinderwagen-gesamtpreis
/artikel/kinderwagen-kofferraum
/artikel/kinderwagen-stadt-oder-land
/artikel/spielzeug-rotieren-kleinkind
```

Das sind exakt die Seiten mit null Impressionen. Der Commit „Expand site positioning to
strollers" ist vom 23. Juli — neun Tage **nach** der letzten Sitemap-Lesung.

Die interne Verlinkung hätte theoretisch reichen sollen: `/kinderwagen` steht in der
Hauptnavigation jeder Seite. Bei einer jungen Domain mit geringer Autorität crawlt Google
aber sparsam und priorisiert, was es schon kennt.

### Eingriff am 28.07.2026

Die Sitemap wurde über die offizielle Sitemaps-API neu eingereicht
(`lastSubmitted` jetzt 2026-07-28T12:10:42Z). Werkzeug dafür:
`tools/gsc-sitemap-submit.py`, mit `--status` auch nur zum Nachsehen.

Die Indexing API wurde **nicht** benutzt: Sie ist laut Google ausschließlich für
JobPosting- und Livestream-Inhalte zugelassen.

**In ein bis zwei Tagen prüfen**, ob `lastDownloaded` sich bewegt hat und die URL-Zahl auf
37 steht. Falls nicht, bleibt der manuelle Weg über „URL-Prüfung → Indexierung beantragen"
in der GSC-Oberfläche, für den `/kinderwagen` der wichtigste Einstiegspunkt ist.

### Warum daraus eine Frist folgt

Google wird die fünf Kinderwagen-Artikel jetzt **zum ersten Mal** bewerten. Ein Erstkontakt
mit einer 400-Wörter-Seite ist ein schlechter Start, der sich später mühsam korrigieren
lässt. Deshalb wurden am 28.07.2026 zwei der fünf ausgebaut:

- `kinderwagen-kofferraum`: 446 → 1844 Wörter, zwei Datentabellen
- `kinderwagen-gesamtpreis`: 391 → 1081 Wörter, Preistabelle mit Lieferumfängen

Offen und dringlich: `kinderwagen-arten` (507), `kinderwagen-gebraucht-kaufen` (428),
`kinderwagen-stadt-oder-land` (464).

---

## 4. Was die Anfragen über die Personas sagen

Das ist der unangenehmste Befund, und er betrifft die Navigator-Strategie direkt.

**Die tatsächliche Nachfrage kommt von Geschenkekäufern, nicht von Kinderwagen-Suchenden.**
Über 130 der 448 Impressionen entfallen auf Geschenk-Anfragen: „geschenke für
kleinkinder", „kleinkinder geschenkideen", „geschenk kleinkind", „sinnvolle geschenke zur
geburt", „was kann man zur geburt schenken", „was schenkt man zur geburt". Die meistgesehene
Seite ist `/geschenke-kleinkind` mit 113 Impressionen.

Diese Personas sind häufig **nicht die Eltern**, sondern Großeltern, Freunde, Kolleginnen.
Sie suchen kurzfristig, mit kleinem Budget und ohne Detailwissen.

Die sieben Navigator-Personas beschreiben dagegen ausnahmslos **Eltern, die für sich selbst
einen Kinderwagen auswählen** — mit Kofferraummaßen, ÖPNV-Alltag, Budgetgrenzen und
Prioritäten. Ein Kinderwagen ist außerdem kein typisches Geschenk.

Das heißt nicht, dass der Navigator falsch ist. Es heißt: **Sein Publikum lässt sich nicht
vom bestehenden Traffic erben, es muss eigenständig aufgebaut werden.** Die Annahme aus der
Produktstrategie, man könne vorhandene Autorität in den Kinderwagen-Bereich lenken, ist
damit widerlegt — die vorhandene Autorität sitzt in einem anderen Bedürfnis.

Zwei Konsequenzen:

1. **Kurzfristiger Traffic und das strategische Produkt liegen in verschiedenen
   Themenfeldern.** Wer schnell Besucher will, arbeitet im Spielzeug- und Geschenkebereich
   (`lauflerngitter`, `stapelbecher`, `spielzeug unter 20 euro`). Wer den Navigator
   etablieren will, baut ein Cluster von Grund auf. Beides ist legitim, aber es ist nicht
   dieselbe Arbeit, und man sollte nicht glauben, das eine erledige das andere.
2. **Die Beta-Durchläufe für das Freigabe-Gate kommen nicht aus dem bestehenden Traffic.**
   Geschenkekäufer füllen keinen Kinderwagen-Finder aus. Die 50 Durchläufe müssen aus
   Elternforen, Gruppen oder bezahlter Reichweite kommen.

---

## 5. Weitere Beobachtungen

- `/artikel/spielzeug-3-jahre.html` erscheint mit einer Impression separat neben der
  Clean-URL. Google kennt also noch die `.html`-Variante. Die 301 löst das mit der Zeit
  selbst auf; kein Handlungsbedarf.
- `/bewertungsmethode` (Pos. 3,0), `/kaufhilfen` (Pos. 2,0) und `/ueber-uns` (Pos. 4,0)
  ranken sehr gut, allerdings bei je zwei Impressionen — das sind navigationsartige
  Anfragen und kein Nachfragesignal.
- `/artikel/spielzeug-2-jahre` hat 2353 Wörter und **null** Impressionen. Länge allein
  löst das Wettbewerbsproblem also nicht.
- Die PageSpeed- und CrUX-APIs sind nicht nutzbar, weil kein `GOOGLE_API_KEY` gesetzt ist.
  GA4 fehlt eine `ga4_property_id`. Beides in `~/.config/claude-seo/google-api.json`
  nachtragbar und würde Ladezeit-Felddaten und Verhaltensdaten erschließen.

---

## 6. Nächste Messpunkte

| Wann | Was prüfen | Womit |
|---|---|---|
| in 1–2 Tagen | `lastDownloaded` bewegt, URL-Zahl auf 37 | `python3 tools/gsc-sitemap-submit.py --status` |
| in 1–2 Wochen | Kinderwagen-URLs von NEUTRAL auf PASS | `gsc_inspect.py --batch` |
| in 4 Wochen | erste Kinderwagen-Impressionen | `gsc_query.py --dimensions query` |
| laufend | Position von `lauflerngitter` und `spielzeug unter 20 euro` | dito |

Erfolgsmaß für die nächsten Wochen sind **Impressionen im Kinderwagen-Cluster**, nicht
Klicks. Impressionen zeigen, dass Google die Seiten überhaupt als Antwort auf etwas
versteht. Klicks kommen erst mit besseren Positionen.
