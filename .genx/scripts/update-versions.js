const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');
const current = require('../versions.json');

const args = process.argv.slice(2);

const argDefined = (name) => args.indexOf(name) >= 0;

const patchOnly = argDefined("--patch-only");
const dryRun = argDefined("--dry-run");
const skipServer = argDefined("--skip-server");

const VERSION_REGEX = /\d+$/;
const JFROG_BASE_EXCLUSIONS = '*-SNAPSHOT*;*maven-metadata*;*test*;*TEST*';

const { jfrogVersionMatcher, jfrogExclusionsMatcher, npmVersionMatcher } = patchOnly
  ? { jfrogVersionMatcher: current.GSF.replace(VERSION_REGEX, '*'), jfrogExclusionsMatcher: `*-beta*;*-RC*;${JFROG_BASE_EXCLUSIONS}`, npmVersionMatcher: current.UI.replace(VERSION_REGEX, 'x') }
  : { jfrogVersionMatcher: undefined, jfrogExclusionsMatcher: JFROG_BASE_EXCLUSIONS, npmVersionMatcher: 'latest' };

console.log('Running with: ', { patchOnly, skipServer, dryRun, npmVersionMatcher, jfrogVersionMatcher, jfrogExclusionsMatcher });

const run = (command) => {
  console.debug('running:', command);
  return execSync(command, {
    stdio: ['pipe', 'pipe', 'ignore'],
  })
    .toString('utf8')
    .trim();
};

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

const serverOsCommandPipeline = `grep path | tr -s ' ' | sed 's/"path": //g' | awk -F'/' '{print $(NF-1)}' | sort -V | tail -n 1`;

const { GSF, Auth } = skipServer
  ? { GSF: current.GSF, Auth: current.Auth }
  : {
    GSF: run(
      `jf rt s "libs-release-client/global/genesis/genesis-distribution/${jfrogVersionMatcher ?? ''}" --exclusions="${jfrogExclusionsMatcher}" | ${serverOsCommandPipeline}`
    ),
    Auth: run(
      `jf rt s "libs-release-client/global/genesis/auth-distribution/${jfrogVersionMatcher ?? ''}" --exclusions="${jfrogExclusionsMatcher}" | ${serverOsCommandPipeline}`,
    )
  };

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
