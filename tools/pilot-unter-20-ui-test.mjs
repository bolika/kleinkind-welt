#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765';
const pilotUrl = `${baseUrl}/pilot/spielzeug-unter-20-euro.html`;

const now = Date.now();
const snapshot = {
  schemaVersion: 1,
  generatedAt: new Date(now - 60 * 60 * 1000).toISOString(),
  freshUntil: new Date(now + 60 * 60 * 1000).toISOString(),
  priceIncludesShipping: true,
  offers: {
    'babywalz-8390215': { availability: 'in_stock', currency: 'EUR', productPrice: 9.9, shipping: 4.99, totalPrice: 14.89 },
    'babywalz-7412835': { availability: 'in_stock', currency: 'EUR', productPrice: 12.29, shipping: 4.99, totalPrice: 17.28 },
    'babywalz-8293872': { availability: 'in_stock', currency: 'EUR', productPrice: 5.99, shipping: 4.99, totalPrice: 10.98 }
  }
};

async function checkViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/data/affiliate-offers/babywalz-prices.v0.1.json', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(snapshot)
  }));

  await page.goto(pilotUrl, { waitUntil: 'networkidle' });
  await page.locator('.kw-live-offer').first().waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));

  assert.equal(await page.locator('h1').count(), 1, `${width}px: genau eine H1 erwartet.`);
  assert.equal(await page.locator('.pilot-product').count(), 3, `${width}px: genau drei Empfehlungen erwartet.`);
  assert.equal(await page.locator('.kw-live-offer').count(), 3, `${width}px: genau drei frische Gesamtpreise erwartet.`);
  assert.equal(await page.locator('a[data-merchant="babywalz"]').count(), 3, `${width}px: drei Babywalz-Ziele erwartet.`);
  assert.equal(await page.locator('a[data-affiliate="amazon"]').count(), 3, `${width}px: drei Amazon-Vergleiche erwartet.`);

  const layout = await page.evaluate(() => {
    const primaryButton = document.querySelector('.pilot-product--primary .pilot-btn--primary');
    const primaryBox = primaryButton.getBoundingClientRect();
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      scrollY: window.scrollY,
      primaryButtonTop: primaryBox.top,
      primaryButtonHeight: primaryBox.height,
      primaryButtonVisible: primaryBox.width > 0 && primaryBox.height > 0,
      noTinyButtons: [...document.querySelectorAll('.pilot-btn')].every((button) => button.getBoundingClientRect().height >= 48),
      skipOpacity: getComputedStyle(document.querySelector('.pilot-skip')).opacity
    };
  });

  await page.screenshot({ path: `/tmp/kw-u20-pilot-fold-${width}.png` });

  assert.ok(layout.overflow <= 1, `${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.equal(layout.primaryButtonVisible, true, `${width}px: primärer Händler-CTA ist nicht sichtbar.`);
  assert.equal(layout.noTinyButtons, true, `${width}px: mindestens ein Händler-CTA ist kleiner als 48px.`);
  assert.equal(layout.skipOpacity, '0', `${width}px: Skip-Link ist ohne Fokus sichtbar.`);
  if (width <= 390) assert.ok(layout.primaryButtonTop < 900, `${width}px: primärer CTA erscheint mit ${layout.primaryButtonTop}px zu spät (scrollY ${layout.scrollY}px).`);

  const firstDetails = page.locator('.pilot-essentials details').first();
  await firstDetails.locator('summary').click();
  assert.equal(await firstDetails.getAttribute('open'), '', `${width}px: Details lassen sich nicht öffnen.`);
  await page.locator('.pilot-skip').focus();
  assert.equal(await page.locator('.pilot-skip').evaluate((element) => getComputedStyle(element).opacity), '1', `${width}px: Skip-Link wird bei Fokus nicht sichtbar.`);
  await page.locator('.pilot-skip').evaluate((element) => element.blur());
  assert.deepEqual(errors, [], `${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.screenshot({ path: `/tmp/kw-u20-pilot-${width}.png`, fullPage: true });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await checkViewport(browser, 390, 844);
  await checkViewport(browser, 1440, 1100);
  console.log('Pilot-UI-Test bestanden: 390 und 1440 px, Preislogik, CTAs und Details geprüft.');
} finally {
  await browser.close();
}
