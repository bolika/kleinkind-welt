# Pilot: Spielzeug unter 20 Euro

Status: lokale Pilotseite, nicht indexierbar, noch kein Ersatz der Live-URL

## Ziel

Die Seite soll Eltern mit möglichst wenig Entscheidungsaufwand zu einer passenden Budget-Empfehlung führen. Statt acht ähnlich gewichteter Produkte zeigt der Pilot eine klare Standardempfehlung und zwei situative Alternativen.

## Entscheidungsarchitektur

1. **Default:** Stapelbecher als vielseitigste Empfehlung.
2. **Alternative nach Bedarf:** Klopfbank für Ursache-Wirkung und Bewegung.
3. **Alternative nach Bedarf:** Pappbilderbuch für gemeinsame ruhige Zeit.
4. **Progressive Offenlegung:** Auswahlregel, Preislogik und Sicherheitsdetails stehen in aufklappbaren Bereichen.
5. **Händler erst nach Produktwahl:** Babywalz ist bei frischem Gesamtpreis der primäre Händler-CTA, Amazon dient als Preisvergleich.

Verwendete Verhaltensmuster: begrenzte Auswahl, sinnvoller Default, klare Zuordnung nach Situation, visuelle Hierarchie, progressive Offenlegung und Recognition statt Recall. Es werden keine künstliche Verknappung, Countdown-Elemente oder unbelegtes Social Proof eingesetzt.

## Bewusst entfernt

- Sidebar und Werbebanner
- Inhaltsverzeichnis
- doppelte Kaufbox und wiederholte Produktempfehlungen
- fünf nachrangige Produktideen
- Newsletter-Unterbrechung innerhalb der Kaufentscheidung
- lange Alters- und Auswahlratgeber
- wiederholte Schluss-Kaufbox

## SEO-Einschätzung

Der Pilot ist mit `noindex,follow` versehen und kanonisiert auf die bestehende Live-Seite. Er kann deshalb lokal oder auf einer Test-URL geprüft werden, ohne mit der rankenden URL zu konkurrieren.

Die lokale GSC-Auswertung vom 26.08.2026 zeigt für die Live-URL im Gesamtfenster 53 Impressionen, einen Klick und eine mittlere Position von 18,2. Die exakte Query `spielzeug unter 20 euro` brachte 39 Impressionen und wurde ausschließlich dieser URL zugeordnet. Das ist ein relevantes, aber sehr kleines Signal: Es spricht gegen eine zweite Budget-URL und gegen unkontrollierte Paralleländerungen auf der Live-Seite, nicht gegen einen separat getesteten UX-Piloten.

Bei einer späteren Übernahme bleiben die zentralen Suchsignale erhalten:

- exakte Suchintention in Title, H1, Einleitung und Zwischenüberschrift
- drei konkrete Produkttypen mit Alters- und Einsatzbezug
- transparente 20-Euro-Regel und Sicherheitskriterien
- sichtbare FAQ-Antworten plus passendes FAQ-JSON-LD
- Article- und ItemList-Strukturdaten
- interne Links zu Bewertungsmethode und Kaufhilfen

Das größte SEO-Risiko ist nicht die geringere Wortzahl, sondern der Verlust relevanter Unterintentionen aus der bisherigen Acht-Produkte-Seite. Vor einer Live-Übernahme sollten GSC-Queries der URL den drei Empfehlungen und FAQs gegenübergestellt werden. Fehlende, nachweislich impressionstragende Fragen werden kompakt ergänzt, ohne die Produktliste wieder aufzublähen.

Falls der Pilot die Live-Seite ersetzt, sollten Title und Informationsarchitektur nicht gleichzeitig als getrennte SEO-Experimente bewertet werden. Entweder bleibt das bestehende Snippet während des UX-Tests stabil oder die Umstellung wird bewusst als Gesamt-Relaunch mit Vorher-Nachher-Messung behandelt.

## Erfolgsmessung

- Anteil der Besucher mit mindestens einem Affiliate-Klick
- Klickrate der ersten Empfehlung gegenüber den Alternativen
- Anteil Babywalz gegenüber Amazon
- Scrolltiefe bis zur ersten Händleraktion
- Rückkehr zur Suchergebnisseite nur über GSC/Plausible-Näherungen, falls kein geeignetes Event verfügbar ist

Eine belastbare Entscheidung braucht mindestens 14 Tage und ausreichend Traffic. Der Pilot darf nicht anhand einzelner Klicks als Gewinner bewertet werden.
