const path = require('path');
const answers = require('./answers');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 *
 * See here for up-to-date interface:
 * https://github.com/genesislcap/foundation-ui/tree/master/packages/tooling/foundation-cli/src/utils
 *
 * Example:
 *
 * interface SeedConfigurationUtils {
 *    plop: NodePlopAPI;
 *    progressSpinner: Ora;
 *    editJSONFile(path: string, options: any);
 *    readFile(file: PathOrFileDescriptor): string;
 *    writeFile(file: PathOrFileDescriptor, data: string): void;
 *    writeFileWithData(file: PathOrFileDescriptor, answers: inquirer.Answers): void;
 *    copyFiles(source: string, destination: string, options: CopyOptionsSync): void;
 *    copyFilesAsync(source: string, destination: string, options: CopyOptionsSync): Promise<void>;
 *    replaceObjectKeys(input: object, searchValue: string | RegExp, replaceValue: string): object;
 *    directoryExists(directory: PathLike): boolean;
 *    makeDirectory(directory: PathLike): void;
 * }
 */
module.exports = async (data, utils) => {
  const {directory, pkgScope, pkgName, apiHost} = data;
  const {editJSONFile, replaceObjectKeys, writeFileWithData} = utils;
  const prefixTarget = 'pkgScope/pkgName';
  const prefixReplacement = `${pkgScope}/${pkgName}-`;
  data.localGenId = data.appName.toUpperCase().replace("-", "_");

  /**
   * Write answers data for future use by the CLI
   */
  answers.write(data);

  /**
   * Update the client root package.json file
   */
  const rootPackageFile = editJSONFile(`${directory}/client/package.json`);
  rootPackageFile.set('name', `@${prefixReplacement}root`);
  const scripts = rootPackageFile.get('scripts');
  scripts[`client:web`] = `npm run baseline && npx lerna run --scope @${prefixReplacement}web-client --parallel dev`;
  scripts[`copy-files:web`] = `npx lerna run --scope @${prefixReplacement}web-client copy-files`;
  scripts[`serve:web`] = `npx lerna run --scope @${prefixReplacement}web-client serve`;
  rootPackageFile.set('scripts', scripts);
  rootPackageFile.save();

  /**
   * Update the client root .npmrc file
   */
  writeFileWithData(path.resolve(directory, 'client/.npmrc'), data, path.resolve(directory, '.genx/plop/templates/.npmrc.hbs'));

  /**
   * Update the README.md files
   * TODO: Create handlebar templates for the README.md files in ./plop/templates due to re-configure re-runs
   */
  writeFileWithData(path.resolve(directory, 'README.md'), data);

  /**
   * Update the names and dependencies of the lerna managed packages
   */
  const updateLernaPackage = (file) => {
    const packageFile = editJSONFile(file);
    const packageName = packageFile.get('name');
    packageFile.set('name', packageName.replace(`${prefixTarget}-`, prefixReplacement));
    // packageFile.set('dependencies', replaceObjectKeys(packageFile.get('dependencies'), `${prefixTarget}-`, prefixReplacement));
    packageFile.save();
  };
  updateLernaPackage(`${directory}/client/web/package.json`);

  /**
   * Set apiHost in the web client
   */
  const webPackageFile = editJSONFile(`${directory}/client/web/package.json`);
  webPackageFile.set('config.API_HOST', apiHost);
  webPackageFile.save();

  /**
   * TODO: Create handlebar templates for README.md files in ./plop/templates due to re-configure re-runs
   * We should inspect the seed type in data / answers and use the correct README, for example a local seed won't need
   * the upstream instructions.
   */

  /**
   * TODO: Perhaps delete unrequested parts of this project, server variants, clients etc. Lift directories up.
   */

  /**
   * Configuring server projects
   */
   writeFileWithData(path.resolve(directory, "settings.gradle.kts"), data);
   writeFileWithData(path.resolve(directory, "docker-compose.yml"), data);

  const serverJvmRoot = path.resolve(directory, "server", "jvm");
  const appNamePlaceholder = "genesis";

  utils.listAllFiles(serverJvmRoot, toFilter => {
    return !toFilter.path.endsWith(".jar")
  }).forEach(filteredPath => {
    writeFileWithData(filteredPath, data);
  });

  const dictionaryConfigFolder = path.resolve(serverJvmRoot, "genesis-config", "src", "main", "resources", "cfg");
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-fields-dictionary.kts"), path.resolve(dictionaryConfigFolder, `${data.appName}-fields-dictionary.kts`));
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-tables-dictionary.kts"), path.resolve(dictionaryConfigFolder, `${data.appName}-tables-dictionary.kts`));
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-view-dictionary.kts"), path.resolve(dictionaryConfigFolder, `${data.appName}-view-dictionary.kts`));
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-system-definition.kts"), path.resolve(dictionaryConfigFolder, `${data.appName}-system-definition.kts`));
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-processes.xml"), path.resolve(dictionaryConfigFolder, `${data.appName}-processes.xml`));
  utils.rename(path.resolve(dictionaryConfigFolder, "genesis-service-definitions.xml"), path.resolve(dictionaryConfigFolder, `${data.appName}-service-definitions.xml`));

  const scriptConfigFolder = path.resolve(serverJvmRoot, "genesis-script-config", "src", "main", "resources", "scripts");
  utils.rename(path.resolve(scriptConfigFolder, "genesis-dataserver.kts"), path.resolve(scriptConfigFolder, `${data.appName}-dataserver.kts`));
  utils.rename(path.resolve(scriptConfigFolder, "genesis-eventhandler.kts"), path.resolve(scriptConfigFolder, `${data.appName}-eventhandler.kts`));
  utils.rename(path.resolve(scriptConfigFolder, "genesis-reqrep.kts"), path.resolve(scriptConfigFolder, `${data.appName}-reqrep.kts`));

  [
    'genesis-dictionary-cache',
    'genesis-config',
    'genesis-deploy',
    'genesis-distribution',
    'genesis-eventhandler',
    'genesis-messages',
    'genesis-script-config',
    'genesis-site-specific'
  ].forEach(projectName => {
    utils.rename(path.resolve(serverJvmRoot, projectName), path.resolve(serverJvmRoot, projectName.replace(appNamePlaceholder, data.appName)));
  })
};
