#!/usr/bin/env bash
#
# Check what this seed emits for the AI chat feature, and what it does NOT.
#
# The server half of the feature is gated on ONE value — `data.AI.enabled` in configure.js — and
# every assertion here is a way that gate could fail silently:
#
#   off       ui.ai absent and ui.ai.enabled=false generate the same app, and neither carries any
#             AI file. A project that never asked for chat must not change.
#   on        the proxy, the router body cap and the README section all appear; the proxy is its
#             template with only its two limits filled in, for either vendor; and no AI item lands in
#             a system-definition file (a generator may rewrite those, so the proxy must not need one).
#             The client gets its ai-config.json (exactly the contract's fields, whatever the prompt
#             holds), the assistant package and the AI build flag, and nothing else.
#   non-react ui.ai.enabled on a non-React app emits nothing: there is no panel to call the proxy.
#   C-8       the contract files shared with Create are byte-for-byte the copies Create pins, and
#             each of Create's resolver cases reaches the app as exactly its contract fields.
#   leaks     no generated file carries anything Create's export guard would refuse.
#
# Usage:  .genx/scripts/check-ai-emission.sh
# Env:    GRADLE=1  also build the AI app's server, require the platform's own security scan
#                   (checkAuthPermissions) to report no insecure endpoint, and compile both vendors'
#                   proxies with the platform's preCompileScripts. Needs Genesis artifactory credentials,
#                   as the sample-app build does.
#         GRADLE_PARAMS=...  extra arguments for every gradle call (CI passes -PuseDevRepo=true on
#                   prerelease).
#         KEEP=1    keep the generated apps for inspection.
#         GENX=...  the genx package to generate with (default: a pinned version, so a run is
#                   reproducible; set GENX=@genesislcap/genx@latest to try the newest).
#         BASELINE_REF=...  also compare an AI-off app against this release (e.g. origin/main). Off
#                   unless set: the changes it allows are this branch's own, so once they are released
#                   any other change to an AI-off app would fail it.

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TEMPLATE="$SEED_DIR/.genx/templates/server/ai-service-web-handler.kts.hbs"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/blank-app-seed-ai.XXXXXXXX")" || exit 1
MODULE="server/demo-app/src/main/genesis"
FAILURES=()
GENX="${GENX:-@genesislcap/genx@15.35.1}"

# The Gemini app runs on the 'ai' fixture: resources of both kinds and a prompt full of Handlebars that
# renders, so a missing escape changes the file. Text Handlebars cannot even parse is a separate case:
# there a whole-file render fails and genx ships the file as written, which only the log check catches.
AI_FIXTURE="$SEED_DIR/.genx/tests/fixtures/ai-config.json"
AI_UI="$(cat "$AI_FIXTURE")"
AI_UI_BREAKERS="$(cat "$SEED_DIR/.genx/tests/fixtures/ai-config-parse-breakers.json")"
AI_UI_ANTHROPIC='{"ai":{"enabled":true,"vendor":"anthropic","tier":"high","systemPrompt":"x","resources":[]}}'
# The limits configure.js writes into the proxy, per vendor: every tier of that vendor's models.
GEMINI_MODELS='gemini-3.1-flash-lite,gemini-3.8-flash,gemini-3.1-pro-preview'
ANTHROPIC_MODELS='claude-haiku-4-5-20251001,claude-sonnet-5,claude-opus-4-8'

fail() { FAILURES+=("$1"); echo "FAIL: $1"; }

generate() {
  local label="$1"; shift
  mkdir -p "$WORK_DIR/$label"
  (cd "$WORK_DIR/$label" && npx -y "$GENX" init demo -s "${SEED:-$SEED_DIR}" -x --no-shell \
    --apiHost 'wss://localhost/gwf/' "$@" > "$WORK_DIR/$label.log" 2>&1) \
    || { fail "$label: generation failed (see $WORK_DIR/$label.log)"; return 1; }
  # genx logs a file it cannot render and ships it unrendered, so a broken {{#if}} in a template, or a
  # {{ that escaped the ai-config writer, passes generation and only surfaces later, or never.
  if grep -q 'Error interpolating variables' "$WORK_DIR/$label.log"; then
    fail "$label: genx could not render a file and shipped it unrendered: $(grep -o 'Error interpolating variables in [^ ]*' "$WORK_DIR/$label.log" | head -3 | tr '\n' ' ')"
  fi
}

# Every file or block the feature adds. Used both ways: all present when on, none when off.
ai_artifacts_present() {
  local app="$WORK_DIR/$1/demo"
  local found=0
  [ -f "$app/$MODULE/scripts/ai-service-web-handler.kts" ] && found=$((found + 1))
  grep -q httpObjectAggregator "$app/$MODULE/scripts/genesis-router.kts" && found=$((found + 1))
  grep -q '^## AI chat' "$app/README.md" && found=$((found + 1))
  [ -f "$app/client/src/ai/generated/ai-config.json" ] && found=$((found + 1))
  grep -q '"@genesislcap/ai-assistant"' "$app/client/package.json" && found=$((found + 1))
  echo "$found"
}

# The C-8 contract files are Create's (server/shared-schemas/ai/), copied here verbatim. Create's resolver
# test pins the same digests, so an edit on either side fails until both sides bump the version together.
echo "=== C-8 contract copies"
node - "$SEED_DIR/.genx/tests/contracts/ai" <<'NODE' || fail "C-8: a contract copy is not the one Create pins (see above)"
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const pinned = {
  'ui-config-ai.schema.json': { version: '1.1.0', sha256: '9b5c6607fe567545ca526d3b9b96e472d1bd9d56ab0016f609f8f025c4d35e82' },
  'ai-resolver-cases.json': { version: '1.1.0', sha256: '17cdbfc1d8351a80e2d35240a07a5bbb2e9784eb044ea717a0f1fb72abbce9b2' },
};
let bad = 0;
for (const [file, want] of Object.entries(pinned)) {
  const bytes = fs.readFileSync(path.join(process.argv[2], file));
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const { version } = JSON.parse(bytes);
  if (sha256 !== want.sha256 || version !== want.version) {
    console.log(`    ${file}: version ${version}, sha256 ${sha256}`);
    bad++;
  }
}
process.exit(bad ? 1 : 0);
NODE

echo "=== Generating into $WORK_DIR"
generate default --framework react
generate off --framework react --ui '{"ai":{"enabled":false}}'
generate on --framework react --ui "$AI_UI"
generate onanthropic --framework react --ui "$AI_UI_ANTHROPIC"
generate breakers --framework react --ui "$AI_UI_BREAKERS"
# The fixture with fields the contract does not have smuggled in, which the writer must drop.
generate extras --framework react --ui "$(node -e 'const u = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); u.ai.budgetUsd = 5; u.ai.endpoint = "https://example.invalid"; u.ai.resources[0].url = "https://example.invalid"; console.log(JSON.stringify(u))' "$AI_FIXTURE")"
generate nonreact --framework webcomponents --ui "$AI_UI"

echo "=== off"
[ "$(ai_artifacts_present default)" = "0" ] || fail "off: a project with no ui.ai carries AI files"
[ "$(ai_artifacts_present off)" = "0" ] || fail "off: ui.ai.enabled=false still emitted AI files"
# answers.json records the seed path and a timestamped layout key, so it differs on every run.
diff -r -x node_modules -x answers.json "$WORK_DIR/default/demo" "$WORK_DIR/off/demo" > /dev/null \
  || fail "off: ui.ai.enabled=false generates a different app from no ui.ai at all"

# Against the last release: an AI-off app may differ from it only in the changes this branch makes
# on purpose — the Genesis Start launcher version, the repository it needs, its client scripts and
# the README section about them — and in nothing else, line by line.
BASELINE_REF="${BASELINE_REF:-}"
if [ -z "$BASELINE_REF" ]; then
  echo "=== off vs a release: skipped, set BASELINE_REF to run it"
elif ! git -C "$SEED_DIR" rev-parse --verify -q "$BASELINE_REF^{commit}" > /dev/null; then
  fail "off: BASELINE_REF=$BASELINE_REF is not a commit in this clone"
else
  echo "=== off vs $BASELINE_REF"
  mkdir -p "$WORK_DIR/baseline-seed"
  git -C "$SEED_DIR" archive "$BASELINE_REF" | tar -x -C "$WORK_DIR/baseline-seed"
  SEED="$WORK_DIR/baseline-seed" generate baseline --framework react
  node - "$WORK_DIR/baseline/demo" "$WORK_DIR/default/demo" "$SEED_DIR/README.md" <<'NODE' \
    || fail "off: an AI-off app differs from $BASELINE_REF beyond the intended changes (see above)"
const fs = require('fs');
const { spawnSync } = require('child_process');
const [base, next, seedReadme] = process.argv.slice(2);
const readme = fs.readFileSync(seedReadme, 'utf8');
const from = readme.indexOf('## Running the application');
const section = from < 0 ? [] : readme.slice(from, readme.indexOf('\n# License', from)).split('\n');
// Each rule lists the exact lines this change adds or removes; each may be used once.
const exact = (...lines) => lines;
const allowed = {
  'server/gradle.properties': {
    removed: exact('startVersion=0.1.9'),
    added: exact(
      '# Genesis Start launcher. 0.1.15 is the first release with a headless mode (-Pgenesis.start.headless=true);',
      '# plain genesisStart still opens the desktop launcher.',
      'startVersion=0.1.15',
    ),
  },
  'server/build.gradle.kts': {
    removed: exact(),
    added: exact(
      "        // The Genesis Start launcher (0.1.12+) needs androidx.* artifacts, which none of the repositories",
      "        // above have. Last, and for those groups only, so nothing else is ever looked up at Google.",
      '        google {',
      '            content {',
      '                includeGroupByRegex("androidx\\\\..*")',
      '            }',
      '        }',
    ),
  },
  'client/package.json': {
    removed: exact(),
    added: exact(
      '    "genesis-start": "cd ../server && ./gradlew genesisStart",',
      '    "genesis-start:headless": "cd ../server && ./gradlew genesisStart -Pgenesis.start.headless=true -Pgenesis.start.restEnabled=true -Pgenesis.start.restPort=18080",',
      '    "genesis-start:write-script": "cd ../server && ./gradlew writeStartScript -Pgenesis.start.headless=true -Pgenesis.start.restEnabled=true -Pgenesis.start.restPort=18080",',
    ),
  },
  'README.md': { removed: exact(), added: [...section] },
};
const counts = (lines) => lines.reduce((m, l) => m.set(l, (m.get(l) || 0) + 1), new Map());
// Lines in `from` beyond their count in `to`, less the ones `allowance` accounts for.
const unexpected = (from, to, allowance) => {
  const left = counts(allowance);
  const extra = [];
  for (const [line, n] of counts(from)) {
    for (let i = counts(to).get(line) || 0; i < n; i++) {
      if (left.get(line) > 0) left.set(line, left.get(line) - 1);
      else extra.push(line);
    }
  }
  return extra;
};
const out = spawnSync('diff', ['-rq', '-x', 'node_modules', '-x', 'answers.json', '-x', '.genx', base, next]).stdout.toString();
const problems = [];
for (const line of out.split('\n').filter(Boolean)) {
  const m = line.match(/^Files (.+) and .+ differ$/);
  if (!m) { problems.push(line); continue; }
  const rel = m[1].slice(base.length + 1);
  const rule = allowed[rel];
  if (!rule) { problems.push(`${rel} changed`); continue; }
  const a = fs.readFileSync(`${base}/${rel}`, 'utf8').split('\n');
  const b = fs.readFileSync(`${next}/${rel}`, 'utf8').split('\n');
  unexpected(a, b, rule.removed).forEach((l) => problems.push(`${rel}: removed ${JSON.stringify(l)}`));
  unexpected(b, a, rule.added).forEach((l) => problems.push(`${rel}: added ${JSON.stringify(l)}`));
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE
fi

echo "=== on"
[ "$(ai_artifacts_present on)" = "5" ] || fail "on: expected all 5 AI artifacts, found $(ai_artifacts_present on)"
# The proxy is its template with exactly its two limits filled in, and nothing else touched.
for pair in "on:$GEMINI_MODELS" "onanthropic:$ANTHROPIC_MODELS"; do
  label="${pair%%:*}"; models="${pair#*:}"
  sed -e "s/{{AI.allowedModels}}/$models/" -e "s/{{AI.maxOutputTokens}}/16000/" "$TEMPLATE" \
    | diff -q - "$WORK_DIR/$label/demo/$MODULE/scripts/ai-service-web-handler.kts" > /dev/null \
    || fail "$label: the proxy is not its template with the $label limits filled in"
done
# Code with its comments removed: block comments whatever their inner lines start with, then whole-line
# // comments. An inline // is kept, since URLs contain one.
live_code() { perl -0pe 's{/\*.*?\*/}{}gs; s{^[ \t]*//[^\n]*}{}gm' "$1"; }

for label in on onanthropic; do
  app="$WORK_DIR/$label/demo"
  grep -rqs 'AI_ALLOWED_MODELS\|AI_MAX_OUTPUT_TOKENS' "$app/$MODULE/cfg/" \
    && fail "$label: an AI item landed in a system-definition file; the proxy must carry its own defaults"

  # The scan cannot see these: requiresAuth = false makes an endpoint anonymous and drops the AI_CHAT
  # check while the scan still reports it secure, and a third endpoint could carry no permission at all.
  handler="$app/$MODULE/scripts/ai-service-web-handler.kts"
  live_code "$handler" | grep -q 'requiresAuth' && fail "$label: the proxy sets requiresAuth, which makes it anonymous"
  # Every endpoint builder the web DSL has (endpoint and multipartEndpoint), typed or inferred.
  endpoints="$(live_code "$handler" | grep -oE '(^|[^A-Za-z0-9_])(endpoint|multipartEndpoint)[[:space:]]*[<(]' | wc -l | tr -d ' ')"
  guarded="$(live_code "$handler" | grep -oF 'permissionCodes("AI_CHAT")' | wc -l | tr -d ' ')"
  [ "$endpoints" = "2" ] || fail "$label: expected exactly two chat endpoints, found $endpoints"
  [ "$guarded" = "$endpoints" ] \
    || fail "$label: $endpoints endpoints but $guarded permissionCodes(\"AI_CHAT\"); every endpoint needs one"
  # Each can undo AI_CHAT after it is set, so any logged-in user could spend the key; so can a second
  # permissioning block on the same endpoint.
  live_code "$handler" | grep -qE 'permissionCodesDisabled|permissionCodes[[:space:]]*=|customPermissions' \
    && fail "$label: the proxy loosens its AI_CHAT check"
  blocks="$(live_code "$handler" | grep -oE 'permissioning[[:space:]]*\{' | wc -l | tr -d ' ')"
  [ "$blocks" = "$endpoints" ] || fail "$label: $endpoints endpoints but $blocks permissioning blocks"

  # Exactly the AI path's own files change, and nothing else. Genesis Create writes its code
  # generation over the seed (cfg/<app>-*.kts and .xml, scripts/<app>-*.kts, never the router script, a
  # web handler or the README), so a file the AI path relied on in there would be silently replaced.
  # diff reports a new folder once, so client/src/ai is one entry and its contents are pinned below.
  changed="$(diff -rq -x node_modules -x answers.json "$WORK_DIR/default/demo" "$app" \
    | sed -E -e "s#^Files $WORK_DIR/default/demo/(.*) and .* differ\$#\1#" \
             -e "s#^Only in $app/?(.*): (.*)\$#\1/\2#" -e 's#^/##' | sort)"
  expected="$(printf '%s\n' README.md "$MODULE/scripts/ai-service-web-handler.kts" "$MODULE/scripts/genesis-router.kts" \
    client/package.json client/.oxfmtrc.json client/src/ai | sort)"
  [ "$changed" = "$expected" ] || fail "$label: the AI path changed files beyond its own: $(echo $changed)"
  ai_files="$(cd "$app/client/src/ai" 2>/dev/null && find . -type f | sed 's#^\./##' | sort)"
  [ "$ai_files" = "generated/ai-config.json" ] || fail "$label: client/src/ai holds $(echo $ai_files)"
done

# The configuration the panel reads is the contract's fields exactly, whatever Handlebars-looking text
# the prompt carries; and the client's package.json gains the assistant package at the UI version and
# the AI build flag on build and dev, and not one thing more.
echo "=== the panel's configuration and package"
node - "$WORK_DIR" "$AI_UI" "$AI_UI_ANTHROPIC" "$SEED_DIR/.genx/versions.json" "$AI_UI_BREAKERS" <<'NODE' \
  || fail "on: the panel's configuration or the client package.json is not what the AI path writes (see above)"
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const [work, geminiUi, anthropicUi, versionsFile, breakersUi] = process.argv.slice(2);
const ui = versions => versions.UI;
const contract = ({ enabled, vendor, tier, systemPrompt, resources }) => JSON.parse(JSON.stringify({
  enabled, vendor, tier, systemPrompt,
  resources: (resources || []).map(({ name, kind, op, context, maxRows }) => ({ name, kind, op, context, maxRows })),
}));
const problems = [];
const read = (label, rel) => fs.readFileSync(path.join(work, label, 'demo', rel), 'utf8');
// 'extras' got the fixture plus non-contract fields; it must still come out as the fixture's contract fields.
for (const [label, input] of [['on', geminiUi], ['onanthropic', anthropicUi], ['extras', geminiUi], ['breakers', breakersUi]]) {
  const raw = read(label, 'client/src/ai/generated/ai-config.json');
  if (raw.includes('{{')) problems.push(`${label}: ai-config.json still holds {{ for Handlebars to expand`);
  let written;
  try { written = JSON.parse(raw); } catch (e) { problems.push(`${label}: ai-config.json is not JSON: ${e.message}`); continue; }
  if (!isDeepStrictEqual(written, contract(JSON.parse(input).ai))) problems.push(`${label}: ai-config.json is not the contract's fields of the input`);

  const on = JSON.parse(read(label, 'client/package.json'));
  const off = JSON.parse(read('default', 'client/package.json'));
  const version = ui(JSON.parse(fs.readFileSync(versionsFile, 'utf8')));
  const added = Object.keys(on.dependencies).filter((d) => !(d in off.dependencies));
  const removed = Object.keys(off.dependencies).filter((d) => !(d in on.dependencies));
  if (added.join() !== '@genesislcap/ai-assistant' || removed.length) problems.push(`${label}: dependencies +[${added}] -[${removed}]`);
  if (on.dependencies['@genesislcap/ai-assistant'] !== version) problems.push(`${label}: ai-assistant is ${on.dependencies['@genesislcap/ai-assistant']}, not the UI version ${version}`);
  for (const script of new Set([...Object.keys(on.scripts), ...Object.keys(off.scripts)])) {
    const want = ['build', 'dev'].includes(script) ? `${off.scripts[script]} -e GENX_ENABLE_AI=true` : off.scripts[script];
    if (on.scripts[script] !== want) problems.push(`${label}: script "${script}" is ${JSON.stringify(on.scripts[script])}`);
  }
  const rest = (pkg) => ({ ...pkg, dependencies: undefined, scripts: undefined });
  if (!isDeepStrictEqual(rest(on), rest(off))) problems.push(`${label}: package.json differs outside dependencies and scripts`);
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# The seed seeds no rights: the project's rights files belong to the generator that sends them.
echo "=== no rights written"
for label in on onanthropic; do
  grep -rqs 'AI_CHAT' "$WORK_DIR/$label/demo/$MODULE/data/" && fail "$label: the seed wrote an AI_CHAT row; rights belong to the generator"
done

echo "=== non-react"
[ "$(ai_artifacts_present nonreact)" = "0" ] || fail "non-react: AI files emitted with no panel to use them"

# Create's own resolver cases, as the blocks it actually sends: each must reach the app as exactly its
# contract fields, and a case that resolves to no block must emit no AI file at all.
echo "=== C-8 cases through the seed"
CASES="$SEED_DIR/.genx/tests/contracts/ai/ai-resolver-cases.json"
case_count="$(node -e 'console.log(require(process.argv[1]).cases.length)' "$CASES")"
case_labels=()
for i in $(seq 0 $((case_count - 1))); do
  generate "case$i" --framework react \
    --ui "$(node -e 'console.log(JSON.stringify({ ai: require(process.argv[1]).cases[+process.argv[2]].expected.ai }))' "$CASES" "$i")" \
    && case_labels+=("case$i")
done
node - "$CASES" "$WORK_DIR" <<'NODE' || fail "C-8: a resolved block did not reach the app as its contract fields (see above)"
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const [casesFile, work] = process.argv.slice(2);
const contract = ({ enabled, vendor, tier, systemPrompt, resources }) => JSON.parse(JSON.stringify({
  enabled, vendor, tier, systemPrompt,
  resources: (resources || []).map(({ name, kind, op, context, maxRows }) => ({ name, kind, op, context, maxRows })),
}));
const problems = [];
JSON.parse(fs.readFileSync(casesFile, 'utf8')).cases.forEach(({ name, expected }, i) => {
  const client = path.join(work, `case${i}`, 'demo', 'client');
  const file = path.join(client, 'src/ai/generated/ai-config.json');
  if (!expected.ai?.enabled) {
    if (fs.existsSync(path.join(client, 'src/ai'))) problems.push(`case ${i} (${name}): AI files for a project with no chat`);
    return;
  }
  if (!fs.existsSync(file)) return problems.push(`case ${i} (${name}): no ai-config.json`);
  if (!isDeepStrictEqual(JSON.parse(fs.readFileSync(file, 'utf8')), contract(expected.ai))) problems.push(`case ${i} (${name}): ai-config.json is not its contract fields`);
});
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# Create refuses an export carrying any of these (server/archive-generation-service/export-leak-guard.js,
# LEAK_RULES, copied): catching one here is cheaper than a 422 on a customer's export.
echo "=== nothing Create's export guard refuses"
node - "$WORK_DIR" on onanthropic ${case_labels[@]+"${case_labels[@]}"} <<'NODE' || fail "leaks: a generated file carries something Create's export guard refuses (see above)"
const fs = require('fs');
const path = require('path');
const [work, ...labels] = process.argv.slice(2);
const RULES = [
  ['create-ai-route', /\/ai\/api\/[a-z-]+|\/api\/preview-app\/[a-z-]+/],
  ['create-ai-host', /ai-service:\d+|localhost:3001\/api|:3001\/api\//],
  ['anthropic-key', /sk-ant-[A-Za-z0-9_-]{8,}/],
  ['google-key', /AIza[0-9A-Za-z_-]{35}/],
  ['vendor-key-with-value', /(?<![A-Za-z0-9_])(ANTHROPIC_API_KEY|GENX_GEMINI_API_KEY|OPENAI_API_KEY|GOOGLE_API_KEY)["']?\s*[=:]\s*["']?(?!["']?\s*(?:[,}\n]|$))([^"'\s,}]+)/],
  ['preview-build-global', /GENX_AI_CHAT_BASE/],
];
const SKIP = new Set(['node_modules', '.git', '.gradle', 'build', 'dist', '.idea']);
const BINARY = /\.(png|jpe?g|gif|ico|svg|webp|woff2?|ttf|eot|zip|jar|gz|tgz|pdf|mp4|class|keystore|p12)$/i;
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return SKIP.has(e.name) ? [] : walk(full);
  return BINARY.test(e.name) || fs.statSync(full).size > 2 * 1024 * 1024 ? [] : [full];
});
const problems = [];
for (const label of labels) {
  const app = path.join(work, label, 'demo');
  for (const file of walk(app)) {
    const text = fs.readFileSync(file, 'utf8');
    for (const [id, pattern] of RULES) if (pattern.test(text)) problems.push(`${label}: ${path.relative(app, file)}: ${id}`);
  }
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# Genesis Start's REST API has no authentication, so only the two headless scripts may switch it on.
# The rules are broad on purpose. In package.json, every line that mentions Genesis Start, gradlew or a
# headless/REST flag must be one of the three scripts, once each (so no npm hook, template branch or
# abbreviated task name can run it). No live Gradle line may mention the launcher, apart from its plugin
# id, nor a key it also reads bare. And Google's repository stays last and androidx-only.
echo "=== genesis start: desktop unless a headless script asks"
node - "$SEED_DIR" "$WORK_DIR" default off on onanthropic nonreact <<'NODE' \
  || fail "genesis start: the launcher is configured where it must not be (see above)"
const fs = require('fs');
const path = require('path');
const [seed, work, ...labels] = process.argv.slice(2);
const flags = '-Pgenesis.start.headless=true -Pgenesis.start.restEnabled=true -Pgenesis.start.restPort=18080';
const scripts = [
  '"genesis-start": "cd ../server && ./gradlew genesisStart",',
  `"genesis-start:headless": "cd ../server && ./gradlew genesisStart ${flags}",`,
  `"genesis-start:write-script": "cd ../server && ./gradlew writeStartScript ${flags}",`,
];
const scriptMention = /genesis-?start|genesis\.start|gradlew|-P\S*(headless|rest)/i;
const gradleMention = /genesis-?start|genesis\.?launcher|genesis\.start|\b(headless|restEnabled|restPort|restBasePath|restMaxRequestBodyBytes)\b/i;
const pluginId = /^\s*id\("global\.genesis\.genesis-start-gui"\)( version startVersion)?\s*$/;
const googleBlock = [
  '                password = properties["genesisArtifactoryPassword"].toString()',
  '            }',
  '        }',
  '        // The Genesis Start launcher (0.1.12+) needs androidx.* artifacts, which none of the repositories',
  '        // above have. Last, and for those groups only, so nothing else is ever looked up at Google.',
  '        google {',
  '            content {',
  '                includeGroupByRegex("androidx\\\\..*")',
  '            }',
  '        }',
  '    }',
].join('\n');
const problems = [];
const checkPackageJson = (where, text) => {
  const found = text.split('\n').filter((l) => scriptMention.test(l)).map((l) => l.trim());
  const extra = [...found];
  for (const line of scripts) {
    const i = extra.indexOf(line);
    if (i < 0) problems.push(`${where}: missing ${line}`);
    else extra.splice(i, 1);
  }
  extra.forEach((l) => problems.push(`${where}: ${l}`));
};
const live = (file) => {
  const text = fs.readFileSync(file, 'utf8');
  return file.endsWith('.properties')
    ? text.split('\n').filter((l) => !/^\s*[#!]/.test(l))
    : text.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l));
};
const gradleFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return ['node_modules', 'build', '.gradle', '.git'].includes(e.name) ? [] : gradleFiles(full);
  return /^gradle\.properties$|\.gradle(\.kts)?$/.test(e.name) ? [full] : [];
});
// Every framework's template, as text: a Handlebars branch is just more matching lines.
for (const fw of fs.readdirSync(path.join(seed, 'client-tmp'))) {
  const file = path.join(seed, 'client-tmp', fw, 'package.json');
  if (fs.existsSync(file)) checkPackageJson(`client-tmp/${fw}/package.json`, fs.readFileSync(file, 'utf8'));
}
for (const label of labels) {
  const app = path.join(work, label, 'demo');
  checkPackageJson(`${label}: client/package.json`, fs.readFileSync(path.join(app, 'client/package.json'), 'utf8'));
  for (const file of gradleFiles(app)) {
    live(file).filter((l) => gradleMention.test(l) && !pluginId.test(l))
      .forEach((l) => problems.push(`${label}: ${path.relative(app, file)}: ${JSON.stringify(l.trim())}`));
  }
  const build = fs.readFileSync(path.join(app, 'server/build.gradle.kts'), 'utf8');
  if (!build.includes(googleBlock)) problems.push(`${label}: server/build.gradle.kts: the scoped google {} block is not last, whole, after the Genesis repository`);
  const googles = live(path.join(app, 'server/build.gradle.kts')).filter((l) => /\bgoogle\b/.test(l)).length;
  if (googles !== 1) problems.push(`${label}: server/build.gradle.kts: ${googles} live lines mention google, expected 1`);
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

if [ "${GRADLE:-0}" = "1" ]; then
  # A CI runner's temporary files are gone once the job ends, so a failing step prints its own log.
  gradle_in_on_app() { # log file, gradle arguments...
    local log="$1"; shift
    # Unquoted on purpose: GRADLE_PARAMS may hold several arguments, or none.
    (cd "$WORK_DIR/on/demo" && ./gradlew --no-daemon ${GRADLE_PARAMS:-} "$@" > "$log" 2>&1) && return 0
    show_log "$log"; return 1
  }
  # The compiler's own errors can sit hundreds of lines above the end, so they come first.
  show_log() {
    echo "--- errors in $1"; grep -E ' ERROR |^e: |What went wrong' "$1" | head -n 40
    echo "--- last 150 lines of $1"; tail -n 150 "$1"; echo "---"
  }

  echo "=== gradle: build + checkAuthPermissions on the AI app"
  gradle_in_on_app "$WORK_DIR/gradle.log" :server:demo-app:build \
    && gradle_in_on_app "$WORK_DIR/scan.log" :server:demo-app:checkAuthPermissions --rerun \
    || fail "gradle: build or scan failed (see the log above)"
  # The build passes even with insecure endpoints unless a project opts into failing it, so the
  # scan's own summary is the assertion — a green build alone proves nothing about permissioning.
  # `--rerun` because a scan restored from the build cache prints no summary at all, and the endpoint
  # count because a scan that found nothing would also report nothing insecure. Whole lines only:
  # "Total endpoints: 2" is inside "Total endpoints: 20", and every per-type line ends "Insecure: N".
  if ! grep -qx "  Total endpoints: 2" "$WORK_DIR/scan.log" || ! grep -qx "  Insecure: 0" "$WORK_DIR/scan.log"; then
    show_log "$WORK_DIR/scan.log"
    fail "gradle: the security scan did not report the two chat endpoints, both secure (see the log above)"
  fi

  # Scripts compile only when the router starts, so neither the build nor the scan above notices a
  # proxy that no longer compiles against this Genesis version. The platform's own preCompileScripts
  # compiles the router's web handlers with the real script host. The Anthropic proxy goes in beside
  # the Gemini one under a second name, after the scan so the scan never counts it.
  echo "=== gradle: compile both proxies with the platform's preCompileScripts"
  cp "$WORK_DIR/onanthropic/demo/$MODULE/scripts/ai-service-web-handler.kts" \
    "$WORK_DIR/on/demo/$MODULE/scripts/ai-service-anthropic-web-handler.kts"
  gradle_in_on_app "$WORK_DIR/compile.log" :server:demo-app:preCompileScripts --rerun -PfailPreCompileScriptOnErrors=true \
    || fail "gradle: a proxy does not compile against this Genesis version (see the log above)"
  # And both were really compiled: a file the task never picked up would pass by never being built.
  for name in ai-service-web-handler.kts ai-service-anthropic-web-handler.kts; do
    grep -q "GENESIS_ROUTER: Compiled script $name " "$WORK_DIR/compile.log" \
      || fail "gradle: preCompileScripts never compiled $name"
  done
fi

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "AI emission checks passed${GRADLE:+ (with gradle)}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
