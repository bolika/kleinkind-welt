#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkOnly = process.argv.includes("--check");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/kleinkind-welt\.de([^<]*)<\/loc>/g)]
  .map((match) => match[1] || "/");
const routeToFile = (route) => route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
const extraFiles = ["404.html", "datenschutz.html", "impressum.html", "newsletter-bestaetigt.html", "kinderwagen-navigator.html"];
const files = [...new Set([...routes.map(routeToFile), ...extraFiles])];
const canonicalNav = `<ul id="nav-menu">
        <li><a href="/spielzeug-nach-alter">Spielzeug</a></li>
        <li><a href="/kinderwagen">Kinderwagen</a></li>
        <li><a href="/geschenke-kleinkind">Geschenke</a></li>
        <li><a href="/kaufhilfen">Kaufhilfen</a></li>
        <li><a href="/#ratgeber">Ratgeber</a></li>
        <li><a href="/ueber-uns">Über uns</a></li>
      </ul>`;

const stale = [];
for (const file of files) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) continue;
  const html = fs.readFileSync(absolute, "utf8");
  if (!/<ul id="nav-menu">[\s\S]*?<\/ul>/.test(html)) continue;
  const updated = html
    .replace(/<ul id="nav-menu">[\s\S]*?<\/ul>/, canonicalNav)
    .replace(
      /Ehrliche Empfehlungen und praktische Tipps für Eltern von Kleinkindern\.(?: Von Boris aus Vaterperspektive recherchiert\.)?/g,
      "Nachvollziehbare Kaufhilfen für Familien mit Babys und Kleinkindern."
    )
    .replace(
      /Ehrliche Empfehlungen für Eltern von Kleinkindern\./g,
      "Nachvollziehbare Kaufhilfen für Familien mit Babys und Kleinkindern."
    );
  if (updated === html) continue;
  if (checkOnly) stale.push(file);
  else fs.writeFileSync(absolute, updated);
}

if (stale.length) {
  console.error(`Navigation ist nicht synchron: ${stale.join(", ")}`);
  process.exit(1);
}

console.log(`${checkOnly ? "Geprüft" : "Synchronisiert"}: ${files.length} Seitendateien.`);
