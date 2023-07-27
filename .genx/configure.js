const { resolve } = require('node:path');
const { renameSync, writeFileSync, readdirSync, statSync } = require('node:fs');

const listAllFiles = (startPath, filter = (e) => true) => {
  const filenames = new Set();
  const walk = (dirPath) => {
    const files = readdirSync(dirPath);
    for (const file of files) {
      const fullPath = resolve(dirPath, file);
      const stats = statSync(fullPath);
      const isDir = stats.isDirectory();
      const entry = { path: fullPath, stats, isDir };
      if (filter(entry)) {
        if (isDir) {
          walk(fullPath);
        } else {
          filenames.add(entry);
        }
      }
    }
  };
  walk(startPath);
  return [...filenames];
};

const rename = (from, to, dir) => renameSync(resolve(dir, from), resolve(dir, to));

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  const { writeFileWithData } = utils;
  const { directory, appName } = data;

  // 
  data.localGenId = data.appName.toUpperCase().replace("-", "_");

  // pesist answers
  writeFileSync(`${__dirname}/answers.json`, JSON.stringify(data, null, 2));

  writeFileWithData(`${directory}/README.md`, data);
  writeFileWithData(`${directory}/client/package.json`, data);
  writeFileWithData(`${directory}/client/index.html`, data);
  writeFileWithData(`${directory}/settings.gradle.kts`, data);
  writeFileWithData(`${directory}/docker-compose.yml`, data);

  const serverJvmRoot = resolve(directory, "server", "jvm");
  const ignore = ['.DS_Store', '.gradle', '.lock', '.jar'];
  const fileFilter = (item) => ignore.every((el) => !item.path.endsWith(el));
  listAllFiles(serverJvmRoot, fileFilter).forEach(item => {
      if (!item.isDir) {
        writeFileWithData(item.path, data);
      }
  });

  const placeholder = "genesis";
  
  // server/jvm/genesis-config/src/main/resources/cfg/genesis-fields-dictionary.kts -> server/jvm/genesis-config/src/main/resources/cfg/${appName}-fields-dictionary.kts
  const dictionaryConfigFolder = resolve(serverJvmRoot, "genesis-config", "src", "main", "resources", "cfg");
  [
    "genesis-fields-dictionary.kts",
    "genesis-tables-dictionary.kts",
    "genesis-view-dictionary.kts",
    "genesis-system-definition.kts",
    "genesis-processes.xml",
    "genesis-service-definitions.xml"
  ].forEach(file => rename(file, file.replace(placeholder, appName), dictionaryConfigFolder));

  // server/jvm/genesis-script-config/src/main/resources/scripts/genesis-dataserver.kts -> server/jvm/genesis-script-config/src/main/resources/scripts/${appName}-dataserver.kts
  const scriptConfigFolder = resolve(serverJvmRoot, "genesis-script-config", "src", "main", "resources", "scripts");
  [
    "genesis-dataserver.kts",
    "genesis-eventhandler.kts",
    "genesis-reqrep.kts"
  ].forEach(file => rename(file, file.replace(placeholder, appName), scriptConfigFolder));

  // server/jvm/genesis-dictionary-cache/genesis-generated-dao -> server/jvm/genesis-dictionary-cache/${appName}-generated-dao
  const dictionaryCacheRoot = resolve(directory, "server", "jvm", "genesis-dictionary-cache");
  [
    'genesis-generated-dao',
    'genesis-generated-fields',
    'genesis-generated-hft',
    'genesis-generated-sysdef',
    'genesis-generated-view',
  ].forEach(folder => rename(folder, folder.replace(placeholder, appName), dictionaryCacheRoot));

  // server/jvm/genesis-dictionary-cache -> server/jvm/${appName}-dictionary-cache
  [
    'genesis-dictionary-cache',
    'genesis-config',
    'genesis-deploy',
    'genesis-distribution',
    'genesis-eventhandler',
    'genesis-messages',
    'genesis-script-config',
    'genesis-site-specific'
  ].forEach(folder => rename(folder, folder.replace(placeholder, appName), serverJvmRoot));
};
