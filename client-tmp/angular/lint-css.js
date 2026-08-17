const { execSync } = require('child_process');
const { readdirSync } = require('fs');
const path = require('path');

const IGNORED_DIRS = new Set([
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.angular',
  'out-tsc',
  'test-results',
  '.git',
]);

function findCssFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return IGNORED_DIRS.has(entry.name) ? [] : findCssFiles(path.join(dir, entry.name));
    }
    return entry.isFile() && entry.name.endsWith('.css') ? [path.join(dir, entry.name)] : [];
  });
}

const cssFiles = findCssFiles(__dirname);

if (cssFiles.length === 0) {
  console.log('No CSS files found.');
  process.exit(0);
}

const command = `genx lint -l stylelint ${cssFiles.join(' ')}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running stylelint:', error);
  process.exit(1);
}
