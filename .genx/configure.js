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
  // If designTokens provided as JSON, we'll write it after interpolation
  console.log('DEBUG: designTokens check:', {
    hasDesignTokens: !!data.designTokens,
    designTokensKeys: data.designTokens ? Object.keys(data.designTokens) : [],
    designTokensLength: data.designTokens ? Object.keys(data.designTokens).length : 0
  });
  excludeFrameworks(data.framework);
  
  // Write custom design tokens to final client directory if provided
  if (data.designTokens && Object.keys(data.designTokens).length > 0) {
    try {
      const finalClientFile = `${DIR_CLIENT_MAIN_ALIAS}/src/styles/design-tokens.json`;
      console.log('DEBUG: Writing designTokens to final client directory:', {
        finalClientFile,
        cwd: process.cwd()
      });
      
      const jsonContent = JSON.stringify(data.designTokens, null, 2);
      console.log('DEBUG: Writing designTokens JSON (first 200 chars):', jsonContent.substring(0, 200));
      
      // Ensure directory exists
      const finalClientDir = path.dirname(finalClientFile);
      if (!fs.existsSync(finalClientDir)) {
        console.log('DEBUG: Creating final client directory:', finalClientDir);
        fs.mkdirSync(finalClientDir, { recursive: true });
      }
      
      fs.writeFileSync(finalClientFile, jsonContent);
      console.log('DEBUG: Successfully wrote designTokens to final client file');
      
      // Verify the write
      if (fs.existsSync(finalClientFile)) {
        const writtenContent = fs.readFileSync(finalClientFile, 'utf8');
        const parsed = JSON.parse(writtenContent);
        const luminance = parsed?.design_tokens?.mode?.luminance?.$value;
        console.log('DEBUG: Final luminance value after write:', luminance);
      }
    } catch (err) {
      console.warn('Failed to write designTokens to final client:', err?.message || err);
    }
  }

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
