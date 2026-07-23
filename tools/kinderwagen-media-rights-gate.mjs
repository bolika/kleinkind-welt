#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data", "kinderwagen-navigator");
const media = JSON.parse(fs.readFileSync(path.join(dataDir, "media.v0.1.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, "catalog.v0.1.json"), "utf8"));
const products = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, "products", filename), "utf8"))
);
const productIds = new Set(products.map((product) => product.productId));
const seenAssets = new Set();
const coveredProducts = new Set();
const errors = [];
const today = new Date().toISOString().slice(0, 10);

for (const asset of media.assets ?? []) {
  if (!asset.assetId || seenAssets.has(asset.assetId)) errors.push(`Doppelte oder fehlende assetId: ${asset.assetId || "leer"}`);
  seenAssets.add(asset.assetId);
  if (!productIds.has(asset.productId)) errors.push(`${asset.assetId}: unbekannte productId ${asset.productId}`);
  if (!asset.sourceUrl?.startsWith("https://")) errors.push(`${asset.assetId}: sourceUrl muss HTTPS verwenden`);
  if (!asset.localPath && !asset.remoteUrl) errors.push(`${asset.assetId}: localPath oder remoteUrl fehlt`);
  if (asset.localPath && !asset.localPath.startsWith("/images/products/")) errors.push(`${asset.assetId}: localPath liegt außerhalb /images/products/`);
  if (asset.localPath && !fs.existsSync(path.join(root, asset.localPath.replace(/^\//, "")))) errors.push(`${asset.assetId}: lokale Datei fehlt`);
  if (!asset.rightsBasis || !asset.usageScope || !asset.checkedAt || !asset.alt) errors.push(`${asset.assetId}: Rechte- oder Beschreibungsfelder fehlen`);
  if (asset.rightsBasis !== "owned_original" && !asset.rightsReference) errors.push(`${asset.assetId}: rightsReference fehlt`);
  if (asset.validUntil && asset.validUntil < today) errors.push(`${asset.assetId}: Nutzungsrecht ist seit ${asset.validUntil} abgelaufen`);
  if ((asset.status ?? "approved") === "approved") coveredProducts.add(asset.productId);
}

const localProductImages = fs.readdirSync(path.join(root, "images", "products"))
  .filter((name) => name !== ".gitkeep");
for (const file of localProductImages) {
  const route = `/images/products/${file}`;
  if (!(media.assets ?? []).some((asset) => asset.localPath === route)) errors.push(`${route}: Bild ohne Eintrag im Medienregister`);
}

if (errors.length) {
  console.error(`Kinderwagen-Medienprüfung fehlgeschlagen (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Kinderwagen-Medienprüfung bestanden: ${media.assets.length} freigegebene Assets für ${coveredProducts.size}/${products.length} Produkte.`);
