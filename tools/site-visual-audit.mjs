#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:8765';
const outputFile = process.env.OUTPUT || '/tmp/kw-site-visual-audit.json';
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const publicUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 1000 }
];

function localPath(url) {
  if (url.pathname === '/') return '/index.html';
  const relative = decodeURIComponent(url.pathname).replace(/^\//, '');
  if (fs.existsSync(path.join(root, `${relative}.html`))) return `/${relative}.html`;
  if (fs.existsSync(path.join(root, relative, 'index.html'))) return `/${relative}/index.html`;
  return url.pathname;
}

async function revealPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.max(520, Math.floor((await page.viewportSize()).height * 0.8));
  for (let y = 0; y < height; y += step) {
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(18);
  }
  await page.evaluate(() => {
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(120);
}

async function inspect(page, response, publicPath, viewport, browserErrors) {
  await revealPage(page);

  const dom = await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0;
    };
    const controls = [...document.querySelectorAll([
      'button',
      '.btn',
      '.btn-inline',
      '.btn-hero',
      '.btn-hero-secondary',
      '.concept-btn',
      '.age-btn',
      '.home-quicklink',
      '.home-age-jump a',
      '.hub-switcher a',
      '.card-tag',
      '[class*="badge"]'
    ].join(','))].filter(visible);
    const labelsOutsideControls = controls
      .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
      .map((element) => ({
        selector: element.className || element.tagName.toLowerCase(),
        text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
        client: [element.clientWidth, element.clientHeight],
        scroll: [element.scrollWidth, element.scrollHeight]
      }));
    const brokenImages = [...document.images]
      .filter((image) => image.complete && image.naturalWidth === 0)
      .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt }));
    const tinyActions = [...document.querySelectorAll('a[class*="btn"], button, .concept-btn')]
      .filter(visible)
      .filter((element) => element.getBoundingClientRect().height < 40)
      .map((element) => ({
        selector: element.className || element.tagName.toLowerCase(),
        text: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
        height: Math.round(element.getBoundingClientRect().height)
      }));

    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      headerCount: document.querySelectorAll('body > header').length,
      mainCount: document.querySelectorAll('body > main').length,
      footerCount: document.querySelectorAll('body > footer').length,
      horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      brokenImages,
      labelsOutsideControls,
      tinyActions
    };
  });

  return {
    path: publicPath,
    viewport: viewport.name,
    status: response?.status() ?? null,
    ...dom,
    browserErrors
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];
let completed = 0;

async function checkUrl(context, publicUrl, viewport) {
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  await page.route('**/*', (route) => {
    const request = route.request();
    const requestUrl = request.url();
    if (requestUrl.startsWith(baseUrl) || request.resourceType() === 'image') return route.continue();
    return route.abort();
  });
  const target = `${baseUrl}${localPath(publicUrl)}`;
  let response = null;
  try {
    response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 15000 });
  } catch (error) {
    browserErrors.push(`Navigation: ${error.message}`);
  }
  const result = await inspect(page, response, publicUrl.pathname, viewport, browserErrors);
  await page.close();
  completed += 1;
  console.log(`[${completed}/${publicUrls.length * viewports.length}] ${viewport.name} ${publicUrl.pathname}`);
  return result;
}

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    for (let index = 0; index < publicUrls.length; index += 4) {
      const batch = publicUrls.slice(index, index + 4);
      results.push(...await Promise.all(batch.map((publicUrl) => checkUrl(context, publicUrl, viewport))));
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const findings = results.filter((result) =>
  result.status !== 200 ||
  result.h1Count !== 1 ||
  result.headerCount !== 1 ||
  result.mainCount !== 1 ||
  result.footerCount !== 1 ||
  result.horizontalOverflow > 1 ||
  result.brokenImages.length > 0 ||
  result.labelsOutsideControls.length > 0 ||
  result.tinyActions.length > 0 ||
  result.browserErrors.length > 0
);

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl,
  pageCount: publicUrls.length,
  viewportCount: viewports.length,
  checkCount: results.length,
  findingCount: findings.length,
  findings,
  results
};

fs.writeFileSync(outputFile, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Visual-Audit: ${results.length} Checks auf ${publicUrls.length} Seiten, ${findings.length} Seiten-/Viewport-Findings.`);
console.log(`Report: ${outputFile}`);
if (findings.length) process.exitCode = 1;
