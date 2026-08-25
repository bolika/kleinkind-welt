# Babywalz-Preisfeed

## Zweck

Die Seite `artikel/spielzeug-unter-20-euro.html` zeigt Babywalz-Preise nur, wenn das redaktionell zugeordnete Produkt verfügbar ist, der Gesamtpreis inklusive Feed-Versand höchstens 20 Euro beträgt und der Snapshot jünger als 48 Stunden ist.

Bei fehlenden, ungültigen oder veralteten Daten bleiben die Händlerlinks sichtbar. Preiszeile und dynamische CTA-Priorisierung werden dann nicht ausgespielt.

## GitHub-Einrichtung

1. In Awin nur den Feed `AWIN DE Preissuchmaschinen` mit der Datafeed-ID `101035` wählen.
2. Den manuellen Download-Link mit neuem API-Schlüssel erzeugen. Ein in Screenshots oder Chats sichtbarer Schlüssel muss vorher in Awin rotiert werden.
3. In GitHub unter `Settings > Secrets and variables > Actions` das Repository Secret `AWIN_BABYWALZ_FEED_URL` anlegen.
4. Den vollständigen Download-Link als Secret-Wert hinterlegen. Der Link gehört nicht in den Quellcode oder in ein Issue.
5. Den Workflow `Refresh Babywalz prices` einmal manuell starten und den erfolgreichen Lauf prüfen.

Der Workflow läuft danach täglich, erzeugt `data/affiliate-offers/babywalz-prices.v0.1.json` neu und veröffentlicht die Änderung über einen automatischen Commit.

## Versandkosten

Für die Darstellung gilt ausschließlich `delivery_cost` aus dem Awin-Feed. Am 25.08.2026 waren für die sechs kuratierten Angebote jeweils 4,99 Euro ausgewiesen.

Eine dauerhaft gültige Warenkorbgrenze für kostenlosen Versand ist nicht bestätigt. Babywalz beschreibt Portofrei-Angebote als aktions- oder codeabhängig und verweist auf den jeweils kommunizierten Mindestbestellwert: <https://www.baby-walz.de/code/>. Deshalb darf die Seite keine allgemeine Gratisversandgrenze nennen.
