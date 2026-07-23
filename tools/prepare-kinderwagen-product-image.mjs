#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const args = process.argv.slice(2);
const value = (name) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : null;
};
const required = ['--input', '--product-id', '--source-url', '--rights-basis', '--rights-reference', '--usage-scope', '--alt'];

if (args.includes('--help') || args.length === 0) {
  console.log(`Nutzung:
node tools/prepare-kinderwagen-product-image.mjs \\
  --input /absoluter/pfad/bild.jpg \\
  --product-id joolz-hub2 \\
  --source-url https://quelle.example/bild \\
  --rights-basis manufacturer_written_permission \\
  --rights-reference "E-Mail vom 2026-07-23" \\
  --usage-scope site_editorial_and_affiliate \\
  --alt "Joolz Hub2 Kinderwagen in Seitenansicht"

Erzeugt 480- und 960-Pixel-WebP-Dateien und ergänzt das Medienregister.
Die Quelle muss vor der Ausführung rechtlich freigegeben sein.`);
  process.exit(0);
}

for (const key of required) if (!value(key)) throw new Error(`Pflichtargument fehlt: ${key}`);
const input = path.resolve(value('--input'));
const productId = value('--product-id');
const sourceUrl = value('--source-url');
const rightsBasis = value('--rights-basis');
const rightsReference = value('--rights-reference');
const usageScope = value('--usage-scope');
const alt = value('--alt');
const validUntil = value('--valid-until');
if (!fs.existsSync(input)) throw new Error(`Eingabedatei fehlt: ${input}`);
if (!sourceUrl.startsWith('https://')) throw new Error('source-url muss HTTPS verwenden');

const catalog = JSON.parse(fs.readFileSync(path.join(dataDir, 'catalog.v0.1.json'), 'utf8'));
const products = catalog.products.map((filename) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, 'products', filename), 'utf8'))
);
if (!products.some((product) => product.productId === productId)) throw new Error(`Unbekannte productId: ${productId}`);

const allowedRights = new Set(['affiliate_feed', 'manufacturer_written_permission', 'owned_original', 'licensed_stock']);
const allowedScopes = new Set(['affiliate_context_only', 'site_editorial_and_affiliate', 'site_owned_unrestricted']);
if (!allowedRights.has(rightsBasis)) throw new Error(`Unbekannte rights-basis: ${rightsBasis}`);
if (!allowedScopes.has(usageScope)) throw new Error(`Unbekannter usage-scope: ${usageScope}`);

const outputDir = path.join(root, 'images', 'products');
fs.mkdirSync(outputDir, { recursive: true });
const output480 = path.join(outputDir, `${productId}-480.webp`);
const output960 = path.join(outputDir, `${productId}-960.webp`);
for (const [width, output] of [[480, output480], [960, output960]]) {
  execFileSync('cwebp', ['-quiet', '-q', '82', '-resize', String(width), '0', input, '-o', output], { stdio: 'inherit' });
}

const registerPath = path.join(dataDir, 'media.v0.1.json');
const register = JSON.parse(fs.readFileSync(registerPath, 'utf8'));
register.updatedAt = new Date().toISOString().slice(0, 10);
register.assets = (register.assets ?? []).filter((asset) => asset.productId !== productId || asset.kind !== 'product_cutout');
const asset = {
  assetId: `${productId}-primary`,
  productId,
  kind: 'product_cutout',
  sourceUrl,
  localPath: `/images/products/${productId}-960.webp`,
  rightsBasis,
  usageScope,
  rightsReference,
  checkedAt: register.updatedAt,
  alt,
  status: 'approved'
};
if (validUntil) asset.validUntil = validUntil;
register.assets.push(asset);
register.assets.sort((a, b) => a.assetId.localeCompare(b.assetId));
fs.writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`);
console.log(`Erstellt: ${path.relative(root, output480)}, ${path.relative(root, output960)}; Medienregister aktualisiert.`);
