/**
 * Utility for cleaning directories
 * Zero-dependency (can be used to delete top-level node_modules)
 *
 * Based on rimraf CLI
 * https://raw.githubusercontent.com/isaacs/rimraf/main/bin.js
 */

const path = require('path');
const rimraf = require('./rimraf');

// will refuse to delete / or c:\
const isRoot = arg => /^(\/|[a-zA-Z]:\\)$/.test(path.resolve(arg));
const filterOutRoot = (arg) => {
  const ok = !isRoot(arg);
  if (!ok) {
    console.error(`refusing to remove ${arg}`);
    console.error('Set --no-preserve-root to allow this');
  }
  return ok;
};

const args = process.argv.slice(2)
  .filter(arg => !!arg && filterOutRoot(arg));

const go = (n) => {
  if (n >= args.length) {
    return;
  }
  rimraf(args[n], {disableGlob: true}, (er) => {
    if (er) {
      throw er;
    }
    const removePath = path.resolve(process.cwd(), args[n]);
    console.log(removePath, 'removed');
    go(n+1);
  });
};

if (args.length === 0) {
  console.error('Usage: clean <path> [<path> ...]');
  console.error('');
  console.error('  Deletes all files and folders at "path" recursively.');
  process.exit(0);
} else {
  go(0);
}
