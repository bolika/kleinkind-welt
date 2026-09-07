# Traffic, Nutzerwert und Wirtschaftlichkeit: Live-Audit

Stand: 07.09.2026. Auftrag: Schwachstellen der Live-Seite und Ursachen geringer Reichweite untersuchen, wirtschaftlich sinnvolle Prioritaeten ableiten.

## Entscheidung

Die Website hat aktuell kaum organische Reichweite. Weitere Flaechen-Redesigns, mehr Produktlisten oder zusaetzliche Analysewerkzeuge sind nicht die erste Investition. Prioritaet haben Kostenkontrolle, zuverlaessige Produktzuordnung, eine fokussierte Kaufhilfe mit eigenstaendigem Informationswert und ein kleiner, messbarer Verteilungsversuch.

Der letzte Ausbau ist in GSC vielfach noch nicht neu gecrawlt. Deshalb weder Wirkung noch Wirkungslosigkeit der August-/September-Designs behaupten. Gleichzeitig reicht blosses Warten nicht: konkrete Inhaltswidersprueche und unpassende Ersatzlinks sind bereits heute nachweisbar.

## Datenbasis und Grenzen

- 38 URLs aus der LIVE-Sitemap per HTTP abgerufen, Inhalte, Title, H1, Canonical und Robots geprueft.
- GSC Search Analytics: property-weite Aggregate ohne Query-Dimension fuer Gesamtsummen; Seiten, Query-Seiten-Paare, Tage, Geraete und Laender separat.
- Vollstaendige 28 Tage: 08.08.-04.09.2026, Vergleich 11.07.-07.08.2026. Nur `dataState=final`.
- URL Inspection: alle 38 Sitemap-URLs plus Kinderwagen-Navigator; Ergebnisse unten.
- Browser: Startseite, Budgetartikel, Geschenk-Hub, Montessori und Kinderwagen-Hub bei 390 und 1440 px, jeweils 900 px Hoehe. Zusaetzlicher normaler Scroll- und Feed-Ausfalltest am Budgetartikel.
- Aktueller GitHub-Workflow und Live-Angebotsdaten vom 07.09. geprueft. Lokaler Checkout ist aelter als die automatischen Remote-Preisupdates; Aussagen zu Bestand basieren auf Live-Daten.
- Keine aktuellen Plausible-Zugangsdaten/Rechnung oder neuen Exporte ausgewertet. Der vorherige Screenshot mit 20 Besuchern ist keine neue Septembermessung.
- Kosten, bestaetigte Provisionen und ein vollstaendiges Backlink-Inventar fehlen. Keine Behauptung, es gebe null Backlinks, eine Google-Abstrafung oder einen nachgewiesenen KI-Kennzeichnungs-Effekt.
- Web-Suchcache lieferte teilweise alte Juni-Inhalte. Alle konkreten Website-Findings wurden daher anhand direkt abgerufenen Live-HTMLs und/oder Browserzustands geprueft.
- Dauerhafte komprimierte Messgrundlage: `docs/audits/data/traffic-2026-09-07.json`. Vollstaendige temporaere Rohdaten und Browserbilder: `/tmp/kw-audit-20260907/`.

## Reichweite

| Kennzahl | 11.07.-07.08. | 08.08.-04.09. | Einordnung |
|---|---:|---:|---|
| Google-Web-Klicks | 1 | 0 | Praktisch kein organischer Zufluss |
| Impressionen | 269 | 282 | +4,8 %, geringe absolute Basis |
| CTR | 0,37 % | 0 % | Ein einzelner Klick verursacht die gesamte Differenz |
| Mittlere Position | 67,7 | 69,5 | Sichtbarkeit weit hinter der ersten Ergebnisseite |

Die juengsten 14 Tage zeigen 76 statt 206 Impressionen (-63,1 %), bei verbesserter mittlerer Position 68,2 statt 70,0. Weniger Ausspielung ist real, ein erneuter allgemeiner Ranking-Einbruch daraus aber nicht ableitbar. Durchschnittspositionen enthalten zudem wechselnde Suchanfragen.

Langfristiger Kontext: 12.06.-09.07. ergaben 303 Impressionen, sechs Klicks und Position 45,6. Die Website hatte somit auch vor den letzten Umbauten keine grosse organische Besucherbasis. Die jetzige wirtschaftliche Schwaeche laesst sich nicht allein dem juengsten Design zuschreiben.

### Seiten und Suchintention

| Zielseite | Impressionen | Position | Ableitung |
|---|---:|---:|---|
| Geschenk-Hub | 140 | 70,9 | Groesstes Nachfragefeld, aber noch weit von Klickreichweite entfernt |
| Montessori ab 1 Jahr | 68 | 63,9 | Klarer Suchbegriff und konkreter Verbesserungshebel |
| Geschenke 2 Jahre | 35 | 70,9 | Beste einzelne Geschenk-Unterseite im aktuellen Fenster |
| Homepage | 18 | 73,9 | Allgemeines Thema `kleinkindspielzeug`, geringe Sichtbarkeit |
| Geschenke 3 Jahre | 12 | 77,0 | Kleine Ausgangsbasis |
| Unter 20 Euro | 0 | keine messbare Position | Aktuell kein nachweisbarer Google-Traffictraeger |

Die drei ersten Seiten vereinen 243 von 291 seitenbezogenen Impressionen (83,5 %). Die Seitensumme unterscheidet sich aufgrund der GSC-Aggregation von den 282 Property-Impressionen und darf nicht mit ihnen vermischt werden.

Sichtbare Query-Beispiele:

- `montessori spielzeug 1 jahr`: 38 Impressionen, Position 62,4.
- `montessori spielzeug ab 1 jahr`: 12 Impressionen, Position 63,9.
- `montessori puzzle 1 jahr`: zwei Impressionen, Position 41,5; interessantes, aber sehr schwaches Longtail-Signal.
- `geschenke fuer kleinkinder` (mit Umlaut in GSC): 35 Impressionen, Position 71,5.
- `kleinkinder geschenke`: 34 Impressionen, Position 67,3.
- Verschiedene Geschenk-Suchanfragen fuer zweijaehrige Jungen; keine eigenstaendigen Geschlechterseiten daraus ableiten.

Es gibt in den sichtbaren Daten keine ausreichend grosse Query auf Position 5-20, aus der sich ein belastbarer reiner Title-/CTR-Schnellgewinn ableiten liesse. Einzelne hohe Positionen mit einer Impression sind keine stabile Rankingbasis. Das Suchvolumen des Gesamtmarkts ist mit diesen GSC-Impressionen nicht gemessen.

## Priorisierte Schwachstellen

### P0: Ausweichlink zeigt ein anderes Produkt

Live-Seite: https://kleinkind-welt.de/artikel/spielzeug-unter-20-euro

- Die Karte nennt Badabulle Silikon-Stapelbecher.
- Der regulaere Babywalz-Button passt zu Badabulle; aktueller Gesamtpreis 14,89 Euro.
- Faellt die Preis-JSON aus, wird der Amazon-Link `https://amzn.to/4wlVDSw` sichtbar.
- Dessen live gepruefte HTTP-Weiterleitung fuehrt zu Mushie, ASIN `B0858X3VDM`.
- Der Feed-Ausfall wurde im Browser gezielt simuliert; der Name blieb Badabulle, der Amazon-Button wurde angezeigt.

Massnahme: Ersatzangebote muessen dasselbe Produkt treffen. Sonst den anderen Artikel explizit als Alternative kennzeichnen und Produktname/Bild/Altersangabe gemeinsam wechseln oder den produkttreuen Babywalz-Link ohne Preis weiter anbieten. Alle weiteren Ersatzlinks nach demselben Muster pruefen.

Abnahme: frischer Feed, fehlender Feed, abgelaufener Feed und Ausverkauf zeigen entweder ein korrekt zugeordnetes Angebot oder eine ehrliche Nichtverfuegbarkeitsdarstellung. Keine abgelaufenen Preise anzeigen.

### P0: Qualitaetstest haengt an veraenderlichem Lagerbestand

GitHub: https://github.com/bolika/kleinkind-welt/actions/runs/34110971364

- Heutiger Preisrefresh erfolgreich; nachfolgender Qualitaetslauf fehlgeschlagen.
- Fehler: `Verfuegbares PRIME-3-Angebot fehlt im importierten Feed.`
- `tools/kinderwagen-babywalz-coverage-test.mjs:12` verlangt dauerhaft `in_stock`.
- Der Live-Feed vom 07.09. meldet dasselbe PRIME-3-Angebot korrekt `out_of_stock`.

Massnahme: Mapping und Bestand getrennt pruefen; einen Testdatensatz fuer Lieferbarkeit nutzen, reale Ausverkaeufe als gueltigen Zustand behandeln. Nicht den echten Lagerbestand manipulieren. Anschliessend den gesamten Qualitaetslauf ausfuehren.

Dieser Fehler ist kein belegter Grund fuer fehlende Google-Klicks. Er erzeugt jedoch Wartungsaufwand und unzuverlaessige Release-Signale.

### P1: Montessori widerspricht seiner eigenen Vorauswahl

Live-Seite: https://kleinkind-welt.de/artikel/montessori-spielzeug-kleinkind

- Titel verspricht drei sinnvolle Spieltypen.
- Einstieg empfiehlt wenige Teile und einfache Aufgaben ab einem Jahr.
- Erste Empfehlungsgruppe zeigt neben Einwurfbox ein Hape-Steckpuzzle ab 18 Monaten und einen grossen Motorikwuerfel mit mehreren Aktivitaeten.
- Weiter unten folgt erneut eine Liste mit fuenf Produkttypen, darunter Busy Board und derselbe komplexe Wuerfel.
- Das einfache Hape-Spiegelpuzzle mit drei Formen und Anbieterfreigabe ab zehn Monaten steht erst weiter unten.

Massnahme: eine verbindliche Auswahl von drei passenden Einstiegen. Die erste Gruppe und der nachfolgende Inhalt muessen dieselben konkreten Modelle und Altersgrenzen verwenden. Ein komplexerer Wuerfel kann als spaetere Alternative im Text erscheinen, sollte aber nicht den einfachen Einstieg repraesentieren.

Abnahme: Leser versteht fuer jedes der drei Angebote Alter, Taetigkeit, wichtigsten Nachteil und Unterschied zu den beiden anderen. Keine widerspruechliche zweite Bestenliste.

### P1: Lange Einstiege verzögern die eigentliche Entscheidung

Browsermessung bei 390 x 900 px, ohne vorherigen Scroll:

| Seite | Erster Kaufbutton ab Dokumentbeginn | Gesamthoehe |
|---|---:|---:|
| Montessori | ca. 3550 px | ca. 17856 px |
| Unter 20 Euro | ca. 1833 px | ca. 6058 px |
| Geschenk-Hub | kein direkter Produktbutton, Hub-Funktion | ca. 14264 px |
| Homepage | kein direkter Produktbutton, Einstiegsfunktion | ca. 13068 px |

Montessori braucht auf diesem Viewport fast vier Bildschirmhoehen bis zum ersten Kaufbutton. Vorher kommen Bild, Intro, Affiliate-Hinweis, Autor, Kurzantwort, Auswahlmatrix, Beobachtungshilfe und Methodenblock. Das sind sinnvolle Einzelteile, aber zu viele vor der ersten konkreten Empfehlung.

Der Geschenk-Hub zeigt vor der Auswahl zusaetzlich einen Wechsel zu Entwicklungsphasen. Der Besucher mit Geschenkabsicht erhaelt dadurch nochmals einen anderen Auswahlweg. Die Homepage ist mobil weiterhin sehr lang.

Massnahme: zuerst nur Montessori und Geschenk-Hub straffen. Bei Montessori drei passende Produkte nach kurzem Intro und Affiliate-Hinweis, Methodik/Vertiefung darunter. Im Geschenk-Hub Anlass/Alter zuerst; Entwicklungsphasen als nachgelagerter Querverweis. Zielwerte fuer die Abnahme sind Gestaltungsziele, keine nachgewiesenen Conversion-Schwellen: erste passende Auswahl innerhalb etwa 1-1,5 Viewports, erster Produktbutton innerhalb etwa 2-2,5.

Die Budgetseite hat bereits einen klaren Hauptbutton, aktuelle Gesamtpreise, passende Bilder und erkennbare Spielmomente. Das Grundkonzept beibehalten. Ihre radikale Kuerzung nicht ohne inhaltliche Pruefung auf alle Seiten uebertragen. Die Wortzahl an sich ist kein Google-Qualitaetskriterium.

Keine horizontalen Ueberlaeufe, defekten geladenen Bilder oder JavaScript-Ausnahmen in den zehn geprueften Browseransichten. Normaler Scroll zur Budgetkarte zeigte einen gut sichtbaren Babywalz-CTA. Eine sofortige Aufnahme nach einem Programmsprung lag noch in der Reveal-Animation; nach normalem Scroll und Abwarten war die Karte sichtbar. Daraus kein dauerhaftes Darstellungsproblem ableiten.

### P1: Zu wenig dokumentierter Eigenwert und weiter bestehende Inhaltswidersprueche

Im Live-Crawl tragen alle 120 mit `data-evidence-type` gekennzeichneten Empfehlungen `editorial-assessment`. Das ist eine ehrliche Kennzeichnung, aber kein Nachweis eigener Produktnutzung. Unmarkierte persoenliche Passagen sind damit nicht ausgeschlossen.

Quellen und eine Methodikseite sind vorhanden. Der naechste Mehrwert muss an konkreten Empfehlungen sichtbar werden: beispielsweise echte Abmessungen, nachvollziehbarer Platzbedarf, dokumentierte Teile-/Lieferumfangsvergleiche, eigene Beobachtungen oder ein fachlicher Gegencheck. Quellenzusammenfassungen allein unterscheiden die Seite nur begrenzt von anderen Kaufberatungen. Google empfiehlt fuer Reviews eigene Evidenz, relevante Vergleiche und nachvollziehbare Vor-/Nachteile: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews

Verbleibende Beispiele fuer zu absolute Aussagen:

- Homepage: Siegel-Teaser spricht von Logos, die Sicherheit garantieren; der verlinkte Ratgeber und die Methodik differenzieren dagegen korrekt.
- Geschenk-Hub und Alters-Hub: ein Spielzeug mit genau einer Loesung sei nach dem dritten Mal fertig. Das widerspricht der Montessori-Empfehlung wiederholbarer Aufgaben.
- Puzzle-FAQ: mehr als zwei bis fuenf Teile seien fuer Einjaehrige unloesbar; das ist zu pauschal und passt nicht zur sonstigen Entwicklungsdifferenzierung.
- Geschenk-Hub: Buch plus Malmaterial wird als einzige Kombination von sechs Monaten bis vier Jahren dargestellt; Auswahl und Freigabe muessen produkt- und altersbezogen bleiben.
- Ueber-uns-Bildtext sagt, man verwende keine fremden Produktfotos, obwohl freigegebene Babywalz-Produktbilder inzwischen ein zentraler Bestandteil sind.
- Homepage bewirbt den Budgetartikel weiterhin mit acht Empfehlungen, live sind es drei.

Massnahme: diese Aussagen in sichtbarem Text und ggf. FAQ-Schema korrigieren; anschliessend semantischen Quercheck. Ein technischer Test mit gruenem Ergebnis ersetzt diesen Quercheck nicht. Auch der vorherige Audit hat diese restlichen Widersprueche nicht vollstaendig erfasst.

### P1: Die geplante Distribution ist noch nicht als Ergebnis belegt

Das vorhandene Outreach-Dokument enthaelt bereits geeignete Vorlagen. Ob Anfragen versandt und Verlinkungen gewonnen wurden, ist im geprueften Material nicht belegt. Eine allgemeine Websuche ersetzt kein Backlink-Inventar.

Massnahme: ein vierwoechiger Versuch mit EINER Ressource und EINEM Verteilungsweg. Empfehlung: kompakte Geschenkentscheidung fuer Menschen, die das Kind wenig kennen, innerhalb der bestehenden Geschenkseiten. Zehn passend ausgewaehlte Familienportale, lokale Elternredaktionen oder Ressourcenlisten individuell kontaktieren. Einzige klare Bitte: fachliche Rueckmeldung oder Aufnahme, sofern die Ressource wirklich passt. Keine Serien-Spam-Mails, kein Kauf von Rankinglinks.

Messung: tatsaechliche Kontakte, Antworten, veroeffentlichte Verweise, qualifizierte externe Einstiege, Affiliate-Klicks und spaeter bestaetigte Provisionen. Eine verschickte Mail oder neue Dokumentdatei ist noch kein Reichweitengewinn.

Alternativ kann ein bereits vorhandener eigener Social-Kanal genutzt werden. Nicht gleichzeitig Pinterest, Instagram, Reddit, YouTube und einen Newsletter neu aufbauen. Die Wahl haengt von Boris' vorhandenen Kontakten und zeitlicher Kapazitaet ab, nicht von behaupteten Kanal-Uplifts.

## Kosten und Erloese

Die konkreten Monatskosten und bestaetigten Affiliate-Provisionen wurden angefragt und liegen fuer diesen Audit noch nicht vor. Keine Annahmen als reale Rechnungsdaten behandeln.

Netlify bietet derzeit einen Free-Tarif mit 300 Credits monatlich; ein Produktionsdeploy kostet laut aktueller Preisliste 15 Credits. 30 taegliche Produktionsdeploys waeren bereits 450 Credits, bevor Besucher, Bandbreite oder Functions hinzukommen. Das gilt nur bei passendem Credit-Tarif und tatsaechlichem Production-Deploy pro Commit. Legacy-Tarif, Deployverknuepfung und Teamverbrauch sind nicht verifiziert: https://www.netlify.com/pricing/

Der Preisworkflow committet taeglich aktualisierte Zeitstempel und Angebotsdaten. Deshalb Kosten zuerst nach Deploys, Team-Sites, Traffic und Functions aufschluesseln. Ein pauschaler Wechsel auf Free kann bei diesem Workflow scheitern. Moegliche Loesung: Angebotsaktualitaet ausserhalb eines vollstaendigen Site-Deploys bereitstellen und redaktionelle Deploys buendeln. Frische- und Ausverkaufsregeln muessen dabei erhalten bleiben.

Plausible: bei diesem Volumen lohnt ein kostenpflichtiger Tarif nur, wenn seine Informationen konkrete Entscheidungen tragen. Abrechnungsmodell, Restlaufzeit und benoetigte Funktionen pruefen; vor einem Wechsel die Historie exportieren. GSC und Haendlerreports decken Suche und Affiliate-Ergebnis ab, ersetzen aber nicht vollstaendig Besuchsquellen und interne Website-Nutzung. Kein Self-Hosting-Projekt als vermeintlich kostenlose Alternative starten, ohne Betriebsaufwand einzurechnen.

### Rechenbeispiel, ausdruecklich keine Prognose

Monatsprovision = qualifizierte Besuche x Affiliate-Klickrate x Kaufquote beim Haendler x bestaetigte Nettoprovision pro Kauf.

Bei angenommenen 20 % Affiliate-Klickrate, 3 % bestaetigter Kaufquote und 2 Euro Provision ergibt sich 0,012 Euro pro Besuch. Fuer angenommene 30 Euro Fixkosten waeren damit etwa 2500 Besuche monatlich erforderlich. Die vier Affiliate-Klicker aus dem alten Plausible-Screenshot belegen keine stabile 20-%-Rate. Reale Erloese, Retouren und Trackingverluste koennen das Ergebnis deutlich veraendern.

Das spricht fuer fruehe Kostensenkung und eine begrenzte Validierungsphase. Ein Ausbau teurer Produktkategorien allein wegen hoeherer Provision ist keine begruendete Strategie; redaktionelle Passung bleibt unabhaengig von Verguetung.

## Konkreter Arbeitsplan

| Reihenfolge | Aufgabe | Verantwortlich | Fertig, wenn |
|---|---|---|---|
| 1 | Kosten und bestaetigte Provisionen zusammentragen; Netlify-Deployverbrauch pruefen | Boris liefert Tarif/Billing, Codex wertet aus | Monatliche Nettoluecke und moegliche Einsparung bekannt |
| 2 | Lagerbestands-Test und produkttreue Ersatzlinks korrigieren | Codex | Bestandswechsel und Feed-Ausfall werden korrekt verarbeitet; CI gruen |
| 3 | Verbleibende falsche Absolutheiten und veraltete Teaser abgleichen | Codex | Sichtbarer Text, Schema und Querverweise stimmen ueberein |
| 4 | Montessori auf dieselben drei altersgerechten Modelle und einen kurzen Einstieg bringen | Codex | Keine zweite widerspruechliche Vorauswahl; Mobile/Produktabgleich geprueft |
| 5 | Drei konkrete Praxisbeobachtungen oder pruefbare Eigenvergleiche einbauen | Boris liefert echte Nutzung, Codex strukturiert/verifiziert | Produktbezogener Zusatznutzen mit Grenzen und Herkunft sichtbar |
| 6 | Geschenk-Hub fokussieren und Ressource fuer zehn passende Kontakte vorbereiten | Codex recherchiert/entwirft, Boris gibt Kontakte/Versand frei | Ressource und individuelle Anschreiben fertig; Versand dokumentiert |
| 7 | Prioritaetsseiten nach finaler Korrektur einmalig zur erneuten Indexierung anfragen | GSC-Oberflaeche durch Boris oder autorisierte Browsersitzung | Anfrage fuer den finalen Stand dokumentiert; spaeter Crawl-Datum geprueft |
| 8 | Nach 4 und 8 Wochen Reichweite und bestaetigte Provisionen bewerten | Codex mit aktuellen Messdaten | Gleiche Zeitfenster, Seiten und Definitionen; Kostenentscheidung dokumentiert |

Nicht parallel starten: neue Designvarianten, flaechige neue Kategorien, viele neue Artikel, weitere Tracking-Abos oder bezahlter Traffic ohne tragfaehige Erloesbasis.

## Kontrollpunkte und Abbruchkriterium

- Nach vier Wochen: pruefen, ob die korrigierten Seiten neu gecrawlt wurden, externe Verteilung wirklich stattgefunden hat und passende Besucher/Haendlerklicks entstehen. Noch keinen statistischen UX-Uplift behaupten.
- Nach acht Wochen: zwei vergleichbare 28-Tage-Fenster und bestaetigte Affiliate-Erloese betrachten. Bleiben trotz durchgefuehrter Distribution und neuem Crawl passende Einstiege und Kaufaktivitaet aus, bezahlte Zusatzdienste beenden bzw. zum Vertragsende auslaufen lassen und das Projekt kostenguenstig weiterbetreiben oder pausieren.
- Acht Wochen sind ein betriebswirtschaftlicher Entscheidungspunkt, keine Zusage, dass SEO in dieser Zeit funktionieren muss. Kein automatisches Loeschen bestehender Seiten wegen geringer Impressionen.
- Der fruehere pauschale Design-Stopp bis Ende September schuetzt nicht vor belegten Fehlern. Produktfehler und Inhaltswidersprueche jetzt beheben; weitere breite Umbauten bis nach der Beobachtungsphase vermeiden.

## Quellen zur Einordnung

- Google, hilfreiche Inhalte und Originalitaet: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google, Reviews mit nachvollziehbarem Mehrwert: https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews
- Google, erneutes Crawling: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl (Anfrage garantiert keine Indexierung; wiederholte Anfragen beschleunigen sie nicht.)
- Netlify, aktuelle Tarife und Produktionsdeploys: https://www.netlify.com/pricing/
- Wettbewerbsstichprobe fuer Montessori: https://wunschkind-community.de/montessori-spielzeug-1-jahr/ (zeigt Community-Abstimmung und modellspezifische Einordnungen; deren Aussagen wurden nicht als Produktnachweise uebernommen.)

## Indexierungsbefund

Am 07.09.2026 direkt per URL Inspection geprueft:

- 32 von 38 Sitemap-Seiten: `Submitted and indexed`.
- Zwei: `Discovered - currently not indexed` (Kinderwagen-Arten und Kinderwagen-Kofferraum).
- Vier: `URL is unknown to Google` (Kinderwagen Stadt/Land, Gesamtpreis, Gebrauchtkauf und Spielzeug rotieren).
- Alle 32 indexierten Seiten haben uebereinstimmende deklarierte und von Google gewaehlte Canonicals.
- Alle 38 Sitemap-URLs liefern beim Live-Abruf HTTP 200, eine H1 und den passenden Self-Canonical; keine blockierende Robots-Metaanweisung gefunden.
- Stichproben: `.html`-Budget-URL und www-Homepage liefern 301 auf ihre kanonische URL; erfundene URL liefert echten 404.
- Sitemap zuletzt von Google am 05.09.2026 gelesen, 38 eingereichte URLs, null Warnungen und null Fehler. Das veraltete `indexed: 0`-Feld der Sitemaps-API ist kein Beleg fuer null indexierte URLs; entscheidend sind die einzelnen URL-Pruefungen.
- Der separat gepruefte Kinderwagen-Navigator ist Google unbekannt und liefert live `noindex,follow`. Das ist laut Projektplan absichtlich so, bis Daten- und Releasepruefungen erfuellt sind; keine automatische Entfernung von `noindex` empfehlen.

| Wichtige URL | Letzter von GSC gemeldeter Crawl |
|---|---|
| Homepage | 04.07.2026 |
| Geschenke 1 Jahr | 18.06.2026 |
| Geschenke 2 Jahre | 29.07.2026 |
| Geschenke 3 Jahre | 15.07.2026 |
| Geschenk-Hub | 19.08.2026 |
| Montessori | 18.08.2026 |
| Unter 20 Euro | 26.08.2026 |
| Spielzeug 12-18 Monate | 04.09.2026 |

Die alten Crawl-Zeitpunkte sind API-Beobachtungen, kein Nachweis einer Crawler-Sperre. Der juengere Crawl der 12-18-Monate-Seite zeigt, dass Google weiterhin Seiten abruft. Nach den notwendigen Inhaltskorrekturen sollten insbesondere Homepage, Geschenk-Hub, Montessori, Geschenke 1/2 Jahre und Budgetartikel einmalig fuer den dann finalen Stand in der GSC-Oberflaeche angefragt werden. Liegt bereits eine Anfrage fuer genau diesen Stand vor, nicht erneut einreichen. Eine gelesene Sitemap garantiert weder Crawl jeder enthaltenen URL noch Indexierung.

Die erneute unabhaengige Abfrage des 28-Tage-Vergleichs am Ende des Audits bestaetigte die oben genannten Zahlen. Am Live-Code wurden in diesem Audit keine Aenderungen vorgenommen.

## Umsetzung nach Freigabe, 07.09.2026

Status: lokal umgesetzt; noch nicht committed, gepusht oder als Produktionsstand validiert. Vor Beginn per Fast-forward auf origin/main aktualisiert; automatische Preisupdates erhalten.

- Aufgabe 2 umgesetzt: Lagerwechsel sind kein permanenter Testfehler mehr. Der Importtest prueft gezielt ausverkauft und erneut verfuegbar. Budgetkarten behalten ihren benannten Babywalz-Produktlink statt zu einem anderen Amazon-Modell zu wechseln, auch ohne JavaScript.
- Zusaetzlicher Fehler entdeckt und behoben: Der Designwechsel hatte die Budget-Seitenkennung entfernt. Eine explizite HTML-Preisgrenze verhindert jetzt Preise ueber 20 Euro inklusive Versand. Ausverkauf und Budgetueberschreitung werden im Linktext kenntlich gemacht, unbestaetigte Preise nicht angezeigt.
- Aufgabe 3 umgesetzt: veraltete Acht-Produkte-Vorschau, falsche Sicherheitsgarantien, starre Puzzle-Aussagen, Wiederholungs-Abwertung und Bildquellenbeschreibung bereinigt. Sichtbare FAQs und JSON-LD stimmen ueberein; betroffene Aenderungsdaten und Sitemap aktualisiert.
- Aufgabe 4 umgesetzt: drei konkrete Montessori-Karten direkt nach Einleitung und Affiliate-Hinweis. Zwei Einstiege rund um ein Jahr und ein klar als ab 18 Monaten beschriebener Folgeschritt. Doppelte Vorauswahl, Busy Board und Motorikwuerfel entfernt. ItemList, Evidenzregister und Bildbaseline angepasst; kein Badge von einem verbleibenden Bild entfernt.
- Aufgabe 6 teilweise umgesetzt: Geschenk-Hub startet direkt mit seiner Auswahl statt vorher auf Monatsphasen abzulenken. Zehn Recherchekandidaten und ein Anschreibentext liegen in `../growth/outreach-kandidaten-2026-09-07.md`. Individuelle Endfassung, Passungspruefung und Versandfreigabe stehen noch aus; niemand wurde kontaktiert.

### Validierung

- SEO-Smoke-Test: 38 Sitemap-Seiten lokal bestanden.
- Interne Links: bestanden, maximale Klicktiefe 2.
- Affiliate-Integritaet, Awin-Angebote, Preis-Snapshot, Tracking-Vertrag, Positionierung, Navigation, Produkt-Evidenz und KI-Bildherkunft: bestanden.
- Kinderwagen-Beta-Gate: alle 19 Pruefungen bestanden. Fuenf bekannte Datenwarnungen zu fehlender Breite bei My-Junior-Modellen bleiben bestehen; keine Werte erfunden.
- Preis-UI mit kontrollierten Daten auf 390/768/1440 Pixeln; abgelaufene Daten, fehlende Angebote, Ausverkauf, Budgetueberschreitung und Serverfehler abgedeckt. Separater Test ohne JavaScript ergaenzt.
- Montessori und Geschenk-Hub auf 390/1440 Pixeln per Browser und Screenshots geprueft, kein horizontaler Overflow. Erster Montessori-CTA mobil bei ca. 2147 statt 3550 Pixeln. Das ist ein Layoutbefund, kein belegter Conversion-Uplift.

### Verbleibende Abhaengigkeiten

1. Kosten- und Erloesdaten von Boris fuer Aufgabe 1; keine Tarife geaendert oder Dienste gekuendigt.
2. Drei echte Beobachtungen von Boris fuer Aufgabe 5; keine Produkttests behauptet.
3. Commit/Push und anschliessender Live-Check vor Aufgabe 7. Erst dann gegebenenfalls einmalige GSC-Anfrage fuer die finalen Seiten, nicht fuer den lokalen Stand.
4. Nach vier und acht Wochen ab Veroeffentlichung vergleichbare Zeitfenster fuer Aufgabe 8 auswerten. Bis dahin keine Wirkung dieser Aenderungen behaupten.
