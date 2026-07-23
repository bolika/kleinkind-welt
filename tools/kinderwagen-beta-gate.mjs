#!/usr/bin/env node

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gates = [
  'tools/kinderwagen-navigator-gate.mjs',
  'tools/kinderwagen-question-flow-test.mjs',
  'tools/kinderwagen-product-data-gate.mjs',
  'tools/kinderwagen-matcher-test.mjs',
  'tools/kinderwagen-persona-coverage.mjs',
  'tools/kinderwagen-source-registry-gate.mjs',
  'tools/kinderwagen-catalog-expansion-gate.mjs',
  'tools/kinderwagen-vehicle-data-gate.mjs',
  'tools/kinderwagen-offer-data-gate.mjs',
  'tools/kinderwagen-offer-import-test.mjs',
  'tools/kinderwagen-navigator-ui-gate.mjs'
];

for (const gate of gates) {
  console.log(`\n→ ${gate}`);
  const result = spawnSync(process.execPath, [path.join(root, gate)], {
    cwd: root,
    stdio: 'inherit'
  });
  if (result.status !== 0) {
    console.error(`\nBeta-Gate abgebrochen: ${gate} ist fehlgeschlagen.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nKinderwagen-Beta-Gate bestanden: ${gates.length} Prüfungen ohne Fehler.`);
