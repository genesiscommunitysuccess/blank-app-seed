import { execSync } from 'child_process';
import glob from 'glob';
import path from 'path';

const cssFiles: string[] = glob.sync(path.join(__dirname, '**/*.css'));

if (cssFiles.length === 0) {
  console.log('No CSS files found.');
  process.exit(0);
}

const command: string = `genx lint -l stylelint ${cssFiles.join(' ')}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error running stylelint:', error);
  process.exit(1);
}