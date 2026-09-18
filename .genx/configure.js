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
  generateStore,
  fontUtils,
  toModalThemeFormat,
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
  // AI chat — ONE gate for everything the feature emits, server and client alike.
  //
  // `data.ui` here IS the project's ui.config (the generator passes it as the `ui` argument), so the
  // block is `data.ui.ai`, not `data.ui.config.ai`: gated on the latter it would silently never
  // fire. React only, because the panel is React only, and the server endpoint follows the same
  // gate — an endpoint with no panel to call it would be a router compile risk with no user.
  const aiVendor = data.ui?.ai?.vendor === 'anthropic' ? 'anthropic' : 'gemini';
  data.AI = {
    enabled: !!data.ui?.ai?.enabled && data.framework === 'react',
    // The models the proxy lets a request ask for, by vendor — the tier table's ids (C-3).
    allowedModels:
      aiVendor === 'anthropic'
        ? 'claude-haiku-4-5-20251001,claude-sonnet-5'
        : 'gemini-3.1-flash-lite,gemini-3.8-flash',
    maxOutputTokens: 16000,
  };

  const FDC3ListenersEnabled = data.ui?.fdc3?.channels?.length;
  data.FDC3 = {
    includeDependencies: !!(FDC3ListenersEnabled || FDC3EventHandlersEnabled),
    channels: data.ui?.fdc3?.channels || [],
  };

  if (data.designTokens && Object.keys(data.designTokens).length > 0) {
    try {
      const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
      const templateFile = path.join(__dirname, '..', DIR_CLIENT_TEMP_ALIAS, frameworkDir, 'src/styles/default.theme.json');
      // Legacy designTokens payloads are converted to the modal theme format; modal payloads pass through verbatim
      const jsonContent = JSON.stringify(toModalThemeFormat(data.designTokens), null, 2);
      const templateDir = path.dirname(templateFile);
      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir, { recursive: true });
      }
      fs.writeFileSync(templateFile, `${jsonContent}\n`);
    } catch (err) {
      console.warn('Failed to write designTokens to template:', err?.message || err);
    }
  }

  // Handle header logo copy
  if (data.headerLogo && data.headerLogo.trim() !== '') {
    try {
      const sourcePath = path.resolve(data.headerLogo);
      if (!fs.existsSync(sourcePath)) {
        console.warn(`Header logo file not found: ${sourcePath}`);
      } else {
        const ext = path.extname(sourcePath);
        const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
        let targetDir;

        // Angular uses src/assets, others use public
        if (data.framework === 'angular') {
          targetDir = path.join(__dirname, '..', DIR_CLIENT_TEMP_ALIAS, frameworkDir, 'src/assets');
        } else {
          targetDir = path.join(__dirname, '..', DIR_CLIENT_TEMP_ALIAS, frameworkDir, 'public');
        }

        // Ensure target directory exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const targetPath = path.join(targetDir, `header-logo${ext}`);
        fs.copyFileSync(sourcePath, targetPath);

        // Store the logo source path for templates
        data.headerLogoSrc = `./header-logo${ext}`;

        console.log(`Header logo copied to: ${targetPath}`);
      }
    } catch (err) {
      console.warn('Failed to copy header logo:', err?.message || err);
    }
  }

  // Handle custom fonts
  if (data.customFonts && data.customFonts.trim() !== '') {
    try {
      const customFontsObj = typeof data.customFonts === 'string'
        ? JSON.parse(data.customFonts)
        : data.customFonts;

      const processedFonts = fontUtils.processFontFiles(customFontsObj);

      if (processedFonts) {
        const { fontFamily, fontData } = processedFonts;
        const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);

        // Set data immediately so templates can use it even if file copy fails
        data.fontFamily = fontFamily;
        data.fontData = fontData;

        // Determine target directory
        let targetDir;
        if (data.framework === 'angular') {
          targetDir = path.join(__dirname, '..', DIR_CLIENT_TEMP_ALIAS, frameworkDir, 'src/assets/fonts');
        } else {
          targetDir = path.join(__dirname, '..', DIR_CLIENT_TEMP_ALIAS, frameworkDir, 'public/fonts');
        }

        // Create directory
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Copy font files
        customFontsObj.files.forEach((fontPath, index) => {
          const sourcePath = path.resolve(fontPath.trim());

          if (fs.existsSync(sourcePath)) {
            const fileName = path.basename(sourcePath);
            const targetPath = path.join(targetDir, fileName);
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Font copied: ${fileName}`);
          } else {
            console.warn(`Font file not found: ${sourcePath}`);
          }
        });
      }
    } catch (err) {
      console.warn('Failed to process custom fonts:', err?.message || err);
    }
  }

  excludeFrameworks(data.framework);

  if (data.FDC3.includeDependencies) {
    const frameworkDir = FRAMEWORKS_DIR_MAP.get(data.framework);
    const utilsDir = frameworkDir === 'angular' ? 'src/app/utils' : 'src/utils';
    utils.writeFileWithData(
      path.resolve(__dirname, `../client/${utilsDir}/fdc3.ts`),
      data,
      path.resolve(__dirname, `templates/${frameworkDir}/fdc3.ts.hbs`),
    );
  }

  generateStore(data.routes, utils, data.framework);

  data.routes.forEach((route) => {
    generateRoute(route, utils, data.framework);
  });

  data.csv
    .map((entity) => getCombinedCsvData(entity))
    .forEach((entity) => {
      generateCsv(entity, utils);
    });


  // The chat proxy. It declares the AI_CHAT right but does not seed it: the project's rights files
  // belong to the generator that sends them, and a second writer here would be overwritten by the
  // csv loop above anyway (RIGHT, PROFILE and PROFILE_RIGHT arrive with no mode, so they replace).
  if (data.AI.enabled) {
    const appModule = path.resolve(__dirname, '../server/{{appName}}-app/src/main/genesis');
    utils.writeFileWithData(
      path.join(appModule, 'scripts/ai-service-web-handler.kts'),
      data,
      path.resolve(__dirname, 'templates/server/ai-service-web-handler.kts.hbs'),
    );
    utils.writeFileWithData(
      path.join(appModule, 'cfg/genesis-ai-system-definition.kts'),
      data,
      path.resolve(__dirname, 'templates/server/genesis-ai-system-definition.kts.hbs'),
    );
  }

  if (data.excludeGradleWrapper) {
    deleteGradleWrappers();
  }
};
