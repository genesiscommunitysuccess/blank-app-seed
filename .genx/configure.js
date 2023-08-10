const { resolve } = require('node:path');
const { listAllFiles, rename, writeJSON } = require('./utils');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  const { writeFileWithData } = utils;
  const { directory, appName, applicationVersion } = data;

  // populate additional data fields
  data.pkgName = appName.replace(/[\W_]/g, '');
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = appName.toUpperCase().replace("-", "_");
  data.applicationVersionWeb = applicationVersion.split('-').shift();

  // render files
  const filesClient = [
    `${directory}/README.md`,
    `${directory}/client/package.json`,
    `${directory}/client/web/package.json`,
    `${directory}/client/web/index.html`,
    `${directory}/client/web/src/main/main.ts`,
    `${directory}/client/web/src/routes/config.ts`,
    `${directory}/client/web/src/utils/logger.ts`,
    `${directory}/settings.gradle.kts`,
    `${directory}/docker-compose.yml`
  ];
  const serverJvmRoot = resolve(directory, "server", "jvm");
  const ignore = ['.DS_Store', '.gradle', '.lock', '.jar'];
  const fileFilter = (item) => ignore.every((el) => !item.path.endsWith(el));
  const filesServer = listAllFiles(serverJvmRoot, fileFilter)
    .filter(item => !item.isDir)
    .map(item => item.path);

  [...filesClient, ...filesServer].forEach(item => writeFileWithData(item, data));

  // rename files & folders
  const placeholder = "genesis";
  const dictionaryConfigFolder = resolve(serverJvmRoot, "genesis-config", "src", "main", "resources", "cfg");
  const scriptConfigFolder = resolve(serverJvmRoot, "genesis-script-config", "src", "main", "resources", "scripts");
  const dictionaryCacheRoot = resolve(directory, "server", "jvm", "genesis-dictionary-cache");
  [
    { item: "genesis-fields-dictionary.kts", dir: dictionaryConfigFolder },
    { item: "genesis-tables-dictionary.kts", dir: dictionaryConfigFolder },
    { item: "genesis-view-dictionary.kts", dir: dictionaryConfigFolder },
    { item: "genesis-system-definition.kts", dir: dictionaryConfigFolder },
    { item: "genesis-processes.xml", dir: dictionaryConfigFolder },
    { item: "genesis-service-definitions.xml", dir: dictionaryConfigFolder },
    { item: "genesis-dataserver.kts", dir: scriptConfigFolder },
    { item: "genesis-eventhandler.kts", dir: scriptConfigFolder },
    { item: "genesis-reqrep.kts", dir: scriptConfigFolder },
    { item: "genesis-generated-dao", dir: dictionaryCacheRoot },
    { item: "genesis-generated-fields", dir: dictionaryCacheRoot },
    { item: "genesis-generated-hft", dir: dictionaryCacheRoot },
    { item: "genesis-generated-sysdef", dir: dictionaryCacheRoot },
    { item: "genesis-generated-view", dir: dictionaryCacheRoot },
    { item: "genesis-dictionary-cache", dir: serverJvmRoot },
    { item: "genesis-config", dir: serverJvmRoot },
    { item: "genesis-deploy", dir: serverJvmRoot },
    { item: "genesis-distribution", dir: serverJvmRoot },
    { item: "genesis-eventhandler", dir: serverJvmRoot },
    { item: "genesis-messages", dir: serverJvmRoot },
    { item: "genesis-script-config", dir: serverJvmRoot },
    { item: "genesis-site-specific", dir: serverJvmRoot },
  ].forEach(el => rename(el.item, el.item.replace(placeholder, appName), el.dir));

  // persist answers
  writeJSON(`${__dirname}/answers.json`, data);
};
