#!/usr/bin/env bash
#
# Generate test apps from this seed and verify they are lint-clean out of the box.
#
# For each requested framework this generates three apps — the defaults app (no
# routes), a "full" app driven by .genx/tests/fixtures/routes-full.json
# (every tile type: entity-manager with permissions/custom events/eventing/FDC3,
# grid-pro with listener/reqrep, chart, smart-form), and an "fdc3" app with
# FDC3 channels enabled — then runs the ox lint pipeline with zero tolerance:
#
#   oxlint . --deny-warnings   # zero errors, zero warnings
#   oxfmt --check .            # formatting is already canonical
#   npm run lint               # genx lint -l ox (Oxlint -> Oxfmt -> Stylelint)
#
# Usage:
#   .genx/scripts/generate-test-apps.sh [framework...]
#
#   framework: react | webcomponents | angular (default: all three)
#
# Env:
#   WORK_DIR   scratch dir for generated apps (default: a fresh mktemp dir).
#              A caller-supplied WORK_DIR is never deleted by this script.
#   KEEP=1     keep each generated app (and the scratch dir) for inspection.
#              By default an app is deleted as soon as it passes, so a run only
#              ever holds one app's node_modules at a time. Failing apps are
#              always kept.
#   BUILD=1    additionally run `npx tsc --noEmit` and `npm run build` per app
#
# Installs use the app's own bootstrap semantics (plain `npm install`) — NOT
# --legacy-peer-deps, which would skip the ag-grid peer deps and break builds.

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURE="$SEED_DIR/.genx/tests/fixtures/routes-full.json"

if [ $# -gt 0 ]; then
  FRAMEWORKS=("$@")
else
  FRAMEWORKS=(react webcomponents angular)
fi

# `mktemp -d -t <name>` is BSD-only; spell the template out so this works on GNU
# coreutils too. Bail out rather than carry on with an empty WORK_DIR, which would
# turn the `rm -rf` calls below into absolute paths.
OWNS_WORK_DIR=0
if [ -z "${WORK_DIR:-}" ]; then
  WORK_DIR="$(mktemp -d "${TMPDIR:-/tmp}/blank-app-seed-lint.XXXXXXXX")" || exit 1
  OWNS_WORK_DIR=1
fi
if [ -z "$WORK_DIR" ] || [ ! -d "$WORK_DIR" ]; then
  echo "Could not create or resolve WORK_DIR ('${WORK_DIR}')" >&2
  exit 1
fi

FAILURES=()

run_lint_checks() {
  local app_dir="$1" label="$2"
  (
    cd "$app_dir/client" || exit 1
    echo "--- [$label] npm install"
    npm install --no-fund --no-audit || exit 1
    echo "--- [$label] oxlint . --deny-warnings"
    ./node_modules/.bin/oxlint . --deny-warnings || exit 1
    echo "--- [$label] oxfmt --check ."
    ./node_modules/.bin/oxfmt --check . || exit 1
    echo "--- [$label] npm run lint"
    npm run lint || exit 1
    if [ "${BUILD:-0}" = "1" ]; then
      echo "--- [$label] tsc --noEmit"
      npx tsc --noEmit || exit 1
      echo "--- [$label] npm run build"
      npm run build || exit 1
    fi
  )
}

for fw in "${FRAMEWORKS[@]}"; do
  for variant in default full fdc3; do
    label="$fw-$variant"
    app_dir="$WORK_DIR/$label"
    rm -rf "$app_dir"
    echo "=== Generating $label into $app_dir"
    extra_args=()
    if [ "$variant" = "full" ]; then
      extra_args=(--routes "$(cat "$FIXTURE")")
    fi
    if [ "$variant" = "fdc3" ]; then
      extra_args=(--ui '{"fdc3":{"channels":[{"name":"positions","type":"position"},{"name":"instrumentChannel","type":"fdc3.instrument"}]}}')
    fi
    (
      cd "$WORK_DIR" || exit 1
      # `"${extra_args[@]}"` alone is an unbound-variable error on an empty array
      # under `set -u` in bash 3.2 (the macOS system bash).
      npx -y @genesislcap/genx@latest init "$label" -s "$SEED_DIR" -x --no-shell \
        --framework "$fw" --apiHost 'wss://localhost/gwf/' \
        ${extra_args[@]+"${extra_args[@]}"}
    ) || { FAILURES+=("$label: generation failed"); continue; }
    if run_lint_checks "$app_dir" "$label"; then
      # Reclaim the app's node_modules straight away — CI runners are disk-tight and
      # each generated app installs well over a gigabyte.
      [ "${KEEP:-0}" = "1" ] || rm -rf "$app_dir"
    else
      FAILURES+=("$label: lint checks failed")
    fi
  done
done

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"
  printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR for inspection"
  exit 1
fi

echo "All generated apps are lint-clean: ${FRAMEWORKS[*]} (default + full + fdc3)"
if [ "${KEEP:-0}" = "1" ]; then
  echo "Generated apps kept in $WORK_DIR"
elif [ "$OWNS_WORK_DIR" = "1" ]; then
  # Only ever remove a scratch dir this script created.
  rm -rf "$WORK_DIR"
fi
