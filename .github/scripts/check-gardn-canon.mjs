#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CHECK_EXTENSIONS = new Set(['.html', '.md']);
const IGNORE_DIRS = new Set(['.git', '.github', 'assets']);

const BLOCKED_PATTERNS = [
  { re: /£5\.99/i, reason: 'old monthly price' },
  { re: /15\s*\/\s*month\s*free/i, reason: 'old Ask Gardn free cap' },
  { re: /\bAsk Gardn\b[\s\S]{0,120}\b15\s*\/\s*month/i, reason: 'old Ask Gardn free cap' },
  { re: /\bunlimited on premium\b/i, reason: 'absolute premium allowance claim' },
  { re: /\beffectively unlimited\b/i, reason: 'absolute premium allowance claim' },
  { re: /\bwith the caps removed\b/i, reason: 'absolute premium allowance claim' },
  { re: /\bPremium removes\b[^.]{0,80}\b(?:limits|allowances)\b/i, reason: 'absolute premium allowance claim' },
  { re: /\bautomatically convert(?:s|ed)? to a paid/i, reason: 'store-trial wording for default no-card trial' },
  { re: /\bafter a 7-day free trial\b/i, reason: 'trial auto-conversion implication' },
  { re: /\b7-day free trial,\s*then\s*£6\.99\b/i, reason: 'trial auto-conversion implication' },
  { re: /\bwith a 7-day free trial\b/i, reason: 'default trial wording should say no-card trial' },
  { re: /\bfree trial and all\b/i, reason: 'default trial wording should say no-card trial' },
  { re: /\blimit on the number of plants\b/i, reason: 'stale free-tier plant-count limit' },
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (CHECK_EXTENSIONS.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const failures = [];
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of BLOCKED_PATTERNS) {
    const match = text.match(pattern.re);
    if (match) failures.push(`${rel}: ${pattern.reason} (${match[0].replace(/\s+/g, ' ')})`);
  }
}

if (failures.length > 0) {
  console.error('Gardn World canon drift detected:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Gardn World canon check passed.');
