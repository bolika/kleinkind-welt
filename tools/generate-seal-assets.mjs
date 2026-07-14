#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsonPath = path.join(root, 'data', 'spielzeug-siegel.json');
const csvPath = path.join(root, 'data', 'spielzeug-siegel.csv');
const articlePath = path.join(root, 'artikel', 'nachhaltiges-spielzeug-siegel.html');
const checkOnly = process.argv.includes('--check');
const startMarker = '  <!-- DATASET:spielzeug-siegel:start -->';
const endMarker = '  <!-- DATASET:spielzeug-siegel:end -->';

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const escapeCsv = (value) => {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const dataset = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
if (!/^\d{4}\.\d{2}\.\d{2}$/.test(dataset.version) || !Array.isArray(dataset.entries)) {
  throw new Error('Invalid seal dataset version or entries');
}

const csvHeaders = [
  'id', 'name', 'geltungsbereich', 'pflicht_fuer_eu_spielzeug',
  'redaktionelle_einordnung', 'belegt_nicht', 'verbrauchercheck',
  'primaerquelle', 'datenstand',
];
const csvRows = dataset.entries.map((entry) => [
  entry.id,
  entry.name,
  entry.scope,
  entry.mandatoryForToysInEU ? 'ja' : 'nein',
  entry.assessment,
  entry.doesNotProve.join('; '),
  entry.consumerCheck,
  entry.primarySource,
  dataset.reviewedAt,
]);
const csv = `${[csvHeaders, ...csvRows].map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`;

const tableRows = dataset.entries.map((entry) => {
  const status = entry.mandatoryForToysInEU ? 'Pflicht für Spielzeug im EU-Markt' : 'freiwillig';
  const limitations = entry.doesNotProve.join(', ');
  return `        <tr>
          <td><strong>${escapeHtml(entry.name)}</strong><br>${status}</td>
          <td>${escapeHtml(entry.scope)}. ${escapeHtml(entry.assessment)}</td>
          <td>${escapeHtml(limitations)}.</td>
          <td>${escapeHtml(entry.consumerCheck)} <a href="${escapeHtml(entry.primarySource)}" target="_blank" rel="noopener">Primärquelle</a></td>
        </tr>`;
}).join('\n');

const changelog = dataset.changeLog.map((item) =>
  `      <li><strong>${escapeHtml(item.date.split('-').reverse().join('.'))} – Version ${escapeHtml(item.version)}:</strong> ${escapeHtml(item.changes)}</li>`,
).join('\n');

const generatedHtml = `${startMarker}
  <div class="table-scroll">
    <table class="budget-table" aria-label="Offener Vergleich von Kennzeichnungen und Siegeln bei Spielzeug">
      <caption>Datensatz Version ${escapeHtml(dataset.version)} – die Quelle in der letzten Spalte dokumentiert die jeweilige Einordnung.</caption>
      <thead>
        <tr>
          <th>Kennzeichnung</th>
          <th>Deckt ab</th>
          <th>Belegt nicht</th>
          <th>Konkreter Check und Primärquelle</th>
        </tr>
      </thead>
      <tbody>
${tableRows}
      </tbody>
    </table>
  </div>

  <details class="dataset-changelog">
    <summary>Änderungsprotokoll des Datensatzes</summary>
    <ul>
${changelog}
    </ul>
  </details>
${endMarker}`;

const article = fs.readFileSync(articlePath, 'utf8');
const start = article.indexOf(startMarker);
const end = article.indexOf(endMarker);
if (start === -1 || end === -1 || end <= start) {
  throw new Error('Dataset markers not found exactly once in article');
}
const nextArticle = `${article.slice(0, start)}${generatedHtml}${article.slice(end + endMarker.length)}`;

const changes = [];
if (fs.readFileSync(csvPath, 'utf8') !== csv) changes.push(csvPath);
if (article !== nextArticle) changes.push(articlePath);

if (checkOnly && changes.length) {
  console.error(`Generated seal assets are stale: ${changes.map((item) => path.relative(root, item)).join(', ')}`);
  process.exit(1);
}
if (!checkOnly) {
  fs.writeFileSync(csvPath, csv);
  fs.writeFileSync(articlePath, nextArticle);
}
console.log(checkOnly ? 'Seal assets are current.' : `Updated ${changes.length} generated seal asset(s).`);
