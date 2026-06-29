# Implementation Roadmap: Kleinkind-Welt.de

Datum: 2026-06-29

## Phase 1: Foundation, Wochen 1-4

Ziel: vorhandene Autorität besser strukturieren und Messbarkeit sichern.

### Tasks

- GSC-Daten exportieren: Top-Seiten, Top-Queries, CTR, Positionen.
- Plausible-Events prüfen: Affiliate-Klick, Newsletter-Submit, DOI-Erfolg.
- CSS/HTML-Cache-Busting-Prozess dokumentieren, damit Style-Änderungen live sicher greifen.
- Hub `/spielzeug-nach-alter/` erstellen.
- Hub `/geschenke-kleinkind/` erstellen.
- Hub `/saisonale-empfehlungen/` erstellen.
- Autorenseite `/autor/boris-nazarov/` erstellen.
- Person-Schema von Artikeln auf Autorenseite referenzieren.
- Redaktionsrichtlinie oder Methodik-Unterseite ergänzen.
- Sitemap um neue Hubs erweitern.

### Akzeptanzkriterien

- Jeder Hub hat mindestens 6 interne Links zu Artikeln.
- Jeder Artikel aus dem Hub hat einen Rücklink zum Hub.
- GSC und Plausible können pro URL und Event ausgewertet werden.

## Phase 2: Expansion, Wochen 5-12

Ziel: Long-Tail-Cluster schließen und Newsletter als SEO-Funnel stärken.

### Tasks

- 8 neue Artikel aus dem Content-Kalender veröffentlichen.
- Bestehende Top-Artikel mit Vergleichstabellen und "Passt / passt nicht"-Modulen ergänzen.
- Altersbezogene Newsletter-CTA auf allen Altersartikeln einbauen.
- Freebie-Varianten für 0-6, 6-12, 18-24 Monate planen.
- Interne Linkmodule standardisieren: "Passt auch zu", "Nächster Entwicklungsschritt", "Nicht kaufen".
- FAQ anhand GSC-Queries erweitern.

### Akzeptanzkriterien

- Mindestens 30 indexierbare Content-Seiten.
- Mindestens 3 thematische Hubs.
- Jede neue Seite hat Article oder CollectionPage/ItemList-Schema.
- Newsletter-Opt-ins organisch werden getrennt von direkten Zugriffen gemessen.

## Phase 3: Scale, Wochen 13-24

Ziel: Themenautorität und AI-Zitierbarkeit ausbauen.

### Tasks

- 15-20 weitere Artikel in Alters-, Geschenk-, Situation- und Sicherheitsclustern.
- Eigene Datenpunkte sammeln: "Was Eltern wirklich vermeiden", "Top Fehlkäufe", "Spielzeug-Rotation".
- Vergleichstabellen als wiederkehrendes Format ausbauen.
- `llms.txt` monatlich aktualisieren.
- Externe Erwähnungen anstoßen: Pinterest, Elternblogs, Kita-/Hebammen-nahe Ressourcen, lokale München-Kontexte.
- Alternative Affiliate-Programme testen.

### Akzeptanzkriterien

- Mindestens 50 indexierbare Content-Seiten.
- 6 Hubs aktiv.
- Mindestens 10 Seiten mit starkem Tabellen-/Listenformat.
- Mindestens 5 externe Erwähnungen oder natürliche Links.

## Phase 4: Authority, Monate 7-12

Ziel: Kleinkind-Welt als vertrauenswürdige U3-Spielzeug-Quelle etablieren.

### Tasks

- Jahresreport "Spielzeug für Kleinkinder: Was Eltern wirklich kaufen und bereuen".
- Experten-/Fachquellen ergänzen: Pädagogik, Ergotherapie, Logopädie, Produktsicherheit.
- Top-Artikel halbjährlich redaktionell neu prüfen.
- Autor-Profil und About-Seite mit Medien-/Kontaktoption ausbauen.
- Evergreen-Hubs mit saisonalen Einstiegspunkten verbinden.
- AI-Suchmonitoring manuell starten: ChatGPT, Perplexity, Google AI Overviews.

### Akzeptanzkriterien

- Mindestens 80 Artikel/Hubs.
- Top-20-Rankings für mehrere Long-Tail-Cluster.
- Wiederkehrende Newsletter-Anmeldungen aus organischem Traffic.
- Klare Quellen-/Methodenlage auf allen Top-Seiten.

## Sofortaufgaben

1. Hub-Struktur entscheiden und erste drei Hub-Seiten bauen.
2. Autorenseite erstellen.
3. Content-Kalender Juli/August umsetzen.
4. Interne Links von Startseite, Footer und Artikeln zu Hubs setzen.
5. GSC-Export einbinden und Priorisierung nach echten Impressionen nachschärfen.
