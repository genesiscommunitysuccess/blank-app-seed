const { rmSync, renameSync } = require('node:fs');
const path = require('path');
const {
  FRAMEWORKS_DIR_MAP,
  FRAMEWORKS_ALIAS,
  DIR_CLIENT_MAIN_ALIAS,
  DIR_CLIENT_TEMP_ALIAS,
  DIRS_MAP,
} = require('../static');

const getDirClientTemp = (frameworkName) => {
  const dirClientTemp = path.join(
    __dirname,
    `../${DIRS_MAP.get(DIR_CLIENT_TEMP_ALIAS)}`,
  );
  return `${dirClientTemp}/${FRAMEWORKS_DIR_MAP.get(frameworkName)}`;
};

const excludeFrameworks = (selectedFramework) => {
  const ignoredFrameworks = FRAMEWORKS_ALIAS.filter(
    (framework) => framework !== selectedFramework,
  );

  ignoredFrameworks.forEach((framework) => {
    rmSync(getDirClientTemp(framework), { recursive: true, force: true });
  });

  const mainClientDirPath = path.join(
    __dirname,
    `../../${DIRS_MAP.get(DIR_CLIENT_MAIN_ALIAS)}`,
  );
  renameSync(getDirClientTemp(selectedFramework), mainClientDirPath);
};

module.exports = excludeFrameworks;
