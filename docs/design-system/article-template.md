# Article Template

Stand: 2026-06-17

Diese Struktur ist der empfohlene Standard fuer neue Artikel.

## HTML Head

Pflicht:

- `lang="de"`
- UTF-8
- Viewport
- Favicon: `/images/logo-mark.svg`
- Meta Description
- Title
- CSS-Link
- Canonical ohne `.html`
- Plausible Script
- JSON-LD, passend zum Seitentyp

Canonical-Beispiel:

```html
<link rel="canonical" href="https://kleinkind-welt.de/artikel/slug">
```

## Header

Standard:

```html
<header>
  <div class="nav-inner">
    <a href="/" class="logo"><img src="/images/logo-horizontal.svg" alt="Kleinkind-Welt - Ehrliche Empfehlungen fuer Eltern" class="logo-img" width="220" height="55"></a>
    <nav>
      <button class="nav-toggle" aria-label="Menue oeffnen" aria-expanded="false">☰</button>
      <ul id="nav-menu">
        <li><a href="/#alter">Nach Alter</a></li>
        <li><a href="/#ratgeber">Ratgeber</a></li>
        <li><a href="../ueber-uns.html">Ueber uns</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Hinweis:

- In finalen Deployments duerfen Clean URLs genutzt werden.
- Lokal funktionieren `.html`-Links einfacher.

## Article Hero

```html
<div class="article-hero">
  <div class="article-hero-inner">
    <div class="article-meta">
      <span>Juni 2026</span>
      <span>8 Min. Lesezeit</span>
      <span>Kategorie</span>
    </div>
    <h1>Konkreter Suchintent im Titel</h1>
    <p class="lead">Kurze, ehrliche Zusammenfassung des Nutzens.</p>
  </div>
</div>
```

## Artikelbody Reihenfolge

Empfohlen fuer Kauf-/Empfehlungsartikel:

```html
<div class="article-body">
  <div class="artikel-autor-line">...</div>
  <div class="kurzantwort-box">...</div>
  <div class="kaufbox">...</div>
  <div class="affiliate-hinweis">...</div>
  <div class="toc">...</div>

  <h2 id="...">...</h2>
  <p>...</p>

  <div class="produkt-box">...</div>
  <div class="quellenbox">...</div>
  <div class="faq-section">...</div>
</div>
```

## Kurzantwort

Ziel:

- Direkt antworten.
- Auch fuer AI/Search gut extrahierbar.
- Nicht werblich.

Laenge:

- ca. 70 bis 130 Woerter

Muss enthalten:

- konkrete Antwort
- Alter/Use Case
- wichtigste Einschraenkung

## Kaufbox

Ziel:

- Nutzer, die schnell entscheiden wollen, abholen.

Struktur:

- 4 Zellen
- eine Top-Empfehlung
- eine Alternative
- ein "nicht kaufen wenn"
- ein Sonderfall, z. B. kleine Wohnungen, Budget, draussen

## Produktbox

Mindestinhalt:

- Rang
- Produktname oder Produktkategorie
- Sternebewertung
- Beschreibung
- Pros
- Cons, wenn relevant
- CTA, falls Affiliate

CTA-Regeln:

- "Bei Amazon ansehen"
- "Aktuellen Preis pruefen"
- Kein Druck, keine Knappheit.

## Quellenbox

Nutzen:

- Vertrauen
- Transparenz
- bessere redaktionelle Qualitaet

Soll enthalten:

- Quellenstand
- Bewertungsgrundlage
- Hinweis zu Preisen
- Hinweis auf Affiliate

## Footer

Footer muss enthalten:

- Logo-Mark
- kurzer Website-Claim
- wichtige Artikel
- Rechtliches
- Copyright

## Mobile Check

Vor Abschluss pruefen:

- H1 bricht sauber um.
- Keine Komponente erzeugt horizontales Scrollen, ausser bewusst die Situation-Tiles.
- CTA passt in die Breite.
- Tabellen sind horizontal scrollbar.
- Cookie-Banner verdeckt nicht den Haupt-CTA dauerhaft.

