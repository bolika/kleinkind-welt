# Action Plan — kleinkind-welt.de SEO

Generated: 2026-06-30 | Overall Health Score: 78/100

Priority key: **Critical** (blocks indexing/trust) → **High** (significant ranking impact) → **Medium** (meaningful optimization) → **Low** (backlog/polish)

---

## Phase 1: Critical Fixes — Week 1

These must be done first. The `.html` redirect bug is the only Critical finding across all 11 sub-audits, and the two image issues directly cause a "Needs Improvement" CWV that can be fixed in minutes.

### 1.1 Delete the 23 `/artikel/*.html` files [Critical — Technical]
**Why this is #1:** 23 duplicate-content URLs currently return 200 instead of 301-redirecting. Google has already spotted at least one of them in GSC page data (`/artikel/spielzeug-3-jahre.html` receiving its own impressions, separately from the canonical). The existing `_redirects` rule already handles this correctly once the physical files are gone.

```bash
cd /Users/bnazarov/coding/kleinkind-welt/artikel
ls *.html   # confirm all 23 are here — expect motorikspielzeug-test.html etc.
git rm *.html
git commit -m "Remove legacy .html article duplicates — wildcard _redirects rule now fires"
git push origin main
```

After deploy, verify with curl:
```bash
curl -sI https://kleinkind-welt.de/artikel/motorikspielzeug-test.html | grep HTTP
# Expect: HTTP/2 301
curl -sI https://kleinkind-welt.de/artikel/spielzeug-12-18-monate.html | grep HTTP
# Expect: HTTP/2 301
```

If any return 200 still after deploy, switch to explicit per-URL redirect entries in `_redirects` (same pattern as root-level `.html` redirects with `!` forcing override).

---

### 1.2 Fix homepage WebP gap (`outdoor-spielzeug-kleinkind`) [High — Images/Performance]
**PSI-measured impact:** 618 KB wasted bytes (97.9%) on every homepage load.

In `index.html`, find the "Beliebte Artikel" section thumbnail and replace:
```html
<!-- BEFORE -->
<img src="images/articles/outdoor-spielzeug-kleinkind.jpg" alt="..." loading="lazy" decoding="async" width="1200" height="800">

<!-- AFTER — WebP already exists on server at the .webp path; add picture wrapper -->
<picture>
  <source type="image/webp" srcset="images/articles/outdoor-spielzeug-kleinkind-480.webp 480w, images/articles/outdoor-spielzeug-kleinkind.webp 1200w" sizes="(max-width: 600px) 100vw, 298px">
  <img src="images/articles/outdoor-spielzeug-kleinkind.jpg" alt="Outdoor-Spielzeug für Kleinkinder im Sommer" loading="lazy" decoding="async" width="1200" height="800">
</picture>
```
Note: generate a 480w WebP variant for the 480w srcset entry if it doesn't already exist, using the same cwebp command pattern used for other card thumbnails during the prior WebP migration.

---

### 1.3 Add responsive srcset to `geschenke-2-jahre` hero [High — Performance]
**Measured impact:** mobile LCP 2.6s → ~1.5-1.8s (from "Needs Improvement" back to "Good").

In `artikel/geschenke-2-jahre.html`, update the hero `<picture><source>` and the preload `<link>`:

```html
<!-- BEFORE: single resolution, no srcset breakpoints -->
<link rel="preload" as="image" href="/images/articles/geschenke-2-jahre.webp" imagesrcset="/images/articles/geschenke-2-jahre.webp" fetchpriority="high" type="image/webp">
<picture>
  <source type="image/webp" srcset="/images/articles/geschenke-2-jahre.webp">
  <img src="/images/articles/geschenke-2-jahre.jpg" width="1600" height="893" fetchpriority="high">
</picture>

<!-- AFTER: multi-width srcset matching the pattern in spielzeug-12-18-monate etc. -->
<link rel="preload" as="image" href="/images/articles/geschenke-2-jahre-480.webp" imagesrcset="/images/articles/geschenke-2-jahre-480.webp 480w, /images/articles/geschenke-2-jahre-768.webp 768w, /images/articles/geschenke-2-jahre.webp 1600w" sizes="(max-width: 600px) 100vw, 800px" fetchpriority="high" type="image/webp">
<picture>
  <source type="image/webp" srcset="/images/articles/geschenke-2-jahre-480.webp 480w, /images/articles/geschenke-2-jahre-768.webp 768w, /images/articles/geschenke-2-jahre.webp 1600w" sizes="(max-width: 600px) 100vw, 800px">
  <img src="/images/articles/geschenke-2-jahre.jpg" width="1600" height="893" fetchpriority="high" alt="Geschenke zum 2. Geburtstag — Spielzeugideen für Kleinkinder">
</picture>
```

Generate the 480w and 768w WebP variants with cwebp (quality 82, same as other heroes in the migration).

---

### 1.4 Add affiliate disclosure to `was-wir-nicht-kaufen.html` [Medium — Content/Legal]
This article contains at least one `rel="sponsored"` affiliate link but no `.affiliate-hinweis` banner — the site's own stated policy requires one. Low-effort fix with legal/trust implications, so do it this week.

Copy the standard `.affiliate-hinweis` block from any other article file and insert it in the same relative position (after the article header/hero, before the first `<h2>`).

---

### 1.5 Re-run GSC URL Inspection batch [Medium — Google]
The prior run captured 17/30 URLs before being interrupted. Re-run to completion to get current indexation status for all 30 sitemap URLs:

```bash
cd /Users/bnazarov/coding/kleinkind-welt/claude-seo
python3 scripts/gsc_inspect.py --batch <sitemap_urls.txt> --site-url sc-domain:kleinkind-welt.de --json
```

This will confirm which of the 3 hub pages and remaining articles are indexed vs. discovered-not-indexed, and whether the Indexing API requests submitted earlier have resolved.

---

## Phase 2: High-Impact Improvements — Weeks 2-3

### 2.1 Add `Product`/`Review`/`AggregateRating` schema to comparison articles [High — Schema]
Start with the top 3 highest-traffic articles (motorikspielzeug-test, spielzeug-unter-20-euro, duplo-vergleich) and add one `Product` JSON-LD block per top-ranked item, nested with `aggregateRating` and `review` authored by Boris (`@id: https://kleinkind-welt.de/ueber-uns#boris`). See exact example markup in `findings/schema.md` Finding 1. Roll out to all comparison articles after confirming no Google Search Console schema errors on the initial 3.

---

### 2.2 Add above-fold compact CTA to commercial article pages [High — Visual/SXO]
On `spielzeug-unter-20-euro.html`, `geschenke-2-jahre.html`, and the other money pages: add a compact "Top-Empfehlung: [Product] — Preis prüfen →" strip immediately below the H1/dek (but before the full Kurzantwort block), so a scanning mobile user sees a buy-path within the first viewport. Roughly 1 line of HTML + existing button class. This repeats a finding from the prior (2026-06-17) audit that still hasn't been actioned — high CRO priority.

---

### 2.3 Add comparison table to `spielzeug-unter-20-euro.html` and `geschenke-2-jahre.html` [Medium — SXO]
Both commercial articles rank on page 2 with double-digit impressions but zero clicks — a scannable side-by-side table near the top (Produkt | Alter | Preis | Stärke | Link) would serve both the deliberate-researcher and quick-mobile-scan personas that current prose product boxes don't. The hub page already uses a `budget-table`/`kaufhilfe-table` class that works well — replicate the pattern here.

---

### 2.4 Re-export `autor-boris.webp` at display resolution [Medium — Performance]
Currently served at full-res (27 KB), displayed at 40×40px (99% wasted). Re-export at 80×80px for 2x density — result should be 1-2 KB. Sitewide improvement on every article page.

---

### 2.5 Strengthen internal linking to quick-win ranking pages [Medium — Google]
Both `/artikel/nachhaltiges-spielzeug-siegel` (position 17.8, 12 impressions) and `/artikel/spielzeug-12-18-monate` (position 14.6, 10 impressions) are just off page 1 with zero clicks — the same link-boost tactic applied to `spielzeug-unter-20-euro` earlier. Find 3-5 existing articles that mention sustainability/eco-labels or 12-18-month development and add an anchor link to these two pages.

---

### 2.6 Fix sitemap `lastmod` accuracy [Medium — Sitemap]
Currently hand-maintained and already 1+ days stale. Options (easiest first):
- (a) Small deploy script reading `git log -1 --format=%aI -- <file>` per URL, run before `git push`.
- (b) Add a checklist step to the publishing workflow: "update sitemap.xml lastmod for every file touched in this commit."

Also: optionally strip `<priority>` and `<changefreq>` tags (Google ignores both — reduces file complexity and maintenance burden).

---

### 2.7 Add `SpeakableSpecification` to 2 missing articles [Low — GEO]
`reisespielzeug-kleinkind.html` and `spielzeug-balkon-kleinkind.html` are the only 2 of 23 articles without it. Copy-paste from any other article's Article JSON-LD block:
```json
"speakable": {
  "@type": "SpeakableSpecification",
  "cssSelector": [".kurzantwort-box", ".faq-item"]
}
```

---

### 2.8 Sync `llms.txt` with sitemap [Low — GEO]
Diff the 30 sitemap URLs against the 27 `llms.txt` entries, add the 3 missing pages, and set up a CI/checklist reminder to keep them in sync on every content deploy (or bump `last-updated` automatically).

---

## Phase 3: Content & Authority — Month 2

### 3.1 Build `/sicheres-spielzeug/` and `/entwicklung-spielzeug/` hub pages [High — Clustering]
Five existing authority articles (Montessori, Holzspielzeug vs. Plastik, Nachhaltige Siegel, Was wir nicht kaufen, Motorikspielzeug-Test, Sprache fördern) have no parent hub. These pages are already planned in the internal `docs/seo-plan-2026-06-29/SITE-STRUCTURE.md`. Build the two hubs with:
- `ItemList` schema (linking all relevant spokes)
- `CollectionPage` type
- Short 150-200 word intro explaining the cluster's scope
- Bidirectional links from every spoke article to its new hub (add "Das gehört zu → [hub]" contextual sentence or a breadcrumb amendment)
- Add both hubs to main nav or footer

---

### 3.2 Expand short Kurzantwort boxes to 134-167 words [Medium — GEO]
Priority: `spielzeug-balkon-kleinkind.html` (55 words, severely under) → `outdoor-spielzeug-kleinkind.html` (80 words) → remaining articles clustered at 109-128 words. Add one concrete, source-backed sentence (a stat, a named-source claim, or a specific age threshold) per box rather than padding with adjectives.

---

### 3.3 Reframe 2-3 H2s per comparison article into question form [Medium — GEO]
Especially on `duplo-vergleich.html`, `spielzeug-unter-20-euro.html`, `montessori-spielzeug-kleinkind.html`. Example: "Direkter Vergleich: Was wirklich entscheidet" → "Welches Bausystem ist das beste für Kleinkinder?". Pair with a one-sentence direct answer immediately below each question H2. Test on 2-3 articles first.

---

### 3.4 Simplify homepage to single dominant CTA + top 3 situational tiles [High — SXO]
The homepage has 9+ competing entry points above the fold. Restructure: hero with single CTA → age-quick-nav (condensed, 3-4 cards pointing to the hub) → 3 most relevant situational tiles → top 3 fresh articles → anything else. Move the long editorial essay ("Was macht eine gute Empfehlung aus?") to a linked "about our method" anchor/page; it substantially overlaps `bewertungsmethode.html` already.

---

### 3.5 Differentiate age-guide vs. gift-guide content at the 2/3-year marks [Medium — Clustering]
Audit `spielzeug-2-jahre`/`geschenke-2-jahre` and `spielzeug-3-jahre`/`geschenke-3-jahre` pairs for product overlap (target: max 40%). Age guides should lead with developmental milestones and "what to look for"; gift guides should lead with budget/occasion framing and "what grandparents should avoid." Add on-page disambiguation text ("Wenn du nach Spielzeug schaust, nicht nur Geschenken → Spielzeug für 2-Jährige").

---

### 3.6 Add grandparent/relative callout to `geschenke-2-jahre.html` [Medium — SXO]
The "uncertain gift-giver" persona (grandparent/relative who doesn't know the child) is a large segment of gift-query traffic the current page assumes away. Add a short "Du kennst das Kind nicht so gut? So gehst du sicher:" callout near the top linking to the Geschenk-Finder tool and to `was-wir-nicht-kaufen.html`.

---

### 3.7 Stop bulk-updating `dateModified` timestamps [Medium — Content]
18 of 23 articles share an identical timestamp from a sitewide batch update on 2026-06-26. This looks like manufactured freshness — reset the practice so `dateModified` only updates when an article's substantive content actually changes (new product, fact correction, new section), not when CSS or template files change.

---

### 3.8 Vary the templated "So wählst du aus" section [Low — Content]
Rewrite the 6-step checklist per article with age-specific examples rather than just swapping the age placeholder. Prioritize the 0-6 and 6-12 Monate articles (developmental framing differs most from older ages). Even light rephrasing removes the literal-match duplication.

---

### 3.9 Start link-building outreach — German parenting blogs [Medium-High effort — Backlinks]
No discoverable backlinks yet. At current traffic stage, even a small number of real external links accelerates GSC discovery and crawl frequency for new pages. Recommended zero-budget tactics in priority order:
1. Pitch 5-10 small/mid German parenting blogs (Eltern/Kleinkind Nische) for a genuine guest article or source contribution.
2. Search for German "Spielzeug-Empfehlungen" or "Tipps für Kleinkinder" roundup posts and request inclusion.
3. Participate authentically in r/Elternsein or r/Mamastube over time (not as link-drops — as genuine contributions, which can organically earn links later).
4. Pursue journalist/source requests via HARO-equivalent for DACH (Qeryz, Twitter/X parenting journalist hashtags) for high-authority media mentions.

Do **not** purchase links or use link exchanges — the absence of an existing link profile means any manipulative pattern is disproportionately risky.

---

### 3.10 Add expert reviewer credit on safety-heavy articles [Info — Content]
On `spielzeug-0-6-monate.html`, `was-wir-nicht-kaufen.html`, `nachhaltiges-spielzeug-siegel.html`: add "fachlich geprüft von [Name], [credential]" if a credentialed reviewer (Frühpädagoge, Montessori-certified consultant, pediatrician) can be found even informally, e.g., a parent friend. Meaningfully lifts the Expertise E-E-A-T sub-score for the exact pages where users most value clinical/safety authority.

---

## Phase 4: Monitoring & Iteration — Ongoing

### 4.1 Post-deploy smoke test for redirect integrity
Add a script/CI step that curls every `_redirects` source pattern's sample URLs and asserts expected status codes after each Netlify deploy. Even a 10-line bash loop checking the critical `/artikel/*.html` paths would have caught the current Critical finding immediately.

### 4.2 Backlink monitoring re-check (every 2-3 months)
Re-run `commoncrawl_graph.py kleinkind-welt.de --update --json` each time a new CC release is published. When/if a Moz API free-tier key is added, re-run the backlinks audit for real DA/spam baselines before and after any outreach campaign.

### 4.3 CrUX eligibility monitoring
Re-run `python3 scripts/crux_history.py kleinkind-welt.de` periodically — once the origin qualifies (roughly low thousands of qualifying Chrome sessions/28 days), field data becomes authoritative over the lab data in this report and all lab-data findings should be re-validated.

### 4.4 GSC position monitoring for the three quick-win pages
Track `spielzeug-unter-20-euro`, `nachhaltiges-spielzeug-siegel`, and `spielzeug-12-18-monate` weekly in GSC. Target: positions 1-10 within 4-8 weeks of the Phase 2 internal-link push. If not moving, check for on-page title/meta CTR issues (neither page's title was flagged, but that's the next lever once position improves).

### 4.5 YouTube / Reddit / Wikipedia brand-presence initiative
The GEO audit's single highest-leverage gap: YouTube mention correlation with AI citation ~0.737. Long-term (6-12 month horizon): publish 3-5 short YouTube videos (unboxing/safety-check walkthroughs), participate authentically in German parenting subreddits, and pursue inclusion as a citation on 1-2 relevant German Wikipedia articles where genuinely additive. Not a quick fix, but the single biggest lever for AI Overviews/LLM citation growth once the rest of this plan is complete.

### 4.6 Nav touch-target pass (desktop/tablet)
Nav links measure only 18px tall on desktop/tablet — below the 44px touch-target guideline. Increase CSS padding on nav `<a>` elements to reach 44px tappable height. Not an SEO issue (mobile nav is fine), but a UX improvement for touch-laptop users; low-effort one-time CSS change.

---

## Summary Table

| Phase | Item | Severity | Effort | Impact |
|---|---|---|---|---|
| 1 | Delete 23 /artikel/*.html files | Critical | Low | High |
| 1 | Fix homepage outdoor-spielzeug-kleinkind WebP | High | Low | High |
| 1 | Add responsive srcset to geschenke-2-jahre hero | High | Low | High |
| 1 | Add affiliate disclosure to was-wir-nicht-kaufen | Medium | Minimal | Trust/Legal |
| 1 | Re-run GSC URL Inspection batch | Medium | Low | Data |
| 2 | Product/Review schema on comparison articles | High | Medium | Schema/AI |
| 2 | Add above-fold CTA to money pages | High | Low | CRO |
| 2 | Add comparison tables to money pages | Medium | Medium | SXO |
| 2 | Re-export autor-boris.webp at display size | Medium | Low | Performance |
| 2 | Internal links → nachhaltiges & 12-18-monate | Medium | Low | Rankings |
| 2 | Fix sitemap lastmod automation | Medium | Low | Signals |
| 2 | Add SpeakableSpecification to 2 articles | Low | Minimal | GEO |
| 2 | Sync llms.txt with sitemap | Low | Minimal | GEO |
| 3 | Build /sicheres-spielzeug/ + /entwicklung/ hubs | High | Medium | Clustering |
| 3 | Expand Kurzantwort boxes to 134-167 words | Medium | Medium | GEO |
| 3 | Reframe H2s to question form (2-3 per article) | Medium | Low | GEO |
| 3 | Simplify homepage CTA structure | High | Medium | SXO |
| 3 | Differentiate age vs. gift content | Medium | Medium | Clustering |
| 3 | Add grandparent callout to geschenke-2-jahre | Medium | Low | SXO |
| 3 | Stop bulk-updating dateModified | Medium | Policy | Trust |
| 3 | Vary "So wählst du aus" section per article | Low | Low | Content |
| 3 | Start link-building outreach | Medium | High (ongoing) | Authority |
| 3 | Add expert reviewer credit | Info | Low-Medium | E-E-A-T |
| 4 | Post-deploy redirect smoke test | Medium | Low (setup) | Prevention |
| 4 | Backlink re-check every 2-3 months | Medium | Low | Data |
| 4 | CrUX eligibility monitoring | Info | Low | Data |
| 4 | GSC position tracking (3 quick-win pages) | Medium | Low | Rankings |
| 4 | YouTube/Reddit/Wikipedia brand presence | High | High (multi-month) | AI citations |
| 4 | Nav touch-target CSS fix | Low | Low | UX |
