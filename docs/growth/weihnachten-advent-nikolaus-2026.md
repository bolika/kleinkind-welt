# Saisonplan: Advent, Nikolaus und Weihnachten 2026

Recherche: 07.09.2026. Status: Saisonseiten lokal umgesetzt; noch nicht veroeffentlicht. Neue Produktkandidaten warten auf einen aktuellen Vollfeed.

## Umsetzungsstand 07.09.2026

- Weihnachtsseite von acht auf drei bestehende, exakt zugeordnete Babywalz-Produkte reduziert: Fuehlbuch, DUPLO und Schiebewagen. Produktkarten nach vorn gezogen, sichtbare FAQs und Schema synchronisiert, unbelegte pauschale Wirkungsversprechen entfernt.
- Neue Adventsseite mit 24 gemeinsamen Momenten, Altersorientierung, Selbstbefuell-Ideen und Kriterien fuer Fertigkalender erstellt. Keine ungeprueften Fertigkalender empfohlen.
- Neue Nikolausseite mit drei bestehenden Babywalz-Zuordnungen erstellt: Pappbilderbuch, Stapelbecher und Klopfbank. Das Buch ist die ruhigere kleine Aufmerksamkeit; Groesse und Lautstaerke der Klopfbank werden klar begrenzt.
- Geschenk-Hub, Querverweise, Sitemap, Redirects, llms.txt und Evidenzregister aktualisiert. Neue Nikolaus-Platzierungen sind im bestehenden Awin-Mapping erfasst; keine neuen Preiswerte aus dem alten Vollfeed veroeffentlicht.
- Pruefungen: SEO-Smoke fuer 40 Seiten, interne Links, Awin-Angebote, Preis-Snapshot, Affiliate-Integritaet, Tracking, Navigation, Positionierung und Bildherkunft bestanden. Browserpruefung auf 390 und 1440 Pixeln fuer alle drei Saisonseiten inklusive Produktbildern, 24 Momenten und Sprungzielen bestanden. Bildtests nutzen kontrollierte Frische/Bestandsdaten, sie belegen keine aktuelle Lieferbarkeit.
- Noch offen: aktueller Vollfeed fuer neue Produktkandidaten. Lokal ist AWIN_BABYWALZ_FEED_URL nicht gesetzt; der Schluessel im GitHub-Secret ist nicht auslesbar. Kein Workflow mit automatischem Push wurde ohne Veroeffentlichungsfreigabe gestartet. Neuer Export wurde bei Boris angefragt.
- Noch offen: separater Advents-Download fuer Druck und Handy sowie Anschluss an den bestehenden DOI-Funnel. Keine nicht vorhandenen Downloads beworben oder frei zugaenglich gemacht. Der frei lesbare Artikel ist bereits nutzbar.
- Noch offen: Veroeffentlichung und anschliessender Live-/GSC-Check. Kein Commit oder Push in diesem Schritt.

## Datenbasis und Grenzen

- Lokaler Vollfeed `imports/awin/babywalz.csv.gz`: 40.934 Zeilen, 21.051 unterschiedliche merchant_product_id. Varianten sind weiterhin eigene IDs, keine 21.051 unterschiedlichen Spielzeugmodelle.
- Dateizeitstempel: 25.08.2026; `last_updated` ist bei den ausgewaehlten Zeilen leer. Preise und Bestand unten sind historische Feed-Beobachtungen, keine aktuellen Shopzusagen. Der taegliche Preis-Snapshot der bereits eingebundenen Produkte ersetzt keinen neuen Vollfeed fuer weitere Produkte.
- Nach Haendlerprodukt-ID dedupliziert; vor Freigabe beide Feedvarianten auf widerspruechliche Preise/GTIN pruefen. Nicht einfach den letzten Treffer als verbindlich uebernehmen.
- Bestehende Weihnachtsseite: `/artikel/weihnachtsgeschenke-kleinkind`, acht Empfehlungen, darunter bereits drei Babywalz-Angebote. Keine zweite Weihnachtsseite anlegen.
- In der Sitemap noch keine eigene Adventskalender- oder Nikolausseite.
- Keine Suchvolumina oder Umsatzprognosen erhoben. Termine sind redaktionelle Zieltermine, keine SEO-Erfolgsgarantie.

## Produktkandidaten

Alle Altersangaben stammen aus der Beschreibung im lokalen Feed. Sie sind vor Einbindung am konkreten Modell zu bestaetigen. Alle sieben Kandidaten haben GTIN, Awin-Deeplink und mindestens ein Bildfeld; Bildabruf und Detailabgleich stehen noch aus.

| Produkt | Haendler-ID | Altersangabe im Feed | Produktpreis / Versand im alten Feed | Einsatz und Grenze |
| --- | --- | --- | --- | --- |
| Sterntaler Fingerpuppe Hase Hanni | 8318930 | ab Geburt | 6,99 / 4,99 EUR | Nikolaus: gemeinsam eine kleine Geschichte spielen. Nicht als selbststaendige Beschaeftigung eines Babys darstellen. |
| Gerstenberg: Die kleine Raupe Nimmersatt, Mein Fingerpuppenbuch | 7112513 | ab 12 Monaten | 13,00 / 4,99 EUR | Nikolaus oder Vorlesemoment; eine Buchalternative, nicht zusaetzlich jedes Raupenbuch empfehlen. |
| Solini Puzzle Woher komme ich? | 7932766 | ab 12 Monaten | 9,79 / 4,99 EUR | Erstes Zuordnen; sechs Teile. Kandidat fuer Puzzle-/Geschenkseite, keine Erweiterung der gerade reduzierten Budgetseite. |
| Solini Stapelwuerfel Waldfreunde | 7415540 | ab 12 Monaten | 12,59 / 4,99 EUR | Weihnachten: gemeinsam bauen und umwerfen. Keine Versprechen zum Alphabetlernen aus dem Werbetext uebernehmen. |
| Carlsen Hoer mal: Die schoensten Weihnachtslieder | 8342105 | ab 2 Jahren | 13,00 / 4,99 EUR | Gemeinsames Singen; Sound und Batterien offen nennen. Alternative zum ruhigen Buch, nicht Standard fuer alle. |
| Thienemann-Esslinger: Es wird Weihnachten, kleine Maus, Puste-Licht-Buch | 7496532 | ab 18 Monaten | 15,00 / 1,99 EUR | Weihnachtliches Vorleseritual; Licht und Batterien nennen. Maximal eines der beiden Effektbuecher priorisieren. |
| Tonies Adventskalender 2026: Milas Weihnachtsreise | 8434387 | ab 3 Jahren | 16,99 / 1,99 EUR | Nur fuer Familien mit passender Toniebox. Im alten Feed NICHT verfuegbar; bis Aktualisierung keine Kaufempfehlung. |

Fuer bestehende groessere Weihnachtsideen sind ausserdem `182618` Solini Kugelbahn (Feed: ab 18 Monaten), `8261296` Small Foot Kugelbahn Dino (ab 18 Monaten) und `8339112` Musterkind Spielkueche & Cafe Robusta (ab 3 Jahren) Recherchekandidaten. Sie ersetzen gegebenenfalls generische Empfehlungen; nicht alle zusaetzlich anfuegen. Exakte Variante, Masse, Warnhinweise, Lieferumfang und aktuelles Angebot noch pruefen.

### Nicht automatisch aufnehmen

- Undercover Adventskalender Spiderman, Paw Patrol und Frozen: laut Feed ab vier Jahren, daher keine Empfehlung fuer 1- bis 3-Jaehrige.
- Tonies Ein knuspriges Weihnachtsfest: laut Feed ab fuenf Jahren und nicht verfuegbar.
- Ein im Shop gefundener [Vertbaudet-Holz-Adventskalender](https://www.baby-walz.de/p/vertbaudet-kinder-adventskalender-mit-spielzeug-aus-holz-fsc-natur-4193969/) nennt im Beschreibungstext 12 Monate, im Detailfeld jedoch Geburt. Zudem Versand durch Partner. Im lokalen Kalender-Feedfilter nicht enthalten. Bis Alterswiderspruch, Feed-Zuordnung und Affiliate-Abdeckung geklaert sind, nur Recherchekandidat, keine direkte Produktempfehlung.

## Drei getrennte Suchintentionen

| Prioritaet / Zieltermin | Seite und Suchintention | Inhalt und Conversion |
| --- | --- | --- |
| 1 / 14.09. | Bestehende Weihnachtsgeschenke-Seite: passendes Hauptgeschenk finden | Drei erste Wege: gemeinsam bauen, Geschichten erleben, Rollenspiel. Zunaechst drei Empfehlungen sichtbar, maximal sechs insgesamt. Alter, Platz und Budget als Entscheidungshilfe, ein primaerer Produktlink pro Karte. |
| 2 / 21.09. | Neu: `/artikel/adventskalender-kleinkind` - passenden Kalender waehlen oder selbst befuellen | Auswahl zwischen gemeinsamen Momenten, wenigen altersgerechten Dingen und fertigem Kalender. Abschnitte fuer 1, 2 und 3 Jahre auf EINER Seite. Keine duennen Einzel-URLs je Alter. Fertigkalender nur mit bestaetigter Passung. |
| 3 / 28.09. | Neu: `/artikel/nikolausgeschenke-kleinkind` - eine kleine Aufmerksamkeit finden | Drei bis fuenf Ideen: Vorlesen, kleine Auffuehrung, einfaches Spielen. Budget und Versand getrennt ausweisen; nicht als zweite Weihnachts-Hauptgeschenkeliste schreiben. |

Termine gelten vorbehaltlich aktueller Produktpruefung. Keine Veroeffentlichung leerer Platzhalter fuer ein Datum.

## Adventskalender-Konzept

Leitidee: **24 kleine Momente statt 24 neuer Dinge.**

- Ein einfacher Kalender fuer Eltern, nicht 24 Produktempfehlungen: beispielsweise gemeinsam ein Buch anschauen, ein Lied singen, einen Turm bauen oder eine Fingerpuppengeschichte erzaehlen.
- Wiederholungen sind erwuenscht. Ein bereits vorhandenes Buch oder Spielzeug darf mehrfach vorkommen; kein Kaufzwang.
- Vorschlag fuer die Zusammensetzung: 18 gemeinsame Momente, vier Wiederholungs-Wunschmomente und zwei optionale kleine Geschenke. Als redaktionelles Konzept kennzeichnen, nicht als paedagogisch validierte Regel.
- Die Website beantwortet Auswahl-, Alters- und Budgetfragen frei zugaenglich. Der optionale ausdruckbare Plan und die Handyversion werden gemeinsam ueber den bestehenden Newsletter mit Double-Opt-in angeboten. Downloads nicht offen verlinken; bestehende Freebie-Regel erhalten.
- Kein eigenes taegliches Mail-System bauen. Zunaechst ein PDF und eine mobile Ausgabe im bestehenden Funnel, damit Betreuung und Kosten klein bleiben.
- Konkrete Aktivitaeten vor Veroeffentlichung altersbezogen pruefen; keine Kleinteile oder Bastelmaterialien allein aufgrund eines DIY-Trends empfehlen.

## Verlinkung und Verbreitung

- Geschenk-Hub verlinkt nach Fertigstellung alle drei Anlaesse; Weihnachten bleibt die Hauptgeschenk-Auswahl.
- Budget- und Geburtstagsseiten erhalten hoechstens einen passenden saisonalen Querverweis, keine zusaetzlichen Produktbloecke.
- Homepage bekommt im Oktober einen kompakten saisonalen Einstieg statt einer weiteren grossen Sektion.
- Newsletter: ein September-/Oktober-Hinweis zum Kalender, ein November-Hinweis zu Nikolaus; nur bestehende berechtigte Empfaenger. Kein Versand in diesem Arbeitsschritt.
- GSC nach Veroeffentlichung: Seiten und Suchanfragen getrennt fuer Adventskalender, Nikolaus und Weihnachtsgeschenke beobachten. Impressions, Klicks, Einstiege und Affiliate-Klicker mit absoluten Fallzahlen berichten. Keine Ranking- oder Umsatzgarantien.

## Naechste Umsetzungsschritte

1. Aktuellen Vollfeed beschaffen und Kandidaten erneut abgleichen. Vorhandenen Importweg nutzen; keine API-Schluessel ins Repository.
2. Zuerst drei bis vier Kandidaten final pruefen: Fingerpuppe, Fingerpuppenbuch, Stapelwuerfel und ein saisonales Buch. Titel, GTIN, Alter, Bild, Variante, Preis/Versand und Linkziel muessen zusammenpassen.
3. Freigegebene Kandidaten in Mapping und Preis-Snapshot aufnehmen, nicht statische Preise aus diesem Dokument ins HTML kopieren.
4. Weihnachtsseite gezielt ueberarbeiten; danach Advent und Nikolaus aufbauen. Schema, Evidenzregister, Sitemap und interne Verweise jeweils gemeinsam pflegen.
5. Mobile/Desktop, falsche oder veraltete Preise, Nichtverfuegbarkeit, Bilder und Affiliate-Tracking testen. Erst danach Veroeffentlichung.

Von Boris benoetigt: nur falls der bestehende Downloadweg keinen neuen Vollfeed liefert, einen aktuellen Awin-Export bereitstellen. Fuer persoenliche Erfahrungsangaben weiterhin echte Beobachtungen; fuer diesen Plan keine neuen Tools oder bezahlten Abos erforderlich.
