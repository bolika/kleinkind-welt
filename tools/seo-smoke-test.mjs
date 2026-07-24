#!/usr/bin/env node

/**
 * Lightweight regression checks for the static Kleinkind-Welt site.
 *
 * Local checks:
 *   node tools/seo-smoke-test.mjs --local
 *
 * Post-deploy checks (also verifies clean URL redirects):
 *   node tools/seo-smoke-test.mjs --base-url=https://kleinkind-welt.de
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const args = new Set(process.argv.slice(2));
const localOnly = args.has("--local");
const baseArg = process.argv.find((arg) => arg.startsWith("--base-url="));
const baseUrl = (baseArg ? baseArg.slice("--base-url=".length) : "https://kleinkind-welt.de").replace(/\/$/, "");

const failures = [];
const warnings = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};
const warn = (condition, message) => {
  if (!condition) warnings.push(message);
};

const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const routeToFile = (route) => route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
const routes = [...read("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const redirectRules = new Map(
  read("_redirects")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts.length >= 3)
    .map(([source, destination, status]) => [source, { destination, status }])
);
const sitemapLastmod = new Map([...read("sitemap.xml").matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g)]
  .map((match) => [new URL(match[1]).pathname, match[2]]));
const llmsUrls = new Set([...read("llms.txt").matchAll(/https:\/\/kleinkind-welt\.de[^)\s]+/g)].map((m) => new URL(m[0]).pathname));
const evidenceFile = "data/editorial-evidence.json";
check(fs.existsSync(path.join(root, evidenceFile)), `${evidenceFile} fehlt.`);
let evidenceData = { recommendations: [] };
try { evidenceData = JSON.parse(read(evidenceFile)); } catch (error) { failures.push(`${evidenceFile} ist ungültig (${error.message}).`); }
const evidenceRecords = new Map();
for (const record of evidenceData.recommendations || []) {
  check(record.id && !evidenceRecords.has(record.id), `Doppelte oder fehlende Evidenz-ID: ${record.id || "leer"}.`);
  if (record.id) evidenceRecords.set(record.id, record);
  check(record.page && record.evidenceType && record.reviewedAt && typeof record.ownProductTest === "boolean", `${record.id || "Evidenzdatensatz"}: Pflichtfelder fehlen.`);
}
const renderedEvidenceIds = new Set();

check(routes.length > 0, "Sitemap enthält keine URLs.");
check(llmsUrls.size >= routes.length, `llms.txt enthält nur ${llmsUrls.size} URLs, Sitemap ${routes.length}.`);
for (const route of routes) check(llmsUrls.has(route), `Sitemap-URL fehlt in llms.txt: ${route}`);
for (const route of routes.filter((item) => item.startsWith("/artikel/"))) {
  const rule = redirectRules.get(`${route}.html`);
  check(rule?.destination === route && rule?.status === "301!", `${route}.html: erzwungene Netlify-301-Regel auf ${route} fehlt.`);
}

const seenTitles = new Map();
const seenCanonicals = new Map();
for (const route of routes) {
  const file = routeToFile(route);
  check(fs.existsSync(path.join(root, file)), `Sitemap-URL hat keine lokale Datei: ${route} → ${file}`);
  if (!fs.existsSync(path.join(root, file))) continue;

  const html = read(file);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim();
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const anchorTags = [...html.matchAll(/<a\b[^>]*>/gi)].map((m) => m[0]);
  const affiliateAnchors = anchorTags.filter((tag) => /data-affiliate=|href=["'][^"']*(?:amzn\.to|amazon\.)/i.test(tag));
  const amazonAnchors = anchorTags.filter((tag) => /href=["'][^"']*(?:amzn\.to|amazon\.)/i.test(tag));
  const affiliateCount = affiliateAnchors.length;
  const sponsoredCount = affiliateAnchors.filter((tag) => /rel=["'][^"']*\bsponsored\b[^"']*["']/i.test(tag)).length;
  const missingAlt = [...html.matchAll(/<img\b([^>]*)>/gi)].filter((m) => !/\balt\s*=\s*["'][^"']*["']/i.test(m[1])).length;
  const jsonLdBlocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const dataTables = [...html.matchAll(/<table\b[^>]*>/gi)].map((match) => match[0]);
  const visibleText = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ");
  const evidenceIds = [...html.matchAll(/data-evidence-id=["']([^"']+)/g)].map((match) => match[1]);
  const hasProductCards = /class=["'][^"']*(?:produkt-box|kw-product-card|testsieger-box)[^"']*["']/i.test(html);
  const hasFaq = /class=["'][^"']*faq-section[^"']*["']/i.test(html);
  const hasMobileTable = /class=["'][^"']*(?:budget-table|vergleich-tabelle|kaufhilfe-table|comparison-table)[^"']*["']/i.test(html);

  check(title, `${route}: Title fehlt.`);
  if (title) warn(title.length <= 60, `${route}: Title ist ${title.length} Zeichen lang.`);
  if (title) check(!/Entwicklung fördern|Die besten Empfehlungen|Testsieger/i.test(title), `${route}: Title enthält ein unbelegtes Wirkungs- oder Testsieger-Versprechen.`);
  check(canonical, `${route}: Canonical fehlt.`);
  check(h1Count === 1, `${route}: erwartet genau eine H1, gefunden ${h1Count}.`);
  check(/class=["'][^"']*skip-link[^"']*["'][^>]+href=["']#main-content["']|href=["']#main-content["'][^>]+class=["'][^"']*skip-link/i.test(html), `${route}: Skip-Link zum Hauptinhalt fehlt.`);
  check(/<main\b[^>]*id=["']main-content["']/i.test(html), `${route}: main#main-content fehlt.`);
  check(missingAlt === 0, `${route}: ${missingAlt} Bild(er) ohne Alt-Attribut.`);
  for (const table of dataTables) check(/aria-label(?:ledby)?=["'][^"']+["']/i.test(table), `${route}: Tabelle ohne zugängliche Beschriftung.`);
  if (hasMobileTable) check(/src=["']\/js\/mobile-tables\.js/i.test(html), `${route}: mobile Tabelle nutzt nicht die zentrale Tabellen-Komponente.`);
  check(!/classList\.toggle\(["']show["']\)/i.test(html), `${route}: Navigation verwendet den veralteten .show-Zustand statt .open.`);
  check(affiliateCount === sponsoredCount, `${route}: ${affiliateCount} Affiliate-Links, aber ${sponsoredCount} davon als sponsored markiert.`);
  if (affiliateCount > 0) {
    check(/affiliate-hinweis|affiliate-links/i.test(html), `${route}: Affiliate-Links ohne sichtbaren Hinweis.`);
    check(/src=["']\/js\/affiliate-tracking\.js/i.test(html), `${route}: Affiliate-Links nutzen nicht das zentrale Tracking.`);
    check(!/plausible\(["']Affiliate[ -]Klick["']/i.test(html), `${route}: veraltetes Inline-Affiliate-Tracking vorhanden.`);
  }
  for (const tag of amazonAnchors) check(/data-affiliate=["'][^"']+["']/i.test(tag), `${route}: Amazon-Link ohne data-affiliate-Attribut.`);
  for (const block of jsonLdBlocks) {
    try {
      const structuredData = JSON.parse(block[1]);
      check(!/["']@type["']\s*:\s*["'](?:Product|Review|AggregateRating)["']/i.test(JSON.stringify(structuredData)), `${route}: Review-/Rating-Schema ohne freigegebenen Einzelprodukttest.`);
    } catch { failures.push(`${route}: ungültiger JSON-LD-Block.`); }
  }
  check(!/[★☆]/.test(visibleText), `${route}: sichtbare Sternebewertung ohne reproduzierbare Skala.`);
  check(!/\b[1-5](?:[.,]\d)?\s*\/\s*5\b/.test(visibleText), `${route}: sichtbare x/5-Bewertung ohne reproduzierbare Skala.`);
  check(!/\b(?:Praxistest|Testsieger|sicherste[rsn]?)\b|von uns getestet/i.test(visibleText), `${route}: unbelegtes Test-/Absolutheits-Wording.`);
  check(!/mit eigener Testerfahrung/i.test(html), `${route}: pauschale eigene Testerfahrung in Metadaten.`);
  check(!/\bCE-zertifiziert\b|\bCE[^.]{0,100}(?:bestätigt[^.]{0,60}geprüft|unabhängig geprüft)/i.test(visibleText), `${route}: CE fälschlich als Zertifizierung oder unabhängige Prüfung dargestellt.`);
  if (hasProductCards && affiliateCount > 0) check(evidenceIds.length > 0, `${route}: Produktkarten ohne sichtbare Evidenzkennzeichnung.`);
  for (const id of evidenceIds) {
    renderedEvidenceIds.add(id);
    check(evidenceRecords.has(id), `${route}: Evidenz-ID ${id} fehlt in ${evidenceFile}.`);
    const record = evidenceRecords.get(id);
    if (record) {
      check(record.page === route, `${route}: Evidenz-ID ${id} verweist auf ${record.page}.`);
      check(record.reviewedAt === html.match(new RegExp(`data-evidence-id=["']${id}["'][^>]*data-evidence-type=["'][^"']+["'][^>]*data-evidence-checked=["']([^"']+)`))?.[1], `${route}: Prüftag von ${id} stimmt nicht mit dem Evidenzdatensatz überein.`);
    }
  }
  if (hasFaq) {
    check(/src=["']\/js\/faq-accordion\.js/i.test(html), `${route}: FAQ nutzt nicht die zentrale barrierefreie Komponente.`);
    check(!/querySelector\(['"]h3['"]\)\.addEventListener\(['"]click/i.test(html), `${route}: FAQ besitzt weiterhin einen klickbaren H3-Handler.`);
  }
  const dateModified = html.match(/["']dateModified["']\s*:\s*["'](\d{4}-\d{2}-\d{2})/i)?.[1];
  if (dateModified && sitemapLastmod.has(route)) warn(dateModified === sitemapLastmod.get(route), `${route}: dateModified ${dateModified} weicht von lastmod ${sitemapLastmod.get(route)} ab.`);
  if (/\b(?:Sicherheit|sicher|Schadstoff|Entwicklung|fördert)\b/i.test(visibleText)) {
    const authorityLinks = [...html.matchAll(/href=["'](https?:\/\/[^"']+)/gi)]
      .map((match) => match[1])
      .filter((url) => !/(?:amazon\.|amzn\.to|kleinkind-welt\.de|plausible\.io|brevo\.)/i.test(url));
    warn(authorityLinks.length > 0, `${route}: Safety-/Entwicklungswortlaut ohne externe Fachquelle auf der Seite.`);
  }
  if (title) seenTitles.set(title, [...(seenTitles.get(title) || []), route]);
  if (canonical) seenCanonicals.set(canonical, [...(seenCanonicals.get(canonical) || []), route]);
}

for (const [title, matches] of seenTitles) if (matches.length > 1) failures.push(`Doppelter Title: ${title} (${matches.join(", ")})`);
for (const [canonical, matches] of seenCanonicals) if (matches.length > 1) failures.push(`Doppelter Canonical: ${canonical} (${matches.join(", ")})`);
for (const id of evidenceRecords.keys()) check(renderedEvidenceIds.has(id), `${evidenceFile}: ${id} wird auf keiner Sitemap-Seite gerendert.`);
const headers = read("_headers");
check(/\/docs\/\*[\s\S]*?X-Robots-Tag:\s*noindex,\s*nofollow/i.test(headers), `_headers: /docs/* ist nicht noindex, nofollow.`);
const affiliateTrackingFile = "js/affiliate-tracking.js";
const affiliateLedgerFile = "data/affiliate-product-ledger.json";
check(fs.existsSync(path.join(root, affiliateLedgerFile)), "data/affiliate-product-ledger.json fehlt.");
check(fs.existsSync(path.join(root, affiliateTrackingFile)), `${affiliateTrackingFile} fehlt.`);
if (fs.existsSync(path.join(root, affiliateTrackingFile))) {
  const affiliateTracking = read(affiliateTrackingFile);
  check(/plausible\(["']Affiliate-Klick["']/.test(affiliateTracking), `${affiliateTrackingFile}: kanonischer Eventname Affiliate-Klick fehlt.`);
  check(/event_schema:\s*["']3["']/.test(affiliateTracking), `${affiliateTrackingFile}: Event-Schema-Version fehlt.`);
  check(/produkt_id:/.test(affiliateTracking) && /haendler:/.test(affiliateTracking) && /angebot:/.test(affiliateTracking), `${affiliateTrackingFile}: Händlerangebots-Dimensionen fehlen.`);
}

if (!localOnly) {
  const fetchPage = async (route, redirect = "follow") => fetch(`${baseUrl}${route}`, {
    redirect,
    headers: { "user-agent": "kleinkind-welt-seo-smoke-test/1.0" }
  });

  for (const route of routes) {
    try {
      const response = await fetchPage(route);
      check(response.status === 200, `${route}: erwartet HTTP 200, erhalten ${response.status}.`);
    } catch (error) { failures.push(`${route}: Abruf fehlgeschlagen (${error.message}).`); }
  }

  for (const route of routes.filter((item) => item.startsWith("/artikel/"))) {
    try {
      const response = await fetchPage(`${route}.html`, "manual");
      const location = response.headers.get("location") || "";
      check(response.status === 301, `${route}.html: erwartet HTTP 301, erhalten ${response.status}.`);
      check(location === route, `${route}.html: Redirect-Ziel ist ${location || "nicht gesetzt"}, erwartet ${route}.`);
    } catch (error) { failures.push(`${route}.html: Redirect-Prüfung fehlgeschlagen (${error.message}).`); }
  }
}

if (failures.length) {
  console.error(`SEO-Smoke-Test fehlgeschlagen (${failures.length} Fehler):`);
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`SEO-Smoke-Test bestanden: ${routes.length} Sitemap-Seiten geprüft${localOnly ? " (lokal)" : " (lokal + live)"}.`);
  if (warnings.length) console.warn(`Hinweise (${warnings.length}):\n${warnings.map((item) => `- ${item}`).join("\n")}`);
}
