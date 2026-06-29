# Site Structure Plan: Kleinkind-Welt.de

Datum: 2026-06-29

## Aktuelle Struktur

```text
/
/artikel/[slug]
/kaufhilfen
/ueber-uns
/bewertungsmethode
/impressum
/datenschutz
/newsletter-bestaetigt
```

Die Struktur ist schlank und indexierbar, aber für Themenautorität fehlen dedizierte Hubs zwischen Startseite und Einzelartikeln.

## Zielstruktur

```text
/
├── /spielzeug-nach-alter/
│   ├── /artikel/spielzeug-0-6-monate
│   ├── /artikel/spielzeug-6-12-monate
│   ├── /artikel/spielzeug-12-18-monate
│   ├── /artikel/spielzeug-18-24-monate
│   ├── /artikel/spielzeug-2-jahre
│   └── /artikel/spielzeug-3-jahre
├── /geschenke-kleinkind/
│   ├── /artikel/geschenke-zur-geburt
│   ├── /artikel/geschenke-1-jahr
│   ├── /artikel/geschenke-2-jahre
│   ├── /artikel/geschenke-3-jahre
│   └── /artikel/weihnachtsgeschenke-kleinkind
├── /motorik-und-entwicklung/
│   ├── /artikel/motorikspielzeug-test
│   ├── /artikel/sprache-foerdern-spielzeug
│   └── neue Entwicklungsartikel
├── /sicheres-spielzeug/
│   ├── /artikel/nachhaltiges-spielzeug-siegel
│   ├── /artikel/holzspielzeug-vs-plastikspielzeug
│   └── /artikel/was-wir-nicht-kaufen
├── /saisonale-empfehlungen/
│   ├── /artikel/outdoor-spielzeug-kleinkind
│   ├── /artikel/badespielzeug-kleinkind
│   └── /artikel/weihnachtsgeschenke-kleinkind
├── /kaufhilfen
├── /autor/boris-nazarov/
├── /ueber-uns
└── /bewertungsmethode
```

## Hub-Anforderungen

Jeder Hub sollte enthalten:

- H1 mit Suchintent.
- Kurze Entscheidungshilfe oberhalb der Karten.
- ItemList-Schema.
- 6-12 interne Karten.
- FAQ mit 3-5 Fragen.
- Link zur Bewertungsmethode.
- Link zur Autorenseite.
- Newsletter-CTA, wenn passend.

## Interne Linking-Regeln

### Altersartikel

Jeder Altersartikel verlinkt:

- vorherige und nächste Altersphase.
- den Alters-Hub.
- mindestens einen Geschenkartikel.
- mindestens einen Sicherheits-/Methodenartikel.
- Kaufhilfen-Freebie.

### Geschenkartikel

Jeder Geschenkartikel verlinkt:

- Geschenk-Hub.
- passende Altersseite.
- Budgetartikel.
- "Was wir nicht kaufen".
- Weihnachtsartikel, wenn saisonal relevant.

### Ratgeberartikel

Jeder Ratgeberartikel verlinkt:

- passenden Kaufartikel.
- Bewertungsmethode.
- mindestens einen Sicherheitsartikel.
- Kaufhilfen oder Newsletter.

## Schema-Plan

| URL-Typ | Schema |
|---|---|
| Startseite | WebSite, Organization |
| Hub | CollectionPage, ItemList, BreadcrumbList |
| Artikel | Article, Person, Organization, BreadcrumbList, FAQPage |
| Autorenseite | ProfilePage, Person |
| Kaufhilfen | Article oder WebPage, BreadcrumbList |
| Bewertungsmethode | WebPage, Organization, BreadcrumbList |

## Sitemap-Qualitätsregeln

Neue URLs nur aufnehmen, wenn:

- Title und Meta Description eindeutig sind.
- H1 genau einmal vorhanden ist.
- Canonical korrekt ist.
- Mindestens 3 interne Links auf die URL zeigen.
- Die Seite nicht nur dünne Kartenliste ist, sondern eigene Entscheidungshilfe enthält.

## Navigation

Empfohlene Hauptnavigation:

- Nach Alter
- Geschenke
- Situationen
- Ratgeber
- Kaufhilfen
- Über uns

Footer zusätzlich:

- Bewertungsmethode
- Affiliate-Hinweis
- Autor
- Datenschutz
- Impressum
