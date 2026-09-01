#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';

const mapping = JSON.parse(fs.readFileSync('data/kinderwagen-navigator/babywalz.mapping.v0.1.json', 'utf8'));
const offers = JSON.parse(fs.readFileSync('data/kinderwagen-navigator/offers.v0.1.json', 'utf8'));
const byProduct = new Map(mapping.mappings.map((item) => [item.productId, item]));

assert.ok(byProduct.get('kinderkraft-prime-3-2in1')?.merchantProductIds.includes('8355428'), 'Vollständiges PRIME-3-Set fehlt im Babywalz-Mapping.');
assert.deepEqual(byProduct.get('kinderkraft-esme-2in1')?.merchantProductIds.sort(), ['8387869', '8387877'], 'Die beiden exakten ESME-2in1-Varianten fehlen im Mapping.');
assert.ok(offers.offers.some((offer) => offer.productId === 'kinderkraft-prime-3-2in1' && offer.availability.status === 'in_stock'), 'Verfügbares PRIME-3-Angebot fehlt im importierten Feed.');
assert.equal(offers.offers.filter((offer) => offer.productId === 'kinderkraft-esme-2in1').every((offer) => offer.availability.status === 'out_of_stock'), true, 'ESME darf erst bei bestätigtem Bestand sichtbar werden.');

for (const productId of ['abc-design-samba-2', 'bugaboo-dragonfly-plus', 'cybex-mios-current', 'joolz-hub2']) {
  assert.equal(byProduct.has(productId), false, `${productId}: Teilkonfiguration oder Zubehör darf nicht als vollständiges Geburtsset gemappt werden.`);
}

console.log('Babywalz-Abdeckungstest bestanden: zwei neue exakte Zuordnungen, unvollständige Geburtssets bleiben ausgeschlossen.');
