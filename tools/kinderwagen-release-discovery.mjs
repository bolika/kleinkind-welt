#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data/kinderwagen-navigator');
const registryPath = path.join(dataDir, 'source-registry.v0.1.json');
const outputPath = path.join(dataDir, 'release-candidates.v0.1.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const expansion = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog-expansion.v0.2.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const publishedProducts = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8'))
);
const write = process.argv.includes('--write');
const sourceArg = process.argv.find((value) => value.startsWith('--source='));
const requestedSource = sourceArg?.split('=')[1];
const timeoutMs = 15000;

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?\s*<\/loc>/gis)]
    .map((match) => match[1].trim().replaceAll('&amp;', '&'));
}

function slug(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const knownModels = [
  ...publishedProducts.map((product) => ({
    id: product.productId,
    brand: slug(product.identity.brand),
    model: slug(product.identity.model)
  })),
  ...expansion.candidates.map((candidate) => ({
    id: candidate.canonicalModelId,
    brand: slug(candidate.brand),
    model: slug(candidate.model)
  }))
].sort((a, b) => b.model.length - a.model.length);

function canonicalModelHint(source, url) {
  const normalizedUrl = slug(decodeURIComponent(url));
  const sourceBrand = slug(source.name);
  const matchesSourceBrand = (candidate) =>
    sourceBrand.includes(candidate.brand) || candidate.brand.includes(slug(source.id.replace(/-de$/, '')));
  return knownModels.find((candidate) => matchesSourceBrand(candidate) && normalizedUrl.includes(candidate.model))?.id ?? null;
}

function canonicalGroup(source, url) {
  if (!source.canonicalPrefixPattern && !source.variantSuffixPattern) return null;
  let name = decodeURIComponent(new URL(url).pathname).split('/').filter(Boolean).at(-1) ?? '';
  if (source.canonicalPrefixPattern) name = name.replace(new RegExp(source.canonicalPrefixPattern, 'i'), '');
  if (source.canonicalTokenPattern) name = name.replace(new RegExp(source.canonicalTokenPattern, 'gi'), '');
  if (source.variantSuffixPattern) name = name.replace(new RegExp(source.variantSuffixPattern, 'i'), '');
  name = name.replace(/-{2,}/g, '-').replace(/^-|-$/g, '');
  return name ? `${source.id}:${slug(name)}` : null;
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; KleinkindWeltReleaseMonitor/0.1; +https://kleinkind-welt.de/ueber-uns)',
        'accept': 'application/xml,text/xml,text/plain;q=0.9,*/*;q=0.5'
      },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const decoded = bytes[0] === 0x1f && bytes[1] === 0x8b ? gunzipSync(bytes) : bytes;
    return decoded.toString('utf8');
  } finally {
    clearTimeout(timeout);
  }
}

async function candidatesFor(source) {
  const first = await fetchText(source.discoveryUrl);
  const firstLocs = locs(first);
  const isSitemap = (url) => /\.xml(?:\.gz)?(?:$|\?)/i.test(url);
  const sitemapLocs = firstLocs.filter(isSitemap);
  const pages = firstLocs.filter((url) => !isSitemap(url));
  const likelyProductSitemaps = sitemapLocs
    .sort((a, b) => {
      const relevance = (url) => (/(product|produkt|kinderwagen|buggy|stroller)/i.test(url) ? 2 : 0) + (/(?:\/|_|-)de(?:\/|_|-|\.|$)/i.test(url) ? 1 : 0);
      return relevance(b) - relevance(a);
    })
    .slice(0, 8);
  const nested = [];
  for (const sitemapUrl of likelyProductSitemaps) {
    try {
      nested.push(...locs(await fetchText(sitemapUrl)));
    } catch (error) {
      console.error(`WARN ${source.id}: ${sitemapUrl} konnte nicht gelesen werden (${error.message})`);
    }
  }
  const keywordPattern = new RegExp(source.candidatePattern, 'i');
  const pathPattern = source.candidatePathPattern ? new RegExp(source.candidatePathPattern, 'i') : null;
  const excludePattern = source.candidateExcludePattern ? new RegExp(source.candidateExcludePattern, 'i') : null;
  return [...new Set([...pages, ...nested])]
    .filter((url) => keywordPattern.test(url) && (!pathPattern || pathPattern.test(url)) && (!excludePattern || !excludePattern.test(url)))
    .map((url) => ({
      sourceId: source.id,
      url,
      canonicalModelHint: canonicalModelHint(source, url),
      canonicalGroup: canonicalGroup(source, url),
      status: 'candidate_needs_review'
    }));
}

const selected = (registry.sources ?? []).filter((source) =>
  source.automatedDiscovery && source.discoveryUrl && (!requestedSource || source.id === requestedSource)
);
if (requestedSource && !selected.length) {
  console.error(`ERROR Quelle ${requestedSource} ist unbekannt oder nicht für automatische Discovery freigegeben.`);
  process.exit(1);
}

const candidates = [];
for (const source of selected) {
  try {
    const found = await candidatesFor(source);
    candidates.push(...found);
    console.log(`${source.id}: ${found.length} mögliche Produktseiten gefunden`);
  } catch (error) {
    console.error(`WARN ${source.id}: Discovery fehlgeschlagen (${error.message})`);
  }
}

const grouped = new Map();
for (const candidate of candidates) {
  const key = candidate.canonicalModelHint ? `${candidate.sourceId}:${candidate.canonicalModelHint}` : candidate.canonicalGroup ?? candidate.url;
  const current = grouped.get(key);
  if (!current) {
    grouped.set(key, { ...candidate, variantUrls: [candidate.url] });
    continue;
  }
  current.variantUrls.push(candidate.url);
  if (candidate.url.length < current.url.length) current.url = candidate.url;
}
const unique = [...grouped.values()]
  .map((candidate) => ({ ...candidate, variantUrls: [...new Set(candidate.variantUrls)].sort() }))
  .sort((a, b) => a.sourceId.localeCompare(b.sourceId) || (a.canonicalModelHint ?? a.url).localeCompare(b.canonicalModelHint ?? b.url));
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  registryVersion: registry.registryVersion,
  candidates: unique
};

if (write) {
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${unique.length} ungeprüfte Kandidaten nach ${path.relative(root, outputPath)} geschrieben.`);
} else {
  console.log(`${unique.length} ungeprüfte Kandidaten insgesamt. Mit --write wird die Review-Queue aktualisiert.`);
}
