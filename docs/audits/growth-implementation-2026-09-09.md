# Umsetzung des Wachstumschecks

Stand 09.09.2026. Lokal umgesetzt, noch nicht veroeffentlicht.

## Umgesetzt

- DUPLO und Geburt: Preload und responsive Bildauswahl synchronisiert. Browser-Regressionstest verlangt exakt einen Hero-Download pro Ansicht.
- Geschenke 2 Jahre: dekoratives Hero-Bild entfernt; drei vorhandene Produktkarten nach Spielmoment direkt nach dem Einstieg. Weitere drei Ideen bleiben per nativem details erreichbar, auch ohne JavaScript. Vorhandene Produktanker bleiben stabil.
- Produktnamen in ItemList und Evidenzregister abgeglichen. Falsche alte Hape-/Ravensburger-Namen und unbelegte Budget-Kombinationen entfernt. Ein primaerer Haendler je Produkt; Altersangaben, Preise inkl. Versand und Affiliate-Hinweis bleiben sichtbar.
- Geschenke-Hub: kuerzerer Einstieg, Alter schneller erreichbar, eigener Bereich fuer Advent/Weihnachten statt vermischter Naehe-zum-Kind-Auswahl. Weg fuer unbekannte Wuensche erhalten.
- Montessori: drei konkrete vorgeschlagene Spielmomente samt Einstiegsgrenzen. Keine erfundenen persoenlichen Produkterfahrungen.
- Outdoor und Spielzeug 2 Jahre: unbelegte pauschale Immun-/Stress-/Entwicklungsversprechen entfernt bzw. als redaktionelle Auswahl begrenzt. Sichtbare FAQ und Schema gleichgezogen.
- Saisonseiten: bestehende Auswahl behalten, Wochenrhythmus fuer den Momentekalender ergaenzt, Nikolaus-Vorauswahl geschaerft, Weihnachtsbudget mit Advent/Nikolaus gemeinsam eingeordnet. Keine neuen Kalenderprodukte ohne belastbare U3-Zuordnung.
- Startseite: veraltete Angabe von acht Weihnachtsideen auf drei korrigiert. Adventskalender direkt im bestehenden Saisonbereich verlinkt; keine weitere Sektion hinzugefuegt.
- GSC-Monitoring um Homepage, Geschenke 2 Jahre und die drei Saisonseiten ergaenzt. Bekannte Releases dokumentiert, lokale Arbeit nicht als veroeffentlicht markiert. Fehlende Positionen werden nicht mehr als Rang null angezeigt.
- Sitemap-Daten und llms-Beschreibungen passend aktualisiert. Bildherkunftsregister dokumentiert die komplette Entfernung des dekorativen Bilds; keine Kennzeichnung eines weiterhin sichtbaren KI-Bilds entfernt.

## Woechentlicher Ablauf

Lokaler Bericht mit dem jeweils aktuellen Plausible-Export und authentifiziertem GSC-Vergleich:

```bash
python3 tools/growth-weekly-report.py "/Pfad/zum/Plausible-Export.zip" --gsc
```

Ohne `--gsc` ist der Exportbericht offline nutzbar. CSVs werden direkt im ZIP gelesen, nicht entpackt oder hochgeladen. Der Bericht unterscheidet Perioden, Quellen, Einstiege und Ziele. Affiliate- und allgemeine Outbound-Klicks werden nicht addiert; Awin-clickref nutzt vorhandene URL-Daten ohne kostenpflichtige Properties.

Der Befehl ist vorbereitet und getestet, aber kein unbeaufsichtigter Wochenjob eingerichtet: Neue Plausible-Exporte werden weiterhin manuell bereitgestellt. GSC verwendet bestehende lokale Zugangsdaten; es wurden keine Zugangsdaten in GitHub hinterlegt.

## Geprueft, kein weiterer Umbau noetig

- Babywalz-Snapshot vom 09.09.: 23 von 23 Angeboten nutzbar, gueltig bis 11.09. um 08:23 UTC. Produktbilder/Preise der Saisonseiten im Browser geprueft. Keine Zusage kuenftiger Lagerbestaende oder Weihnachtslieferung.
- Kinderwagen-Ratgeber haben bereits eigene Inhalte und Kontextlinks im Kinderwagen-Hub und den Kaufhilfen. Keine kuenstlichen Zusatzlinks oder doppelten Ratgeber erzeugt. Indexierungsanfragen uebernimmt Boris.
- Newsletter hat getrennte Ereignisse fuer Formular und Bestaetigungsseite. Der Bestaetigungsseitenaufruf ist kein serverseitiger Nachweis des Brevo-DOI-Status. Keine echte Anmeldung im Namen des Nutzers versendet; keine Aenderung der funktionierenden Freebie-Freigabe.

## Benoetigt Boris

1. Die acht URLs aus dem Audit in GSC live testen und einmal Indexierung beantragen.
2. Fuer zwei bis drei tatsaechlich vorhandene Produkte eigene Beobachtungen und Bilder liefern. Vier kurze Antworten reichen: Was macht das Kind damit? Was klappt nicht? Wie viel Platz braucht es? Wuerdest du es erneut waehlen? Herstellerangaben bleiben davon getrennt.
3. Monatliche laufende Kosten und bestaetigte Amazon-/Awin-Provisionen bereitstellen. Ohne diese Werte keine serioese Rentabilitaetsrechnung.
4. Externe Verbreitung eines eigenen Erfahrungsbeitrags freigeben und einen vorhandenen passenden Kanal nennen. Nichts extern gepostet.

## Validierung

- DUPLO/Geburt: vier Viewports, genau ein Hero-Download, Bilder, FAQ-Paritaet, Anker und Bedienung ohne JavaScript.
- Geschenke 2 Jahre, Geschenke-Hub, Montessori: vier Viewports, keine horizontalen Ueberlaeufe, funktionsfaehige Anker, aufklappbare Alternativen und echte Produktbilder. Auswahltest begrenzt die Position des ersten Geburtstags-Haendlerbuttons auf unter 1800 Pixel.
- Weihnachten, Adventskalender, Nikolaus: Produktbilder bzw. 24 Momente auf Mobile und Desktop.
- Exportreport: Tests fuer fehlende Ziele, getrennte Klickzaehlung, clickref-Zuordnung und doppelte CSV-Dateien.
- Finaler Lauf: erster Geburtstags-Haendlerbutton bei 390 Pixeln Breite nach 1391 statt rund 6220 Pixeln. Das belegt einen kuerzeren Auswahlweg, keinen gemessenen Conversion-Uplift.
- SEO fuer 40 Seiten ohne Warnungen, interner Link-Audit, Babywalz-Angebots-Gate, Bildherkunft, Navigations-, Content-Brief-, Erfahrungs- und Analytics-Gates bestanden. Preis-UI mit Ausfallszenarien und getrennte Haendler-Klickereignisse ebenfalls bestanden. Ein veralteter Event-Test erwartete noch einen entfernten Amazon-Fallback; er prueft nun echte bestehende Haendlerlinks auf zwei Seiten.
- Woechentlicher Bericht mit dem echten bereitgestellten ZIP und funktionierender GSC-Verbindung erfolgreich ausgefuehrt. Kein Zeitplan und kein Produktions-Deployment gestartet.

Quellenbasis: bestehende gepruefte Produktzuordnungen im Babywalz-Mapping; [LEGO 10913](https://www.lego.com/de-de/product/brick-box-10913) und [BIOEG: Spielen 1-3 Jahre](https://www.kindergesundheit-info.de/themen/spielen/1-3-jahre/), am 09.09. erneut aufgerufen. Spielmomente sind redaktionelle Vorschlaege, keine Studienergebnisse.
