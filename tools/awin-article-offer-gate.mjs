#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './import-awin-offers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mappingPath = path.join(root, 'data/affiliate-offers/babywalz.mapping.v0.1.json');
const priceSnapshotPath = path.join(root, 'data/affiliate-offers/babywalz-prices.v0.1.json');
const feedPath = path.join(root, 'imports/awin/babywalz.csv.gz');
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function attributes(openingTag) {
  const result = {};
  const pattern = /([A-Za-z_:][A-Za-z0-9:._-]*)\s*=\s*"([^"]*)"/g;
  let match;
  while ((match = pattern.exec(openingTag))) result[match[1]] = match[2].replaceAll('&amp;', '&');
  return result;
}

function linksIn(html) {
  return [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => attributes(match[0]));
}

function imagesIn(html) {
  return [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => attributes(match[0]));
}

function trackingParts(value) {
  try {
    const url = new URL(value);
    return {
      host: url.hostname,
      product: url.searchParams.get('p'),
      publisher: url.searchParams.get('a'),
      advertiser: url.searchParams.get('m'),
      clickref: url.searchParams.get('clickref')
    };
  } catch {
    return {};
  }
}

function stockStatus(row) {
  const value = `${row.in_stock || ''} ${row.stock_status || ''}`.toLowerCase();
  if (/nicht.?verf|out.?of.?stock|^(0|false|no)$/.test(value.trim())) return 'out_of_stock';
  if (/verf|in.?stock|1|true|yes/.test(value)) return 'in_stock';
  return 'unknown';
}

const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
check(mapping.advertiserId === 12387, 'Babywalz-Advertiser-ID muss 12387 sein.');
check(Number.isInteger(mapping.publisherId) && mapping.publisherId > 0, 'Awin-Publisher-ID fehlt.');
check(mapping.feedImageUsageStatus === 'terms_review_required', 'Feed-Bilder müssen bis zur schriftlichen Freigabe gesperrt bleiben.');
check(mapping.advertiserCreativeUsage?.status === 'operator_confirmed_in_acceptance_email', 'Freigabebasis für offizielle Advertiser-Creatives fehlt.');
check(mapping.policy?.commissionDoesNotAffectEditorialRanking === true, 'Provisionsunabhängigkeit fehlt.');
check(mapping.policy?.titleOnlyMatchingAllowed === false, 'Titelähnlichkeit darf keine Produktzuordnung erzeugen.');
check(mapping.policy?.pricesRenderedFromThisFile === false, 'Beobachtete Feed-Preise dürfen nicht statisch ausgespielt werden.');
check(mapping.shippingPolicy?.generalFreeShippingThreshold === null, 'Keine unbestätigte Gratisversandgrenze veröffentlichen.');
check(mapping.shippingPolicy?.status === 'promotion_dependent', 'Babywalz-Portofrei-Aktionen müssen als aktionsabhängig geführt werden.');

const seenOfferIds = new Set();
const seenClickrefs = new Set();
const htmlByPage = new Map();
const approvedCreativeImages = new Set();

for (const offer of mapping.mappings) {
  check(!seenOfferIds.has(offer.offerId), `${offer.offerId}: Offer-ID ist doppelt.`);
  seenOfferIds.add(offer.offerId);
  check(offer.merchantProductIds?.length > 0, `${offer.offerId}: Händlerprodukt-ID fehlt.`);
  check(offer.gtins?.some((gtin) => /^[0-9]{8,14}$/.test(gtin)), `${offer.offerId}: gültige GTIN fehlt.`);
  check(offer.feedEvidence?.availability === 'in_stock', `${offer.offerId}: Pilotangebot war beim Feed-Check nicht verfügbar.`);
  check(offer.feedEvidence?.observedPrice > 0, `${offer.offerId}: beobachteter Preis fehlt.`);
  check(offer.feedEvidence?.observedPrice <= offer.feedEvidence?.priceLimit, `${offer.offerId}: beobachteter Preis überschreitet die Seitengrenze.`);

  const base = trackingParts(offer.deeplink);
  check(base.host === 'www.awin1.com', `${offer.offerId}: Deeplink muss über Awin führen.`);
  check(base.publisher === String(mapping.publisherId), `${offer.offerId}: falsche Publisher-ID im Deeplink.`);
  check(base.advertiser === String(mapping.advertiserId), `${offer.offerId}: falsche Advertiser-ID im Deeplink.`);
  check(Boolean(base.product), `${offer.offerId}: Awin-Produktreferenz fehlt.`);
  check(!base.clickref, `${offer.offerId}: Basis-Deeplink darf keine feste Clickref enthalten.`);

  for (const placement of offer.placements ?? []) {
    check(!seenClickrefs.has(placement.clickref), `${placement.clickref}: Clickref ist doppelt.`);
    seenClickrefs.add(placement.clickref);
    const pagePath = path.join(root, placement.page);
    if (!htmlByPage.has(placement.page)) htmlByPage.set(placement.page, fs.readFileSync(pagePath, 'utf8'));
    const html = htmlByPage.get(placement.page);
    check(html.includes(`id="${placement.scopeId}"`), `${placement.clickref}: Zielbereich #${placement.scopeId} fehlt.`);
    const matches = linksIn(html).filter((link) => link['data-clickref'] === placement.clickref);
    check(matches.length === 1, `${placement.clickref}: genau ein Link erwartet, gefunden ${matches.length}.`);
    if (matches.length !== 1) continue;

    const link = matches[0];
    const tracked = trackingParts(link.href);
    check(tracked.product === base.product, `${placement.clickref}: Awin-Produktreferenz passt nicht zum Mapping.`);
    check(tracked.publisher === base.publisher, `${placement.clickref}: Publisher-ID passt nicht zum Mapping.`);
    check(tracked.advertiser === base.advertiser, `${placement.clickref}: Advertiser-ID passt nicht zum Mapping.`);
    check(tracked.clickref === placement.clickref, `${placement.clickref}: Clickref fehlt im Linkziel.`);
    check(link['data-affiliate'] === 'awin', `${placement.clickref}: data-affiliate muss awin sein.`);
    check(link['data-merchant'] === mapping.merchant.id, `${placement.clickref}: Händlerattribut fehlt.`);
    check(link['data-product-id'] === offer.productId, `${placement.clickref}: Produkt-ID passt nicht.`);
    check(link['data-offer-id'] === offer.offerId, `${placement.clickref}: Offer-ID passt nicht.`);
    check(link.target === '_blank', `${placement.clickref}: target=_blank fehlt.`);
    const rel = new Set((link.rel || '').split(/\s+/));
    for (const token of ['sponsored', 'noopener', 'nofollow']) {
      check(rel.has(token), `${placement.clickref}: rel=${token} fehlt.`);
    }
  }
}

for (const creative of mapping.advertiserCreativeUsage?.creatives ?? []) {
  const pagePath = path.join(root, creative.page);
  check(fs.existsSync(pagePath), `${creative.creativeId}: Creative-Zielseite fehlt.`);
  if (!fs.existsSync(pagePath)) continue;
  if (!htmlByPage.has(creative.page)) htmlByPage.set(creative.page, fs.readFileSync(pagePath, 'utf8'));
  const html = htmlByPage.get(creative.page);
  const links = linksIn(html).filter((link) => link.href === creative.destinationUrl);
  const images = imagesIn(html).filter((image) => image.src === creative.imageUrl);
  check(links.length === 1, `${creative.creativeId}: genau ein Advertiser-Creative-Link erwartet, gefunden ${links.length}.`);
  check(images.length === 1, `${creative.creativeId}: genau ein Advertiser-Creative-Bild erwartet, gefunden ${images.length}.`);
  if (links.length === 1) {
    const rel = new Set((links[0].rel || '').split(/\s+/));
    check(rel.has('sponsored'), `${creative.creativeId}: rel=sponsored fehlt.`);
    check(links[0].target === '_blank', `${creative.creativeId}: target=_blank fehlt.`);
    check(links[0]['data-affiliate'] === 'awin', `${creative.creativeId}: data-affiliate=awin fehlt.`);
    check(links[0]['data-placement'] === creative.placement, `${creative.creativeId}: Placement stimmt nicht.`);
  }
  approvedCreativeImages.add(creative.imageUrl);
}

for (const [page, html] of htmlByPage) {
  const externalMerchantImages = imagesIn(html)
    .map((image) => image.src)
    .filter((src) => /(?:baby-walz\.de|awin1\.com)/i.test(src || ''));
  for (const src of externalMerchantImages) {
    check(approvedCreativeImages.has(src), `${page}: nicht freigegebenes Babywalz-Feed- oder Advertiser-Bild gefunden.`);
  }
  check(html.includes('Babywalz über Awin'), `${page}: transparenter Affiliate-Hinweis für Babywalz fehlt.`);
  check(html.includes('/js/babywalz-prices.js'), `${page}: ausfallsichere Babywalz-Preislogik fehlt.`);
}

check(fs.existsSync(priceSnapshotPath), 'Öffentlicher Babywalz-Preis-Snapshot fehlt.');
if (fs.existsSync(priceSnapshotPath)) {
  const snapshot = JSON.parse(fs.readFileSync(priceSnapshotPath, 'utf8'));
  check(snapshot.schemaVersion === 1, 'Preis-Snapshot hat eine unbekannte Schemaversion.');
  check(snapshot.merchant?.id === mapping.merchant.id, 'Preis-Snapshot gehört nicht zu Babywalz.');
  check(snapshot.shippingPolicy?.generalFreeShippingThreshold === null, 'Preis-Snapshot darf keine unbestätigte Gratisversandgrenze enthalten.');
  check(snapshot.priceIncludesShipping === true, 'Preis-Snapshot muss Versandkosten einrechnen.');
  check(snapshot.freshnessHours === 48, 'Preis-Snapshot muss nach 48 Stunden verfallen.');
  const generatedAt = Date.parse(snapshot.generatedAt);
  const freshUntil = Date.parse(snapshot.freshUntil);
  check(Number.isFinite(generatedAt), 'Preis-Snapshot hat kein gültiges Erstellungsdatum.');
  check(Number.isFinite(freshUntil) && freshUntil - generatedAt === 48 * 60 * 60 * 1000, 'Preis-Snapshot hat kein exaktes 48-Stunden-Fenster.');

  for (const mappingOffer of mapping.mappings) {
    const price = snapshot.offers?.[mappingOffer.offerId];
    check(Boolean(price), `${mappingOffer.offerId}: Angebot fehlt im Preis-Snapshot.`);
    if (!price) continue;
    check(price.productId === mappingOffer.productId, `${mappingOffer.offerId}: Produkt-ID im Preis-Snapshot passt nicht.`);
    check(mappingOffer.merchantProductIds.includes(price.merchantProductId), `${mappingOffer.offerId}: Händlerprodukt-ID im Preis-Snapshot passt nicht.`);
    check(price.currency === 'EUR', `${mappingOffer.offerId}: Währung im Preis-Snapshot muss EUR sein.`);
    check(Number.isFinite(price.productPrice) && price.productPrice > 0, `${mappingOffer.offerId}: Produktpreis fehlt.`);
    check(Number.isFinite(price.shipping) && price.shipping >= 0, `${mappingOffer.offerId}: Versandkosten fehlen.`);
    check(Math.abs(price.totalPrice - (price.productPrice + price.shipping)) < 0.011, `${mappingOffer.offerId}: Gesamtpreis ist rechnerisch falsch.`);
  }
}

let feedRowsChecked = 0;
let duplicateRowsObserved = 0;
if (fs.existsSync(feedPath)) {
  const rows = parseCsv(zlib.gunzipSync(fs.readFileSync(feedPath)).toString('utf8'));
  const rowsByMerchantProductId = new Map();
  for (const row of rows) {
    const id = row.merchant_product_id;
    if (!rowsByMerchantProductId.has(id)) rowsByMerchantProductId.set(id, []);
    rowsByMerchantProductId.get(id).push(row);
  }

  for (const offer of mapping.mappings) {
    const matches = offer.merchantProductIds.flatMap((id) => rowsByMerchantProductId.get(id) ?? []);
    check(matches.length > 0, `${offer.offerId}: Produkt fehlt im lokalen Babywalz-Feed.`);
    duplicateRowsObserved += Math.max(0, matches.length - 1);
    const mappedLink = trackingParts(offer.deeplink);
    for (const row of matches) {
      feedRowsChecked += 1;
      check(row.merchant_id === String(mapping.advertiserId), `${offer.offerId}: Feed enthält falsche Advertiser-ID.`);
      check(row.product_name === offer.title, `${offer.offerId}: Feed-Titel weicht vom geprüften Mapping ab.`);
      check(offer.gtins.includes(row.product_GTIN || row.ean), `${offer.offerId}: Feed-GTIN passt nicht zum Mapping.`);
      check(Number(row.search_price) > 0 && Number(row.search_price) <= offer.feedEvidence.priceLimit, `${offer.offerId}: Feed-Preis liegt nicht mehr innerhalb der Seitengrenze.`);
      check(stockStatus(row) === 'in_stock', `${offer.offerId}: Produkt ist im Feed nicht mehr verfügbar.`);
    }
    check(matches.some((row) => trackingParts(row.aw_deep_link).product === mappedLink.product), `${offer.offerId}: Mapping verwendet keine der angebotenen Awin-Produktreferenzen.`);
  }
}

if (errors.length) {
  console.error(`Babywalz-Angebots-Gate fehlgeschlagen (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Babywalz-Angebots-Gate bestanden: ${mapping.mappings.length} Angebote, ${seenClickrefs.size} Produktplatzierungen, ${approvedCreativeImages.size} freigegebene Advertiser-Creatives, ${feedRowsChecked} lokale Feed-Zeilen geprüft, keine Feed-Produktbilder veröffentlicht.`);
