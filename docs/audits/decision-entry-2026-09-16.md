# Gezielte Einstiegsoptimierung, 16.09.2026

## Grundlage und Grenze

Plausible 07.-13.09. zeigte jeweils nur zwei Besucher auf DUPLO und Geschenke 3 Jahre. Das sind Hinweise fuer eine gezielte Pruefung, keine belastbaren Conversion- oder Designurteile. Kein weiterer seitenweiter Umbau.

## Lokal umgesetzt

- Geschenke 3 Jahre: doppelte Kaufbox entfernt; drei Spielmoment-Anker direkt vor der Produktauswahl. Kaufhilfe und Methodik nach hinten verschoben, alle sechs Produktkarten und weiteren Ideen behalten.
- Erste DUPLO-Karte: kuerzere Einordnung, Preis und Haendlerbutton vor den Vor-/Nachteilen. Bestehende Babywalz-Zuordnung unveraendert; keine neuen Produktlinks oder Preisversprechen.
- Falsche Aussage zur vollstaendigen LEGO-Kompatibilitaet korrigiert; Link zum bestehenden Kompatibilitaetsvergleich. Unpassende Knete-Aussage beim Fingerfarben-Set entfernt.
- Titel ohne widerspruechliche Ideenzahl; Metadaten, llms.txt und Sitemap fuer Geschenke 3 Jahre angepasst. Historische Produktpruefdaten nicht als neu geprueft ausgegeben.
- DUPLO: drei direkte Antwortwege bereits unter der Einleitung, bevor Autor und Langfassung folgen. Vergleich, Quellen und FAQ unveraendert.

## Validierung

- SEO-Smoke: 40 Seiten; interne Links; Affiliate-Ledger; Babywalz-Angebots-Gate; Analytics-Vertrag; Erfahrungskennzeichnung; KI-Bildkennzeichnung; Content-Briefs; git diff --check bestanden.
- DUPLO/Geburt: bestehender Playwright-Test auf 360/390/768/1440 px bestanden, inklusive FAQ/Schema-Abgleich, Bilder und Anker.
- Neuer decision-entry-ui-test.mjs: gleiche vier Breiten, sechs Produktkarten, alle Sprungziele, geladene Feed-Bilder, keine horizontale Ueberbreite, nutzbare Links ohne JavaScript.
- Geschenke-3-Jahre bei 390 px: erster alter Haendlerbutton bei ca. 2913 px; neuer Babywalz-Button bei ca. 2362 px. Gemessen mit frisch datierter lokaler Feed-Fixture, nicht als aktuelle Preis-/Verfuegbarkeitspruefung. Kein behaupteter Conversion-Uplift.
- Screenshots fuer mobilen Einstieg/Produktkarte und Desktop kontrolliert.
- Merchant-Event-Test bestanden: Affiliate-Klick plus genau ein nicht-interaktives Haendlerziel. Test blockiert Analytics-Netzwerk bewusst, verschmutzt keine Besuchsdaten und beweist NICHT den Eingang bei Plausible.

## Noch offen / Hilfe benoetigt

Plausible-Backend-Empfang ist unbestaetigt. Kein nutzbarer Plausible-Connector in dieser Sitzung gefunden. Bitte im Dashboard pruefen, dass die Ereignisziele Affiliate-Klick, Affiliate-Babywalz und Affiliate-Amazon angelegt sind. Ein kontrollierter Klick aus einem nicht ausgeschlossenen Browser/Netzwerk kann danach mit Zeit und Ziel dokumentiert und im Dashboard abgeglichen werden. Die eigene IP ist laut Nutzer ausgeschlossen; ein Test von dort ist kein geeigneter Empfangsnachweis. Keine echte Bestellung erforderlich.

GSC: heute keine erneute Indexabfrage und keine Einreichung. Der letzte bestaetigte Stand bleibt der Bericht vom 14.09.; naechster sinnvoller Vergleich ab 21.09. Keine automatische Wiedervorlage eingerichtet.

Status: nur lokal umgesetzt, nicht committed, gepusht oder veroeffentlicht.
