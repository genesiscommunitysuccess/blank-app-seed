const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');
const {
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  DIR_TEMPLATE_BY_FRAMEWORK,
} = require('../static');

const getPathByFramework = {
  [FRAMEWORK_WEB_COMPONENTS_ALIAS]: {
    clientSrcPath: `../../client/src/routes`,
    route: (clientSrcPath, routeName) => `${clientSrcPath}/${routeName}`,
    component: (routeDir, routeName) => `${routeDir}/${routeName}.ts`,
    template: (routeDir, routeName) => `${routeDir}/${routeName}.template.ts`,
    style: (routePath, routeName) => `${routePath}/${routeName}.styles.ts`,
  },
  [FRAMEWORK_ANGULAR_ALIAS]: {
    clientSrcPath: `../../client/src/app/pages`,
    route: (clientSrcPath, routeName) => `${clientSrcPath}/${routeName}`,
    component: (routeDir, routeName) => `${routeDir}/${routeName}.component.ts`,
    template: (routeDir, routeName) => `${routeDir}/${routeName}.component.html`,
    style: (routePath, routeName) => `${routePath}/${routeName}.component.css`,
  },
}

const generateRoute = (route, { changeCase, writeFileWithData }, framework) => {
  const routeName = changeCase.paramCase(route.name);
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;
  const { 
    clientSrcPath,
    route: getRouteDir,
    component: getComponentTarget,
    template: getTemplateTarget,
    style: getStyleTarget,
  } = getPathByFramework[framework];
  const routeDir = getRouteDir(clientSrcPath, routeName);

  const filesToWrite = [
    { source: `${sourceTemplateDir}/route.hbs`, target: getComponentTarget(routeDir, routeName) },
    { source: `${sourceTemplateDir}/route.template.hbs`, target: getTemplateTarget(routeDir, routeName) },
    { source: `${sourceTemplateDir}/route.styles.hbs`, target:  getStyleTarget(routeDir, routeName) },
  ]

  makeDirectory(resolve(__dirname, routeDir));
  filesToWrite.forEach(({ source, target }) => {
    writeFileWithData(
      resolve(__dirname, target),
      { route },
      resolve(__dirname, source),
    );
  });
}

module.exports = generateRoute;