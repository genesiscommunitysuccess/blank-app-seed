const {parseJSONArgument} = require('../utils');
const {FRAMEWORKS, WEB_COMPONENTS} = require('../static');

const defaultRoutes = [{ name: 'home' }];
const parseRoutes = parseJSONArgument('routes', defaultRoutes);
const routesIntro = () => console.log(`
  Pages to be added to the navigation header
`);

const defaultUI = {};
const parseUI = parseJSONArgument('ui', defaultUI);

module.exports = async (inquirer, prevAns = {}) => {
  routesIntro();
  const {
    routes = prevAns.routes,
    ui = prevAns.ui,
    framework = prevAns.framework,
  } = await inquirer.prompt([
    {
      name: 'routes',
      type: 'input',
      message: 'Pages config in JSON format',
      when: !prevAns.routes,
      default: JSON.stringify(defaultRoutes),
    },
    {
      name: 'ui',
      type: 'input',
      message: 'UI configuration in JSON format',
      when: !prevAns.ui,
      default: JSON.stringify(defaultUI),
    },
    {
      name: 'framework',
      type: 'list',
      choices: FRAMEWORKS,
      default: prevAns.framework || WEB_COMPONENTS,
      message: 'Framework',
      when: prevAns.framework === undefined,
    },
  ])

  return {
    routes: parseRoutes(routes),
    ui: parseUI(ui),
    framework,
  };
};
