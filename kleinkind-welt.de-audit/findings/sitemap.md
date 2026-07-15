# Sitemap Audit — kleinkind-welt.de

**Category:** Sitemap
**Audited:** 2026-06-30
**Source:** /Users/bnazarov/coding/kleinkind-welt/sitemap.xml (local, root of repo)

## Score: 86 / 100

---

## What Works

- **XML is well-formed.** Parses cleanly with no syntax errors (validated via `xml.dom.minidom`).
- **Zero orphan pages.** Every internal `href` found across all indexable HTML pages (homepage, hubs, 23 articles) resolves to a URL that is present in the sitemap. No crawlable page is missing from the sitemap.
- **Zero dead/stale URLs.** All 30 `<loc>` entries map 1:1 to existing `.html` files in the repo (artikel/, saisonale-empfehlungen/, root). No 404s, no orphaned sitemap entries.
- **Correctly excludes noindex pages.** `datenschutz.html`, `impressum.html`, `newsletter-bestaetigt.html`, `404.html`, and both `freebies/spielideen-kompass-12-18-monate*.html` (gated lead-magnet pages) all carry `<meta name="robots" content="noindex, nofollow">` and are correctly **omitted** from the sitemap. This is exactly right.
- **Canonical tags align with sitemap URLs.** Spot-checked 5 pages (homepage, both hubs, sommer-spielzeug, one article) — all canonicals match their sitemap `<loc>` exactly (no www/non-www, no trailing-slash, no .html mismatches).
- **`.html` extensions are stripped via 301s.** `_redirects` correctly forces `/artikel/*.html → /artikel/*` and same for root pages, so the clean URLs used in the sitemap are the canonical, final destination (no redirect chains for sitemap URLs).
- **Hub-and-spoke architecture is structurally sound and matches the sitemap.** All 23 spoke articles link back to both hub pages (`spielzeug-nach-alter`, `geschenke-kleinkind`) via breadcrumbs/contextual links (23/23 each), and each hub links forward to 7–9 relevant spokes. The sitemap correctly flattens this into one file with no nesting issues.
- **Well under the 50,000 URL/file limit** (30 URLs) — no need for a sitemap index at this scale.
- **robots.txt correctly references the sitemap** and allows all major crawlers including Googlebot.

---

## Findings

### 1. lastmod values are inaccurate / manually drifted (already stale 1 day after being set)
- **Severity:** Medium
- **Description:** Cross-referencing `sitemap.xml` lastmod dates against actual git commit history shows discrepancies. Example: `geschenke-kleinkind` and `saisonale-empfehlungen/sommer-spielzeug` are both listed with `<lastmod>2026-06-29</lastmod>`, but the most recent commit touching those files is dated 2026-06-30 ("Compact footer link layout"). Since the sitemap is hand-maintained (no build tool generates it), lastmod values will keep drifting out of sync every time a page is edited without a corresponding manual sitemap update. Google does use lastmod as a (weak) recrawl-priority signal — inaccurate dates reduce its usefulness and can look untrustworthy if Google detects mismatches against actual page content changes over time.
- **Recommendation:** Either (a) automate lastmod generation from each file's last-modified timestamp (e.g., a small script reading `git log -1 --format=%aI -- <file>` or filesystem mtime, run as part of deploy), or (b) if staying manual, add a deploy checklist step "update sitemap.xml lastmod" whenever a page's content changes. Given there's no build tool, a lightweight Node/Python script run via the existing `.github` workflow would fix this permanently.

### 2. priority and changefreq tags are present but ignored by Google
- **Severity:** Info
- **Description:** All 30 URLs use `<priority>` (range 0.6–1.0, 5 distinct values) and `<changefreq>` (weekly: 4, monthly: 26). Google has explicitly stated both tags are ignored for crawling/ranking decisions and have been for years. They add bytes to the file and a maintenance burden (someone has to decide what priority `0.9` vs `0.8` means) for zero ranking benefit. Bing also mostly ignores changefreq.
- **Recommendation:** Safe to remove both tags to simplify the file and reduce manual upkeep. Not urgent — no harm in leaving them, but no benefit either. If removed, re-validate XML after edit.

### 3. `kaufhilfen` is sitemap-included but architecturally ambiguous relative to the "3 hub" model
- **Severity:** Low
- **Description:** The brief frames the hub-and-spoke architecture as 3 hubs (spielzeug-nach-alter, geschenke-kleinkind, saisonale-empfehlungen/sommer-spielzeug) + spokes. However `kaufhilfen` is the single most internally-linked page in the entire site (20 inbound links found across templates/nav, more than any actual hub), suggesting it functions as a 4th de facto hub or pillar/buying-guide page, but it isn't integrated into the hub-and-spoke linking pattern the same way (it has no dedicated spoke cluster pointing back with breadcrumbs the way articles point to the 3 named hubs). This isn't a sitemap defect per se, but the sitemap doesn't reflect any distinction between true "hub" pages and this heavily-linked utility page — both get similarly weighted priority values.
- **Recommendation:** Not a sitemap fix — flag to content/IA workstream to clarify whether `kaufhilfen` should be formally absorbed into the hub-and-spoke model (with its own spokes) or treated as global navigation/utility. Once decided, sitemap priority values can be adjusted to reflect actual site hierarchy.

### 4. New hub pages not yet indexed — sitemap alone won't fix discovery speed
- **Severity:** Info
- **Description:** Per audit context, the 3 hub pages are "Discovered – not indexed" or "URL unknown to Google" in GSC despite being correctly present in the sitemap with accurate canonical tags. This is expected for brand-new pages and is not a sitemap defect — sitemap inclusion alone does not guarantee fast indexing, especially for pages discovered via sitemap rather than organic internal-link discovery/crawl budget allocation.
- **Recommendation:** No sitemap change needed. Confirm hub pages are linked prominently from high-authority pages (homepage, main nav) — already verified true for `spielzeug-nach-alter` and `geschenke-kleinkind` (4 and 5 links from index.html respectively). Continue monitoring GSC; indexing latency for new pages is normal and typically resolves within 1-4 weeks given correct technical signals (which are in place here).

### 5. No XML sitemap index needed at current scale — informational only
- **Severity:** Info
- **Description:** 30 URLs is far below the 50,000 URL/file limit, and the site has no location-page programmatic-content risk (0 matches for city/location-pattern URLs found). The Location Page Quality Gates (30+/50+ thresholds) do not apply to this site at all — there is no doorway-page risk pattern present in the sitemap.
- **Recommendation:** None required now. Re-run this check if/when the site adds any location-based, city-swapped, or other programmatically-generated page templates in bulk.

---

## Summary Table

| Check | Status |
|---|---|
| XML well-formed | Pass |
| URL count vs 50k limit | Pass (30 URLs) |
| Orphan pages (crawled, not in sitemap) | Pass — none found |
| Dead/404 URLs in sitemap | Pass — none found |
| Noindexed pages excluded | Pass |
| Canonical alignment | Pass |
| Redirect chains on sitemap URLs | Pass — none (clean URLs are final destination) |
| lastmod accuracy | Fail — drifted/stale vs git history |
| priority/changefreq | Present, ignored by Google (Info) |
| Hub-and-spoke structural support | Pass — full bidirectional linking confirmed |
| Location page quality gates | N/A — no location pages exist |
