#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8766';

async function choose(page, name, values) {
  for (const value of values) await page.locator(`input[name="${name}"][value="${value}"]`).check();
  await page.locator('.navigator-primary-button').click();
}

async function run(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/kinderwagen-navigator.html`, { waitUntil: 'networkidle' });

  await page.locator('input[name="search_goal"]').first().waitFor();
  await choose(page, 'search_goal', ['first_combo_from_birth']);
  await choose(page, 'daily_context', ['none_special']);
  await choose(page, 'terrain', ['mixed']);
  await page.locator('input[name="budget"]').fill('1400');
  await page.locator('input[name="budget_mode"][value="orientation"]').check();
  await page.locator('.navigator-primary-button').click();
  await choose(page, 'top_priorities', ['long_use', 'weather']);

  await page.locator('.navigator-live-result').first().waitFor();
  const imageLinks = page.locator('.navigator-product-media__link[data-affiliate="awin"]');
  assert.ok(await imageLinks.count() >= 1, `${width}px: kein freigegebenes Babywalz-Produktbild in den Ergebnissen.`);
  const firstImage = imageLinks.first().locator('img');
  await firstImage.scrollIntoViewIfNeeded();
  await firstImage.evaluate((element) => element.complete && element.naturalWidth > 0
    ? true
    : new Promise((resolve) => {
        element.addEventListener('load', () => resolve(true), { once: true });
        element.addEventListener('error', () => resolve(false), { once: true });
      }));

  const result = await page.evaluate(() => {
    const link = document.querySelector('.navigator-product-media__link[data-affiliate="awin"]');
    const image = link?.querySelector('img');
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      imageLoaded: Boolean(image?.complete && image.naturalWidth > 0),
      imageAlt: image?.alt ?? '',
      host: link ? new URL(link.href).hostname : '',
      rel: link?.rel ?? '',
      offerButtons: document.querySelectorAll('[data-offer-impression] a[href*="awin1.com"]').length
    };
  });
  assert.ok(result.overflow <= 1, `${width}px: horizontaler Overflow von ${result.overflow}px.`);
  assert.equal(result.imageLoaded, true, `${width}px: Babywalz-Produktbild wurde nicht geladen.`);
  assert.ok(result.imageAlt.length > 5, `${width}px: Produktbild ohne Alttext.`);
  assert.equal(result.host, 'www.awin1.com', `${width}px: Bildlink führt nicht über Awin.`);
  assert.ok(result.rel.includes('sponsored') && result.rel.includes('nofollow'), `${width}px: Affiliate-Rel fehlt.`);
  assert.ok(result.offerButtons >= 1, `${width}px: direkter Babywalz-Produktlink fehlt.`);
  assert.deepEqual(errors, [], `${width}px: Browserfehler: ${errors.join(' | ')}`);

  await imageLinks.first().locator('xpath=..').screenshot({ path: `/tmp/kw-kinderwagen-babywalz-${width}.png` });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[390, 844], [1440, 1000]]) await run(browser, width, height);
  console.log('Kinderwagen-Babywalz-UI-Test bestanden: Produktbild und Awin-Kauflink auf 390 und 1440 px.');
} finally {
  await browser.close();
}
