# Analytics-Event-Taxonomie

Stand: 26.08.2026  
System: Plausible Analytics ohne Cookies

## Grundregeln

- Keine E-Mail-Adresse, kein Geburtsmonat, keine URL-Parameter mit Tokens und keine Freitexte als Event-Property senden.
- Ereignisnamen bleiben stabil; Änderungen an Properties erhöhen `event_schema`.
- `seite` ist ein Slug ohne Domain und Querystring.
- `platzierung` beschreibt die UI-Position, nicht den sichtbaren Buttontext.
- Fehlende Werte werden als `nicht_gesetzt` erfasst, nicht als wechselnde leere Werte.
- Affiliate-Provision und redaktioneller Rang bleiben getrennt.

## Kernereignisse

| Ereignis | Zweck | Pflicht-Properties | Aktuelles Schema |
|---|---|---|---:|
| `Affiliate-Klick` | Ausgehenden Händlerklick messen | `seite`, `produkt`, `produkt_id`, `platzierung`, `partner`, `haendler`, `angebot`, `ziel_host`, `event_schema` | 3 |
| `Newsletter-Formular` | DOI-Start oder Formularfehler messen | `seite`, `platzierung`, `status`, `segment`, `quelle`, `event_schema` | 2 |
| `Newsletter bestätigt` | Abgeschlossenen DOI messen | `freebie`, `alter`, `event_schema` | 1 |
| `Freebie Download` | Gewählte Freebie-Version messen | `freebie`, `seite`, `version`, `event_schema` | 1 |

## Kontrollierte Werte

### `Newsletter-Formular.status`

- `doi-gestartet`: API hat die Anmeldung angenommen; E-Mail-Bestätigung steht noch aus.
- `fehler`: API- oder Verarbeitungsfehler; keine Annahme behaupten.

### `Newsletter-Formular.segment`

- `0-6`, `6-12`, `12-18`, `18-24`, `2-jahre`, `3-jahre`, `geschenke-geburtstage`
- `nicht_gesetzt`, falls das Formular kein Segment enthält

### `Affiliate-Klick.platzierung`

- `hero-product-teaser`
- `kaufbox-primary`
- `kaufbox-alternative`
- `produktkarte`
- `vergleichstabelle`
- `sidebar-banner`
- `intext`

Neue Placements werden nur ergänzt, wenn sie eine eigenständige Nutzerentscheidung abbilden.

## Funnel und Berechnung

1. Einstiegsseite: Seitenaufruf aus Plausible beziehungsweise organischer Klick aus GSC.
2. Händlerinteresse: `Affiliate-Klick` je Seite, Produkt und Placement.
3. Lead-Start: `Newsletter-Formular` mit Status `doi-gestartet`.
4. Lead bestätigt: `Newsletter bestätigt`.
5. Nutzwert abgerufen: `Freebie Download` nach Version.

Berechnungen:

- Affiliate-Outbound-CTR = `Affiliate-Klick` / Seitenaufrufe der Seite
- Formularrate = `doi-gestartet` / Seitenaufrufe mit Formular
- DOI-Rate = `Newsletter bestätigt` / `doi-gestartet`
- Downloadrate = eindeutige bestätigte Nutzer mit Download / bestätigte Nutzer

Plausible und Brevo können aufgrund von Datenschutz, Blockern und unterschiedlicher Zählweise abweichen. Abweichungen werden dokumentiert, nicht nachträglich glattgezogen.
