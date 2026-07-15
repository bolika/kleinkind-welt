# GSC-Messpunkt nach Qualitäts-Release

Abgerufen am 15.07.2026 mit Datenstand bis 12.07.2026. Der lokale Qualitäts-Release ist noch nicht veröffentlicht; dieser Messpunkt ist daher die Vorher-Baseline für den nächsten Deploy.

## 14 Tage gegen Vorperiode

| KPI | 15.–28.06. | 29.06.–12.07. | Veränderung |
|---|---:|---:|---:|
| Klicks | 1 | 5 | +4 |
| Impressionen | 143 | 183 | +40 |
| CTR | 0,70 % | 2,73 % | +2,03 Prozentpunkte |
| Ø Position | 34,2 | 59,6 | +25,4 Positionen (schlechter) |

## Prioritätsseiten in der aktuellen Periode

| Seite | Impressionen | Klicks | Ø Position |
|---|---:|---:|---:|
| `/artikel/spielzeug-unter-20-euro` | 18 | 1 | 20,9 |
| `/artikel/spielzeug-0-6-monate` | 11 | 0 | 68,6 |
| `/artikel/spielzeug-12-18-monate` | 6 | 2 | 16,7 |
| `/artikel/nachhaltiges-spielzeug-siegel` | 4 | 0 | 26,5 |
| `/artikel/motorikspielzeug-test` | 3 | 1 | 6,0 |
| `/spielzeug-nach-alter` | 0 | 0 | – |
| `/kaufhilfen` | 0 | 0 | – |

## Einordnung

- Klicks, Impressionen und CTR steigen, aber die Datenbasis ist weiterhin sehr klein.
- Der Positionswert wird durch neue, weit hinten liegende Suchanfragen nach unten gezogen; daraus folgt noch kein Content-Rückbau.
- Die schnellsten Signale liegen bei `/artikel/spielzeug-12-18-monate` und `/artikel/motorikspielzeug-test`. Die Budget-Seite hat erstmals einen Klick, bleibt aber mit Position 20,9 der wichtigste P1-Testkandidat.
- Die neuen Claim- und Evidenzänderungen sind in diesem Messpunkt noch nicht live. Nach dem Deploy wird dieser Stand als Vorher-Wert verwendet.

## Nächster Messpunkt

Nach dem Deploy erneut mit `python3 tools/gsc-growth-snapshot.py --days 14` messen. Wegen des GSC-Datenverzugs erst nach mindestens 14 Tagen interpretieren; einen 28-Tage-Vergleich nach vier Wochen ergänzen. Keine Entscheidung aus einem einzelnen Tages- oder URL-Wert ableiten.
