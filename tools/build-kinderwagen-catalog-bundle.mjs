#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data', 'kinderwagen-navigator');
const catalogPath = path.join(dataDir, 'catalog.v0.1.json');
const outputPath = path.join(dataDir, 'catalog.bundle.v0.1.json');
const checkOnly = process.argv.includes('--check');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const products = catalog.products.map((filename) => {
  const productPath = path.join(dataDir, 'products', filename);
  if (!fs.existsSync(productPath)) throw new Error(`Katalogdatei fehlt: ${filename}`);
  return JSON.parse(fs.readFileSync(productPath, 'utf8'));
});
const ids = new Set();

for (const product of products) {
  if (!product.productId || ids.has(product.productId)) throw new Error(`Fehlende oder doppelte productId: ${product.productId ?? 'leer'}`);
  ids.add(product.productId);
  if (product.modelVersion !== catalog.modelVersion) {
    throw new Error(`${product.productId}: Model-Version ${product.modelVersion} passt nicht zu ${catalog.modelVersion}`);
  }
}

const bundle = {
  schemaVersion: 1,
  modelVersion: catalog.modelVersion,
  checkedAt: catalog.checkedAt,
  products
};
const serialized = `${JSON.stringify(bundle)}\n`;

if (checkOnly) {
  if (!fs.existsSync(outputPath)) {
    console.error('ERROR Katalog-Bundle fehlt. Erst ohne --check erzeugen.');
    process.exit(1);
  }
  if (fs.readFileSync(outputPath, 'utf8') !== serialized) {
    console.error('ERROR Katalog-Bundle ist nicht synchron mit Katalog und Produktdateien.');
    process.exit(1);
  }
  console.log(`Katalog-Bundle-Gate bestanden: ${products.length} Modelle in einem synchronen Browser-Payload.`);
} else {
  fs.writeFileSync(outputPath, serialized);
  console.log(`Katalog-Bundle aktualisiert: ${products.length} Modelle.`);
}
