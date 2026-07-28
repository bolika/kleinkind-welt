# Systematische Fehlmatch-Analyse Kinderwagen-Navigator, 28.07.2026

Anlass: Zwei Persona-Gates der SEO-Launch-Checkliste sind offen. `low_budget_city_walkup`
und `compact_car_fixed_budget` liefern je nur einen veröffentlichungsfähigen Match, das
Indexierungs-Gate verlangt zwei.

Untersucht wurde, **warum**. Ergebnis: Die Ursache ist keine zu kleine Katalogbasis und
keine fehlende Awin-Freigabe, sondern eine inkonsistent vergebene redaktionelle
Bewertung im Signal `foldingConvenience`.

## Was ausgeschlossen wurde

**Katalogbreite ist nicht die Ursache.** Im Budget der beiden Profile liegen ausreichend
Modelle: neun Modelle unter 600 €, zehn unter 800 €. Alle Preisangaben waren am
Prüftag frisch, kein `freshUntil` war abgelaufen.

**Der Core-Context-Score-Cap ist nicht bindend.** Die betroffenen Modelle erreichen bei
`car_transport_fit` Werte um 0,58. Damit greift laut `coreContextScoreCaps` die Stufe
`strongPartial` (89), nicht `none` (64). Dass mehrere Modelle exakt 64 Punkte erreichen,
ist ein Zufall und nicht das Ergebnis einer Deckelung.

**Awin ist nicht auf dem kritischen Pfad.** Die Angebotsliste ist leer, das Matching läuft
ohne Händlerangebote vollständig durch. Angebote verändern laut Policy weder Match-Score
noch Reihenfolge.

## Die tatsächliche Ursache

Der Rohscore der Budget-Modelle liegt bei 55 bis 64 und damit unter
`minimumScoreToRecommend` (75). Ausschlaggebend ist das Signal `foldingConvenience`,
das mit `priorityMultiplier` 2,5 gewichtet ist, sobald `easy_folding` als Priorität
gewählt wird — was bei beiden Profilen der Fall ist.

Dieses Signal ist redaktionell gesetzt, nicht aus Fakten berechnet. Die Vergabe ist
nicht konsistent:

Vollständige Gegenüberstellung aller Modelle bis 700 € (Preis = `requiredConfigurationPriceEur`).
„ja" heißt: Fakt dokumentiert und nicht `unknown`/`stale`.

| Modell | `oneHandFold` | `selfStandingFold` | `foldWithSeat` | Faltmaß (L×B×H cm) | `foldingConvenience` |
|---|---|---|---|---|---|
| my-junior-liyo | ? | ? | ja | 54 × 45 × 23 | **1,0** |
| kinderkraft-yoxi-2in1 | ? | ? | ja | 73 × 59 × 31 | 0,5 |
| kinderkraft-esme-2in1 | ? | ? | ja | 72 × 60 × 40 | 0,5 |
| kinderkraft-prime-3-2in1 | ? | ? | ja | 87 × 59 × 49 | 0,5 |
| my-junior-noax | ? | ? | ja | 73 × 58,5 × 31 | 0,5 |
| kinderkraft-nea-2 | ? | **ja** | ja | 67 × 60 × 40 | 0,5 |
| joie-versatrax-2024 | ? | **ja** | ja | 86 × 65,5 × 36 | 0,5 |
| abc-design-samba-2 | **ja** | ? | ja | 74 × 60 × 42,5 | 0,5 |
| cybex-balios-s-lux-current | **ja** | ? | ? | 45 × 60 × 77,5 | 0,5 |
| my-junior-miyo2 | ? | ? | ? | 89 × 60 × 28 | 0,5 |

Daraus folgen zwei Feststellungen, die nicht mehr Interpretation sind:

**Erstens: identische Evidenz, doppelter Wert.** `my-junior-liyo`, `kinderkraft-yoxi-2in1`,
`kinderkraft-esme-2in1`, `kinderkraft-prime-3-2in1` und `my-junior-noax` haben **exakt
dasselbe Beleg-Profil** — Einhandbedienung offen, Standfunktion offen, Faltung mit Sitz
dokumentiert. liyo erhält 1,0, die anderen vier 0,5.

**Zweitens: mehr Evidenz, schlechterer Wert.** `abc-design-samba-2` hat die
Einhandbedienung dokumentiert, `kinderkraft-nea-2` und `joie-versatrax-2024` haben die
Standfunktion dokumentiert. Alle drei haben damit **strikt mehr** Belege als liyo und
werden trotzdem halb so gut bewertet.

Der einzige Unterschied, der liyos 1,0 erklärt, ist das kleine Faltmaß. Der
Begründungstext des Signals sagt es selbst: „Sehr kleines Faltmaß und Faltung mit Sitz
oder Babywanne sind dokumentiert; Einhandbedienung bleibt offen." Die tatsächlich
angewandte Regel war also „kleines Faltmaß → 1,0".

Das ist methodisch nicht haltbar, weil das Faltmaß über `foldedCompactness` bereits
separat in `car_transport_fit` eingeht. Die Kompaktheit wird doppelt gezählt — und zwar
nur bei einem Modell. `folding_convenience` soll den Faltvorgang bewerten, nicht die
Größe des Ergebnisses.

Konsequenz: Das einzige Modell, das beide Gates besteht, ist genau das Modell mit der
großzügigsten Bewertung. Die Gates messen derzeit die Bewertungspraxis und nicht die
Produkteignung.

## Quellenlage: die Lücken sind aus dem Web nicht schließbar

Am 28.07.2026 wurden die offiziellen Quellen der blockierenden Modelle gezielt geprüft.
Ergebnis: **Keine der fehlenden Falt-Angaben ist öffentlich dokumentiert.**

- `kinderkraft-yoxi-2in1`: Die Herstellerseite schreibt „YOXI wird auch mit einem
  Handgriff zusammengelegt". „Ein Handgriff" bezeichnet im Deutschen eine einzelne
  Handbewegung, nicht zwingend die Bedienung mit einer Hand. Nicht als Einhandfaltung
  verwertbar.
- `my-junior-noax`: „Sekundenschnelles Zusammenklappen" und „mühelos mitsamt Sportsitz
  klappen" — beides ohne Aussage zur Zahl der Hände.
- `my-junior-miyo2`: Nur Faltmaß („Maße Gestell geklappt: 89×60×28 cm"), keine
  ungefaltete Breite. Bestätigt den bestehenden Lückeneintrag.
- `my-junior-liyo`: Auch die Bedienungsanleitung (`User-Manual-LIYO.pdf`, deutscher
  Abschnitt ab S. 18) beschreibt das Falten nur über Warnhinweise und Illustrationen.
  Keine Angabe zur Einhandbedienung.

Aus einer Illustration abzuleiten, dass eine Hand genügt, verstößt gegen
`automaticEstimationForbidden`. Der Weg führt daher zwingend über
`schriftliche Herstellerbestätigung` oder `eindeutig dokumentierte eigene Messung`.

## Behobener Policy-Verstoß

`data-gaps.v0.1.json` erfasste bis zum 28.07.2026 ausschließlich `unfoldedWidthCm`-Lücken
(5 Einträge), obwohl die Policy `missingCriticalFactsMustBeTracked: true` setzt. Nicht
erfasst waren:

- `oneHandFold` — unbekannt bei **10 von 20** Modellen
- `selfStandingFold` — unbekannt bei **14 von 20** Modellen

Beide Felder speisen `folding_convenience`, das bei gewählter Priorität „einfaches Falten"
mit Faktor 2,5 gewichtet wird und beide offenen Persona-Gates blockiert. Es waren also
genau die entscheidungsrelevantesten Lücken, die im Prozess unsichtbar blieben.

Die 24 fehlenden Einträge sind ergänzt, Gesamtstand 29. Bei drei Einträgen ist das
Recherche-Ergebnis als `researchNote` hinterlegt, damit die Prüfung nicht wiederholt wird.

## Wirkungssimulation

Getestet mit `matchStrollers` gegen die Referenzprofile, ohne Änderung am Katalog.

| Szenario | `low_budget_city_walkup` | `compact_car_fixed_budget` |
|---|---|---|
| Ist-Zustand | 1 Match | 1 Match |
| A: Regel „`selfStandingFold` + `foldWithSeat` dokumentiert → 1,0" | 1 Match | **3 Matches** |
| B: A + `oneHandFold` bei Budget-Modellen dokumentiert | **2 Matches** | 3 Matches |
| C: B + `unfoldedWidthCm` für miyo2/noax dokumentiert | **3 Matches** | 3 Matches |

Szenario A hebt vier Modelle an: `joie-versatrax-2024`, `joolz-day5`, `joolz-geo5`,
`kinderkraft-nea-2`. Es braucht keine neuen Daten, nur die konsistente Anwendung des
Maßstabs, der bei liyo schon angewandt wurde.

## Empfehlung

1. **Bewertungsregel für `foldingConvenience` schriftlich fixieren**, bevor Werte
   geändert werden. Offene Entscheidung: Zählt ein kleines Faltmaß in dieses Signal
   hinein oder ausschließlich in `car_transport_fit`? Solange das nicht festgelegt ist,
   ist jede Anpassung nicht überprüfbar.
2. **Danach den ganzen Katalog nach dieser Regel neu bewerten**, nicht nur die Modelle,
   die ein Gate blockieren. Eine Anhebung nur dort, wo sie ein Gate öffnet, wäre
   Ergebnismanipulation und würde die Schutzfunktion der Checkliste aushebeln.
3. **`oneHandFold` erheben** für die Budget-Modelle. Das ist der einzige Punkt, der für
   `low_budget_city_walkup` echte neue Daten braucht — per Handbuch, Herstellerauskunft
   oder eigener Prüfung.
4. **Gate-Schwelle prüfen.** `persona-segments.v0.2.json` verlangt je Segment
   `requiredPublishedMatches: 1`, `tools/kinderwagen-index-readiness.mjs` erzwingt für
   die Indexierung aber `Math.max(2, …)`. Diese Verdopplung ist bewusst strenger. Sie
   ist vertretbar, sollte aber eine dokumentierte Entscheidung sein und nicht eine
   Nebenwirkung im Prüfskript.

## Nicht empfohlen

Zusätzliche Budget-Modelle in den Katalog aufnehmen, um die Gates zu öffnen. Neue
Modelle würden mit derselben unklaren Bewertungsregel bewertet und das Problem
verschieben statt lösen. Erst die Regel, dann die Breite.
