#!/usr/bin/env node
// Checks every Pinolino (Awin m=129719) link against the curated mapping.
// With a local feed in imports/awin/pinolino.csv.gz it also verifies stock
// and flags price drift. The feed URL contains an API key and is never read
// from or written to the repository.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = process.cwd();
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'data/affiliate-offers/pinolino.mapping.v0.1.json'), 'utf8'));
const feedPath = path.join(root, 'imports/awin/pinolino.csv.gz');
const errors = [];
const warnings = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'kleinkind-welt.de-audit', 'claude-seo', 'docs', 'tmp'].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(absolute));
    else if (entry.name.endsWith('.html')) result.push(absolute);
  }
  return result;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? ''])));
}

check(mapping.advertiserId === 129719 && mapping.publisherId === 2998119, 'Mapping: falsche Advertiser- oder Publisher-ID.');

const clickrefs = new Map();
for (const offer of mapping.mappings) {
  check(offer.deeplink.startsWith('https://www.awin1.com/pclick.php?') && offer.deeplink.includes('&m=129719'), `${offer.offerId}: Deeplink ist kein Pinolino-Awin-Link.`);
  check(offer.deeplink.includes(`p=${offer.awProductId}&`), `${offer.offerId}: Deeplink passt nicht zur Awin-Produkt-ID.`);
  check(/^https:\/\/images2\.productserve\.com\//.test(offer.imageUrl), `${offer.offerId}: Bild muss über den Awin-Bildproxy laufen (CSP).`);
  for (const placement of offer.placements) {
    check(!clickrefs.has(placement.clickref), `${placement.clickref}: Clickref doppelt vergeben.`);
    clickrefs.set(placement.clickref, { offer, placement });
    const file = path.join(root, placement.page);
    if (!fs.existsSync(file)) { errors.push(`${placement.clickref}: Seite ${placement.page} fehlt.`); continue; }
    const html = fs.readFileSync(file, 'utf8');
    const href = `${offer.deeplink}&clickref=${placement.clickref}`.replaceAll('&', '&amp;');
    check(html.includes(`href="${href}"`), `${placement.clickref}: Link mit Clickref fehlt auf ${placement.page}.`);
    check(html.includes(`id="${placement.scopeId}"`), `${placement.clickref}: Zielbereich #${placement.scopeId} fehlt.`);
    check(html.includes('Pinolino über Awin'), `${placement.page}: transparenter Affiliate-Hinweis für Pinolino fehlt.`);
  }
}

let linkCount = 0;
for (const file of walk(root)) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  for (const tag of html.match(/<a\b[^>]*href="https:\/\/www\.awin1\.com\/pclick\.php\?[^"]*m=129719[^"]*"[^>]*>/g) ?? []) {
    linkCount += 1;
    const clickref = tag.match(/clickref=([a-z0-9_]+)/)?.[1];
    const known = clickref && clickrefs.get(clickref);
    check(Boolean(known), `${relative}: Pinolino-Link ohne gemappten Clickref (${clickref || 'leer'}).`);
    if (known) check(known.placement.page === relative, `${relative}: Clickref ${clickref} gehört zu ${known.placement.page}.`);
    check(/rel="[^"]*sponsored[^"]*"/.test(tag), `${relative}: Pinolino-Link ohne rel=sponsored.`);
    check(/data-merchant="pinolino"/.test(tag), `${relative}: Pinolino-Link ohne data-merchant="pinolino".`);
    check(/data-affiliate="awin"/.test(tag), `${relative}: Pinolino-Link ohne data-affiliate="awin".`);
  }
}
check(linkCount >= clickrefs.size, `Nur ${linkCount} Pinolino-Links für ${clickrefs.size} Platzierungen gefunden.`);

if (fs.existsSync(feedPath)) {
  const feed = parseCsv(zlib.gunzipSync(fs.readFileSync(feedPath)).toString('utf8'));
  const byId = new Map(feed.map((row) => [row.aw_product_id, row]));
  for (const offer of mapping.mappings) {
    const row = byId.get(offer.awProductId);
    if (!row) { errors.push(`${offer.offerId}: Produkt fehlt im lokalen Pinolino-Feed.`); continue; }
    check(row.in_stock === '1', `${offer.offerId}: laut Feed nicht lieferbar.`);
    const price = Number(row.search_price);
    if (Math.abs(price - offer.feedEvidence.observedPrice) > 0.01) {
      warnings.push(`${offer.offerId}: Preis im Feed ${price} € statt ${offer.feedEvidence.observedPrice} € (Texte ohne Preisangabe prüfen).`);
    }
  }
} else {
  warnings.push('Kein lokaler Pinolino-Feed: Lagerstatus und Preise nicht abgeglichen.');
}

for (const warning of warnings) console.warn(`Warnung: ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`Fehler: ${error}`);
  process.exit(1);
}
console.log(`Pinolino-Angebots-Gate bestanden: ${mapping.mappings.length} Angebote, ${clickrefs.size} Platzierungen, ${linkCount} Links geprüft.`);
