#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshotPath = path.join(root, 'data/affiliate-offers/babywalz-prices.v0.1.json');
const args = new Set(process.argv.slice(2));

export function evaluateSnapshot(snapshot, now = new Date()) {
  const generatedAt = Date.parse(snapshot?.generatedAt);
  const freshUntil = Date.parse(snapshot?.freshUntil);
  const offers = Object.values(snapshot?.offers ?? {});
  const validDates = Number.isFinite(generatedAt) && Number.isFinite(freshUntil) && generatedAt <= freshUntil;
  const usableOffers = offers.filter((offer) =>
    offer?.availability === 'in_stock' &&
    offer?.currency === 'EUR' &&
    Number.isFinite(offer?.totalPrice) &&
    offer.totalPrice > 0
  );

  let state = 'invalid';
  if (validDates && now.getTime() <= freshUntil && now.getTime() >= generatedAt) state = 'fresh';
  else if (validDates && now.getTime() > freshUntil) state = 'stale';
  else if (validDates && now.getTime() < generatedAt) state = 'future';

  return {
    state,
    generatedAt: Number.isFinite(generatedAt) ? new Date(generatedAt).toISOString() : null,
    freshUntil: Number.isFinite(freshUntil) ? new Date(freshUntil).toISOString() : null,
    ageHours: Number.isFinite(generatedAt) ? Math.round(((now.getTime() - generatedAt) / 3_600_000) * 10) / 10 : null,
    offerCount: offers.length,
    usableOfferCount: usableOffers.length
  };
}

function readHealth() {
  if (!fs.existsSync(snapshotPath)) {
    return { state: 'missing', generatedAt: null, freshUntil: null, ageHours: null, offerCount: 0, usableOfferCount: 0 };
  }
  try {
    return evaluateSnapshot(JSON.parse(fs.readFileSync(snapshotPath, 'utf8')));
  } catch (error) {
    return { state: 'invalid', error: error.message, generatedAt: null, freshUntil: null, ageHours: null, offerCount: 0, usableOfferCount: 0 };
  }
}

function markdown(health) {
  const labels = {
    fresh: 'Fresh: prices may be rendered',
    stale: 'Stale: CTAs stay active, prices are hidden',
    future: 'Invalid clock state: snapshot is dated in the future',
    invalid: 'Invalid: snapshot cannot be trusted',
    missing: 'Missing: no public snapshot found'
  };
  return [
    '## Babywalz feed health',
    '',
    `- Status: **${health.state}** - ${labels[health.state]}`,
    `- Generated: ${health.generatedAt ?? 'n/a'}`,
    `- Fresh until: ${health.freshUntil ?? 'n/a'}`,
    `- Usable offers: ${health.usableOfferCount}/${health.offerCount}`,
    '',
    health.state === 'fresh'
      ? 'The public price snapshot is within its 48-hour freshness window.'
      : 'Action: verify the repository secret `AWIN_BABYWALZ_FEED_URL` and rerun `Refresh Babywalz prices`.'
  ].join('\n');
}

const health = readHealth();
if (args.has('--json')) console.log(JSON.stringify(health, null, 2));
else if (args.has('--markdown')) console.log(markdown(health));
else console.log(`Babywalz feed: ${health.state}; ${health.usableOfferCount}/${health.offerCount} usable offers; fresh until ${health.freshUntil ?? 'n/a'}.`);

if (args.has('--strict') && health.state !== 'fresh') process.exitCode = 1;
