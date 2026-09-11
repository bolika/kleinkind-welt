#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:8878';
const browser = await chromium.launch();
try {
  for (const width of [360, 390, 768, 1440]) {
    for (const path of ['artikel/geschenke-2-jahre', 'geschenke-kleinkind', 'artikel/montessori-spielzeug-kleinkind']) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.route(/plausible\.io/, r => r.abort());
      await page.goto(`${base}/${path}.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${path} overflow ${width}`);
      assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links => links.filter(a => a.hash.length > 1 && !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.hash)), []);
      if (path === 'artikel/geschenke-2-jahre') {
        assert.equal(await page.locator('.kw-product-stack > article').count(), 3);
        const first = page.locator('.kw-product-actions [data-affiliate]').first();
        const y = await first.evaluate(el => el.getBoundingClientRect().top + scrollY);
        assert.ok(y < 1800, `First merchant CTA too late: ${y}`);
        console.log('gift2', width, 'first CTA', Math.round(y));
        assert.ok(await page.locator('.affiliate-hinweis').evaluate(el => el.getBoundingClientRect().top) < y);
        await page.locator('.gift-moments a').nth(2).click();
        assert.equal(new URL(page.url()).hash, '#ravensburger-puzzle');
        await page.locator('.gift-more summary').click();
        assert.equal(await page.locator('.gift-more').evaluate(el => el.open), true);
        for (const a of await page.locator('.kw-product-actions [data-affiliate]').all()) {
          assert.match(await a.getAttribute('rel'), /sponsored/);
          assert.ok(await a.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'CTA text overflow');
        }
        const graph = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent())['@graph'];
        const faq = await page.locator('.faq-item').evaluateAll(items => items.map(e => [e.querySelector('h3').textContent, e.querySelector('p').textContent]));
        assert.deepEqual(faq, graph.find(e => e['@type'] === 'FAQPage').mainEntity.map(e => [e.name, e.acceptedAnswer.text]));
        assert.deepEqual(await page.locator('.kw-product-card h3').allTextContents(), graph.find(e => e['@type'] === 'ItemList').itemListElement.map(e => e.name));
        await page.locator('.gift-more summary').click();
      }
      if (path === 'geschenke-kleinkind') {
        assert.ok(await page.locator('.gift-finder-links a').first().evaluate(el => el.getBoundingClientRect().top) < 700, 'First age choice too late');
      }
      for (const image of await page.locator('.kw-offer-media img').all()) {
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(el => el.decode());
      }
      assert.deepEqual(errors, []);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/kw-growth-${path.replace('artikel/', '')}-${width}-viewport.png` });
      await page.screenshot({ path: `/tmp/kw-growth-${path.replace('artikel/', '')}-${width}.png`, fullPage: true });
      await page.close();
    }
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(`${base}/artikel/geschenke-2-jahre.html`);
  assert.equal(await page.locator('.kw-product-stack [data-affiliate]').count(), 3);
  await page.locator('.gift-more summary').click();
  assert.ok(await page.locator('#spielzeugkueche').isVisible());
  console.log('Growth selection UI passed: 3 pages, 4 widths, anchors, FAQ/schema, media, no-JS choices.');
} finally {
  await browser.close();
}
