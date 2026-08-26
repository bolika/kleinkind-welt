# Vorschlag zur Reduktion sichtbarer KI-Badges

Stand: 26.08.2026  
Grundlage: `docs/business-plan-relevanz-traffic-affiliate-2026-08-26.md`, Sichtprüfung der 26 registrierten KI-Motive und Git-Historie.

> Arbeitsbewertung, keine Rechtsberatung. Die Liste ist ein prüfbarer Reduktionsvorschlag, keine bereits erteilte Freigabe. In diesem Arbeitsschritt werden keine sichtbaren Badges im HTML entfernt.

## Evidenzgrenze

- Alle 26 Motive sind spätestens durch ihren ersten Git-Nachweis zwischen dem 15.06.2026 und 26.06.2026 im Repository belegt und damit vor dem Arbeitsstichtag 02.08.2026.
- `repositoryFirstSeenAt` belegt nur den frühesten Repository-Zeitpunkt, nicht zwingend den tatsächlichen Erstellungszeitpunkt.
- Commit `2305f1bf54cb6854bc4f7b9acbb19726ce7bc5ed` belegt die spätere Aufnahme sichtbarer KI-Badges durch Boris Nazarov.
- Aus der Git-Historie lässt sich keine dokumentierte medienrechtliche oder motivbezogene Einzelfallfreigabe ableiten. Deshalb steht `menschlicheFreigabe.status` bei allen Motiven zunächst auf `nicht-aus-git-ableitbar`.
- Die am 26.08.2026 tatsächlich vorhandenen Badges sind seitenweise als `sichtbareBadgeBaseline` registriert. Das Gate verhindert ihre unbeabsichtigte Entfernung, erzwingt aber für bereits vor dem Stichtag belegte Motive keine neuen Hinweise ohne Einzelfallentscheidung.

## Badge beibehalten

Diese Motive enthalten realistisch erzeugte Kinder und können wie authentische Aufnahmen wirken. Der direkte Hinweis sollte nach der aktuellen Arbeitsbewertung bestehen bleiben.

1. `Speilzeugideen-12-18-monate` - realistisches Kleinkind mit Lauflernwagen.
2. `hero-kind-holzspielzeug` - realistisches Kleinkind als zentrales Motiv.
3. `hero-spielzeug-finden` - realistisches Kleinkind in einer Alltagsszene.
4. `hero-spielzeug-finden-640` - responsive Variante desselben realistischen Personenmotivs.
5. `spielzeug-12-18-monate` - realistisches Kleinkind mit Spielzeug.
6. `spielzeug-3-jahre` - mehrere realistisch erzeugte Kinder in einer Spielsituation.

## Reduzieren und zentral offenlegen

Diese Motive zeigen nach Sichtprüfung keine realistische Person und keine konkrete Marke. Sie sind Kandidaten für eine weniger dominante, zentrale Herkunftsoffenlegung. Die Reduktion darf erst nach dokumentierter menschlicher Freigabe und Einbau eines sichtbaren `.ki-herkunft-hinweis` erfolgen.

1. `badespielzeug-kleinkind` - generische Badezimmerszene mit unmarkiertem Spielzeug.
2. `geschenke-2-jahre` - generisches Stillleben mit Spielzeug.
3. `geschenke-3-jahre` - generisches Stillleben mit Spielzeug.
4. `geschenke-zur-geburt` - generische Geschenk- und Babyartikel-Szene.
5. `holzspielzeug-vs-plastikspielzeug` - generische Gegenüberstellung ohne konkrete Produktbehauptung.
6. `montessori-spielzeug-kleinkind` - generische vorbereitete Spielumgebung.
7. `motorikspielzeug-test` - generische Motorikmaterialien ohne Person.
8. `spielzeug-0-6-monate` - generische Babyspielzeuge ohne Person.
9. `spielzeug-18-24-monate` - generische Spielsituation ohne Person.
10. `spielzeug-2-jahre` - generisches Kinderzimmer ohne Person.
11. `spielzeug-6-12-monate` - generische Babyspielzeuge ohne Person.
12. `sprache-foerdern-spielzeug` - klar erkennbare Illustration statt fotografischer Szene.
13. `weihnachtsgeschenke-kleinkind` - generische saisonale Geschenk-Szene ohne Person oder Produktbehauptung.

## Manuell prüfen

Bei diesen Motiven reicht die grobe Risikoklasse nicht aus. Vor einer Reduktion müssen Produktnähe, erfundene Texte oder Zeichen und der konkrete Seitenkontext einzeln bewertet werden. Bis dahin bleibt der Badge bestehen.

1. `duplo-vergleich` - markennaher Vergleichskontext; prüfen, ob die generierten Bausysteme wie reale Vergleichsprodukte gelesen werden.
2. `geschenke-1-jahr` - produktnahe Szene mit synthetisch wirkenden Buchtiteln.
3. `geschenke-1-jahr-hero` - Hero-Variante derselben produktnahen Szene mit synthetischem Text.
4. `nachhaltiges-spielzeug-siegel` - synthetische Siegel und Prüfzeichen in einem besonders vertrauensrelevanten Kontext; Ersatz durch eine sachliche Grafik ist vorzuziehen.
5. `outdoor-spielzeug-kleinkind` - produktnahe Szene mit synthetisch wirkender Markierung auf dem Laufrad.
6. `spielzeug-unter-20-euro` - produktnahe Szene mit synthetischem Buchtitel; möglicher Eindruck real kaufbarer Produkte.
7. `was-wir-nicht-kaufen` - marken- und produktnahe Spielzeugmenge in einem Artikel mit starkem redaktionellem Vertrauensanspruch.

## Freigabeablauf

1. Motiv in Originalgröße prüfen: Person, reale oder erfundene Marke, Produkttext, Siegel, Sicherheitsdarstellung und möglicher dokumentarischer Eindruck.
2. Prüfen, ob die Seite das Bild nur als Themenillustration nutzt oder als Beleg für ein konkretes Produkt, einen Test oder eine Erfahrung erscheinen lässt.
3. Entscheidung und Begründung im Register festhalten.
4. Bei Freigabe `menschlicheFreigabe.status` auf `freigegeben` setzen und `reviewedBy` sowie `reviewedAt` eintragen.
5. Vor einer Badge-Reduktion den sichtbaren zentralen Herkunftshinweis einbauen und `node tools/ki-bildkennzeichnung-gate.mjs` ausführen.
6. Änderungen an Badges separat umsetzen und visuell auf Desktop und Mobile prüfen.

## Ergebnis dieses Arbeitsschritts

- 6 Motive: Badge beibehalten.
- 13 Motive: Kandidaten für zentrale Offenlegung nach menschlicher Freigabe.
- 7 Motive: manuell prüfen; Badge vorerst beibehalten.
- 0 sichtbare Badges entfernt.
