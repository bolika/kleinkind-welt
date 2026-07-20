#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ledgerPath = path.join(root, "data", "affiliate-product-ledger.json");
const args = new Set(process.argv.slice(2));
const resolveLinks = args.has("--resolve");
const strict = args.has("--strict");
const asJson = args.has("--json");

function walk(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "kleinkind-welt.de-audit"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(absolute));
    else if (entry.isFile() && entry.name.endsWith(".html")) result.push(absolute);
  }
  return result;
}

function shortCode(url) {
  return url.match(/^https?:\/\/amzn\.to\/([A-Za-z0-9]+)/i)?.[1] || null;
}

function cleanText(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractLinks(file) {
  const html = fs.readFileSync(file, "utf8");
  const matches = [];
  const pattern = /<a\b[^>]*href=["'](https?:\/\/amzn\.to\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = pattern.exec(html))) {
    const code = shortCode(match[1]);
    if (!code) continue;
    matches.push({
      code,
      url: match[1],
      text: cleanText(match[2]),
      page: "/" + path.relative(root, file).replaceAll(path.sep, "/").replace(/\.html$/, "")
    });
  }
  return matches;
}

async function resolve(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "kleinkind-welt-affiliate-integrity/1.0" }
    });
    return { status: response.status, finalUrl: response.url };
  } catch (error) {
    return { status: null, error: error.message };
  }
}

const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
const ledgerByCode = new Map(ledger.entries.map((entry) => [entry.shortCode, entry]));
const links = walk(root).flatMap(extractLinks);
const byCode = new Map();

for (const link of links) {
  if (!byCode.has(link.code)) byCode.set(link.code, { code: link.code, url: link.url, occurrences: [] });
  byCode.get(link.code).occurrences.push(link);
}

const items = [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));
const resolvedByCode = new Map();
if (resolveLinks) {
  for (let index = 0; index < items.length; index += 8) {
    const batch = items.slice(index, index + 8);
    await Promise.all(batch.map(async function (item) {
      resolvedByCode.set(item.code, await resolve(item.url));
    }));
  }
}

const rows = [];
for (const item of items) {
  const entry = ledgerByCode.get(item.code);
  const row = {
    code: item.code,
    occurrences: item.occurrences.length,
    pages: [...new Set(item.occurrences.map((occurrence) => occurrence.page))],
    sampleText: item.occurrences.map((occurrence) => occurrence.text).find(Boolean) || "",
    ledgerStatus: entry?.status || "missing-ledger-entry"
  };
  if (resolveLinks) Object.assign(row, resolvedByCode.get(item.code));
  rows.push(row);
}

const summary = {
  uniqueAmazonLinks: rows.length,
  totalOccurrences: links.length,
  ledgerEntries: ledger.entries.length,
  missingLedgerEntries: rows.filter((row) => row.ledgerStatus === "missing-ledger-entry").length,
  blockedEntries: rows.filter((row) => row.ledgerStatus.startsWith("blocked-")).length,
  unresolvedLedgerEntries: rows.filter((row) => row.ledgerStatus === "needs-review" || row.ledgerStatus === "missing-ledger-entry").length,
  non200: resolveLinks ? rows.filter((row) => row.status !== 200).length : null
};

if (asJson) {
  console.log(JSON.stringify({ summary, rows }, null, 2));
} else {
  console.log("Affiliate Integrity Check");
  console.log("Unique Amazon links: " + summary.uniqueAmazonLinks);
  console.log("Occurrences: " + summary.totalOccurrences);
  console.log("Ledger entries: " + summary.ledgerEntries);
  console.log("Missing ledger entries: " + summary.missingLedgerEntries);
  console.log("Blocked ledger entries: " + summary.blockedEntries);
  if (resolveLinks) console.log("Non-200/failed resolutions: " + summary.non200);
  console.log("");
  for (const row of rows) {
    const detail = resolveLinks ? " | HTTP " + (row.status ?? "error") : "";
    console.log(row.ledgerStatus.padEnd(28) + " " + row.code.padEnd(10) + " " + row.pages.join(", ") + detail);
  }
}

if (strict && (summary.missingLedgerEntries > 0 || summary.blockedEntries > 0 || (resolveLinks && summary.non200 > 0))) {
  process.exitCode = 1;
}
