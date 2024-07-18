const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');
const generateTile = require('./generateTile');
const {
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  FRAMEWORK_REACT_ALIAS,
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
    template: (routeDir, routeName) =>
      `${routeDir}/${routeName}.component.html`,
    style: (routePath, routeName) => `${routePath}/${routeName}.component.css`,
  },
  [FRAMEWORK_REACT_ALIAS]: {
    clientSrcPath: `../../client/src/pages`,
    route: (clientSrcPath, routeName) => `${clientSrcPath}/${routeName}`,
    component: (routeDir, routeName, changeCase) =>
      `${routeDir}/${changeCase.pascalCase(routeName)}.jsx`,
    style: (routePath, routeName, changeCase) =>
      `${routePath}/${changeCase.pascalCase(routeName)}.css`,
  },
};

const generateRoute = (route, { changeCase, writeFileWithData }, framework) => {
  const {
    clientSrcPath,
    route: getRouteDir,
    component: getComponentTarget,
    template: getTemplateTarget,
    style: getStyleTarget,
  } = getPathByFramework[framework];
  const routeName = changeCase.paramCase(route.name);
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;
  const routeDir = getRouteDir(clientSrcPath, routeName);

  const filesToWrite = [
    {
      source: `${sourceTemplateDir}/route.hbs`,
      target: getComponentTarget(routeDir, routeName, changeCase),
    },
    {
      source: `${sourceTemplateDir}/route.styles.hbs`,
      target: getStyleTarget(routeDir, routeName, changeCase),
    },
  ];

  if (getTemplateTarget) {
    filesToWrite.push({
      source: `${sourceTemplateDir}/route.template.hbs`,
      target: getTemplateTarget(routeDir, routeName),
    });
  }

  makeDirectory(resolve(__dirname, routeDir));
  filesToWrite.forEach(({ source, target }) => {
    writeFileWithData(
      resolve(__dirname, target),
      { route },
      resolve(__dirname, source),
    );
  });

  // Remove condition after adding changes for react
  if (
    [FRAMEWORK_WEB_COMPONENTS_ALIAS, FRAMEWORK_ANGULAR_ALIAS].includes(
      framework,
    ) &&
    route?.tiles?.length
  ) {
    route.tiles.forEach((tile) => {
      generateTile(tile, route, { changeCase, writeFileWithData }, framework);
    });
  }
};

module.exports = generateRoute;
