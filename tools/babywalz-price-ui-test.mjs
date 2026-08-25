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

  assert.equal(await page.locator('.kw-live-offer').count(), 9, `${width}px: neun Preiszeilen erwartet.`);
  assert.equal(await page.locator('.has-fresh-babywalz-offer').count(), 9, `${width}px: neun priorisierte Babywalz-Angebote erwartet.`);
  assert.equal(await page.locator('#stapelbecher .kw-live-offer-total').textContent(), 'Gesamt inkl. Versand: 14,89 €');
  assert.equal(await page.locator('#stapelbecher .kw-live-offer-details').textContent(), 'Produkt 9,90 € + Versand 4,99 €');
  assert.equal(await page.locator('#stapelbecher .kw-offer-secondary').textContent(), 'Amazon-Preis prüfen');
  assert.equal(await page.locator('#stapelbecher .kw-offer-primary').textContent(), 'Bei Babywalz ansehen');

  const layout = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    primaryOrder: getComputedStyle(document.querySelector('#stapelbecher .kw-offer-primary')).order,
    secondaryOrder: getComputedStyle(document.querySelector('#stapelbecher .kw-offer-secondary')).order,
    primaryWidth: document.querySelector('#stapelbecher .kw-offer-primary').getBoundingClientRect().width,
    secondaryWidth: document.querySelector('#stapelbecher .kw-offer-secondary').getBoundingClientRect().width,
    compactPrimaryTop: document.querySelector('#hammer-stoepsel .kw-offer-primary').getBoundingClientRect().top,
    compactSecondaryTop: document.querySelector('#hammer-stoepsel .kw-offer-secondary').getBoundingClientRect().top,
    compactPriceRects: ['.kw-live-offer-total', '.kw-live-offer-details', '.kw-live-offer-checked'].map((selector) => {
      const box = document.querySelector(`#hammer-stoepsel ${selector}`).getBoundingClientRect();
      return { top: box.top, right: box.right, bottom: box.bottom, left: box.left };
    }),
    totalVisible: [...document.querySelectorAll('.kw-live-offer-total')].every((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    })
  }));
  assert.ok(layout.overflow <= 1, `${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.ok(Number(layout.primaryOrder) < Number(layout.secondaryOrder), `${width}px: Babywalz muss visuell vor Amazon stehen.`);
  assert.ok(Math.abs(layout.primaryWidth - layout.secondaryWidth) < 1, `${width}px: CTA-Breiten weichen voneinander ab.`);
  if (width > 768) {
    assert.ok(Math.abs(layout.compactPrimaryTop - layout.compactSecondaryTop) < 1, `${width}px: Desktop-CTAs stehen nicht nebeneinander.`);
    const [totalRect, detailsRect, checkedRect] = layout.compactPriceRects;
    assert.ok(totalRect.right <= checkedRect.left, `${width}px: Gesamtpreis und Aktualisierungsstand überlappen.`);
    assert.ok(detailsRect.top >= Math.max(totalRect.bottom, checkedRect.bottom) - 1, `${width}px: Preisaufschlüsselung überlappt die erste Zeile.`);
  }
  assert.equal(layout.totalVisible, true, `${width}px: Preistext ist nicht vollständig sichtbar.`);
  assert.deepEqual(errors, [], `${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.locator('#stapelbecher').screenshot({ path: `/tmp/kw-u20-babywalz-${width}.png` });
  if (width > 768) {
    await page.locator('#hammer-stoepsel').screenshot({ path: `/tmp/kw-u20-babywalz-compact-${width}.png` });
  }
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
  assert.equal(await page.locator('.has-fresh-babywalz-offer').count(), 0, 'Veraltete Preise dürfen keine CTA-Priorität ändern.');
  assert.equal(await page.locator('#stapelbecher a[data-affiliate="amazon"]').textContent(), 'Bei Amazon ansehen');
  assert.deepEqual(errors, [], `Fallback erzeugt Browserfehler: ${errors.join(' | ')}`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [[390, 844], [768, 1024], [1440, 1100]]) {
    await testViewport(browser, viewport[0], viewport[1]);
  }
  await testStaleFallback(browser);
  console.log('Babywalz-Preis-UI-Test bestanden: 390, 768 und 1440 px sowie Veraltet-Fallback.');
} finally {
  await browser.close();
}
