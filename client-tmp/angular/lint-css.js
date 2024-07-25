const { execSync } = require('child_process');
const glob = require('glob');
const path = require('path');
const cssFiles = glob.sync(path.join(__dirname, '**/*.css'));

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