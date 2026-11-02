#!/usr/bin/env bash
#
# Check what this seed emits for FDC3 (GENC-1812), and what it does NOT.
#
# Every app ships the FDC3 helper, its export and @genesislcap/foundation-fdc3; only the channel
# listeners follow `ui.fdc3.channels`. Each framework generates two apps, and every assertion here is
# a way that split could fail:
#
#   none       no FDC3 settings: src/utils/fdc3.ts (src/app/utils/fdc3.ts for Angular) holds
#              sendEventOnChannel, utils/index.ts re-exports it, package.json names the package in
#              every section that pins @genesislcap packages, and the app starts no listener.
#   channels   two channels: the app waits for FDC3 and listens on each channel with its type.
#   same       the helper, utils/index.ts and package.json are byte for byte the same in both apps, so
#              turning listening on or off never changes the package set or a page's import.
#   lazy       no helper builds a DefaultFDC3 at module load: its constructor starts waiting for an
#              FDC3 container, which an app that never broadcasts must not do.
#
# Usage:  .genx/scripts/check-fdc3-emission.sh [framework...]   (default: react webcomponents angular)
# Env:    SEED=...  the seed to check (default: this checkout). Mutation runs point it at a copy.
#         KEEP=1    keep the generated apps for inspection.
#         GENX=...  the genx package to generate with (default: a pinned version, so a run is
#                   reproducible).

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="${SEED:-$SEED_DIR}"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/blank-app-seed-fdc3.XXXXXXXX")" || exit 1
FAILURES=()
GENX="${GENX:-@genesislcap/genx@15.35.1}"
CHANNELS_UI='{"fdc3":{"channels":[{"name":"positions","type":"position"},{"name":"instrumentChannel","type":"fdc3.instrument"}]}}'

if [ $# -gt 0 ]; then
  FRAMEWORKS=("$@")
else
  FRAMEWORKS=(react webcomponents angular)
fi

fail() { FAILURES+=("$1"); echo "FAIL: $1"; }

generate() {
  local label="$1"; shift
  mkdir -p "$WORK_DIR/$label"
  (cd "$WORK_DIR/$label" && npx -y "$GENX" init demo -s "$SRC" -x --no-shell \
    --apiHost 'wss://localhost/gwf/' "$@" > "$WORK_DIR/$label.log" 2>&1) \
    || { fail "$label: generation failed (see $WORK_DIR/$label.log)"; return 1; }
  # genx logs a file it cannot render and ships it unrendered, so a broken {{#if}} passes generation.
  if grep -q 'Error interpolating variables' "$WORK_DIR/$label.log"; then
    fail "$label: genx could not render a file and shipped it unrendered: $(grep -o 'Error interpolating variables in [^ ]*' "$WORK_DIR/$label.log" | head -3 | tr '\n' ' ')"
  fi
}

echo "=== generating apps"
for fw in "${FRAMEWORKS[@]}"; do
  generate "$fw-none" --framework "$fw"
  generate "$fw-channels" --framework "$fw" --ui "$CHANNELS_UI"
done

echo "=== none, channels, same, lazy"
node - "$WORK_DIR" "$CHANNELS_UI" "${FRAMEWORKS[@]}" <<'NODE' || fail "the checks above (see their lines)"
const fs = require('fs');
const path = require('path');
const [workDir, channelsUi, ...frameworks] = process.argv.slice(2);
const problems = [];
const channels = JSON.parse(channelsUi).fdc3.channels;
const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
const PACKAGE = '@genesislcap/foundation-fdc3';
// Where each framework keeps its utils and the code that starts the listeners.
const LAYOUT = {
  react: { utils: 'src/utils', listeners: 'src/App.tsx' },
  webcomponents: { utils: 'src/utils', listeners: 'src/main/main.ts' },
  angular: { utils: 'src/app/utils', listeners: 'src/app/app.component.ts' },
};
const LISTENER = /\b(onFDC3Ready|listenToChannel)\b/;

for (const fw of frameworks) {
  const { utils, listeners } = LAYOUT[fw];
  const app = (variant) => path.join(workDir, `${fw}-${variant}`, 'demo', 'client');
  for (const variant of ['none', 'channels']) {
    const label = `${fw}-${variant}`;
    const helper = read(path.join(app(variant), utils, 'fdc3.ts'));
    const index = read(path.join(app(variant), utils, 'index.ts'));
    const pkg = read(path.join(app(variant), 'package.json'));
    const starter = read(path.join(app(variant), listeners));
    if (helper === null || !/export const sendEventOnChannel\b/.test(helper)) {
      problems.push(`${label}: ${utils}/fdc3.ts is missing or does not export sendEventOnChannel`);
    } else if (helper.split('\n').some((line) => /^\S.*new DefaultFDC3\(/.test(line))) {
      problems.push(`${label}: ${utils}/fdc3.ts builds a DefaultFDC3 at module load`);
    }
    if (index === null || !index.split('\n').includes("export * from './fdc3';")) {
      problems.push(`${label}: ${utils}/index.ts does not re-export ./fdc3`);
    }
    // Every section that pins @genesislcap packages (dependencies, and overrides where the framework has
    // them) names this one too.
    let json = null;
    try {
      json = JSON.parse(pkg);
    } catch {
      problems.push(`${label}: package.json is missing or not JSON`);
    }
    for (const section of ['dependencies', 'overrides']) {
      const pinned = json?.[section] && Object.keys(json[section]).some((name) => name.startsWith('@genesislcap/foundation-'));
      if (pinned && !json[section][PACKAGE]) problems.push(`${label}: package.json ${section} has no ${PACKAGE}`);
    }
    if (starter === null) {
      problems.push(`${label}: ${listeners} is missing`);
    } else if (variant === 'none' && LISTENER.test(starter)) {
      problems.push(`${label}: ${listeners} starts an FDC3 listener with no channel set`);
    } else if (variant === 'channels') {
      if (!/\bonFDC3Ready\(/.test(starter)) problems.push(`${label}: ${listeners} never waits for FDC3`);
      for (const { name, type } of channels) {
        if (!new RegExp(`listenToChannel\\(\\s*'${name}',\\s*'${type.replace(/\./g, '\\.')}'`).test(starter)) {
          problems.push(`${label}: ${listeners} does not listen on ${name} (${type})`);
        }
      }
    }
  }
  for (const file of [`${utils}/fdc3.ts`, `${utils}/index.ts`, 'package.json']) {
    if (read(path.join(app('none'), file)) !== read(path.join(app('channels'), file))) {
      problems.push(`${fw}: ${file} differs between the app with no FDC3 settings and the one with channels`);
    }
  }
}

problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "FDC3 emission checks passed: ${FRAMEWORKS[*]}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
