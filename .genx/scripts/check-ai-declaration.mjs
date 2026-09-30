#!/usr/bin/env node
//
// Proves the seed's AI declaration against the @genesislcap/ai-assistant a generated app installed
// (C-15A.6 S-6). This is the only place "the assistant reads it" is checked, and it is checked where
// the pinned package really is.
//
//   baseline ⊆ declaration ⊆ GENESIS_AI_CONSUMES, for the kinds and for the resource fields.
//
// An assistant with no `./genesis/consumes` entry (before the release that added it) reads the
// baseline only, so the declaration must then BE the baseline. Absent means exactly Node's
// ERR_PACKAGE_PATH_NOT_EXPORTED for that subpath, when resolving it: the package missing, any error
// while loading the module (whatever its code), or a module without the constant fails the check.
//
// How: a child `node --input-type=module` runs in the client dir, so the app's own install answers,
// under import conditions. It calls import.meta.resolve, then import(), each in a try of its own, and
// prints what each said. Resolved with require instead, an export for import only reads as absent.
//
// Usage: node check-ai-declaration.mjs <.genx/ai-consumer.json> <generated app's client dir>

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// What every assistant with a chat reads, and what Create emits when a seed declares nothing (G-2).
const BASELINE = {
  kinds: ['request', 'event'],
  resourceFields: ['name', 'kind', 'op', 'context', 'maxRows'],
};

const [declarationFile, clientDir] = process.argv.slice(2);
const problems = [];

const declaration = JSON.parse(readFileSync(declarationFile, 'utf8'));
const listOfNames = (value) => Array.isArray(value) && value.every((item) => typeof item === 'string');
if (declaration.version !== 1) problems.push(`version is ${declaration.version}, not 1`);
for (const part of ['kinds', 'resourceFields']) {
  if (!listOfNames(declaration[part])) problems.push(`${part} is not a list of names`);
}

// See the header for why this runs in a child.
const SUBPATH = '@genesislcap/ai-assistant/genesis/consumes';
const probe = `
const said = {};
let url;
try {
  url = import.meta.resolve(${JSON.stringify(SUBPATH)});
} catch (error) {
  said.resolve = { code: error?.code, message: String(error?.message) };
}
if (url) {
  try {
    const loaded = await import(url);
    said.consumes = loaded.GENESIS_AI_CONSUMES ?? loaded.default?.GENESIS_AI_CONSUMES ?? null;
  } catch (error) {
    said.load = { code: error?.code, message: String(error?.message) };
  }
}
process.stdout.write('\\n' + JSON.stringify(said));
`;
const run = spawnSync(process.execPath, ['--input-type=module', '-e', probe], {
  cwd: clientDir,
  encoding: 'utf8',
});
let said = {};
try {
  // The last line: whatever the module itself prints comes before it.
  said = JSON.parse(run.stdout.trim().split('\n').pop());
} catch {
  const why = run.error?.message ?? (run.stderr.trim().split('\n')[0] || `exit ${run.status}`);
  problems.push(`${SUBPATH} could not be probed: ${why}`);
}
const absent =
  said.resolve?.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED' && said.resolve.message.includes("'./genesis/consumes'");
if (said.resolve && !absent) {
  problems.push(`${SUBPATH} could not be resolved: ${said.resolve.code ?? said.resolve.message}`);
}
if (said.load) {
  problems.push(`${SUBPATH} could not be loaded: ${said.load.code ?? said.load.message}`);
}
if (said.consumes === null) problems.push(`${SUBPATH} exports no GENESIS_AI_CONSUMES`);
const consumes = said.consumes ?? undefined;

const missing = (from, within) => from.filter((item) => !within.includes(item));
for (const part of ['kinds', 'resourceFields']) {
  const declared = listOfNames(declaration[part]) ? declaration[part] : [];
  const below = missing(BASELINE[part], declared);
  if (below.length) problems.push(`${part} leaves out the baseline's ${below.join(', ')}`);
  if (consumes) {
    const beyond = missing(declared, [...(consumes[part] ?? [])]);
    if (beyond.length) problems.push(`${part} names ${beyond.join(', ')}, which the installed assistant does not read`);
  } else if (absent) {
    // Nothing to read beyond the baseline: the declaration is the baseline, exactly.
    const beyond = missing(declared, BASELINE[part]);
    if (beyond.length) problems.push(`${part} names ${beyond.join(', ')}, and this assistant reads the baseline only`);
  }
}

problems.forEach((problem) => console.log(`    ${problem}`));
process.exit(problems.length ? 1 : 0);
