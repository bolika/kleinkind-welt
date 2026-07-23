# Kinderwagen-Navigator: Persona-Abdeckung Flow 0.2

Stand: 23. Juli 2026  
Katalog: 15 quellengeprüfte Pilotmodelle  
Bewertung: deterministische Match-Engine, kein eigener Produkttest

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

| Persona | Bestes Ergebnis | Veröffentlichte Treffer | Urteil |
|---|---:|---:|---|
| Preisbewusste Stadtfamilie ohne Aufzug | my junior LIYO 87 % | 1 | Guter Match; günstige Alternativen fehlen noch. |
| Mobile Familie mit hohem Orientierungsbudget | Bugaboo Dragonfly Plus 85 % | 3 | Guter Match; einteilige Faltung, Breite und Transportdaten tragen das Ergebnis. |
| Funktionalitätsorientierte Familie mit mittlerem Budget | my junior MAVI 89 % | 3 | Guter Match; Faltung, Stauraum und Langzeitflexibilität werden korrekt priorisiert. |
| Familie mit Wald-, Feld- und Schotterwegen | Bugaboo Dragonfly Plus 84 % | 3 | Solider Match; die nur teilweise belegte Geländepassung verhindert bewusst eine höhere Stufe. |
| Stadtfamilie mit engem Zugang und ÖPNV | Bugaboo Dragonfly Plus 89 % | 3 | Guter Match; kein physischer Tür- oder ÖPNV-Fit wird versprochen. |
| Familie mit Service-, Wetter- und Langzeitfokus | Bugaboo Dragonfly Plus 85 % | 3 | Guter Match; Fox 5 Renew und MIYO 2 sind gleich starke Alternativen. |
| Familie mit kleinem Auto und fester Budgetgrenze | my junior LIYO 84 % | 1 | Solider Match; Faltvolumen wird genutzt, der konkrete Fahrzeug-Fit bleibt offen. |

## Automatisches Beta-Gate

- 100 % der sieben Kernpersonas erhalten mindestens einen veröffentlichten Match ab 75 %.
- 71 % erhalten einen guten Match ab 85 %; Zielwert mindestens 50 % ist erreicht.
- 71 % erhalten mindestens zwei veröffentlichte Treffer; Zielwert 70 % ist erreicht.
- Ein striktes Niedrigbudget-Profil erhält bewusst keinen künstlichen Treffer.
- Reisebuggy und Geschwisterwagen werden in getrennte Routen geleitet.

## Schlussfolgerung

Der Fragenumfang ist nicht der aktuelle Engpass. Die Logik liefert unterschiedliche, erklärbare Rangfolgen und unterdrückt zu dünn belegte oder schwache Treffer. Mit 15 Modellen ist das definierte Katalogziel für eine geschlossene Beta erreicht. Zwei Modelle sind beim Hersteller aktuell nicht verfügbar; sie erhalten im Ergebnis deshalb einen sichtbaren Verfügbarkeitshinweis und keinen Händler-CTA ohne frisches Angebot. Für eine öffentliche Vollständigkeitsbehauptung ist der Katalog weiterhin zu klein.

Die Ausbaupriorität folgt deshalb den Persona-Lücken:

1. weitere aktuell verfügbare günstige, kompakte 2-in-1-Modelle für Stadt, Treppen und kleine Autos,
2. weitere belastbare Alternativen für kleine Autos,
3. zusätzliche City-/ÖPNV- und Geländeoptionen bis mindestens 20 Modelle,
4. erst danach zusätzliche Premium-Dopplungen.

Die maschinenlesbare Persona-Definition liegt in `data/kinderwagen-navigator/persona-segments.v0.2.json`; `tools/kinderwagen-persona-coverage.mjs` reproduziert diese Auswertung.

## Datenpipeline

1. Awin-Feeds und Hersteller-Sitemaps liefern nur Kandidaten, Preis-/Bestandsdaten und bei klarer Freigabe Bilder.
2. Marke, Modellgeneration und möglichst GTIN/MPN werden dedupliziert; Farbvarianten sind keine eigenen Modelle.
3. Harte Match-Fakten werden gegen Herstellerseite oder Anleitung geprüft.
4. Konflikte und fehlende Werte blockieren die automatische Veröffentlichung.
5. Erst nach Review und Quality-Gate gelangt ein Modell in den Katalog.
6. Preis und Bestand werden häufiger aktualisiert als technische Produktdaten; offizielle Warnungen werden separat überwacht.
