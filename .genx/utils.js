const {existsSync, mkdirSync} = require('node:fs');
const { resolve } = require('node:path');

const makeDirectory = (directory) => {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
};

const registerPartials = ({ registerPartial }) => {
  registerPartial('grid-layout', resolve(__dirname, 'templates/gridLayout.hbs'))
  registerPartial('tabs-layout', resolve(__dirname, 'templates/tabsLayout.hbs'))
  registerPartial('horizontal-layout', resolve(__dirname, 'templates/horizontalLayout.hbs'))
  registerPartial('smart-form', resolve(__dirname, 'templates/form.hbs'))
  registerPartial('chart', resolve(__dirname, 'templates/chart.hbs'))
  registerPartial('entity-manager', resolve(__dirname, 'templates/entityManager.hbs'))
  registerPartial('grid-pro', resolve(__dirname, 'templates/grid.hbs'))
};

const generateRoute = (route, { writeFileWithData, changeCase }) => {
  const routeName = changeCase.paramCase(route.name);
  makeDirectory(resolve(__dirname, `../client/src/routes/${routeName}`));
  writeFileWithData(resolve(__dirname, `../client/src/routes/${routeName}/${routeName}.ts`), {route}, resolve(__dirname, 'templates/route.hbs'));
  writeFileWithData(resolve(__dirname, `../client/src/routes/${routeName}/${routeName}.template.ts`), {route}, resolve(__dirname, 'templates/route.template.hbs'));
  writeFileWithData(resolve(__dirname, `../client/src/routes/${routeName}/${routeName}.styles.ts`), {route}, resolve(__dirname, 'templates/route.styles.hbs'));
};

const generateEmptyCsv = (entity, appName, { writeFileWithData }) => {
  writeFileWithData(resolve(__dirname, `../server/{{appName}}-app/src/main/genesis/data/${entity.name}.csv`), {entity}, resolve(__dirname, 'templates/csv.hbs'));
};

const formatJSONValue = (value) => {
  try {
    return value ? JSON.stringify(value, null, 2) : undefined;
  } catch (e) {
    console.warn('Could not serialise value to JSON', value, e);
  }
}

const gridOptionsSerializer = (options, pad = '      ') => {
  if (!options) {
    return undefined;
  }
  try {
    let output = `{\n`;
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (value?.type === 'function') {
        const args =  value.arguments?.map(JSON.stringify).join(', ');
        output += `${pad}${key}: ${value.name}(${args}),\n`;
      } else {
        output += `${pad}${key}: ${formatJSONValue(value)},\n`;
      }
    });
    output += `${pad}}\n`;
    return output;
  } catch (e) {
    return undefined;
  }
};

const validateRoute = (route) => {
  if (!route.name) {
    console.warn('Invalid route - missing name', route);
  }
  return !!route.name;
}

const formatRouteData = (route) => {
  const layoutKey = route?.layoutKey || `${route.name}_${Date.now()}`;

  const FDC3ClickCategory = 'fdc3';
  const FDC3EventHandlersEnabled = !!route.tiles?.find(t => t.config?.gridOptions?.onRowClicked?.category === FDC3ClickCategory);

  const tiles = route.tiles?.map(tile => ({
    ...tile,
    config: {
      ...(tile.config || {}),
      gridOptions: gridOptionsSerializer(tile.config?.gridOptions),
      createFormUiSchema: formatJSONValue(tile.config?.createFormUiSchema),
      updateFormUiSchema: formatJSONValue(tile.config?.updateFormUiSchema),
      uischema: formatJSONValue(tile.config?.uischema),
      columns: formatJSONValue(tile.config?.columns)
    }
  }));

  return {
    ...route,
    layoutKey,
    tiles,
    FDC3EventHandlersEnabled,
  }
};

const parseJSONArgument = (name, defaultValue) =>
  (value) => {
    if (!value){
      return defaultValue;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing "${name}" parameter as JSON:`, error.message);
      return defaultValue;
    }
  }

module.exports = {
  makeDirectory,
  registerPartials,
  generateRoute,
  validateRoute,
  generateEmptyCsv,
  formatRouteData,
  parseJSONArgument,
};
