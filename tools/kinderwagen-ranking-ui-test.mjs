#!/usr/bin/env node

import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8766';

async function choose(page, name, values) {
  for (const value of values) await page.locator(`input[name="${name}"][value="${value}"]`).check();
  await page.locator('.navigator-primary-button').click();
}

async function run(browser, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/kinderwagen-navigator.html`, { waitUntil: 'networkidle' });

  await page.locator('input[name="search_goal"]').first().waitFor();
  await choose(page, 'search_goal', ['first_combo_from_birth']);
  await choose(page, 'daily_context', ['regular_car']);
  await choose(page, 'terrain', ['forest_field', 'gravel_park']);
  await page.locator('input[name="budget"]').fill('1500');
  await page.locator('input[name="budget_mode"][value="orientation"]').check();
  await page.locator('.navigator-primary-button').click();
  await choose(page, 'top_priorities', ['storage', 'weather']);

  await page.locator('.navigator-live-result').first().waitFor();
  await page.locator('.navigator-comparison').evaluate((element) => { element.open = true; });
  const result = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    scores: [...document.querySelectorAll('.navigator-live-result .navigator-score strong')].map((node) => node.textContent.trim()),
    badges: [...document.querySelectorAll('.navigator-live-result .navigator-result-badge')].map((node) => ({
      text: node.textContent.trim(),
      whiteSpace: getComputedStyle(node).whiteSpace,
      overflow: node.scrollWidth - node.clientWidth
    })),
    notes: [...document.querySelectorAll('.navigator-rank-context')].map((node) => node.textContent.trim()),
    bestMarkers: [...document.querySelectorAll('.navigator-comparison__best')].map((node) => node.textContent.trim())
  }));

  assert.deepEqual(result.scores.slice(0, 3), ['84%', '84%', '84%'], `${width}px: Referenzfall muss den sichtbaren 84%-Gleichstand abbilden.`);
  assert.equal(result.badges[0]?.text, 'Gleichauf', `${width}px: Rang eins darf im rechnerischen Gleichstand keinen eindeutigen Sieger behaupten.`);
  assert.equal(result.badges[1]?.text, 'Gleichauf', `${width}px: Gleichauf liegende Alternative ist nicht markiert.`);
  assert.equal(result.badges[2]?.text, 'Gleicher Wert', `${width}px: ein nur sichtbar gleiches Ergebnis ist nicht vom rechnerischen Gleichstand getrennt.`);
  assert.ok(result.notes.some((note) => note.includes('Reihenfolge ist keine Präferenz')), `${width}px: neutrale Gleichstandserklärung fehlt.`);
  assert.ok(result.notes.some((note) => note.includes('übrigen gewichteten Kriterien')), `${width}px: gedeckelter Gleichstand wird nicht differenziert.`);
  assert.ok(result.bestMarkers.includes('Gleichauf'), `${width}px: geteilter Bestwert ist im Vergleich nicht beschriftet.`);
  assert.ok(result.bestMarkers.some((label) => label !== 'Gleichauf'), `${width}px: eindeutige Bestwerte sind im Vergleich nicht beschriftet.`);
  assert.ok(result.badges.every((badge) => badge.whiteSpace === 'nowrap' && badge.overflow <= 1), `${width}px: mindestens ein Ergebnis-Badge bricht um oder läuft über.`);
  assert.ok(result.overflow <= 1, `${width}px: horizontaler Seiten-Overflow von ${result.overflow}px.`);
  assert.deepEqual(errors, [], `${width}px: Browserfehler: ${errors.join(' | ')}`);

  await page.locator('.navigator-results').screenshot({ path: `/tmp/kw-kinderwagen-ranking-${width}.png` });
  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of [[320, 844], [390, 844], [1440, 1000]]) await run(browser, width, height);
  console.log('Kinderwagen-Ranking-UI-Test bestanden: Gleichstand, Bestwerte und bruchsichere Badges auf 320, 390 und 1440 px.');
} finally {
  await browser.close();
}
