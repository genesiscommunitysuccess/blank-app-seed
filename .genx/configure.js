const versions = require('./versions.json');
const path = require('path');
const fs = require('fs');
const directoryExists = (directory) => fs.existsSync(directory);

const makeDirectory = (directory) => {
  if (!directoryExists(directory)) {
    fs.mkdirSync(directory);
  }
};
/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  // populate additional data fields
  data.pkgName = data.appName.replace(/[\W_]/g, '');
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace("-", "_");
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;
  // to be exposed via user prompt in the future
  data.useDocker = !!process.env.USE_DOCKER;
  data.routes.forEach(route => {
    // utils.makeDirectory(path.resolve(data.directory,`client/src/routes/${route}`))
    makeDirectory(path.resolve(data.directory,`client/src/routes/${route}`));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${route}/${route}.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.hbs'));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${route}/${route}.template.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.template.hbs'));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${route}/${route}.styles.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.styles.hbs'));
  })

};
