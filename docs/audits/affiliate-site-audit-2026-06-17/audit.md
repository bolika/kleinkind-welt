# Affiliate Site Audit - Kleinkind-Welt.de

Date: 2026-06-17  
Site age: approx. 6 days live  
Primary business goal: product purchases via affiliate links  
Trackable proxy goal: outbound clicks, especially Amazon/product CTA clicks

## Evidence Used

- Live homepage: `https://kleinkind-welt.de/`
- Live article samples:
  - `https://kleinkind-welt.de/artikel/spielzeug-12-18-monate`
  - `https://kleinkind-welt.de/artikel/motorikspielzeug-test`
  - `https://kleinkind-welt.de/artikel/spielzeug-unter-20-euro`
- Technical files checked:
  - `robots.txt`
  - `sitemap.xml`
  - `llms.txt`
  - local article templates and CSS
- Screenshots captured:
  - `01-home-desktop.png`
  - `02-home-mobile.png`
  - `03-article-mobile.png`

## Executive Rating

Overall score: 76 / 100

Short version: The site already feels warmer, clearer and more trustworthy than a typical thin affiliate site. The new homepage direction is a good fit for parents: calm, friendly, not too salesy. The strongest risks are not the brand look anymore. The highest priority issues are measurement, commercial page consistency, unresolved product/search links, early indexing, and a few mobile conversion details.

Target audience perception: 8.0 / 10

Parents will likely read the site as:

- sympathetic and approachable
- more editorial than aggressively affiliate-driven
- useful for quick orientation by age and situation
- still young and slightly inconsistent in deeper pages

To reach 10 / 10, the site needs stronger visible author credibility, fully consistent article modules, fewer generic Amazon/search links, and more "why this product, for this exact child/situation" near every CTA.

## Score Overview

| Area | Score |
|---|---:|
| SEO | 72 / 100 |
| LLM readability | 84 / 100 |
| UX + UI | 78 / 100 |
| CRO | 67 / 100 |
| Design | 82 / 100 |

## SEO Audit - 72 / 100

| Criterion | Score | What works | To reach full score |
|---|---:|---|---|
| Technical indexability | 8.5 / 10 | Sitemap, robots, canonicals, clean static HTML, extensionless canonical URLs, live pages accessible. | Update `lastmod` after every content/design deployment; run regular broken-link checks; add redirects/canonical checks for `.html` vs extensionless URLs. |
| On-page keyword alignment | 7.5 / 10 | Strong intent pages by age, gifts, budget, and development topic. Titles are clear and German search-friendly. | Create a keyword map so each article owns one primary query and 3-5 secondary queries; reduce overlapping page intent between age pages and gift pages. |
| Content helpfulness | 8 / 10 | Articles answer real parent questions and include "Kurzantwort", product reasoning, pros/cons, and avoid-recommendations. | Add more first-hand or clearly sourced proof: real parent observations, product photos, use-case notes, date of last review, and "not ideal if" near each product. |
| E-E-A-T / trust | 7 / 10 | About page, Bewertungsmethode, author line, affiliate disclosures and sources exist. | Make author identity more concrete on every article; add reviewed/updated dates consistently; link methodology closer to rating/star sections and top CTAs. |
| Structured data | 7 / 10 | Several sampled pages have Article, FAQPage, BreadcrumbList or ItemList schema. | Roll Article + Breadcrumb + FAQ + ItemList consistently to all commercial articles; add `dateModified` everywhere; validate in Rich Results/Test tooling. |
| Internal linking | 7 / 10 | Homepage gives clear entry routes by age, situation and current topics. Some article footers have related links. | Add a standard "Next best article" and "Related by age/situation" block to every article, especially before footer. |
| Indexing/authority stage | 3 / 10 | Site is live and crawlable. | For a 6-day-old domain, this is expected. Submit sitemap in Google Search Console and Bing Webmaster Tools; request indexing for top money pages; build initial topical backlinks and citations. |

SEO priority note: The site is too young to judge ranking performance fairly. For the next 2-4 weeks, the goal is crawl/index stability, clean topical clusters, and avoiding weak affiliate signals.

## LLM Readability Audit - 84 / 100

| Criterion | Score | What works | To reach full score |
|---|---:|---|---|
| `llms.txt` | 9 / 10 | Strong, structured, category-based and useful for AI crawlers. | Rename remaining "Test" phrasing in LLM-facing labels where the positioning is really recommendation-based. |
| AI crawler access | 9 / 10 | `robots.txt` explicitly allows major bots and references sitemap. | Decide strategically whether training bots like GPTBot should stay allowed; if yes, keep. If not, separate search/index bots from training bots. |
| Answer-first article structure | 9 / 10 | "Kurzantwort" boxes are excellent for AI snippets and quick user understanding. | Keep answer boxes concise and non-promotional; add 1-sentence conclusion at the end of all long guides. |
| Semantic clarity | 8 / 10 | H1/H2 structure, FAQ sections and product sections are readable. | Standardize headings across all articles: problem, quick answer, recommendation, comparison, safety, FAQ. |
| Entity clarity | 7 / 10 | Brand and author exist, but some pages still use organization author while others use person author. | Use one consistent author entity with `Person`, `sameAs` or clear about-page anchor, and publisher Organization. |
| Product extraction | 7 / 10 | Product names and CTAs are readable in HTML. | Add machine-readable product/item lists where no Product schema is used; keep product names consistent between top box, table and product section. |

LLM priority note: The site is already ahead of many affiliate sites because of `llms.txt` and answer-first structure. The next leap is consistency and entity clarity.

## UX + UI Audit - 78 / 100

| Criterion | Score | What works | To reach full score |
|---|---:|---|---|
| Homepage first viewport, desktop | 8.5 / 10 | Warm hero, good headline, clear primary CTA, trust bar visible. Looks sympathetic and professional. | Cookie banner takes a lot of visual weight on first visit; consider a slimmer banner or smaller mobile-first treatment. |
| Homepage first viewport, mobile | 7.5 / 10 | Compact image + headline + CTA works better than a forced desktop hero. Good editorial feel. | The trust bar starts with only one visible icon and the cookie banner blocks lower content. Consider reducing vertical space or moving trust proof closer to CTA. |
| Navigation | 7.5 / 10 | Simple top nav, age route is clear, mobile burger exists on sampled pages. | Add active/current state; consider a persistent "Nach Alter" entry as the main user path; test all old pages for burger behavior after deployment. |
| Article readability | 7.5 / 10 | Strong typography, clear sections, useful quick answer and author line. | In mobile article screenshot, text appears clipped or horizontally constrained. Confirm in real mobile/browser and fix any overflow immediately. |
| Decision support | 8 / 10 | "Kurz entschieden" boxes are much better now: one recommendation, alternatives, avoid case. | Add direct links/buttons for secondary alternatives where commercially relevant; make "avoid" copy grammatically consistent. |
| Trust communication | 8 / 10 | Trust bar wording is calm and differentiated. Affiliate notice is visible without screaming. | Use a real author photo or stronger author micro-bio in high-intent pages; parents need a human face when buying for children. |
| Accessibility-visible risks | 6.5 / 10 | Good contrast in most core text; clickable elements are large enough. | Emoji/icon reliance should have accessible labels where meaning matters; cookie banner focus/order still needs keyboard testing; hover-only affordances should not carry essential information. |

UX priority note: The homepage now sends the right message. The bigger UX risk is the commercial article path on mobile, because most affiliate clicks will likely happen there.

## CRO Audit - 67 / 100

| Criterion | Score | What works | To reach full score |
|---|---:|---|---|
| CTA visibility | 7.5 / 10 | Homepage has a clear CTA. Commercial articles have top purchase boxes and multiple product CTAs. | Ensure the first commercial CTA appears before users need to scroll too far on mobile; use one primary action label consistently. |
| Product-intent matching | 7 / 10 | Many recommendations match article intent well, e.g. age-specific toys and budget picks. | Replace remaining Amazon search URLs and generic product links with specific recommended products or neutral "alternatives" sections. |
| Measurement quality | 5 / 10 | Plausible is installed with outbound link tracking. Some Kaufbox custom events exist. | Create a complete outbound click event taxonomy: article, product, CTA type, position, destination. Track all Amazon buttons, not only Kaufbox links. |
| Click prioritization | 6 / 10 | Top recommendation blocks exist. | Prioritize top money pages by expected commercial intent, not by content volume. Make the highest-value recommendation impossible to miss but still editorially honest. |
| Funnel continuity | 6.5 / 10 | Internal links move users between related pages. | Add "not sure?" pathways: age finder, budget finder, gift finder, small apartment, no plastic, language/motor skills. |
| Trust before click | 7 / 10 | Affiliate notice, method and "not ideal if" reduce suspicion. | Put a tiny method link near rating stars and top product CTA. Add "why this product wins here" in one scannable line. |
| Commercial friction | 5.5 / 10 | Buttons are clear. | Remaining search URLs, missing shortlinks and inconsistent button labels lower confidence and make outbound click analysis noisier. |

CRO priority note: You cannot optimize purchases directly yet, so outbound clicks must become the control panel. Right now you can see some outbound activity, but not enough to learn which product, article and placement actually produces value.

## Design Audit - 82 / 100

| Criterion | Score | What works | To reach full score |
|---|---:|---|---|
| Brand fit | 8.5 / 10 | Warm, parent-friendly, calm and credible. The new logo fits the color world well. | Make the tagline readable everywhere or hide it at very small sizes; avoid relying on tiny logo text for the value prop. |
| Color system | 8.5 / 10 | Teal + coral + warm neutrals fit the topic and avoid looking like a cold comparison portal. | Watch the amount of beige/cream so pages do not become too soft; use coral only for real actions. |
| Homepage hero | 8.5 / 10 | The current realistic image works: authentic, quiet, not stocky, good whitespace on desktop. | On mobile, keep the image small and functional; the value is the decision path, not a large photo. |
| Component consistency | 7 / 10 | Kaufbox, Kurzantwort, Quellenbox and product boxes are moving toward a system. | Finish rollout across all articles; remove old inline styles; standardize button hierarchy and card spacing. |
| Product visuals | 6.5 / 10 | Product image placeholders/hidden images avoid messy Amazon thumbnails. | Long term, use own or compliant editorial product imagery where possible; product-less boxes can feel abstract on commercial pages. |
| Perceived professionalism | 8 / 10 | Site does not feel like a spam affiliate page. It feels editorial and parent-led. | Reduce visual inconsistencies in older articles and make author/method evidence more concrete. |

Design priority note: The design is good enough to support trust. The next design work should focus on conversion clarity and article consistency, not another brand redesign.

## Highest-Risk Findings

1. Measurement is not granular enough for the business goal.
   - Plausible outbound tracking is active, and some Kaufbox events exist.
   - But the site needs consistent product-level events across all outbound buttons.
   - Without that, you cannot confidently answer: which article, product and CTA position creates the most value?

2. Some product links still use Amazon search URLs or direct non-short URLs.
   - Search URLs are weaker for conversion and harder to interpret.
   - They also make the site feel less curated.
   - Examples found locally include `spielzeug-3-jahre`, `spielzeug-18-24-monate`, `spielzeug-0-6-monate`, `geschenke-zur-geburt`, `geschenke-2-jahre`, and `nachhaltiges-spielzeug-siegel`.

3. Mobile article experience needs one more hard QA pass.
   - The captured mobile article screenshot suggests potential right-side clipping or horizontal overflow in article hero text.
   - If this reproduces on a real phone, it is a P0 UX issue because it affects trust before the first CTA.

4. E-E-A-T is good but not yet strong enough for affiliate SEO.
   - The site explains its method, but older pages vary between Organization author and Person author.
   - Parents and Google both need clearer "who wrote this, why trust them, when updated, how selected" signals.

5. The site is only 6 days live.
   - Low search visibility is normal.
   - The priority is not panic-publishing more pages. It is making the core pages technically clean, internally linked, measurable and indexable.

## Action Plan By Priority

Priority is based on the main goal: more product purchases, using outbound clicks as the measurable proxy.

### P0 - Next 48 Hours

1. Implement a complete outbound click event taxonomy.
   - Track every Amazon/product CTA, not only Kaufbox links.
   - Properties:
     - `article`
     - `product`
     - `cta_type` (`kaufbox_primary`, `product_box`, `comparison_table`, `inline_link`, `footer_recommendation`)
     - `position` (`top`, `middle`, `bottom`)
     - `destination` (`amazon_short`, `amazon_search`, `internal`)
   - Success metric: every product click can be grouped by article, product and placement.

2. Replace remaining Amazon search URLs on commercial pages.
   - Prioritize pages closest to purchase intent:
     - gift pages
     - age recommendation pages
     - budget page
     - comparison pages
   - Search URLs should become either:
     - specific product shortlinks, or
     - clearly labelled "Alternativen ansehen" links.

3. Run a mobile QA pass on top 5 money pages.
   - Check 390px and real phone if possible.
   - Fix any horizontal clipping, oversized tables, cut-off headlines, hidden CTAs or cookie banner overlap.
   - Top pages to check first:
     - `motorikspielzeug-test`
     - `spielzeug-12-18-monate`
     - `geschenke-1-jahr`
     - `geschenke-2-jahre`
     - `spielzeug-unter-20-euro`

4. Submit and verify indexing.
   - Google Search Console: submit sitemap and request indexing for top money pages.
   - Bing Webmaster Tools: submit sitemap.
   - Check that canonical URLs are indexed as extensionless URLs.

5. Standardize commercial CTA labels.
   - Use:
     - Primary product: `Preis prüfen`
     - Product section: `Bei Amazon ansehen`
     - Alternatives: `Alternativen ansehen`
   - Avoid mixing too many labels because it makes measurement and user expectation weaker.

### P1 - Next 7 Days

6. Finish article standard rollout.
   - Every commercial article should have:
     - author line
     - Kurzantwort
     - Kaufbox where relevant
     - affiliate notice
     - method/source box
     - related articles
     - date modified
     - FAQ

7. Strengthen high-intent article top sections.
   - Before the table of contents, each money page should answer:
     - best overall product
     - best budget alternative
     - when not to buy it
     - why this recommendation fits the age/situation
   - This supports both users and LLM snippets.

8. Add article-level related pathways.
   - Example:
     - "Not sure about age? Start with 12-18 months."
     - "Small apartment? Choose compact motor skills toys."
     - "Gift under 20 EUR? See budget picks."
   - These reduce exits and route users to better commercial intent.

9. Standardize schema across the article set.
   - Use consistent Article + BreadcrumbList + FAQPage.
   - Use ItemList on comparison/recommendation pages.
   - Keep `dateModified` current.

10. Strengthen author and method signals.
   - Use `Person` author consistently where Boris is the named author.
   - Add a real author image or stronger author card on top commercial pages.
   - Add a short "How we selected" link near ratings and CTAs.

### P2 - Next 30 Days

11. Build topical authority clusters.
   - Cluster examples:
     - age-based toys
     - motor skills
     - language development
     - gifts by age/budget
     - sustainable/toxin-conscious toys
   - Each cluster needs one hub, supporting articles and internal links both ways.

12. Create original proof assets.
   - Examples:
     - own checklist PDF
     - toy rotation guide
     - "what we would not buy" framework
     - age-by-age decision matrix
   - These help SEO, LLM citations and brand trust.

13. Start CRO experiments once outbound baseline exists.
   - Test:
     - CTA label: `Preis prüfen` vs `Bei Amazon ansehen`
     - top Kaufbox layout
     - product table above/below quick answer
     - trust note near CTA
   - Do not A/B test before tracking is clean.

14. Create a custom OG/social image system.
   - Homepage OG image
   - article category image
   - gift guide image
   - recommendation/comparison image

15. Build first backlinks and mentions.
   - Parent blogs
   - local parenting resources
   - relevant forums where allowed
   - useful checklist/resource outreach

## KPI Setup

Primary proxy KPIs:

- total outbound clicks
- Amazon outbound clicks
- outbound click rate per article
- outbound click rate per CTA placement
- top product clicks by page
- percentage of clicks from top Kaufbox vs product boxes vs inline links

Secondary KPIs:

- indexed pages
- impressions and clicks in Search Console
- average position for top money keywords
- scroll depth on commercial pages
- homepage CTA click rate
- internal click rate to commercial articles

Minimum dashboard view:

| KPI | Why it matters |
|---|---|
| Outbound clicks by article | Shows which pages create affiliate value. |
| Outbound clicks by product | Shows which recommendations resonate. |
| Outbound clicks by CTA type | Shows which modules convert. |
| Homepage CTA clicks | Shows if the homepage routes users into commercial paths. |
| Internal clicks to money pages | Shows if editorial pages support revenue. |
| Search impressions by cluster | Shows if SEO clusters are starting to work. |

## Final Assessment

Kleinkind-Welt.de is already credible enough to start learning from real users. The brand, color world and homepage now fit the audience well: warm, practical, careful, parent-led.

The next phase should be less about visual taste and more about conversion instrumentation and consistency. Once outbound click tracking is clean, the site can be improved scientifically: which age page, product, CTA and recommendation framing actually moves parents toward a purchase.

Recommended next move: implement P0 measurement and link cleanup before adding many new articles.
