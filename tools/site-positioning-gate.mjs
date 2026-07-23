#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const home = read("index.html");
const hub = read("kinderwagen.html");
const navigator = read("kinderwagen-navigator.html");
const method = read("bewertungsmethode.html");
const about = read("ueber-uns.html");
const toolsHub = read("kaufhilfen.html");
const sitemap = read("sitemap.xml");
const llms = read("llms.txt");
const tracking = read("js/navigator-link-tracking.js");
const manifest = JSON.parse(read("site.webmanifest"));
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/kleinkind-welt\.de([^<]*)<\/loc>/g)]
  .map((match) => match[1] || "/");
const routeToFile = (route) => route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;

check(/<title>[^<]*Spielzeug[^<]*Kinderwagen[^<]*Kaufhilfen/i.test(home), "Homepage-Title bildet beide Säulen nicht ab.");
check(/<h1>Finden, was wirklich zu eurem Alltag passt\.<\/h1>/.test(home), "Homepage-H1 entspricht nicht der Dachpositionierung.");
check(/href=["']\/spielzeug-nach-alter["']/.test(home) && /href=["']\/kinderwagen["']/.test(home), "Homepage besitzt nicht beide primären Einstiege.");
check((home.match(/data-topic-link/g) ?? []).length >= 4, "Homepage-Themeneinstiege sind nicht vollständig messbar.");
check(/Spielzeug und Kinderwagen|Spielzeug &amp; Kinderwagen/.test(toolsHub), "Kaufhilfen-Hub ist nicht kategorieübergreifend formuliert.");
check(/id=["']spielzeug["']/.test(method) && /id=["']kinderwagen["']/.test(method), "Bewertungsmethode enthält nicht beide Kategorie-Methoden.");
check(/Produkte für Babys und Kleinkinder|Kaufhilfen für Familien/.test(about), "Über-uns-Seite trägt die Dachpositionierung nicht.");
check(/<meta name="robots" content="index, follow">/.test(hub), "Kinderwagen-Hub ist nicht indexierbar.");
check(sitemap.includes("https://kleinkind-welt.de/kinderwagen"), "Kinderwagen-Hub fehlt in der Sitemap.");
check(!sitemap.includes("https://kleinkind-welt.de/kinderwagen-navigator"), "Navigator darf vor Freigabe nicht in der Sitemap stehen.");
check(/<meta name="robots" content="noindex,follow">/.test(navigator), "Navigator muss bis zum Qualitäts-Gate noindex bleiben.");
check(llms.includes("https://kleinkind-welt.de/kinderwagen"), "Kinderwagen-Hub fehlt in llms.txt.");
check(llms.includes("https://kleinkind-welt.de/kinderwagen-navigator"), "Navigator-Pilot fehlt in llms.txt.");
check(/Spielzeug und Kinderwagen/.test(manifest.description ?? ""), "Manifest-Beschreibung bildet beide Säulen nicht ab.");
check((hub.match(/data-guide-link/g) ?? []).length === 5, "Kinderwagen-Hub misst nicht alle fünf Kaufhilfen.");
check(tracking.includes("Themenbereich-Klick") && tracking.includes("Kinderwagen-Kaufhilfe"), "Tracking für Themenbereiche oder Kaufhilfen fehlt.");
check(fs.existsSync(path.join(root, "docs", "category-expansion-gate.md")), "Kategorie-Expansion-Gate fehlt.");

for (const route of sitemapRoutes) {
  const file = routeToFile(route);
  if (!fs.existsSync(path.join(root, file))) continue;
  const html = read(file);
  check(/href=["']\/spielzeug-nach-alter["'][^>]*>Spielzeug<\/a>/.test(html), `${route}: globaler Spielzeug-Einstieg fehlt.`);
  check(/href=["']\/kinderwagen["'][^>]*>Kinderwagen<\/a>/.test(html), `${route}: globaler Kinderwagen-Einstieg fehlt.`);
  check(!/>Aktuell<\/a>/.test(html), `${route}: veralteter Navigationspunkt „Aktuell“ vorhanden.`);
  check(!/>Nach Alter<\/a>/.test(html), `${route}: veralteter globaler Navigationspunkt „Nach Alter“ vorhanden.`);
}

const legacyFiles = ["index.html", "ueber-uns.html", "bewertungsmethode.html", "kaufhilfen.html", "llms.txt"];
for (const file of legacyFiles) {
  const content = read(file);
  check(!/Warum empfehlen wir vor allem Amazon-Produkte|verdient Geld über das Amazon-Partnerprogramm|Affiliate-Links zu Amazon sind/i.test(content), `${file}: veraltete Amazon-Exklusivpositionierung vorhanden.`);
}

if (failures.length) {
  console.error(`Positionierungs-Gate fehlgeschlagen (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Positionierungs-Gate bestanden: ${sitemapRoutes.length} indexierbare Seiten mit konsistenter Zwei-Säulen-Navigation.`);
