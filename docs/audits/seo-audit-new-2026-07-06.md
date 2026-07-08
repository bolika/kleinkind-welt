# SEO-Audit neu - kleinkind-welt.de - 06.07.2026

## Executive Summary

- Gesamtzustand: gut bis sehr gut. Keine blockierenden Crawl-, Robots-, Canonical- oder HTTPS-Probleme gefunden.
- Größter Hebel: Indexierung neuer Hub-/Saisonseiten beschleunigen. GSC zeigt 20/30 Sitemap-URLs indexiert, 10 neutral.
- Größter technischer SEO-Risikopunkt: Product-/Merchant-Rich-Result-Warnungen bei mehreren Money-Pages, obwohl die Seiten selbst indexierbar sind.
- Größter Wachstumshebel: `spielzeug-unter-20-euro` liegt mit 30 Impressionen auf Position 16,1 und 0 Klicks; diese Seite bleibt die priorisierte Conversion-/CTR-Seite.
- Performance ist aktuell kein Engpass: Mobile PageSpeed lag bei 97-99 Performance und 100 SEO auf den geprüften Seiten.

## Datenbasis

- GSC Search Analytics: 08.06.2026 bis 03.07.2026
- GSC URL Inspection API: 30 Sitemap-URLs
- GSC Sitemap API: `https://kleinkind-welt.de/sitemap.xml`
- Lokaler HTML-Scan: 35 HTML-Dateien, davon 30 indexrelevante Sitemap-URLs
- PageSpeed Insights Mobile: Homepage, `spielzeug-unter-20-euro`, `geschenke-zur-geburt`

## Top-Prioritäten

### 1. Indexierung neutraler URLs beschleunigen

**Issue:** 10 Sitemap-URLs sind laut URL Inspection noch nicht indexiert oder Google unbekannt.  
**Impact:** High. Inhalte können nicht ranken, solange sie neutral sind.  
**Evidence:** URL Inspection: 20 PASS, 10 NEUTRAL, 0 FAIL, 0 ERROR.  
**Fix:** In GSC manuell "Indexierung beantragen" und in 3-7 Tagen erneut prüfen. API kann für normale Artikel keine Indexierung anfordern.  
**Priority:** High

Betroffene URLs:

- `/spielzeug-nach-alter`
- `/geschenke-kleinkind`
- `/saisonale-empfehlungen/sommer-spielzeug`
- `/artikel/sprache-foerdern-spielzeug`
- `/artikel/badespielzeug-kleinkind`
- `/artikel/was-wir-nicht-kaufen`
- `/artikel/outdoor-spielzeug-kleinkind`
- `/artikel/spielzeug-balkon-kleinkind`
- `/artikel/reisespielzeug-kleinkind`
- `/artikel/weihnachtsgeschenke-kleinkind`

### 2. Product-/Merchant-Schema bereinigen

**Issue:** Google erkennt auf mehreren Money-Pages Product-/Merchant-Listing-Daten mit Warnungen/Fehlern, z. B. fehlende Merchant-Felder wie `shippingDetails`, `hasMerchantReturnPolicy`, globale Identifier und teils Preis-Hinweise.  
**Impact:** High. Die Seiten bleiben indexiert, aber Rich-Result-Qualität und Vertrauen in strukturierte Daten leiden.  
**Evidence:** URL Inspection meldet Rich-Result-Probleme u. a. auf `/artikel/spielzeug-0-6-monate`, `/artikel/spielzeug-2-jahre`, `/artikel/spielzeug-3-jahre`.  
**Fix:** Strategische Entscheidung: Entweder Product/Merchant-Markup vollständig pflegen, oder bis zur stabilen Amazon-API-/Preis-Datenbasis auf Article/ItemList/Review-orientiertes Schema zurückgehen. Für Affiliate-Seiten ist Variante 2 aktuell risikoärmer.  
**Priority:** High

### 3. `spielzeug-unter-20-euro` weiter als Money-Page priorisieren

**Issue:** Die Seite hat gute Ranking-Signale, aber noch keine Klicks für das Hauptkeyword.  
**Impact:** High. Das ist aktuell die klarste SEO-zu-Affiliate-Chance.  
**Evidence:** GSC: `spielzeug unter 20 euro` -> `/artikel/spielzeug-unter-20-euro`, 30 Impressionen, Position 16,1, 0 Klicks. PageSpeed Mobile: Performance 99, SEO 100.  
**Fix:** Nicht technisch nachschärfen, sondern SERP- und Intent-Arbeit: Title/Intro auf "sinnvoll, wirklich unter 20 Euro, nach Alter" schärfen, interne Links aus indexierten Altersartikeln weiter ausbauen, FAQ-Fragen für Budget-Intent ergänzen.  
**Priority:** High

### 4. Meta-Description-Feinschliff

**Issue:** Mehrere Seiten haben sehr kurze Meta-Descriptions unter ca. 140 Zeichen. Kein Blocker, aber verschenkter SERP-Platz.  
**Impact:** Medium. Hilft vor allem, sobald Seiten Position 5-20 erreichen.  
**Evidence:** Lokaler HTML-Scan fand kurze Descriptions u. a. bei `spielzeug-6-12-monate`, `spielzeug-2-jahre`, `geschenke-2-jahre`, `geschenke-3-jahre`, `nachhaltiges-spielzeug-siegel`, `spielzeug-balkon-kleinkind`, `sommer-spielzeug`.  
**Fix:** Descriptions auf 145-160 Zeichen bringen, mit Nutzenversprechen und klarer Suchintention.  
**Priority:** Medium

### 5. Performance-Polish statt Performance-Rettung

**Issue:** PageSpeed nennt noch Bildgrößen, render-blocking CSS und unminified CSS.  
**Impact:** Low bis Medium. Scores sind bereits stark, daher kein akuter Engpass.  
**Evidence:** Mobile PSI: Homepage Performance 97, `spielzeug-unter-20-euro` 99, `geschenke-zur-geburt` 99; SEO jeweils 100.  
**Fix:** Bei Gelegenheit kleinere Bildvarianten für Homepage-Sommerbild/Autorbild und CSS-Minifizierung einführen.  
**Priority:** Low

## Technische SEO Findings

| Finding | Status | Evidence | Nächste Aktion |
|---|---:|---|---|
| Robots.txt | OK | HTTP 200, Sitemap angegeben | Keine |
| Sitemap | OK | 30 URLs, GSC: 0 Fehler, 0 Warnungen | Monitoring |
| HTTPS/HSTS | OK | HTTPS, HSTS aktiv | Keine |
| Canonicals | OK | 1 Canonical pro indexrelevanter HTML-Seite | Keine |
| `.html` Redirects | OK | HTTPS `.html` -> clean URL 301 | Keine |
| Indexierung | Offen | 10/30 URLs neutral | GSC manuell beantragen |
| Rich Results | Offen | Merchant/Product-Warnungen | Schema-Strategie entscheiden |

## On-Page Findings

| Finding | Status | Evidence | Nächste Aktion |
|---|---:|---|---|
| H1-Struktur | OK | 1 H1 auf indexrelevanten Seiten | Keine |
| Alt-Texte | OK | 0 fehlende Alt-Texte im lokalen Scan | Keine |
| Wortumfang | OK | Money-Artikel meist 1.300-3.000 Wörter | Keine |
| Interne Links | Gut | neue Seiten haben 5-10+ interne Quellen, Hubs deutlich mehr | Weiter ausbauen, wenn URLs neutral bleiben |
| Titles | Kleine Issues | `outdoor` 77 Zeichen, `reise` 66 Zeichen | Kürzen bei nächster Content-Welle |
| Meta Descriptions | Kleine Issues | mehrere unter ca. 140 Zeichen | SERP-Snippets nachziehen |

## Priorisierter Action Plan

1. **Jetzt durch User:** In GSC für die 10 neutralen URLs manuell Indexierung beantragen.
2. **Nächste Umsetzung:** Schema-Entscheidung treffen: Product/Merchant vollständig pflegen oder Product-Schema auf Affiliate-Seiten entschärfen.
3. **Danach:** `spielzeug-unter-20-euro` inhaltlich für Position 10-15 optimieren: Budget-FAQ, bessere interne Links, ggf. Title-Test.
4. **Dann:** Meta-Descriptions der kurzen Seiten auf 145-160 Zeichen bringen.
5. **Später:** Bildgrößen/CSS-Minifizierung als Performance-Polish.

## Monitoring

In 3-7 Tagen erneut prüfen:

- Hat Google die 10 neutralen URLs gecrawlt?
- Bleibt Product/Merchant-Schema nach Recrawl fehlerhaft?
- Bewegt sich `spielzeug-unter-20-euro` von Position 16 Richtung Top 10?
- Tauchen neue Impressionen für `reisespielzeug`, `balkon spielzeug`, `badespielzeug kleinkind` und `sommer spielzeug kleinkind` auf?
