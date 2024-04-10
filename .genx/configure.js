const versions = require('./versions.json');
const { registerPartials, generateRoute, generateEmptyCsv, formatRouteData } = require('./utils');

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

  registerPartials(utils);

  data.routes
    .forEach((route) => {
      if (!route.name) {
        console.warn('Invalid route - missing name', route);
        return;
      }
      const routeData = formatRouteData(route);
      generateRoute(routeData, utils);
    });

  data.csv
    .map(entity => ({
      name: entity.name.toUpperCase(),
      fields: entity.fields.map( (field, index) => ({name: field.toUpperCase(), isLast: index === (entity.fields.length -1) }))
    }))
    .forEach(entity => {
      generateEmptyCsv(entity, data.appName, utils);
    });
};
