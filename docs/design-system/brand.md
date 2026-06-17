# Brand System

Stand: 2026-06-17

## Markenhaltung

Kleinkind-Welt soll wie ein ruhiger, ehrlicher Eltern-Ratgeber wirken: praktisch, warm, transparent und ohne Hersteller-Sprech.

Die visuelle Sprache darf freundlich sein, aber nicht nach Kindergeburtstag aussehen. Zielgruppe sind Eltern, Grosseltern und Schenkende, nicht Kleinkinder selbst.

## Logo

Aktuelle Assets:

- Horizontales Logo: `images/logo-horizontal.svg`
- Icon/Mark: `images/logo-mark.svg`
- PNG-Mark: `images/logo-mark-512.png`

Einsatz:

- Header: horizontales Logo
- Footer: nur Mark/Icon
- Favicon: Mark/Icon
- Social/OG perspektivisch: besser eigene 1200x630-Grafik auf Basis von Mark + Hero-Bild

Bewertung:

- Der Mark ist stark: rund, freundlich, eigenstaendig.
- Die Wortmarke ist lesbar, solange sie nicht kleiner als ca. 160px Breite dargestellt wird.
- Die Tagline im Logo ist im Header sehr klein. Sie darf nicht die einzige Stelle sein, an der der Claim kommuniziert wird.

Nicht tun:

- Logo nicht mit zusaetzlichen Schatten versehen.
- Logo nicht in farbige Karten setzen.
- Logo nicht mit Emoji-Logo kombinieren.

## Farben

Aktuelle CSS-Variablen in `css/style.css`:

```css
--primary: #2B6F67;
--primary-light: #4F9A8E;
--primary-dark: #203A49;
--accent: #F06F5B;
--accent-light: #FF8A75;
--earth: #605C52;
--earth-light: #8C8576;
--text: #2C2A26;
--text-light: #6B6459;
--bg: #F7F3EE;
--white: #FDFAF6;
--bg-warm: #EFE9DF;
--border: #DDD5C8;
```

Rollen:

- `--primary`: Trust-Bar, Links, wichtige Orientierung
- `--primary-dark`: Footer, starke Kontrastflaechen
- `--accent`: Haupt-CTA, Sterne, positive Hervorhebung
- `--bg` und `--white`: Seitenhintergrund und Karten
- `--bg-warm`: Infoboxen, weiche Modulbereiche

Farbregel:

- Teal und Coral sind die Markenfarben.
- Creme und warme Neutrals halten die Seite elternnah.
- Keine grossen zusaetzlichen Gruen-, Blau- oder Orangefamilien einfuehren.

## Typografie

Primaere Schrift:

- `Nunito`
- Fallback: `Segoe UI`, system-ui, sans-serif

Charakter:

- freundlich
- rund
- gut lesbar
- passend zu Eltern-Ratgeber und Spielzeug-Thema

Regeln:

- H1 gross, aber auf Mobile kompakt und kontrolliert umbrechen.
- Keine negativen Letter-Spacings.
- Lange deutsche Woerter muessen umbrechen koennen.
- Buttons sollen kurz bleiben: "Jetzt lesen", "Empfehlungen entdecken", "Bei Amazon ansehen".

## Bildwelt

Aktueller Hero:

- `images/hero-kind-holzspielzeug.jpg`

Bildprinzip:

- echte Spielsituationen
- warmes Licht
- Kind/Handlung sichtbar
- Holz, Alltag, ruhige Umgebung

Nicht verwenden:

- generische Stockbilder mit uebertriebenem Lachen
- klinisch weisse Produktfreisteller als Hauptbild
- dunkle, unscharfe oder rein atmosphaerische Bilder

