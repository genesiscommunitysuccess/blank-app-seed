const { rmSync, renameSync } = require('node:fs');
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
  return `${dirClientTemp}/${FRAMEWORKS_DIR_MAP.get(frameworkName)}`;
};

const excludeFrameworks = (selectedFramework) => {
  const mainClientDirPath = path.join(
    __dirname,
    `../../${DIRS_MAP.get(DIR_CLIENT_MAIN_ALIAS)}`,
  );
  renameSync(getDirClientTemp(selectedFramework), mainClientDirPath);

  rmSync(dirClientTemp, { recursive: true, force: true });
};

module.exports = excludeFrameworks;
