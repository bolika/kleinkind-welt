# Known Issue: Mobile Screenshots Rechts Abgeschnitten

Stand: 2026-06-29

## Kurzfassung

Mobile Screenshots, die per Chrome Headless CLI mit `--window-size=390,...` erzeugt werden, wirken in diesem Projekt wiederholt am rechten Rand vertikal abgeschnitten. Das ist ein bekanntes Screenshot-/Headless-Rendering-Problem und nicht automatisch ein echter Mobile-CSS-Bug.

Bitte dieses Verhalten nicht jedes Mal neu als Layout-Fehler debuggen.

## Beobachtung

Typisches Muster:

- Der Screenshot zeigt rechts abgeschnittene Texte oder Karten.
- Die Seite wirkt wie ein schmaler Ausschnitt eines breiteren Layouts.
- Nach mehrfachen CSS-Korrekturen kann der Screenshot weiterhin abgeschnitten aussehen.
- Im echten Browser oder bei objektiver DOM-Prüfung ist das Layout oft in Ordnung.

## Was Vor Einer Optimierungsrunde Geprüft Werden Soll

Nur dann CSS anfassen, wenn mindestens einer dieser Punkte zutrifft:

- `document.documentElement.scrollWidth > document.documentElement.clientWidth`
- Im normalen Browser mit Mobile-Emulation ist horizontaler Overflow sichtbar.
- Auf einem echten Gerät ist seitliches Scrollen oder abgeschnittener Inhalt sichtbar.
- Eine konkrete CSS-Ursache ist erkennbar, z. B. `width: 100vw` in gepaddeten Containern, feste Tabellenbreiten, `white-space: nowrap`, zu breite Buttons oder lange Breadcrumbs.

Wenn nur der Headless-Screenshot rechts abgeschnitten aussieht, aber die objektiven Checks unauffällig sind, gilt das als bekanntes Tool-Artefakt.

## Empfohlene Prüfung

Im Browser-DevTools oder per Console:

```js
document.documentElement.scrollWidth;
document.documentElement.clientWidth;
document.body.scrollWidth;
document.body.clientWidth;
```

Wenn `scrollWidth` nicht größer als `clientWidth` ist, liegt wahrscheinlich kein echter horizontaler Overflow vor.

## Wichtig Für Künftige Arbeit

- Mobile Headless-Screenshots nicht als alleinige Wahrheit verwenden.
- Nicht in wiederholte CSS-Fix-Schleifen gehen, nur weil der Screenshot rechts abgeschnitten wirkt.
- Screenshot-Befund immer mit DOM-Breite oder echter Browser-Mobile-Emulation gegenprüfen.
- Dieses bekannte Verhalten ist nicht kritisch, solange echte Nutzeransichten nicht betroffen sind.

