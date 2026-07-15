# Performance (Core Web Vitals) Audit — kleinkind-welt.de

Audit date: 2026-06-30
Method: Google PageSpeed Insights v5 (Lighthouse lab data, mobile + desktop), live HTTP checks against production. CrUX field data returned no result for all tested URLs ("insufficient Chrome traffic volume for eligibility") — expected for a low-traffic site; all findings below use PSI/Lighthouse lab metrics as the substitute, per audit instructions.

Pages tested:
- Homepage: `https://kleinkind-welt.de/`
- Article: `https://kleinkind-welt.de/artikel/spielzeug-unter-20-euro`
- Article: `https://kleinkind-welt.de/artikel/geschenke-2-jahre`
- Hub: `https://kleinkind-welt.de/spielzeug-nach-alter`

## Score

| Page | Mobile Perf | Desktop Perf |
|---|---|---|
| Homepage | 100 | 100 |
| /artikel/spielzeug-unter-20-euro | 97 | 100 |
| /artikel/geschenke-2-jahre | 96 | 100 |
| /spielzeug-nach-alter | 100 | 100 |

**Overall Performance score: 96/100** (lowest of the four tested pages; mobile is the binding constraint, desktop is perfect across the board). This essentially confirms the prior 2026-06-17 audit's 98-100 claim — the WebP migration did not regress scores and mobile LCP/CLS remain excellent — but it is not uniformly 98-100 post-deploy, and one significant asset-optimization gap was found that the "all images converted to WebP" claim does not fully hold up to (see Finding 1).

### Measured Core Web Vitals (Lighthouse lab data, mobile)

| Page | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---|---|---|---|
| Homepage | 0.9s | 1.7s | 0ms | 0 | 2.2s |
| spielzeug-unter-20-euro | 1.5s | 1.7s | 0ms | 0 | 4.3s |
| geschenke-2-jahre | 1.6s | **2.6s** | 0ms | 0 | 2.1s |
| spielzeug-nach-alter | 1.1s | 1.1s | 0ms | 0 | 1.3s |

Desktop LCP for all four pages is 0.4–0.6s (well within "Good"). All CLS values are 0 (perfect) across both form factors — confirms zero layout-shift risk. TBT is 0ms everywhere, meaning INP risk from long tasks is currently negligible on these pages (no field INP data available to cross-check at 75th percentile).

All mobile LCP values are within "Good" (≤2.5s) except **geschenke-2-jahre at 2.6s, which crosses into "Needs Improvement"** — directly traceable to its unoptimized hero image (Finding 2).

## What Works

- CLS is 0 across every tested page/device combination — all images carry explicit `width`/`height` attributes, no FOIT/FOUT risk because the site ships zero custom web fonts (confirmed: no `@font-face`, no Google Fonts `<link>`, no font preconnects in homepage `<head>` or in `css/style.css`). System font stack eliminates an entire class of CLS/LCP font-loading issues by design.
- TBT is 0ms on every page tested — JS execution and main-thread work are effectively non-issues. Site ships minimal JS (one ~3.3KB script: Plausible analytics).
- Plausible analytics is genuinely lightweight and non-blocking: ~4KB transfer, 1.3–5.3ms main-thread time across pages, loaded async. Not a CWV concern.
- Homepage and hub page (`spielzeug-nach-alter`) score 100/100 on both mobile and desktop with LCP at 1.1–1.7s mobile, 0.4s desktop.
- Homepage hero image uses a correctly implemented responsive `<picture>` with `fetchpriority="high"` and a matching `<link rel="preload" as="image" imagesrcset="...">` for 640w/1200w/1920w WebP variants — textbook LCP optimization.
- Server response time (TTFB) is excellent: 1–5ms "wastedMs" reported by PSI across all pages (Netlify Edge, cache-status: hit confirmed via curl).
- Total page weight is modest on most pages: spielzeug-unter-20-euro is only 105 KiB total; spielzeug-nach-alter 207 KiB; geschenke-2-jahre 261 KiB (image-heavy but not excessive).
- DOM size is healthy: 395 elements, depth 9 on homepage — well under the 1,500-element risk threshold.
- Only one render-blocking resource site-wide: `css/style.css` (~12.7KB, ~150-270ms wastedMs depending on page) — no render-blocking JS detected anywhere.

## Findings

### Finding 1: Homepage "Beliebte Artikel" image NOT converted to WebP — contradicts stated migration
**Severity: High**

**Description:** The homepage's `outdoor-spielzeug-kleinkind` thumbnail (displayed at only 298×210px in the "Beliebte Artikel" section) is still served as a bare `<img src="images/articles/outdoor-spielzeug-kleinkind.jpg">` with no `<picture>`/`<source type="image/webp">` wrapper and no `srcset`. Verified directly via `curl`:
```html
<img src="images/articles/outdoor-spielzeug-kleinkind.jpg" alt="Outdoor-Spielzeug für Kleinkinder im Sommer" loading="lazy" decoding="async" width="1200" height="800">
```
PSI flags this as the single largest image-delivery waste on the homepage: **631,758 bytes transferred, 618,589 bytes (97.9%) wasted** relative to its rendered size. Confirmed via `curl -I` that a WebP version already exists on the server at the same path (`outdoor-spielzeug-kleinkind.webp`, 271,328 bytes — still oversized for 298×210px display but 57% smaller than the JPG) — it simply isn't referenced in the homepage HTML. This means the "all images converted to WebP" claim is **not fully true post-deploy**; at least this one homepage reference was missed.

**Recommendation:** Wrap this `<img>` in `<picture><source type="image/webp" srcset="...">` matching the pattern already used correctly elsewhere on the same page (e.g., `spielzeug-6-12-monate` and `spielzeug-12-18-monate` cards), and generate a properly sized (~300-600px wide) responsive WebP srcset rather than serving a single 271KB full-size WebP. Expected impact: ~600KB+ reduction in homepage transfer weight, meaningfully improving mobile load on slower connections even though it didn't move this page's already-perfect 100 score (the image is below the fold / not the LCP element). Audit the rest of the site for other `<img>` tags missing the `<picture>` wrapper before declaring the WebP migration complete.

### Finding 2: geschenke-2-jahre hero image lacks responsive srcset — pushes mobile LCP to 2.6s ("Needs Improvement")
**Severity: High**

**Description:** Unlike the homepage hero and the hub-page card images, the `geschenke-2-jahre` article's hero image *is* correctly wrapped in `<picture><source type="image/webp">` and preloaded with `fetchpriority="high"` — the WebP conversion itself was done right here. However, the WebP source has only a single 1600px-wide variant with no `srcset`/responsive sizes:
```html
<link rel="preload" as="image" href="/images/articles/geschenke-2-jahre.webp" imagesrcset="/images/articles/geschenke-2-jahre.webp" fetchpriority="high" type="image/webp">
...
<picture>
  <source type="image/webp" srcset="/images/articles/geschenke-2-jahre.webp">
  <img src="/images/articles/geschenke-2-jahre.jpg" width="1600" height="893" fetchpriority="high">
```
PSI measures this single image at **207,126 bytes transferred with 192,769 bytes (93%) wasted** on mobile (a 1600px-wide image served to a ~400-430px viewport). This is the direct cause of this page's mobile LCP measuring **2.6s — the only tested page/metric combination crossing out of "Good" into "Needs Improvement."** Mobile performance score (96) is also the lowest of the four pages tested, consistent with this.

**Recommendation:** Generate width-specific WebP variants (e.g., 480w/768w/1200w/1600w, matching the pattern already used for card thumbnails like `spielzeug-12-18-monate-480.webp`/`-768.webp`) and add `srcset`/`sizes` to this hero's `<source>` element and matching `imagesrcset` to the preload `<link>`. Expected impact: mobile LCP should drop from 2.6s to roughly 1.5-1.8s (in line with the other article page tested), moving this page from "Needs Improvement" to solidly "Good," and recovering ~190KB of wasted transfer on mobile.

### Finding 3: Sitewide author avatar (`autor-boris.webp`) oversized for its display size
**Severity: Medium**

**Description:** The author byline avatar, displayed at 40×40px (`style="width:40px;height:40px;border-radius:50%;object-fit:cover"`), is served as a 27,038-byte WebP with PSI reporting 26,830 bytes (99%) wasted. This asset appears to be reused across most/all article pages (confirmed present on both `spielzeug-unter-20-euro` and `geschenke-2-jahre`), so the waste compounds sitewide on every article view even though it's not large enough on its own to move any LCP/CWV score.

**Recommendation:** Re-export `autor-boris.webp` at actual display resolution (e.g., 80×80px for 2x pixel density, which should be only a few KB) rather than a presumably full-resolution source photo. Low effort, sitewide benefit, frees up bandwidth/cost on every page load.

### Finding 4: Render-blocking CSS present on every page (minor)
**Severity: Low**

**Description:** `css/style.css` (~12.7-12.8KB depending on cache-busting query string) is render-blocking on all four tested pages, with PSI-estimated `wastedMs` of 54-266ms depending on page/network conditions. PSI also flags it as unminified, with ~2.77-2.79KB of recoverable savings via minification. This did not prevent any tested page from achieving Good LCP, so impact is currently limited, but it's the only render-blocking resource on the site and worth addressing as a low-cost win.

**Recommendation:** Minify `css/style.css` in the build/deploy pipeline (not hand-editing) for the ~22% size reduction PSI identifies. Consider inlining critical above-the-fold CSS and deferring the remainder, though given current LCP numbers are already in the "Good" range this is a lower priority than Findings 1-2.

### Finding 5: No CrUX (field) data available — lab data only
**Severity: Info**

**Description:** CrUX API returned no data for the origin and all four tested URLs ("insufficient Chrome traffic volume for eligibility"). This is expected and normal for a site at this traffic level, not an error condition. All scores and metrics in this report are Lighthouse lab data (single synthetic run per page/device), not real-user 75th-percentile field data.

**Recommendation:** No action needed now. Re-run `crux_history.py` / `pagespeed_check.py` periodically as traffic grows — once the origin qualifies for CrUX, field data should be treated as authoritative over lab data per Google's evaluation method, and lab scores in this report should be re-validated against it at that time.

## Gaps / Not Investigated

- INP cannot be measured directly via Lighthouse/PSI lab data (it requires real user interaction field data); TBT of 0ms across all pages is a reasonable proxy suggesting low INP risk, but this has not been confirmed against real-user CrUX data (see Finding 5).
- Only 4 of the site's pages were tested (homepage, 2 articles, 1 hub). Other article pages were not individually checked for the same `<picture>`-wrapper omission found in Finding 1; a sitewide grep for `<img src=".*\.jpg"` outside `<picture>` blocks is recommended as a follow-up to fully validate the "all images converted" claim.
- Did not test additional hub pages (`/saisonale-empfehlungen`, `/kaufhilfen.html`, `/geschenke-kleinkind.html`) or the `/freebies` section.
