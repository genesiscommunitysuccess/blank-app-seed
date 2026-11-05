#!/usr/bin/env node
//
// Checks what a generated app holds for FDC3 (GENC-1812). generate-test-apps.sh runs it on each
// framework's default app and its FDC3-channels app, before installing them.
//
// Every app ships the FDC3 helper, its export and @genesislcap/foundation-fdc3; only the channel
// listeners follow `ui.fdc3.channels`. Every assertion here is a way that split could fail:
//
//   none       no FDC3 settings: src/utils/fdc3.ts (src/app/utils/fdc3.ts for Angular) holds
//              sendEventOnChannel, utils/index.ts re-exports it, package.json names the package in
//              every section that pins @genesislcap packages, and the app starts no listener.
//   channels   the app waits for FDC3 and listens on each channel with its type.
//   same       the helper and utils/index.ts are byte for byte the same in both apps, and so are
//              package.json's package sections (its name follows the app's), so turning listening on
//              or off never changes the package set or a page's import. The no-settings app leaves its
//              copies in <stash dir>; the channels app compares with them.
//   lazy       the helper builds one DefaultFDC3, on first use: its constructor starts waiting for an
//              FDC3 container, which an app that never broadcasts must not do, and in an interop.io
//              container adds a channel listener it never removes, so it is built neither at module
//              load nor per broadcast or listener.
//
// Usage: node check-fdc3-emission.mjs <framework> <generated app's client dir> <stash dir> [<ui json>]
//        With no ui JSON the app has no FDC3 settings; with one, its `fdc3.channels` are expected.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [framework, client, stash, uiJson] = process.argv.slice(2);
// Where each framework keeps its utils and the code that starts the listeners.
const LAYOUT = {
  react: { utils: 'src/utils', listeners: 'src/App.tsx' },
  webcomponents: { utils: 'src/utils', listeners: 'src/main/main.ts' },
  angular: { utils: 'src/app/utils', listeners: 'src/app/app.component.ts' },
};
const PACKAGE = '@genesislcap/foundation-fdc3';
const LISTENER = /\b(onFDC3Ready|listenToChannel)\b/;

if (!LAYOUT[framework] || !client || !stash) {
  console.error('usage: node check-fdc3-emission.mjs <react|webcomponents|angular> <client dir> <stash dir> [<ui json>]');
  process.exit(2);
}
const { utils, listeners } = LAYOUT[framework];
const channels = uiJson ? JSON.parse(uiJson).fdc3.channels : null;
const label = `${framework}-${channels ? 'channels' : 'none'}`;
const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : null);
const problems = [];

const helper = read(join(client, utils, 'fdc3.ts'));
const index = read(join(client, utils, 'index.ts'));
const pkg = read(join(client, 'package.json'));
const starter = read(join(client, listeners));

if (helper === null || !/export const sendEventOnChannel\b/.test(helper)) {
  problems.push(`${utils}/fdc3.ts is missing or does not export sendEventOnChannel`);
} else if (
  (helper.match(/new DefaultFDC3\(/g) ?? []).length !== 1 ||
  !/=>\s*\(\s*\w+\s*\?\?=\s*new DefaultFDC3\(\)\s*\)/.test(helper)
) {
  problems.push(`${utils}/fdc3.ts does not build one DefaultFDC3 lazily, on first use`);
}
if (index === null || !index.split('\n').includes("export * from './fdc3';")) {
  problems.push(`${utils}/index.ts does not re-export ./fdc3`);
}
// Every section that pins @genesislcap packages (dependencies, and overrides where the framework has
// them) names this one too.
let json = null;
try {
  json = JSON.parse(pkg);
} catch {
  problems.push('package.json is missing or not JSON');
}
for (const section of ['dependencies', 'overrides']) {
  const pinned = json?.[section] && Object.keys(json[section]).some((name) => name.startsWith('@genesislcap/foundation-'));
  if (pinned && !json[section][PACKAGE]) problems.push(`package.json ${section} has no ${PACKAGE}`);
}
if (starter === null) {
  problems.push(`${listeners} is missing`);
} else if (!channels && LISTENER.test(starter)) {
  problems.push(`${listeners} starts an FDC3 listener with no channel set`);
} else if (channels) {
  if (!/\bonFDC3Ready\(/.test(starter)) problems.push(`${listeners} never waits for FDC3`);
  for (const { name, type } of channels) {
    if (!new RegExp(`listenToChannel\\(\\s*'${name}',\\s*'${type.replace(/\./g, '\\.')}'`).test(starter)) {
      problems.push(`${listeners} does not listen on ${name} (${type})`);
    }
  }
}

const SAME = [`${utils}/fdc3.ts`, `${utils}/index.ts`, 'package.json'];
if (!channels) {
  for (const file of SAME) {
    if (!existsSync(join(client, file))) continue;
    mkdirSync(dirname(join(stash, file)), { recursive: true });
    copyFileSync(join(client, file), join(stash, file));
  }
} else {
  // package.json names the app, which differs between the two; its packages must not.
  const packages = (text) => {
    const { dependencies, devDependencies, peerDependencies, overrides } = JSON.parse(text);
    return JSON.stringify({ dependencies, devDependencies, peerDependencies, overrides });
  };
  for (const file of SAME) {
    const none = read(join(stash, file));
    const here = read(join(client, file));
    if (none === null) problems.push(`no copy of ${file} from the app with no FDC3 settings in ${stash}`);
    else if (here === null || (file === 'package.json' ? packages(none) !== packages(here) : none !== here)) {
      problems.push(`${file} differs from the app with no FDC3 settings`);
    }
  }
}

problems.forEach((p) => console.log(`    ${label}: ${p}`));
if (problems.length) process.exit(1);
console.log(`    ${label}: FDC3 emission checks passed`);
