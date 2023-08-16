const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve, dirname }  = require('node:path');

const current = require('../versions.json');

const run = (command) => execSync(command, {
    stdio: ['pipe', 'pipe', 'ignore'],
  })
    .toString('utf8')
    .trim();

console.log('Current:', current);

const UI = run('npm info @genesislcap/foundation-ui@latest version');
const GSF = run(`jf rt s "libs-release-client/global/genesis/genesis-distribution/" --sort-by=created --sort-order=desc --limit=1 --exclusions="*-RC*;*-SNAPSHOT*" | grep path | tr -s ' ' | cut -d '/' -f 5`);
const Auth = run(`jf rt s "libs-release-client/global/genesis/auth-distribution/" --sort-by=created --sort-order=desc --limit=1 --exclusions="*-RC*;*-SNAPSHOT*" | grep path | tr -s ' ' | cut -d '/' -f 5`);
console.log('Latest:', { UI, GSF, Auth });

console.log('Diff', { UI: current.UI === UI, GSF: current.GSF === GSF, Auth: current.Auth === Auth });
