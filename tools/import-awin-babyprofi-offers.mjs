#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from './import-awin-offers.mjs';
export * from './import-awin-offers.mjs';

console.warn('Hinweis: import-awin-babyprofi-offers.mjs bleibt als Kompatibilitätsalias erhalten. Für neue Programme import-awin-offers.mjs verwenden.');

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) runCli();
