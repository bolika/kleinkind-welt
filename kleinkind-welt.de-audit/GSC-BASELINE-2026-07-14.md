# GSC-Baseline vor dem Qualitäts-Release

Abgerufen am 14.07.2026. GSC-Datenstand jeweils bis 11.07.2026, damit nur weitgehend finale Daten einfließen. Die neuen Änderungen vom 14.07. sind in diesen Zahlen noch nicht enthalten.

## 14 Tage gegen Vorperiode

| KPI | 14.–27.06. | 28.06.–11.07. | Veränderung |
|---|---:|---:|---:|
| Klicks | 1 | 5 | +4 |
| Impressionen | 145 | 178 | +33 |
| CTR | 0,69 % | 2,81 % | +2,12 Prozentpunkte |
| Ø Position | 35,6 | 58,1 | −22,5 Positionen |

Prioritätsseiten in der aktuellen Periode:

| Seite | Impressionen | Klicks | Ø Position |
|---|---:|---:|---:|
| `/artikel/spielzeug-12-18-monate` | 6 | 2 | 16,7 |
| `/artikel/nachhaltiges-spielzeug-siegel` | 4 | 0 | 26,5 |
| `/artikel/motorikspielzeug-test` | 3 | 1 | 6,0 |
| `/spielzeug-nach-alter` | 0 | 0 | – |
| `/kaufhilfen` | 0 | 0 | – |

## 28 Tage gegen Vorperiode

| KPI | 17.05.–13.06. | 14.06.–11.07. | Veränderung |
|---|---:|---:|---:|
| Klicks | 0 | 6 | +6 |
| Impressionen | 5 | 323 | +318 |
| CTR | 0,00 % | 1,86 % | +1,86 Prozentpunkte |
| Ø Position | 47,8 | 48,0 | −0,2 Positionen |

## Interpretation und nächster Messpunkt

- Die Sichtbarkeit wächst von einer sehr kleinen Basis. Prozentwerte sind deshalb stark verzerrbar.
- Der 14-Tage-Positionswert ist schwächer, obwohl Impressionen und Klicks steigen. Das kann entstehen, wenn Google die Domain erstmals für zusätzliche, weiter hinten rankende Suchanfragen testet.
- `/artikel/spielzeug-12-18-monate` hat bereits zwei Klicks bei nur sechs Impressionen. Titel und Content-Intent wurden deshalb präzisiert, nicht komplett neu ausgerichtet.
- Der nächste belastbare Vergleich ist am 31.07.2026 für 14 Tage und am 14.08.2026 für 28 Tage vorgesehen; wegen GSC-Verzug jeweils die Daten bis drei Tage vorher verwenden.

Reproduzierbare Befehle:

```bash
python3 tools/gsc-growth-snapshot.py --days 14
python3 tools/gsc-growth-snapshot.py --days 28
```
