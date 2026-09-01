# Babywalz-Preisfeed

## Zweck

Die Seite `artikel/spielzeug-unter-20-euro.html` zeigt Babywalz-Preise nur, wenn das redaktionell zugeordnete Produkt verfügbar ist, der Gesamtpreis inklusive Feed-Versand höchstens 20 Euro beträgt und der Snapshot jünger als 48 Stunden ist.

Pro Empfehlung ist nur ein Händler-CTA sichtbar. Bei einem frischen, verfügbaren und zur 20-Euro-Regel passenden Babywalz-Angebot erscheinen Gesamtpreis und Babywalz-CTA. Bei fehlenden, ungültigen, zu teuren oder veralteten Daten bleibt stattdessen ausschließlich der redaktionell geprüfte Amazon-Link als Fallback sichtbar.

## GitHub-Einrichtung

1. In Awin einen der beiden Babywalz-Feeds `AWIN Feed DE (CSS)` (`23807`) oder `AWIN DE Preissuchmaschinen` (`101035`) wählen. Ein Feed reicht; beide zusammen sind ebenfalls zulässig, aber unnötig groß.
2. Den manuellen Download-Link mit neuem API-Schlüssel erzeugen. Ein in Screenshots oder Chats sichtbarer Schlüssel muss vorher in Awin rotiert werden.
3. In GitHub unter `Settings > Secrets and variables > Actions` das Repository Secret `AWIN_BABYWALZ_FEED_URL` anlegen.
4. Den vollständigen Download-Link als Secret-Wert hinterlegen. Der Link gehört nicht in den Quellcode oder in ein Issue.
5. Den Workflow `Refresh Babywalz prices` einmal manuell starten und den erfolgreichen Lauf prüfen.

## Betrieb und Monitoring

Der Workflow `Refresh Babywalz prices` prüft vor dem Download, ob das Secret gesetzt ist. Bei fehlender Konfiguration oder einem fehlgeschlagenen Import erscheint im GitHub-Actions-Lauf eine konkrete Zusammenfassung. Der abschließende Health-Report zeigt Erstellungszeit, Ablaufzeit und Anzahl nutzbarer Angebote.

Lokal lässt sich derselbe Zustand prüfen:

```bash
node tools/babywalz-feed-health.mjs
node tools/babywalz-feed-health.mjs --strict
```

`--strict` ist für den Refresh-Workflow gedacht und schlägt bei fehlendem, ungültigem oder abgelaufenem Snapshot fehl. Das allgemeine Qualitäts-Gate meldet den Status nur informativ, damit ein vorübergehend veralteter Preisfeed keine redaktionellen Änderungen blockiert. Auf der Website werden Preiszeile und Babywalz-CTA nach 48 Stunden automatisch ausgeblendet; der geprüfte Amazon-Fallback übernimmt ohne zweite Händlerentscheidung.

Offizielle Awin-Advertiser-Creatives und Produktfeed-Bilder werden getrennt behandelt. Ein Banner darf nur erscheinen, wenn sein exaktes Ziel, Bild, Placement und die vom Betreiber bestätigte Freigabebasis in `data/affiliate-offers/babywalz.mapping.v0.1.json` erfasst sind.

Der Betreiber hat am 01.09.2026 bestätigt, dass Babywalz-Produkte und die zugehörigen Produktfeed-Bilder im Affiliate-Kontext genutzt werden dürfen. Deshalb steht `feedImageUsageStatus` auf `approved_for_feed_only`. Die Website lädt nur die HTTPS-Bild-URL aus derselben exakt zugeordneten Feed-Zeile wie Preis und Verfügbarkeit. Platzhalterbilder werden verworfen. Bilder werden weder lokal gespeichert noch verändert; eine lokale Kopie setzt eine separate Freigabe voraus.

Der Workflow läuft danach täglich, erzeugt `data/affiliate-offers/babywalz-prices.v0.1.json` neu, aktualisiert die exakt zugeordneten Babywalz-Angebote samt Feed-Bildern in `data/kinderwagen-navigator/offers.v0.1.json` und veröffentlicht beide Änderungen über einen automatischen Commit.

## Produktzuordnung über mehrere Awin-Feeds

Awin kann demselben Babywalz-Produkt je Datenfeed eine andere `aw_product_id`
geben. Deshalb identifiziert der Preisimport ein Produkt über die kuratierte
Kombination aus Babywalz-Händlerartikelnummer und GTIN. Der im Mapping hinterlegte
Deeplink bleibt die redaktionell geprüfte Ziel-URL.

Liefert ein Download dasselbe Produkt aus mehreren Feeds, werden die Zeilen nur
akzeptiert, wenn Preis, Versand, Währung und Verfügbarkeit übereinstimmen. Bei
widersprüchlichen Angaben stoppt der Workflow, statt einen unsicheren Preis zu
veröffentlichen.

## Versandkosten

Für die Darstellung gilt ausschließlich `delivery_cost` aus dem Awin-Feed. Am 25.08.2026 waren für die sechs kuratierten Angebote jeweils 4,99 Euro ausgewiesen.

Eine dauerhaft gültige Warenkorbgrenze für kostenlosen Versand ist nicht bestätigt. Babywalz beschreibt Portofrei-Angebote als aktions- oder codeabhängig und verweist auf den jeweils kommunizierten Mindestbestellwert: <https://www.baby-walz.de/code/>. Deshalb darf die Seite keine allgemeine Gratisversandgrenze nennen.
