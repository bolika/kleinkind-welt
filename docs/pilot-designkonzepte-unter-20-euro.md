# Drei Designkonzepte: Spielzeug unter 20 Euro

Status: drei getrennte, nicht indexierbare Pilotseiten; die rankende Live-Seite bleibt unverändert

## Kontrollierte Grundlage

Alle Varianten verwenden dieselben drei redaktionellen Empfehlungen, dieselben Babywalz-Angebote, dieselben Amazon-Vergleiche und dieselbe frischheitsgebundene Gesamtpreislogik. Damit vergleichen wir Informationsarchitektur, Tonalität und visuelle Führung statt unterschiedlicher Sortimente.

## Variante 1: Editorial Klar

URL: `/pilot/spielzeug-unter-20-euro.html`

- Wirkung: ruhig, sachlich, vertrauensbetont
- Führung: eine klare Wahl, zwei Alternativen, Details erst bei Bedarf
- Stärke: höchste Nähe zur bestehenden Markenwelt und geringstes Umstellungsrisiko
- Grenze: weniger eigenständig und emotional als die beiden neuen Konzepte

## Variante 2: Future Signal

URL: `/pilot/spielzeug-unter-20-euro-future.html`

- Wirkung: modern, präzise, fast futuristisch
- Kernkonzept: ein kleines Entscheidungswerkzeug statt einer Produktliste
- Führung: eine Frage zum gewünschten Spielmoment; danach ist immer nur eine Empfehlung sichtbar
- Verhaltensmuster: begrenzte Auswahl, Recognition statt Recall, progressive Offenlegung und kontextabhängiger Default
- Stärke: niedrigste gleichzeitige Informationslast und deutlichste Abgrenzung von klassischen Affiliate-Blogs
- Grenze: Nutzer müssen zuerst eine Absicht wählen; die technische Tonalität muss mit Eltern auf Vertrauen geprüft werden

## Variante 3: Spielpfad

URL: `/pilot/spielzeug-unter-20-euro-playful.html`

- Wirkung: warm, lebendig und spielerisch, ohne kindlich oder überladen zu werden
- Kernkonzept: eine kurze Scroll-Geschichte statt Vergleich oder Auswahlwerkzeug
- Führung: drei anklickbare Spielmomente führen in drei vollflächige Kapitel; jedes Kapitel erzählt erst die Situation und nennt dann genau einen Begleiter
- Verhaltensmuster: narrative Reihenfolge, episodisches Chunking, Anker-Navigation und Recognition statt Recall
- Stärke: höchste emotionale Nähe zum Thema und eine eigenständige redaktionelle Stimme
- Grenze: bewusster langsamer als Future Signal; der erste Händler-CTA liegt später, dafür entsteht vor dem Angebot mehr Kontext

## Epic-Design-Umsetzung

Das vorhandene responsive WebP-Motiv wurde als vollständige Szene auf Depth 0 belassen. Der komplexe Hintergrund gehört zum Bild und benötigt keine Freistellung. Geometrische Akzente liegen auf Depth 2 und 5, Text und Händleraktionen auf Depth 4.

Beide neuen Varianten verwenden native IntersectionObserver-Reveals und begrenztes Parallax über `requestAnimationFrame`. Touchgeräte, Geräte mit geringer Parallelität und `prefers-reduced-motion` erhalten einen Lite-Modus ohne kontinuierliche Tiefenbewegung.

Die Epic-Design-Prüfung besteht Szenen, Tiefenattribute, Dekorationskennzeichnung, Alt-Texte, Skip-Link, Bewegungsreduktion, Animationsumfang, Landmarken und Überschriftenstruktur. Die vom Skill vorgeschlagene GSAP-CDN-Abhängigkeit wurde bewusst nicht eingebunden: Die bestehende CSP bleibt unverändert, es entsteht keine zusätzliche externe Anfrage und die benötigten Effekte sind nativ kleiner umsetzbar.

## SEO

Alle Pilotseiten verwenden `noindex,follow` und kanonisieren auf `/artikel/spielzeug-unter-20-euro`. Sie konkurrieren deshalb nicht als neue Budget-URLs mit der rankenden Seite.

Bei einer Live-Übernahme müssen Hauptquery, kompakte 20-Euro-Regel, Sicherheitskriterien, ItemList-Strukturdaten und die aktuell impressionstragenden GSC-Unterfragen erhalten bleiben. Design und Snippet sollten entweder getrennt getestet oder bewusst als gemeinsamer Relaunch gemessen werden.

## Konzeptioneller Unterschied

- **Editorial Klar** ist ein klassischer redaktioneller Empfehlungsartikel mit priorisierter Hauptwahl.
- **Future Signal** ist ein interaktives Ein-Frage-Tool mit genau einem sichtbaren Ergebnis.
- **Spielpfad** ist eine lineare Erlebnisstrecke aus drei Alltagssituationen ohne Produktkartenraster.

## Entscheidungshypothese

- Für maximale unmittelbare Kaufklarheit: **Future Signal**
- Für maximale Marken- und Themenpassung: **Spielpfad**
- Für das geringste Risiko und stärkste redaktionelle Ruhe: **Editorial Klar**

Die Empfehlung für den nächsten Nutzertest ist ein direkter Vergleich von Future Signal und Spielpfad auf Mobile. Kernaufgabe: „Finde ohne langes Vergleichen ein passendes Spielzeug und öffne das Angebot.“ Gemessen werden Zeit bis zur Entscheidung, gewähltes Produkt, Händler-Klick, wahrgenommenes Vertrauen und subjektive Überforderung.
