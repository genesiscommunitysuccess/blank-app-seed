/**
 * Lints the staged files, fixing what can be fixed and failing on what cannot.
 *
 * `oxlint --fix` is not single-pass convergent: it applies at most one fix per
 * overlapping span, so a file with several unused specifiers in one import
 * statement still reports the rest afterwards. A single
 * `oxlint --fix --deny-warnings` would therefore reject a commit whose findings
 * are entirely auto-fixable, and lint-staged would revert the partial fix. There
 * is no `--fix-passes` flag (oxlint 1.78), so the loop lives here; it can go
 * back to one plain call once oxlint converges on its own.
 *
 * The fixing passes stay quiet so a remaining finding is reported once, by the
 * final pass, rather than once per attempt.
 */
const { spawnSync } = require('node:child_process');

/** Convergence needs about log2(findings) passes; this is well clear of that. */
const MAX_PASSES = 10;

const files = process.argv.slice(2);

const runOxlint = (args, quiet) =>
  spawnSync('oxlint', [...args, ...files], {
    stdio: quiet ? 'ignore' : 'inherit',
    shell: process.platform === 'win32',
  });

if (files.length === 0) {
  process.exit(0);
}

for (let pass = 0; pass < MAX_PASSES; pass += 1) {
  const { status, error } = runOxlint(['--fix', '--deny-warnings'], true);
  if (error) {
    // Never fail silently: a missing binary must not look like a lint failure.
    console.error(`oxlint-staged: could not run oxlint (${error.code})`);
    process.exit(1);
  }
  if (status === 0) {
    process.exit(0);
  }
}

// Still not clean: report what is left (without touching the files again) and fail.
process.exit(runOxlint(['--deny-warnings'], false).status === 0 ? 0 : 1);
