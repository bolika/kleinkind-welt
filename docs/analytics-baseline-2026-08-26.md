# Analytics-Baseline

Stand: 26.08.2026  
Plausible-Zeitraum: 12.06.2026 bis 26.08.2026  
Status: beobachtete Exportdaten; keine Aussage zur Kausalität

## Datenbasis

- Ungefilterter Plausible-Export mit Wochenverlauf, Seiten, Einstiegsseiten und Quellen.
- Separater Export mit dem Goal `Affiliate-Klick`.
- Custom Properties sind im aktuellen Plausible-Plan nicht verfügbar.
- Der Betreiber hat bestätigt, dass eine manuelle IP-Sperre in Plausible bereits eingerichtet ist. Zeitpunkt sowie Abdeckung von IPv4, IPv6, Mobilfunk und VPN sind aus dem Export nicht erkennbar.
- Die Rohdaten liegen nur lokal unter `imports/analytics/` und werden durch `.gitignore` von Git ausgeschlossen.
- Der Export umfasst rund 76 statt 90 Tage. Vor dem 12.06.2026 liegen in diesen Dateien keine Werte vor.

## Kernwerte

| Kennzahl | Beobachtet | Einordnung |
|---|---:|---|
| Besucher im Wochenexport | 174 | Wiederkehrende Personen können über Wochen mehrfach vorkommen. |
| Sitzungen | 217 | Additive Gesamtzahl im Exportzeitraum. |
| Seitenaufrufe | 776 | Stark von einzelnen intensiven Sitzungen beeinflusst. |
| Affiliate-Klicker | 25 | Periodenwert aus dem gefilterten Goal-Export. |
| Affiliate-Klickereignisse | 61 | Mehrere Klicks derselben Person sind möglich. |
| Klicker je Sitzung | 11,5 % | 25 eindeutige Goal-Nutzer geteilt durch 217 Sitzungen; nur Orientierung, keine klassische Session-Conversion. |
| Klickereignisse je Sitzung | 28,1 % | 61 Ereignisse geteilt durch 217 Sitzungen. |

## Traffic-Rückgang

Vier frühe vollständige Exportwochen vom 15.06. bis 12.07.:

- 82 Besucher
- 109 Sitzungen

Vier spätere vollständige Exportwochen vom 27.07. bis 23.08.:

- 22 Besucher
- 23 Sitzungen

Damit gingen die ausgewiesenen Besucher um 73,2 Prozent und die Sitzungen um 78,9 Prozent zurück. Das ist ein klares Beobachtungssignal, aber noch kein belastbarer SEO-Effekt:

- Die Woche ab 06.07. enthält nur 6 Sitzungen, aber 147 Seitenaufrufe beziehungsweise 24,5 Aufrufe je Sitzung. Das ist ein deutlicher Prüf- oder Intensivnutzungs-Ausreißer.
- Die Woche ab 20.07. hat mit 55 Sitzungen einen zweiten Einzelspike.
- Die Woche ab 24.08. ist unvollständig.
- Der Export erlaubt keine rückwirkende Prüfung, welche eigenen Browser, IPv4-/IPv6-Adressen, Mobilfunknetze oder VPN-Verbindungen von der bestehenden Sperre erfasst waren.

## Herkunft

| Kanal | Besucher | Anteil an 174 als Orientierung |
|---|---:|---:|
| Direct | 130 | 74,7 % |
| Organic Social | 31 | 17,8 % |
| Organic Search | 13 | 7,5 % |
| Organic Shopping | 1 | 0,6 % |
| Referral | 1 | 0,6 % |

Die Kanalsummen können dieselbe Person in mehr als einem Segment enthalten. Dennoch ist die Richtung eindeutig: Die Baseline wird von `Direct` dominiert. `Direct` ist nicht mit internem Traffic gleichzusetzen; dazu gehören auch eingegebene URLs, Bookmarks, E-Mail-Links, Messenger und andere Aufrufe ohne Referrer. Pinterest stellt 30 Besucher, Google 7, DuckDuckGo 3, Ecosia 2 und Bing 1. Deshalb darf der Rückgang des Gesamttraffics weder automatisch als Google-Verlust noch als Betreibertraffic interpretiert werden.

## Seiten und Affiliate-Signal

| Seite | Besucher | Affiliate-Konversionen | Plausible-Rate |
|---|---:|---:|---:|
| `/artikel/geschenke-1-jahr` | 39 | 11 | 28,21 % |
| `/artikel/spielzeug-18-24-monate` | 15 | 5 | 33,33 % |
| `/artikel/spielzeug-unter-20-euro` | 14 | 4 | 28,57 % |
| `/artikel/spielzeug-12-18-monate` | 41 | 3 | 7,50 % |
| `/artikel/badespielzeug-kleinkind` | 6 | 2 | 33,33 % |
| `/artikel/motorikspielzeug-test` | 10 | 2 | 20,00 % |

Die Stichproben sind klein. Sie reichen nicht für Gewinnerbehauptungen, zeigen aber, dass die Budgetseite und `geschenke-1-jahr` weiterhin kommerzielles Interesse erzeugen. `spielzeug-12-18-monate` hat mehr Reichweite, aber ein schwächeres Klicksignal und verdient später eine gezielte Kaufboxprüfung.

Der Outbound-Link-Export enthält auch historische Links, die inzwischen ersetzt oder gesperrt wurden. Linkwerte über den gesamten Zeitraum beschreiben daher nicht ausschließlich den aktuellen Seitenstand.

## Geräte

- Mobile: 111 Besucher beziehungsweise 63,8 Prozent
- Desktop: 60 Besucher beziehungsweise 34,5 Prozent
- Tablet: 3 Besucher beziehungsweise 1,7 Prozent

Mobile bleibt der primäre Prüf- und Optimierungskontext.

## Konsequenzen

1. Bestehende IP-Sperre beibehalten und nur prüfen, ob auch IPv6, Mobilfunk, VPN sowie weitere eigene Browser erfasst sind; eine rückwirkende Bereinigung wird nicht behauptet.
2. GSC und Plausible getrennt interpretieren: GSC für Suchsichtbarkeit, Plausible für reale Seitennutzung.
3. Keine neue Contentmasse aus dieser Stichprobe ableiten.
4. `spielzeug-unter-20-euro` nach dem aktuellen Deploy und Recrawl für 14 und 28 Tage stabil messen.
5. `geschenke-1-jahr` als zweite kommerzielle Beobachtungsseite führen.
6. Partnererfolg erst nach Import von Amazon- und Awin-Berichten bewerten.

## Messung ohne Custom Properties

Die Baseline bleibt verwendbar:

- der gefilterte Goal-Export liefert Affiliate-Klicks und Seitenkonversionen;
- Plausibles eingebautes `Outbound Link: Click` liefert Ziel-URLs und Partnerdomains;
- Awin-Links enthalten `clickref` direkt in der Ziel-URL;
- Amazon-Shortlinks lassen sich über `data/affiliate-product-ledger.json` einem Produkt zuordnen;
- neue Placement-Details werden intern weiterhin gesendet, aber nicht als verfügbar vorausgesetzt.

Eine kostenpflichtige Planerweiterung ist für die jetzige Trafficgröße nicht nötig. Zuerst werden interne Besuche bereinigt und Amazon-/Awin-Verkäufe mit den vorhandenen Klicksignalen verbunden.
