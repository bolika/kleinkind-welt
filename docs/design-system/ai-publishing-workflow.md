# AI-Publishing-Workflow

Ziel: KI darf Recherche strukturieren, Entwürfe erzeugen, interne Links vorschlagen und Datenassets bauen. Die publizierte Wahrheit kommt aus überprüfbaren Quellen und einem dokumentierten Freigabeschritt.

## Verbindlicher Ablauf

1. Für jeden neuen oder substanziell überarbeiteten Artikel ein JSON-Brief in `content-briefs/` anlegen.
2. Suchintention, Zielgruppe und den einzigartigen Nutzwert festhalten, bevor Text generiert wird.
3. Jede konkrete Sicherheits-, Entwicklungs- oder Produktaussage als Claim mit Quellen-IDs erfassen.
4. Sicherheits- und Entwicklungsclaims brauchen mindestens eine Primärquelle, offizielle Quelle oder belastbare Studie. Händlertexte und Rezensionen reichen dafür nicht.
5. Wenn ein Produkt nicht selbst genutzt wurde, ausschließlich von „Empfehlung nach Recherche“ oder „Auswahl“ sprechen. Nie „Test“, „getestet“, „Testsieger“ oder eigene Nutzung behaupten.
6. KI-Entwurf gegen Brief, Quellen, Affiliate-Transparenz, interne Links und sichtbare Aussagegrenzen prüfen.
7. Ein Mensch bestätigt jeden Claim, trägt Name und Datum ein und setzt erst danach `publishReady: true` beziehungsweise Status `approved`.
8. Vor Veröffentlichung alle lokalen Gates ausführen. Nach Veröffentlichung Sitemap/GSC prüfen und nach 14/28 Tagen messen.

## Automatische Gates

```bash
node tools/content-brief-gate.mjs
node tools/generate-seal-assets.mjs --check
node tools/seo-smoke-test.mjs --local
```

Das Content-Gate blockiert unter anderem:

- fehlende oder unbekannte Quellen,
- Safety-/Development-Claims ohne hochwertige Quelle,
- Publish-ready-Inhalte ohne benannte menschliche Freigabe,
- nicht einzeln freigegebene Claims,
- abgelaufene Review-Termine.

## Source of Truth und Aktualisierung

Der Siegelvergleich ist das erste vollständig datengetriebene Asset: `data/spielzeug-siegel.json` ist die Quelle; `tools/generate-seal-assets.mjs` erzeugt daraus CSV und die sichtbare HTML-Tabelle. Manuelle Änderungen an den generierten Bereichen werden im CI erkannt.

Quellen werden mit `checkedAt` und Artikel mit `reviewDueAt` versehen. Review-Termine sollen je nach Risiko gesetzt werden:

- Sicherheit, Recht, Normen: spätestens 90 Tage
- Preise und Verfügbarkeit: vor jeder Publikation und mindestens monatlich
- Entwicklungswissen: spätestens 180 Tage
- zeitstabile Grundlagen: spätestens 365 Tage

## Menschliche Freigabe bleibt Pflicht

Für Kleinkind-Inhalte ist die Endfreigabe kein optionales Stil-Lektorat. Sie prüft insbesondere Warnhinweise, Altersangaben, Verschluckrisiken, irreführende Testsprache, erfundene Erfahrung und die Übereinstimmung von sichtbarem Text und strukturierten Daten.
