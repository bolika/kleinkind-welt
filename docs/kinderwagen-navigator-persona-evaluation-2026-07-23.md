# Kinderwagen-Navigator: Abdeckung der Hypothesen-Archetypen in Flow 0.2

Stand: 23. Juli 2026  
Katalog: 15 quellengeprüfte Pilotmodelle  
Bewertung: deterministische Match-Engine, kein eigener Produkttest

## Evidenzgrenze

Die sieben Profile sind noch keine validierten Personas. Sie beschreiben testbare Entscheidungskontexte und sichern die technische Match-Abdeckung. Demografien, Zitate oder vermeintliche Motive werden nicht erfunden. Für eine Validierung fehlen moderierte Sessions mit echten Eltern und eine zweite Datenquelle wie aggregierte Nutzungsdaten.

Die drei Querschnittslinsen „Erstkauf ohne Vorwissen“, „erfahrener Schnellpfad“ und „visuelle Shortlist“ verändern den funktionalen Score nicht. Sie prüfen Verständlichkeit, Effizienz sowie den Bedarf an freigegebenen Produktbildern und Farbrichtungen.

## Verbindliche Interpretation des Match-Scores

| Score | Bedeutung |
|---|---|
| 90–100 % | Sehr hohe Übereinstimmung: Anforderungen und Prioritäten werden nahezu vollständig erfüllt. |
| 85–89 % | Gute Übereinstimmung: klar passend, einzelne überprüfbare Kompromisse bleiben. |
| 75–84 % | Solide Übereinstimmung: empfehlbar, der wichtigste Abstrich muss sichtbar sein. |
| 65–74 % | Eingeschränkte Passung: nur Alternative nach einem bewusst gewählten Abstrich. |
| 0–64 % | Kein ausreichender Match; nicht als Empfehlung veröffentlichen. |

Ein Prozentwert erscheint nur bei mindestens 85 Prozent relevanter Datenabdeckung und mindestens vier bekannten anwendbaren Kriterien. Ein unbekannter zentraler Nutzungskontext blockiert den Prozentwert; eine nur teilweise belegte Kernpassung begrenzt ihn auf höchstens 84 beziehungsweise 89 Prozent. Er ist keine Sicherheits-, Qualitäts- oder Testnote.

## Ergebnis je Kernsegment

| Hypothesen-Archetyp | Bestes Ergebnis | Veröffentlichte Treffer | Urteil |
|---|---:|---:|---|
| Preisbewusste Stadtfamilie ohne Aufzug | my junior LIYO 88 % | 1 | Guter Match; günstige Alternativen fehlen noch. |
| Mobile Familie mit hohem Orientierungsbudget | Bugaboo Dragonfly Plus 87 % | 3 | Guter Match; einteilige Faltung, Breite und Transportdaten tragen das Ergebnis. |
| Funktionalitätsorientierte Familie mit mittlerem Budget | my junior MAVI 89 % | 3 | Guter Match; Faltung, Stauraum und Langzeitflexibilität werden korrekt priorisiert. |
| Familie mit Wald-, Feld- und Schotterwegen | Bugaboo Dragonfly Plus 84 % | 3 | Solider Match; die nur teilweise belegte Geländepassung verhindert bewusst eine höhere Stufe. |
| Stadtfamilie mit engem Zugang und ÖPNV | Bugaboo Dragonfly Plus 89 % | 3 | Guter Match; kein physischer Tür- oder ÖPNV-Fit wird versprochen. |
| Familie mit Service-, Wetter- und Langzeitfokus | Bugaboo Dragonfly Plus 88 % | 3 | Guter Match; Fox 5 Renew und MAVI sind gleich starke Alternativen. |
| Familie mit kleinem Auto und fester Budgetgrenze | my junior LIYO 86 % | 1 | Guter Match; Faltvolumen wird genutzt, der konkrete Fahrzeug-Fit bleibt offen. |

Ein zusätzlicher Querschnittstest „Erstkauf ohne besonderen Logistik-Sonderfall“ erreicht drei Matches mit jeweils 92 %. Dieser Pfad hatte vor dem Audit wegen nur drei anwendbaren Kriterien keinen Prozentwert. Faltung, Stauraum und Langzeitflexibilität bilden nun eine produktartgerechte Baseline, ohne eine weitere Nutzerfrage einzuführen.

## Automatisches Beta-Gate

- 100 % der sieben Hypothesen-Archetypen erhalten mindestens einen veröffentlichten Match ab 75 %.
- 86 % erhalten einen guten Match ab 85 %; Zielwert mindestens 50 % ist erreicht.
- 71 % erhalten mindestens zwei veröffentlichte Treffer; Zielwert 70 % ist erreicht.
- Ein striktes Niedrigbudget-Profil erhält bewusst keinen künstlichen Treffer.
- Reisebuggy und Geschwisterwagen werden in getrennte Routen geleitet.

## Schlussfolgerung

Der Fragenumfang ist nicht der aktuelle Engpass. Die Logik liefert unterschiedliche, erklärbare Rangfolgen und unterdrückt zu dünn belegte oder schwache Treffer. Mit 15 Modellen ist das definierte Katalogziel für eine geschlossene Beta erreicht. Zwei Modelle sind beim Hersteller aktuell nicht verfügbar; sie erhalten im Ergebnis deshalb einen sichtbaren Verfügbarkeitshinweis und keinen Händler-CTA ohne frisches Angebot. Für eine öffentliche Vollständigkeitsbehauptung ist der Katalog weiterhin zu klein.

Die Ausbaupriorität folgt deshalb den Abdeckungslücken der Hypothesen-Archetypen:

1. weitere aktuell verfügbare günstige, kompakte 2-in-1-Modelle für Stadt, Treppen und kleine Autos,
2. weitere belastbare Alternativen für kleine Autos,
3. zusätzliche City-/ÖPNV- und Geländeoptionen bis mindestens 20 Modelle,
4. erst danach zusätzliche Premium-Dopplungen.

Die maschinenlesbare Archetypen-Definition liegt aus Kompatibilitätsgründen weiterhin in `data/kinderwagen-navigator/persona-segments.v0.2.json`; `tools/kinderwagen-persona-coverage.mjs` reproduziert diese Auswertung.

## Datenpipeline

1. Awin-Feeds und Hersteller-Sitemaps liefern nur Kandidaten, Preis-/Bestandsdaten und bei klarer Freigabe Bilder.
2. Marke, Modellgeneration und möglichst GTIN/MPN werden dedupliziert; Farbvarianten sind keine eigenen Modelle.
3. Harte Match-Fakten werden gegen Herstellerseite oder Anleitung geprüft.
4. Konflikte und fehlende Werte blockieren die automatische Veröffentlichung.
5. Erst nach Review und Quality-Gate gelangt ein Modell in den Katalog.
6. Preis und Bestand werden häufiger aktualisiert als technische Produktdaten; offizielle Warnungen werden separat überwacht.
