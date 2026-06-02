const { existsSync, rmSync, renameSync } = require('node:fs');
const path = require('path');
const {
  FRAMEWORKS_DIR_MAP,
  DIR_CLIENT_MAIN_ALIAS,
  DIR_CLIENT_TEMP_ALIAS,
  DIRS_MAP,
} = require('../static');

const dirClientTemp = path.join(
  __dirname,
  `../../${DIRS_MAP.get(DIR_CLIENT_TEMP_ALIAS)}`,
);

const getDirClientTemp = (frameworkName) => {
  return path.join(dirClientTemp, FRAMEWORKS_DIR_MAP.get(frameworkName));
};

const excludeFrameworks = (selectedFramework) => {
  const mainClientDirPath = path.join(
    __dirname,
    `../../${DIRS_MAP.get(DIR_CLIENT_MAIN_ALIAS)}`,
  );
  const selectedFrameworkPath = getDirClientTemp(selectedFramework);

  if (existsSync(mainClientDirPath)) {
    rmSync(mainClientDirPath, { recursive: true, force: true });
  }

  renameSync(selectedFrameworkPath, mainClientDirPath);

  rmSync(dirClientTemp, { recursive: true, force: true });
};

module.exports = excludeFrameworks;
