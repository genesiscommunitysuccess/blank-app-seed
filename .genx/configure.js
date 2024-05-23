const versions = require('./versions.json');
const {
  excludeFrameworks,
  formatRouteData,
  generateRoute,
  generateEmptyCsv,
  normalizeFrameworkAlias,
  registerPartials,
  validateRoute,
  validateFrameworkAlias,
} = require('./utils');
const { FRAMEWORK_WEB_COMPONENTS_ALIAS } = require('./static');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  // populate additional data fields
  data.pkgName = data.appName.replace(/[\W_]/g, '').toLowerCase();
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace('-', '_');
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;
  data.framework = normalizeFrameworkAlias(data.framework);

  registerPartials(utils);

  data.routes = data.routes.filter(validateRoute).map(formatRouteData);
  validateFrameworkAlias(data.framework);
  const FDC3EventHandlersEnabled = data.routes.find(
    (route) => route.FDC3EventHandlersEnabled,
  );
  const FDC3ListenersEnabled = data.ui?.fdc3?.channels?.length;
  data.FDC3 = {
    includeDependencies: !!(FDC3ListenersEnabled || FDC3EventHandlersEnabled),
    channels: data.ui?.fdc3?.channels || [],
  };
  excludeFrameworks(data.framework);

  if (data.framework === FRAMEWORK_WEB_COMPONENTS_ALIAS) {
    data.routes.forEach((route) => {
      generateRoute(route, utils);
    });

    data.csv
      .map((entity) => ({
        name: entity.name.toUpperCase(),
        fields: entity.fields.map((field, index) => ({
          name: field.toUpperCase(),
          isLast: index === entity.fields.length - 1,
        })),
      }))
      .forEach((entity) => {
        generateEmptyCsv(entity, data.appName, utils);
      });
  }
};
