const versions = require('./versions.json');
const fs = require('fs');
const path = require('path');
const {
  DIRS_MAP,
  DIR_CLIENT_MAIN_ALIAS,
  DIR_CLIENT_TEMP_ALIAS,
  FRAMEWORKS_DIR_MAP,
} = require('./static');
const {
  excludeFrameworks,
  formatRouteData,
  generateRoute,
  generateCsv,
  getCombinedCsvData,
  registerPartials,
  validateRoute,
  deleteGradleWrappers,
} = require('./utils');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  // populate additional data fields
  data.pkgName = data.appName.replace(/[\W_]/g, '').toLowerCase();
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace(/-/g, '_');
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;

  registerPartials(utils, data.framework);
  const formatRouteDataForFramework = formatRouteData.bind(
    this,
    data.framework,
  );
  data.routes = data.routes
    .filter(validateRoute)
    .map(formatRouteDataForFramework);

  const FDC3EventHandlersEnabled = data.routes.find(
    (route) => route.FDC3EventHandlersEnabled,
  );
  const FDC3ListenersEnabled = data.ui?.fdc3?.channels?.length;
  data.FDC3 = {
    includeDependencies: !!(FDC3ListenersEnabled || FDC3EventHandlersEnabled),
    channels: data.ui?.fdc3?.channels || [],
  };
  excludeFrameworks(data.framework);

  data.routes.forEach((route) => {
    generateRoute(route, utils, data.framework);
  });

  data.csv
    .map((entity) => getCombinedCsvData(entity))
    .forEach((entity) => {
      generateCsv(entity, utils);
    });

  // If designTokens provided as JSON, write it into the template prior to copy
  if (data.designTokens && Object.keys(data.designTokens).length > 0) {
    try {
      const clientTmpDir = DIRS_MAP.get(DIR_CLIENT_TEMP_ALIAS);
      const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
      const templateTargetFile = path.join(
        clientTmpDir,
        frameworkDir,
        'src',
        'styles',
        'design-tokens.json',
      );
      const templateTargetDir = path.dirname(templateTargetFile);
      if (!fs.existsSync(templateTargetDir)) {
        fs.mkdirSync(templateTargetDir, { recursive: true });
      }
      fs.writeFileSync(
        templateTargetFile,
        JSON.stringify(data.designTokens, null, 2),
      );
    } catch (err) {
      // Leave default file if any error occurs
      console.warn('Failed to apply custom designTokens. Using default file. Error:', err?.message || err);
    }
  }

  if (data.excludeGradleWrapper) {
    deleteGradleWrappers();
  }
};
