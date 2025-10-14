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
    style: (routeDir, routeName) => `${routeDir}/${routeName}.styles.ts`,
  },
  [FRAMEWORK_ANGULAR_ALIAS]: {
    clientSrcPath: `../../client/src/app/pages`,
    route: (clientSrcPath, routeName) => `${clientSrcPath}/${routeName}`,
    component: (routeDir, routeName) => `${routeDir}/${routeName}.component.ts`,
    template: (routeDir, routeName) =>
      `${routeDir}/${routeName}.component.html`,
    style: (routeDir, routeName) => `${routeDir}/${routeName}.component.css`,
  },
  [FRAMEWORK_REACT_ALIAS]: {
    clientSrcPath: `../../client/src/pages`,
    route: (clientSrcPath, routeName, changeCase) =>
      `${clientSrcPath}/${changeCase.pascalCase(routeName)}`,
    component: (routeDir, routeName, changeCase) =>
      `${routeDir}/${changeCase.pascalCase(routeName)}.tsx`,
    style: (routeDir, routeName, changeCase) =>
      `${routeDir}/${changeCase.pascalCase(routeName)}.css`,
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
  const routeDir = getRouteDir(clientSrcPath, routeName, changeCase);

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


  const events = Array.from(
    new Set(
      (route.tiles || [])
        .map((t) => t.config?.eventing?.publishEventName)
        .filter(Boolean)
        .concat(
          (route.tiles || [])
            .map((t) => t.config?.eventing?.listener?.eventName)
            .filter(Boolean),
        ),
    ),
  );

  const listeners = (route.tiles || [])
    .filter((t) => t.config?.eventing?.listener)
    .map((t) => ({
      tileName: t.title,
      eventName: t.config.eventing.listener.eventName,
      mappings: t.config.eventing.listener.mappings || [],
    }));

  const layoutComponents = (route.tiles || [])
    .map((t) => ({
      componentName: `${route.name}-${t.title.replace(/[^0-9a-z]/gi, '')}-${t.componentType}`,
    }));

  const storeTemplate = `${sourceTemplateDir}/store.hbs`;
  const sliceTemplate = `${sourceTemplateDir}/slices/eventing.slice.hbs`;

  let storeTarget;
  if (framework === FRAMEWORK_WEB_COMPONENTS_ALIAS) {
    storeTarget = resolve(
      __dirname,
      `../../client/src/store/store.ts`,
    );
  } else if (framework === FRAMEWORK_REACT_ALIAS) {
    storeTarget = resolve(
      __dirname,
      `../../client/src/store/store.ts`,
    );
  } else if (framework === FRAMEWORK_ANGULAR_ALIAS) {
    storeTarget = resolve(
      __dirname,
      `../../client/src/app/store/store.ts`,
    );
  }

  if (storeTarget) {
    // Write store.ts
    writeFileWithData(
      storeTarget,
      { events, listeners, layoutComponents },
      resolve(__dirname, storeTemplate),
    );
    // Write slices/eventing.slice.ts next to store
    const sliceTarget = storeTarget.replace(/store\.ts$/, 'slices/eventing.slice.ts');
    makeDirectory(resolve(__dirname, sliceTarget.replace(/\/slices\/eventing\.slice\.ts$/, '/slices')));
    writeFileWithData(
      sliceTarget,
      { events, listeners },
      resolve(__dirname, sliceTemplate),
    );
  }


  if (route?.tiles?.length) {
    route.tiles.forEach((tile) => {
      tile.metadata = tile.metadata || {};
      generateTile(tile, route, { changeCase, writeFileWithData }, framework);
    });
  }
}

module.exports = generateRoute;
