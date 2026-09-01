#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8766';
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'data/affiliate-offers/babywalz.mapping.v0.1.json'), 'utf8'));
const pages = [
  { path: '/artikel/spielzeug-unter-20-euro.html', offers: 3, firstScope: '#greifen' },
  { path: '/artikel/geschenke-1-jahr.html', offers: 3, firstScope: '#geschenk-losziehen' },
  { path: '/artikel/geschenke-2-jahre.html', offers: 3, firstScope: '#duplo-steinebox' },
  { path: '/artikel/geschenke-3-jahre.html', offers: 4, firstScope: '#produkt-duplo-deluxe' },
  { path: '/artikel/spielzeug-0-6-monate.html', offers: 4, firstScope: '#produkt-spielbogen' },
  { path: '/artikel/spielzeug-6-12-monate.html', offers: 4, firstScope: '#produkt-greifling' },
  { path: '/artikel/spielzeug-12-18-monate.html', offers: 4, firstScope: '#produkt-lauflernwagen' },
  { path: '/artikel/spielzeug-18-24-monate.html', offers: 4, firstScope: '#produkt-formensortierer' },
  { path: '/artikel/spielzeug-2-jahre.html', offers: 3, firstScope: '#produkt-duplo-steinebox' },
  { path: '/artikel/spielzeug-3-jahre.html', offers: 3, firstScope: '#produkt-duplo-deluxe' },
  { path: '/artikel/weihnachtsgeschenke-kleinkind.html', offers: 3, firstScope: '#produkt-lauflernwagen' },
  { path: '/artikel/montessori-spielzeug-kleinkind.html', offers: 3, firstScope: '#produkt-montessori-einstieg' }
];

async function checkPage(browser, spec, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}${spec.path}`, { waitUntil: 'networkidle' });
  await page.locator('.kw-offer-media').first().waitFor();

  const pagePlacements = mapping.mappings.flatMap((offer) => offer.placements ?? [])
    .filter((placement) => `/${placement.page}` === spec.path);
  for (const placement of pagePlacements) {
    const link = page.locator(`a[data-clickref="${placement.clickref}"]`);
    assert.equal(await link.count(), 1, `${spec.path}: ${placement.clickref} fehlt.`);
    assert.equal(await link.evaluate((element, scopeId) => document.getElementById(scopeId)?.contains(element) === true, placement.scopeId), true,
      `${spec.path}: ${placement.clickref} liegt nicht in #${placement.scopeId}.`);
  }

  assert.equal(await page.locator('.kw-offer-media').count(), spec.offers, `${spec.path} ${width}px: unerwartete Bildanzahl.`);
  assert.equal(await page.locator('.kw-live-offer').count(), spec.offers, `${spec.path} ${width}px: unerwartete Preisanzahl.`);
  for (const image of await page.locator('.kw-offer-media img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.complete && element.naturalWidth > 0
      ? true
      : new Promise((resolve) => {
          element.addEventListener('load', () => resolve(true), { once: true });
          element.addEventListener('error', () => resolve(false), { once: true });
        }));
  }

  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    imagesLoaded: [...document.querySelectorAll('.kw-offer-media img')].every((image) => image.complete && image.naturalWidth > 0),
    validAlt: [...document.querySelectorAll('.kw-offer-media img')].every((image) => image.alt.trim().length > 5),
    ctasTallEnough: [...document.querySelectorAll('.produkt-box.has-fresh-babywalz-offer a[data-merchant="babywalz"]')]
      .every((link) => link.getBoundingClientRect().height >= 42)
  }));
  assert.ok(layout.overflow <= 1, `${spec.path} ${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.equal(layout.imagesLoaded, true, `${spec.path} ${width}px: Feed-Bild nicht geladen.`);
  assert.equal(layout.validAlt, true, `${spec.path} ${width}px: Feed-Bild ohne Alttext.`);
  assert.equal(layout.ctasTallEnough, true, `${spec.path} ${width}px: CTA zu klein.`);
  assert.deepEqual(errors, [], `${spec.path} ${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.locator(spec.firstScope).screenshot({ path: `/tmp/kw-babywalz-${spec.path.split('/').pop().replace('.html', '')}-${width}.png` });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const spec of pages) {
    for (const [width, height] of [[390, 844], [1440, 1000]]) await checkPage(browser, spec, width, height);
  }
  console.log(`Babywalz-Produktbild-UI-Test bestanden: ${pages.length} Seiten auf 390 und 1440 px.`);
} finally {
  await browser.close();
}
