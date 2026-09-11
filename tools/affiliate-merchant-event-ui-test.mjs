#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8767';
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route(/plausible\.io/, route => route.abort());
  await page.addInitScript(() => {
    window.__plausibleEvents = [];
    window.plausible = (name, options) => window.__plausibleEvents.push({ name, options });
  });
  await page.addInitScript(() => {
    document.addEventListener('click', (event) => {
      if (event.target.closest('a[data-affiliate]')) event.preventDefault();
    }, true);
  });

  async function assertClick(selector, expectedMerchantEvent) {
    await page.evaluate(() => { window.__plausibleEvents = []; });
    await page.locator(selector).first().dispatchEvent('click');
    const events = await page.evaluate(() => window.__plausibleEvents);
    assert.deepEqual(events.map((event) => event.name), ['Affiliate-Klick', expectedMerchantEvent]);
    assert.equal(events[1].options?.interactive, false, `${expectedMerchantEvent} muss nicht-interaktiv sein.`);
  }

  await page.goto(`${baseUrl}/artikel/spielzeug-unter-20-euro.html`, { waitUntil: 'networkidle' });
  await assertClick('a[data-merchant="babywalz"]', 'Affiliate-Babywalz');
  await page.goto(`${baseUrl}/artikel/geschenke-zur-geburt.html`, { waitUntil: 'networkidle' });
  await assertClick('a[data-affiliate="amazon"]', 'Affiliate-Amazon');
  await page.close();
  console.log('Affiliate-Händler-UI-Test bestanden: Gesamtziel plus genau ein nicht-interaktives Händlerziel.');
} finally {
  await browser.close();
}
