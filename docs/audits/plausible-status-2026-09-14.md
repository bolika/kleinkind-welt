# Plausible-Ergaenzung zum GSC-Status

Ausgewertet am 14.09.2026. Quelle: privater ZIP-Export fuer 07.-13.09.2026. Vorwoche 31.08.-06.09. aus den Tageszeilen des zuvor bereitgestellten 28-Tage-Exports. Rohdaten nicht kopiert, entpackt oder hochgeladen. Keine Website-Aenderungen.

## Reichweite und Nutzung

| Kennzahl | 07.-13.09. | 31.08.-06.09. |
| --- | ---: | ---: |
| Besuche | 9 | 10 |
| Seitenaufrufe | 23 | 19 |
| Seitenaufrufe je Besuch | 2,56 | 1,90 |

Keine Summe taeglicher Besucher als eindeutige Wochenbesucher ausgegeben. Die Besuchszahl ist nahezu unveraendert. Mehr Seitenaufrufe sind ein vorsichtig positives Nutzungssignal, aber kein belegter Design-Uplift: Ein einzelner Besuch am 13.09. enthaelt sieben der 23 Aufrufe. Zeitfenster und Exportzeitpunkte sind unterschiedlich; spaetere Messkorrekturen sind nicht ausgeschlossen.

Kanalzuordnung laut Export: KI-Assistenten vier Besucher (ChatGPT drei, Perplexity einer), organische Suche vier (Ecosia zwei, Bing einer, Yandex einer), Direct einer. Kein Google-Eintrag. Aggregierte Quellen- und Seitentabellen erlauben keine Aussage, welcher KI-Dienst auf welche Seite oder zu welchem Klick gefuehrt hat. Die rohe Referrer-Tabelle nennt fuenf Direct/None; diese ist nicht mit der klassifizierten Quellen-Tabelle gleichzusetzen.

Geraete: sechs Mobile, zwei Desktop, ein Tablet. Mobile bleibt wichtig, die Menge ist fuer dauerhafte Anteilsschaetzungen zu klein.

## Auswahl und Conversion

Keine Affiliate-, allgemeinen Outbound- oder Newsletter-Ereignisse in conversions.csv ausgewiesen. Enthalten sind ausschliesslich Seitenbesuchsziele. custom_props.csv ist nicht vorhanden; deshalb keine Awin-clickref-Zuordnung moeglich. Fehlende Ereignisse sind kein Beleg fuer null Bestellungen oder fuer einen technischen Trackingfehler.

Der bestehende Haendler-Event-Test wurde gegen Produktion erneut ausgefuehrt. Er kontrolliert die lokale Ausloesung der Ereignisse bei Klicks, nicht die endgueltige Verarbeitung im Plausible-Backend oder eine Bestellung bei Amazon/Awin.

| Seite | Beobachtung | Einordnung |
| --- | --- | --- |
| DUPLO | Zwei Einstiege, zwei Aufrufe, zwei Ausstiege; gemessene Seitenzeit 3 Sekunden, Scrolltiefe 6 Prozent | Hinweis auf fruehen Ausstieg in diesen beiden Faellen. Kein Nachweis eines allgemeinen Problems und keine Zuordnung zu KI-Besuchern moeglich. |
| Geschenke 3 Jahre | Zwei Einstiege, zwei Aufrufe, zwei Ausstiege; Seitenzeit 69 Sekunden, Scrolltiefe 96 Prozent | Lesen scheint in diesen Faellen stattgefunden zu haben, ohne ausgewiesenen weiteren Schritt. Gezielt Auswahl/CTA pruefen; nicht automatisch mehr Text ergaenzen. |
| Geschenke zur Geburt | Zwei Besucher, drei Aufrufe; Seitenzeit 115 Sekunden, Scrolltiefe 94 Prozent | Vorsichtig positives Lesesignal. Keine Einstiege auf dieser Seite ausgewiesen, genaue Herkunft innerhalb der Website unbekannt. |
| Weihnachtsgeschenke | Ein Einstieg, zwei Aufrufe; Scrolltiefe 73 Prozent | Erster kleiner Kontakt, noch keine Nachfrageprognose. |
| Budget und Geschenke 2 Jahre | Keine Zeilen im Seitenexport | Keine Grundlage, diese ueberarbeiteten Seiten anhand dieser Woche zu bewerten. |

Die Durchschnittszeit der Einstiegssitzung und die Seitenzeit sind verschiedene Exportmetriken. Eine 100-Prozent-Absprungrate bei Geschenke 3 Jahre bedeutet hier nicht automatisch, dass niemand gelesen hat. Zwei Beobachtungen erlauben keine belastbare Conversion-Rate-Prognose.

## Zusammen mit GSC

Der [GSC-Status](gsc-status-2026-09-14.md) betrachtet 05.-11.09., dieser Export 07.-13.09. Die Wochenzahlen werden deshalb nicht als deckungsgleiche Messung verglichen. Beide zeigen sehr geringe Suchzugriffe; Plausible ergaenzt Kontakte von Bing/Ecosia/Yandex und KI-Assistenten, die die Google-Search-Console nicht abbildet.

Der Push war am 11.09. In diesem Export liegen nur zwei vollstaendige Folgetage, mit zusammen drei Besuchen. Das reicht nicht, um die veroeffentlichten Aenderungen zu bewerten. Auch die hohe Lesetiefe der Geburt-Seite darf nicht kausal der neuen Gestaltung zugeschrieben werden.

## Konkrete Prioritaeten

1. Gestaltung vorerst stabil halten. Naechsten Wochenexport wieder mit sieben Tagen vergleichen, nicht mit dem gesamten alten 28-Tage-Fenster.
2. Geschenke 3 Jahre gezielt auf sichtbare Empfehlung, Produktpassung, Haendlerziel und klaren naechsten Schritt pruefen. DUPLO auf Uebereinstimmung zwischen Einstiegsversprechen und schneller Antwort pruefen. Zunaechst Diagnose, kein pauschaler Umbau auf Basis von zwei Besuchen.
3. Indexierung der acht offenen Seiten weiter beobachten; keine taeglichen Wiederholungsanfragen. Echte Produkterfahrungen als inhaltliche Ergaenzung vorbereiten, statt mehr austauschbare Artikel zu produzieren.
4. Bei weiterhin fehlenden Affiliate-Ereignissen kontrollierten Test mit Plausible-Empfang durchfuehren und mit Awin/Amazon-Klickberichten abgleichen. Browser-Ausloesung und Backend-Empfang sind getrennte Pruefungen.
5. KI-Assistenten als interessanten Zubringer beobachten, nicht als schon bewiesenen Verkaufskanal darstellen. Bestaetigte Provisionen und monatliche Kosten bleiben fuer die Wirtschaftlichkeit erforderlich.
