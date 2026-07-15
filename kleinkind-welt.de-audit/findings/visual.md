# Visual / Mobile Audit — kleinkind-welt.de

Date: 2026-06-30
Pages tested: Homepage (`/`), Hub page (`/spielzeug-nach-alter`), Article (`/artikel/spielzeug-unter-20-euro`)
Viewports tested: Desktop 1920x1080, Laptop 1366x768, Tablet 768x1024, Mobile 375x812 (iPhone)
Method: Playwright/Chromium screenshots + DOM measurements (scroll width vs. viewport width, H1/CTA bounding boxes, tap-target sizes, image natural vs. rendered dimensions, cookie-banner detection, console errors). Full-page mobile captures taken for layout review.

Screenshots saved to: `/Users/bnazarov/coding/kleinkind-welt/kleinkind-welt.de-audit/screenshots/`
- `home-desktop.png`, `home-laptop.png`, `home-tablet.png`, `home-mobile.png`, `home-mobile-fullpage.png`
- `hub-desktop.png`, `hub-laptop.png`, `hub-tablet.png`, `hub-mobile.png`, `hub-mobile-fullpage.png`
- `article-desktop.png`, `article-laptop.png`, `article-tablet.png`, `article-mobile.png`, `article-mobile-fullpage.png`

Raw measurement data: `/Users/bnazarov/coding/kleinkind-welt/kleinkind-welt.de-audit/findings/raw_metrics.json`

## Score: 78 / 100

## What Works

- No horizontal overflow detected at any tested breakpoint (375/768/1366/1920) on any of the three pages — `scrollWidth` equals `clientWidth` everywhere. The mobile text-clipping risk flagged in the 2026-06-17 baseline audit is **resolved**.
- Homepage above-the-fold on both desktop and mobile is strong: H1, supporting subhead, primary CTA ("Spielzeug nach Alter finden") and secondary CTA ("Aktuelle Empfehlungen") are all visible without scrolling, on both viewports.
- No cookie-consent banner intercepts the viewport on first load on any page/viewport tested (the prior audit's complaint about cookie banner visual weight no longer reproduces — likely consent-mode/no-banner implementation now, worth confirming this is intentional and GDPR-compliant elsewhere).
- Mobile nav uses a hamburger menu consistently across all three page types, positioned top-right, same position/behavior on every page.
- Most WebP-converted images render with correct, undistorted aspect ratio (rendered width/height ratio matches natural ratio) — e.g. hero image, age-hub thumbnails on the hub page, article hero image.
- Article page shows a clear, well-structured above-the-fold/near-top sequence: breadcrumb, hero image, metadata, H1, dek, author credibility block, and "Kurzantwort" answer box — strong trust-building sequence before the reader hits any sales content.
- Hub page above-the-fold (mobile) is clean and readable: category label, H1, intro copy, start of Kurzantwort box — no clutter or overlap.
- Zero browser console errors captured on any of the 12 page/viewport combinations.

## Findings

### 1. No purchase CTA (Kaufbox) visible above the fold on the article page (any viewport)
**Severity:** High
**Description:** On the representative money page (`spielzeug-unter-20-euro`), the first "Preis prüfen" buy-box CTA appears roughly 2,200–2,800px down the page on mobile (confirmed via full-page screenshot review) — well past breadcrumb, hero image, metadata, H1, dek, author box, and the full Kurzantwort text block. The same holds on desktop/laptop/tablet: the visible viewport only contains H1, dek, and the start of the author/Kurzantwort section. This matches what the 2026-06-17 audit already flagged as a CRO risk and it has not been addressed.
**Recommendation:** Add a compact, sticky or early-positioned mini-CTA (e.g., a condensed "Top-Empfehlung: Stapelbecher — Preis prüfen" strip directly under the H1/dek, before the full Kurzantwort text) so a scanning mobile user sees a path to a buy-box within the first viewport, without undermining the editorial-first structure that works well for trust.

### 2. Hub page has no visible navigational/commercial CTA above the fold
**Severity:** Medium
**Description:** The hub page (`/spielzeug-nach-alter`) above-the-fold content on mobile and desktop is H1 + intro + start of Kurzantwort only — no age-segment quick links (e.g., "0–6 Monate", "12–18 Monate" cards) are visible until the user scrolls. For a hub page whose entire purpose is routing users to the correct age-specific article, this delays the primary task.
**Recommendation:** Move the first 2–3 age-segment cards/links higher, or add a compact in-page jump nav (chips/pills for age ranges) directly under the intro so the routing function is visible without scrolling, especially on mobile.

### 3. Broken/zero-dimension images detected during homepage scroll capture
**Severity:** Medium
**Description:** DOM inspection on the homepage (mobile) found 13 of 21 `<img>` elements reporting `naturalWidth: 0, naturalHeight: 0` at measurement time (e.g. `spielzeug-0-6-monate-480.jpg`, `geschenke-1-jahr-480.jpg`, `duplo-vergleich-480.jpg`, and others under `/images/articles/`), while the same images render correctly (with proper natural dimensions) when the hub page loads them. This is consistent with native lazy-loading (`loading="lazy"`) not having triggered yet at measurement time on the homepage's longer scroll — but one file, `outdoor-spielzeug-kleinkind.jpg`, is still being served as a large unconverted JPG (1600x893 natural, rendered at 298x210) alongside otherwise fully WebP-converted thumbnails, which is inconsistent with the stated WebP migration and adds unnecessary payload weight on that card.
**Recommendation:** Re-verify with a full scroll-through (not just a static viewport capture) that all lazy images resolve correctly and none are actually 404/broken — the 0x0 readings here are most likely a timing artifact of lazy-loading rather than true broken images, but this should be confirmed directly (e.g., via network tab or `naturalWidth` check after full scroll). Separately, convert the one remaining JPG card image to WebP for consistency and smaller payload.

### 4. Top navigation links are below the 44x44px recommended minimum touch-target height
**Severity:** Low
**Description:** Desktop/laptop/tablet nav links ("Nach Alter", "Geschenke", "Ratgeber", "Aktuell", "Kaufhilfen", "Über uns") measure only 18px in height (text-only, no padding box), below the commonly recommended 44–48px minimum tap-target size. This applies to the visible desktop nav; on mobile this nav is collapsed behind the hamburger so the immediate risk is limited to tablet/desktop touch devices (e.g., iPad, touch laptops). The hamburger icon itself (37x32px) is also slightly under the 44x44px guideline, though within commonly accepted tolerance for icon-only triggers.
**Recommendation:** Increase the clickable/tappable padding around nav links (not necessarily the visible text size) to reach at least 44px height, particularly important for tablet users who use touch but see the desktop nav layout at 768px width.

### 5. Author/byline link tap target on article mobile is oddly shaped
**Severity:** Info
**Description:** On the mobile article page, one detected tap target ("Kleinkind-Welt.de" breadcrumb home link) measured 75x42px — close to acceptable but slightly under the 44px height guideline, and visually cramped next to the wrapped breadcrumb text ("Spielzeug unter 20 Euro für Klei...") which truncates with ellipsis at 375px width.
**Recommendation:** Low priority — consider shortening the breadcrumb's current-page label on mobile (e.g., drop to a shorter slug-based label) to avoid truncation, and confirm the link's full tap area meets 44px height via CSS padding rather than relying on line-height alone.

### 6. No layout-shift risk indicators observed, but not conclusively verified
**Severity:** Info
**Description:** Static screenshot comparison did not reveal obvious CLS (cumulative layout shift) symptoms (e.g., no images without reserved space causing visible jump), and all images checked had explicit rendered dimensions distinct from 0. However, this audit did not capture true CLS metrics (e.g., via Performance Observer / Lighthouse), so this is a visual-only assessment, not a quantified CLS score.
**Recommendation:** Pair this visual audit with a Lighthouse/PageSpeed Insights CLS measurement (likely owned by a Performance specialist in this multi-specialist audit) to confirm no shift occurs once real network conditions and font-loading are factored in.

## Breakpoint Summary Table

| Page | 375px (mobile) | 768px (tablet) | 1366px (laptop) | 1920px (desktop) |
|---|---|---|---|---|
| Home | No overflow; H1+CTA above fold | No overflow; H1 above fold, nav→hamburger | No overflow; full nav, H1+CTA+secondary CTA above fold | No overflow; full nav, H1+CTA+secondary CTA above fold |
| Hub | No overflow; H1+intro above fold, no quick-link cards visible | No overflow; same as mobile | No overflow; full nav visible | No overflow; full nav visible |
| Article | No overflow; H1+dek+author block above fold, no Kaufbox above fold | No overflow; same, no Kaufbox above fold | No overflow; no Kaufbox above fold | No overflow; no Kaufbox above fold |

## Note on Tooling

Console-error capture, image natural-dimension checks, and tap-target measurements were done via DOM evaluation in headless Chromium; no real-device testing was performed (e.g., Safari iOS rendering quirks, real touch interaction) — recommend a spot-check on an actual iPhone/Android device before treating findings 4–5 as fully confirmed.
