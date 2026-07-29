# Search Experience Optimization (SXO) Audit — kleinkind-welt.de

**Audit date:** 2026-07-29 · **Supersedes** the SXO section of the 2026-06-30 audit run (that
version pre-dates the Kinderwagen-Navigator persona system and real GSC field data; keep it
for historical comparison but treat this file as current).

**Focus of this run (client request):** persona coverage against the seven Kinderwagen-Navigator
personas, page-type fit for the real, GSC-documented demand, and concrete quick-win specs for
two keywords already ranking without a dedicated page.

## Method & data sources

- **Real GSC data**, 90 days to 2026-07-25, as supplied by the client and cross-checked against
  `docs/gsc-analyse-2026-07-28.md` (independent GSC pull, same period, numbers match).
- **Persona source of truth:** `data/kinderwagen-navigator/persona-segments.v0.2.json` (7
  segments) and `reference-profiles.v0.1.json` (test profiles). Note the file's own
  `researchMaturity.claimPolicy`: these are explicitly labeled **"Hypothesen-Archetypen, nicht
  validierte Personas"** by the product team itself — a caveat this audit inherits.
- **Pages read directly from repo source** (not live-fetched): `geschenke-kleinkind.html`,
  `kinderwagen.html`, `kinderwagen-navigator.html`, `kaufhilfen.html`, five
  `artikel/kinderwagen-*.html` guides, `artikel/spielzeug-unter-20-euro.html`,
  `artikel/spielzeug-6-12-monate.html`, five `artikel/geschenke-*.html` gift articles.
- **Live Google SERP checks** (WebSearch, 2026-07-29) for the four keywords central to this
  brief: `geschenke für kleinkinder`, `lauflerngitter`, `stapelbecher ab welchem alter`, and
  `was schenkt man einem einjährigen als Oma Opa Geschenkidee` (proxy query to test whether a
  dedicated grandparent-gift content niche exists in the market).
- Page-type classification uses `claude-seo/skills/seo-sxo/references/page-type-taxonomy.md`;
  persona scoring uses `.../references/persona-scoring.md`; user stories use
  `.../references/user-story-framework.md`.

---

## SXO Gap Score: 52 / 100

*(Separate from any SEO Health Score — this measures page-type fit to intent and persona
coverage, not technical SEO.)*

| Dimension | Score | Evidence |
|---|---|---|
| Page Type (0–15) | 6/15 | Flagship Tool-type page (Kinderwagen-Navigator) is `noindex`; Geschenke-Hub is a pure link directory competing against commercial gift-finder SERPs that show live product picks (see Finding 5). |
| Content Depth (0–15) | 7/15 | Individual articles are genuinely deep (800–2500 words, FAQ, tables) — but zero depth exists for two keywords already ranking (`lauflerngitter`, `stapelbecher`) and zero for the confirmed real-demand persona (gift-giving relatives). |
| UX Signals (0–15) | 9/15 | Kurzantwort boxes, TOC, FAQ accordions, decision boxes are strong, proven patterns — but no UX path exists for "I don't know this child well" and the Navigator's own UX can't be discovered via search. |
| Schema (0–15) | 12/15 | Article, FAQPage, ItemList, BreadcrumbList, CollectionPage, WebApplication schema all present and correctly scoped. Strongest dimension on the site. |
| Media (0–15) | 8/15 | Responsive images/WebP present site-wide; no video; the one truly interactive asset (Navigator) is invisible to search. |
| Authority (0–15) | 3/15 | 7 clicks / 448 impressions / 1.56% CTR over 90 days; nearly all commercial queries sit at position 50–90 — expected for a ~2-month-old domain, but it is the dominant ceiling on everything else. |
| Freshness (0–10) | 7/10 | Most pages carry visible "Aktualisiert/Geprüft" dates in July 2026 and real `dateModified` values — good hygiene, actively maintained. |

---

## Lead finding: the persona system and the real demand live in two different, disconnected worlds

This is the primary issue and it explains most of the sub-findings below. Two facts, both
confirmed in the repo and in GSC:

1. **Zero of the seven Kinderwagen-Navigator personas has a dedicated, indexable landing
   page**, and the one page that structurally matches all seven at once — the interactive
   Navigator tool itself — carries `<meta name="robots" content="noindex,follow">`
   (`kinderwagen-navigator.html:11`). It is not in `sitemap.xml`. However well the persona
   *logic* works once a user is on the page, Google cannot surface that page for any query,
   by design, today.
2. **The demand that does exist has nothing to do with strollers.** 0 of 90 days' worth of 85
   distinct queries contain "kinderwagen", "buggy", or "kofferraum". The demand that does
   exist is gift-buying ("geschenke für kleinkinder", "kleinkinder geschenkideen", "geschenk
   kleinkind" — together >140 of 448 impressions), and `/geschenke-kleinkind` is the single
   highest-impression page on the domain (113 impressions). That persona — plausibly
   grandparents, relatives, colleagues buying a gift for a child whose exact developmental
   stage they don't track day-to-day — is real, large relative to everything else on the
   site, and barely served (see Finding 3).

In other words: the page type built to match the persona system (a matching Tool) cannot be
found by Google, and the page type Google is actually showing to real searchers
(gift-occasion hub + articles) doesn't speak to the persona those searchers most plausibly
are. Fixing either side in isolation leaves the other broken.

---

## Findings

### Finding 1 — Kinderwagen-Navigator is `noindex`: the one page shaped for all seven personas is invisible to Google
**Severity: CRITICAL**

`kinderwagen-navigator.html` has `<meta name="robots" content="noindex,follow">` and is
absent from `sitemap.xml`. Per the Tool/Interactive page-type taxonomy, a Finder/Matcher tool
is exactly the format Google rewards for "welcher kinderwagen passt zu mir"-style
comparison-shopping queries — this is a legitimate, well-built asset (`WebApplication`
schema, transparent methodology sections, beta disclosure). But `noindex` means it cannot
rank for any query, regardless of how well its logic serves `low_budget_city_walkup`,
`premium_mobile_family`, or any of the other five segments. This is presumably intentional
given the beta status (20-model catalog, explicit "Pilotkatalog, noch kein vollständiger
Marktüberblick" framing) — but it needs an explicit trigger and owner, or it will stay
invisible indefinitely by default.

**Recommendation:** Define a concrete, dated release gate for removing `noindex` (e.g. "50
completed Navigator sessions from seeded traffic AND catalog ≥ 40 models AND zero P0 logic
bugs for 14 days" — the product's own `betaTargets` in `persona-segments.v0.2.json` already
imply similar thresholds). Until that gate is met, do **not** rely on organic search to
validate the Navigator; the seeded/paid traffic path called for in
`docs/gsc-analyse-2026-07-28.md` §4 is the only way to test it before removing `noindex`.

### Finding 2 — Zero of the seven Navigator personas has a dedicated page; the five support articles are brand-new and were confirmed unknown to Google as of the last crawl
**Severity: CRITICAL**

None of `kinderwagen-arten.html`, `kinderwagen-gebraucht-kaufen.html`,
`kinderwagen-gesamtpreis.html`, `kinderwagen-stadt-oder-land.html`, or
`kinderwagen-kofferraum.html` targets a persona by name or situation-specific keyword — they
are general task guides ("welche Art?", "gebraucht kaufen", "Gesamtpreis", "Stadt oder
Land?", "passt ins Auto?"). A keyword check across all six kinderwagen pages for the exact
phrases that define the `low_budget_city_walkup` persona label ("kleine Wohnung", "ohne
Aufzug") returns **zero matches anywhere on the site**. `premium_mobile_family` and
`service_weather_long_use` fare no better — "Service", "Garantie", and "Reparatur" appear
only in passing inside the used-stroller and total-price articles, never as their own
angle. See the persona table below for the full breakdown.

Compounding this: per `docs/gsc-analyse-2026-07-28.md`, these five articles (plus the
`/kinderwagen` hub) were **"unbekannt" to Google** as of the last sitemap crawl
(2026-07-14), because they were committed on 2026-07-23 — nine days after that crawl. The
sitemap was manually resubmitted on 2026-07-28. That means even the *partial* topical
coverage two of these articles provide (see Finding on `kinderwagen-stadt-oder-land` /
`kinderwagen-kofferraum` in the persona table) has not yet had a single chance to be
evaluated by Google. Zero kinderwagen impressions in 90 days is therefore not yet evidence
the content doesn't work — it's evidence Google hasn't seen it yet.

**Recommendation:** Confirm indexation moved from NEUTRAL to PASS via
`gsc_inspect.py --batch` (already scheduled per the referenced doc). Once indexed, the
biggest single content gap is `low_budget_city_walkup` — it has literally zero keyword
presence anywhere on the site despite being the segment whose `whyItMatters` field
explicitly calls out "günstige Geburtskonfiguration, tägliches Tragen und ÖPNV," i.e. the
kind of daily-friction searches ("kinderwagen ohne aufzug", "leichter kinderwagen treppen
tragen") a budget-constrained urban parent plausibly runs. No page on the site could catch
that query today even if crawled tomorrow.

### Finding 3 — The real, GSC-confirmed demand persona (gift-giving relatives) is served by generic parent-perspective content, not by anything addressing their actual anxiety
**Severity: HIGH — highest realistic traffic upside on the site today**

`/geschenke-kleinkind` (113 impressions, the single best-performing page on the domain) and
the five `geschenke-*` articles it links to are all written from a parent's in-depth
developmental perspective. "Großeltern" appears exactly three times across all five gift
articles, always as a budget aside ("Großeltern können sich an einem größeren Geschenk
zusammentun") — never addressing the actual barrier a relative-not-parent faces: *I don't
see this child daily, I don't know what they already own, and I don't want to waste money or
give something wrong.* The only place that comes close is one table row on
`kaufhilfen.html` ("Großeltern-Geschenk → robuste Klassiker mit langer Nutzungsdauer" —
one cell, no link, no dedicated content).

A live SERP check for `was schenkt man einem einjährigen als Oma Opa` confirms this is a
real, served content niche in the market — competitors run entire dedicated articles for it
(e.g. "72 Geschenke zum 1. Geburtstag von Oma und Opa", "Geschenke zur Geburt von Oma und
Opa – 15 Ideen", "Weihnachtsgeschenke für Oma & Opa") with a distinct angle (sentimental /
keepsake gifts alongside developmental picks, reassurance framing, "was Eltern schon haben
könnten" checklists). Kleinkind-welt has no equivalent.

**Recommendation:** This is the highest-leverage content investment available given actual
traffic data. Add a short, prominent "Kennst du das Kind nicht so gut? So gehst du sicher"
module near the top of `/geschenke-kleinkind` and each `geschenke-*` article — a 4-question
checklist (Was hat das Kind schon? Wie viel Platz ist da? Ist es alters-sicher? Brauchen wir
Rücksprache mit den Eltern?) plus 2-3 "safe default" picks per age band that don't require
inside knowledge. This directly serves the persona generating the most real traffic on the
domain today, at near-zero production cost (it slots into pages that already exist and
already rank).

### Finding 4 — `lauflerngitter` (pos 10.8) and `stapelbecher ab welchem alter` (pos 18.3) rank with zero dedicated pages — the fastest, highest-confidence traffic win on the site
**Severity: HIGH — quick win**

Both terms already sit near page 1/2 from a passing mention alone. Live SERP checks show why
a dedicated page is realistic for both:

- **`lauflerngitter`**: the SERP is **100% secondhand-marketplace listings**
  (eBay Kleinanzeigen, Shpock, Mamikreisel) — no strong editorial competitor at all. This is
  a weak competitive set that a genuine buying guide can beat.
- **`stapelbecher ab welchem alter`**: the SERP is dominated by exactly the format
  kleinkind-welt already produces well elsewhere — brand "Ratgeber" blog posts
  (bieco.de/blogs/ratgeber/stapelturm-alter-tipps) and affiliate roundups
  (elternkompass.de "Die 16 besten Stapelbecher — Ratgeber 2026", test-und-ratgeber.de). This
  is a format-match, not a format-invention problem.

**Concrete spec for `/artikel/lauflerngitter`:**
- **First correct a factual/E-E-A-T problem before expanding this topic**: `spielzeug-6-12-monate.html`
  currently labels "Baby-Walker" as "(Lauflerngitter auf Rädern)" and tells readers to avoid
  it. But "Lauflerngitter" in real market usage (confirmed by every SERP result returned) means
  a stationary **playpen/Laufstall** — a different, generally unproblematic product — not the
  wheeled walker pediatricians warn against. Publishing a new page without fixing this
  conflation risks giving factually wrong safety guidance under a heavily-searched term.
- Kurzantwort box with a direct age recommendation, safety criteria (GS-Zeichen, Netzhöhe,
  Bodenfreiheit, Klemmschutz), pros/cons vs. free-roam play, concrete use cases (Kochen,
  Duschen, Geschwisterkind-Situation), a small comparison table of 2-3 models at different
  price points, FAQ ("ab wann sinnvoll?", "wie lange nutzen?", "gebraucht kaufen okay?"),
  affiliate picks, sources. Reuse the exact template already proven on
  `spielzeug-unter-20-euro.html` and `spielzeug-6-12-monate.html`.
- Fix internal links: `spielzeug-6-12-monate.html` and `spielzeug-12-18-monate.html` should
  point to this new page instead of (or in addition to) the current Baby-Walker aside.

**Concrete spec for `/artikel/stapelbecher` (or `/artikel/stapelbecher-ab-welchem-alter`):**
- Consolidate the four scattered mentions (`spielzeug-unter-20-euro.html`,
  `spielzeug-6-12-monate.html`, the `geschenke-kleinkind.html` table, the `kaufhilfen.html`
  table) into one canonical, authoritative page.
- Lead the Kurzantwort with the exact age range in the first sentence — the query pattern
  ("ab welchem Alter") is a direct-answer query and the page needs to win the snippet, not
  make the reader scroll. Site's own existing copy already has the raw material ("ab 6
  Monaten … sicher ab 10-12 Monaten").
- Age-by-stage breakdown (what a 6-month-old does with the same toy vs. a 12- or 18-month-old
  — this "reuse across stages" angle is a genuine differentiator none of the SERP
  competitors emphasize), material comparison (Holz vs. Kunststoff), FAQ reusing/extending
  the FAQ entries already written on `spielzeug-unter-20-euro.html`.
- Redirect/cross-link all four existing mentions to this page as the canonical source.

### Finding 5 — `/geschenke-kleinkind` is a pure link-directory (CollectionPage) competing against commercial SERPs that show live product picks
**Severity: MEDIUM**

A live SERP check for `geschenke für kleinkinder` returns almost entirely commercial
category/gift-finder pages that show actual curated products directly on the page: Smyths
Toys "Geschenkefinder 18-36 Monate", XXXLutz "Geschenke für Kleinkinder", BabyOne "Geschenke
unter 50€", BioKinder and dreams4kids age-sorted gift pages, ToyAcademy "Geschenkfinder",
Brack "Geschenke finden nach Alter". The dominant format is "gift finder with visible
picks by age", not "directory linking out to six separate articles" — which is what
`/geschenke-kleinkind` currently is (six `card` links to sub-pages, a table of "gute
Richtung / eher vermeiden" text, no actual product recommendation visible on the hub page
itself). Per the taxonomy, this is a Hybrid/Collection page competing against a
Product-Finder-dominant SERP.

**Recommendation:** Add 2-3 concrete top picks (with price/age/link) inline per
occasion-card directly on the hub page, rather than requiring a click-through to see any
actual recommendation. This also gives the hub page real unique content instead of pure
navigation, which should help it compete for the broad head term instead of only the
sub-articles competing for their long-tail variants.

### Finding 6 — Mild signal-splitting between homepage and the Geschenke-Hub for broad queries (monitor, not urgent)
**Severity: LOW–MEDIUM**

A slightly older 28-day GSC snapshot (`tmp/gsc-2026-07-06/gsc-queries-pages-28d.json`) shows
broad queries like "geschenke für kleinkinder" and "kleinkindspielzeug" mapping to the
**homepage**, not to `/geschenke-kleinkind`. The newer 90-day window (client-supplied) shows
`/geschenke-kleinkind` now as the top page site-wide, so this may already be self-correcting
— but it's worth confirming Google has settled on the dedicated hub as the canonical
destination for the broad term rather than continuing to split signal with the homepage.
The occasion-specific spoke articles (`geschenke-1-jahr`, `geschenke-zur-geburt`, etc.) are
**not** cannibalizing each other or the hub — each already owns its own distinct long-tail
query in both snapshots. **This answers the client's cannibalization question directly: no
meaningful hub-vs-spoke cannibalization exists; the only overlap risk is homepage-vs-hub for
the broadest head term.**

**Recommendation:** Point any remaining internal links/anchor text using generic
"Geschenke"-phrasing toward `/geschenke-kleinkind` rather than the homepage section, and
re-check the query→page mapping after 4-6 weeks.

### Finding 7 — Ranking depth on commercial spielzeug/geschenke terms (position 50-90) is a domain-authority ceiling, not an SXO problem
**Severity: Context, not actionable via SXO**

Nearly all commercial head terms sit at position 50-90 with near-zero CTR. This is the
expected profile of a ~2-month-old domain without backlinks on competitive commercial terms,
not a page-type or persona-fit problem — no restructuring of these pages will move them past
a domain-authority ceiling. Cross-reference: `/seo content` (E-E-A-T depth) and
`/seo backlinks` (authority building) own this problem, not this audit.

---

## User Stories (cite specific signals, span 3 journey stages)

1. **As a grandparent buying a first-birthday gift**, I want quick reassurance the gift is
   age-appropriate and won't duplicate what the parents already bought, *because* I don't see
   my grandchild daily and don't want to waste money or get it wrong, *but* every gift article
   on the site speaks from an in-depth parent's perspective and mentions "Großeltern" only as
   a budget-pooling aside. *(Source: GSC — `/geschenke-kleinkind` is the top page site-wide at
   113 impressions; live SERP for the Oma/Opa proxy query shows a dedicated competitor content
   niche kleinkind-welt has no equivalent for.)* — **Decision stage.**

2. **As a parent searching "lauflerngitter"**, I want to know if a playpen is worth buying,
   what safety criteria matter, and where to get one, *because* I'm evaluating a specific
   purchase, *but* I land on a page that uses "Lauflerngitter" only as a mislabeled synonym for
   a wheeled Baby-Walker it recommends against — never addressing the actual playpen I searched
   for. *(Source: GSC position 10.8, no dedicated page; live SERP is 100% secondhand
   marketplace listings, confirming weak competing content quality.)* — **Awareness stage.**

3. **As a parent searching "stapelbecher ab welchem alter"**, I want a direct age answer plus a
   short buying recommendation on one page, *because* I'm deciding if this toy fits my child's
   current stage right now, *but* the answer is scattered across four different articles
   instead of answered immediately and authoritatively on one page. *(Source: GSC position
   18.3; live SERP shows the exact "Ratgeber + Alters-Guide" format already used elsewhere on
   the site winning for this query.)* — **Consideration stage.**

4. **As a budget-conscious city parent without an elevator** (`low_budget_city_walkup`), I want
   a page discussing carrying weight, folding, and a strict budget ceiling for exactly my
   situation, *because* a bad choice here means struggling on stairs daily, *but* no page on
   the site uses "ohne Aufzug" or "kleine Wohnung" anywhere, and the one asset built to match my
   situation (the Navigator) is `noindex` and cannot be found via Google at all. *(Source:
   `persona-segments.v0.2.json`; site-wide keyword grep returns zero matches; `noindex` tag on
   `kinderwagen-navigator.html`.)* — **Awareness stage.**

5. **As a parent choosing between a city stroller and one for forest/gravel paths**
   (`rural_rough_routes` / `tight_access_transit`), I want the tradeoff explained with real
   numbers instead of marketing claims like "all-terrain," *because* I don't trust vague
   descriptions, *but* even though `kinderwagen-stadt-oder-land.html` answers this well with a
   data table and FAQ schema, the page has zero chance to prove itself yet: it was unknown to
   Google as of the last crawl, and its own CTA leads to a Navigator Google can't surface
   either. *(Source: `sitemap.xml` lastmod 2026-07-28; `docs/gsc-analyse-2026-07-28.md`
   confirms these URLs were "unknown to Google"; Navigator `noindex` tag.)* — **Consideration
   stage.**

---

## Persona coverage table (client-requested)

All seven Kinderwagen-Navigator personas, plus the one persona the real GSC data actually
proves exists.

| Persona (source) | Vorhandene Seite | Lücke |
|---|---|---|
| **low_budget_city_walkup** — Preisbewusste Stadtfamilie ohne Aufzug (`persona-segments.v0.2.json`) | Keine. Navigator (noindex) ist die einzige Berührung. | Kein Artikel, keine Erwähnung von "ohne Aufzug"/"kleine Wohnung" irgendwo im Repo. Vollständige Lücke, sowohl inhaltlich als auch technisch (Navigator noindex). |
| **premium_mobile_family** — Mobile Familie, hohes Budget | Keine. | Kein Content zu Premium-Abwägung ohne künstliche Bevorzugung; "Faltmaß/Faltvorgang unabhängig vom Preis" (laut Persona-Datei gefordert) existiert nirgends als eigener Winkel. |
| **mid_budget_function_first** — Funktionalität, mittleres Budget | `kinderwagen-gesamtpreis.html` (Budget) + `kinderwagen-kofferraum.html` (Stauraum/Faltmaß) decken die Kriterien teilweise ab. | Nur implizit über zwei allgemeine Ratgeber, keine Seite adressiert die Persona namentlich oder deren konkrete Prioritätskombination (Stauraum + Langzeitflexibilität). Content war zudem beim letzten Crawl "unbekannt". |
| **rural_rough_routes** — Wald-, Feld-, Schotterwege | `kinderwagen-stadt-oder-land.html` — gute, datengestützte Teilabdeckung (Korrelationstabelle Rad/Breite/Gewicht, FAQ zu Kopfsteinpflaster). | Kein eigener Anker für "Gelände"/"Wald"/"Feld" als Haupt-Framing; Seite ist alltagsbezogen ("Stadt oder Land"), nicht persona-spezifisch. War beim letzten Crawl "unbekannt". |
| **tight_access_transit** — Enge Zugänge, ÖPNV | `kinderwagen-stadt-oder-land.html` (Breite/Aufzug-FAQ) — Teilabdeckung. | Kein "ÖPNV"-eigener Content-Winkel; Breite wird nur im Gelände-Kontext behandelt, nicht als eigenständige Engstellen-/Bus-Persona. |
| **service_weather_long_use** — Service- und Wetterschutzfokus | Keine eigene Seite. "Service"/"Garantie"/"Reparatur" nur am Rande in `kinderwagen-gebraucht-kaufen.html` und `kinderwagen-gesamtpreis.html`. | Kein Content zu dokumentiertem Service/Wetterschutz mit Einschränkungen — genau der Winkel, den die Persona-Datei fordert ("Garantie- und Servicewerbung wird ohne Bedingungen überbewertet"). |
| **compact_car_fixed_budget** — Kleines Auto, feste Budgetgrenze | `kinderwagen-kofferraum.html` — starke Datenabdeckung (Faltmaße von 20 Modellen vs. 10 Fahrzeuge, explizite T-Cross/Passat-Beispiele). Beste Teilabdeckung aller sieben Personas. | Seite ist allgemein "passt er ins Auto", nicht explizit auf "feste Budgetgrenze" zugeschnitten; keine Verknüpfung zur Preis-Seite für die Budget-Komponente der Persona. War beim letzten Crawl "unbekannt". |
| **Geschenkekäufer/in ohne Detailwissen** (real, GSC-bestätigt — nicht Teil der 7 Navigator-Personas) | `/geschenke-kleinkind` (113 Impr., Top-Seite der Domain) + 5 `geschenke-*`-Artikel. | Perspektive ist durchgängig elternzentriert; die konkrete Sorge dieser Persona ("kenne das Kind nicht gut, will nichts falsch machen") wird nirgends direkt adressiert — nur eine Tabellenzeile auf `kaufhilfen.html`. Höchstes reales Traffic-Potenzial im ganzen Audit. |

**Bottom line on the client's hypothesis: confirmed.** None of the seven Navigator personas has
a dedicated landing page. At best, three personas get partial, incidental coverage through
general task-guides that weren't written with them in mind — and those guides had zero chance
to be evaluated by Google until the sitemap fix on 2026-07-28.

---

## Persona scoring (4-dimension rubric, 25 pts each)

| Persona | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---|---|---|---|---|
| Geschenkekäufer/in ohne Detailwissen | 14/25 | 16/25 | 15/25 | 12/25 | 57/100 | Needs Work |
| Lauflerngitter-Sucher/in | 5/25 | 8/25 | 10/25 | 8/25 | 31/100 | Critical Mismatch |
| Stapelbecher-Sucher/in | 12/25 | 10/25 | 14/25 | 12/25 | 48/100 | Needs Work |
| tight_access_transit / rural_rough_routes | 15/25 | 14/25 | 16/25 | 4/25 | 49/100 | Needs Work |
| low_budget_city_walkup | 0/25 | 0/25 | 0/25 | 0/25 | 0/100 | Critical Mismatch |

**Weakest persona: low_budget_city_walkup (0/100).** Top issue: zero content exists under any
matching keyword, and the one page that would serve this segment (Navigator) is not
indexable. Recommended fix: this is a content-creation-from-zero task, not an optimization
task — see Finding 2.

**Systemic issue across every persona above:** the **Action** dimension is the weakest column
site-wide (0-12/25) whenever the natural next step is the Navigator, because that CTA leads to
a page Google itself cannot show as a search result. Any persona whose journey should end in
"start the Navigator" is capped on Action until Finding 1 is resolved.

**Priority actions (ordered by realistic traffic potential, per client instruction):**
1. Ship the "Kennst du das Kind nicht so gut?" module on `/geschenke-kleinkind` and the five
   `geschenke-*` articles (Finding 3) — touches the page already generating the most real
   impressions on the domain.
2. Build `/artikel/lauflerngitter` and `/artikel/stapelbecher` (Finding 4) — both already rank
   without dedicated pages against weak competing content; fastest page-1 path on the site.
3. Confirm the five kinderwagen articles moved from NEUTRAL/unknown to indexed (Finding 2),
   then decide the low_budget_city_walkup content gap is worth closing given it currently has
   literally zero footprint.
4. Set an explicit, dated release gate for removing `noindex` from the Navigator (Finding 1) —
   until then, do not expect any of the seven personas to be reachable via organic search.

---

## Limitations

- Pages were read from **repo source HTML**, not live-rendered via
  `scripts/render_page.py --mode auto`, because the audit target is the pre-deployment
  repository, not a public crawl target — no client-side JS/SPA behavior was evaluated (not
  relevant for these static pages, but flagged per protocol). The one page where this could
  matter, `kinderwagen-navigator.html`, loads its actual matching UI via
  `kinderwagen-navigator-app.mjs`, which was not executed/rendered in this session — the
  Navigator's in-app UX quality for each persona (once found) was not evaluated, only its
  discoverability.
- Live SERP checks (WebSearch) were run for 4 keywords, not a full top-10 manual SERP capture
  with PAA/featured-snippet screenshots for each — treat page-type-mismatch findings (5, 4) as
  grounded in real, current search results, but not screenshot-verified for every PAA/snippet
  detail.
- The seven Navigator personas are explicitly self-labeled by the product team as
  **unvalidated hypothesis archetypes** (`researchMaturity.claimPolicy` in
  `persona-segments.v0.2.json`), not researched personas — this audit evaluates content
  coverage against them as given, not their underlying validity.
- GA4 and CrUX behavioral data were not available/consulted in this run (per prior audits,
  GA4 has no configured property ID) — all persona/UX inference here is structural
  (page content + schema + GSC query/page data + live SERP), not behavioral (no scroll depth,
  bounce, or session-recording evidence).

---

## Cross-References

- Domain-authority ceiling on commercial terms (Finding 7) → `/seo content` (E-E-A-T depth)
  and `/seo backlinks` (link building), not this audit.
- Indexation mechanics for the five kinderwagen articles → already tracked in
  `docs/gsc-analyse-2026-07-28.md`; re-run `gsc_inspect.py --batch` per that doc's next-steps
  table before re-assessing Finding 2.
- Schema is already strong (Finding table above) — no `/seo schema` follow-up needed from this
  run.
- Local intent not detected in any audited query — `/seo local` not applicable.

Generate a PDF report? Use `/seo google report`.
