# Full SEO Audit — kleinkind-welt.de

**Audit date:** 2026-06-30
**Business type:** Affiliate / Content site (German, toddler/Kleinkind products)
**Scope:** 11 specialist sub-audits (Technical, Content, Schema, Sitemap, Performance, Visual/Mobile, AI Search/GEO, Google Field Data, Backlinks, Content Clustering, Search Experience/SXO)

---

## Executive Summary

### SEO Health Score: 78 / 100

Computed using the standard 7-category weighting (Technical 22%, Content 23%, On-Page 20%, Schema 10%, Performance 10%, AI Search 10%, Images 5%), with On-Page derived from the SXO + Clustering audits and Images derived from the image-specific findings inside the Performance audit (see [Scoring Methodology](#scoring-methodology)).

kleinkind-welt.de is a **technically healthy, well-structured site with strong E-E-A-T foundations** that is still in an **early traffic/authority stage** (1 click / 150 impressions over 28 days in GSC, zero backlinks discoverable). The two biggest themes across all 11 sub-audits:

1. **One systemic technical bug is undermining an otherwise clean site**: 23 legacy `/artikel/*.html` URLs return HTTP 200 instead of redirecting, due to a Netlify static-file-vs-wildcard-redirect precedence quirk.
2. **The recent WebP migration is ~95% complete, not 100%**: a homepage thumbnail and one article hero image were missed, and the conversion that does exist mostly lacks responsive `srcset` for mobile.

Beyond those two, the site's underlying content and structure are strong for a young solo-operator project — E-E-A-T signals, schema hygiene, and Core Web Vitals are all good-to-excellent. The growth bottleneck right now is **discovery and authority** (indexation, backlinks, brand-presence signals for AI search), not technical debt.

### Category Scores

| Category | Score | Weight in Health Score |
|---|---|---|
| Technical SEO | 83/100 | 22% |
| Content Quality | 80/100 | 23% |
| On-Page SEO (SXO + Clustering blend) | 70/100 | 20% |
| Schema & Structured Data | 68/100 | 10% |
| Performance (CWV) | 96/100 | 10% |
| AI Search Readiness (GEO) | 78/100 | 10% |
| Images | 65/100 | 5% |

### Supplementary Categories (audited, outside the 7-category weighting)

| Category | Score | Note |
|---|---|---|
| Sitemap | 86/100 | Structurally excellent; minor lastmod drift |
| Visual / Mobile Rendering | 78/100 | No overflow issues; CTA-visibility gaps |
| Search Experience (SXO, standalone) | 71/100 | Folded into On-Page above; full detail below |
| Content Clustering / Architecture | 68/100 | Folded into On-Page above; full detail below |
| Google Field Data (GSC/CrUX) | 52/100 | Reflects early-stage traffic, not a technical fault |
| Backlinks | Insufficient data (Tier 0) | Directionally near-zero; expected for domain age |

### Top 5 Critical / High-Severity Issues

1. **[Critical — Technical]** 23 `/artikel/*.html` duplicate-content URLs return 200 instead of 301-redirecting, due to Netlify serving physically-existing files before evaluating the `_redirects` wildcard rule.
2. **[High — Performance/Images]** Homepage "Beliebte Artikel" thumbnail (`outdoor-spielzeug-kleinkind.jpg`) was missed in the WebP migration — 618 KB (97.9%) wasted bytes on every homepage load.
3. **[High — Performance]** `geschenke-2-jahre` hero image has no responsive `srcset`, pushing mobile LCP to 2.6s ("Needs Improvement") — the only CWV metric site-wide outside the "Good" band.
4. **[High — Schema]** No `Product`/`Offer`/`Review`/`AggregateRating` schema anywhere despite every article having visible star ratings and ranked comparison tables — limits both rich-result eligibility and AI/LLM product grounding.
5. **[High — SXO/GEO]** No purchase CTA visible above the fold on commercial article pages, and zero brand presence on YouTube/Reddit/Wikipedia — the two largest unaddressed levers for conversion and AI citation respectively.

### Top 5 Quick Wins

1. Delete the 23 physical `.html` files from `/artikel/` — the existing `_redirects` wildcard rule will then correctly fire (fixes Critical Finding #1 with a file deletion, no new code).
2. Wrap the homepage `outdoor-spielzeug-kleinkind` thumbnail in `<picture><source type="image/webp">` (file already exists on the server, just isn't referenced) — ~600 KB saved per homepage load.
3. Add the missing `.affiliate-hinweis` disclosure banner to `was-wir-nicht-kaufen.html` for consistency with the site's own stated policy.
4. Add `SpeakableSpecification` schema to the 2 articles missing it (`reisespielzeug-kleinkind.html`, `spielzeug-balkon-kleinkind.html`) — 5 minutes per page.
5. Strengthen internal linking to `/artikel/nachhaltiges-spielzeug-siegel` and `/artikel/spielzeug-12-18-monate` — both rank position 14-18 with double-digit impressions and zero clicks, the same tactic that's already working for `spielzeug-unter-20-euro`.

---

## Technical SEO — 83/100

**Full detail:** `findings/technical.md`

### What Works
Clean server-rendered HTML with no JS dependency, full modern security header set (HSTS, CSP, X-Frame-Options, etc.), correct HTTPS/www canonicalization, self-referential canonical tags site-wide, clean robots.txt with full AI-crawler allowlist, valid sitemap, and a verified-live WebP migration with correct `fetchpriority`/CLS protection on sampled images.

### Critical Finding: Duplicate `.html` URLs Not Redirecting
The `_redirects` rule `/artikel/*.html /artikel/:splat 301!` does not fire because the `.html` files physically exist on disk — Netlify serves an existing static file before evaluating wildcard redirects. All 23 articles are affected (confirmed via `ls` and spot-checked via `curl` on 4). Canonical tags mitigate but do not eliminate the duplicate-content/crawl-budget risk. **Fix: delete the 23 physical `.html` files** so the wildcard rule can fire (alternative: convert to 23 exact-match rules like the root-level pattern, which correctly overrides existing files with `!`).

### Other Findings
- No automated regression test catches `_redirects` precedence bugs like this (Medium) — recommend a post-deploy smoke-test script.
- Single fixed-resolution images, no responsive `srcset` breakpoints (Low) — see Performance section for the two specific instances that matter.
- 4 of 12 sampled `<img>` tags (logo, avatar) lack explicit `loading` attribute (Low, cosmetic only).

### Not Fully Verified (flagged by the specialist, not full coverage)
Live CWV field/lab data was independently confirmed by the Performance audit. ~20 of 30 sitemap URLs were not individually curled (the `.html` duplicate issue is presumed systemic across all 23 based on identical file-system evidence). IndexNow submission-trigger history and mobile touch-target sizing were not assessed at the HTTP level (touch-targets *were* covered by the Visual audit, see below).

---

## Content Quality — 80/100

**Full detail:** `findings/content.md`

### E-E-A-T Breakdown
| Factor | Score |
|---|---|
| Experience | 16/20 |
| Expertise | 19/25 |
| Authoritativeness | 19/25 |
| Trustworthiness | 26/30 |

**AI Citation Readiness: 85/100** — strong Kurzantwort boxes, matching FAQ schema, speakable markup, clear heading hierarchy.

### What Works
Genuine, differentiated first-hand anecdotes per article ("Aus unserer Elternpraxis"), explicit AI-use disclosure (rare and valuable post-2025-QRG), a substantive non-thin methodology page, consistent and prominent affiliate disclosure (343 instances of proper `rel` attributes), strong author entity markup, healthy word counts (1,186–4,190 words/article), and honest opinionated content (`was-wir-nicht-kaufen.html`) that reads as genuine POV rather than generic AI filler.

### Key Findings
- **Medium:** 18 of 23 articles share an identical same-day `dateModified` timestamp (2026-06-26) regardless of actual content changes — looks like a bulk/scripted update and risks being read as a "fake freshness" signal. Only bump `dateModified` on genuine content changes.
- **Medium:** `was-wir-nicht-kaufen.html` is missing the affiliate-disclosure banner present on every other article despite containing a sponsored link.
- **Low:** The "So wählst du aus" 6-step list is duplicated near-verbatim across 7 articles with only the age placeholder swapped — a recognizable template pattern Google's Sept 2025 QRG flags.
- **Low:** Inconsistent author byline component on `weihnachtsgeschenke-kleinkind.html` (minimal text byline instead of the rich `.artikel-autor-line` card).
- **Info:** Author has no formal child-development credentials (honestly disclosed, acceptable per QRG, but caps the achievable Expertise score). Consider a named expert reviewer credit on 2-3 safety-heavy articles.
- **Info:** The six age-progression articles share a near-identical structural skeleton — fine today given differentiated content, but worth monitoring/consolidating safety boilerplate as more articles are added.

---

## On-Page SEO — 70/100 (blend of SXO + Clustering)

This category is not covered by a single specialist; it is synthesized from the **Search Experience (SXO)** and **Content Clustering/Architecture** sub-audits, both of which speak directly to page-intent matching and internal-linking structure.

### Search Experience (SXO) — 71/100
**Full detail:** `findings/sxo.md`

Listicle/ranked format correctly matches German commercial-investigation SERP expectations on both money pages; Kurzantwort + FAQ + speakable structure serves the time-pressed mobile persona well; the "what we'd avoid" editorial page correctly avoids forcing a listicle format onto an opinion query.

Key gaps:
- **High:** Homepage mixes navigational and content-hub roles with 9+ competing entry points above the fold — decision fatigue for a first-time/branded-query visitor.
- **Medium:** `was-wir-nicht-kaufen.html`'s trust-building structure is undercut by commercial CTA furniture mid-article.
- **Medium:** Commercial articles lack a scannable side-by-side comparison table (the hub page has one; the money pages, which need it more, don't).
- **Medium:** The "uncertain gift-giver" persona (grandparent/relative) is underserved on `geschenke-2-jahre.html`, which assumes parent-level context throughout.
- **Low:** Homepage age-grid duplicates `spielzeug-nach-alter.html` almost entirely, fragmenting internal-link equity between two "front doors" to the same content.

### Content Clustering / Architecture — 68/100
**Full detail:** `findings/clustering.md`

Hub-and-spoke structure is clean and well cross-linked for the age cluster, gift cluster, and seasonal/situational cluster — the seasonal sub-cluster is the strongest-built on the site. No same-keyword cannibalization found; intent-segmented overlap (browsing vs. gifting) is already partially disambiguated on-page.

Key gaps:
- **High:** No dedicated hub for "Sicheres/nachhaltiges Spielzeug" or "Entwicklung/Motorik" — 5+ topically related articles rely entirely on incidental contextual links. (The team's own internal `SITE-STRUCTURE.md` already plans `/sicheres-spielzeug/` and `/motorik-und-entwicklung/` hubs — not yet built.)
- **Medium:** Moderate cannibalization risk between age-guides and gift-guides at the 1/2/3-year marks due to overlapping product picks — keep both pages (intent differs) but enforce stricter framing differentiation and cap product overlap at ~40%.
- **Medium:** Missing high-intent narrower age-segment content (9, 15, 24, 30 Monate) — confirmed via competitor SERP presence.
- **Low:** Situational cluster ("Geschwisterkinder", "kleine Wohnung", "Regentage") underdeveloped relative to demand.

---

## Schema & Structured Data — 68/100

**Full detail:** `findings/schema.md`

### What Works
100% valid JSON-LD syntax across all 23 articles + 6 root/hub pages checked, zero `@id` collisions, complete date hygiene, correct canonical/mainEntityOfPage alignment, FAQPage matching visible content site-wide, modern context/format conventions throughout.

### Key Findings
- **High:** No `Product`/`Offer`/`Review`/`AggregateRating` schema anywhere despite visible star ratings and ranked comparison tables on every article. The existing `ItemList` blocks carry only `position`/`name` — no `url`, `image`, or `offers`. This is the single biggest structured-data opportunity on the site (see example markup in `findings/schema.md` Finding 1).
- **Medium:** In-article comparison `ItemList` items carry no `url` property, unlike hub-page `ItemList`s — makes list entries dead-ends for crawlers/LLMs.
- **Low:** `holzspielzeug-vs-plastikspielzeug.html` (a head-to-head comparison) has no `ItemList`/`Product` treatment unlike the other comparison articles.
- **Info:** `FAQPage` no longer produces a Google rich result (retired May 2026) but is correctly retained for AI/LLM citation value — no removal needed.
- **Info:** `Organization` node could add `founder` link to the author `Person` entity for a stronger entity graph (low priority, no `SearchAction` needed since there's no on-site search).

---

## Performance (Core Web Vitals) — 96/100

**Full detail:** `findings/performance.md`

### Measured (Lighthouse lab data, mobile — CrUX field data unavailable, expected for traffic level)
| Page | LCP | CLS | TBT |
|---|---|---|---|
| Homepage | 1.7s | 0 | 0ms |
| spielzeug-unter-20-euro | 1.7s | 0 | 0ms |
| geschenke-2-jahre | **2.6s** | 0 | 0ms |
| spielzeug-nach-alter | 1.1s | 0 | 0ms |

CLS is a perfect 0 everywhere (no custom web fonts, all images sized). TBT is 0ms everywhere (minimal JS, only a 3.3KB Plausible analytics script). The only metric outside "Good" anywhere on the site is `geschenke-2-jahre`'s mobile LCP, directly traceable to one unoptimized hero image.

### Key Findings
- **High:** Homepage `outdoor-spielzeug-kleinkind` thumbnail not WebP-wrapped — 618 KB wasted (see Executive Summary).
- **High:** `geschenke-2-jahre` hero has WebP but no responsive `srcset` — single 1600px image served to ~400px mobile viewports, 93% wasted bytes, directly causing the one "Needs Improvement" LCP on the site.
- **Medium:** Sitewide author avatar (`autor-boris.webp`) is oversized for its 40×40px display (99% wasted bytes), compounding on every article view.
- **Low:** `css/style.css` is the only render-blocking resource site-wide, unminified (~22% recoverable via minification) — not currently affecting LCP scores.
- **Info:** No CrUX field data available yet (expected at current traffic level) — all scores are Lighthouse lab data; re-validate against field data once the origin qualifies.

---

## Images — 65/100

Derived from the image-specific findings inside the Performance and Visual audits (no standalone Images specialist in this run). The WebP migration completed in the prior session is real and mostly correct (verified live, ~70% file-size reduction on the sampled hero image, correct `fetchpriority`/preload on LCP images) but **incomplete**: one homepage thumbnail was missed entirely, and the conversions that exist generally serve a single fixed resolution rather than a responsive `srcset`, which caps the migration's real-world mobile benefit. See Performance Findings 1–3 above for the three concrete instances.

---

## AI Search Readiness (GEO) — 78/100

**Full detail:** `findings/geo.md`

### What Works
Full AI-crawler access already granted in robots.txt (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, anthropic-ai, cohere-ai, Applebot-Extended — no blocking). Static server-rendered HTML means zero CSR risk for non-JS-executing crawlers. A well-formed `llms.txt` already exists with RSL 1.0 licensing — ahead of the curve for a site this size. Direct-answer architecture (Kurzantwort + FAQ + speakable) is consistently scaled across all 23 articles. Author entity uses one stable `@id` reused everywhere. Per-article sourcing boxes cite named, checkable external sources.

### Key Findings
- **High:** Zero YouTube, Reddit, or Wikipedia presence anywhere in the brand's footprint — the single biggest structural gap versus known AI-citation correlation benchmarks (YouTube mentions correlate ~0.737 with citation likelihood). This is a multi-month initiative, not a quick fix (see Action Plan Phase 3).
- **Medium:** Kurzantwort-box answers cluster at 109-128 words, 15-20% short of the optimal 134-167 word AI-citation window; two articles (`outdoor-spielzeug-kleinkind`, `spielzeug-balkon-kleinkind`) are well short of even that.
- **Medium:** H2/H3 headings outside the FAQ block are mostly label-style ("Direkter Vergleich: Was wirklich entscheidet") rather than question-style — a known lever for AI Overview/conversational-query matching that's currently confined to the FAQ section.
- **Low:** 2 of 23 articles (`reisespielzeug-kleinkind.html`, `spielzeug-balkon-kleinkind.html`) are missing `SpeakableSpecification` schema.
- **Low:** `llms.txt` lists 27 links vs. the sitemap's 30 — a small sync gap, likely newer articles not yet added.
- **Info:** RSL 1.0 licensing declaration is forward-looking infrastructure (not yet honored by major AI crawlers) — no action needed now.

---

## Supplementary: Sitemap — 86/100

**Full detail:** `findings/sitemap.md`

Well-formed XML, zero orphan pages, zero dead URLs, noindex pages correctly excluded, canonical alignment confirmed, hub-and-spoke architecture fully reflected. The only real defect: `lastmod` values are manually maintained and already drifted out of sync with actual git commit history (Medium) — recommend automating from file mtime or git log at deploy time. `priority`/`changefreq` tags are present but Google ignores both (Info, safe to remove). `kaufhilfen` functions as a de facto 4th hub (most internally-linked page site-wide) without being integrated into the formal hub-and-spoke model — flagged for IA workstream, not a sitemap defect per se.

---

## Supplementary: Visual / Mobile Rendering — 78/100

**Full detail:** `findings/visual.md` · Screenshots: `screenshots/` (5 viewports × 3 pages + mobile full-page captures)

No horizontal overflow at any tested breakpoint on any page — the mobile text-clipping issue from the prior (2026-06-17) baseline audit is resolved. Strong above-the-fold trust sequence on article pages (breadcrumb → hero → metadata → H1 → author block → Kurzantwort). Zero console errors across all 12 page/viewport combinations.

Key findings:
- **High:** No purchase CTA visible above the fold on article money pages on any viewport — first "Preis prüfen" box appears 2,200-2,800px down the page on mobile. (Repeats a finding from the prior audit, still unaddressed — directly reinforces SXO Finding 3.)
- **Medium:** Hub page has no visible age-segment quick-links above the fold, delaying its core routing function.
- **Medium:** 13 of 21 homepage `<img>` elements reported `naturalWidth: 0` at measurement time — most likely a lazy-load timing artifact, not broken images, but should be confirmed with a full scroll-through; separately confirms the `outdoor-spielzeug-kleinkind.jpg` WebP gap from another angle.
- **Low:** Desktop/tablet nav links measure only 18px tall, below the 44px touch-target guideline (mobile nav is unaffected — it's behind a hamburger).

---

## Supplementary: Google Field Data (GSC / CrUX) — 52/100

**Full detail:** `findings/google-data.md`

Score reflects an **early-stage, low-traffic site with strong underlying technical health** — not a technical or indexation defect. PSI lab data confirms 100/100 across Performance/Accessibility/Best Practices/SEO on the homepage. CrUX has no field data yet (expected, traffic threshold not met).

**Data gap:** the GSC URL Inspection batch across all 30 sitemap URLs was interrupted mid-run (17/30 requests sent, no parsed results captured) — needs a clean re-run to get current per-URL indexation status (`indexed` / `discovered-not-indexed` / `excluded`).

**28-day GSC totals:** 1 click, 150 impressions, 0.67% CTR, average position 36.0 across 27 distinct queries. 17 of 30 sitemap URLs received at least one impression (confirmed indexed); 13 received zero (includes all 3 hub pages, consistent with their recent "Discovered — not indexed" status).

**Quick-win queries already in striking distance (position 14-18, zero clicks):**
- `/artikel/spielzeug-unter-20-euro` — position 14.0, 24 impressions
- `/artikel/nachhaltiges-spielzeug-siegel` — position 17.8, 12 impressions (new finding)
- `/artikel/spielzeug-12-18-monate` — position 14.6, 10 impressions (new finding)

**Anomaly:** `/artikel/spielzeug-3-jahre.html` (legacy `.html` variant) still receives occasional GSC impressions separately from the canonical `/artikel/spielzeug-3-jahre` — directly corroborates the Technical audit's Critical Finding #1 and will resolve once those 23 files are deleted.

---

## Supplementary: Backlinks — Insufficient Data (Tier 0)

**Full detail:** `findings/backlinks.md`

No numeric score assigned — Tier 0 (Common Crawl only, no Moz/Bing/DataForSEO key) cannot populate enough scoring factors for a meaningful 0-100 number. Directionally: backlink profile is effectively zero, which is normal and expected for a domain this young, not a defect. Common Crawl shows the domain not yet present in its web graph (re-checked with forced cache bypass, identical to a check ~2 weeks ago — no change in interim, next CC release in ~2-3 months). Only off-site presence is a 5-pin Pinterest account (nofollow, referral-only, correctly excluded from link-equity scoring).

Recommended free next step: a Moz API free-tier signup (2,500 rows/month, €0) would upgrade this to Tier 1 and provide a real DA/spam baseline.

---

## Scoring Methodology

This audit used 11 specialist sub-agents rather than the skill's default 7 (it included Sitemap, Visual, GEO, Google Field Data, Backlinks, Clustering, and SXO as additional dedicated specialists beyond the baseline Technical/Content/Schema/Performance set, reflecting the project's full audit scope). To stay compatible with the skill's standard 7-category weighted Health Score:

- **Technical SEO, Content Quality, Schema, Performance** map 1:1 to their named specialist scores.
- **On-Page SEO** is derived as the average of the SXO (71) and Clustering (68) specialist scores, since both speak directly to page-intent matching, internal linking, and information architecture — the substance of "On-Page SEO" — and there was no single dedicated On-Page specialist in this run.
- **AI Search Readiness** maps to the GEO specialist score.
- **Images** is derived qualitatively from the image-specific findings inside the Performance audit (3 concrete issues, one High-severity sitewide gap), since there was no standalone Images specialist in this run.
- **Sitemap, Visual/Mobile, Google Field Data, and Backlinks** were audited as supplementary categories outside the 7-category weighting and are reported in full above, since they materially inform the action plan even though they aren't part of the official Health Score formula.
