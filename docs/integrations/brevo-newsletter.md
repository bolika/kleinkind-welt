# Brevo Newsletter Integration

Stand: Juni 2026

Diese Integration verbindet das eigene Newsletter-Formular auf `/kaufhilfen#eltern-newsletter` mit Brevo per Double-Opt-In.

## Brevo-Voraussetzungen

In Brevo anlegen:

- Eine Hauptliste, z. B. `Eltern-Newsletter`.
- Ein Double-Opt-In Template mit Bestätigungslink `{{ params.DOIurl }}`. Wichtig: In den Advanced Settings des Templates muss das Tag `optin` gesetzt sein, sonst gibt die API den Fehler "An active DOI template does not exist".
- Kontaktattribute:
  - `VORNAME` als Text.
  - `GEBURTSMONAT` als Datum.
  - `EINSTIEGSSTUFE` als Text/Kategorie.

Das Formular übergibt den optionalen Vornamen als `VORNAME` und den gewählten Altersbereich als `EINSTIEGSSTUFE`. Wenn ein Geburtsmonat gesetzt ist, wird er als erster Tag des Monats gespeichert, z. B. `2025-03-01`.

Aktuelle Werte für `EINSTIEGSSTUFE`:

- `0-6`
- `6-12`
- `12-18`
- `18-24`
- `2-jahre`
- `3-jahre`
- `geschenke-geburtstage`

## Netlify Environment Variables

In Netlify unter Site settings -> Environment variables setzen:

```txt
BREVO_API_KEY=...
BREVO_NEWSLETTER_LIST_ID=...
BREVO_DOI_TEMPLATE_ID=1
BREVO_DOI_REDIRECT_URL=https://kleinkind-welt.de/kaufhilfen?newsletter=confirmed#eltern-newsletter
```

Optionale Overrides:

```txt
BREVO_BIRTHMONTH_ATTRIBUTE=GEBURTSMONAT
BREVO_INTEREST_ATTRIBUTE=EINSTIEGSSTUFE
BREVO_FIRSTNAME_ATTRIBUTE=VORNAME
```

## Endpoint

Das Frontend sendet an:

```txt
/api/newsletter-signup
```

Netlify leitet per `_redirects` intern weiter an:

```txt
/.netlify/functions/newsletter-signup
```

Der Brevo API-Key bleibt serverseitig in der Function und wird nicht im Browser ausgeliefert.

## Testablauf

1. Environment Variables in Netlify setzen.
2. Deploy auslösen.
3. Auf `/kaufhilfen#eltern-newsletter` mit eigener E-Mail testen.
4. Prüfen:
   - Formular zeigt Erfolgsmeldung.
   - Double-Opt-In-Mail kommt an.
   - Nach Klick wird zur Redirect-URL zurückgeleitet.
   - Kontakt landet in der richtigen Brevo-Liste.
   - Attribute `VORNAME`, `EINSTIEGSSTUFE` und optional `GEBURTSMONAT` sind gesetzt.

## Freebie-Links in Brevo-Mails

Für verfügbare Kategorien sollten Mails zwei CTA-Links enthalten: eine mobile Leseversion und eine PDF-/Desktop-Version. Nutzer dürfen beide Varianten öffnen.

Aktuell verfügbar:

```txt
12-18 Monate - Mobile:
https://kleinkind-welt.de/freebies/spielideen-kompass-12-18-monate-mobile

12-18 Monate - Desktop/PDF:
https://kleinkind-welt.de/freebies/spielideen-kompass-12-18-monate.pdf
```

Empfohlene CTA-Texte:

- `Am Handy lesen`
- `PDF speichern oder drucken`

Einfache Brevo-Textvorlage:

```txt
Du kannst dir den Kompass in zwei Versionen öffnen:

Am Handy lesen:
https://kleinkind-welt.de/freebies/spielideen-kompass-12-18-monate-mobile

PDF speichern oder drucken:
https://kleinkind-welt.de/freebies/spielideen-kompass-12-18-monate.pdf
```

Für alle anderen `EINSTIEGSSTUFE`-Werte ist der passende Kompass noch in Arbeit. Diese Kontakte bleiben trotzdem im Newsletter und bekommen die passende Version nachgeliefert, sobald sie fertig ist.
