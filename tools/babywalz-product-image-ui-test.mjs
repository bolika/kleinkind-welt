#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8766';
const pages = [
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
  console.log('Babywalz-Produktbild-UI-Test bestanden: Weihnachten und Montessori auf 390 und 1440 px.');
} finally {
  await browser.close();
}
