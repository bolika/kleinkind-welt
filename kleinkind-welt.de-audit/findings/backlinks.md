# Backlinks Audit — kleinkind-welt.de

**Category:** Backlink Profile
**Audited:** 2026-06-30
**Credential tier:** 0 (Common Crawl + verification crawler only — no Moz/Bing/DataForSEO API keys configured; confirmed via `backlinks_auth.py --check`)
**Sources used:** Common Crawl Web Graph (release `cc-main-2026-jan-feb-mar`, the latest available release — there is no newer CC release published yet, this is current as of the audit date)

## Score: INSUFFICIENT DATA (not scored numerically)

Per Tier 0 methodology rules, fewer than 4 scoring factors have any data source at this tier (Common Crawl alone cannot populate referring domain count, quality distribution, anchor text, toxic ratio, velocity, follow/nofollow, or geographic relevance — all require Moz/Bing/DataForSEO). Producing a numeric 0-100 score from a single domain-level "not found" signal would be misleading precision. Directionally: backlink maturity is **effectively zero / pre-launch stage**, which is normal and expected for a domain this young — not a defect to "fix" urgently.

---

## What Works / Current State

- **Common Crawl domain check re-run with forced cache bypass** (`commoncrawl_graph.py kleinkind-welt.de --update --json`, `from_cache: false`) to rule out stale data. Result is identical to the check from ~2 weeks ago: domain is **not present** in CC's web graph (`in_crawl: false`, `in_rankings: false`, `pagerank: null`, 0 referring domains found). Source: Common Crawl (domain-level, confidence: 0.50).
- This is consistent with domain age/size — CC's crawl is not exhaustive and frequently misses small/new sites for several crawl cycles even after they have some external links. A "not found" result is **not proof of zero backlinks**, only proof that CC hasn't indexed any yet.
- No paid/spam/toxic link patterns to report — there is no link profile yet, so there is also no link-based liability (clean slate).
- Pinterest account exists with ~5 pins (per audit context). These are **nofollow, traffic-referral only** — correctly excluded from link-equity consideration. Useful for early social signals/referral traffic, not for backlink authority.

---

## Findings

### 1. Zero discoverable backlinks/referring domains at any tier-0 source
- **Severity:** Medium (expected for domain age, not a critical defect — flagged for tracking, not urgent remediation)
- **Description:** Common Crawl shows no inbound links to kleinkind-welt.de in its most recent published release. No referring domains, no PageRank signal, no harmonic centrality. This matches the prior check from ~2 weeks ago — no change in interim. Without Moz/Bing/DataForSEO access, there is no way to cross-validate whether any backlinks exist that CC simply hasn't crawled yet (CC coverage of small German-language sites is sparse and lags real-world link acquisition by months).
- **Recommendation:** Re-run this Common Crawl check again in 2-3 months when the next CC release is published (check `commoncrawl_graph.py --info` for new releases). Do not treat "not found in CC" as confirmation of literally zero links — treat it as "no link-equity signal observed yet." If budget allows even a single low-cost Moz API signup (free tier: 2,500 rows/month), that would immediately upgrade visibility to Tier 1 and provide a real DA/spam baseline — recommended as the single highest-value next step for under €0.

### 2. No backlink-building activity yet beyond Pinterest (nofollow only)
- **Severity:** Medium
- **Description:** Per audit context, the only off-site presence is a Pinterest account with ~5 pins. Pinterest links are nofollow by default, so this generates zero direct link-equity/PageRank contribution to kleinkind-welt.de, even though it can drive referral traffic and indirect brand-discovery signals. For a domain whose core blocker is GSC indexing/discovery (per project memory), backlinks from real websites — even a small number — help Google find and trust new pages faster than sitemaps alone, making this a meaningful gap relative to the site's current top priority (indexation).
- **Recommendation:** Given this is a side-project budget (free/low-cost, high-effort-per-link, not paid link building), prioritize tactics realistic for a brand-new German toddler/parenting affiliate site:
  1. **German parenting/mommy-blogger outreach & guest posts** — identify 5-10 small-to-mid German parenting blogs (Kleinkind/Eltern-Nische) and pitch a genuinely useful guest article or offer to be a source for an existing post. Low cost (time only), highest link-equity-per-effort for a new domain.
  2. **Resource/link-roundup link building** — search for German "Tipps für Kleinkinder" or "Spielzeug-Empfehlungen" roundup posts and request inclusion; these pages often link out generously and are low-effort to find via `site:*.de "linktipps" kleinkind` style queries.
  3. **Directory/community listings relevant to DACH parenting niche** (e.g., regional parent forums, Eltern-Foren, local Mama-Blogger-Netzwerke) — many allow a profile/signature link; low effort, modest but real equity.
  4. **HARO-equivalent for German market (e.g., Expertenrunden, Qeryz, or journalist requests via Twitter/X parenting hashtags)** — being quoted as a source in an established parenting publication is free and yields high-authority links.
  5. **Convert Pinterest traffic into earned links indirectly**: if pins drive traffic to genuinely useful pages (buying guides, age-based toy lists), those visitors include other bloggers/site owners who may link organically — make sure linked pages are the most "link-worthy" assets on the site (data-rich guides, not thin affiliate pages).
  6. Do **not** pursue paid link buying, PBNs, or link exchanges at this stage — for a young domain with zero existing profile, any toxic/manipulative pattern is disproportionately risky and easy for Google to flag given there's no established trust buffer yet.
- This recommendation set intentionally excludes any spend-based tactic, consistent with stated side-project budget constraints.

### 3. No way to validate Pinterest-driven referral pages or detect toxic links at this tier
- **Severity:** Low / Informational
- **Description:** At Tier 0, there is no spam-score or toxic-link-ratio data source available (that requires Moz Spam Score, Bing, or DataForSEO). This isn't a problem today since the link profile is empty, but it means **future** link acquisition (e.g., from outreach in Finding #2) cannot be automatically screened for quality/toxicity using current tooling.
- **Recommendation:** No action needed now. When/if Moz API key is added (Tier 1, free tier available), re-run this audit to get DA/PA/Spam Score baselines before and after any outreach campaign, so link quality can be tracked over time rather than assessed only qualitatively.

### 4. Cross-skill note — do not conflate with indexation issue
- **Severity:** Info
- **Description:** Per project memory, the site's primary current blocker is incomplete GSC indexation, not backlinks. Backlinks alone will not fix crawl/index gaps caused by technical or sitemap issues, but a small number of quality external links can accelerate discovery/crawl frequency for new pages as a secondary benefit.
- **Recommendation:** Treat backlink building as a complementary, longer-horizon tactic (results take weeks-to-months to show even in Tier-0 tooling). Continue prioritizing technical/indexation fixes first per the sitemap audit's existing guidance — see `/Users/bnazarov/coding/kleinkind-welt/kleinkind-welt.de-audit/findings/sitemap.md`. Recommend `/seo technical <url>` and `/seo content <url>` for crawlability and E-E-A-T review respectively; not duplicated here.

---

## Summary Table

| Check | Status | Source (confidence) |
|---|---|---|
| Common Crawl domain presence | Not found / not yet crawled | CC (0.50) |
| Referring domains (CC) | 0 | CC (0.50) |
| PageRank / harmonic centrality | No data | CC (0.50) |
| Moz DA/PA/Spam Score | Not available (no API key — Tier 0) | N/A |
| Bing inbound links | Not available (no API key — Tier 0) | N/A |
| DataForSEO premium metrics | Not available (no extension) | N/A |
| Known backlinks verified | N/A — none provided; Pinterest links excluded (nofollow, traffic-only) | N/A |
| Toxic/spam link patterns | None detected (empty profile) | N/A |

**Data freshness:** Common Crawl release `cc-main-2026-jan-feb-mar` is the latest published release as of this audit (verified via `--info`); re-checked with forced cache bypass to rule out stale results — identical to prior check. CC updates on a roughly quarterly cycle, so the next opportunity for a materially different result is in ~2-3 months.
