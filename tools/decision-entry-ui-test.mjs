import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:8878';
const slug = 'geschenke-3-jahre';
const original = execFileSync('git', ['show', `HEAD:artikel/${slug}.html`], { encoding: 'utf8' });
// Fixture dates exercise fresh-offer layout, not current merchant availability.
const fixture = JSON.parse(fs.readFileSync('data/affiliate-offers/babywalz-prices.v0.1.json', 'utf8'));
fixture.generatedAt = new Date(Date.now() - 60000).toISOString();
fixture.freshUntil = new Date(Date.now() + 3600000).toISOString();
const browser = await chromium.launch();
try {
  for (const width of [360, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await page.route(/plausible\.io/, route => route.abort());
    await page.route('**/data/affiliate-offers/babywalz-prices.v0.1.json', route => route.fulfill({ json: fixture }));
    const url = `${base}/artikel/${slug}.html`;
    await page.route(url, route => route.fulfill({ contentType: 'text/html', body: original }));
    await page.goto(url, { waitUntil: 'networkidle' });
    const before = await page.locator('a[data-affiliate]:visible').first().evaluate(el => el.getBoundingClientRect().top + scrollY);
    await page.unroute(url);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.comparison-jumps a').count(), 3);
    assert.equal(await page.locator('.produkt-box').count(), 6);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const missing = await page.locator('main a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(a.hash.slice(1))).map(a => a.hash));
    assert.deepEqual(missing, []);
    for (const img of await page.locator('.kw-offer-media img').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
    }
    const cta = page.locator('#produkt-duplo-deluxe a.btn-amazon');
    assert.ok((await cta.boundingBox()).height >= 44);
    const after = await cta.evaluate(el => el.getBoundingClientRect().top + scrollY);
    assert.ok(after < before, `${width}: merchant CTA should be earlier (${before} -> ${after})`);
    await page.locator('.comparison-jumps a').nth(1).click();
    await page.waitForTimeout(350);
    assert.ok(await page.locator('#produkt-erster-obstgarten').evaluate(el => el.getBoundingClientRect().top >= 60));
    await page.locator('#produkt-duplo-deluxe').screenshot({ path: `/tmp/kw-gift3-card-${width}.png` });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `/tmp/kw-gift3-entry-${width}.png` });
    console.log(JSON.stringify({ width, firstMerchantBefore: Math.round(before), firstMerchantAfter: Math.round(after) }));
    await page.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(`${base}/artikel/${slug}.html`);
  assert.equal(await page.locator('.comparison-jumps a').count(), 3);
  assert.equal(await page.locator('#produkt-duplo-deluxe a[data-merchant="babywalz"]').count(), 1);
  console.log('Decision entry passed: four viewports, feed images, earlier CTA, anchors and no-JS links.');
} finally { await browser.close(); }
