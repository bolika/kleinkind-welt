# Content Architecture / Clustering Audit — kleinkind-welt.de

## Score: 68 / 100

## What works
- Clean hub-and-spoke structure: two primary hubs (`/spielzeug-nach-alter`, `/geschenke-kleinkind`) plus an emerging seasonal hub (`/saisonale-empfehlungen/sommer-spielzeug`), each with `ItemList` + `BreadcrumbList` schema and a real decision-helper above the card grid (not a thin link list).
- Age-based cluster (0-6, 6-12, 12-18, 18-24 Monate, 2 Jahre, 3 Jahre) is a textbook sequential spoke set with prev/next interlinking already implemented (e.g. `spielzeug-12-18-monate.html` links forward to `spielzeug-18-24-monate` and explicitly tells the reader when to leave the page — good cannibalization defense via on-page disambiguation).
- Gift cluster (Geburt, 1/2/3 Jahre, Weihnachten, unter 20 Euro) mirrors the age cluster well and cross-links into it (each gift article links to the matching age article and to the budget article).
- Seasonal/situational spokes (Outdoor, Balkon, Badespielzeug, Reisespielzeug) already interlink tightly with each other and back to both the sommer-spielzeug hub and the two main hubs — this is the strongest-built sub-cluster on the site.
- Standalone authority/trust spokes (Montessori, Holz vs. Plastik, Nachhaltige Siegel, Was wir nicht kaufen, Sprache fördern, Motorikspielzeug) are cited from inside multiple age/gift articles, giving them reasonable inbound link equity despite having no dedicated hub.
- Internal docs (`docs/seo-plan-2026-06-29/`) show the team is already aware of structural gaps and has a sensible target structure planned (`/motorik-und-entwicklung/`, `/sicheres-spielzeug/` hubs) — clustering direction is already validated, just not yet built.

## Findings

### Finding 1: No dedicated hub for "Sicheres/nachhaltiges Spielzeug" and "Entwicklung/Motorik" clusters
**Severity:** High
**Description:** Montessori-Spielzeug, Holzspielzeug vs. Plastikspielzeug, Nachhaltige Siegel, Was wir nicht kaufen, Motorikspielzeug-Test, and Sprache fördern are five-plus topically related articles with no parent hub page, no shared `ItemList` schema, and no consistent navigation entry point. They rely entirely on contextual inline links from age/gift articles. This is exactly the gap the team's own `SITE-STRUCTURE.md` plan already identifies (`/motorik-und-entwicklung/`, `/sicheres-spielzeug/`) but has not implemented.
**Recommendation:** Build two new hubs: `/sicheres-spielzeug/` (Holzspielzeug vs. Plastik, Nachhaltige Siegel, Was wir nicht kaufen) and `/entwicklung-spielzeug/` (Motorikspielzeug-Test, Sprache fördern, Montessori-Spielzeug). Add ItemList schema, link both hubs into main nav or footer, and add mandatory bidirectional links from every spoke to its new hub.

### Finding 2: Moderate cannibalization risk between age-guides and gift-guides at the 1/2/3-year marks
**Severity:** Medium
**Description:** SERP spot-checks show "Spielzeug ab 18 Monate" and "Geschenke 2. Geburtstag"-type queries return distinct URLs even from the same competitor domains (e.g. kita.de runs both "Spielzeug ab 18 Monate" and "Geschenk Kind 18 Monate" as separate pages), confirming Google treats browsing-intent and gifting-intent as different queries. However, the underlying product recommendations overlap heavily (Duplo, Stapelspielzeug, Laufrad, Motorikbrett appear in both `spielzeug-2-jahre` and `geschenke-2-jahre`), which risks topical dilution and duplicate-feeling product sections if not differentiated in framing.
**Recommendation:** Keep both articles (intent differs enough to justify separate URLs) but enforce a stricter content-differentiation rule: age guides should lead with developmental milestones and "what to look for," gift guides should lead with budget/occasion framing and gift-specific angles (wrapping, group-gift options, what grandparents should avoid). Audit duplicate product picks across `spielzeug-2-jahre`/`geschenke-2-jahre` and `spielzeug-3-jahre`/`geschenke-3-jahre` pairs and ensure no more than ~40% product overlap.

### Finding 3: Missing high-intent age-segment content (9, 15, 24, 30 Monate)
**Severity:** Medium
**Description:** Current age cluster jumps in large bands (0-6, 6-12, 12-18, 18-24, 2 Jahre, 3 Jahre). German search volume exists for narrower asks like "Spielzeug ab 9 Monate," "Spielzeug ab 15 Monate," and "Pikler-Dreieck ab welchem Alter" — confirmed via SERP checks showing dedicated competitor pages (kita.de, selecta-spielzeug.de) targeting these exact bands. This matches gaps the team already flagged internally but has not yet built.
**Recommendation:** Add a "Pikler-Dreieck: Ab wann sinnvoll?" standalone spoke under the new Entwicklung hub (high intent, currently zero coverage), and consider one consolidated "Spielzeug-Meilensteine: 9, 15, 24, 30 Monate" FAQ-style spoke rather than four thin new pages, to avoid further fragmenting the age cluster.

### Finding 4: Situational/"life situation" content underdeveloped relative to demand
**Severity:** Low
**Description:** Reisespielzeug, Balkon-Spielzeug, and Outdoor-Spielzeug exist and interlink well, but common German parent queries — Spielzeug für Geschwisterkinder/teilen lernen, Spielzeug für kleine Wohnung, Spielzeug für Regentage, Spielzeug Auto/Flugreise — are only partially covered (Reisespielzeug covers travel narrowly) or entirely absent (Geschwister/teilen, Regentag, kleine Wohnung).
**Recommendation:** Treat this as a third major cluster ("Situationen") as already planned internally; prioritize "Spielzeug für Geschwisterkinder" and "Spielzeug für kleine Wohnung/Regentage" as net-new spokes since they have clear non-overlapping search intent from existing content.

### Finding 5: No orphan pages, but inconsistent inbound-link counts to standalone spokes
**Severity:** Low
**Description:** Articles like `nachhaltiges-spielzeug-siegel` and `spielzeug-unter-20-euro` rely on incidental contextual mentions for inbound links rather than a structured hub placement, meaning their internal PageRank distribution is less predictable than the well-structured age/gift/seasonal clusters.
**Recommendation:** Once the two new hubs in Finding 1 are built, verify every spoke has at least 3 structured inbound links (hub card + 2 contextual mentions), not just opportunistic ones.

## Cannibalization Check Summary
No same-keyword duplication found (no two pages target an identical primary keyword). Overlap that exists is intent-segmented (browsing vs. gifting vs. seasonal) and already partially mitigated by on-page "if you're looking for X, see Y instead" disambiguation text — a good practice already in use on `spielzeug-12-18-monate.html` that should be replicated across all age/gift pairs.
