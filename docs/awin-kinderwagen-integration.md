# Awin-Mehrhändler-Integration für den Kinderwagen-Navigator

Status: sechs Bewerbungen vorbereitet; echte Angebote bleiben bis zur jeweiligen Programmfreigabe gesperrt.

## Programme

Die maschinenlesbare Registry liegt in `data/kinderwagen-navigator/awin-programs.v0.1.json`.

| Händler | Feed | Rolle |
| --- | --- | --- |
| Babyprofi | ja | markenübergreifender Händler |
| Bugaboo | ja | direkter Markenkanal |
| Joolz | ja | direkter Markenkanal |
| CYBEX | ja | direkter Markenkanal |
| Lidl | ja | nur exakt identifizierte Aktionsangebote |
| TFK | nein | spätere manuelle Buggy-/Jogger-Integration |

Angezeigte Awin-Kennzahlen wie EPC, Conversion- oder Approval-Rate werden nicht gespeichert und beeinflussen weder Produktaufnahme noch Angebotsreihenfolge.

## Unabhängigkeitsvertrag

- Match-Daten liegen ausschließlich in `data/kinderwagen-navigator/products/`.
- Händlerdaten liegen ausschließlich in `offers.v0.1.json`.
- Der Matcher liest keine Angebots-, Händler- oder Provisionsfelder.
- Programmverfügbarkeit verändert weder Score noch organische Ergebnisreihenfolge.
- Angebote werden nach bestätigter Konfiguration, frischer Verfügbarkeit und frischem Gesamtpreis inklusive Versand sortiert.
- Maximal drei passende Angebote erscheinen pro Match.

## Ablauf nach einer Freigabe

1. `applicationStatus` des Programms in der Registry auf `joined` setzen.
2. Bestätigte Awin-Advertiser-ID in Registry und Händler-Mapping eintragen.
3. Programmbedingungen zur Bildnutzung prüfen und `feedImageUsageStatus` aktualisieren.
4. Feed als CSV oder CSV.GZ ausschließlich unter `imports/awin/` speichern.
5. Produkt ausschließlich über kuratierte Händlerprodukt-ID oder GTIN zuordnen.
6. Modellgeneration und vollständige Geburtskonfiguration auf der Händlerseite kontrollieren.
7. Mapping mit Status, Lieferumfang und Prüfdatum ergänzen.
8. Feed importieren, bestehende Händlerangebote zusammenführen und alle Gates starten.

Unbekannte Advertiser-IDs blockieren den Import technisch. Titelähnlichkeit allein erzeugt nie eine Zuordnung.

## Generischer Import

```bash
node tools/import-awin-offers.mjs \
  --input imports/awin/joolz.csv.gz \
  --mapping data/kinderwagen-navigator/joolz.mapping.v0.1.json \
  --output data/kinderwagen-navigator/offers.v0.1.json \
  --merge data/kinderwagen-navigator/offers.v0.1.json
```

Der Import ersetzt bei einem erneuten Lauf nur die Angebote desselben Advertisers. Angebote anderer freigegebener Händler bleiben erhalten.

## Mapping-Beispiel

```json
{
  "productId": "joolz-hub2",
  "merchantProductIds": ["BESTAETIGTE-HAENDLER-ID"],
  "gtins": ["BESTAETIGTE-GTIN"],
  "configuration": {
    "status": "exact_required_configuration",
    "label": "Kinderwagen inklusive Babywanne",
    "verifiedAt": "2026-07-23"
  }
}
```

Gestell, Sitzeinheit, Babywanne oder Adapter als Einzelteil erhalten `partial_configuration` und werden nicht als Kaufangebot gezeigt.

## Freigabecheck pro Händler

- Advertiser-ID stimmt mit Awin und Feed überein.
- Deeplink führt zur exakten Modellgeneration.
- Erforderliche Babywanne ist nachweislich enthalten.
- GTIN beziehungsweise Händlerprodukt-ID stimmt.
- Preis und Versandkosten sind frisch.
- Bestand ist frisch oder wird neutral als „prüfen“ angezeigt.
- Bildnutzung ist laut Programmbedingungen erlaubt.
- Awin-Testklick enthält die erwartete Clickref.

## Validierung

```bash
node tools/kinderwagen-awin-program-gate.mjs
node tools/kinderwagen-offer-import-test.mjs
node tools/kinderwagen-offer-data-gate.mjs
node tools/kinderwagen-navigator-ui-gate.mjs
git diff --check
```
