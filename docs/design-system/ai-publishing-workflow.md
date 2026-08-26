# AI-Publishing-Workflow

Ziel: KI darf Recherche strukturieren, Entwürfe erzeugen, interne Links vorschlagen und Datenassets bauen. Die publizierte Wahrheit kommt aus überprüfbaren Quellen und einem dokumentierten Freigabeschritt.

> Arbeitsbewertung, keine Rechtsberatung: Die folgenden Regeln setzen die im Businessplan vom 26.08.2026 dokumentierte Risikologik operativ um. Sie ersetzen keine medienrechtliche Einzelfallpruefung.

## Verbindlicher Ablauf

1. Für jeden neuen oder substanziell überarbeiteten Artikel ein JSON-Brief in `content-briefs/` anlegen.
2. Suchintention, Zielgruppe und den einzigartigen Nutzwert festhalten, bevor Text generiert wird.
3. Jede konkrete Sicherheits-, Entwicklungs- oder Produktaussage als Claim mit Quellen-IDs erfassen.
4. Sicherheits- und Entwicklungsclaims brauchen mindestens eine Primärquelle, offizielle Quelle oder belastbare Studie. Händlertexte und Rezensionen reichen dafür nicht.
5. Wenn ein Produkt nicht selbst genutzt wurde, ausschließlich von „Empfehlung nach Recherche“ oder „Auswahl“ sprechen. Nie „Test“, „getestet“, „Testsieger“ oder eigene Nutzung behaupten.
6. KI-Entwurf gegen Brief, Quellen, Affiliate-Transparenz, interne Links und sichtbare Aussagegrenzen prüfen.
7. Neue oder geänderte Bilder vor dem Einbau in `data/bildherkunft.json` einordnen. Bei KI-Motiven sind Entstehungszeit-Evidenz, Risikoklasse, Risikofaktoren, Arbeitsvorschlag und menschliche Freigabe Pflicht.
8. Ein Mensch bestätigt jeden Claim und jede beabsichtigte Reduktion eines KI-Hinweises, trägt Name und Datum ein und setzt erst danach `publishReady: true`, Status `approved` beziehungsweise `menschlicheFreigabe.status: freigegeben`.
9. Vor Veröffentlichung alle lokalen Gates ausführen. Nach Veröffentlichung Sitemap/GSC prüfen und nach 14/28 Tagen messen.

## Risikobasierte KI-Bildrichtlinie

Die KI-Herkunft allein führt nicht automatisch zu derselben sichtbaren Kennzeichnung. Entscheidend sind Motiv und Nutzungskontext:

| Risikoklasse | Typische Merkmale | Voreinstellung |
|---|---|---|
| `hoch` | realistisch erzeugte Personen, möglicher dokumentarischer Eindruck, synthetische Siegel oder besonders vertrauensrelevanter Kontext | Bei neuen Motiven direkter Hinweis; bestehende Hinweise beibehalten und Einzelfall prüfen |
| `mittel` | fotorealistische, generische Objekt- oder Raumszene ohne Person; Produkt- und Markennähe gesondert prüfen | Kennzeichnungsform im Einzelfall festlegen; vorhandene Badges bleiben bis zur Freigabe geschützt |
| `niedrig` | klar erkennbare Illustration oder offensichtlich gestaltete Grafik ohne fotografischen Authentizitätseindruck | zentrale Offenlegung kann nach menschlicher Freigabe genügen |

Unabhängig von der Risikoklasse gilt:

- KI-Bilder dürfen nicht als Foto eines konkret verlinkten oder getesteten Produkts erscheinen.
- Erfundene Logos, Siegel, Produkttexte oder markenähnliche Gestaltung führen zu `manuell-pruefen`.
- `repositoryFirstSeenAt` ist nur der früheste durch Git belegbare Repository-Zeitpunkt. Er darf nicht als tatsächliches Erstellungsdatum ausgegeben werden, wenn `actualCreatedAt` unbekannt ist.
- Ein Commit durch einen Menschen belegt Veröffentlichung oder Klassifizierung, aber nicht automatisch eine juristische oder inhaltliche Einzelfallfreigabe.
- Bestehende Badges werden erst reduziert, wenn `menschlicheFreigabe.status` auf `freigegeben` steht und `reviewedBy` sowie `reviewedAt` dokumentiert sind.
- Die `sichtbareBadgeBaseline` vom 26.08.2026 schützt den tatsächlichen Bestand. Sie erzwingt bei vor dem Stichtag belegten Motiven nicht rückwirkend neue Badges, die an diesem Datum nicht vorhanden waren.
- Eine freigegebene zentrale Offenlegung braucht auf jeder betroffenen Seite einen sichtbaren Text mit der Klasse `.ki-herkunft-hinweis`.

Die zulässigen Arbeitsvorschläge im Register sind:

- `badge-beibehalten`: direkter Hinweis bleibt erforderlich.
- `zentral-offenlegen`: Reduktionskandidat; vorhandene Badges bleiben bis zur menschlichen Freigabe bestehen.
- `manuell-pruefen`: keine Reduktion, bis Motiv, Produktnähe und Nutzungskontext geprüft wurden.

## Automatische Gates

```bash
node tools/content-brief-gate.mjs
node tools/generate-seal-assets.mjs --check
node tools/ki-bildkennzeichnung-gate.mjs
node tools/seo-smoke-test.mjs --local
```

Das Content-Gate blockiert unter anderem:

- fehlende oder unbekannte Quellen,
- Safety-/Development-Claims ohne hochwertige Quelle,
- Publish-ready-Inhalte ohne benannte menschliche Freigabe,
- nicht einzeln freigegebene Claims,
- abgelaufene Review-Termine.

Das KI-Herkunftsgate blockiert unter anderem:

- verwendete lokale Rasterbilder ohne Registereintrag,
- KI-Motive ohne prüfbare Git-Evidenz oder Risikoklasse,
- widersprüchliche Stichtagsangaben,
- eine behauptete menschliche Freigabe ohne Name und Zeitpunkt,
- eine Unterschreitung der dokumentierten Badge-Bestandsbaseline,
- fehlende direkte Hinweise bei nach dem Stichtag hinzugefügten hohen Risiken oder offenen Prüfungen,
- eine freigegebene zentrale Offenlegung ohne sichtbaren zentralen Herkunftshinweis.

## Source of Truth und Aktualisierung

Der Siegelvergleich ist das erste vollständig datengetriebene Asset: `data/spielzeug-siegel.json` ist die Quelle; `tools/generate-seal-assets.mjs` erzeugt daraus CSV und die sichtbare HTML-Tabelle. Manuelle Änderungen an den generierten Bereichen werden im CI erkannt.

Quellen werden mit `checkedAt` und Artikel mit `reviewDueAt` versehen. Review-Termine sollen je nach Risiko gesetzt werden:

- Sicherheit, Recht, Normen: spätestens 90 Tage
- Preise und Verfügbarkeit: vor jeder Publikation und mindestens monatlich
- Entwicklungswissen: spätestens 180 Tage
- zeitstabile Grundlagen: spätestens 365 Tage

## Menschliche Freigabe bleibt Pflicht

Für Kleinkind-Inhalte ist die Endfreigabe kein optionales Stil-Lektorat. Sie prüft insbesondere Warnhinweise, Altersangaben, Verschluckrisiken, irreführende Testsprache, erfundene Erfahrung und die Übereinstimmung von sichtbarem Text und strukturierten Daten. Bei Bildern prüft sie zusätzlich Personenbezug, Authentizitätseindruck, Marken- und Produktnähe, synthetische Texte oder Siegel sowie die vorgesehene Kennzeichnungsform.
