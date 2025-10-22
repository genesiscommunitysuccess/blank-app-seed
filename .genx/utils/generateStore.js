const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');
const {
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  FRAMEWORK_REACT_ALIAS,
  DIR_TEMPLATE_BY_FRAMEWORK,
} = require('../static');

const getStorePathByFramework = (framework) => {
  if (framework === FRAMEWORK_WEB_COMPONENTS_ALIAS) {
    return `../../client/src/store/store.ts`;
  }
  if (framework === FRAMEWORK_REACT_ALIAS) {
    return `../../client/src/store/store.ts`;
  }
  if (framework === FRAMEWORK_ANGULAR_ALIAS) {
    return `../../client/src/app/store/store.ts`;
  }
  return null;
};

const aggregateFromRoutes = (routes = []) => {
  const aggregation = routes.reduce(
    (acc, route) => {
      const routeEvents = Array.from(
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

      const routeListeners = (route.tiles || [])
        .filter((t) => t.config?.eventing?.listener)
        .map((t) => ({
          tileName: t.title,
          eventName: t.config.eventing.listener.eventName,
          mappings: t.config.eventing.listener.mappings || [],
        }));

      const routeLayoutComponents = (route.tiles || [])
        .map((t) => ({
          componentName: `${route.name}-${t.title.replace(/[^0-9a-z]/gi, '')}-${t.componentType}`,
        }));

      acc.events = Array.from(new Set(acc.events.concat(routeEvents)));
      acc.listeners = acc.listeners.concat(routeListeners);
      acc.layoutComponents = acc.layoutComponents.concat(routeLayoutComponents);
      return acc;
    },
    { events: [], listeners: [], layoutComponents: [] },
  );

  return aggregation;
};

const generateStore = (routesOrAggregation, { writeFileWithData }, framework) => {
  const { events = [], listeners = [], layoutComponents = [] } = Array.isArray(routesOrAggregation)
    ? aggregateFromRoutes(routesOrAggregation)
    : (routesOrAggregation || {});
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;
  const storeTemplate = `${sourceTemplateDir}/store.hbs`;
  const sliceTemplate = `${sourceTemplateDir}/slices/eventing.slice.hbs`;

  const storeTargetRelative = getStorePathByFramework(framework);
  if (!storeTargetRelative) return;

  const storeTarget = resolve(__dirname, storeTargetRelative);

  // Ensure target directories exist
  makeDirectory(resolve(__dirname, storeTarget.replace(/\/store\.ts$/, '')));

  // Write store.ts
  writeFileWithData(
    storeTarget,
    { events, listeners, layoutComponents },
    resolve(__dirname, storeTemplate),
  );

  // Write slices/eventing.slice.ts next to store for all frameworks
  const sliceTarget = storeTarget.replace(/store\.ts$/, 'slices/eventing.slice.ts');
  makeDirectory(resolve(__dirname, sliceTarget.replace(/\/slices\/eventing\.slice\.ts$/, '/slices')));
  writeFileWithData(
    sliceTarget,
    { events, listeners },
    resolve(__dirname, sliceTemplate),
  );
};

module.exports = generateStore;


