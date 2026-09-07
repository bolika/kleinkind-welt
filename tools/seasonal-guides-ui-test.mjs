#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:8878';
const snapshot = JSON.parse(fs.readFileSync('data/affiliate-offers/babywalz-prices.v0.1.json', 'utf8'));
// Fixed freshness and stock isolate layout from the daily merchant feed.
snapshot.generatedAt = new Date(Date.now() - 60000).toISOString();
snapshot.freshUntil = new Date(Date.now() + 3600000).toISOString();
for (const offer of Object.values(snapshot.offers)) offer.availability = 'in_stock';
const browser = await chromium.launch();
try {
  for (const width of [390, 1440]) {
    for (const slug of ['weihnachtsgeschenke-kleinkind', 'adventskalender-kleinkind', 'nikolausgeschenke-kleinkind']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('**/data/affiliate-offers/babywalz-prices.v0.1.json', route => route.fulfill({ json: snapshot }));
      await page.goto(`${base}/artikel/${slug}.html`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1);
      const expected = slug.startsWith('advent') ? 0 : 3;
      assert.equal(await page.locator('.produkt-box').count(), expected);
      assert.equal(await page.locator('.kw-offer-media').count(), expected);
      if (!expected) assert.equal(await page.locator('.season-moments li').count(), 24);
      for (const img of await page.locator('.kw-offer-media img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(image => image.decode());
        assert.ok(await img.evaluate(image => image.naturalWidth > 0));
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug}: overflow at ${width}`);
      const missing = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => a.hash.length > 1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.hash));
      assert.deepEqual(missing, [], `${slug}: missing anchor`);
      assert.deepEqual(errors, [], `${slug}: script error`);
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `/tmp/kw-${slug}-${width}.png` });
      await page.close();
    }
  }
  console.log('Seasonal UI passed: three pages, two viewports, product images and 24 moments.');
} finally {
  await browser.close();
}
