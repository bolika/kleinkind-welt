# Growth- und UX-Plan

Stand: 01.09.2026
Domain: `kleinkind-welt.de`
Status: datenbasierte Priorisierung, keine kausale UX- oder SEO-Wirkung behauptet

## Umsetzungsstand 01.09.2026

Im Projekt umgesetzt:

- Freshness-Daten, sichtbare Aktualisierungen, Sitemap und `llms.txt` synchronisiert
- saisonalen Homepage-Einstieg auf Geschenke, Herbst und Weihnachten umgestellt
- Spielpfade auf den Seiten 12-18 und 18-24 Monate nach oben gezogen
- Geschenk-Hub, Weihnachtsseite, Montessori-Seite und Geschenke ab 2 Jahren fokussiert
- kontextuelle interne Links zwischen Geschenk-, Alters-, Montessori- und Kinderwagen-Inhalten ergänzt
- 14 exakt gemappte Babywalz-Angebote mit Preis, Bestand, Deeplink und freigegebenem Feed-Bild eingebunden
- fünf vollständige Babywalz-Kinderwagenangebote mit Produktbild in den Navigator integriert, ohne die redaktionelle Rangfolge zu verändern
- tägliche Feed-Aktualisierung und technische Gates für Artikel- und Kinderwagenangebote erweitert
- Mobile- und Desktop-Browsertests für Preis-, Bild- und CTA-Darstellung ergänzt

Noch nicht als Wirkung validiert:

- GSC- und Plausible-Nachhervergleich frühestens Ende September
- drei eigene Elternbeobachtungen oder Produktchecks
- optional fünf moderierte Eltern-Tests

Der Kinderwagen-Navigator bleibt `noindex`, bis seine zeitkritischen Herstellerdaten, Safety-Prüfungen und manuellen Release-Gates aktualisiert sind.

## Executive Summary

Kleinkind-Welt hat aktuell weder einen allgemeinen Ranking-Crash noch ein grundlegendes technisches Indexierungsproblem. Die GSC-Impressionen stiegen im 28-Tage-Vergleich um 31,6 Prozent und die mittlere Position verbesserte sich leicht. Das Kernproblem ist die weiterhin sehr geringe Rankingnaehe: Die meisten Impressionen entstehen auf Positionen um 60 bis 70 und erzeugen deshalb noch keine Klicks.

Die neuen Spielpfad-Seiten sind heuristisch klarer als die alten Produktlisten. Besonders `spielzeug-unter-20-euro` und `geschenke-1-jahr` reduzieren Auswahlstress und fuehren mit genau einem Produkt und einem Haendler-CTA pro Situation. Der Plausible-Export kann diese Wirkung noch nicht bestaetigen, weil das Redesign erst am 26. und 27. August live ging und zwei der vier Seiten im Export keine Besucher hatten.

Die naechsten 90 Tage sollten deshalb nicht fuer neue Contentmasse oder einen flaechigen Redesign-Rollout genutzt werden. Der Fokus liegt auf drei vorhandenen Nachfragefeldern:

1. Geschenk-Hub und Geschenkseiten
2. Montessori-Spielzeug ab 1 Jahr
3. stabile Messung der neuen Spielpfad-Seiten

## Agenten-Setup

Die Analyse wurde durch einen Supervisor und vier unabhaengige Arbeitsstraenge erstellt:

| Rolle | Auftrag | Evidenz |
|---|---|---|
| Search Intelligence | GSC-Vergleiche, Queries, Landingpages und Indexierung | GSC API bis 29.08.2026 |
| Product Analytics | Reichweite, Quellen, Engagement und Affiliate-Klicks | Plausible-Export 04.08.-31.08.2026 |
| UX/CRO | Neue Spielpfade gegen alte Artikelseiten | 16 Live-Ansichten auf 390 und 1440 px |
| Content Growth/SEO | Cluster, Kannibalisierung, Freshness, AEO und 90-Tage-Plan | Live-Site, Sitemap, GSC und lokale Architektur |

## Suchsichtbarkeit

| Zeitraum | Klicks | Impressionen | CTR | Position |
|---|---:|---:|---:|---:|
| 05.07.-01.08. | 1 | 244 | 0,41 % | 70,2 |
| 02.08.-29.08. | 0 | 321 | 0 % | 69,2 |
| Veraenderung | -1 | +31,6 % | -0,41 PP | 1,0 besser |

Der 7-Tage-Vergleich zeigt 87 auf 32 Impressionen, aber gleichzeitig eine Positionsverbesserung von 70,7 auf 67,3. Das spricht bei der kleinen Datenmenge eher fuer schwankende Ausspielung als fuer einen neuen Rankingverlust. Eine weitere Woche beobachten; erst bei erneut sinkenden Impressionen und schlechteren Positionen eingreifen.

### Nachfragefelder

- Geschenke und Geburtstage: 65,9 Prozent der sichtbaren Query-Impressionen
- Montessori bzw. Spielzeug ab einem Jahr: 29,2 Prozent
- Allgemeine Spielzeugfragen: 4,2 Prozent
- Budget-Queries: 0,3 Prozent

Staerkste Wachstumsseite ist `montessori-spielzeug-kleinkind` mit 90 statt 14 Impressionen. Der Geschenk-Hub bleibt mit 154 Impressionen das groesste Nachfrageziel, rankt aber erst um Position 70.

### Indexierung

14 von 20 priorisierten URLs sind indexiert. Offen sind:

- gefunden, nicht indexiert: `spielzeug-rotieren-kleinkind`
- gefunden, nicht indexiert: `kinderwagen-arten`
- Google unbekannt: `kinderwagen-stadt-oder-land`
- Google unbekannt: `kinderwagen-kofferraum`
- Google unbekannt: `kinderwagen-gesamtpreis`
- Google unbekannt: `kinderwagen-gebraucht-kaufen`

Alle stehen bereits in der fehlerfreien Sitemap. Fuer diese URLs sind manuelle URL-Pruefung und Indexierungsantrag sinnvoll; weitere technische Redirect- oder Canonical-Arbeit ist nicht belegt.

## Plausible-Baseline

| Kennzahl | 04.08.-31.08.2026 |
|---|---:|
| Besucher | 17 |
| Sitzungen | 17 |
| Seitenaufrufe | 29 |
| Seiten je Sitzung | 1,71 |
| Absprungrate | ca. 65 % |
| Sitzungsdauer | ca. 39 Sekunden |
| Affiliate-Klicker | 3 |
| Affiliate-Klicks | 6 |

Die Stichprobe ist sehr klein. Eine einzelne Session verschiebt Raten um rund sechs Prozentpunkte. `Affiliate-Klick` und `Outbound Link: Click` bilden sehr wahrscheinlich dieselben sechs Klicks ab und duerfen nicht addiert werden.

Ein Besucher kam ueber ChatGPT. Das bestaetigt erstmals AI-Discovery, aber die Session bestand nur aus einem kurzen Seitenaufruf. Daraus darf noch keine AI-Traffic-Qualitaet oder Wachstumsrate abgeleitet werden.

## UX-Vergleich

| Seite | Muster | Heuristischer Score | Einordnung |
|---|---|---:|---|
| Spielzeug unter 20 Euro | neuer Spielpfad | 90 % | klarste Entscheidung, SEO-Tiefe beobachten |
| Geschenke 1 Jahr | neuer Spielpfad | 90 % | beste Referenz fuer hybriden Rollout |
| Spielzeug 12-18 Monate | Spielpfad plus Altstruktur | 75 % | Pfad beginnt mobil zu spaet |
| Spielzeug 18-24 Monate | Spielpfad plus Altstruktur | 75 % | Pfad beginnt mobil zu spaet |
| Badespielzeug | alte Struktur | 73 % | solide, aber mehrere gleichwertige CTAs |
| Outdoor-Spielzeug | alte Struktur | 73 % | solide, aber weniger klare Entscheidung |
| Geschenke 2 Jahre | alte Struktur | 60 % | hohe Auswahl- und Scrolllast |
| Motorikspielzeug | alte Struktur | 60 % | sehr lang und CTA-reich |

### Beobachtet

- Der Spielpfad bietet drei erkennbare Situationen und genau einen Haupt-CTA je Empfehlung.
- Alte Kaufboxen zeigen Hauptprodukt und Alternativen gleichzeitig und erzeugen auf Mobile mehrere gleich aussehende Entscheidungen.
- Bei `geschenke-1-jahr` beginnt der Pfad nach ca. 1,3 mobilen Viewports, der erste CTA nach 2,0.
- Bei `spielzeug-12-18-monate` beginnt der Pfad nach 3,7 Viewports, der CTA nach 4,5.
- Bei `spielzeug-18-24-monate` beginnt der Pfad nach 4,6 Viewports, der CTA nach 5,4.
- Canonical, H1, Meta-Description und relevante strukturierte Daten blieben auf allen geprueften Seiten erhalten.

### Entscheidung

Beibehalten: Drei Situationen, aktive Wegmarke, `Passt, wenn`, `Eher nicht, wenn`, ein Produkt und ein Haendler-CTA je Moment.

Aendern: Auf den beiden Altersseiten den Spielpfad direkt nach Intro und Affiliate-Hinweis platzieren. Ziel ist die erste Auswahl spaetestens nach 1,5 und der erste CTA nach 2,5 mobilen Viewports.

Nicht ausrollen: Die radikale Kuerzung von `spielzeug-unter-20-euro` nicht pauschal kopieren. Der beste Standard ist ein hybrider Aufbau: oben drei klare Wege, darunter kompakte Vergleichs- und Beratungstiefe fuer SEO und Nutzer mit hoeherem Informationsbedarf.

## 30/60/90-Tage-Plan

### Tag 1 bis 14: Discovery und Messbarkeit reparieren

1. Echte `dateModified`-, sichtbare Aktualisierungs- und Sitemap-`lastmod`-Werte der vier ueberarbeiteten Seiten synchronisieren.
2. `llms.txt` auf den aktuellen Seitenstand bringen.
3. Sommer-Modul auf der Homepage durch einen Geschenk-/Herbst-/Weihnachts-Einstieg ersetzen; Sommerseite weiterhin erreichbar lassen.
4. Spielpfad auf den beiden Altersseiten nach oben verschieben, ohne den unteren SEO-Inhalt zu entfernen.
5. Geschenk-Hub als eindeutiges Ziel fuer `Geschenke fuer Kleinkinder` staerken und von der Homepage kontextuell verlinken.
6. Die sechs offenen URLs in GSC pruefen und Indexierung beantragen.

Messung: technischer Crawl nach Release, passende Canonicals, neuer GSC-Crawl, keine neuen Fehler, Redesign-Kohorte ab 28.08. unvermischt dokumentieren.

### Tag 15 bis 45: Nachfrage in Nutzen uebersetzen

1. Geschenk-Hub mit einer schnellen Auswahl nach Alter, Budget und Beziehung zum Kind ueberarbeiten.
2. Weihnachtsseite frueh aktualisieren und Empfehlungen nach Moment und Alter statt Produktmenge strukturieren.
3. Montessori-Seite auf `Montessori-Spielzeug ab 1 Jahr` fokussieren: kurze Direktantwort, Kriterienmatrix, wenige Auswahltypen und Primarquellen.
4. Auf `geschenke-2-jahre` vorhandene Jungen-/Maedchen-Longtails inklusiv innerhalb der Seite beantworten, keine duennen Geschlechterseiten anlegen.
5. Altersgrenzen sichtbar klaeren: `bis 18 Monate` gegen `ab 18 Monate` sowie `erstes Babyspielzeug` auf eine primaere Zielseite ausrichten.

Messung: Impressionen, Position und Klicks pro Zielseite; Plausible-Besucher, Scrolltiefe, interne Weiterklickrate und Affiliate-Klicker. Keine Gewinnerentscheidung unter 30 Einstiegen pro Seite.

### Tag 46 bis 90: Autoritaet und AI-Zitierbarkeit aufbauen

1. Drei dokumentierte eigene Beobachtungen oder Produktchecks fuer Geschenk- und Montessori-Cluster erstellen, jeweils mit Methode, Grenzen, Quelle und Datum.
2. Jede Kernseite mit mindestens zwei kontextuellen Inlinks aus Hub, Alters- oder Nachbarseiten versorgen.
3. Zitierfaehige Kurzbefunde und Entscheidungstabellen mit stabilen Ankern in `llms.txt` und den Artikeln synchronisieren.
4. Outreach nicht mit Affiliate-Listen, sondern mit einem nutzbaren Artefakt betreiben: Siegel-Datensatz, Entscheidungsmatrix oder Eltern-Kaufcheck.
5. Kinderwagen-Cluster nur warten; keine weiteren Seiten produzieren, bis Suchnachfrage oder direkte Nutzung steigt.

Messung: drei qualifizierte Erwaehnungen oder Links, mindestens drei AI-Referrals pro 28 Tage als Beobachtungsziel, wiederkehrende organische Klicks und Affiliate-Klicker.

## Content-Gate

In den naechsten 90 Tagen keine neue URL ohne mindestens eines dieser Signale:

- mindestens 20 GSC-Impressionen fuer eine klar getrennte Suchintention,
- dieselbe konkrete Elternfrage aus mindestens drei unabhaengigen Quellen,
- ein eigener Datensatz oder eine eigene Untersuchung, die keine vorhandene Seite sinnvoll aufnehmen kann.

## Naechster Messpunkt

Der erste faire Nachher-Zeitraum fuer das Redesign ist 28.08.-24.09.2026. Wegen des GSC-Datenverzugs sollte die gemeinsame Auswertung fruehestens am 27.09. erfolgen. Bis dahin wird `spielzeug-unter-20-euro` nicht erneut grundlegend umgebaut.

## Aufgabenverteilung

### Direkt im Projekt umsetzbar

- Freshness-Daten und `llms.txt` synchronisieren
- saisonales Homepage-Modul wechseln
- Spielpfade auf 12-18 und 18-24 Monate nach oben ziehen
- Geschenk-Hub und Montessori-Seite fokussiert ueberarbeiten
- interne Links und Altersgrenzen bereinigen
- 28-Tage-GSC- und Plausible-Auswertung vorbereiten

### Betreiber-Unterstuetzung erforderlich

- sechs URLs manuell in GSC zur Indexierung beantragen
- drei echte Elternbeobachtungen bzw. eigene Produktchecks liefern oder bestaetigen
- Ende September einen neuen Plausible-Export bereitstellen
- Amazon- und Awin-Bestell-/Provisionsberichte fuer denselben Zeitraum exportieren
- optional 5 Eltern fuer kurze, moderierte Entscheidungstests rekrutieren

## Quellen und Grenzen

- GSC API, Property `sc-domain:kleinkind-welt.de`, Daten bis 29.08.2026
- Plausible-Export `Plausible export kleinkind-welt.de 28d .zip`, 04.08.-31.08.2026
- Live-Site-Audit am 01.09.2026, Mobile 390 x 844 und Desktop 1440 x 1000
- Sitemap mit 38 URLs
- GSC anonymisiert seltene Queries; Plausible- und GSC-Daten sind nicht personengenau zusammenfuehrbar
- UX-Scores sind heuristische Bewertungen, keine validierten Nutzertestwerte
