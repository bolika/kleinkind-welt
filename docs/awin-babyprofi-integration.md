# Awin/Babyprofi-Integration für den Kinderwagen-Navigator

Status: technisch vorbereitet, echte Angebote warten auf die Aufnahme in das Babyprofi-Programm 14986.

## Verbindliche Produktregel

Kinderwagen-Fakten und Händlerangebote bleiben getrennte Datenbestände:

- `data/kinderwagen-navigator/products/` enthält ausschließlich Match- und Evidenzdaten.
- `data/kinderwagen-navigator/offers.v0.1.json` enthält Preise, Bestand und Affiliate-Links.
- `js/kinderwagen-matcher.mjs` darf die Angebotsdatei und kommerzielle Felder nicht lesen.
- Händlerprovisionen beeinflussen weder Eligibility noch Score oder Reihenfolge.

Ein Händlerangebot erscheint nur, wenn es kuratiert als `exact_required_configuration` bestätigt wurde. Ein einzelnes Gestell, eine Sitzeinheit oder eine unklare Variante darf nicht als passende Geburtskonfiguration beworben werden.

## Nach der Babyprofi-Freigabe

1. In Awin unter `Toolbox > Create-a-Feed` den Babyprofi-Feed als CSV oder CSV.GZ herunterladen.
2. Feed und Zuordnungsdatei nur lokal bearbeiten. Ein Feed-API-Key oder eine Download-URL mit API-Key darf niemals in Git landen.
3. Für relevante Modelle in `data/kinderwagen-navigator/babyprofi.mapping.v0.1.json` exakte Zuordnungen ergänzen.
4. Bevorzugt EAN/GTIN und Händlerprodukt-ID gemeinsam prüfen. Titelähnlichkeit allein reicht nicht.
5. Lieferumfang auf der Produktseite kontrollieren und Konfigurationsstatus, Label und Prüfdatum dokumentieren.
6. Importer ausführen und danach alle Gates starten.

Beispiel für einen kuratierten Mapping-Eintrag:

```json
{
  "productId": "bugaboo-fox-5-renew",
  "merchantProductIds": ["ECHTE-BABYPROFI-ID"],
  "gtins": ["ECHTE-GTIN"],
  "configuration": {
    "status": "exact_required_configuration",
    "label": "Kinderwagen inklusive Babywanne",
    "verifiedAt": "2026-07-22"
  }
}
```

## Import

```bash
node tools/import-awin-babyprofi-offers.mjs \
  --input imports/awin/babyprofi.csv.gz \
  --mapping data/kinderwagen-navigator/babyprofi.mapping.v0.1.json \
  --output data/kinderwagen-navigator/offers.v0.1.json
```

Der Importer:

- verarbeitet CSV und gzip-komprimierte CSV,
- ordnet ausschließlich über kuratierte Händlerprodukt-IDs oder GTINs zu,
- übernimmt Awin-Deeplink, Preis, Versand, Bestand und optional die Feed-Bild-URL,
- versieht volatile Preis- und Bestandsdaten mit einem Ablaufdatum von zwei Tagen,
- veröffentlicht keine Feed-Zugangsdaten,
- übernimmt keine Händlerbeschreibung als redaktionelle Empfehlung.

Feed-Dateien unter `imports/` gehören nicht in Git. Vor der ersten echten Nutzung muss der Pfad in `.gitignore` aufgenommen beziehungsweise geprüft werden.

## Darstellung und Messung

Nur reguläre, veröffentlichungsfähige Matches erhalten eine Händlerbox. Vorläufige Treffer und No-Match-Alternativen zeigen keinen Kauf-CTA.

Die Angebotsbox enthält:

- Händlername,
- frischen Preis oder den neutralen Hinweis, den Preis zu prüfen,
- Verfügbarkeitsstatus,
- geprüften Lieferumfang,
- klar gekennzeichneten Affiliate-Link.

Plausible misst anonym:

- `Kinderwagen-Navigator` mit Aktion `haendlerangebot_gesehen`,
- `Affiliate-Klick` mit Produkt-ID, Händler, Angebot, Ergebnisrang, Match-Score und Clickref.

Für Awin wird die Clickref nach Platzierung gebildet, zum Beispiel `navigator_result_1`. Es werden keine Antworten, Fahrzeugdaten oder sonstigen personenbezogenen Angaben an Awin übergeben.

## Validierung

```bash
node tools/kinderwagen-offer-import-test.mjs
node tools/kinderwagen-offer-data-gate.mjs
node tools/kinderwagen-navigator-ui-gate.mjs
node tools/kinderwagen-matcher-test.mjs
git diff --check
```

Vor einer Veröffentlichung mit echten Daten zusätzlich manuell prüfen:

- Zielseite und Modellgeneration stimmen überein.
- Die Babywanne beziehungsweise Geburtskonfiguration ist tatsächlich enthalten.
- Preis und Lieferstatus entsprechen der Händlerseite.
- Produktbild darf laut Programmregeln aus dem Feed verwendet werden.
- Awin-Testklick wird dem korrekten Advertiser und Clickref zugeordnet.
