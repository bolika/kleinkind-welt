# Prioritäten-Roadmap für Kleinkind-Welt

Stand: 13.07.2026  
Basis: lokaler Repository-Stand, Full Audit vom 12.07.2026, GSC-Daten 14.06.–09.07.2026

## Entscheidung in einem Satz

Die technische SEO-Basis ist stark. Vor weiterem AI-Content-Wachstum muss Kleinkind-Welt seine Produktempfehlungen jedoch belegbar machen: zuerst den vorbereiteten Claim-Release veröffentlichen, dann Evidenz-, Quellen- und Publish-Gates einführen, anschließend nur die bereits sichtbaren GSC-Seiten ausbauen.

## Lokal bestätigter Ausgangspunkt

- Der lokale SEO-Smoke-Test besteht für 30/30 Sitemap-Seiten.
- 18 bestehende Dateien sind lokal geändert; darunter 14 Artikel mit inhaltlichen Korrekturen sowie Sitemap und `llms.txt`.
- Die Änderungen reduzieren bereits mehrere absolute oder sachlich falsche Safety-/Entwicklungsclaims und gleichen sichtbare Änderungsdaten an.
- 30/30 Sitemap-URLs waren im Audit erreichbar, indexierbar und mit passendem Canonical versehen.
- Lighthouse lag über alle Seiten bei mobil durchschnittlich 99,5 und Desktop 100. Performance ist daher kein aktueller Wachstumsblocker.
- GSC: 298 Impressionen, 6 Klicks, CTR 2,01 %, durchschnittliche Position 45,6. Die Datenmenge ist noch klein; Optimierung sollte auf vorhandene Signale statt auf neue URL-Masse reagieren.
- 20 von 23 Artikeln enthalten visuelle Sterne; im lokalen Bestand wurden 706 Sternzeichen und auf drei Seiten explizite `4/5`- oder `5/5`-Bewertungen gefunden.
- Es existiert noch kein strukturierter Produkt-, Claim- oder Evidenz-Datensatz.
- 20 Artikel steuern FAQ-Akkordeons über klickbare `h3`-Elemente; native `details/summary`-Elemente werden nicht verwendet.
- Das interne Brevo-Template besitzt lokal kein `noindex` und wird auch in `_headers` nicht separat ausgeschlossen.
- 145 von 181 Bild-Tags der Sitemap-Seiten besitzen kein `srcset`; wegen der bereits sehr guten Performance ist das nachrangig.

## Bereits erledigt oder nicht erneut priorisieren

- Clean-URL-Redirects, Canonicals, Sitemap, Alt-Texte, feste Bilddimensionen und Affiliate-`rel`-Attribute sind bereits sauber.
- Die vorhandenen lokalen Claim-Korrekturen nicht neu schreiben, sondern prüfen und als zusammenhängenden Release deployen.
- Keine Massenproduktion auf 50 oder 80 Artikel starten, solange die redaktionellen Gates fehlen.
- Kein `Product`, `Review` oder `AggregateRating` für redaktionelle Listen ergänzen, solange keine belastbare Einzelprodukt-Evidenz vorliegt.
- Den indexierten Pfad `/artikel/motorikspielzeug-test` nicht vorschnell ändern. Die sichtbare Seite kann als redaktioneller Vergleich bezeichnet werden; die URL bleibt vorerst stabil.

## P0 – vor jedem weiteren AI-Artikel

### 1. Vorbereiteten lokalen Claim-Release prüfen und deployen

**Warum jetzt:** Die 14 korrigierten Artikel reduzieren bereits konkrete Vertrauens- und Haftungsrisiken. Solange sie nur lokal liegen, profitiert die Live-Seite nicht davon.

**Aufgaben:**

1. Diff der 18 geänderten Dateien redaktionell gegenlesen.
2. Prüfen, dass jede Änderung von `dateModified` und Sitemap-`lastmod` eine substanzielle Änderung abbildet.
3. Deployen und danach den Live-Smoke-Test ausführen.
4. Die wichtigsten geänderten Seiten inklusive Mobilansicht stichprobenartig prüfen.

**Definition of Done:** Live-Smoke-Test 30/30 bestanden; keine ungewollten Layout- oder Schema-Regressionen; korrigierte Claims live.

**Aufwand:** 0,5–1 Tag.  
**Wirkung:** hoch.  
**Status:** lokal weitgehend vorbereitet.

### 2. Sterne und Bewertungslogik auf ein belegbares Modell umstellen

**Warum jetzt:** Sterne und `5/5` werden von Nutzern als Test-, Kunden- oder Messsignal verstanden. Eine allgemeine Methodik-Seite reicht nicht, wenn das konkrete Produkt nicht selbst genutzt wurde.

**Regel:** Empfehlungen ohne eigenen Besitz sind zulässig, wenn sie klar als redaktionell recherchiert gekennzeichnet werden. Nicht zulässig ist der Eindruck eines eigenen Produkttests.

**Pro Produktkarte sichtbar machen:**

- Evidenztyp: `selbst genutzt`, `Produktart aus Elternpraxis bekannt`, `redaktionell recherchiert` oder `noch nicht ausreichend belegt`.
- Geprüfte Quellen und Prüftag.
- Genaue Produktvariante beziehungsweise Modellnummer.
- Geeignet für / weniger geeignet für.
- Unsicherheit oder fehlende eigene Erfahrung.

**Sterne zunächst entfernen**, außer die Berechnung wird mit festen Kriterien, Gewichtung und Datengrundlage offengelegt. Besser sind vorerst textliche Urteile wie „passt gut für kleine Wohnungen“ oder „beste Budget-Option nach den veröffentlichten Kriterien“.

**Definition of Done:** 100 % der Affiliate-Produktkarten zeigen Evidenztyp und Prüftag; 0 unbelegte Sterne oder `x/5`-Signale.

**Aufwand:** 3–5 Tage.  
**Wirkung:** sehr hoch.

### 3. Produkt- und Claim-Ledger als zentrale Datenquelle anlegen

**Warum jetzt:** Aktuell liegen Aussagen, Daten und Bewertungen direkt in statischen HTML-Dateien. Dadurch kann AI dieselben Fehler über viele Seiten vervielfältigen.

**Minimales Datenmodell:**

```text
product_id
product_name
model_or_variant
evidence_type
own_use_scope
claim
claim_type
source_url
source_kind
source_date
checked_at
approved_for_publish
owner
```

Safety-, Alters- und Entwicklungsclaims benötigen eine Primärquelle direkt am Claim oder müssen als redaktionelle Einschätzung erkennbar abgeschwächt werden. Händlerrezensionen dürfen ergänzen, aber keine Sicherheits- oder Wirksamkeitsbehauptung tragen.

**Definition of Done:** Die vier priorisierten Seiten werden nur noch aus freigegebenen Claims bedient; zufällige 20-Claim-Stichprobe enthält höchstens 5 % unbelegte oder überzogene Aussagen.

**Aufwand:** 4–7 Tage für Modell, Erstbefüllung und Migration der wichtigsten Seiten.  
**Wirkung:** sehr hoch.

### 4. Den bestehenden Smoke-Test zu einem AI-Publish-Gate erweitern

**Bestehende Stärke:** Der lokale Test prüft bereits Sitemap, `llms.txt`, Title, Canonical, H1, Alt-Texte, Affiliate-Kennzeichnung und JSON-LD.

**Ergänzen:**

- blockierte Begriffe wie „Praxistest“, „Testsieger“, `5/5`, „sicherste“ ohne passende Evidenz;
- Evidenztyp und Prüftag für jede Produktkarte;
- Quellenpflicht für Safety-/Entwicklungsclaims;
- `dateModified`/Sitemap-`lastmod`-Konsistenz;
- Title-Längen als Warnung;
- keine klickbaren Nicht-Controls in FAQ-Akkordeons;
- kein öffentliches internes Dokument ohne `noindex`;
- keine Review-/Rating-Schemata ohne freigegebene Evidenz.

**Definition of Done:** Ein AI-generierter Artikel kann ohne bestandenes Gate nicht veröffentlicht werden.

**Aufwand:** 3–5 Tage.  
**Wirkung:** sehr hoch und dauerhaft.

## P1 – nach den Gates, innerhalb von 1–2 Wochen

### 5. Vier Seiten in klarer Reihenfolge bearbeiten

1. **`/artikel/spielzeug-unter-20-euro`** – 43 Impressionen, Position 15,9. Produktkarten zuerst ins Evidenzmodell migrieren; Preisversprechen mit Prüftag versehen; Hauptquery im Snippet klar bedienen.
2. **`/artikel/spielzeug-12-18-monate`** – 16 Impressionen, 2 Klicks, Position 15,4. Evidenz ausbauen und Abgrenzung zur Seite 18–24 Monate schärfen.
3. **`/artikel/nachhaltiges-spielzeug-siegel`** – 16 Impressionen, Position 20. Als nichtkommerzielles, zitierfähiges Safety-/Siegel-Asset ausbauen.
4. **`/artikel/motorikspielzeug-test`** – 41–46 Impressionen, Position ungefähr 43. Zuerst Vertrauensrisiko reduzieren: Sterne, Rankinglogik und eigene Beobachtung pro konkretem Produkt sauber trennen.

**Definition of Done:** Die ersten drei Seiten sind evidenzkonform; nach 6–8 Wochen Hauptquery der Budget-Seite Richtung Top 10 und CTR mindestens 4 %, sofern Nachfrage und Position vergleichbar bleiben.

### 6. FAQ-Akkordeons barrierefrei umbauen

20 Artikel hängen die Interaktion an `h3`-Klicks. Diese sind ohne Maus nicht zuverlässig bedienbar.

**Umsetzung:** native `<details><summary>` oder echte Buttons mit `aria-expanded`, `aria-controls`, Enter- und Space-Unterstützung. Danach Tastaturtest auf allen Artikeltemplates.

**Definition of Done:** 0 klickbare H3; jede FAQ vollständig per Tastatur bedienbar.

**Aufwand:** 1–2 Tage.  
**Wirkung:** mittel bis hoch für UX und Qualität.

### 7. Internes Brevo-Dokument aus dem Suchraum nehmen

`/docs/integrations/brevo-doi-template.html` entweder nicht deployen oder per `_headers` mit `X-Robots-Tag: noindex, nofollow` versehen.

**Definition of Done:** Live-Header bestätigt `noindex`; Dokument erscheint nicht in der Sitemap und später nicht im Index.

**Aufwand:** unter 1 Stunde.  
**Wirkung:** klein, aber sehr günstig.

### 8. Bestehende Hubs stärken, keine neuen Hubs eröffnen

Priorität haben `/spielzeug-nach-alter`, `/geschenke-kleinkind` und `/saisonale-empfehlungen/sommer-spielzeug`. Ergänzt werden sollen keine Fülltexte, sondern Auswahlregeln, klare Altersübergänge, Sonderfälle und eindeutige interne Zielseiten.

**Definition of Done:** Jeder Hub besitzt eigene Entscheidungslogik und klare Query-Ownership. Geschenk-Impressionen bündeln sich zunehmend auf dem Geschenk-Hub statt auf Homepage und Hub zugleich.

**Aufwand:** 3–5 Tage.  
**Wirkung:** mittel.

## P2 – 30 bis 90 Tage

### 9. Ein zitierfähiges First-Party-Asset aufbauen

Ausgangspunkt ist die Siegel-Seite. Geeignet ist ein versionierter Datensatz mit Bedeutung, Herausgeber, Prüfart, Grenzen, Primärquelle und Änderungsprotokoll für relevante Spielzeug-Siegel und Safety-Angaben.

Danach gezielt Fachblogs, Elternportale, Kitas, Verbraucher- und Nachhaltigkeitsseiten ansprechen. Erst ein nützliches Asset bauen, dann Links akquirieren.

**Ziel:** 3–5 relevante verweisende Domains in 90 Tagen und mindestens eine fachliche oder institutionelle Erwähnung.

### 10. Drei überlange Titles testen

- Outdoor: aktuell 77 Zeichen.
- Reisespielzeug: aktuell 66 Zeichen.
- Balkonspielzeug: aktuell 64 Zeichen.

Kürzere Varianten veröffentlichen und CTR sowie Google-Title-Rewrites über 4–8 Wochen beobachten. Wegen des geringen Traffics nicht mehrere Variablen gleichzeitig ändern.

### 11. Responsive Bilder systematisch nachziehen

145 von 181 Bild-Tags auf Sitemap-Seiten besitzen kein `srcset`. Da die Performance bereits ausgezeichnet ist, zuerst Seiten mit großen Hero- oder Produktbildern und kommerziellem Potenzial migrieren. Erfolg nicht an Lighthouse allein, sondern an Transfergröße, LCP und Affiliate-Klickrate messen.

## 30-Tage-Reihenfolge

### Tag 1–2

- lokalen Claim-Release gegenlesen und deployen;
- Live-Smoke-Test ausführen;
- Brevo-Template noindexen.

### Tag 3–7

- Sterne-/Bewertungsreset definieren;
- Evidenzmodell anlegen;
- `/spielzeug-unter-20-euro` und `/motorikspielzeug-test` migrieren.

### Woche 2

- Claim-Level-Quellen-Gate und AI-Linter fertigstellen;
- `/spielzeug-12-18-monate` und `/nachhaltiges-spielzeug-siegel` migrieren;
- FAQ-Komponente barrierefrei machen.

### Woche 3–4

- drei Hubs schärfen;
- Siegel-/Safety-Datensatz als First-Party-Asset beginnen;
- GSC- und Plausible-Baseline dokumentieren;
- erst danach nächste Content-Briefs freigeben.

## Messsystem

### Qualitäts-KPIs pro Release

- 100 % der Produktkarten mit Evidenztyp und Prüftag.
- 0 unbelegte Test-, Sieger- oder Sterne-Signale.
- 100 % der Safety-/Entwicklungsclaims mit Primärquelle oder klarer Einschränkung.
- 30/30 Sitemap-Seiten im lokalen und Live-Smoke-Test bestanden.
- 0 nichtsemantische FAQ-Controls.

### SEO-/Business-KPIs monatlich

- GSC: Impressionen, Seiten mit Klicks, Queries in Top 10 und CTR pro priorisierter URL.
- Plausible: Affiliate-Outbound-CTR pro Seite und Produktkarte; Newsletter-Conversion.
- Authority: neue relevante Referring Domains und echte Erwähnungen.
- Kein hartes Traffic-Ziel aus den bisherigen 298 Impressionen ableiten; dafür ist die Basis noch zu klein.

## Leitlinie für „AI only“

AI kann Recherche, Datenpflege, Entwurf, interne Verlinkung, QA und Monitoring weitgehend automatisieren. Sie kann aber keine nicht vorhandene Produkterfahrung erzeugen. Das robuste Modell lautet daher: **AI-operated, evidenzgebunden und menschlich verantwortet**. Produkte müssen nicht selbst gekauft worden sein; die konkrete Evidenzart muss nur ehrlich sichtbar sein und das Urteil darf nicht stärker klingen als die zugrunde liegenden Daten.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Built by agricidaniel — Join the AI Marketing Hub community
🆓 Free  → https://www.skool.com/ai-marketing-hub
⚡ Pro   → https://www.skool.com/ai-marketing-hub-pro
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
