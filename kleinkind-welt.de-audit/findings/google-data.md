# Google Field Data Findings — kleinkind-welt.de

Data source: Google API (field data) — GSC Search Console (service account), CrUX, PageSpeed Insights.
Credential tier: Tier 1 (API key + service account). GA4 not configured (no property ID) — skipped, not an error.
Audit run date: 2026-06-30.

## Score: 52/100

Rationale: GSC indexation could not be confirmed this run (see Data Gap below), search visibility is very early-stage (1 total click across 28 days, 150 impressions, average position ~36), but on-page technical health (PSI 100/100, fast lab CWV, valid sitemap with 0 errors) is strong. Score reflects "technically healthy site with minimal current search traction" rather than a indexation/technical problem.

## DATA GAP — URL Inspection Batch Incomplete

The fresh URL Inspection batch across all 30 sitemap URLs was interrupted before completion. Requests were submitted for 17 of 30 URLs (logged below) before the run was stopped; the output file was not flushed with valid JSON, so **no structured per-URL indexation status (indexed / discovered-not-indexed / excluded) is available from this run**. This needs to be re-run to get current indexation counts.

URLs that had inspection requests sent (response capture incomplete):
1. https://kleinkind-welt.de/
2. https://kleinkind-welt.de/ueber-uns
3. https://kleinkind-welt.de/bewertungsmethode
4. https://kleinkind-welt.de/kaufhilfen
5. https://kleinkind-welt.de/spielzeug-nach-alter
6. https://kleinkind-welt.de/geschenke-kleinkind
7. https://kleinkind-welt.de/saisonale-empfehlungen/sommer-spielzeug
8. https://kleinkind-welt.de/artikel/motorikspielzeug-test
9. https://kleinkind-welt.de/artikel/spielzeug-12-18-monate
10. https://kleinkind-welt.de/artikel/geschenke-1-jahr
11. https://kleinkind-welt.de/artikel/duplo-vergleich
12. https://kleinkind-welt.de/artikel/montessori-spielzeug-kleinkind
13. https://kleinkind-welt.de/artikel/spielzeug-6-12-monate
14. https://kleinkind-welt.de/artikel/spielzeug-2-jahre
15. https://kleinkind-welt.de/artikel/spielzeug-0-6-monate
16. https://kleinkind-welt.de/artikel/spielzeug-18-24-monate
17. https://kleinkind-welt.de/artikel/spielzeug-3-jahre

Not yet attempted (13 remaining): spielzeug-3-jahre (continued), geschenke-2-jahre, geschenke-3-jahre, geschenke-zur-geburt, holzspielzeug-vs-plastikspielzeug, sprache-foerdern-spielzeug, nachhaltiges-spielzeug-siegel, badespielzeug-kleinkind, spielzeug-unter-20-euro, was-wir-nicht-kaufen, outdoor-spielzeug-kleinkind, spielzeug-balkon-kleinkind, reisespielzeug-kleinkind, weihnachtsgeschenke-kleinkind.

**Recommended next step**: re-run `python3 scripts/gsc_inspect.py --batch <sitemap_urls.txt> --site-url sc-domain:kleinkind-welt.de --json` to completion (full batch takes ~35-40 seconds at the default 1s delay for 30 URLs) and update this section.

### Indirect indexation signals (from data that did complete)

- GSC Sitemap status: `https://kleinkind-welt.de/sitemap.xml` — last submitted, 0 warnings, 0 errors, 28 URLs submitted (note: the live sitemap.xml fetched for this audit lists 30 URLs; the 2-URL discrepancy between "submitted" count and current sitemap content should be checked — possibly a resubmission lag or two newly added URLs not yet reflected in GSC's submitted count).
- GSC Page-dimension search performance (last 28 days) shows **17 distinct URLs received at least one impression**, which confirms those 17 pages are indexed and being shown in search (a page cannot generate an impression if it isn't indexed). This is a lower bound, not a full indexation count — pages with zero impressions could be indexed-but-not-ranking, or not-yet-indexed.
- Of the 30 sitemap URLs, 13 generated zero GSC impressions in the last 28 days, including the 3 hub pages mentioned as recent Indexing-API targets (/geschenke-kleinkind, /saisonale-empfehlungen/sommer-spielzeug, /spielzeug-nach-alter) — consistent with them having been "Discovered - not indexed" or "unknown to Google" recently; their indexing-request follow-up has not yet been confirmed.

## GSC Search Analytics — Last 28 Days (2026-06-02 to 2026-06-27)

Source: Google API (field data), GSC Search Analytics. Note: GSC data has a typical 2-3 day lag.

**Site totals**: 1 click, 150 impressions, 0.67% CTR, average position 36.0

### Top Queries by Impressions

| Query | Clicks | Impressions | CTR | Avg. Position |
|---|---|---|---|---|
| spielzeug unter 20 euro | 0 | 19 | 0% | 15.3 |
| kleinkindspielzeug | 0 | 7 | 0% | 70.3 |
| was kann man zur geburt schenken | 0 | 6 | 0% | 54.8 |
| montessori spielzeug 1 jahr | 0 | 5 | 0% | 50.2 |
| motorik spielgeräte | 0 | 5 | 0% | 70.8 |
| motorikwürfel test | 0 | 4 | 0% | 58.8 |
| lauflerngitter | 0 | 3 | 0% | 10.7 |
| montessori 1 jahr | 0 | 3 | 0% | 69 |
| stapelbecher ab welchem alter | 0 | 3 | 0% | 18.3 |

27 distinct queries total, all with very low impression volume (1-19) — consistent with an early-stage site still building visibility. Only 1 click site-wide in 28 days.

### Top Pages by Impressions

| Page | Clicks | Impressions | CTR | Avg. Position |
|---|---|---|---|---|
| /artikel/motorikspielzeug-test | 1 | 43 | 2.33% | 45.7 |
| / (homepage) | 0 | 17 | 0% | 46.6 |
| /artikel/spielzeug-unter-20-euro | 0 | 24 | 0% | 14.0 |
| /artikel/montessori-spielzeug-kleinkind | 0 | 21 | 0% | 40.2 |
| /artikel/geschenke-zur-geburt | 0 | 13 | 0% | 49.6 |
| /artikel/nachhaltiges-spielzeug-siegel | 0 | 12 | 0% | 17.8 |
| /artikel/spielzeug-12-18-monate | 0 | 10 | 0% | 14.6 |
| /artikel/spielzeug-6-12-monate | 0 | 7 | 0% | 20.9 |
| /artikel/spielzeug-0-6-monate | 0 | 5 | 0% | 56.8 |

The only click recorded in 28 days came from /artikel/motorikspielzeug-test.

**Anomaly flagged**: `/artikel/spielzeug-3-jahre.html` (with `.html` extension) also appears in GSC page data (1 impression, position 42) — this is a non-canonical URL variant separate from the sitemap's `/artikel/spielzeug-3-jahre` (no extension, 2 impressions, position 10). This suggests a duplicate/legacy URL still receiving occasional impressions; worth checking robots/redirects to consolidate signal onto the canonical version.

## Quick-Win Opportunities (Position 4-20, non-trivial impressions)

| Query/Page | Position | Impressions | Note |
|---|---|---|---|
| spielzeug unter 20 euro | 15.3 | 19 | Already known target; internal linking strengthened recently — monitor for movement. |
| /artikel/spielzeug-unter-20-euro (page) | 14.0 | 24 | Same article, page-level view confirms it's the single strongest quick-win candidate site-wide. |
| /artikel/nachhaltiges-spielzeug-siegel (page) | 17.8 | 12 | **New quick-win identified.** Page ranks position ~18 with 12 impressions/28 days and zero clicks — a CTR/title-tag opportunity once it nudges into top 10. |
| /artikel/spielzeug-12-18-monate (page) | 14.6 | 10 | **New quick-win identified.** Solid impression volume at position ~15, zero clicks — strong internal-linking/on-page optimization candidate. |
| stapelbecher ab welchem alter | 18.3 | 3 | Low impression volume but page-4-equivalent position; minor opportunity. |
| lauflerngitter | 10.7 | 3 | Already top-11 with very low impressions; low priority due to volume. |

**Top new finding beyond "spielzeug unter 20 euro"**: `/artikel/nachhaltiges-spielzeug-siegel` and `/artikel/spielzeug-12-18-monate` are the next-best quick-win candidates — both sit in positions 14-18 with double-digit 28-day impressions and zero clicks (0% CTR), meaning the ranking exists but title/meta description or snippet appeal may be suppressing clicks, or they simply need a small ranking push (better internal linking, similar to what was done for spielzeug-unter-20-euro) to break into page 1.

## Core Web Vitals — Field Data (CrUX)

Source: Google API (field data), CrUX API. CrUX uses a 28-day rolling collection window.

| URL | CrUX Field Data |
|---|---|
| https://kleinkind-welt.de/ (origin) | **No CrUX data available.** Error: "No CrUX data for this origin. The site likely has insufficient Chrome traffic volume for eligibility." |

CrUX requires a minimum real-user Chrome traffic threshold (roughly low thousands of qualifying page loads per 28-day period) before Google publishes field data. This site does not yet meet that threshold — expected for an early-stage/low-traffic site, not a technical problem. No other URL was tested for CrUX given the homepage origin-level call already failed (lower-traffic individual pages would fail the same threshold).

### PSI Lab Data Fallback (homepage, since field CWV unavailable)

| Metric | Mobile | Desktop | Rating |
|---|---|---|---|
| Performance score | 100/100 | 100/100 | Good |
| LCP (lab) | 1.7s | 0.4s | Good (both ≤ 2,500ms) |
| CLS (lab) | 0 | 0 | Good |
| TBT (lab, proxy for INP) | 0ms | 0ms | Good |
| Accessibility | 100/100 | 100/100 | — |
| Best Practices | 100/100 | 100/100 | — |
| SEO | 100/100 | 100/100 | — |

Lab data is synthetic (single simulated run), not real-user data — use as a directional proxy only until CrUX field data becomes available.

**Flag**: PSI diagnostics show `/images/articles/outdoor-spielzeug-kleinkind.jpg` is a 632 KB JPEG (not WebP), the single largest resource on the homepage (~595 KB of estimated wasted bytes per PSI's image-delivery-insight audit). This contradicts the stated recent "all site images converted to WebP" deployment — this one image appears to have been missed and should be converted/compressed.

## Summary of What Succeeded vs. Failed

| Check | Status |
|---|---|
| GSC Search Analytics (queries) | Succeeded |
| GSC Search Analytics (pages) | Succeeded |
| GSC Sitemap status | Succeeded |
| GSC URL Inspection batch (30 URLs) | **Incomplete** — 17/30 requests sent, no parsed results captured; needs re-run |
| CrUX field CWV (homepage) | Returned no data (insufficient Chrome traffic — not an error, expected) |
| PSI lab data (homepage) | Succeeded |
| GA4 organic traffic | Skipped — not configured (no property ID), not an error |
