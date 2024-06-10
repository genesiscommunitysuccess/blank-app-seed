const { frameworkValidator } = require('./validators');
const { parseJSONArgument, normalizeFrameworkAlias } = require('../utils');
const {
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORKS_ALIAS,
  FRAMEWORKS_LABEL_MAP,
  TEXTS,
} = require('../static');

const defaultRoutes = [{ name: 'home' }];
const parseRoutes = parseJSONArgument('routes', defaultRoutes);

const defaultUI = {};
const parseUI = parseJSONArgument('ui', defaultUI);

const selectedFrameworkInfo = (framework) => {
  if (framework && frameworkValidator(framework) === true) {
    console.log(
      `${TEXTS.MESSAGE_UI_FRAMEWORK}: ${FRAMEWORKS_LABEL_MAP.get(normalizeFrameworkAlias(framework))}`,
    );
  }
};

module.exports = async (inquirer, prevAns = {}) => {
  selectedFrameworkInfo(prevAns.framework);

  const {
    framework = prevAns.framework,
    ui = prevAns.ui,
    routes = prevAns.routes,
  } = await inquirer.prompt([
    {
      name: 'framework',
      type: 'list',
      choices: FRAMEWORKS_ALIAS.map((value) => ({
        name: FRAMEWORKS_LABEL_MAP.get(value),
        value,
      })),
      message: TEXTS.MESSAGE_UI_FRAMEWORK,
      when: prevAns.framework === undefined,
      validate: frameworkValidator,
      default: FRAMEWORK_WEB_COMPONENTS_ALIAS,
    },
    {
      name: 'ui',
      type: 'input',
      message: TEXTS.MESSAGE_UI_CONFIG,
      when: !prevAns.ui,
      default: JSON.stringify(defaultUI),
    },
    {
      name: 'routes',
      type: 'input',
      message: TEXTS.MESSAGE_UI_ROTUES,
      when: !prevAns.routes,
      default: JSON.stringify(defaultRoutes),
    },
  ]);

  return {
    routes: parseRoutes(routes),
    ui: parseUI(ui),
    framework: normalizeFrameworkAlias(framework),
  };
};
