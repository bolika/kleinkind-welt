import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/kleinkind/i);
  await expect(page.locator('h1')).toBeVisible();
});

test('kinderwagen navigator accessible', async ({ page }) => {
  await page.goto('/kinderwagen-navigator.html');
  await expect(page).toHaveTitle(/kinderwagen/i);
  await expect(page.locator('h1')).toBeVisible();
});

test('artikel page loads', async ({ page }) => {
  await page.goto('/artikel/');
  const artikel = page.locator('[href*="/artikel/"]').first();
  await expect(artikel).toBeVisible();
});
