# Technical SEO Audit — kleinkind-welt.de

Audit date: 2026-06-30 (live HTTP checks via curl + render_page.py against production)

## Score: 83 / 100

Strong foundation (clean SSR HTML, full security header set, healthy robots.txt/sitemap, valid structured data, CLS-safe images with WebP) pulled down primarily by one systemic indexability bug: 23 duplicate-content URLs live at `/artikel/*.html` that should be 301-redirecting to their clean-URL canonicals but instead return 200.

---

## What Works

- robots.txt is clean, explicitly allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, Google-Extended, anthropic-ai, Applebot-Extended, cohere-ai) with `Allow: /`, and correctly references the sitemap.
- sitemap.xml is reachable (200), well-formed, served as `application/xml`, contains exactly 30 URLs matching the spec, with sensible `lastmod`/`priority`/`changefreq`.
- Full modern security header set present site-wide via Netlify `_headers`: HSTS (`max-age=31536000; includeSubDomains; preload`), CSP, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy, Permissions-Policy.
- HTTPS is enforced: `http://` and `www.` both 301-redirect cleanly to the canonical `https://kleinkind-welt.de/` (single hop, no chain). No mixed-content (http://) resource references found on homepage.
- Canonical tags present and self-referential/correct on every page sampled (home, kaufhilfen, spielzeug-nach-alter, geschenke-kleinkind, saisonale-empfehlungen/sommer-spielzeug, 2x articles).
- Self-referencing hreflang (`de` + `x-default` → same URL) present on pages checked — valid and harmless for a single-language site, not an issue.
- No stray `noindex` found on any canonical content URL; `meta robots` absent (defaults to index,follow) or explicitly `index, follow` on homepage. `/freebies/*` correctly carries `X-Robots-Tag: noindex, nofollow` via `_headers`.
- Server-side rendered, no JavaScript dependency: `render_page.py --mode auto` returned `is_spa: false`, `mode_used: raw`, zero redirect chain, zero console errors on homepage — fully crawlable without a headless browser.
- Structured data present and parses cleanly: WebSite + Organization JSON-LD on homepage; Article + BreadcrumbList + ItemList + FAQPage JSON-LD on articles.
- Recently shipped WebP migration verified live: `<picture>` with `<source type="image/webp">` + JPG fallback, ~70% file-size reduction confirmed (WebP 107KB vs JPG 358KB on sampled hero image). All sampled `<img>` tags carry explicit `width`/`height` (12/12) — good CLS protection. Hero/LCP image correctly carries `fetchpriority="high"` and is NOT lazy-loaded (correct LCP optimization); only non-LCP chrome images (logo, avatar) lack `loading=`, which is low-impact since they're small and above-the-fold anyway.
- Renamed-article redirect (`holzspielzeug-kleinkind` → `holzspielzeug-vs-plastikspielzeug`) works correctly as a single 301 hop.
- Root-level legacy `.html` URLs (impressum, datenschutz, ueber-uns, bewertungsmethode, spielzeug-nach-alter, geschenke-kleinkind) correctly 301-redirect to clean URLs.
- IndexNow key file (`b1b3ada26d084bc2a00d4261e977f4e1.txt`) and Google/Bing verification files all resolve 200 live; `indexnow_submit.py` exists in tooling for protocol submission.
- Trailing-slash normalization works (`/artikel/.../` → 301 → clean non-slash URL).

---

## Findings

### 1. `/artikel/*.html` duplicate-content URLs return 200 instead of redirecting (23 URLs)
**Severity: Critical**

**Description:** The `_redirects` file contains the rule `/artikel/*.html /artikel/:splat 301!`, intended to redirect legacy `.html` article URLs to their clean equivalents. However, live testing shows this rule is not being honored for any of the sampled articles:

```
curl -sI https://kleinkind-welt.de/artikel/motorikspielzeug-test.html  → HTTP/2 200
curl -sI https://kleinkind-welt.de/artikel/spielzeug-12-18-monate.html → HTTP/2 200
curl -sI https://kleinkind-welt.de/artikel/geschenke-1-jahr.html       → HTTP/2 200
curl -sI https://kleinkind-welt.de/artikel/duplo-vergleich.html        → HTTP/2 200
```

Root cause: the `.html` files physically exist on disk in the repo (`/artikel/*.html`, confirmed via `ls`, all 23 articles have both a clean-URL-served version and a literal `.html` file present). Netlify's static-file resolution serves a file that exists at the exact requested path *before* evaluating wildcard redirect rules, so the `_redirects` wildcard rule never fires. This is a Netlify precedence quirk: exact-match redirect rules (used for the root-level `.html` files, e.g. `/impressum.html /impressum 301!`) win against existing static files when forced with `!`, but **wildcard** redirect rules lose to existing static files at that literal path. This is corroborated by the fact that root-level `.html` redirects (which use exact-match rules, not wildcards) all work correctly (301), while every `/artikel/*.html` request (wildcard rule) returns 200.

Each duplicate `.html` page does carry a correct self-referencing-to-clean-URL `<link rel="canonical">` tag (verified byte-identical content between clean and `.html` versions, both pointing canonical to the clean URL), which mitigates — but does not eliminate — the risk: these 23 URLs are still independently crawlable, consume crawl budget, are not currently disallowed in robots.txt or sitemap (good, they're correctly absent from the sitemap), and could still be discovered/indexed as near-duplicates via internal/external links or old backlinks, diluting authority signals and contributing to the exact "Discovered/Crawled - not indexed" pattern noted in GSC history if Google chooses to crawl them instead of prioritizing the canonical.

**Recommendation:**
1. Delete the 23 physical `.html` files from `/artikel/` in the repo (and from root, if any equivalent stray duplicates exist) — Netlify will then fall through to the wildcard `_redirects` rule and correctly 301 these paths.
2. Alternatively, if the `.html` files must remain on disk for some build reason, add explicit per-URL exact-match redirect rules (like the root-level pattern) instead of relying on the wildcard, since exact-match rules with `!` correctly override existing static files on Netlify.
3. After fixing, re-verify all 23 with curl, then check Google Search Console's "Duplicate without user-selected canonical" / crawl stats reports for any of these `.html` paths and request validation if any are indexed.
4. Audit Netlify deploy output to confirm `.html` files aren't being auto-generated by a build step that isn't visible in this static-only repo (e.g., editor save habit, leftover from a migration). If solo operator is manually duplicating files when creating articles, document/fix the workflow to prevent recurrence.

---

### 2. No automated regression test for `_redirects` wildcard-vs-static-file precedence
**Severity: Medium**

**Description:** The duplicate-URL issue in Finding 1 likely persisted unnoticed because there is no live HTTP status check in CI/CD that would have caught a 200 where a 301 was expected. Given this is a solo-operator project with no build system, redirect rule correctness depends entirely on manual verification.

**Recommendation:** Add a lightweight post-deploy smoke test (e.g., a script in `claude-seo/scripts/` or a GitHub Action step) that curls every `_redirects` source pattern's resolved sample URLs and asserts the expected status code, run after each Netlify deploy. Even a 10-line bash loop checking the 23 known `/artikel/*.html` paths plus root-level legacy paths would have caught this immediately.

---

### 3. Single fixed-resolution image, no responsive `srcset`/`sizes` breakpoints
**Severity: Low**

**Description:** The WebP migration ships one fixed-resolution image (e.g., `1600x893` source) per `<picture>` element via `srcset` with a single URL, rather than a responsive `srcset` with multiple widths + a `sizes` attribute. Mobile users on narrow viewports download the same byte size as desktop users, even though WebP compression already reduces absolute payload significantly (~107KB observed vs ~358KB JPG fallback on the sampled hero image).

**Recommendation:** Not urgent given the already-strong WebP savings, but for further LCP improvement on mobile (majority of affiliate/toddler-product traffic is likely mobile), consider generating 2–3 width variants (e.g., 800w, 1200w, 1600w) per hero/content image and adding `sizes="(max-width: 600px) 100vw, 800px"` style breakpoints. Low priority relative to Finding 1.

---

### 4. Minor: chrome images (logo, author avatar) lack explicit `loading` attribute
**Severity: Low**

**Description:** Of 12 sampled `<img>` tags on an article page, 4 lack a `loading` attribute (logo SVGs, author avatar). All 4 are small, above-the-fold, non-LCP images, so the absence of `loading="eager"` (default browser behavior is effectively eager unless `loading="lazy"` is set) is not currently causing harm — but it's inconsistent with the otherwise careful `fetchpriority="high"` treatment of the genuine LCP image.

**Recommendation:** Cosmetic/consistency fix only — explicitly set `loading="eager"` on these small chrome assets for clarity and to make future audits unambiguous. No measurable CWV impact expected.

---

## Gaps / Not Fully Verified

Investigation was cut short before full completion. The following were not verified and should be checked in a follow-up pass:

- **Live Core Web Vitals field/lab data**: No PageSpeed Insights / CrUX API call was made (only static HTML source inspection for CWV *risk signals*, e.g. image dimensions, fetchpriority, render-blocking resources). Actual LCP/INP/CLS millisecond/score values are unconfirmed.
- **Render-blocking resources**: Only the homepage `<head>` was checked for blocking `<link rel="stylesheet">`/`<script>` tags (found one render-blocking stylesheet `/css/style.css` with no `media` attribute or preload — not yet flagged as a finding pending confirmation of file size/impact, and not checked on other templates).
- **Full 30-URL sweep**: Only ~10 of the 30 sitemap URLs were spot-checked directly (homepage, kaufhilfen, spielzeug-nach-alter, geschenke-kleinkind, sommer-spielzeug, and ~4–5 articles). The remaining ~20 articles were not individually curled for status/canonical/meta-robots, though the `/artikel/*.html` duplicate issue (Finding 1) was confirmed systemic across all 4 articles sampled and is presumed to affect all 23 based on identical file-system evidence (`ls` confirmed all 23 `.html` files physically present).
- **robots.txt / sitemap accessibility for non-Google bots**: Confirmed live robots.txt content matches local repo and is reachable, but did not test actual crawl behavior or fetch logs for the named AI crawlers.
- **IndexNow protocol submission**: Confirmed the key file is live and the submission script exists, but did not verify whether IndexNow has actually been triggered/submitted recently (e.g., after the WebP deploy or sitemap resubmission).
- **Mobile touch-target sizing / tap-target spacing**: Not assessed beyond viewport meta tag presence; no rendered-screenshot or computed-style check was performed for touch target sizes.
- **www subdomain handling beyond redirect**: Confirmed `www.` → apex 301 works; did not check whether `www.` has its own separate canonical/cert issues or check sitemap URLs for the `www` variant being correctly excluded.
