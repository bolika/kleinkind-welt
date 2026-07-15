# AI Search Readiness (GEO) Audit — kleinkind-welt.de

**Category:** AI Search Readiness
**Audited:** 2026-06-30
**Sources:** https://kleinkind-welt.de (robots.txt, llms.txt), local repo /Users/bnazarov/coding/kleinkind-welt (sample pages: artikel/duplo-vergleich.html, ueber-uns.html, llms.txt, sitemap.xml; full-site grep across 23 article pages)

## Score: 78 / 100

---

## What Works

- **Full AI crawler access already granted.** robots.txt explicitly Allows GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, cohere-ai, Applebot-Extended — no blocking, no crawl-delay traps. Best-practice baseline already met.
- **Static, server-rendered HTML — zero CSR risk.** Raw `curl` fetch (no JS execution) returns full content including the `.kurzantwort-box` and `.faq-item` blocks. AI crawlers that don't execute JavaScript (most don't) get complete, identical content to what a browser renders.
- **llms.txt already exists and is well-formed.** Present at `/llms.txt` (also in repo root), includes a clear site summary, `license: https://rsl.ai/1.0/public-inference` (valid, resolving RSL 1.0 reference), `maintainer`, `last-updated`, and a categorized link directory. This is ahead of the curve — most affiliate sites this size have none.
- **Direct-answer architecture is structurally consistent and scaled site-wide.** All 23 article pages carry a `.kurzantwort-box`, an FAQPage JSON-LD block with matching visible `.faq-item` accordion, and (21/23) a `SpeakableSpecification` pointing at both selectors. This isn't a one-off — it's a repeatable content template applied consistently.
- **Author entity (Boris Nazarov) uses a single, consistent `@id`.** `https://kleinkind-welt.de/ueber-uns#boris` is reused identically as `author` across all 23 articles and resolves to a full Person node (jobTitle, description, address, `knowsAbout`, `sameAs`) on `ueber-uns.html`, with `Organization.founder` also pointing at the same `@id`. This is correct, deduplicated entity modeling — exactly what helps LLMs build one stable author profile instead of treating each byline as a separate, unverified name.
- **Sourcing is visible and per-article.** Every article has a `.quellenbox` citing named external sources (e.g. kindergesundheit-info.de, EU Toy Safety, CPSC) rather than vague "studies show" language — this is a real, checkable citability signal that's rare on affiliate sites.

---

## Findings

### 1. Kurzantwort-box answers are consistently 15-20% short of the optimal AI-citation length
**Severity:** Medium
**Description:** Measured word counts across all 23 `.kurzantwort-box` blocks cluster at 109-128 words (e.g. duplo-vergleich: 128, motorikspielzeug-test: ~114, holzspielzeug-vs-plastikspielzeug: 120), consistently below the 134-167 word range associated with optimal AI-citation passage length. Two articles are well short of even that: `outdoor-spielzeug-kleinkind.html` (80 words) and `spielzeug-balkon-kleinkind.html` (55 words) — the latter is too brief to function as a self-contained, quotable answer block.
**Recommendation:** Expand each kurzantwort-box to land in the 134-167 word band by adding one more concrete, source-backed sentence (a stat, a specific age threshold, or a named-source claim) rather than padding with adjectives. Prioritize `spielzeug-balkon-kleinkind.html` and `outdoor-spielzeug-kleinkind.html` first since they're furthest from the target.

### 2. Two articles missing SpeakableSpecification schema
**Severity:** Low
**Description:** `reisespielzeug-kleinkind.html` and `spielzeug-balkon-kleinkind.html` are the only 2 of 23 articles without a `SpeakableSpecification` block in JSON-LD, breaking template consistency and excluding them from voice/AI-answer surfacing that relies on that signal.
**Recommendation:** Add the standard `"speakable": {"@type": "SpeakableSpecification", "cssSelector": [".kurzantwort-box", ".faq-item"]}` block to both pages' Article JSON-LD to match the other 21 articles. Low effort, ~5 minutes per page.

### 3. No YouTube, Reddit, or Wikipedia presence anywhere in the brand's footprint
**Severity:** High
**Description:** Site-wide grep across all HTML found zero YouTube links/embeds, zero Reddit mentions, and no outbound Wikipedia references. YouTube mentions show the strongest known correlation with AI citation likelihood (~0.737), with Reddit and Wikipedia entity presence also rated "High." The brand's only `sameAs` entity links are LinkedIn, Instagram, and Pinterest — platforms with comparatively low correlation to LLM citation behavior. This is the single biggest structural gap versus the brand-signal benchmarks in this audit's scope.
**Recommendation:** This is a multi-month initiative, not a quick fix: (1) Publish even 3-5 short YouTube videos (e.g. unboxing/safety-check walkthroughs of top-recommended products like DUPLO or Grimm's blocks) and embed them on the corresponding articles; (2) Have Boris Nazarov participate authentically in 1-2 relevant German-language parenting subreddits (r/Elternsein, r/Mamastube) over time, not as link-drops; (3) Pursue inclusion as a citation/external link on a relevant Wikipedia article (e.g. German "Montessori-Spielzeug" or "Kleinkind" pages) where genuinely additive. Effort: High; Impact: High (this is the highest-leverage lever available per the correlation data).

### 4. H2/H3 headings are mostly label-style, not question-style, outside the FAQ block
**Severity:** Medium
**Description:** On `duplo-vergleich.html` (representative of the comparison-article template), section headings read as labels — "1. LEGO DUPLO – Top-Empfehlung," "Direkter Vergleich: Was wirklich entscheidet" — rather than as questions a user would type into ChatGPT/Perplexity/Google AIO (e.g. "Ist DUPLO besser als Mega Bloks?"). Only the dedicated `.faq-item` accordion at the bottom uses question phrasing. Question-based headings are a known lever for being matched to AI Overview/conversational queries, and currently that benefit is confined to the FAQ section rather than spread through the main body.
**Recommendation:** Reframe 2-3 of the most query-relevant H2s per comparison article into question form (e.g. "Welches Bausystem ist das beste für Kleinkinder?" instead of "Direkter Vergleich: Was wirklich entscheidet") while keeping a one-sentence direct answer immediately below. Test on 2-3 high-traffic comparison articles first before rolling out site-wide.

### 5. llms.txt is slightly incomplete relative to the sitemap and has no enforced update process
**Severity:** Low
**Description:** `llms.txt` lists 27 article/page links; `sitemap.xml` has 30 indexable `<url>` entries — a small but real gap (likely newer articles not yet added to llms.txt). The file also has a static `last-updated: 2026-06-28` field with no visible process tying it to publication of new content, risking silent staleness as the site grows.
**Recommendation:** Add the 3 missing URLs now (diff sitemap.xml against llms.txt to identify them), and add a lightweight CI/build-time check (or a checklist item in the existing publishing workflow) that fails or warns when sitemap.xml and llms.txt link counts diverge, plus auto-bumps `last-updated` on every content deploy.

### 6. RSL 1.0 licensing signal present but unverified for actual enforcement value
**Severity:** Info
**Description:** `llms.txt` declares `license: https://rsl.ai/1.0/public-inference`, which resolves (HTTP 200) and is a legitimate, emerging machine-readable licensing standard for AI training/inference permissions. However, RSL 1.0 is very new and not yet widely honored/parsed by major AI crawlers (GPTBot, ClaudeBot, etc. do not currently confirm RSL compliance), so its practical effect today is mostly symbolic/future-proofing rather than an active access-control or monetization mechanism.
**Recommendation:** No action needed now beyond what's already in place — this is forward-looking infrastructure, not a gap. Revisit in 6-12 months as RSL adoption among major AI crawlers becomes clearer; consider pairing it with explicit per-section licensing terms if RSL tooling matures.
