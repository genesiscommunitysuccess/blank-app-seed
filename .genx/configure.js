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
  // If designTokens provided as JSON, write it into the template prior to copy
  console.log('DEBUG: designTokens check:', {
    hasDesignTokens: !!data.designTokens,
    designTokensKeys: data.designTokens ? Object.keys(data.designTokens) : [],
    designTokensLength: data.designTokens ? Object.keys(data.designTokens).length : 0
  });
  
  if (data.designTokens && Object.keys(data.designTokens).length > 0) {
    try {
      const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
      // Write relative to CWD (extracted seed directory)
      const templateTargetFile = `${DIR_CLIENT_TEMP_ALIAS}/${frameworkDir}/src/styles/design-tokens.json`;
      
      console.log('DEBUG: Writing designTokens:', {
        cwd: process.cwd(),
        templateTargetFile,
        frameworkDir
      });
      
      const templateTargetDir = path.dirname(templateTargetFile);
      if (!fs.existsSync(templateTargetDir)) {
        console.log('DEBUG: Creating template target directory:', templateTargetDir);
        fs.mkdirSync(templateTargetDir, { recursive: true });
      }
      
      const jsonContent = JSON.stringify(data.designTokens, null, 2);
      console.log('DEBUG: Writing designTokens JSON (first 200 chars):', jsonContent.substring(0, 200));
      
      fs.writeFileSync(templateTargetFile, jsonContent);
      console.log('DEBUG: Successfully wrote designTokens to template');
    } catch (err) {
      console.warn('Failed to write designTokens:', err?.message || err);
    }
  } else {
    console.log('DEBUG: No designTokens provided or empty object, skipping write');
  }
  excludeFrameworks(data.framework);

  data.routes.forEach((route) => {
    generateRoute(route, utils, data.framework);
  });

  data.csv
    .map((entity) => getCombinedCsvData(entity))
    .forEach((entity) => {
      generateCsv(entity, utils);
    });


  if (data.excludeGradleWrapper) {
    deleteGradleWrappers();
  }
};
