# Schema / Structured Data Audit — kleinkind-welt.de

Sample audited: 15 pages directly inspected in full (index.html, kaufhilfen.html, spielzeug-nach-alter.html, geschenke-kleinkind.html, bewertungsmethode.html, saisonale-empfehlungen/sommer-spielzeug.html, and 9 articles: duplo-vergleich, spielzeug-12-18-monate, montessori-spielzeug-kleinkind, geschenke-1-jahr, motorikspielzeug-test, spielzeug-unter-20-euro, badespielzeug-kleinkind, holzspielzeug-vs-plastikspielzeug, was-wir-nicht-kaufen). All 23 articles in `artikel/` were additionally batch-checked for JSON-LD validity, FAQPage presence, and `dateModified`/`datePublished`/`@id` integrity via script. Local repo content was spot-confirmed against the live site (`https://kleinkind-welt.de/artikel/duplo-vergleich`, HTTP 200, server-rendered static HTML, not an SPA) — local files are an accurate source of truth.

## Score: 68 / 100

Solid, valid, consistent foundational schema (Article/BreadcrumbList/FAQPage/Organization/Person) with zero syntax errors across the whole sample — but a significant missed opportunity: the site's core content (ranked product comparisons, star ratings, "Testsieger" buy-boxes) is not modeled as Product/Offer/Review/AggregateRating anywhere, which limits both rich-result eligibility and AI/LLM entity grounding for the products being recommended.

## What Works

- **100% valid JSON-LD syntax**: All 15 pages directly parsed (and all 23 articles batch-checked) produced zero `json.loads()` errors. No malformed `@graph` blocks found.
- **Consistent `@id` reuse, no collisions**: `Organization` (`https://kleinkind-welt.de/#organization`) and author `Person` (`https://kleinkind-welt.de/ueber-uns#boris`) use the same stable `@id` across every article checked — correct practice for entity consolidation. No duplicate/conflicting `@id` values found across the 19 unique IDs in the sample.
- **Complete date hygiene**: All 23 articles have both `datePublished` and `dateModified` in valid ISO 8601 format (e.g. `2026-06-15T00:00:00+02:00`), and `dateModified` is never earlier than `datePublished`.
- **Canonical/mainEntityOfPage/Article.url alignment**: In every article spot-checked (duplo-vergleich, spielzeug-12-18-monate, was-wir-nicht-kaufen), the `<link rel="canonical">`, `mainEntityOfPage.@id`, and `Article.url` all match exactly — no broken cross-references.
- **FAQPage implemented site-wide with matching visible content**: All 23 articles include `FAQPage` with `mainEntity` Q&A that closely mirrors the visible `.faq-item` DOM blocks (spot-checked on duplo-vergleich: 4/4 questions matched almost verbatim).
- **Correct, modern context/format choices**: `https://schema.org` (not http), JSON-LD only (no competing Microdata/RDFa found), absolute URLs throughout, square 512×512 Organization logo (exceeds Google's 112×112 minimum).
- **No deprecated types used**: No HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, or LearningVideo anywhere in the sample.

## Findings

### 1. No Product/Offer/Review/AggregateRating schema despite review-style content site-wide
- **Severity:** High
- **Description:** Every article sampled contains visible star ratings (e.g. `★★★★★` in `.produkt-bewertung`/`.bewertung-sterne`), ranked comparison tables (`.vergleich-tabelle` with position, product name, "Bewertung" column), and "Testsieger"/buy-box blocks naming specific products (e.g. "LEGO DUPLO Classic Steinebox" in `artikel/duplo-vergleich.html`, line ~298-307) with affiliate links. None of this is represented in JSON-LD as `Product`, `Offer`, `Review`, or `AggregateRating`. The only structured representation is a generic `ItemList` of bare `name` strings with no `url`, `image`, `offers`, or `review` properties (e.g. `duplo-vergleich.html` lines 104-134: `ItemList` items have only `@type`, `position`, `name`).
- **Recommendation:** Add `Product` nodes (with nested `aggregateRating` and/or `review`) for the top-ranked items in each comparison, linked from the existing `ItemList`. Note Google currently restricts third-party/affiliate Review/Product rich results in many cases, but the markup still materially helps AI Overviews/LLM citation (GEO) by giving machine-readable entity + rating data. Example for the DUPLO article's top pick:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://kleinkind-welt.de/artikel/duplo-vergleich#product-duplo-classic",
  "name": "LEGO DUPLO Classic Steinebox",
  "brand": { "@type": "Brand", "name": "LEGO DUPLO" },
  "image": "https://kleinkind-welt.de/images/products/duplo-classic.jpg",
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    },
    "author": { "@id": "https://kleinkind-welt.de/ueber-uns#boris" }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "1",
    "bestRating": "5"
  }
}
```
Note: `reviewCount`/`ratingValue` must reflect genuine editorial assessment counts, not fabricated numbers — do not inflate `reviewCount` to imply multiple independent reviewers if there is only one author/methodology.

### 2. FAQPage has no Google SERP benefit but is correctly retained for AI visibility
- **Severity:** Info
- **Description:** All 23 articles implement `FAQPage` (e.g. `duplo-vergleich.html` lines 136-172). Per current Google policy, FAQ rich results were retired for all sites (May 7, 2026), so this markup produces no SERP feature anymore.
- **Recommendation:** No removal needed — the markup still aids AI/LLM citation and entity resolution (GEO value). Keep as-is. Do not invest further effort expanding FAQPage coverage for SEO purposes; any future Q&A-style pages should use `QAPage` only if they are genuine user-submitted Q&A (not applicable to current content).

### 3. Comparison-table `ItemList` items carry no `url` property (inconsistent with hub-page ItemLists)
- **Severity:** Medium
- **Description:** Hub pages like `kaufhilfen.html` correctly give each `ListItem` a `url` (e.g. `"url": "https://kleinkind-welt.de/kaufhilfen#fehlkauf-check"`). But the in-article comparison `ItemList` blocks (e.g. `duplo-vergleich.html` lines 104-134, and the same pattern repeated in `spielzeug-12-18-monate.html`, `geschenke-1-jahr.html`, `motorikspielzeug-test.html`, `spielzeug-unter-20-euro.html`, `badespielzeug-kleinkind.html`) only provide `position` and `name` — no `url`, `item`, or `image`. This makes the ItemList nodes thin and prevents Google/LLMs from resolving each list entry to a distinct, citable entity (especially relevant since these items are not separate URLs on the site — they are affiliate-linked products).
- **Recommendation:** Either (a) nest a minimal `Product` under each `ListItem.item` as shown in Finding 1, or at minimum (b) add the outbound affiliate `url` to each `ListItem` so the list items are not dead-ends:
```json
{ "@type": "ListItem", "position": 1, "name": "LEGO DUPLO Classic Steinebox", "url": "https://amzn.to/4vigSoi" }
```

### 4. No `Product`/comparison schema on `holzspielzeug-vs-plastikspielzeug.html` and `was-wir-nicht-kaufen.html` despite different structure
- **Severity:** Low
- **Description:** These two articles use `Article` + `BreadcrumbList` + `FAQPage` only (no `ItemList` at all), unlike the other 7 sampled articles. This is structurally appropriate for `was-wir-nicht-kaufen.html` (an editorial/opinion piece, not a comparison), but `holzspielzeug-vs-plastikspielzeug.html` is a head-to-head material comparison that could benefit from at least a `Claim`/`CompareAction`-style structured representation or, more practically, the same `Product` treatment as Finding 1 for the two materials/example products discussed.
- **Recommendation:** Low priority — only add Product schema here if/when Finding 1 is implemented site-wide, to maintain consistency across all comparison-style articles.

### 5. `WebSite`/`Organization` nodes (index.html) lack `SearchAction` and `Person` author-on-Organization link
- **Severity:** Info
- **Description:** `index.html`'s `WebSite` node (`https://kleinkind-welt.de/#website`) has no `potentialAction` (`SearchAction`) and the `Organization` node has no `sameAs` link to the author's `Person` entity or `founder` property, despite Boris being clearly positioned as founder/editor across the site (e.g. `jobTitle: "Gründer und Redakteur"` in `duplo-vergleich.html` line 42).
- **Recommendation:** Optional enhancement, not urgent (site has no on-site search to justify `SearchAction`). If desired, add `"founder": {"@id": "https://kleinkind-welt.de/ueber-uns#boris"}` to the `Organization` node to strengthen the entity graph for E-E-A-T signals.

## Notes on Audit Completeness

This audit is based on full inspection of 15 pages plus an automated batch check (JSON validity, FAQPage presence, date integrity, `@id` collisions) across all 23 articles in `artikel/`. It does not include: a line-by-line review of all 23 articles' full HTML bodies, the remaining root pages not listed above (404.html, datenschutz.html, impressum.html, newsletter-bestaetigt.html, ueber-uns.html), or live-rendered DOM comparison beyond one spot-check (duplo-vergleich, confirmed static/non-SPA, content matches local repo). No evidence of client-side schema injection was found or expected, since the site is a static Netlify deployment. These gaps are unlikely to change the overall score materially given the consistent patterns observed across the sample, but should be confirmed if a follow-up audit is performed.
