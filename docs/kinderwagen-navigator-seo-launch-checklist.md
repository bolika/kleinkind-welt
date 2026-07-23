# SEO-Launch-Checkliste für den Kinderwagen-Navigator

Der Navigator bleibt während der geschlossenen Beta `noindex,follow`. Ein indexierbares Quiz mit dünner Datenbasis wäre kein Qualitätsgewinn.

## Harte Freigabe-Gates

- mindestens 20 veröffentlichungsfähige Kombikinderwagen mehrerer Marken
- mindestens zwei veröffentlichungsfähige Matches je Kernpersona
- jede kritische Datenlücke maschinenlesbar erfasst; keine automatisch geschätzten Maße
- alle Referenzprofile und technischen Beta-Gates grün
- vollständiger Tastatur-, Smartphone- und Screenreader-Kernpfad geprüft
- fünf moderierte Eltern-Tests abgeschlossen
- mindestens 50 abgeschlossene Beta-Ergebnisse ausgewertet
- negative Rückmeldungen und systematische Fehlmatches geprüft
- Bewertungsmethode, Datenquellen und Affiliate-Unabhängigkeit sichtbar
- rechtssicheres Produktbild je veröffentlichtem Modell im Medienregister dokumentiert

Der aktuelle Stand lässt sich ohne Veröffentlichung prüfen:

```bash
node tools/kinderwagen-index-readiness.mjs
```

Der finale Release-Check schlägt bei einem offenen Gate absichtlich fehl:

```bash
node tools/kinderwagen-index-readiness.mjs --strict
```

## Erst nach fachlicher Freigabe

1. `noindex,follow` entfernen.
2. Route mit aktuellem `lastmod` in `sitemap.xml` aufnehmen.
3. Pilotstatus in `llms.txt` auf öffentlich indexierbar aktualisieren.
4. WebApplication-Strukturdaten und Canonical erneut prüfen.
5. Dedicated Social-/Open-Graph-Vorschau erstellen.
6. Indexierung in Google Search Console anstoßen und echte Suchanfragen beobachten.

SEO-Text bleibt unterhalb des Tools. Der erste Viewport beantwortet weiterhin die Aufgabe „passenden Kinderwagen finden“ und wird nicht für Suchbegriffe aufgebläht.
