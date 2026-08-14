#!/usr/bin/env bash
#
# Generate test apps from this seed and verify they are lint-clean out of the box.
#
# For each requested framework this generates two apps — the defaults app (no
# routes) and a "full" app driven by .genx/tests/fixtures/routes-full.json,
# which exercises every tile type (entity-manager with permissions/custom
# events/eventing/FDC3, grid-pro with listener/reqrep, chart, smart-form) —
# then runs the ox lint pipeline with zero tolerance:
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
#   WORK_DIR   scratch dir for generated apps (default: a fresh mktemp dir)
#   KEEP=1     keep generated apps instead of deleting the scratch dir

set -uo pipefail

SEED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FIXTURE="$SEED_DIR/.genx/tests/fixtures/routes-full.json"
FRAMEWORKS=("${@:-react}")
if [ $# -eq 0 ]; then
  FRAMEWORKS=(react webcomponents angular)
fi

WORK_DIR="${WORK_DIR:-$(mktemp -d -t blank-app-seed-lint)}"
FAILURES=()

run_lint_checks() {
  local app_dir="$1" label="$2"
  (
    cd "$app_dir/client" || exit 1
    echo "--- [$label] npm install"
    npm install --legacy-peer-deps --no-fund --no-audit || exit 1
    echo "--- [$label] oxlint . --deny-warnings"
    ./node_modules/.bin/oxlint . --deny-warnings || exit 1
    echo "--- [$label] oxfmt --check ."
    ./node_modules/.bin/oxfmt --check . || exit 1
    echo "--- [$label] npm run lint"
    npm run lint || exit 1
  )
}

for fw in "${FRAMEWORKS[@]}"; do
  for variant in default full; do
    label="$fw-$variant"
    app_dir="$WORK_DIR/$label"
    rm -rf "$app_dir"
    echo "=== Generating $label into $app_dir"
    extra_args=()
    if [ "$variant" = "full" ]; then
      extra_args=(--routes "$(cat "$FIXTURE")")
    fi
    (
      cd "$WORK_DIR" || exit 1
      npx -y @genesislcap/genx@latest init "$label" -s "$SEED_DIR" -x --no-shell \
        --framework "$fw" --apiHost 'wss://localhost/gwf/' "${extra_args[@]}"
    ) || { FAILURES+=("$label: generation failed"); continue; }
    run_lint_checks "$app_dir" "$label" || FAILURES+=("$label: lint checks failed")
  done
done

echo
if [ ${#FAILURES[@]} -gt 0 ]; then
  echo "FAILED:"
  printf ' - %s\n' "${FAILURES[@]}"
  echo "Generated apps kept in $WORK_DIR for inspection"
  exit 1
fi

echo "All generated apps are lint-clean: ${FRAMEWORKS[*]} (default + full)"
if [ "${KEEP:-0}" != "1" ]; then
  rm -rf "$WORK_DIR"
else
  echo "Generated apps kept in $WORK_DIR"
fi
