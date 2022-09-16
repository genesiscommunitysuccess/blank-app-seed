const path = require('path');

/**
 * Please DO NOT edit this. It is used by the foundation-cli to configure the seed and is maintained by the core team.
 *
 * TODO: Capture API_HOST / apiHost in the CLI, apply it to the cross-env scripts
 */
const configure = async (data, utils) => {
  const {directory, pkgScope, pkgName} = data;
  const {editJSONFile, replaceObjectKeys, writeFileWithData} = utils;

  const lernaFile = editJSONFile(`${directory}/lerna.json`);
  const rootPackageFile = editJSONFile(`${directory}/package.json`);
  const rootTSConfigFile = editJSONFile(`${directory}/tsconfig.json`);
  const currentPackages = lernaFile.get('packages');
  const scripts = rootPackageFile.get('scripts');

  rootPackageFile.set('name', `@${pkgScope}/${pkgName}`);

  /**
   * Sub packages
   */
  const prefixTarget = 'pkgScope/';
  const prefixReplacement = `${pkgScope}/${pkgName}-`;
  const updatePackage = (file) => {
    const packageFile = editJSONFile(file);
    const packageName = packageFile.get('name');
    packageFile.set('name', packageName.replace(prefixTarget, prefixReplacement));
    packageFile.set('dependencies', replaceObjectKeys(packageFile.get('dependencies'), prefixTarget, prefixReplacement));
    packageFile.save();
  };

  updatePackage(`${directory}/packages/apps/positions/package.json`);
  updatePackage(`${directory}/packages/components/package.json`);
  updatePackage(`${directory}/packages/services/package.json`);
  updatePackage(`${directory}/packages/utils/package.json`);

  writeFileWithData(path.resolve(directory, 'README.md'), data);
  writeFileWithData(path.resolve(directory, 'packages/README.md'), data);

  const tsPathKey = 'compilerOptions.paths';
  rootTSConfigFile.set(tsPathKey, replaceObjectKeys(rootTSConfigFile.get(tsPathKey), prefixTarget, prefixReplacement));

  // /* Add Packages to Lerna */
  // lernaFile.set('packages', [...currentPackages, pkgName]);
  // lernaFile.set('version', 'independent');

  // /* Add NPM Scripts start/test/build/deploy script to root package */
  scripts[`app:positions`] = `npm run baseline && npx lerna run --scope @${prefixReplacement}app --parallel dev`;
  // scripts[`build:${pkgName}`] = `lerna exec --scope @${pkgScope}/${pkgName} npm run build`;
  // scripts[`start:${pkgName}`] = `lerna exec --scope @${pkgScope}/${pkgName} npm start`;
  // scripts[`test:${pkgName}`] = `lerna exec --scope @${pkgScope}/${pkgName} npm test`;
  rootPackageFile.set('scripts', scripts);

  lernaFile.save();
  rootPackageFile.save();
  rootTSConfigFile.save();
};

module.exports = {
  configure,
};
