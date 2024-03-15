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
  data.pkgName = data.appName.replace(/[\W_]/g, '').toLowerCase();
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace("-", "_");
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;

  utils.registerPartial('smart-form', path.resolve(data.directory, '.genx/templates/form.hbs'))
  utils.registerPartial('chart', path.resolve(data.directory, '.genx/templates/chart.hbs'))
  utils.registerPartial('entity-manager', path.resolve(data.directory, '.genx/templates/entityManager.hbs'))
  utils.registerPartial('grid-pro', path.resolve(data.directory, '.genx/templates/grid.hbs'))
  // to be exposed via user prompt in the future
  data.useDocker = !!process.env.USE_DOCKER;
  data.routes.forEach(route => {
    const routeName = route.name;
    makeDirectory(path.resolve(data.directory,`client/src/routes/${routeName}`));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${routeName}/${routeName}.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.hbs'));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${routeName}/${routeName}.template.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.template.hbs'));
    utils.writeFileWithData(path.resolve(data.directory, `client/src/routes/${routeName}/${routeName}.styles.ts`), {route}, path.resolve(data.directory, '.genx/templates/route.styles.hbs'));
  })

};
