#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8766';
const articleUrl = `${baseUrl}/artikel/spielzeug-unter-20-euro.html`;

async function testViewport(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(articleUrl, { waitUntil: 'networkidle' });
  await page.locator('.kw-live-offer').first().waitFor();

  for (const image of await page.locator('.kw-offer-media img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((element) => element.complete && element.naturalWidth > 0
      ? true
      : new Promise((resolve) => {
          element.addEventListener('load', () => resolve(true), { once: true });
          element.addEventListener('error', () => resolve(false), { once: true });
        }));
  }

  assert.equal(await page.locator('.kw-live-offer').count(), 3, `${width}px: drei Preiszeilen erwartet.`);
  assert.equal(await page.locator('.kw-offer-media').count(), 3, `${width}px: drei freigegebene Produktbilder erwartet.`);
  assert.equal(await page.locator('.has-fresh-babywalz-offer').count(), 3, `${width}px: drei priorisierte Babywalz-Angebote erwartet.`);
  assert.equal(await page.locator('#greifen .kw-live-offer-total').textContent(), 'Gesamt inkl. Versand: 14,89 €');
  assert.equal(await page.locator('#greifen .kw-live-offer-details').textContent(), 'Produkt 9,90 € + Versand 4,99 €');
  assert.equal(await page.locator('#greifen .kw-offer-primary').textContent(), 'Bei Babywalz ansehen');
  assert.equal(await page.locator('#greifen a[data-affiliate="amazon"]').isHidden(), true, `${width}px: Amazon darf bei frischem Babywalz-Angebot nicht gleichzeitig sichtbar sein.`);

  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    visibleMerchantButtons: [...document.querySelectorAll('.pilot-actions a[data-affiliate]')].filter((link) => link.getClientRects().length > 0).length,
    primaryHeight: document.querySelector('#greifen .kw-offer-primary').getBoundingClientRect().height,
    productImageAlt: document.querySelector('#greifen .kw-offer-media img').alt,
    productImagesLoaded: [...document.querySelectorAll('.kw-offer-media img')].every((image) => image.complete && image.naturalWidth > 0),
    totalVisible: [...document.querySelectorAll('.kw-live-offer-total')].every((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    })
  }));
  assert.ok(layout.overflow <= 1, `${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.equal(layout.visibleMerchantButtons, 3, `${width}px: pro Produkt darf nur ein Händler-CTA sichtbar sein.`);
  assert.ok(layout.primaryHeight >= 48, `${width}px: primärer Händler-CTA ist zu klein.`);
  assert.equal(layout.productImageAlt, 'Badabulle Stapelbecher Silikon 7tlg.', `${width}px: Produktbild hat keinen feedbasierten Alttext.`);
  assert.equal(layout.productImagesLoaded, true, `${width}px: mindestens ein Feed-Produktbild konnte nicht geladen werden.`);
  assert.equal(layout.totalVisible, true, `${width}px: Preistext ist nicht vollständig sichtbar.`);
  assert.deepEqual(errors, [], `${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.locator('#greifen').screenshot({ path: `/tmp/kw-u20-babywalz-${width}.png` });
  await page.close();
}

async function testStaleFallback(browser) {
  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'data/affiliate-offers/babywalz-prices.v0.1.json'), 'utf8'));
  snapshot.generatedAt = '2026-08-20T08:00:00.000Z';
  snapshot.freshUntil = '2026-08-22T08:00:00.000Z';

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/data/affiliate-offers/babywalz-prices.v0.1.json', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(snapshot)
  }));
  await page.goto(articleUrl, { waitUntil: 'networkidle' });

  assert.equal(await page.locator('.kw-live-offer').count(), 0, 'Veraltete Preise dürfen nicht erscheinen.');
  assert.equal(await page.locator('.kw-offer-media').count(), 0, 'Veraltete Feed-Daten dürfen keine Produktbilder ausspielen.');
  assert.equal(await page.locator('.has-fresh-babywalz-offer').count(), 0, 'Veraltete Preise dürfen keine CTA-Priorität ändern.');
  assert.equal(await page.locator('#greifen a[data-affiliate="amazon"]').textContent(), 'Preis bei Amazon prüfen');
  const fallback = await page.evaluate(() => {
    const babywalz = document.querySelector('#greifen a[data-merchant="babywalz"]');
    const amazon = document.querySelector('#greifen a[data-affiliate="amazon"]');
    return {
      babywalzHidden: babywalz.hidden,
      amazonVisible: amazon.getClientRects().length > 0,
      visibleMerchantButtons: [...document.querySelectorAll('.pilot-actions a[data-affiliate]')].filter((link) => link.getClientRects().length > 0).length
    };
  });
  assert.equal(fallback.babywalzHidden, true, 'Ohne frisches Angebot muss Babywalz verborgen bleiben.');
  assert.equal(fallback.amazonVisible, true, 'Ohne frisches Babywalz-Angebot muss Amazon als Fallback erscheinen.');
  assert.equal(fallback.visibleMerchantButtons, 3, 'Auch im Fallback darf pro Produkt nur ein Händler-CTA sichtbar sein.');
  assert.deepEqual(errors, [], `Fallback erzeugt Browserfehler: ${errors.join(' | ')}`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [[390, 844], [768, 1024], [1440, 1100]]) {
    await testViewport(browser, viewport[0], viewport[1]);
  }
  await testStaleFallback(browser);
  console.log('Babywalz-Preis-UI-Test bestanden: ein sichtbarer Händler pro Produkt auf 390, 768 und 1440 px sowie Amazon-Fallback.');
} finally {
  await browser.close();
}
