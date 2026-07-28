import { test, expect } from '@playwright/test';

// Die Typ-Frage ist die Weiche des Navigators: Wer keinen Kombi-Kinderwagen sucht, muss
// das nach der ersten Frage erfahren und eine Warteliste angeboten bekommen — nicht erst
// nach fünf weiteren Fragen ein unpassendes Ranking.
const BASE = process.env.NAVIGATOR_BASE_URL ?? 'http://localhost:8765';

test.use({ viewport: { width: 390, height: 900 } });

const SEGMENTE = [
  { value: 'travel_buggy', titel: /Reisebuggy/i },
  { value: 'buggy', titel: /Buggy/i },
  { value: 'siblings_twins', titel: /Geschwister|Zwillings/i },
  { value: 'unsure', titel: /Geburtskonfiguration|Pilot/i }
];

test('Typ-Frage steht am Anfang und listet alle bekannten Segmente', async ({ page }) => {
  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  await expect(page.locator('.navigator-question-card h2')).toHaveText(/Art Kinderwagen/i);

  const werte = await page
    .locator('.navigator-question-card input[type="radio"]')
    .evaluateAll((nodes) => nodes.map((n) => (n as HTMLInputElement).value));
  expect(werte).toEqual([
    'first_combo_from_birth',
    'travel_buggy',
    'buggy',
    'siblings_twins',
    'unsure'
  ]);
});

test('Kombi-Kinderwagen führt weiter in den Fragebogen', async ({ page }) => {
  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  await page.locator('label.navigator-choice').filter({ hasText: 'Kombi-Kinderwagen ab Geburt' }).click();
  await page.locator('.navigator-question-card button', { hasText: /Weiter/ }).first().click();

  await expect(page.locator('.navigator-route-card')).toHaveCount(0);
  await expect(page.locator('.navigator-question-card h2')).not.toHaveText(/Art Kinderwagen/i);
});

for (const segment of SEGMENTE) {
  test(`Segment ${segment.value} endet sofort in einer ehrlichen Grenze`, async ({ page }) => {
    await page.goto(`${BASE}/kinderwagen-navigator.html`);
    await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

    await page.locator(`input[value="${segment.value}"]`).evaluate((node) => (node as HTMLElement).click());
    await page.locator('.navigator-question-card button', { hasText: /Weiter/ }).first().click();

    const karte = page.locator('.navigator-route-card');
    await expect(karte).toBeVisible();
    await expect(karte.locator('h2')).toHaveText(segment.titel);

    // Keine Ergebnisliste — ein unpassendes Ranking wäre schlimmer als keins.
    await expect(page.locator('.navigator-results')).toHaveCount(0);
  });
}

test('Warteliste erfasst E-Mail nur mit Einwilligung', async ({ page }) => {
  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  await page.locator('input[value="travel_buggy"]').evaluate((node) => (node as HTMLElement).click());
  await page.locator('.navigator-question-card button', { hasText: /Weiter/ }).first().click();

  const warteliste = page.locator('.navigator-waitlist');
  await expect(warteliste).toBeVisible();
  await expect(warteliste.locator('input[type="email"]')).toBeVisible();
  await expect(warteliste.locator('input[type="checkbox"]')).toBeVisible();
  // Datenschutzhinweis muss vor dem Absenden sichtbar sein.
  await expect(warteliste.locator('a[href="/datenschutz"]')).toBeVisible();

  await warteliste.locator('input[type="email"]').fill('eltern@example.de');
  await warteliste.locator('button[type="submit"]').click();

  const status = warteliste.locator('.navigator-email__status');
  await expect(status).toBeVisible();
  await expect(status).toHaveText(/Einwilligung/i);
});
