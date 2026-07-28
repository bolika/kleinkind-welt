# Navigator: Mobile-Audit, 28.07.2026

> **Stand nach der Umsetzung am selben Tag.** Alle unten beschriebenen Befunde sind behoben
> und nachgemessen. Die Ausgangswerte bleiben zur Nachvollziehbarkeit stehen.
>
> | Befund | vorher | nachher |
> |---|---|---|
> | E-Mail-Feld im Ergebnis | 220 px hoch | **48 px** |
> | Antwortoptionen vom Button verdeckt | 1 auf jedem Gerät | **0** |
> | Optionen voll sichtbar (iPhone SE) | 0 von 5 | **1 von 5** |
> | Optionen voll sichtbar (Android 360) | 0 von 5 | **1 von 5** |
> | Optionen voll sichtbar (iPhone 14) | 2 von 5 | **3 von 5** |
> | Beta-Hinweis-Höhe | 82 px | **35 px** |
> | Hinweisboxen im Ergebnis | 2 (226 px) | **1 (124 px)** |
> | Abgeschnittener Text | 2 Stellen | **0** |
> | Touch-Ziele unter 44 px im Ergebnis | 7 von 15 | **1 von 15** |
> | Schrift der Antwortoptionen | 15,36 px | **16 px** |
>
> Das verbleibende Touch-Ziel ist der Inline-Link „Datenschutzerklärung" im Fließtext.
> WCAG 2.5.8 nimmt Inline-Links im Text ausdrücklich aus; ihn auf 44 px zu ziehen würde den
> Absatz zerreißen. Bleibt bewusst so.
>
> Zwei Umsetzungsentscheidungen, die vom naheliegenden Weg abweichen, sind unten bei den
> jeweiligen Punkten begründet: `aria-disabled` statt `disabled`, und der Button steht vor
> der ersten Auswahl inline statt fixiert.

Gemessen mit Chromium, `isMobile: true`, `hasTouch: true`, auf drei realen Viewport-Größen:
iPhone SE (375×667), iPhone 14 (390×844), kleines Android (360×640). Alle Zahlen sind
gemessene Werte aus dem gerenderten DOM, keine Schätzungen.

Referenz für Touch-Ziele: WCAG 2.5.8 verlangt 24×24 CSS-Pixel, die Richtlinien von Apple
und Google empfehlen 44×44.

---

## P1 — Auf kleinen Phones ist keine einzige Antwortoption vollständig sichtbar

Die wichtigste Zahl des Audits:

| Viewport | Optionen vollständig über dem Button | vom Button überlappt |
|---|---|---|
| iPhone SE 375×667 | **0 von 5** | 1 |
| kleines Android 360×640 | **0 von 5** | 1 |
| iPhone 14 390×844 | 2 von 5 | 1 |

Auf den beiden kleineren Geräten muss gescrollt werden, bevor überhaupt eine Antwort
lesbar ist — und das auf der **ersten** Frage, wo der Absprung am höchsten ist.

Die Ursache lässt sich aufteilen. Bis zum Kartenanfang sind es 359 px (Header,
Breadcrumb, Eyebrow, H1, Beta-Box). Innerhalb der Karte kommen weitere 262 px hinzu, bevor
die erste Option beginnt: Fortschrittsbalken, Kicker „FÜR DAS MATCHING ERFORDERLICH", die
H2 und ein vierzeiliger Hilfetext. Die erste Option beginnt damit bei 621 px von 667 px
Viewporthöhe.

**Ansatzpunkte, in der Reihenfolge des Ertrags:** Hilfetext auf der ersten Frage kürzen oder
einklappbar machen, Beta-Box vor der Frage entfernen (siehe P2), Kicker nur auf Desktop
zeigen, H1 auf Mobil kleiner setzen.

## P1 — Der Sticky-Button verdeckt Inhalt und ist vor der Auswahl aktiv

`position: fixed`, `z-index: 95`, Höhe 48 px, `disabled = false`.

Zwei getrennte Probleme:

**Er überlappt.** Auf allen drei geprüften Viewports liegt der Button über einer
Antwortoption. Das ist nicht theoretisch: Beim automatisierten Test hat ein Klick auf die
erste Option den Button getroffen statt die Option — der Flow blieb hängen. Was einem
Testskript passiert, passiert auch einem Daumen.

Das betrifft **jede** Frage, nicht nur die erste. Bei der Budgetfrage verdeckt er die
zweite Option unter „Wie verbindlich ist das Budget?".

**Er ist zu früh aktiv.** Ohne Auswahl führt ein Tap zu „Bitte beantwortet diese Frage."
Auf Mobil ist der Button das visuell dominanteste Element, während die Optionen unter der
Falz liegen — die wahrscheinlichste erste Handlung erzeugt also einen Fehler.

**Umgesetzt, aber anders als zunächst gedacht.** Der untere Innenabstand der Karte betrug
bereits 90 px — das Problem lag nicht am Kartenende, sondern daran, dass ein fixierter
Button immer den unteren Bildschirmrand belegt, egal wo man scrollt.

Die Lösung: Der Button steht **vor der ersten Auswahl inline** unter den Optionen und wird
erst mit einer gültigen Antwort an den Bildschirmrand gehängt. Solange nichts gewählt ist,
gibt es auch nichts zu bestätigen — und der freie Platz reicht dann für eine vollständig
sichtbare Option.

Dabei ist ein Fehler aufgefallen, der vorher unbemerkt war: Im Mobile-Media-Query stand
`display: none` auf dem Button, sichtbar wurde er ausschließlich über die Sticky-Klasse. Ohne
diese Klasse hätte es also überhaupt keinen Weiter-Button gegeben.

Für den Zustand „noch nicht bereit" wird `aria-disabled="true"` gesetzt und **nicht** das
`disabled`-Attribut. Ein echtes `disabled` nimmt den Button aus der Tabreihenfolge — dann
finden Tastatur- und Screenreader-Nutzer ihn nicht mehr und erfahren nie, dass eine Antwort
fehlt. Der Playwright-Test über drei Engines hat genau das aufgedeckt.

---

## P2 — Dieselbe Botschaft dreimal vor der ersten Frage

Vor der ersten Antwort steht der Hinweis auf den Beta-Umfang in drei Varianten:

1. Eyebrow: „BETA · DATENBASIERTER KINDERWAGEN-FINDER · 20 MODELLE"
2. Beta-Box: „Aktuell vergleicht der Finder ausschließlich Kombi-Kinderwagen ab Geburt."
3. Hilfetext der Frage: „Wir vergleichen nur Gruppen, für die wir belastbare Daten haben …"

Seit die Typ-Frage am 28.07.2026 wieder im Flow steht, ist Nummer 2 überflüssig — die Frage
selbst regelt die Auswahl, und die Routen sagen bei nicht unterstützten Typen ohnehin
deutlich Bescheid. Die Box kostet 82 px Höhe an der teuersten Stelle der Seite.

## P2 — Zwei Hinweisboxen übereinander in der Ergebnisansicht

Im Ergebnis stehen Beta-Box (82 px) und Affiliate-Hinweis (144 px) direkt übereinander,
zusammen **226 px** vor dem ersten Inhalt. Das Ergebnis-Intro beginnt bei 534 px.

Der Affiliate-Hinweis gehört dorthin — dort stehen die Partnerlinks, und die Kennzeichnung
ist Pflicht. Aber er ist mit drei Sätzen zu lang für Mobil, und die Beta-Box ist an dieser
Stelle doppelt redundant: Der Nutzer hat den Typ bereits gewählt und das Ergebnis bekommen.

**Ansatzpunkte:** Beta-Box in der Ergebnisansicht ausblenden. Affiliate-Hinweis auf zwei
Sätze kürzen — die Pflichtbestandteile sind die Kennzeichnung als Affiliate-Link und die
Amazon-Partner-Formel; der Zusatz zur Reihenfolge kann knapper ausfallen, ohne die Aussage
zu verlieren.

## P2 — Text im Ergebnis wird abgeschnitten

Zwei Elemente in der Ergebniskarte laufen über ihren Container:

```
DIV  "100%relevante Datenabdeckung"   scrollWidth 100 / clientWidth 85
SPAN "relevante Datenabdeckung"       scrollWidth  93 / clientWidth 71
```

Die Beschriftung der Datenabdeckungs-Anzeige wird also geclippt. Kein Layoutbruch, aber ein
sichtbarer Fehler an einem Element, das gerade Sorgfalt kommunizieren soll.

---

## P3 — Touch-Ziele unter der 44-px-Empfehlung

In der Ergebnisansicht liegen **7 von 15** interaktiven Elementen unter 44 px Höhe:

| Element | Höhe |
|---|---|
| „Guide: Stadt oder Land" | **23 px** |
| „Datenschutzerklärung" (Kleingedrucktes) | 15 px |
| Amazon-Zubehörlinks (2×) | 42 px |
| Weiterlesen-Links (3×) | 42 px |

Die WCAG-Mindestanforderung von 24 px ist bis auf den Datenschutz-Inlinelink erfüllt; die
44-px-Empfehlung nicht. Am deutlichsten fällt „Guide: Stadt oder Land" aus dem Rahmen — es
ist als Handlungsaufforderung gedacht, hat aber Textlink-Höhe.

Im Fragebogen ist das Bild dagegen gut: Die Antwort-Labels sind 309×64 bis 309×85 px, der
Weiter-Button 343×48 px. Die 1×1-px-Inputs sind die visuell ersetzten Radios und
Checkboxen — kein Problem, weil das Label das Touch-Ziel ist.

## P3 — Kleine Schriftgrößen

| Element | Größe |
|---|---|
| Kicker „FÜR DAS MATCHING ERFORDERLICH" | 12,16 px |
| Beta-Hinweis | 12,80 px |
| Option-Zusatzzeile (`hint`) | 13,12 px |
| Option-Haupttext | 15,36 px |
| Frage-Hilfetext | 14,08 px |
| H2 der Frage | 23,68 px |

Nichts davon ist unlesbar, aber der Option-Haupttext liegt knapp unter den üblichen 16 px,
und drei Elemente unter 13,5 px. Bei einer Zielgruppe, die das Gerät oft einhändig mit Kind
auf dem Arm bedient, ist das relevant.

## P3 — Budget nur über einen Schieberegler

Die Budgetfrage bietet ausschließlich einen `range`-Regler (300 bis 2000 €, Schrittweite 50)
und keine Zahleneingabe. Über eine Bahn von rund 309 px sind das 35 Positionen, also etwa
8,8 px je Schritt — ein exakter Wert wie 800 € ist mit dem Daumen schwer zu treffen. Und im
Modus „Feste Obergrenze" ist das Budget ein harter Filter: 750 statt 800 verändert die
Ergebnismenge.

**Abschwächend, und das ist gut gelöst:** Der Regler zeigt den Wert groß an und gibt sofort
eine Konsequenz zurück („13 von 20 Modellen mit bekanntem Gesamtpreis liegen innerhalb. Ab
1.000 € käme mindestens eine weitere dokumentierte Option hinzu."). Diese Rückmeldung
kompensiert die Ungenauigkeit weitgehend. Eine optionale Zahleneingabe daneben wäre
trotzdem eine kleine, günstige Verbesserung.

---

## Was auf Mobil gut funktioniert

Damit die Liste nicht einseitig wirkt — das wurde ebenfalls gemessen:

- **Kein horizontales Scrollen** auf 360, 375 und 390 px Breite, auch nicht in der
  Ergebnisansicht.
- **Keine JavaScript-Fehler** über den gesamten Flow, auf allen Viewports.
- **Antwort-Labels sind großzügige Touch-Ziele** (309×64 bis 309×85 px).
- **Der Sticky-Button existiert überhaupt** — die Alternative wäre, dass man nach jeder
  Auswahl zum Seitenende scrollen muss.
- **Fokusführung stimmt:** Nach dem Absenden landet der Fokus auf der Überschrift der neuen
  Frage, nicht im Nichts. Über drei Browser-Engines automatisiert geprüft.
- **Die Budget-Rückmeldung** mit der Modellzahl ist die stärkste Einzelinteraktion des Tools.
- **Die Ergebniskarte** ist auf 375 px gut lesbar: Badge, Score, Preis-Chips und
  Kompromiss-Zeile brechen sauber um.

---

## Reihenfolge der Bearbeitung

Die beiden P1-Punkte hängen zusammen und sollten gemeinsam angefasst werden: Wenn der
untere Innenabstand der Karte um die Buttonhöhe wächst und die Beta-Box vor der Frage
entfällt, verschwindet die Überlappung und die erste Option rutscht rund 82 px nach oben.
Zusammen mit einem gekürzten Hilfetext auf der ersten Frage wäre auf dem iPhone SE
mindestens eine vollständige Option ohne Scrollen erreichbar.

Alles Weitere ist Feinschliff und kann danach in einem Durchgang erledigt werden.
