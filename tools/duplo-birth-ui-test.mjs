#!/usr/bin/env node
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.BASE_URL || 'http://127.0.0.1:8878';
const slugs = ['duplo-vergleich', 'geschenke-zur-geburt'];
const browser = await chromium.launch();
try {
  for (const width of [360, 390, 768, 1440]) {
    for (const slug of slugs) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      // Local layout testing must not send our QA visits to analytics.
      await page.route(/plausible\.io/, route => route.abort());
      await page.goto(`${base}/artikel/${slug}.html`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const heroRequests = await page.evaluate(slug => performance.getEntriesByType('resource')
        .filter(entry => new URL(entry.name).pathname.match(new RegExp(`/images/articles/${slug}(?:-\\d+)?\\.(?:webp|jpg)$`)))
        .map(entry => entry.name), slug);
      assert.equal(heroRequests.length, 1, `${slug}: only one responsive hero request at ${width}: ${heroRequests}`);
      assert.equal(await page.locator('main h1').count(), 1);
      assert.equal(await page.locator('main .ki-badge').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${slug}: overflow at ${width}`);
      const missing = await page.locator('main a[href^="#"]').evaluateAll(links => links.filter(a => !document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a => a.hash));
      assert.deepEqual(missing, []);
      for (const img of await page.locator('main img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(image => image.decode());
        assert.ok(await img.evaluate(image => image.naturalWidth > 0));
      }
      const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
      const graph = JSON.parse(schema)['@graph'];
      const visible = await page.locator('.faq-item').evaluateAll(items => items.map(item => ({ q: item.querySelector('h3').textContent, a: item.querySelector('p').textContent })));
      const structured = graph.find(item => item['@type'] === 'FAQPage').mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text }));
      assert.deepEqual(visible, structured, 'Visible FAQ and schema must agree');
      const firstFaq = page.locator('.faq-item').first();
      await firstFaq.locator('button').click();
      assert.equal(await firstFaq.locator('button').getAttribute('aria-expanded'), 'true');
      const links = page.locator('main a[data-affiliate]');
      assert.equal(await links.count(), slug === 'duplo-vergleich' ? 5 : 1);
      for (const a of await links.all()) {
        assert.match(await a.getAttribute('rel'), /sponsored/);
        const box = await a.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44);
        assert.ok(await a.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'CTA text overflow');
      }
      if (slug === 'geschenke-zur-geburt') {
        assert.equal(await page.locator('.birth-moment').count(), 3);
        assert.equal(await page.locator('#fuer-eltern [data-affiliate]').count(), 0);
        await page.locator('.moment-nav a[href="#fuer-baby"]').click();
        await page.waitForTimeout(400);
        assert.ok(await page.locator('#fuer-baby').evaluate(el => el.getBoundingClientRect().top >= 60), 'Anchor hidden under header');
        const details = page.locator('#fuer-eltern details');
        await details.locator('summary').click();
        assert.ok(await details.evaluate(el => el.open));
      }
      assert.deepEqual(errors, []);
      await firstFaq.locator('button').click();
      await page.locator('details[open]').evaluateAll(items => items.forEach(el => el.open = false));
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(200);
      await page.screenshot({ path: `/tmp/kw-${slug}-${width}.png`, fullPage: true });
      console.log(slug, width, await page.locator('main').evaluate(e => ({ words: e.innerText.split(/\s+/).length, height: e.scrollHeight })));
      await page.close();
    }
  }
  for (const slug of slugs) {
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(`${base}/artikel/${slug}.html`);
    assert.ok(await page.locator('main').innerText());
    assert.ok(await page.locator('.faq-item p').first().isVisible(), 'Answers must exist without JavaScript');
    if (slug === 'duplo-vergleich') assert.equal(await page.locator('tbody tr').count(), 5);
    await page.close();
  }
  console.log('DUPLO/birth UI passed: 4 viewports, FAQ parity, anchors, images, affiliate controls, no-JS content.');
} finally {
  await browser.close();
}
