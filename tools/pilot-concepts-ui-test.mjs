#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765';
const concepts = [
  { slug: 'future', path: '/pilot/spielzeug-unter-20-euro-future.html', firstCtaLimit: 1000 },
  { slug: 'playful', path: '/pilot/spielzeug-unter-20-euro-playful.html', firstCtaLimit: 1500 }
];

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

async function openConcept(browser, concept, width, height, reducedMotion = 'no-preference') {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion });
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
  await page.goto(`${baseUrl}${concept.path}`, { waitUntil: 'networkidle' });
  await page.locator('.kw-live-offer').first().waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  return { page, errors };
}

async function checkViewport(browser, concept, width, height) {
  const { page, errors } = await openConcept(browser, concept, width, height);

  assert.equal(await page.locator('h1').count(), 1, `${concept.slug} ${width}px: genau eine H1 erwartet.`);
  assert.equal(await page.locator('.pilot-product').count(), 3, `${concept.slug} ${width}px: drei Produkte erwartet.`);
  assert.equal(await page.locator('.kw-live-offer').count(), 3, `${concept.slug} ${width}px: drei Gesamtpreise erwartet.`);
  assert.equal(await page.locator('a[data-merchant="babywalz"]').count(), 3, `${concept.slug} ${width}px: drei Babywalz-Ziele erwartet.`);
  assert.equal(await page.locator('a[data-affiliate="amazon"]').count(), 3, `${concept.slug} ${width}px: drei Amazon-Ziele erwartet.`);

  const layout = await page.evaluate(() => {
    const visibleButtons = [...document.querySelectorAll('.concept-btn')].filter((button) => button.getClientRects().length > 0);
    const primary = visibleButtons.find((button) => button.classList.contains('concept-btn--primary'));
    const primaryBox = primary.getBoundingClientRect();
    const heroImage = document.querySelector('[data-scene="hero"] img');
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      primaryTop: primaryBox.top,
      primaryVisible: primaryBox.width > 0 && primaryBox.height >= 48,
      allButtonsLarge: visibleButtons.every((button) => button.getBoundingClientRect().height >= 48),
      allButtonLabelsFit: visibleButtons.every((button) => button.scrollWidth <= button.clientWidth + 1 && button.scrollHeight <= button.clientHeight + 1),
      heroImageLoaded: heroImage.complete && heroImage.naturalWidth > 0,
      skipOpacity: getComputedStyle(document.querySelector('.concept-skip')).opacity,
      depthCount: document.querySelectorAll('[data-depth]').length,
      animatedCount: document.querySelectorAll('[data-animate]').length
    };
  });

  assert.ok(layout.overflow <= 1, `${concept.slug} ${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.equal(layout.primaryVisible, true, `${concept.slug} ${width}px: primärer CTA ist nicht nutzbar.`);
  assert.equal(layout.allButtonsLarge, true, `${concept.slug} ${width}px: CTA unter 48px.`);
  assert.equal(layout.allButtonLabelsFit, true, `${concept.slug} ${width}px: CTA-Text passt nicht.`);
  assert.equal(layout.heroImageLoaded, true, `${concept.slug} ${width}px: Hero-Bild wurde nicht geladen.`);
  assert.equal(layout.skipOpacity, '0', `${concept.slug} ${width}px: Skip-Link ist ohne Fokus sichtbar.`);
  assert.ok(layout.depthCount >= 12, `${concept.slug} ${width}px: zu wenige Tiefenebenen (${layout.depthCount}).`);
  assert.ok(layout.animatedCount >= 12, `${concept.slug} ${width}px: zu wenige gezielte Textanimationen (${layout.animatedCount}).`);
  if (width <= 390) assert.ok(layout.primaryTop < concept.firstCtaLimit, `${concept.slug}: erster CTA erscheint mit ${layout.primaryTop}px zu spät.`);

  await page.locator('.concept-skip').focus();
  assert.equal(await page.locator('.concept-skip').evaluate((element) => getComputedStyle(element).opacity), '1', `${concept.slug}: Skip-Link wird bei Fokus nicht sichtbar.`);
  await page.locator('.concept-skip').evaluate((element) => element.blur());

  if (concept.slug === 'future') {
    const actionTab = page.locator('#future-tab-action');
    await actionTab.click();
    assert.equal(await actionTab.getAttribute('aria-selected'), 'true', 'future: Auswahl wird nicht als aktiv markiert.');
    assert.equal(await page.locator('#future-panel-action').isVisible(), true, 'future: Klopfbank-Ergebnis wird nicht eingeblendet.');
    assert.match(await page.locator('#future-panel-action h3').textContent(), /Solini Klopfbank/, 'future: falsches Ergebnis nach Auswahl.');
    await actionTab.press('ArrowRight');
    assert.equal(await page.locator('#future-tab-together').getAttribute('aria-selected'), 'true', 'future: Pfeiltasten wechseln den Tab nicht.');
    assert.equal(await page.locator('#future-panel-together').isVisible(), true, 'future: Tastaturauswahl blendet Ergebnis nicht ein.');
  }

  if (concept.slug === 'playful') {
    assert.equal(await page.locator('.play-moments a').count(), 3, 'playful: drei Moment-Sprünge erwartet.');
    assert.equal(await page.locator('.play-chapter').count(), 3, 'playful: drei eigenständige Kapitel erwartet.');
    assert.deepEqual(await page.locator('.play-moments a').evaluateAll((links) => links.map((link) => link.hash)), ['#greifen', '#klopfen', '#erzaehlen'], 'playful: Moment-Sprünge zeigen nicht auf die drei Kapitel.');
  }

  const firstDetails = page.locator('details').first();
  await firstDetails.locator('summary').click();
  assert.equal(await firstDetails.getAttribute('open'), '', `${concept.slug}: Details lassen sich nicht öffnen.`);
  assert.deepEqual(errors, [], `${concept.slug} ${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.evaluate(async () => {
    const step = Math.max(400, Math.floor(window.innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 45));
    }
    window.scrollTo(0, 0);
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    await new Promise((resolve) => window.setTimeout(resolve, 760));
  });
  await page.screenshot({ path: `/tmp/kw-u20-${concept.slug}-${width}.png`, fullPage: true });
  await page.close();
}

async function checkReducedMotion(browser, concept) {
  const { page, errors } = await openConcept(browser, concept, 390, 844, 'reduce');
  const motion = await page.evaluate(() => ({
    lite: document.documentElement.classList.contains('perf-lite'),
    revealVisible: [...document.querySelectorAll('[data-reveal]')].every((element) => getComputedStyle(element).opacity === '1'),
    parallaxStable: [...document.querySelectorAll('[data-parallax]')].every((element) => getComputedStyle(element).transform === 'none')
  }));
  assert.equal(motion.lite, true, `${concept.slug}: Reduced-Motion aktiviert keinen Lite-Modus.`);
  assert.equal(motion.revealVisible, true, `${concept.slug}: Inhalte bleiben bei Reduced-Motion verborgen.`);
  assert.equal(motion.parallaxStable, true, `${concept.slug}: Parallax bleibt bei Reduced-Motion aktiv.`);
  assert.deepEqual(errors, [], `${concept.slug} Reduced-Motion: Browserfehler: ${errors.join(' | ')}`);
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const concept of concepts) {
    await checkViewport(browser, concept, 390, 844);
    await checkViewport(browser, concept, 1440, 1100);
    await checkReducedMotion(browser, concept);
  }
  console.log('Designkonzept-Test bestanden: Future Signal und Spielpfad auf 390/1440 px plus Reduced-Motion.');
} finally {
  await browser.close();
}
