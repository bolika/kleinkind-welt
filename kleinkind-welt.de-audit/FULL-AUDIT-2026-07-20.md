# Vollständiger SEO-, Affiliate-, UX- und Design-Audit

**Website:** kleinkind-welt.de  
**Auditdatum:** 20.07.2026  
**Scope:** lokale Codebasis, Live-Sitemap und repräsentative Live-Seiten; Desktop und Mobile (390 px); GSC-Snapshot; Affiliate-Ziele; Design- und Asset-System.

## Executive Summary

Die Seite hat eine solide technische Grundlage: statisches HTML, Self-Canonicals, gültige JSON-LD-Grundstruktur, gute interne Verlinkung, AI-Crawler-Zugriff, Affiliate-Disclosure und ein nachvollziehbares Evidenzregister. Der lokale SEO-Smoke-Test besteht für 31 Seiten; der interne Link-Audit findet 409 eindeutige Kanten bei maximaler Klicktiefe 2.

Die größten Risiken liegen derzeit an drei Stellen:

1. **Affiliate-Integrität und Kindersicherheit:** Mehrere Amazon-Ziele passen nicht zum beschriebenen Produkt, zur Marke oder zur empfohlenen Altersstufe. Statische Preis- und Budgetaussagen sind teilweise bereits veraltet. Das ist der wichtigste Trust-, Conversion- und Compliance-Blocker.
2. **Mobile Darstellung:** Die Budget-Vergleichstabelle bricht bei 390 px sichtbar zusammen. Der Alters-Hub ist durch feste 300-px-Breiten und `margin-left: 0` nachweislich links versetzt. Die mobile Navigation ist in den Aufnahmen nicht auffindbar und muss funktional geprüft werden.
3. **Komponenten- und Content-Überladung:** Mehrere Kaufbox-/Produktkarten-/CTA-Systeme konkurrieren miteinander. Lange Affiliate-Artikel führen Nutzer durch zu viele Entscheidungsebenen, bevor eine konkrete Option erreichbar ist.

**Zielbild:** eine ruhige, schnelle, vertrauenswürdige Elternseite mit einem Produktledger, einer primären Schnellentscheidung, einer Produktkartenfamilie, einem CTA-System und einem klaren mobilen Container. Aufwendige Parallax- oder Floating-Effekte würden das Ziel „super clean“ eher verschlechtern.

## Befund nach Ebene

### 1. Affiliate-, Preis- und Sicherheitsintegrität — kritisch

Im lokalen Bestand stehen 103 eindeutige Amazon-Shortlinks in 331 Vorkommen. Das Evidenzregister enthält 127 Empfehlungen; alle sind als redaktionelle Einordnung ohne eigenen vollständigen Produkttest gekennzeichnet (`data/editorial-evidence.json:3-8`). Das ist grundsätzlich transparent, ersetzt aber keinen konkreten Produkt- und Händlercheck.

Reproduzierte Beispiele aus der Live-Auflösung:

| Problem | Evidenz | Risiko |
|---|---|---|
| Altersfreigabe passt nicht | `4uCqqt9` führt zu einem Klettergerüst ab 18 Monaten, der Artikel beschreibt das Pikler-Dreieck ab ca. 6 Monaten (`artikel/motorikspielzeug-test.html:715-734`) | Sicherheits- und Vertrauensbruch |
| Altersfreigabe passt nicht | `3Swnd0N` führt zu Bademalstiften ab 3 Jahren, im Artikel ab ca. 18 Monaten/ab 2 (`artikel/badespielzeug-kleinkind.html:349-350,454-471`) | potenziell ungeeignete Empfehlung |
| Kategorie/Produkt passt nicht | `4ahtljF` führt zu einer LED-/Busy-Board-Uhr, beschrieben wird ein ruhiges Motorikbrett mit Reißverschlüssen und Riegeln (`artikel/motorikspielzeug-test.html:297-308,357-414`) | Nutzer fühlt sich fehlgeleitet |
| Marke passt nicht | `4gjqpXh` führt zu goki, der Text nennt Grimm's; weitere Links führen zu small foot bzw. hahaland, obwohl Grimm's/Magna-Tiles genannt werden (`artikel/duplo-vergleich.html`) | falsche Markenbehauptung |
| Preislimit verletzt | `444Mq4L` liegt bei etwa 23 €, die Kaufbox nennt etwa 15 € (`artikel/motorikspielzeug-test.html:373-376`); `3QHuOsJ` liegt bei etwa 21 €, steht aber unter „unter 20 Euro“ (`artikel/spielzeug-unter-20-euro.html:504-524`) | veraltete Kaufentscheidung |
| Toter Link | `amzn.to/43L24T0` lieferte in der Stichprobe Amazon 404 (`artikel/geschenke-1-jahr.html:490`) | verlorene Conversion und schlechter Trust |

Zusätzlich wurden absolute Entwicklungs- und Gesundheitsclaims gefunden, die nicht jeweils direkt mit einer belastbaren Quelle verknüpft sind, z. B. im Outdoor-Artikel (`artikel/outdoor-spielzeug-kleinkind.html:385-396`) und in Badespielzeug-Texten. „Eigene Alltagserfahrung“ (`artikel/motorikspielzeug-test.html:906`) darf nicht wie ein Produkttest wirken, wenn das Evidenzregister gleichzeitig `ownProductTest=false` ausweist.

**Konsequenz:** Vor weiteren Inhalten oder großem Designumbau muss ein zentraler Produktledger eingeführt werden. Ohne ihn bleibt jede manuelle Linkpflege fehleranfällig.

Empfohlene Felder:

`shortUrl`, `finalUrl`, `asin`, `merchantTitle`, `brand`, `category`, `ageMinMonths`, `priceRule`, `lastChecked`, `status`, `affectedPages`, `evidenceSources`, `humanApproved`.

Preisregeln sollten ohne verlässliche API nicht als aktuelle Preise formuliert werden. Für Amazon sind „Preis beim Händler prüfen“ und eine zeitgebundene redaktionelle Prüfung robuster als harte Zahlen. Der Artikel `spielzeug-unter-20-euro` enthält bereits die richtige Richtung („nur wählen, wenn aktuell höchstens 20 €“), aber die Bedingung ist noch nicht technisch an einen Check gekoppelt (`artikel/spielzeug-unter-20-euro.html:443-447`).

### 2. Mobile UX und Layout — kritisch bis hoch

**Vergleichstabelle:** Auf der Live-Seite `spielzeug-unter-20-euro` ist die Caption bei 390 px nur ca. 36 px breit und wird buchstabenweise über ca. 698 px Höhe dargestellt. Ursache ist das Zusammenspiel aus Caption, Tabellen-zu-Block-Regeln und `js/mobile-tables.js:2-13`, das Row-Header nicht vollständig labelt. Die visuelle Reparatur muss zuerst erfolgen, bevor weitere Tabellen veröffentlicht werden.

**Alters-Hub:** Die CSS-Regeln setzen direkte Body-Kinder und Karten auf `max-width: 300px` mit `margin-left: 0` (`css/style.css:3747-3777`). Bei 390 px liegen die Karten links bei etwa 20 px und enden bei etwa 320 px; rechts bleiben rund 70 px. Das bestätigt die Nutzerbeobachtung „nicht zentriert“. Eine zentrale Containerregel ist besser als weitere lokale Sonder-Overrides.

**Navigation:** In den aktuellen 390-px-Aufnahmen ist nur die Wortmarke sichtbar; ein Hamburger bzw. ein anderer Menü-Trigger ist nicht auffindbar. `.nav-toggle` steht standardmäßig auf `display:none` (`css/style.css:123-132`). Das muss als funktionaler Test auf 320/390/430 px verifiziert werden, bevor es als rein visueller Fehler behandelt wird.

**Entscheidungslast:** Mobile Affiliate-Artikel sind sehr lang: beispielhaft Motorik ca. 23.840 px mit 36 Affiliate-Links, 12–18 Monate ca. 18.594 px mit 23 Links und Budget ca. 16.841 px mit 15 Links. Affiliate-Hinweis, Autorbox, Top-Pick, Kurzantwort, Methodenbox, Kaufbox, Inhaltsverzeichnis und Produktkarten konkurrieren. Nutzer brauchen eine einzige primäre Schnellentscheidung; Details und Alternativen kommen danach.

Weitere UX-Befunde:

- Primäre Controls liegen teilweise unter dem Ziel von 44 × 44 CSS-Pixeln.
- Alterschips sind horizontal scrollend, aber ohne klare Scroll-Affordance.
- Orange und Coral werden beide für „Bei Amazon ansehen“ verwendet.
- `overflow-x:hidden` kaschiert potenzielle Überbreiten statt sie im Test sichtbar zu machen (`css/style.css:45,906-919,3881ff`).
- Newsletter-/Retention-Pfade sind auf vielen Artikeln nicht vorhanden; als nächster Schritt bleibt dort faktisch nur der Amazon-Klick.

### 3. Design-System und Assets — hoch, aber nicht P0

Das Stylesheet ist mit rund 4.016 Zeilen, 13 Media-Blöcken und sechs separaten `max-width:640px`-Blöcken stark gewachsen. Es gibt mindestens vier parallele Produkt-/Kaufbox-Systeme (`.produkt-box`, `.kw-product-card`, `.testsieger-box`, `.kaufbox`) und 116 Inline-Styles in HTML. Das erklärt uneinheitliche Boxhöhen, Abstände und CTA-Farben.

Die vorhandene warme Palette und Desktop-Typohierarchie sind grundsätzlich passend. Der Asset-Inspector fand in den Artikelbildern überwiegend vollständige Lifestyle-/Szenenbilder: Hintergründe sollen behalten werden; eine automatische Freistellung wäre falsch. Produktbilder sollten dagegen in einem festen `aspect-ratio`-Rahmen mit `object-fit:contain` und neutralem Padding vereinheitlicht werden. Zwei Geschenk-Hero-Dateien mit 2752 × 1536 und bis zu ca. 692 KB sind für ihre Rolle zu groß.

Fehlende Designsystem-Bausteine:

- Spacing-, Typografie-, Container- und Button-Tokens fehlen.
- `--text-muted` wird verwendet, ist aber nicht definiert.
- Globaler `:focus-visible`-Stil fehlt.
- `prefers-reduced-motion` ist nicht als vollständige globale Motion-Garantie umgesetzt.

Das passende Ziel ist eine ruhige 2D-Oberfläche mit 16–20 px Mobile-Gutter, 720–760 px Lesespalte, 1100 px Hub, einer Card-Familie, einer Kaufbox und sehr sparsamen Desktop-Mikrointeraktionen.

### 4. SEO, AI-Readability und Indexierung — technisch gut, redaktionell mit Risiken

Positiv:

- Lokaler Smoke-Test: 31/31 Sitemap-Seiten, genau eine H1, Self-Canonical, Titel-/Description-Fenster, JSON-LD, Bild-Alt/Dimensionen und Affiliate-`rel`-Attribute.
- Interne Verlinkung: 409 eindeutige Kanten, durchschnittlich 12,6 Inlinks, maximale Tiefe 2.
- Robots erlaubt Such- und relevante AI-Crawler; `llms.txt` ist vorhanden; HTML ist statisch und maschinenlesbar.
- Live liefern alle derzeit 30 Sitemap-URLs HTTP 200; die stichprobenartig geprüften Canonicals stimmen.
- FAQPage kann für Maschinenlesbarkeit bleiben, sollte aber nicht als erwarteter Google-Rich-Result-Hebel eingeplant werden.

**Live-/Repository-Drift:** Lokal existieren 31 Sitemap-Seiten inklusive `/artikel/spielzeug-rotieren-kleinkind`; live sind es 30. Die neue URL liefert live 404. Lokal sind `sitemap.xml`, `llms.txt` und `index.html` bereits angepasst (`sitemap.xml:180`, `llms.txt:55`, `index.html:511`). Das ist kein Beleg für einen generellen Site-Ausfall, sondern für eine noch nicht deployte lokale Veröffentlichung.

GSC bleibt wegen der kleinen Datenmenge richtungsweisend, nicht beweisend: Im 14-Tage-Vergleich 04.–17.07. gegenüber 20.06.–03.07. fielen Klicks von 5 auf 0 und Impressionen von 212 auf 125; die durchschnittliche Position verschlechterte sich von 38,0 auf 72,6. Die 28-Tage-Sicht enthält nur wenige Klicks. Vor massenhaftem Umschreiben müssen zuerst Trust-/Linkprobleme behoben und anschließend 14/28 Tage gemessen werden.

## Priorisierte Arbeitsliste

### P0 — zuerst erledigen

1. **Affiliate-Integrity-&-Safety-Sprint:** Produktledger anlegen, alle eindeutigen Amazon-Ziele auflösen, ASIN/Titel/Marke/Altersfreigabe/Preisregel erfassen, alle kritischen Mismatches sperren oder ersetzen. Preis- und Altersclaims neutralisieren, wenn keine frische Prüfung vorliegt.
2. **Mobile Budget-Tabelle reparieren:** Caption und Row-Header im bestehenden Responsive-Tabellensystem berücksichtigen; anschließend Budget-, Alters-, Kaufhilfen- und Vergleichstabellen bei 320/390/430 px testen.
3. **Alters-Hub zentrieren:** zentrale Regel `margin-inline:auto`/fluid width statt der aktuellen linken 300-px-Begrenzung; keine weiteren lokalen Sonder-Overrides hinzufügen.
4. **Deployment-Gate:** Wenn der lokale Informationsartikel live gehen soll, erst nach Push/Deploy prüfen: URL 200, Canonical, Sitemap, `llms.txt`, interne Links und Live-Smoke-Test. Bis dahin nicht in GSC oder externen Promotionen bewerben.

### P1 — direkt danach

5. Mobile Navigation auf 320/390/430 px funktional prüfen und sichtbar machen, falls der Toggle tatsächlich verborgen ist.
6. Ein einheitliches Decision-Header-Modul nach Transparenz/Autor einführen: eine Primärempfehlung, zwei Alternativen, danach Details.
7. CTA-System vereinheitlichen: eine Primärfarbe und Mindesthöhe, eine Sekundäraktion; „Bei Amazon ansehen“ nicht je Komponente anders codieren.
8. Claim-/Quellen-Audit für Entwicklungs-, Gesundheits-, Sicherheits- und „eigene Erfahrung“-Aussagen. Jeder starke Claim braucht eine direkt zuordenbare Quelle oder eine klare Begrenzung.
9. Designsystem konsolidieren: gemeinsame Card-/Kaufbox-Familie, Tokens für Abstände/Typografie/Container/Buttons, globaler Fokus und vollständiger Reduced-Motion-Fallback.

### P2 — nach Stabilisierung und Messung

10. Touch-Targets auf mindestens 44 × 44 px bringen und Alterschip-Navigation als Grid oder klaren horizontalen Scroller gestalten.
11. Überbreiten-Test ohne pauschales `overflow-x:hidden` etablieren.
12. Bildvarianten der überdimensionierten Hero-Assets verkleinern; Produktbildrahmen vereinheitlichen.
13. Kompaktes Newsletter-/Retention-Modul nach der ersten Entscheidung und am Artikelende standardisieren.
14. Erst nach diesen Korrekturen Content-Pilot und GSC-Quick-Wins ausbauen; keine massenhafte URL-Produktion.

## Was parallel laufen kann

| Track | Inhalt | Blockiert durch |
|---|---|---|
| A: Daten/Trust | Produktledger, Linkauflösung, Alters-/Marken-/Preisprüfung, Claim-Register | nichts; sofort starten |
| B: Mobile | Tabelle, Hub-Container, Navigation, Touch-Targets | Tabelle zuerst separat testen |
| C: Content/SEO | Claims mit Quellen versehen, veraltete Preisformulierungen neutralisieren | Ergebnisse aus Track A |
| D: Designsystem | Card-/CTA-/Token-Konsolidierung, Fokus, Reduced Motion | P0-Layouts und Decision-Architektur |
| E: Performance | Hero-Varianten, Produktbildrahmen | stabiles Komponentenmarkup |

## Akzeptanzkriterien und Messung

- 0 Alters-, Marken- oder Kategorie-Mismatches im Produktledger.
- 100 % der produktiven Affiliate-Ziele liefern gültige Zielseiten und einen erwarteten Produkttitel.
- 0 Preisrange-Verstöße; ohne frische Daten kein harter aktueller Preis.
- Mobile Tabellen bei 320/390/430 px ohne Caption-Zerfall, abgeschnittene Zellen oder versteckte Überbreite.
- Linke/rechte Außenabstände von Hub-Karten unterscheiden sich höchstens um 2 px.
- Primäre interaktive Controls mindestens 44 × 44 px; sichtbarer Tastaturfokus.
- Kernaufgabe „passende Option finden und begründen“: mindestens 80 % Completion, unter 90 Sekunden, unter 15 % Fehler, Vertrauen mindestens 4/5 in 5–8 moderierten Mobile-Tests.
- Nach Deployment: Live-Sitemap 31 URLs, neuer Artikel HTTP 200, lokale und Live-Smoke-Tests grün.
- GSC: 14-/28-Tage-Vergleich für Impressionen, Position, CTR und Klicks der Cluster „unter 20 Euro“, „Stapelbecher ab welchem Alter“ und „Lauflerngitter“.

## Bewusste Nicht-Prioritäten

Kein Parallax-/Scrolltelling-Ausbau, keine automatische Hintergrundentfernung der Lifestyle-Bilder, kein vollständiger Neuaufbau der technischen SEO-Basis und keine große neue Content-Welle, bevor Produktintegrität, mobile Klarheit und Messbarkeit stabil sind.

## Audit-Grenzen

Amazon-Ziele können automatisiert durch Rate-Limits/temporäre 503-Antworten eingeschränkt sein; deshalb muss der vollständige Ledger-Check mit Wiederholungen und menschlicher Freigabe erfolgen. Personas und Journey sind mangels Traffic- und Nutzerinterviews hypothesenbasiert. Die GSC-Datenmenge ist sehr klein und unterliegt dem üblichen Datenlag.
