#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765';
const pages = [
  { slug: 'unter-20', path: '/artikel/spielzeug-unter-20-euro.html', selector: '.play-chapter', fullPilot: true },
  { slug: 'geschenke-1', path: '/artikel/geschenke-1-jahr.html', selector: '.kw-moment' },
  { slug: 'spielzeug-18-24', path: '/artikel/spielzeug-18-24-monate.html', selector: '.kw-moment' },
  { slug: 'spielzeug-12-18', path: '/artikel/spielzeug-12-18-monate.html', selector: '.kw-moment' }
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

async function checkPage(browser, entry, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/data/affiliate-offers/babywalz-prices.v0.1.json', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(snapshot)
  }));
  await page.goto(`${baseUrl}${entry.path}`, { waitUntil: 'networkidle' });
  if (entry.fullPilot) await page.locator('.kw-live-offer').first().waitFor();

  assert.equal(await page.locator('h1').count(), 1, `${entry.slug} ${width}px: genau eine H1 erwartet.`);
  assert.equal(await page.locator(entry.selector).count(), 3, `${entry.slug} ${width}px: drei Momente erwartet.`);
  assert.equal(await page.locator('.kaufbox--decision').count(), 0, `${entry.slug}: alte Kaufbox ist noch vorhanden.`);

  if (entry.fullPilot) {
    assert.equal(await page.locator('.pilot-product').count(), 3, 'unter-20: drei Produktempfehlungen erwartet.');
    assert.equal(await page.locator('.play-fit').count(), 3, 'unter-20: drei Fit-Einordnungen erwartet.');
    assert.equal(await page.locator('.play-fit > div').count(), 6, 'unter-20: je Empfehlung Passt- und Eher-nicht-Hinweis erwartet.');
    assert.equal(await page.locator('.kw-live-offer').count(), 3, 'unter-20: drei aktuelle Gesamtpreise erwartet.');
    assert.equal(await page.locator('.pilot-product a[data-affiliate]:visible').count(), 3, 'unter-20: genau ein sichtbarer Händler pro Produkt erwartet.');
  } else {
    assert.equal(await page.locator('.kw-moment-fit').count(), 3, `${entry.slug}: drei Fit-Einordnungen erwartet.`);
    assert.equal(await page.locator('.kw-moment-fit > div').count(), 6, `${entry.slug}: je Empfehlung Passt- und Eher-nicht-Hinweis erwartet.`);
    assert.equal(await page.locator('.kw-moment-action a').count(), 3, `${entry.slug}: drei eindeutige Moment-CTAs erwartet.`);
  }

  const layout = await page.evaluate(({ selector, fullPilot }) => {
    const buttons = [...document.querySelectorAll(fullPilot ? '.pilot-product a[data-affiliate]' : '.kw-moment-action a')]
      .filter((button) => button.getClientRects().length > 0);
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      buttonCount: buttons.length,
      buttonsLarge: buttons.every((button) => button.getBoundingClientRect().height >= 48),
      labelsFit: buttons.every((button) => button.scrollWidth <= button.clientWidth + 1 && button.scrollHeight <= button.clientHeight + 1),
      momentWidthsFit: [...document.querySelectorAll(selector)].every((moment) => {
        const box = moment.getBoundingClientRect();
        return box.left >= -1 && box.right <= window.innerWidth + 1;
      }),
      pathBounds: (() => {
        const path = document.querySelector(fullPilot ? '.play-chapter' : '.kw-moment-path');
        const box = path.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width };
      })(),
      skipVisible: (() => {
        const skip = document.querySelector('.skip-link, .concept-skip');
        if (!skip) return false;
        const box = skip.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight;
      })(),
      heroTextClearsImage: (() => {
        if (!fullPilot) return true;
        const disclosure = document.querySelector('.play-hero .concept-disclosure');
        const image = document.querySelector('.play-hero-photo');
        if (!disclosure || !image) return false;
        return disclosure.getBoundingClientRect().bottom <= image.getBoundingClientRect().top + 1;
      })()
    };
  }, { selector: entry.selector, fullPilot: entry.fullPilot });

  assert.ok(layout.overflow <= 1, `${entry.slug} ${width}px: horizontaler Overflow von ${layout.overflow}px.`);
  assert.equal(layout.buttonCount, 3, `${entry.slug} ${width}px: drei sichtbare Hauptaktionen erwartet.`);
  assert.equal(layout.buttonsLarge, true, `${entry.slug} ${width}px: CTA unter 48px.`);
  assert.equal(layout.labelsFit, true, `${entry.slug} ${width}px: CTA-Text passt nicht.`);
  assert.equal(layout.momentWidthsFit, true, `${entry.slug} ${width}px: Moment ragt aus dem Viewport.`);
  assert.ok(layout.pathBounds.left >= -1 && layout.pathBounds.right <= width + 1, `${entry.slug} ${width}px: Pfadgrenzen sind ${JSON.stringify(layout.pathBounds)}.`);
  assert.ok(entry.fullPilot || layout.pathBounds.width >= width - 2, `${entry.slug} ${width}px: Vollbreitenpfad ist nur ${layout.pathBounds.width}px breit.`);
  assert.equal(layout.skipVisible, false, `${entry.slug} ${width}px: Skip-Link ist ohne Fokus sichtbar.`);
  assert.equal(layout.heroTextClearsImage, true, `${entry.slug} ${width}px: Hero-Text überlappt das Bild.`);
  assert.deepEqual(errors, [], `${entry.slug} ${width}px: Browserfehler: ${errors.join(' | ')}`);

  if (entry.fullPilot) {
    await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible')));
    await page.waitForTimeout(800);
    await page.screenshot({ path: `/tmp/kw-moment-${entry.slug}-${width}.png`, fullPage: true });
  } else {
    await page.locator('.kw-moment-path').screenshot({ path: `/tmp/kw-moment-${entry.slug}-${width}.png` });
  }
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const entry of pages) {
    await checkPage(browser, entry, 320, 760);
    await checkPage(browser, entry, 390, 844);
    await checkPage(browser, entry, 1440, 1100);
  }
  console.log('Moment-Pfad-Test bestanden: vier Prioritätsseiten auf 320, 390 und 1440 px.');
} finally {
  await browser.close();
}
