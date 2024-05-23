const { rmSync, renameSync } = require('node:fs');
const path = require('path');
const { FRAMEWORKS, ANGULAR, REACT, WEB_COMPONENTS } = require('../static');

const frameworkFolderMap = {
  [ANGULAR]: 'angular',
  [REACT]: 'react',
};

const excludeFrameworks = (selectedFramework) => {
  const dir = path.join(__dirname, '..');
  const ignoredFrameworks = FRAMEWORKS.filter(
    (framework) => framework !== selectedFramework,
  ).map((framework) => `client-${frameworkFolderMap[framework]}`);
  ignoredFrameworks.forEach((framework) => {
    const frameworkDirectory = `${dir}/${framework}`;
    rmSync(frameworkDirectory, { recursive: true, force: true });
  });
  if (selectedFramework !== WEB_COMPONENTS) {
    rmSync(`${dir}/client`, { recursive: true, force: true });
    const frameworkDirectory = `${dir}/client-${frameworkFolderMap[selectedFramework]}`;
    renameSync(frameworkDirectory, `${dir}/client`);
  }
};

module.exports = excludeFrameworks;
