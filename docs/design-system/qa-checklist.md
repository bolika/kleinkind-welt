# QA Checklist

Stand: 2026-06-17

Diese Checkliste gilt vor neuen Artikeln, groesseren Layout-Aenderungen und Deployments.

## Visueller Check

- Logo im Header sichtbar und nicht gequetscht.
- Farbwelt nutzt Teal/Coral/Creme, keine neue dominante Farbfamilie.
- Haupt-CTA ist Coral.
- Trust-Flaechen nutzen Teal oder Dunkelblau.
- Text hat genuegend Kontrast.
- Keine Karten in Karten.
- Mobile H1 bricht sauber um.
- Keine horizontal abgeschnittenen Inhalte.

## Mobile Check

Pruefen bei ca. 390px Breite:

- Header passt.
- Burger-Menue laesst sich oeffnen.
- Hero-Text wird nicht abgeschnitten.
- Trust-Bar ist einspaltig.
- Produktboxen sind voll lesbar.
- Tabellen scrollen horizontal statt die Seite aufzuziehen.
- Cookie-Banner bricht Text um.

## Link Check

Pruefen:

- Interne Links zeigen auf existierende Artikel.
- Alte Slugs haben Redirects, falls live genutzt.
- Canonical URLs sind clean und ohne `.html`.
- Footer-Links funktionieren.
- Keine Links auf nicht vorhandene Bilder wie `/img/logo.png` oder `/img/og-image.jpg`.

Bekannte kritische Stelle:

- Startseiten-Teaser duerfen nicht mehr auf `artikel/holzspielzeug-kleinkind.html` zeigen, wenn der Artikel nur als `holzspielzeug-vs-plastikspielzeug.html` existiert.

## SEO / Structured Data

- Title enthaelt Suchintent.
- Meta Description ist konkret und nicht generisch.
- Canonical korrekt.
- JSON-LD passt zum Seitentyp.
- `datePublished` und `dateModified` stimmen.
- Breadcrumbs vorhanden bei Artikeln.
- FAQPage nur verwenden, wenn sichtbare FAQ vorhanden ist.

## Trust / Rechtliches

- Affiliate-Hinweis frueh sichtbar.
- Affiliate-Links: `rel="sponsored noopener nofollow"`.
- Keine sichtbaren "Test"- oder "Testsieger"-Claims.
- Produktauszeichnungen als "Top-Empfehlung", "Preis-Leistungs-Empfehlung" oder "Empfehlung nach Auswahlkriterien" formulieren.
- Autor/Redaktionshinweis vorhanden.
- Quellenbox bei stark beratenden Artikeln.
- Datenschutztext passt zu Plausible und Cookie-Banner.

## Content-Qualitaet

- Artikel beantwortet die Nutzerfrage in den ersten 150 Woertern.
- Kurzantwort ist konkret.
- Empfehlungen haben klare Einschraenkungen.
- Es gibt mindestens einen "nicht ideal wenn"-Hinweis.
- Preisangaben sind als Richtwerte markiert.
- Altersangaben sind klar.
- Sicherheitshinweise bei Kleinteilen, Bad, Lautstaerke oder Bewegungsspielzeug.

## Technischer Check

Minimal lokal pruefen:

```sh
python3 -m http.server 5500 --bind 127.0.0.1
```

Dann im Browser:

- `http://127.0.0.1:5500/`
- ein Altersartikel
- ein Vergleichsartikel
- eine Rechtliches-Seite

Optionaler Screenshot-Check:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --no-first-run --force-device-scale-factor=1 --window-size=390,900 --screenshot=/tmp/kleinkind-mobile.png http://127.0.0.1:5500/
```
