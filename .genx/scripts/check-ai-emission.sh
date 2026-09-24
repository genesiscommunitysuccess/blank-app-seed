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
#   non-react ui.ai.enabled on a non-React app emits nothing: there is no panel to call the proxy.
#
# Usage:  .genx/scripts/check-ai-emission.sh
# Env:    GRADLE=1  also build the AI app's server, require the platform's own security scan
#                   (checkAuthPermissions) to report no insecure endpoint, and compile both vendors'
#                   proxies against the app's Genesis version. Needs Genesis artifactory credentials,
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

AI_UI='{"ai":{"enabled":true,"vendor":"gemini","tier":"high","systemPrompt":"x","resources":[]}}'
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
}

# Every file or block the feature adds. Used both ways: all present when on, none when off.
ai_artifacts_present() {
  local app="$WORK_DIR/$1/demo"
  local found=0
  [ -f "$app/$MODULE/scripts/ai-service-web-handler.kts" ] && found=$((found + 1))
  grep -q httpObjectAggregator "$app/$MODULE/scripts/genesis-router.kts" && found=$((found + 1))
  grep -q '^## AI chat' "$app/README.md" && found=$((found + 1))
  echo "$found"
}

echo "=== Generating into $WORK_DIR"
generate default --framework react
generate off --framework react --ui '{"ai":{"enabled":false}}'
generate on --framework react --ui "$AI_UI"
generate onanthropic --framework react --ui "$AI_UI_ANTHROPIC"
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
[ "$(ai_artifacts_present on)" = "3" ] || fail "on: expected all 3 AI artifacts, found $(ai_artifacts_present on)"
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

  # Exactly the AI path's own three files change, and nothing else. Genesis Create writes its code
  # generation over the seed (cfg/<app>-*.kts and .xml, scripts/<app>-*.kts, never the router script, a
  # web handler or the README), so a file the AI path relied on in there would be silently replaced.
  changed="$(diff -rq -x node_modules -x answers.json "$WORK_DIR/default/demo" "$app" \
    | sed -E -e "s#^Files $WORK_DIR/default/demo/(.*) and .* differ\$#\1#" \
             -e "s#^Only in $app/?(.*): (.*)\$#\1/\2#" -e 's#^/##' | sort)"
  expected="$(printf '%s\n' README.md "$MODULE/scripts/ai-service-web-handler.kts" "$MODULE/scripts/genesis-router.kts" | sort)"
  [ "$changed" = "$expected" ] || fail "$label: the AI path changed files beyond its own three: $(echo $changed)"
done

# The seed seeds no rights: the project's rights files belong to the generator that sends them.
echo "=== no rights written"
for label in on onanthropic; do
  grep -rqs 'AI_CHAT' "$WORK_DIR/$label/demo/$MODULE/data/" && fail "$label: the seed wrote an AI_CHAT row; rights belong to the generator"
done

echo "=== non-react"
[ "$(ai_artifacts_present nonreact)" = "0" ] || fail "non-react: AI files emitted with no panel to use them"

# Genesis Start's REST API has no authentication, so only the two headless scripts may turn it on. The
# launcher also takes its settings as bare project properties (restEnabled=true) or through its Gradle
# extension, so no Gradle file may set any of them, with AI on or off.
echo "=== genesis start: desktop unless a headless script asks"
node - "$SEED_DIR" "$WORK_DIR" default off on onanthropic nonreact <<'NODE' \
  || fail "genesis start: REST or headless mode is switched on where it must not be (see above)"
const fs = require('fs');
const path = require('path');
const [seed, work, ...labels] = process.argv.slice(2);
const flags = '-Pgenesis.start.headless=true -Pgenesis.start.restEnabled=true -Pgenesis.start.restPort=18080';
const expected = {
  'genesis-start': 'cd ../server && ./gradlew genesisStart',
  'genesis-start:headless': `cd ../server && ./gradlew genesisStart ${flags}`,
  'genesis-start:write-script': `cd ../server && ./gradlew writeStartScript ${flags}`,
};
const setting = /genesis\.start\.|genesisStart\s*[{.(]|\b(headless|restEnabled|restPort|restBasePath|restMaxRequestBodyBytes)\b/;
const problems = [];
const checkScripts = (where, scripts) => {
  for (const [name, value] of Object.entries(expected)) {
    if (scripts[name] !== value) problems.push(`${where}: "${name}" is ${JSON.stringify(scripts[name])}`);
  }
  for (const [name, value] of Object.entries(scripts)) {
    if (!(name in expected) && /genesis\.start\.|genesisStart|writeStartScript/.test(value)) {
      problems.push(`${where}: "${name}" runs Genesis Start`);
    }
  }
};
// Every framework's template (Handlebars, so read line by line, not as JSON).
for (const fw of fs.readdirSync(path.join(seed, 'client-tmp'))) {
  const file = path.join(seed, 'client-tmp', fw, 'package.json');
  if (!fs.existsSync(file)) continue;
  const scripts = {};
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/^\s*"([^"]+)": ("(?:[^"\\]|\\.)*"),?\s*$/gm)) {
    scripts[m[1]] = JSON.parse(m[2]);
  }
  checkScripts(`client-tmp/${fw}/package.json`, scripts);
}
// Every Gradle file of every generated app, comments aside.
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
for (const label of labels) {
  const app = path.join(work, label, 'demo');
  checkScripts(`${label}: client/package.json`, JSON.parse(fs.readFileSync(path.join(app, 'client/package.json'), 'utf8')).scripts);
  for (const file of gradleFiles(app)) {
    live(file).filter((l) => setting.test(l))
      .forEach((l) => problems.push(`${label}: ${path.relative(app, file)} sets ${JSON.stringify(l.trim())}`));
  }
}
problems.forEach((p) => console.log(`    ${p}`));
process.exit(problems.length ? 1 : 0);
NODE

if [ "${GRADLE:-0}" = "1" ]; then
  echo "=== gradle: build + checkAuthPermissions on the AI app"
  # Unquoted on purpose: GRADLE_PARAMS may hold several arguments, or none.
  (cd "$WORK_DIR/on/demo" && ./gradlew --no-daemon ${GRADLE_PARAMS:-} :server:demo-app:build > "$WORK_DIR/gradle.log" 2>&1 \
    && ./gradlew --no-daemon ${GRADLE_PARAMS:-} :server:demo-app:checkAuthPermissions --rerun > "$WORK_DIR/scan.log" 2>&1) \
    || fail "gradle: build or scan failed (see $WORK_DIR/gradle.log and scan.log)"
  # The build passes even with insecure endpoints unless a project opts into failing it, so the
  # scan's own summary is the assertion — a green build alone proves nothing about permissioning.
  # `--rerun` because a scan restored from the build cache prints no summary at all, and the endpoint
  # count because a scan that found nothing would also report nothing insecure. Whole lines only:
  # "Total endpoints: 2" is inside "Total endpoints: 20", and every per-type line ends "Insecure: N".
  grep -qx "  Total endpoints: 2" "$WORK_DIR/scan.log" \
    || fail "gradle: the security scan did not see the two chat endpoints (see $WORK_DIR/scan.log)"
  grep -qx "  Insecure: 0" "$WORK_DIR/scan.log" \
    || fail "gradle: the platform security scan found an insecure endpoint (see $WORK_DIR/scan.log)"

  # Scripts compile only when the router starts: neither the build nor the scan above would notice a
  # proxy that no longer compiles against this Genesis version. So compile each vendor's proxy as
  # Kotlin, as an extension of its script class with the script's default imports spelled out. The
  # wrappers go only into this throwaway app, after the scan, so the scan never counts them.
  echo "=== gradle: compile both proxies against the script API"
  kotlin_dir="$WORK_DIR/on/demo/server/demo-app/src/main/kotlin"
  for pair in "on:gemini" "onanthropic:anthropic"; do
    label="${pair%%:*}"; vendor="${pair#*:}"
    VENDOR="$vendor" perl -0pe '
      s{^(\@file:[^\n]*\n)}{${1}package aiproxycheck.$ENV{VENDOR}\n}m or die "no \@file line\n";
      s{^(webHandlers\()}{import global.genesis.db.entity.DeleteResult
import global.genesis.db.entity.InsertResult
import global.genesis.db.entity.ModifyResult
import global.genesis.db.entity.UpsertResult
import global.genesis.message.core.event.LogLevel
import global.genesis.message.core.event.LogLevel.*
import global.genesis.router.extension.ContentType
import global.genesis.router.extension.PropertyCase
import global.genesis.router.extension.PropertyCase.*
import global.genesis.router.extension.WebContext
import global.genesis.router.extension.WebContextOf
import global.genesis.router.extension.WebHandlerScript
import global.genesis.router.server.web.http.extensions.RequestType.*
import io.netty.handler.codec.http.HttpResponseStatus.*
import kotlinx.coroutines.flow.*

fun WebHandlerScript.compileCheck() =
${1}}m or die "no top-level webHandlers(\n";
    ' "$WORK_DIR/$label/demo/$MODULE/scripts/ai-service-web-handler.kts" > "$kotlin_dir/AiProxyCheck_$vendor.kt" \
      || fail "$label: could not wrap the proxy for compiling"
  done
  (cd "$WORK_DIR/on/demo" && ./gradlew --no-daemon ${GRADLE_PARAMS:-} :server:demo-app:compileKotlin --rerun \
    > "$WORK_DIR/compile.log" 2>&1) \
    || fail "gradle: a proxy does not compile against the script API (see $WORK_DIR/compile.log)"
  # And both were really compiled: a wrapper in the wrong place would pass by never being built.
  for vendor in gemini anthropic; do
    [ -f "$WORK_DIR/on/demo/server/demo-app/build/classes/kotlin/main/aiproxycheck/$vendor/AiProxyCheck_${vendor}Kt.class" ] \
      || fail "gradle: the $vendor proxy was not compiled (see $WORK_DIR/compile.log)"
  done
  rm -f "$kotlin_dir"/AiProxyCheck_*.kt
fi

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "AI emission checks passed${GRADLE:+ (with gradle)}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
