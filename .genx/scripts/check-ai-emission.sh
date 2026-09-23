#!/usr/bin/env bash
#
# Check what this seed emits for the AI chat feature, and what it does NOT.
#
# The server half of the feature is gated on ONE value — `data.AI.enabled` in configure.js — and
# every assertion here is a way that gate could fail silently:
#
#   off       ui.ai absent and ui.ai.enabled=false generate the same app, and neither carries any
#             AI file. A project that never asked for chat must not change.
#   on        the proxy, its sysdef, the router body cap and the README section all appear, and the
#             proxy is written byte-for-byte from its template (it must survive handlebars untouched).
#   non-react ui.ai.enabled on a non-React app emits nothing: there is no panel to call the proxy.
#
# Usage:  .genx/scripts/check-ai-emission.sh
# Env:    GRADLE=1  also build the AI app's server and require the platform's own security scan
#                   (checkAuthPermissions) to report no insecure endpoint. Needs Genesis artifactory
#                   credentials, as the sample-app build does.
#         KEEP=1    keep the generated apps for inspection.

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TEMPLATE="$SEED_DIR/.genx/templates/server/ai-service-web-handler.kts.hbs"
WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/blank-app-seed-ai.XXXXXXXX")" || exit 1
MODULE="server/demo-app/src/main/genesis"
FAILURES=()

AI_UI='{"ai":{"enabled":true,"vendor":"gemini","tier":"high","systemPrompt":"x","resources":[]}}'

fail() { FAILURES+=("$1"); echo "FAIL: $1"; }

generate() {
  local label="$1"; shift
  mkdir -p "$WORK_DIR/$label"
  (cd "$WORK_DIR/$label" && npx -y @genesislcap/genx@latest init demo -s "$SEED_DIR" -x --no-shell \
    --apiHost 'wss://localhost/gwf/' "$@" > "$WORK_DIR/$label.log" 2>&1) \
    || { fail "$label: generation failed (see $WORK_DIR/$label.log)"; return 1; }
}

# Every file or block the feature adds. Used both ways: all present when on, none when off.
ai_artifacts_present() {
  local app="$WORK_DIR/$1/demo"
  local found=0
  [ -f "$app/$MODULE/scripts/ai-service-web-handler.kts" ] && found=$((found + 1))
  grep -q AI_ALLOWED_MODELS "$app/$MODULE/cfg/demo-system-definition.kts" && found=$((found + 1))
  grep -q httpObjectAggregator "$app/$MODULE/scripts/genesis-router.kts" && found=$((found + 1))
  grep -q '^## AI chat' "$app/README.md" && found=$((found + 1))
  echo "$found"
}

echo "=== Generating into $WORK_DIR"
generate default --framework react
generate off --framework react --ui '{"ai":{"enabled":false}}'
generate on --framework react --ui "$AI_UI"
generate nonreact --framework webcomponents --ui "$AI_UI"

echo "=== off"
[ "$(ai_artifacts_present default)" = "0" ] || fail "off: a project with no ui.ai carries AI files"
[ "$(ai_artifacts_present off)" = "0" ] || fail "off: ui.ai.enabled=false still emitted AI files"
# answers.json records the seed path and a timestamped layout key, so it differs on every run.
diff -r -x node_modules -x answers.json "$WORK_DIR/default/demo" "$WORK_DIR/off/demo" > /dev/null \
  || fail "off: ui.ai.enabled=false generates a different app from no ui.ai at all"

echo "=== on"
[ "$(ai_artifacts_present on)" = "4" ] || fail "on: expected all 4 AI artifacts, found $(ai_artifacts_present on)"
diff -q "$TEMPLATE" "$WORK_DIR/on/demo/$MODULE/scripts/ai-service-web-handler.kts" > /dev/null \
  || fail "on: the proxy was changed on its way through handlebars"

# The scan cannot see this one: requiresAuth = false drops the AI_CHAT check and makes the endpoint
# anonymous while the scan still reports it secure. Comment lines are skipped, since the template's
# own warning names the setting.
HANDLER="$WORK_DIR/on/demo/$MODULE/scripts/ai-service-web-handler.kts"
grep -vE '^[[:space:]]*(//|/[*]|[*])' "$HANDLER" | grep -q 'requiresAuth' \
  && fail "on: the proxy sets requiresAuth, which makes it anonymous"
[ "$(grep -c 'permissionCodes("AI_CHAT")' "$HANDLER")" = "2" ] \
  || fail "on: expected permissionCodes(\"AI_CHAT\") on both chat endpoints"

# The seed seeds no rights: the project's rights files belong to the generator that sends them.
echo "=== no rights written"
grep -rqs 'AI_CHAT' "$WORK_DIR/on/demo/$MODULE/data/" && fail "on: the seed wrote an AI_CHAT row; rights belong to the generator"

echo "=== non-react"
[ "$(ai_artifacts_present nonreact)" = "0" ] || fail "non-react: AI files emitted with no panel to use them"

if [ "${GRADLE:-0}" = "1" ]; then
  echo "=== gradle: build + checkAuthPermissions on the AI app"
  (cd "$WORK_DIR/on/demo" && ./gradlew --no-daemon :server:demo-app:build > "$WORK_DIR/gradle.log" 2>&1 \
    && ./gradlew --no-daemon :server:demo-app:checkAuthPermissions --rerun > "$WORK_DIR/scan.log" 2>&1) \
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
fi

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"; printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR"
  exit 1
fi
echo "AI emission checks passed${GRADLE:+ (with gradle)}"
[ "${KEEP:-0}" = "1" ] && echo "Generated apps kept in $WORK_DIR" || rm -rf "$WORK_DIR"
