# Brevo: Navigator-Warteliste

Erfasst Interessenten für Kinderwagen-Segmente, die der Navigator noch nicht vergleicht
(Reisebuggy, Buggy, Geschwister- und Zwillingswagen, „noch unsicher"). Aus einem
Totalabsprung wird ein Lead, und die Segmentverteilung zeigt, welches Segment als Nächstes
zu bauen lohnt.

## Bausteine in Brevo

| Baustein | ID / Name | Stand |
|---|---|---|
| Liste | **#9** „Navigator-Warteliste" | angelegt |
| Double-Opt-In-Template | **#6** „Navigator-Warteliste DOI" | angelegt |
| Kontakt-Attribut | `SEGMENTWUNSCH`, Typ **Text** | prüfen |

Das Template-HTML liegt in `brevo-waitlist-doi-template.html`. In Brevo einfügen und
speichern; es nutzt dieselbe Marke und dieselbe Struktur wie das Newsletter-DOI-Template.

## Umgebungsvariablen in Netlify

| Variable | Wert | Pflicht |
|---|---|---|
| `BREVO_WAITLIST_LIST_ID` | `9` | ja |
| `BREVO_WAITLIST_DOI_TEMPLATE_ID` | `6` | ja |
| `BREVO_API_KEY` | bestehend | ja |
| `SITE_URL` | bestehend | ja |
| `BREVO_SEGMENT_ATTRIBUTE` | Default `SEGMENTWUNSCH` | nein |
| `BREVO_WAITLIST_DOI_REDIRECT_URL` | Default `/newsletter-bestaetigt?warteliste=1` | nein |

Nach dem Setzen einen neuen Deploy auslösen — Netlify liest Umgebungsvariablen nur beim
Build.

Fehlt eine der beiden Pflichtvariablen, antwortet der Endpunkt mit HTTP 503 und der
Meldung „Die Warteliste ist technisch noch nicht fertig eingerichtet." Das ist gewollt: eine
Anmeldung vorzutäuschen wäre schlechter als eine ehrliche Fehlermeldung.

## Platzhalter im Template

| Platzhalter | Bedeutung |
|---|---|
| `{{ params.DOIurl }}` | Bestätigungslink. Wird von Brevos `doubleOptinConfirmation`-Endpunkt automatisch eingesetzt — **nicht** von unserer Funktion übergeben. |
| `{{ contact.SEGMENTWUNSCH }}` | Gewähltes Segment, z. B. „Reisebuggy" |
| `{% if contact.SEGMENTWUNSCH %}` | Fallback-Text, falls das Attribut fehlt (siehe unten) |

## Verhalten bei fehlendem Attribut

Existiert `SEGMENTWUNSCH` in Brevo nicht, lehnt die API den kompletten Aufruf mit HTTP 400
ab. Die Funktion wiederholt die Anmeldung deshalb ohne Attribute, damit der Lead nicht
verloren geht. Folgen:

- Der Kontakt landet trotzdem in Liste #9.
- Welches Segment gefragt war, steht dann nur im Netlify-Funktionslog, nicht am Kontakt.
- Das Log enthält eine Warnung mit dem fehlenden Attributnamen.
- Das Template fällt auf die neutrale Formulierung „den von dir gesuchten Kinderwagen-Typ"
  zurück.

Für die Roadmap-Auswertung ist das Attribut trotzdem wichtig — ohne es lässt sich die
Nachfrage nicht ohne Log-Auswertung segmentieren.

## Funktionsweise

1. Nutzer wählt im Navigator einen nicht unterstützten Typ.
2. Route zeigt die ehrliche Grenze plus Wartelisten-Formular (E-Mail + Einwilligung).
3. POST auf `/api/navigator-waitlist` → `netlify/functions/navigator-waitlist.js`.
4. Validierung: E-Mail-Format, Segment gegen Allowlist, Einwilligung gesetzt, Honeypot leer.
5. Brevo `doubleOptinConfirmation` mit Liste #9 und Template #6.
6. Nutzer bestätigt per Klick, Weiterleitung auf `/newsletter-bestaetigt?warteliste=1`.

Das Segment wird zusätzlich als Plausible-Event `warteliste_eingetragen` gezählt.

## Testen

Navigator öffnen, „Reisebuggy" wählen, Adresse eintragen, Häkchen setzen. Erwartet:
„Fast geschafft: Bitte bestätige die Anmeldung in der E-Mail von uns."

Direkt gegen den Endpunkt:

```bash
curl -s -X POST https://kleinkind-welt.de/api/navigator-waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.de","segment":"travel_buggy","consent":true}'
```

## Offen

Die Zielseite `/newsletter-bestaetigt` zeigt Newsletter-Text. Der Parameter
`?warteliste=1` ist gesetzt, damit dort später eine Wartelisten-Variante eingeblendet
werden kann — aktuell sieht ein Wartelisten-Bestätiger noch die Newsletter-Bestätigung.
