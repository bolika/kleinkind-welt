#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const briefsDir = path.join(root, 'content-briefs');
const files = fs.readdirSync(briefsDir).filter((name) => name.endsWith('.json')).sort();
const errors = [];
const warnings = [];
const today = new Date().toISOString().slice(0, 10);

if (!files.length) errors.push('No content briefs found');

for (const file of files) {
  const relative = `content-briefs/${file}`;
  let brief;
  try {
    brief = JSON.parse(fs.readFileSync(path.join(briefsDir, file), 'utf8'));
  } catch (error) {
    errors.push(`${relative}: invalid JSON (${error.message})`);
    continue;
  }

  const required = ['schemaVersion', 'slug', 'status', 'primaryQuery', 'searchIntent', 'sources', 'claims', 'reviewDueAt', 'humanApproval'];
  for (const field of required) {
    if (!(field in brief)) errors.push(`${relative}: missing ${field}`);
  }
  if (brief.schemaVersion !== 1) errors.push(`${relative}: unsupported schemaVersion`);
  if (!/^[a-z0-9-]+$/.test(brief.slug ?? '')) errors.push(`${relative}: invalid slug`);
  if (!['draft', 'review_required', 'approved', 'published'].includes(brief.status)) {
    errors.push(`${relative}: invalid status ${brief.status}`);
  }
  if (!Array.isArray(brief.sources) || !brief.sources.length) errors.push(`${relative}: sources must not be empty`);
  if (!Array.isArray(brief.claims)) errors.push(`${relative}: claims must be an array`);

  const sourceIds = new Set();
  for (const source of brief.sources ?? []) {
    if (!source.id || sourceIds.has(source.id)) errors.push(`${relative}: missing or duplicate source id`);
    sourceIds.add(source.id);
    if (!String(source.url ?? '').startsWith('https://')) errors.push(`${relative}: source ${source.id} must use HTTPS`);
    if (!['primary', 'official', 'study', 'manufacturer', 'retailer', 'editorial', 'reviews'].includes(source.kind)) {
      errors.push(`${relative}: source ${source.id} has invalid kind`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt ?? '')) errors.push(`${relative}: source ${source.id} lacks checkedAt`);
  }

  for (const claim of brief.claims ?? []) {
    if (!claim.id || !claim.text || !Array.isArray(claim.sourceIds)) errors.push(`${relative}: incomplete claim`);
    const linkedSources = (claim.sourceIds ?? []).map((id) => brief.sources.find((source) => source.id === id));
    if (linkedSources.some((source) => !source)) errors.push(`${relative}: claim ${claim.id} references unknown source`);
    if (['safety', 'development'].includes(claim.type) && !linkedSources.some((source) => ['primary', 'official', 'study'].includes(source?.kind))) {
      errors.push(`${relative}: claim ${claim.id} needs a primary, official or study source`);
    }
    if (typeof claim.approvedForPublish !== 'boolean') errors.push(`${relative}: claim ${claim.id} lacks approval state`);
  }

  const ready = brief.publishReady === true || ['approved', 'published'].includes(brief.status);
  if (ready) {
    if (!brief.humanApproval?.approvedBy || !brief.humanApproval?.approvedAt) {
      errors.push(`${relative}: publish-ready content requires named human approval and date`);
    }
    for (const claim of brief.claims ?? []) {
      if (!claim.approvedForPublish) errors.push(`${relative}: publish-ready claim ${claim.id} is not approved`);
    }
  }
  if (brief.reviewDueAt < today) errors.push(`${relative}: review overdue since ${brief.reviewDueAt}`);
  if (!ready) warnings.push(`${relative}: not publish-ready; human approval remains open`);
}

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}
console.log(`Content brief gate passed (${files.length} brief${files.length === 1 ? '' : 's'}, ${warnings.length} warning${warnings.length === 1 ? '' : 's'}).`);
