#!/usr/bin/env bash
#
# Check what this seed emits for the AI chat feature, and what it does NOT.
#
# The server half of the feature is gated on ONE value — `data.AI.enabled` in configure.js — and
# every assertion here is a way that gate could fail silently:
#
#   off       ui.ai absent and ui.ai.enabled=false generate the same app, and neither carries any
#             AI file. A project that never asked for chat must not change.
#   package   every React app depends on @genesislcap/ai-assistant at exactly versions.UI, AI on or
#             off (Create's prebuilt preview base must already carry it); a non-React app does not.
#   on        the proxy, the router body cap and the README section all appear; the cap is above the
#             proxy's own document limit; the proxy is its template with only its two limits filled
#             in, for either vendor; and no AI item lands in a system-definition file (a generator may
#             rewrite those, so the proxy must not need one). The client gets its ai-config.json
#             (exactly what .genx/ai-consumer.json declares, whatever the prompt holds); the
#             assistant's four source files (pbc/ai-assistant/elements.ts,
#             ai/generated/assistant-host.ts and assistant.ts, ai/extensions/index.ts), each its
#             template as written and holding the parts the assistant needs; the AI build flag and
#             an .oxfmtrc.json entry that skips ai/generated; and nothing else.
#   non-react ui.ai.enabled on a non-React app emits nothing: there is no panel to call the proxy.
#   C-8       the contract files shared with Create are byte-for-byte the copies Create pins, and
#             each of Create's resolver cases reaches the app verbatim, minus what the declaration
#             withholds, and says so for each resource and key it drops.
#   declared  the declaration check refuses an assistant install it cannot read, and holds the
#             declaration between the baseline and what the assistant reads.
#   leaks     no generated file carries anything Create's export guard would refuse.
#
# Usage:  .genx/scripts/check-ai-emission.sh
# Env:    GRADLE=1  also build the AI app's server, require the platform's own security scan
#                   (checkAuthPermissions) to report no insecure endpoint, and compile both vendors'
#                   proxies with the platform's preCompileScripts, and render the system definition
#                   with canary keys to show that a key the proxy reads never reaches a build file.
#                   Needs Genesis artifactory credentials, as the sample-app build does.
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
# 'extras' is the fixture plus more writes and a custom event, then with things smuggled in that the writer
# must drop: two top-level keys, a key on the request, a customCode on the request and on the custom
# event, and customCodes a writer must not pass on as sent: one with a key of its own, a name that is not
# text and a listComplete that is not true; a whole list whose listComplete is not true; a list cut to
# its names, and one that is not a list, each saying it is complete; and a null one. It must come out as
# its clean form.
AI_UI_EXTRAS_CLEAN="$(node -e '
const u = JSON.parse(process.argv[1]);
const named = (name) => u.ai.resources.find((resource) => resource.name === name);
const cut = (alsoWrites) => ({ alsoWrites, listComplete: false });
named("EVENT_TRADE_MODIFY").customCode = cut(["POSITION"]);
u.ai.resources.push(
  { name: "EVENT_TRADE_DELETE", kind: "event", op: "delete", context: "Remove a trade.", customCode: cut([]) },
  { name: "EVENT_POSITION_MODIFY", kind: "event", op: "modify", context: "Change a position.", customCode: cut(["TRADE"]) },
  { name: "EVENT_POSITION_INSERT", kind: "event", op: "insert", context: "Open a position." },
  { name: "EVENT_TRADE_CANCEL", kind: "event", op: "custom", context: "Cancel a trade." },
);
console.log(JSON.stringify(u));' "$AI_UI")"
AI_UI_EXTRAS="$(node -e '
const u = JSON.parse(process.argv[1]);
const named = (name) => u.ai.resources.find((resource) => resource.name === name);
const code = { alsoWrites: ["TRADE"], listComplete: true };
u.ai.budgetUsd = 5;
u.ai.endpoint = "https://example.invalid";
const reference = named("EVENT_TRADE_INSERT").references[0];
Object.assign(named("REQ_TRADE"), { url: "https://example.invalid", customCode: code, references: [reference] });
named("EVENT_TRADE_DELETE").references = [reference];
named("EVENT_TRADE_CANCEL").references = [reference];
named("EVENT_TRADE_CANCEL").customCode = code;
const insert = named("EVENT_TRADE_INSERT");
insert.references = [
  { ...reference, url: "https://example.invalid", fields: [{ ...reference.fields[0], hint: "x" }] },
];
insert.customCode = {
  alsoWrites: [...insert.customCode.alsoWrites, 7],
  listComplete: "yes",
  url: "https://example.invalid",
};
named("EVENT_POSITION_MODIFY").customCode = { alsoWrites: ["TRADE"], listComplete: "yes" };
named("EVENT_TRADE_MODIFY").customCode = { alsoWrites: ["POSITION", 7], listComplete: true };
named("EVENT_TRADE_DELETE").customCode = { alsoWrites: "TRADE", listComplete: true };
named("EVENT_POSITION_INSERT").customCode = null;
console.log(JSON.stringify(u));' "$AI_UI_EXTRAS_CLEAN")"
# 'rows' is the fixture plus a row action (C-18.8) and the modify's key (C-19), then with things
# smuggled in that the writer must drop: a key that is not a field name on each, a key on an input
# and on an effect, and a key on a read and on an insert, which name no row. It must come out as its
# clean form.
AI_UI_ROWS_CLEAN="$(node -e '
const u = JSON.parse(process.argv[1]);
u.ai.resources.push({
  name: "EVENT_REPRICE_TRADE", kind: "event", op: "custom",
  context: "Run the REPRICE_TRADE handler on one existing TRADE row. It changes that TRADE row. It needs PRICE.",
  shape: "row", entity: "TRADE", key: ["TRADE_ID"],
  inputs: [{ field: "PRICE", required: true }],
  effects: [{ op: "modify", table: "TRADE" }, { op: "insert", table: "POSITION" }],
});
u.ai.resources.find((resource) => resource.name === "EVENT_TRADE_MODIFY").key = ["TRADE_ID"];
console.log(JSON.stringify(u));' "$AI_UI")"
AI_UI_ROWS="$(node -e '
const u = JSON.parse(process.argv[1]);
const row = u.ai.resources.find((resource) => resource.name === "EVENT_REPRICE_TRADE");
const named = (name) => u.ai.resources.find((resource) => resource.name === name);
row.key = [...row.key, 7];
row.inputs[0].url = "https://example.invalid";
row.effects[0].endpoint = "https://example.invalid";
named("EVENT_TRADE_MODIFY").key = ["TRADE_ID", 7];
named("REQ_TRADE").key = ["TRADE_ID"];
named("EVENT_TRADE_INSERT").key = ["TRADE_ID"];
console.log(JSON.stringify(u));' "$AI_UI_ROWS_CLEAN")"
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

# Every file or block the feature adds. Used both ways: all present when on, none when off. The assistant
# package is not one of them: every React app depends on it (checked under "package").
ai_artifacts_present() {
  local app="$WORK_DIR/$1/demo"
  local found=0
  [ -f "$app/$MODULE/scripts/ai-service-web-handler.kts" ] && found=$((found + 1))
  grep -q httpObjectAggregator "$app/$MODULE/scripts/genesis-router.kts" && found=$((found + 1))
  grep -q '^## AI chat' "$app/README.md" && found=$((found + 1))
  [ -f "$app/client/src/ai/generated/ai-config.json" ] && found=$((found + 1))
  [ -f "$app/client/src/pbc/ai-assistant/elements.ts" ] && found=$((found + 1))
  echo "$found"
}

# The C-8 contract files are Create's (server/shared-schemas/ai/), copied here verbatim. Create's resolver
# test pins the same digests, so an edit on either side fails until both sides bump the version together.
echo "=== C-8 contract copies"
node - "$SEED_DIR/.genx/tests/contracts/ai" "$SEED_DIR/.genx/versions.json" <<'NODE' || fail "C-8: a contract copy is not the one Create pins, or the UI pin is below what the copies need (see above)"
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');
const pinned = {
  'ui-config-ai.schema.json': { version: '1.6.0', sha256: '99549c80f065564701c9a8b83154e36d98ad9fd46162fc7bfad00aaf1b9b3498' },
  'ai-resolver-cases.json': { version: '1.8.0', sha256: '48d47fadd396883f1858b60a066fe6a1ae99080537d73be9ab139ab8cca583c7' },
};
// The copies carry queries and references, which only this UI release on reads (C-17.5): a seed that
// takes the copies without the release would ship them to an assistant that ignores them.
const MIN_UI_FOR_CASES = '15.47.0';
const core = (version) => String(version).split(/[-+]/)[0].split('.').map(Number);
const below = (a, b) => {
  const [x, y] = [core(a), core(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] < y[i];
  return false;
};
let bad = 0;
const ui = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')).UI;
if (below(ui, MIN_UI_FOR_CASES)) {
  console.log(`    versions.json pins UI ${ui}, below ${MIN_UI_FOR_CASES}`);
  bad++;
}
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
# The row fields reach an app only from a seed that declares them, and this one cannot yet: the UI it
# pins does not read them, which the declaration check would rightly refuse. So they go through a copy
# of this seed whose declaration is the test-only one, never through .genx/ai-consumer.json.
ROW_SEED="$WORK_DIR/seed-row-actions"
node -e '
const fs = require("fs");
const [from, to] = process.argv.slice(1);
fs.cpSync(from, to, { recursive: true, filter: (p) => !/[\\/](\.git|node_modules)([\\/]|$)/.test(p.slice(from.length)) });
fs.copyFileSync(`${from}/.genx/tests/fixtures/ai-consumer-row-actions.json`, `${to}/.genx/ai-consumer.json`);' \
  "$SEED_DIR" "$ROW_SEED" || fail "rows: could not make the seed copy that declares the row fields"
generate default --framework react
# A whole resolved block, switched off: Create can pass one through, and it must emit nothing at all
# rather than a panel that only says it is blocked.
generate off --framework react --ui "$(node -e 'const u = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8")); u.ai.enabled = false; console.log(JSON.stringify(u))' "$SEED_DIR/.genx/tests/fixtures/ai-config.json")"
generate on --framework react --ui "$AI_UI"
generate onanthropic --framework react --ui "$AI_UI_ANTHROPIC"
generate breakers --framework react --ui "$AI_UI_BREAKERS"
SEED="$ROW_SEED" generate rows --framework react --ui "$AI_UI_ROWS"
generate extras --framework react --ui "$AI_UI_EXTRAS"
generate nonreact --framework webcomponents --ui "$AI_UI"

echo "=== off"
[ "$(ai_artifacts_present default)" = "0" ] || fail "off: a project with no ui.ai carries AI files"
[ "$(ai_artifacts_present off)" = "0" ] || fail "off: ui.ai.enabled=false still emitted AI files"
# answers.json records the seed path and a timestamped layout key, so it differs on every run.
diff -r -x node_modules -x answers.json "$WORK_DIR/default/demo" "$WORK_DIR/off/demo" > /dev/null \
  || fail "off: ui.ai.enabled=false generates a different app from no ui.ai at all"

# Against the last release: an AI-off app may differ from it only in the changes this branch makes
# on purpose — the Genesis Start launcher version, the repository it needs, its client scripts, the
# README section about them, and the assistant package every React app now depends on — and in
# nothing else, line by line.
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
  node - "$WORK_DIR/baseline/demo" "$WORK_DIR/default/demo" "$SEED_DIR/README.md" "$SEED_DIR/.genx/versions.json" <<'NODE' \
    || fail "off: an AI-off app differs from $BASELINE_REF beyond the intended changes (see above)"
const fs = require('fs');
const { spawnSync } = require('child_process');
const [base, next, seedReadme, versionsFile] = process.argv.slice(2);
const ui = JSON.parse(fs.readFileSync(versionsFile, 'utf8')).UI;
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
      `    "@genesislcap/ai-assistant": "${ui}",`,
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

  # The keys come from the environment. Everything read through the system definition is rendered, in
  # plain text, into files under build/, so only the two settings that are not secret go through it,
  # each by name, and the system definition is touched only inside readItem.
  sysdef_reads="$(live_code "$handler" | grep -oE 'readItem\([^)]*\)' | LC_ALL=C sort -u | tr '\n' ' ')"
  [ "$sysdef_reads" = 'readItem("AI_ALLOWED_MODELS") readItem("AI_MAX_OUTPUT_TOKENS") readItem(name: String) ' ] \
    || fail "$label: the proxy reads more than its two settings through the system definition: $sysdef_reads"
  sysdef_gets="$(live_code "$handler" | grep -oE 'systemDefinition[.A-Za-z]*\([^)]*\)' | tr '\n' ' ')"
  [ "$sysdef_gets" = 'systemDefinition.get(name) ' ] \
    || fail "$label: the proxy reads the system definition outside readItem: $sysdef_gets"

  # The router must let a body just over the proxy's own limit through, so the proxy answers it with
  # its REQUEST_TOO_LARGE code rather than the router refusing it with an empty 413.
  router_cap="$(live_code "$app/$MODULE/scripts/genesis-router.kts" | grep -oE 'maxContentLength[[:space:]]*=[[:space:]]*[0-9_]+' | grep -oE '[0-9_]+$' | tr -d _)"
  proxy_cap="$(live_code "$handler" | grep -oE 'maxDocumentLength\([0-9_]+L?\)' | grep -oE '[0-9_]+' | tr -d _)"
  [ -n "$router_cap" ] && [ -n "$proxy_cap" ] && [ "$router_cap" -gt "$proxy_cap" ] \
    || fail "$label: the router's body cap (${router_cap:-none}) must be above the proxy's document limit (${proxy_cap:-none})"

  # Exactly the AI path's own files change, and nothing else. Genesis Create writes its code
  # generation over the seed (cfg/<app>-*.kts and .xml, scripts/<app>-*.kts, never the router script, a
  # web handler or the README), so a file the AI path relied on in there would be silently replaced.
  # diff reports a new folder once, so client/src/ai and client/src/pbc/ai-assistant are one entry each
  # and their contents are pinned below.
  changed="$(diff -rq -x node_modules -x answers.json "$WORK_DIR/default/demo" "$app" \
    | sed -E -e "s#^Files $WORK_DIR/default/demo/(.*) and .* differ\$#\1#" \
             -e "s#^Only in $app/?(.*): (.*)\$#\1/\2#" -e 's#^/##' | sort)"
  expected="$(printf '%s\n' README.md "$MODULE/scripts/ai-service-web-handler.kts" "$MODULE/scripts/genesis-router.kts" \
    client/package.json client/.oxfmtrc.json client/src/ai client/src/pbc/ai-assistant | sort)"
  [ "$changed" = "$expected" ] || fail "$label: the AI path changed files beyond its own: $(echo $changed)"
  ai_files="$(cd "$app/client/src/ai" 2>/dev/null && find . -type f | sed 's#^\./##' | sort | tr '\n' ' ')"
  [ "$ai_files" = "extensions/index.ts generated/ai-config.json generated/assistant-host.ts generated/assistant.ts " ] \
    || fail "$label: client/src/ai holds $ai_files"
  pbc_files="$(cd "$app/client/src/pbc/ai-assistant" 2>/dev/null && find . -type f | sed 's#^\./##' | tr '\n' ' ')"
  [ "$pbc_files" = "elements.ts " ] || fail "$label: client/src/pbc/ai-assistant holds $pbc_files"

  # The panel's code comes out exactly as written: a {{ in it would have been rendered on the way.
  for pair in "pbc-elements.ts.hbs:pbc/ai-assistant/elements.ts" "assistant-host.ts.hbs:ai/generated/assistant-host.ts" \
      "assistant.ts.hbs:ai/generated/assistant.ts" "extensions.ts.hbs:ai/extensions/index.ts"; do
    cmp -s "$SEED_DIR/.genx/templates/react/ai/${pair%%:*}" "$app/client/src/${pair#*:}" \
      || fail "$label: client/src/${pair#*:} is not its template as written"
  done

  # Byte-equality says nothing about what the templates hold, and tsc, oxlint and oxfmt all pass without
  # the bubble, the target or the AI_CHAT check. So the parts the assistant needs are checked by name.
  node - "$app/client/src" <<'NODE' || fail "$label: the assistant's code is missing a part it needs (see above)"
const fs = require('fs');
const src = process.argv[2];
// Comments out, strings kept, so a comment can't satisfy a check.
const code = (file) =>
  fs
    .readFileSync(`${src}/${file}`, 'utf8')
    .replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (m, str) => str ?? '');
let ok = true;
const need = (file, what, holds) => {
  if (!holds) {
    ok = false;
    console.log(`FAIL: ${file} ${what}`);
  }
};

const elements = code('pbc/ai-assistant/elements.ts');
need('elements.ts', "does not target 'layout-end'", /targetId:\s*'layout-end'/.test(elements));
need('elements.ts', 'does not import the assistant host', /^import '\.\.\/\.\.\/ai\/generated\/assistant-host';$/m.test(elements));
need('elements.ts', 'has no popout manager', elements.includes('<foundation-ai-popout-manager>'));
need('elements.ts', 'has no chat bubble', /<foundation-ai-chat-bubble[\s>]/.test(elements));
need('elements.ts', 'does not slot the host into the dialog', elements.includes('<genesis-app-assistant slot="dialog-content">'));
need(
  'elements.ts',
  'does not nest host in bubble in manager',
  /<foundation-ai-popout-manager>\s*<foundation-ai-chat-bubble[^>]*>\s*<genesis-app-assistant slot="dialog-content"><\/genesis-app-assistant>\s*<\/foundation-ai-chat-bubble>\s*<\/foundation-ai-popout-manager>/.test(elements),
);

const host = code('ai/generated/assistant-host.ts');
need('assistant-host.ts', 'does not define genesis-app-assistant', /name:\s*'genesis-app-assistant'/.test(host));
need('assistant-host.ts', 'does not load the assistant lazily', host.includes("import('./assistant')"));
// The bubble looks for the assistant in the slotted element's shadow root to give it a close button.
need('assistant-host.ts', 'does not mount into its shadow root', host.includes('mountAssistant(this.shadowRoot)'));

const assistant = code('ai/generated/assistant.ts');
need(
  'assistant.ts',
  'does not register once, at module top level',
  /^const registration = registerGenesisAssistant\(/m.test(assistant) && assistant.split('registerGenesisAssistant(').length === 2,
);
need(
  'assistant.ts',
  'has no AI_CHAT check',
  /^const AI_CHAT_RIGHT = 'AI_CHAT';$/m.test(assistant) && assistant.includes('hasPermission(AI_CHAT_RIGHT)'),
);
need('assistant.ts', "ignores the registration's block", assistant.includes('setBlocked(true, registration.blockedReason)'));
need('assistant.ts', 'has no per-user session key', assistant.includes('`genesis-app-assistant:${getUser().userName}`'));
const mount = (assistant.match(/^export function mountAssistant\([^)]*\)[^{]*\{\n([\s\S]*?)\n\}/m) || [])[1] || '';
need('assistant.ts', 'does not check the blocks on every mount', mount.includes('applyBlocks(assistant)') && !/\breturn\b/.test(mount));
need(
  'assistant.ts',
  'does not set the session key once connected',
  mount.lastIndexOf("setAttribute('session-key', sessionKey)") > mount.indexOf('host.append(assistant)') &&
    mount.includes('host.append(assistant)'),
);

// The UI Builder can adopt extensions/index.ts, and an adopted copy outlives the assistant when AI is
// switched off. With no import of its own it still compiles then.
need(
  'extensions/index.ts',
  'imports something, so it breaks the build once AI is off',
  !/\bimport\s*[\s{*('"]|\bfrom\s*['"]|\brequire\s*\(/.test(code('ai/extensions/index.ts')),
);
process.exit(ok ? 0 : 1);
NODE
done

# The configuration the panel reads is what the declaration passes on, exactly, whatever Handlebars-looking
# text the prompt carries, and the log says each drop and nothing else; and the client's package.json
# gains the assistant package at the UI version and the AI build flag on build and dev, and not one thing
# more.
echo "=== the panel's configuration and package"
node - "$WORK_DIR" "$SEED_DIR/.genx/versions.json" "$SEED_DIR/.genx/ai-consumer.json" \
  "$AI_UI" "$AI_UI_ANTHROPIC" "$AI_UI_BREAKERS" "$AI_UI_EXTRAS_CLEAN" "$AI_UI_EXTRAS" <<'NODE' \
  || fail "on: the panel's configuration or the client package.json is not what the AI path writes (see above)"
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const [work, versionsFile, consumerFile, geminiUi, anthropicUi, breakersUi, extrasCleanUi, extrasUi] = process.argv.slice(2);
const version = JSON.parse(fs.readFileSync(versionsFile, 'utf8')).UI;
const passed = `passed to @genesislcap/ai-assistant ${version}`;
// The block as sent, minus what the declaration withholds: the same file the writer reads. A customCode
// is its two values, and only an insert, modify or delete keeps one (C-18.D.5).
const consumer = JSON.parse(fs.readFileSync(consumerFile, 'utf8'));
const projected = ({ op, customCode: code }) => {
  if (!code || !['insert', 'modify', 'delete'].includes(op)) return undefined;
  // Complete only when it says so and nothing had to be cut (v2.83).
  const whole = Array.isArray(code.alsoWrites) && code.alsoWrites.every((name) => typeof name === 'string');
  return {
    alsoWrites: Array.isArray(code.alsoWrites) ? code.alsoWrites.filter((name) => typeof name === 'string') : [],
    listComplete: whole && code.listComplete === true,
  };
};
const passedOn = (resources) => (resources || [])
  .filter((resource) => consumer.kinds.includes(resource.kind))
  .map((resource) => {
    const kept = Object.fromEntries(Object.entries(resource).filter(([key]) => consumer.resourceFields.includes(key)));
    if ('customCode' in kept) kept.customCode = projected(resource);
    return kept;
  });
const declared = ({ enabled, vendor, tier, systemPrompt, resources }) =>
  JSON.parse(JSON.stringify({ enabled, vendor, tier, systemPrompt, resources: passedOn(resources) }));
// What the writer says it dropped, in its order.
const said = (resources) => (resources || []).flatMap((resource) => consumer.kinds.includes(resource.kind)
  ? Object.keys(resource)
      .filter((key) => !consumer.resourceFields.includes(key))
      .map((key) => `ai: dropped ${key} on ${resource.name} — not ${passed}`)
  : [`ai: dropped resource ${resource.name} — kind ${resource.kind} is not ${passed}`]);
const dropLines = (log) => log.split('\n').filter((line) => line.includes('ai: dropped ')).map((line) => line.slice(line.indexOf('ai: dropped ')).trimEnd());
const problems = [];
const read = (label, rel) => fs.readFileSync(path.join(work, label, 'demo', rel), 'utf8');
// Each app: the block it was sent, and the clean block it must come out as.
for (const [label, sent, clean] of [['on', geminiUi, geminiUi], ['onanthropic', anthropicUi, anthropicUi], ['extras', extrasUi, extrasCleanUi], ['breakers', breakersUi, breakersUi]]) {
  const raw = read(label, 'client/src/ai/generated/ai-config.json');
  if (raw.includes('{{')) problems.push(`${label}: ai-config.json still holds {{ for Handlebars to expand`);
  let written;
  try { written = JSON.parse(raw); } catch (e) { problems.push(`${label}: ai-config.json is not JSON: ${e.message}`); continue; }
  if (!isDeepStrictEqual(written, declared(JSON.parse(clean).ai))) problems.push(`${label}: ai-config.json is not the declared fields of the clean input`);
  const lines = dropLines(fs.readFileSync(`${work}/${label}.log`, 'utf8'));
  const want = said(JSON.parse(sent).ai.resources);
  if (!isDeepStrictEqual(lines, want)) problems.push(`${label}: the log says ${JSON.stringify(lines)}, not ${JSON.stringify(want)}`);

  const on = JSON.parse(read(label, 'client/package.json'));
  const off = JSON.parse(read('default', 'client/package.json'));
  // The assistant package is every React app's, so chat adds no dependency.
  if (!isDeepStrictEqual(on.dependencies, off.dependencies)) problems.push(`${label}: dependencies differ from an AI-off app's`);
  for (const script of new Set([...Object.keys(on.scripts), ...Object.keys(off.scripts)])) {
    const want = ['build', 'dev'].includes(script) ? `${off.scripts[script]} -e GENX_ENABLE_AI=true` : off.scripts[script];
    if (on.scripts[script] !== want) problems.push(`${label}: script "${script}" is ${JSON.stringify(on.scripts[script])}`);
  }
  const rest = (pkg) => ({ ...pkg, dependencies: undefined, scripts: undefined });
  if (!isDeepStrictEqual(rest(on), rest(off))) problems.push(`${label}: package.json differs outside dependencies and scripts`);
}
// The declaration passes customCode on. Every expectation above derives from it, so it is pinned here.
const insert = JSON.parse(read('on', 'client/src/ai/generated/ai-config.json')).resources.find((r) => r.name === 'EVENT_TRADE_INSERT');
if (!isDeepStrictEqual(insert?.customCode, { alsoWrites: ['POSITION'], listComplete: false })) {
  problems.push(`on: EVENT_TRADE_INSERT's customCode is ${JSON.stringify(insert?.customCode)}, not the fixture's`);
}
// The declaration passes references on, and the fixture carries them.
const references = [{ resource: 'REQ_COUNTERPARTY', fields: [{ field: 'COUNTERPARTY_ID', targetField: 'COUNTERPARTY_ID' }] }];
if (!isDeepStrictEqual(insert?.references, references)) {
  problems.push(`on: EVENT_TRADE_INSERT's references are ${JSON.stringify(insert?.references)}, not the fixture's`);
}
// Anti-vacuity: 'extras' did send what must be dropped, and was told so.
if (!said(JSON.parse(extrasUi).ai.resources).length) problems.push('extras: the fixture smuggles nothing the writer must say');
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

# Create's own resolver cases, as the blocks it actually sends: each must reach the app verbatim, top level
# included, minus the kinds and keys the declaration withholds, with each drop said and nothing else; a
# case that resolves to no block must emit no AI file at all.
echo "=== C-8 cases through the seed"
CASES="$SEED_DIR/.genx/tests/contracts/ai/ai-resolver-cases.json"
case_count="$(node -e 'console.log(require(process.argv[1]).cases.length)' "$CASES")"
case_labels=()
for i in $(seq 0 $((case_count - 1))); do
  generate "case$i" --framework react \
    --ui "$(node -e 'console.log(JSON.stringify({ ai: require(process.argv[1]).cases[+process.argv[2]].expected.ai }))' "$CASES" "$i")" \
    && case_labels+=("case$i")
done
node - "$CASES" "$WORK_DIR" "$SEED_DIR/.genx/ai-consumer.json" "$SEED_DIR/.genx/versions.json" <<'NODE' \
  || fail "C-8: a resolved block did not reach the app as what the declaration passes on (see above)"
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const [casesFile, work, consumerFile, versionsFile] = process.argv.slice(2);
const consumer = JSON.parse(fs.readFileSync(consumerFile, 'utf8'));
const passed = `passed to @genesislcap/ai-assistant ${JSON.parse(fs.readFileSync(versionsFile, 'utf8')).UI}`;
const projected = ({ op, customCode: code }) => {
  if (!code || !['insert', 'modify', 'delete'].includes(op)) return undefined;
  // Complete only when it says so and nothing had to be cut (v2.83).
  const whole = Array.isArray(code.alsoWrites) && code.alsoWrites.every((name) => typeof name === 'string');
  return {
    alsoWrites: Array.isArray(code.alsoWrites) ? code.alsoWrites.filter((name) => typeof name === 'string') : [],
    listComplete: whole && code.listComplete === true,
  };
};
// The top level is compared as sent, so a key Create adds there cannot be dropped with this check green.
const declared = (ai) => JSON.parse(JSON.stringify({
  ...ai,
  resources: (ai.resources || [])
    .filter((resource) => consumer.kinds.includes(resource.kind))
    .map((resource) => {
      const kept = Object.fromEntries(Object.entries(resource).filter(([key]) => consumer.resourceFields.includes(key)));
      if ('customCode' in kept) kept.customCode = projected(resource);
      return kept;
    }),
}));
const said = (resources) => (resources || []).flatMap((resource) => consumer.kinds.includes(resource.kind)
  ? Object.keys(resource)
      .filter((key) => !consumer.resourceFields.includes(key))
      .map((key) => `ai: dropped ${key} on ${resource.name} — not ${passed}`)
  : [`ai: dropped resource ${resource.name} — kind ${resource.kind} is not ${passed}`]);
const dropLines = (log) => log.split('\n').filter((line) => line.includes('ai: dropped ')).map((line) => line.slice(line.indexOf('ai: dropped ')).trimEnd());
const problems = [];
JSON.parse(fs.readFileSync(casesFile, 'utf8')).cases.forEach(({ name, expected }, i) => {
  const client = path.join(work, `case${i}`, 'demo', 'client');
  const file = path.join(client, 'src/ai/generated/ai-config.json');
  if (!expected.ai?.enabled) {
    if (fs.existsSync(path.join(client, 'src/ai'))) problems.push(`case ${i} (${name}): AI files for a project with no chat`);
    return;
  }
  if (!fs.existsSync(file)) return problems.push(`case ${i} (${name}): no ai-config.json`);
  const written = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!isDeepStrictEqual(written, declared(expected.ai))) problems.push(`case ${i} (${name}): ai-config.json is not its declared kinds and fields`);
  // A case the declaration withholds nothing from reaches the app exactly as Create resolved it.
  const withholds = said(expected.ai.resources).length > 0;
  if (!withholds && !isDeepStrictEqual(written, JSON.parse(JSON.stringify(expected.ai)))) problems.push(`case ${i} (${name}): ai-config.json is not Create's block verbatim`);
  // Every resource of a kind the declaration withholds, and every key it withholds, is said, in order,
  // and nothing else is.
  const lines = dropLines(fs.readFileSync(path.join(work, `case${i}.log`), 'utf8'));
  const want = said(expected.ai.resources);
  if (!isDeepStrictEqual(lines, want)) problems.push(`case ${i} (${name}): the log says ${JSON.stringify(lines)}, not ${JSON.stringify(want)}`);
});
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# The row cases, through the seed copy that declares the row fields: each reaches the app exactly as
# Create resolved it, and the writer's projection drops what 'rows' smuggles inside the lists (C-18.8).
echo "=== row actions through the writer"
row_cases="$(node -e '
const { cases } = require(process.argv[1]);
// A row action, or a modify or delete that names its row by a key (C-19).
const keyed = (r) => r.shape || (["modify", "delete"].includes(r.op) && r.key);
console.log(cases.flatMap(({ expected }, i) => ((expected.ai?.resources || []).some(keyed) ? [i] : [])).join(" "));' "$CASES")"
row_labels=(rows)
for i in $row_cases; do
  SEED="$ROW_SEED" generate "rowcase$i" --framework react \
    --ui "$(node -e 'console.log(JSON.stringify({ ai: require(process.argv[1]).cases[+process.argv[2]].expected.ai }))' "$CASES" "$i")" \
    && row_labels+=("rowcase$i")
done
node - "$CASES" "$WORK_DIR" "$AI_UI_ROWS_CLEAN" "$row_cases" <<'NODE' \
  || fail "rows: a row action did not reach the app as Create resolved it (see above)"
const fs = require('fs');
const path = require('path');
const { isDeepStrictEqual } = require('util');
const [casesFile, work, rowsClean, indexes] = process.argv.slice(2);
// Verbatim: the file is the block after one JSON round trip, nothing added, dropped or rebuilt.
const verbatim = (written, sent) => isDeepStrictEqual(written, JSON.parse(JSON.stringify(sent)));
const read = (label) =>
  JSON.parse(fs.readFileSync(path.join(work, label, 'demo/client/src/ai/generated/ai-config.json'), 'utf8'));
const drops = (label) =>
  fs.readFileSync(`${work}/${label}.log`, 'utf8').split('\n').filter((line) => line.includes('ai: dropped '));
const problems = [];
// The compare itself: it must refuse a copy that lost a row field, or carries one more nested key.
const sample = JSON.parse(rowsClean).ai;
const swap = (change) => ({ ...sample, resources: sample.resources.map((r) => (r.shape ? change(r) : r)) });
const lost = swap((r) => ({ ...r, effects: undefined }));
const extra = swap((r) => ({ ...r, inputs: [{ ...r.inputs[0], url: 'x' }] }));
if (verbatim(lost, sample) || verbatim(extra, sample)) problems.push('the compare passes a copy that is not verbatim');
// 'rows': every key is declared, so nothing is said, and the smuggles inside the lists are gone.
if (!verbatim(read('rows'), sample)) {
  const wrote = read('rows').resources;
  const first = sample.resources.findIndex((r, i) => !verbatim(wrote[i], r));
  problems.push(`rows: ${sample.resources[first]?.name ?? 'the list'} came out as ${JSON.stringify(wrote[first])}`);
}
if (drops('rows').length) problems.push(`rows: the log says ${JSON.stringify(drops('rows'))}`);
const cases = JSON.parse(fs.readFileSync(casesFile, 'utf8')).cases;
const picked = indexes.split(/\s+/).filter(Boolean).map(Number);
if (!picked.some((i) => cases[i].name.startsWith('C-18 GC-C1'))) problems.push('GC-C1 is not among the row cases');
// And at least one modify or delete named by its key (C-19), or the key half of this is untested.
const crudKey = (r) => ['modify', 'delete'].includes(r.op) && r.key !== undefined;
if (!picked.some((i) => cases[i].expected.ai.resources.some(crudKey))) problems.push('no case names a modify or delete by its key');
for (const i of picked) {
  const { name, expected } = cases[i];
  const written = read(`rowcase${i}`);
  if (!verbatim(written, expected.ai)) problems.push(`case ${i} (${name}): ai-config.json is not Create's block verbatim`);
  // Each resource that carries a key as Create wrote it, byte for byte, key order included.
  for (const resource of expected.ai.resources.filter((r) => r.key !== undefined)) {
    const got = JSON.stringify(written.resources.find((r) => r.name === resource.name));
    if (got !== JSON.stringify(resource)) problems.push(`case ${i}: ${resource.name} came out as ${got}`);
  }
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# The declaration check runs on the React AI build (generate-test-apps.sh), against whatever assistant
# that app installed. These are the installs it never meets there: an assistant from before the export,
# none at all or a broken one, an export with nothing usable in it, one that throws, imports what it may
# not, ends the process, prints, or keeps the process alive, and one for import or for require only.
# Each is a stand-in package.
echo "=== the declaration check, against assistants the build does not install"
node - "$WORK_DIR/declaration" "$SEED_DIR/.genx/ai-consumer.json" "$SEED_DIR/.genx/scripts/check-ai-declaration.mjs" <<'NODE' \
  || fail "declaration: the check does not hold the floor (see above)"
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const [work, consumerFile, check] = process.argv.slice(2);
const seed = JSON.parse(fs.readFileSync(consumerFile, 'utf8'));
const baseline = { version: 1, kinds: ['request', 'event'], resourceFields: ['name', 'kind', 'op', 'context', 'maxRows'] };
const app = (name, exports, files = {}) => {
  const pkg = path.join(work, name, 'node_modules/@genesislcap/ai-assistant');
  fs.mkdirSync(pkg, { recursive: true });
  fs.writeFileSync(path.join(work, name, 'package.json'), '{"name":"app"}');
  if (exports) fs.writeFileSync(path.join(pkg, 'package.json'), JSON.stringify({ name: '@genesislcap/ai-assistant', exports }));
  for (const [file, text] of Object.entries(files)) fs.writeFileSync(path.join(pkg, file), text);
  return path.join(work, name);
};
const reads = app('reads', { '.': './index.js', './genesis/consumes': './consumes.cjs' }, {
  'consumes.cjs': `exports.GENESIS_AI_CONSUMES = ${JSON.stringify({ kinds: seed.kinds, resourceFields: seed.resourceFields })};`,
});
const before = app('before-the-export', { '.': './index.js' });
const noManifest = app('no-package-json', null);
const none = path.join(work, 'no-assistant');
fs.mkdirSync(none, { recursive: true });
fs.writeFileSync(path.join(none, 'package.json'), '{"name":"app"}');
const exporting = (name, text) => app(name, { './genesis/consumes': './consumes.cjs' }, { 'consumes.cjs': text });
const seedSet = JSON.stringify({ kinds: seed.kinds, resourceFields: seed.resourceFields });
const falsy = exporting('exports-false', 'exports.GENESIS_AI_CONSUMES = false;');
const aFunction = exporting('exports-a-function', 'exports.GENESIS_AI_CONSUMES = () => ({});');
// Its kinds are text that happens to hold the names: only a list counts.
const notLists = exporting('exports-no-lists', `exports.GENESIS_AI_CONSUMES = ${JSON.stringify({ kinds: 'request,event', resourceFields: baseline.resourceFields })};`);
const exits = exporting('exits', 'process.exit(0);');
// It prints a line that looks like the probe's answer, and a wider one, before its own export.
const wider = JSON.stringify({ type: 'object', consumes: { kinds: [...seed.kinds, 'unread'], resourceFields: seed.resourceFields } });
const pretends = exporting('prints-a-wider-answer', `console.log(${JSON.stringify(wider)}); exports.GENESIS_AI_CONSUMES = ${seedSet};`);
const prints = exporting('prints', `console.log("loading"); exports.GENESIS_AI_CONSUMES = ${seedSet};`);
const stays = exporting('keeps-the-process-alive', `setInterval(() => {}, 1000); exports.GENESIS_AI_CONSUMES = ${seedSet};`);
const requireOnly = app('require-only', { './genesis/consumes': { require: './consumes.cjs' } }, {
  'consumes.cjs': `exports.GENESIS_AI_CONSUMES = ${seedSet};`,
});
const empty = app('empty-export', { './genesis/consumes': './consumes.cjs' }, { 'consumes.cjs': 'exports.OTHER = 1;' });
const throws = app('throws', { './genesis/consumes': './consumes.cjs' }, { 'consumes.cjs': 'throw new Error("no");' });
// Its module needs a subpath the package does not export: that is a broken install, not an old one.
const unexported = app('imports-unexported', { './genesis/consumes': './consumes.cjs' }, {
  'consumes.cjs': 'require("@genesislcap/ai-assistant/hidden");',
});
const importOnly = app('import-only', { './genesis/consumes': { import: './consumes.mjs' } }, {
  'consumes.mjs': `export const GENESIS_AI_CONSUMES = ${JSON.stringify({ kinds: seed.kinds, resourceFields: seed.resourceFields })};`,
});
const declaring = (name, declaration) => {
  const file = path.join(work, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(declaration));
  return file;
};
const cases = [
  ['the seed, on an assistant that reads what it declares', consumerFile, reads, 0],
  ['a kind the assistant does not read', declaring('kind', { ...seed, kinds: [...seed.kinds, 'unread'] }), reads, 1],
  ['a field the assistant does not read', declaring('field', { ...seed, resourceFields: [...seed.resourceFields, 'unread'] }), reads, 1],
  ['a baseline field left out', declaring('no-op', { ...seed, resourceFields: seed.resourceFields.filter((f) => f !== 'op') }), reads, 1],
  ['the baseline, before the export', declaring('baseline', baseline), before, 0],
  ['more than the baseline, before the export', declaring('more', { ...baseline, resourceFields: [...baseline.resourceFields, 'customCode'] }), before, 1],
  ['the baseline, with an assistant that has no package.json', declaring('baseline', baseline), noManifest, 1],
  ['the baseline, with no assistant installed', declaring('baseline', baseline), none, 1],
  ['the baseline, with an export that names nothing', declaring('baseline', baseline), empty, 1],
  ['a declaration of another version', declaring('v2', { ...seed, version: 2 }), reads, 1],
  ['a baseline kind left out', declaring('no-event', { ...seed, kinds: ['request'] }), reads, 1],
  ['query, before the export', declaring('query', { ...baseline, kinds: [...baseline.kinds, 'query'] }), before, 1],
  ['the baseline, with an export that throws', declaring('baseline', baseline), throws, 1],
  ['the baseline, with an export that imports what it may not', declaring('baseline', baseline), unexported, 1],
  ['the seed, on an assistant that exports it for import only', consumerFile, importOnly, 0],
  ['the baseline, with a constant that is false', declaring('baseline', baseline), falsy, 1],
  ['the baseline, with a constant that is a function', declaring('baseline', baseline), aFunction, 1],
  ['the baseline, with a constant whose kinds are not a list', declaring('baseline', baseline), notLists, 1],
  ['the baseline, with a module that ends the process', declaring('baseline', baseline), exits, 1],
  ['a kind it does not read, on a module that prints a wider answer first', declaring('kind', { ...seed, kinds: [...seed.kinds, 'unread'] }), pretends, 1],
  ['the seed, on a module that prints', consumerFile, prints, 0],
  ['the seed, on a module that keeps the process alive', consumerFile, stays, 0],
  // Required only, it reads as absent: fail-safe, as that assistant is held to the baseline.
  ['more than the baseline, on an assistant that exports it for require only', declaring('more', { ...baseline, resourceFields: [...baseline.resourceFields, 'customCode'] }), requireOnly, 1],
];
let wrong = 0;
for (const [name, declaration, client, want] of cases) {
  const run = spawnSync(process.execPath, [check, declaration, client], { encoding: 'utf8' });
  if (run.status !== want) {
    wrong++;
    console.log(`    ${name}: exit ${run.status}, not ${want}${run.stdout ? `\n${run.stdout}` : ''}${run.stderr}`);
  }
}
process.exit(wrong ? 1 : 0);
NODE

# Every React app depends on the assistant package, AI on or off, so a prebuilt base already has it: at
# exactly the UI version, the pin the generated app gets, never a range. A non-React app does not.
echo "=== package: every React app depends on the assistant"
node - "$WORK_DIR" "$SEED_DIR/.genx/versions.json" default off on onanthropic breakers extras ${case_labels[@]+"${case_labels[@]}"} <<'NODE' \
  || fail "package: an app does not depend on the assistant as every React app must (see above)"
const fs = require('fs');
const path = require('path');
const [work, versionsFile, ...labels] = process.argv.slice(2);
const version = JSON.parse(fs.readFileSync(versionsFile, 'utf8')).UI;
const dependencies = (label) => JSON.parse(fs.readFileSync(path.join(work, label, 'demo/client/package.json'), 'utf8')).dependencies;
const problems = [];
for (const label of labels) {
  const pin = dependencies(label)['@genesislcap/ai-assistant'];
  if (pin !== version) problems.push(`${label}: @genesislcap/ai-assistant is ${JSON.stringify(pin)}, not ${version}`);
}
if ('@genesislcap/ai-assistant' in dependencies('nonreact')) problems.push('nonreact: a non-React app depends on the assistant');
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

# Create refuses an export carrying any of these (server/archive-generation-service/export-leak-guard.js,
# LEAK_RULES, copied): catching one here is cheaper than a 422 on a customer's export.
echo "=== nothing Create's export guard refuses"
node - "$WORK_DIR" on onanthropic ${case_labels[@]+"${case_labels[@]}"} ${row_labels[@]+"${row_labels[@]}"} <<'NODE' || fail "leaks: a generated file carries something Create's export guard refuses (see above)"
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

  # A key must never reach a file the build writes. Every GENESIS_SYSDEF_ variable becomes a
  # system-definition item, and genesisConfigJar renders them all in plain text into
  # build/genesis/rendered-templates/generated-system-definition.json. So the render runs with CANARY
  # values, never a real key, under the names the proxy reads and under the old names it refuses. The
  # old ones MUST land: that proves the render ran, so the new ones' absence means something.
  # --rerun so it renders even when Gradle would call it up to date.
  echo "=== gradle: no key the proxy reads lands in the build's files"
  canary="canary-$$-not-a-key"
  ( export AI_GEMINI_API_KEY="$canary-gemini" AI_ANTHROPIC_API_KEY="$canary-anthropic" \
      GENESIS_SYSDEF_AI_GEMINI_API_KEY="$canary-old-gemini" GENESIS_SYSDEF_AI_ANTHROPIC_API_KEY="$canary-old-anthropic"
    gradle_in_on_app "$WORK_DIR/keys.log" :server:demo-app:genesisConfigJar --rerun ) \
    || fail "gradle: the render with canary keys failed (see the log above)"
  # The files under the AI app that hold a value, with every jar and zip looked into as well.
  holding() {
    { grep -rlF "$1" "$WORK_DIR/on/demo" --exclude-dir=node_modules 2>/dev/null
      find "$WORK_DIR/on/demo" -name node_modules -prune -o \( -name '*.jar' -o -name '*.zip' \) -print \
        | while read -r archive; do unzip -p "$archive" 2>/dev/null | grep -qF "$1" && echo "$archive"; done
    } | sed "s#^$WORK_DIR/on/demo/##" | sort -u | tr '\n' ' '
  }
  for vendor in GEMINI ANTHROPIC; do
    lower="$(echo "$vendor" | tr 'A-Z' 'a-z')"
    found="$(holding "$canary-$lower")"
    [ -z "$found" ] || fail "gradle: AI_${vendor}_API_KEY reached the build's files: $found"
    [ -n "$(holding "$canary-old-$lower")" ] \
      || fail "gradle: GENESIS_SYSDEF_AI_${vendor}_API_KEY reached no file, so the render never ran and this proves nothing"
  done
  echo "    the old names, which the proxy refuses, still land in: $(holding "$canary-old")"
fi

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "AI emission checks passed${GRADLE:+ (with gradle)}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
