# Design-System kleinkind-welt.de (v2, Stand 2026-07-27)

Verbindliche Referenz für alles Neue (Seiten, Artikel, Komponenten).
Regel Nr. 1: Keine neuen Hex-Werte, Radien, Schatten oder Transition-Zeiten erfinden. Immer die Tokens aus `css/style.css` (`:root`) verwenden.

## 1. Farben

| Token | Wert | Verwendung |
|---|---|---|
| `--primary` | `#2B6F67` (Teal) | Markenfarbe, Links, aktive Zustände, Bento-CTA |
| `--primary-light` | `#27665F` | Hover auf Primärflächen |
| `--primary-dark` | `#203A49` | Footer, dunkle Flächen, Hero-Wash-Basis |
| `--accent` | `#B33D31` (Koralle dunkel) | Bewertungssterne, Cons, dekorative Akzente |
| `--accent-light` | `#FF8A75` | Proof-Haken auf dunklem Grund, Kicker im Hero (`#FFD9CF`) |
| `--accent-action` | `#B33D31` | Alle Kauf-CTAs (btn-hero, btn-amazon, btn-inline) |
| `--bg` | `#F7F3EE` | Seitenhintergrund |
| `--white` | `#FDFAF6` | Karten, Panels |
| `--bg-warm` | `#EFE9DF` | Hervorgehobene Boxen |
| `--border` | `#DDD5C8` | Alle Rahmen |
| `--text` / `--text-light` / `--text-muted` | `#2C2A26` / `#5F574D` / `#7A7268` | Text-Hierarchie |

Ausnahme: Amazon-Tabellen-Buttons (`.btn-table`) behalten `#FF9900` (Markenwiedererkennung, bewusste Entscheidung).

## 2. Typografie

- **Display-Font: Outfit** (Google Fonts, Gewichte 600/700/800, `display=swap`).
  Gilt automatisch für `h1, h2, h3, .section-title, .logo` über `--font-display`.
- **Body-Font: system-ui** über `--font-body`. Kein zweiter Webfont.
- Jede neue HTML-Seite braucht im `<head>` (vor dem Stylesheet):
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  ```

### Skala

| Rolle | Größe |
|---|---|
| Hero-H1 (Startseite, cinematic) | `clamp(2.6rem, 5vw, 4rem)` |
| Hub-H1 | `clamp(2.2rem, 5vw, 3.8rem)` |
| Sektionstitel (H2) | `clamp(1.7rem, 3vw, 2.4rem)` |
| Karten-H3 | `1.05` bis `1.1rem` |
| Fließtext | mindestens `1rem` |
| Labels/Kicker | `0.74` bis `0.84rem`, uppercase, letter-spacing |

H1 immer maximal 2 bis 3 Zeilen: breiten Container nutzen, nicht die Schrift verkleinern lassen (`text-wrap: balance`).

## 3. Radius, Schatten, Motion (nur diese Tokens)

| Token | Wert | Verwendung |
|---|---|---|
| `--r-sm` | `8px` | Buttons, Badges, kleine Boxen |
| `--r-md` | `14px` | Karten, große Panels (`--radius` ist Alias) |
| `--r-pill` | `999px` | Chips, Pills, runde Buttons |
| `--shadow-sm` | ruhige Grundtiefe | Karten im Ruhezustand |
| `--shadow-md` | Hover-Tiefe | Karten-Hover, CTAs |
| `--shadow-lg` | starke Tiefe | Modals, Feature-Panels |
| `--motion-fast` | `0.15s ease` | Farbe, Border, Opacity |
| `--motion-lift` | `0.25s cubic-bezier(0.22,1,0.36,1)` | Transform, Schatten |

Standard-Hover für klickbare Karten: `transform: translateY(-3px)` + `--shadow-md` + Borderfarbe Richtung Teal. Nichts anderes erfinden.

## 4. Abstände

- Sektionen: `padding: var(--section-pad) 20px` mit `--section-pad: clamp(80px, 10vw, 128px)`.
- Keine `border-top`-Trennlinien zwischen Sektionen. Wechsel über Hintergrundflächen (`--bg` vs. `--white` vs. Verlaufsflächen).

## 5. Icons

- Eine Icon-Sprache: Inline-SVG Line-Icons, `stroke-width: 1.85` (Chips: über CSS gesetzt), `fill: none`, runde Kappen. Vorbild: Situations-Chips auf der Startseite.
- **Keine System-Emojis in der UI.** (Emojis in Artikel-Fließtext sparsam ok.)
- Akzent in Icons: Koralle-Haken (`--accent` bzw. `#F06F5B` auf dunklem Grund).

## 6. Badges

- Maximal 2 Badges pro Viewport.
- Nur mit echter Information: "Beliebt" (belegbar via Plausible), "Kostenlos", "Sommer-Favorit" (saisonal).
- "Neu" nur für Inhalte jünger als 14 Tage, danach entfernen.
- In der Sektion "Neu auf Kleinkind-Welt" keine Neu-Badges (redundant).

## 7. Komponenten (Startseite)

- **Cinematic Hero**: `.hero-image.hero-image--cinematic`. Desktop: dunkler Radial-Wash, zentrierte weiße H1, Proof-Zeile `.hero-proof` (ersetzt die alte Trust-Bar). Mobile: helles Layout, Bild oben.
- **Bento-Grid**: `.bento-grid` (3 Spalten, `grid-auto-flow: dense`). Bausteine: `.bento-tile`, `.bento-feature` (span 2x2, Foto + Verlaufs-Overlay, Zoom auf Hover), `.bento-cta` (Teal-Kachel). Zellen müssen lückenlos aufgehen: Feature zählt 4 Zellen, Gesamtzahl durch 3 teilbar (aktuell 4 + 8 = 12).
- **Situations-Chips**: `.situation-tile` mit Inline-SVG. Mobile: horizontale Scroll-Reihe.

## 8. Motion-Regeln

- Frequenz-Regel: je öfter eine Interaktion, desto weniger Animation. Navigation und Formulare bekommen keine Effekte außer Farbwechsel.
- **Scroll-Reveal**: `js/scroll-reveal.js` (auf jeder Seite vor `</body>` eingebunden). Einmaliger Fade + 14px Rise pro Sektion, Hero ausgenommen. Respektiert `prefers-reduced-motion`, degradiert ohne JS zu sofort sichtbar.
- Kein GSAP, keine Parallax, keine Endlos-Animationen, keine Keyframe-Loops.
- `prefers-reduced-motion: reduce` deaktiviert global alle Transitions (steht bereits in style.css). Nie umgehen.

## 9. Checkliste für neue Seiten/Artikel

1. Outfit-Font-Links im `<head>` (siehe oben).
2. Stylesheet mit aktuellem Cache-Bust-Parameter einbinden (`?v=JJJJMMTT-kurzname`), bei CSS-Änderungen in ALLEN Dateien hochzählen.
3. `<script src="/js/scroll-reveal.js" defer></script>` vor `</body>`.
4. Nur Tokens verwenden (Farben, Radius, Schatten, Motion, `--section-pad`).
5. Keine Emojis als UI-Icons, Badges nach Regel 6.
6. Buttons: Kauf-Aktion = `--accent-action`, Navigation = Teal, Text immer weiß auf dunklem Grund.
7. Artikel-Template weiterhin von `artikel/motorikspielzeug-test.html` ableiten.

## 10. Herkunft

Redesign 2026-07-27 auf Basis Design-Review (3 Personas: Lisa/mobil-Ratgeber, Thomas/Vergleicher, Karin/Geschenke). Frameworks: Motion-Prinzipien (Krehel primär, Tompkins sekundär, Kowalski selektiv) + Awwwards-Layoutregeln (adaptiert, ohne GSAP). Artefakt mit Begründungen: Design-Review in Claude-Artefakten vom 27.07.2026.
