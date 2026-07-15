#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const routeToFile = (route) => route === '/' ? 'index.html' : `${route.replace(/^\//, '')}.html`;
const normalizeRoute = (href) => {
  try {
    const url = new URL(href, 'https://kleinkind-welt.de');
    if (url.hostname !== 'kleinkind-welt.de') return null;
    let pathname = decodeURIComponent(url.pathname).replace(/\.html$/, '').replace(/\/$/, '');
    return pathname || '/';
  } catch {
    return null;
  }
};

const sitemapRoutes = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => normalizeRoute(match[1]));
const routeSet = new Set(sitemapRoutes);
const linksFrom = new Map();
const linksTo = new Map(sitemapRoutes.map((route) => [route, new Set()]));
const failures = [];

for (const route of sitemapRoutes) {
  const file = routeToFile(route);
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`${route}: local file missing (${file})`);
    continue;
  }
  const html = read(file);
  const targets = new Set(
    [...html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)]
      .map((match) => normalizeRoute(match[1]))
      .filter((target) => target && routeSet.has(target) && target !== route),
  );
  linksFrom.set(route, targets);
  for (const target of targets) linksTo.get(target).add(route);
}

const depths = new Map([['/', 0]]);
const queue = ['/'];
while (queue.length) {
  const source = queue.shift();
  for (const target of linksFrom.get(source) ?? []) {
    if (!depths.has(target)) {
      depths.set(target, depths.get(source) + 1);
      queue.push(target);
    }
  }
}

for (const route of sitemapRoutes) {
  if (route !== '/' && (linksTo.get(route)?.size ?? 0) === 0) failures.push(`${route}: orphan page (0 unique inlinks)`);
  if (!depths.has(route)) failures.push(`${route}: not reachable from homepage`);
  if ((depths.get(route) ?? 99) > 3) failures.push(`${route}: link depth ${depths.get(route)} exceeds 3`);
}

const ageHub = '/spielzeug-nach-alter';
const ageSpokes = [
  '/artikel/spielzeug-0-6-monate',
  '/artikel/spielzeug-6-12-monate',
  '/artikel/spielzeug-12-18-monate',
  '/artikel/spielzeug-18-24-monate',
  '/artikel/spielzeug-2-jahre',
  '/artikel/spielzeug-3-jahre',
];
for (const spoke of ageSpokes) {
  if (!linksFrom.get(ageHub)?.has(spoke)) failures.push(`${ageHub}: missing link to age spoke ${spoke}`);
  if (!linksFrom.get(spoke)?.has(ageHub)) failures.push(`${spoke}: missing contextual backlink to age hub`);
}
for (let index = 0; index < ageSpokes.length - 1; index += 1) {
  const current = ageSpokes[index];
  const next = ageSpokes[index + 1];
  if (!linksFrom.get(current)?.has(next)) failures.push(`${current}: missing next-stage link to ${next}`);
  if (!linksFrom.get(next)?.has(current)) failures.push(`${next}: missing previous-stage link to ${current}`);
}

const totalEdges = [...linksFrom.values()].reduce((sum, targets) => sum + targets.size, 0);
const averageInlinks = sitemapRoutes.length > 1
  ? [...linksTo.entries()].filter(([route]) => route !== '/').reduce((sum, [, sources]) => sum + sources.size, 0) / (sitemapRoutes.length - 1)
  : 0;

if (failures.length) {
  console.error(`Internal-link audit failed (${failures.length}):`);
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Internal-link audit passed: ${sitemapRoutes.length} pages, ${totalEdges} unique internal edges, ${averageInlinks.toFixed(1)} average inlinks, max depth ${Math.max(...depths.values())}.`);
