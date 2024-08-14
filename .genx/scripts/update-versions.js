const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const current = require('../versions.json');

const args = process.argv.slice(2);
const patchOnly = args.indexOf("--patch-only") >= 0;
const dryRun = args.indexOf("--dry-run") >= 0;

const VERSION_REGEX = /\d+$/;

const jfrogVersionMatcher = patchOnly ? current.GSF.replace(VERSION_REGEX, '*') : undefined;

const npmVersionMatcher = patchOnly ? current.UI.replace(VERSION_REGEX, 'x') : 'latest';

console.log('Running with: ', {patchOnly, dryRun, npmVersionMatcher, jfrogVersionMatcher})

const run = (command) =>
  execSync(command, {
    stdio: ['pipe', 'pipe', 'ignore'],
  })
    .toString('utf8')
    .trim();

const writeJSON = (json, path) => {
  const data = JSON.stringify(json, null, 2) + '\n';
  console.log(`Updating data in ${path}`);
  try {
    writeFileSync(path, data);
  } catch (e) {
    console.log(e);
  }
};

const UI = run(`npm info @genesislcap/foundation-ui@${npmVersionMatcher} version`);

const GSF = run(
  `jf rt s "libs-release-client/global/genesis/genesis-distribution/${jfrogVersionMatcher ?? ''}" --exclusions="*-RC*;*-SNAPSHOT*;*maven-metadata*;*test*;*TEST*" | grep path | tr -s ' ' | sed 's/"path": //g' | awk -F'/' '{print $(NF-1)}' | sort -V | tail -n 1`,
);

const Auth = run(
  `jf rt s "libs-release-client/global/genesis/auth-distribution/${jfrogVersionMatcher ?? ''}" --exclusions="*-RC*;*-SNAPSHOT*;*maven-metadata*;*test*;*TEST*" | grep path | tr -s ' ' | sed 's/"path": //g' | awk -F'/' '{print $(NF-1)}' | sort -V | tail -n 1`,
);
const latest = { UI, GSF, Auth };

console.log('Current:', current);
console.log('Latest:', latest);

if (current.UI !== UI || current.GSF !== GSF || current.Auth !== Auth) {
  console.log('Newer versions available');
  const path = resolve(__dirname, '../versions.json');
  if (!dryRun) {
    writeJSON(latest, path);
  } else {
    console.log('Dry run execution, versions will not be written.')
  }
} else {
  console.log('No newer versions available');
}
