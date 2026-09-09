# DUPLO und Geburtsgeschenke: Content-Update

Stand: 09.09.2026. Lokal umgesetzt und getestet; nicht veröffentlicht.

## Ausgangslage und Ziel

Der Nutzer beobachtet AI-Assistant-Zugriffe auf den DUPLO-Vergleich. In diesem
Durchlauf wurden keine neuen GSC- oder Plausible-Daten abgerufen. Die Beobachtung
ist ein Ansatzpunkt, kein Nachweis dafür, welche Passage zitiert wird.

Ziel: hilfreiche, belegbare Antworten auf der bestehenden DUPLO-URL; auf der
Geburtsseite eine kleine emotionale Auswahl ohne vorgeschaltete Textwand.

## Umgesetzt

- DUPLO: fünf Systeme bleiben erhalten. Frühe Vergleichstabelle nach Spielweise,
  eigene Kompatibilitätsantwort, sieben übereinstimmende HTML-/Schema-FAQs.
- Pauschale Qualitätsranglisten, unbelegte Stiftung-Warentest-Zuschreibung,
  Preisverhältnisse, Entwicklungsversprechen und frühere widersprüchliche
  Altersangaben entfernt. Kein eigener Produkttest wird behauptet.
- Produktzuordnung konkretisiert: DUPLO Deluxe Steinebox 10914, goki 58479,
  KAPLA-Link zur 280er-Holzkiste. MAGNA-TILES-Herstellerbeispiel nicht als
  identischer Lieferumfang jeder Händler-Variante ausgegeben.
- Geburt: drei Geschenkwege statt zehn Ideen und sechs Produktkarten:
  abgesprochenes Essen, gemeinsame Bilderbuchzeit, erfüllter Wunsch.
- Ein Buch-CTA, kein Affiliate-Button für selbst gemachte Hilfe. Das verlinkte
  Buch korrekt als einzelnes Leporello bezeichnet.
- Widmungen, praktische Hinweise und Quellen aufklappbar; kein neues JavaScript.
- Ungeeignete Empfehlung eines pauschal größeren Babyschlafsacks entfernt.
- URLs und bestehende Haupt-Sprungziele erhalten. Metadaten, ItemList,
  FAQ-Schema, Evidenzregister, Sitemap, Teaser und llms.txt abgeglichen.
- Keine neuen Bildrechte angenommen, kein Produktbild aus Amazon kopiert,
  bestehende KI-Bildkennzeichnung erhalten. Keine neuen Tracking-Events.

## Quellen

- [LEGO 10914](https://www.lego.com/de-de/product/deluxe-brick-box-10914):
  Setname, 85 Teile, 18 Monate.
- [LEGO Kompatibilität](https://www.lego.com/de-de/service/help-topics/article/building-with-lego-and-duplo-bricks):
  Beispiele passender Steine und Einschränkungen bei Figuren.
- [MAGNA-TILES Classic](https://magnatiles.com/products/magna-tiles-classic-32-piece-set):
  Bauprinzip und 3-Jahre-Angabe des Herstellerbeispiels.
- [Mattel First Builders](https://shop.mattel.com/en-ca/products/first-builders-big-building-bag-dch62-en-ca):
  Produktfamilie und Altersangabe des Big-Building-Bag-Beispiels.
- [goki 58479](https://goki.eu/de/bausteine-kleiner-regenbogen/item-1-58479.html):
  Modellzuordnung. Keine neue feste Altersangabe aus nicht lesbaren Daten abgeleitet.
- [KAPLA](https://www.kapla.com/en/): loses Stapeln ohne Kleber oder Clips.
- [CPSC Magnet Safety](https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Magnets):
  Risiko loser verschluckter Magnete.
- [Oetinger](https://www.oetinger.de/buch/erste-bilder-fuer-babyaugen-ab-0-monaten/9783751203982):
  genauer Buchtitel, ISBN, Leporello und Zielalter.
- [BIÖG Schlafumgebung](https://www.kindergesundheit-info.de/themen/schlafen/0-12-monate/schlafumgebung/):
  Passform des Schlafsacks statt pauschalem Größenraten.

Affiliate-Zuordnungen zusätzlich gegen das vorhandene freigegebene Linkregister
geprüft. Keine erneute vollständige Live-Prüfung aller Amazon-Varianten,
Händlerpreise oder Verfügbarkeiten behauptet.

## Validierung

- SEO-Smoke-Test: alle 40 Sitemap-Seiten bestanden.
- Interne Links: 40 Seiten, maximale Klicktiefe 2, keine fehlenden Sprungziele.
- Affiliate-Integrität: keine fehlenden oder gesperrten Registereinträge.
- Babywalz-Angebots-Gate, KI-Herkunftsgate, Analytics-Vertrag, Erfahrungs-Pilot,
  Navigationsabgleich und Positionierungs-Gate bestanden.
- Neuer Regressionstest: tools/duplo-birth-ui-test.mjs.
- Chromium: 360, 390, 768 und 1440 Pixel; kein horizontaler Dokument-Overflow.
  Bilder dekodiert, CTAs mindestens 44 x 44 Pixel, FAQ/Schema-Parität,
  Sprungziele, Aufklappen und JavaScript-freie Inhalte geprüft.
- Screenshots auf Mobile und Desktop visuell geprüft.
- HTML-Hauptinhalt inklusive geschlossener Detail-/FAQ-Texte, gezählt anhand
  textContent und Leerraumtrennung: Geburt 2152 -> 756 Wörter (rund 65 % weniger),
  DUPLO 2028 -> 1329 Wörter (rund 34 % weniger). Das ist eine
  Inhaltsumfangsmessung, keine Verbesserung von Conversion oder Rankings.

## Nach Veröffentlichung

1. Veröffentlichungsdatum als Messgrenze notieren. Beide URLs live auf Status,
   Canonical, Bilddarstellung und CTAs prüfen.
2. Vier Wochen beobachten, zusätzlich Vorher-/Nachher-Zeiträume mit gleichen
   Wochentagen vergleichen. Bei kleinen Zahlen absolute Besucher und Klicks
   nennen; keine Prozentverbesserung aus einzelnen Besuchen ableiten.
3. DUPLO: GSC-Impressionen/Klicks und Suchanfragen zu Vergleich, Mega Bloks,
   Kompatibilität, Altersgrenzen. Plausible: Einstiege, AI-Referrals,
   Affiliate-Klicks und Weiterklicks getrennt.
4. Geburt: Suchanfragen zu sinnvoll, persönlich und Eltern entlasten beobachten.
   Weggefallene Produktbegriffe können Sichtbarkeit verlieren. Nur gezielt
   ergänzen, wenn echte Nachfrage und eine passende Empfehlung vorhanden sind.
5. Affiliate-Klicks sind keine Verkäufe. Bestellungen und Provisionen separat
   im Partnerprogramm auswerten. Keine Custom Properties voraussetzen.
6. Mit denselben Fragen gelegentlich prüfen, ob Assistenten die URL tatsächlich
   als Quelle nennen. Modell, Datum und Antwort sichern; einzelne Testantworten
   sind keine verlässliche Marktanteils- oder Traffic-Messung.

Kein automatischer Sichtbarkeitsgewinn durch FAQ-Schema oder llms.txt zugesichert.
Vorhandene Indexierbarkeit und Fragenabdeckung bleiben erhalten; Rankings sind
nicht durch lokale Tests validierbar.
