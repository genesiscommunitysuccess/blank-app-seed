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
      const clientTmpDir = DIRS_MAP.get(DIR_CLIENT_TEMP_ALIAS);
      const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
      const templateTargetFile = path.join(
        clientTmpDir,
        frameworkDir,
        'src',
        'styles',
        'design-tokens.json',
      );
      
      console.log('DEBUG: Pre-rename designTokens write:', {
        clientTmpDir,
        frameworkDir,
        templateTargetFile,
        fileExists: fs.existsSync(templateTargetFile)
      });
      
      const templateTargetDir = path.dirname(templateTargetFile);
      if (!fs.existsSync(templateTargetDir)) {
        console.log('DEBUG: Creating template target directory:', templateTargetDir);
        fs.mkdirSync(templateTargetDir, { recursive: true });
      }
      
      const jsonContent = JSON.stringify(data.designTokens, null, 2);
      console.log('DEBUG: Writing designTokens JSON (first 200 chars):', jsonContent.substring(0, 200));
      
      fs.writeFileSync(templateTargetFile, jsonContent);
      console.log('DEBUG: Successfully wrote designTokens to template file');
    } catch (err) {
      // Leave default file if any error occurs (fallback will run later)
      console.warn('Failed to pre-apply custom designTokens. Error:', err?.message || err);
    }
  } else {
    console.log('DEBUG: No designTokens provided or empty object, skipping pre-rename write');
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

  // Fallback: ensure final client file is set if pre-rename write failed
  if (data.designTokens && Object.keys(data.designTokens).length > 0) {
    try {
      const clientDir = DIRS_MAP.get(DIR_CLIENT_MAIN_ALIAS);
      const finalTargetFile = path.join(
        clientDir,
        'src',
        'styles',
        'design-tokens.json',
      );
      
      console.log('DEBUG: Fallback designTokens write:', {
        clientDir,
        finalTargetFile,
        fileExists: fs.existsSync(finalTargetFile)
      });
      
      if (!fs.existsSync(finalTargetFile)) {
        console.log('DEBUG: Final target file does not exist, creating it');
        const finalTargetDir = path.dirname(finalTargetFile);
        if (!fs.existsSync(finalTargetDir)) {
          console.log('DEBUG: Creating final target directory:', finalTargetDir);
          fs.mkdirSync(finalTargetDir, { recursive: true });
        }
        fs.writeFileSync(
          finalTargetFile,
          JSON.stringify(data.designTokens, null, 2),
        );
        console.log('DEBUG: Successfully wrote designTokens to final client file');
      } else {
        console.log('DEBUG: Final target file already exists, skipping fallback write');
      }
    } catch (err) {
      console.warn('Fallback designTokens write failed. Error:', err?.message || err);
    }
  } else {
    console.log('DEBUG: No designTokens for fallback write, skipping');
  }

  if (data.excludeGradleWrapper) {
    deleteGradleWrappers();
  }
};
