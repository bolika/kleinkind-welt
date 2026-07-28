import { test, expect, type Page } from '@playwright/test';

// Prüft den Kernpfad des Navigators ausschließlich per Tastatur auf Smartphone-Breite.
// Standardziel ist ein lokaler Server (python3 -m http.server 8765), damit der Test den
// Repo-Stand prüft und nicht die veröffentlichte Beta.
const BASE = process.env.NAVIGATOR_BASE_URL ?? 'http://localhost:8765';

test.use({ viewport: { width: 390, height: 844 } });

type Focus = { tag: string; type: string | null; inCard: boolean; text: string };

function activeElement(page: Page) {
  return page.evaluate(() => {
    const node = document.activeElement as HTMLInputElement | null;
    if (!node) return null;
    return {
      tag: node.tagName,
      type: node.type ?? null,
      inCard: Boolean(node.closest('.navigator-app-card')),
      text: (node.textContent ?? '').trim().slice(0, 40)
    };
  });
}

async function tabUntil(page: Page, matches: (focus: Focus) => boolean, maxTabs = 60) {
  for (let i = 0; i < maxTabs; i += 1) {
    await page.keyboard.press('Tab');
    const focus = await activeElement(page);
    if (focus && matches(focus as Focus)) return focus as Focus;
  }
  return null;
}

test('Kernpfad ist auf Smartphone-Breite rein per Tastatur bedienbar', async ({ page, browserName }) => {
  // WebKit bewegt den Fokus per Tab standardmäßig auf gar kein Element – auch nicht auf
  // Links oder Buttons. Das ist Safaris Voreinstellung ("Press Tab to highlight each item"),
  // kein Mangel der Seite. Die Bedienbarkeit bei gesetztem Fokus prüft der Test darunter.
  test.skip(browserName === 'webkit', 'Safari tabbt per Voreinstellung nicht auf Formularelemente.');

  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));

  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  // Solange nur Fragen laufen, gibt es keine Partnerlinks – der Hinweis bleibt weg,
  // damit der Finder auf Smartphones im ersten Viewport bleibt.
  await expect(page.locator('[data-navigator-affiliate-disclosure]')).toBeHidden();

  for (let step = 0; step < 10; step += 1) {
    if (!(await page.locator('.navigator-question-card').count())) break;

    const firstInput = await tabUntil(page, (focus) => focus.inCard && focus.tag === 'INPUT');
    expect(firstInput, `Frage ${step + 1}: kein Eingabefeld per Tab erreichbar`).not.toBeNull();

    if (firstInput!.type === 'checkbox') {
      await page.keyboard.press('Space');
      // Fragen mit Mindestauswahl brauchen eine zweite Option.
      const nextBox = await tabUntil(page, (focus) => focus.inCard && focus.type === 'checkbox', 6);
      if (nextBox) await page.keyboard.press('Space');
    } else if (firstInput!.type === 'radio') {
      await page.keyboard.press('Space');
    } else {
      await page.keyboard.type('900');
    }

    const submit = await tabUntil(
      page,
      (focus) => focus.inCard && focus.tag === 'BUTTON' && /Weiter|Ergebnis anzeigen|Passung berechnen/.test(focus.text)
    );
    expect(submit, `Frage ${step + 1}: kein Weiter-Button per Tab erreichbar`).not.toBeNull();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    // Nach der letzten Frage ersetzt das Ergebnis die Fragekarte; dann gibt es kein Fehlerfeld mehr.
    const errorField = page.locator('[data-question-error]').first();
    if (await errorField.count()) {
      const errorText = ((await errorField.textContent()) ?? '').trim();
      expect(errorText, `Frage ${step + 1} wurde trotz Tastaturauswahl abgelehnt`).toBe('');
    }
  }

  // Ergebnis erreicht und mindestens eine Modellkarte gerendert.
  await expect(page.locator('.navigator-results')).toBeVisible();
  expect(await page.locator('[id^="navigator-result-"]').count()).toBeGreaterThan(0);

  // Jetzt stehen Partnerlinks auf der Seite, also muss der Hinweis sichtbar sein.
  await expect(page.locator('[data-navigator-affiliate-disclosure]')).toBeVisible();

  // Kein horizontales Scrollen auf Smartphone-Breite.
  const width = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth
  }));
  expect(width.scroll).toBeLessThanOrEqual(width.client);

  expect(pageErrors).toEqual([]);
});

test('Bedienelemente sind fokussierbar und per Tastatur auslösbar', async ({ page }) => {
  // Engine-unabhängige Prüfung: Wer den Fokus setzen kann – Screenreader, Full Keyboard
  // Access, Schaltersteuerung –, muss die Frage auch ohne Maus beantworten können.
  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  // Die erste Frage kann ein Radio- oder ein Checkbox-Set sein, je nach Flow-Version.
  const firstHeadline = ((await page.locator('.navigator-question-card h2').textContent()) ?? '').trim();
  const control = page.locator('.navigator-question-card input[type="radio"], .navigator-question-card input[type="checkbox"]').first();
  await control.focus();
  await expect(control).toBeFocused();
  await page.keyboard.press('Space');
  await expect(control).toBeChecked();

  const submit = page.locator('.navigator-question-card button', { hasText: /Weiter|Ergebnis anzeigen/ }).first();
  await submit.focus();
  await expect(submit).toBeFocused();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);

  // Ohne Maus muss der Flow weitergelaufen sein: neue Frage oder Ergebnis.
  const movedOn = (await page.locator('.navigator-question-card h2').count())
    ? ((await page.locator('.navigator-question-card h2').textContent()) ?? '').trim() !== firstHeadline
    : true;
  expect(movedOn, 'Enter auf dem Weiter-Button hat den Flow nicht bewegt').toBe(true);
});

test('Affiliate-Links im Ergebnis sind gekennzeichnet und tragen die Partner-ID', async ({ page }) => {
  await page.goto(`${BASE}/kinderwagen-navigator.html`);
  await page.waitForSelector('.navigator-question-card', { timeout: 15000 });

  // Kurzer Klickpfad bis zum Ergebnis. Geklickt wird das Label, nicht das Input:
  // Die Inputs sind visuell ersetzt, und Firefox verweigert den Direktklick darauf.
  for (let step = 0; step < 10; step += 1) {
    const card = page.locator('.navigator-question-card');
    if (!(await card.count())) break;
    const choices = card.locator('label.navigator-choice');
    const count = await choices.count();
    if (count) {
      await choices.nth(0).click();
      const multi = await card.locator('input[type="checkbox"]').count();
      if (multi && count > 1) await choices.nth(1).click();
    }
    await card.locator('button', { hasText: /Weiter|Ergebnis anzeigen/ }).first().click();
    await page.waitForTimeout(400);
  }

  const amazonLinks = page.locator('a[href*="amazon.de"]');
  const count = await amazonLinks.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i += 1) {
    const link = amazonLinks.nth(i);
    expect(await link.getAttribute('href')).toContain('tag=kleinkindwelt-21');
    expect(await link.getAttribute('rel')).toContain('sponsored');
  }

  await expect(page.locator('[data-navigator-affiliate-disclosure]')).toBeVisible();
});
