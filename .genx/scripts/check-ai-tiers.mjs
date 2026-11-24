#!/usr/bin/env node
//
// Holds the AI chat proxy's model allowlists (.genx/ai-models.json) to foundation-ui's
// DEFAULT_AI_TIERS at the UI version this seed pins (.genx/versions.json UI).
//
// The generated app's panel picks its model from DEFAULT_AI_TIERS, and the generated proxy refuses
// any model not on its allowlist with MODEL_NOT_ALLOWED. So a UI bump that moves a tier (say to the
// Claude 5.5 models) without the same change to ai-models.json breaks every chat request an exported
// app makes, and nothing else would notice: Create's preview chat goes through Create's own proxy.
//
//   - every vendor in ai-models.json must be in the table, with exactly the table's tiers and, per
//     tier, the table's model. A vendor the seed has that the table lacks fails: its panel would
//     have no models to ask for.
//   - a vendor in the table that the seed has no models for is reported, not failed: Create's schema
//     will not resolve it for this seed, so no app can ask for it.
//
// How: `npm pack` fetches the pinned @genesislcap/foundation-ai tarball alone (no dependencies, no
// install scripts) into a temporary folder, and the tier table's own module is imported from there.
// That module is pure data and imports nothing (its header says so: it is loaded in bare Node by
// Create's server), so no dependency is needed. It is copied to .mjs first, because the package does
// not declare "type": "module".
//
// Usage: node .genx/scripts/check-ai-tiers.mjs
// Env:   FOUNDATION_AI_DIR=...  check against an unpacked foundation-ai package (the folder holding its
//                               package.json) instead of fetching the pinned one, e.g. a local build.

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const seedDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = (file) => JSON.parse(readFileSync(path.join(seedDir, file), 'utf8'));
const ui = readJson('.genx/versions.json').UI;
const seedModels = readJson('.genx/ai-models.json');
// The tier table's module, inside the package.
const TIERS_MODULE = 'dist/esm/tiers/ai-tiers.js';

const work = mkdtempSync(path.join(tmpdir(), 'blank-app-seed-ai-tiers-'));
let pkgDir = process.env.FOUNDATION_AI_DIR;
try {
  if (!pkgDir) {
    const spec = `@genesislcap/foundation-ai@${ui}`;
    const tarball = execFileSync('npm', ['pack', spec, '--silent', '--pack-destination', work], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    })
      .trim()
      .split('\n')
      .pop();
    execFileSync('tar', ['-xzf', path.join(work, tarball), '-C', work]);
    pkgDir = path.join(work, 'package');
  }

  const version = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8')).version;
  if (!process.env.FOUNDATION_AI_DIR && version !== ui) {
    throw new Error(`npm pack fetched foundation-ai ${version}, not the pinned ${ui}`);
  }
  const tiersFile = path.join(pkgDir, TIERS_MODULE);
  if (!existsSync(tiersFile)) {
    throw new Error(
      `foundation-ai ${version} has no ${TIERS_MODULE}; find where DEFAULT_AI_TIERS moved and update this check`,
    );
  }
  const copy = path.join(work, 'ai-tiers.mjs');
  copyFileSync(tiersFile, copy);
  const { DEFAULT_AI_TIERS: table } = await import(pathToFileURL(copy).href);
  if (!table || typeof table !== 'object') {
    throw new Error(`foundation-ai ${version}'s ${TIERS_MODULE} exports no DEFAULT_AI_TIERS`);
  }

  const problems = [];
  const notes = [];
  for (const [vendor, tiers] of Object.entries(seedModels)) {
    const theirs = table[vendor];
    if (!theirs) {
      problems.push(`${vendor}: not in DEFAULT_AI_TIERS (it has ${Object.keys(table).join(', ')})`);
      continue;
    }
    const tierIds = [...new Set([...Object.keys(tiers), ...Object.keys(theirs)])];
    for (const tier of tierIds) {
      const want = theirs[tier]?.model;
      const have = tiers[tier];
      if (want !== have) {
        problems.push(`${vendor}.${tier}: ai-models.json has ${have ?? 'nothing'}, DEFAULT_AI_TIERS has ${want ?? 'nothing'}`);
      }
    }
  }
  for (const vendor of Object.keys(table)) {
    if (!Object.hasOwn(seedModels, vendor)) {
      notes.push(`${vendor}: in DEFAULT_AI_TIERS, but this seed has no proxy models for it (not an error)`);
    }
  }

  notes.forEach((note) => console.log(`    note: ${note}`));
  if (problems.length) {
    console.log(`    .genx/ai-models.json does not match foundation-ai ${version}'s DEFAULT_AI_TIERS:`);
    problems.forEach((problem) => console.log(`    ${problem}`));
    console.log('    Update .genx/ai-models.json to the table, so the generated proxy allows the models its panel asks for.');
    process.exitCode = 1;
  } else {
    console.log(`    .genx/ai-models.json matches foundation-ai ${version}'s DEFAULT_AI_TIERS`);
  }
} catch (error) {
  console.log(`    ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
