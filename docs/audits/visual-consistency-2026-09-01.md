# Visual Consistency Check - 1. September 2026

## Umfang

- 38 indexierte URLs aus `sitemap.xml`
- Mobile: 390 x 844 px
- Desktop: 1440 x 1000 px
- 76 automatisierte Browser-Checks plus Screenshots der Startseite, beider Auswahl-Hubs und der Seite `spielzeug-unter-20-euro`

Geprueft wurden HTTP-Status, genau eine H1, Header/Main/Footer, horizontaler Overflow, kaputte Bilder, abgeschnittene Labels, zu kleine Hauptaktionen und Browserfehler. Das bekannte Headless-Screenshot-Artefakt aus `docs/design-system/mobile-screenshot-known-issue.md` wurde nicht als CSS-Fehler gewertet; Breiten wurden zusaetzlich im DOM gemessen.

## Beobachtete Orientierungsprobleme

1. Die Startseite zeigte zwei Themenkacheln, einen grossen Kinderwagen-Teaser und elf gleichgewichtete Situationslinks nacheinander. Dadurch war kein klarer Einstieg erkennbar.
2. Die Altersnavigation mischte Monate und Jahre. Besonders `12-18 Monate` verdeckte den alltaeglichen Suchbegriff `1 Jahr`, waehrend Geschenkseiten mit Geburtstagen arbeiteten.
3. Die Budget-Seite kombinierte einen grossen Lifestyle-Hero mit weiteren Lifestyle-Produktbildern. Das wirkte doppelt, teilweise zu persoenlich und bei weissen Bildflaechen uneinheitlich.
4. Alters- und Geschenk-Hub boten passende Inhalte, aber keinen direkten Wechsel zwischen Entwicklungsphase und Geburtstag.

## Umgesetzt

- Startseite: vier redaktionell kuratierte Schnellstarts unter der Formulierung `Womit koennen wir dir gerade helfen?`.
- Startseite: klare Alterszeile mit `1 Jahr / 12-18 Monate` und `1 1/2-2 Jahre / 18-24 Monate`.
- Seltenere Alltagssituationen bleiben in einem kompakten aufklappbaren Bereich intern verlinkt.
- Alters- und Geschenk-Hub besitzen eine gemeinsame Querorientierung zwischen Entwicklungsphase und Geburtstag.
- `spielzeug-unter-20-euro`: kompakter textbasierter Einstieg, sichtbarer Breadcrumb und drei einheitliche Produktfreisteller aus dem freigegebenen Babywalz-Feed.
- Die drei Produktkapitel verwenden denselben Lesefluss: Spielmoment, Produkt, Einordnung, Gesamtpreis, ein Haupt-CTA.

`Schnell gefunden` ist bewusst keine behauptete Analytics-Rangliste. Die Auswahl priorisiert die zentralen Nutzeraufgaben Alter, Geschenk, Budget und Kinderwagen.

## Ergebnis

Der finale automatisierte Lauf meldet **0 Findings in 76 Checks**. Es wurden keine horizontalen Ueberlaeufe, kaputten Bilder, abgeschnittenen Kontrolltexte, fehlenden Hauptstrukturen oder Browserfehler gefunden.

Die Templates duerfen weiterhin unterschiedliche redaktionelle Charaktere haben. Konsistent sind jetzt der Einstieg, die Altersbegriffe, die Querlinks und der Weg zur naechsten Entscheidung.
