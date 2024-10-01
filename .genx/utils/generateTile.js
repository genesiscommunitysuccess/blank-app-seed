const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');
const {
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  FRAMEWORK_REACT_ALIAS,
  DIR_TEMPLATE_BY_FRAMEWORK,
} = require('../static');

const defaultPathGetters = {
  index: (componentPath) => `${componentPath}/index.ts`,
  addForm: (componentPath, tile) =>
    `${componentPath}/${tile.name}.create.form.schema.ts`,
  updateForm: (componentPath, tile) =>
    `${componentPath}/${tile.name}.update.form.schema.ts`,
  columnDefs: (componentPath, tile) =>
    `${componentPath}/${tile.name}.column.defs.ts`,
  gridOptions: (componentPath, tile) =>
    `${componentPath}/${tile.name}.gridOptions.ts`,
};

const getPathByFramework = {
  [FRAMEWORK_WEB_COMPONENTS_ALIAS]: {
    ...defaultPathGetters,
    clientSrcPath: `../../client/src/routes`,
    route: (clientSrcPath, tile, routeName) =>
      `${clientSrcPath}/${routeName}/${tile.name}-${tile.componentType}`,
    component: (componentPath, tile) => `${componentPath}/${tile.name}.ts`,
    template: (componentPath, tile) =>
      `${componentPath}/${tile.name}.template.ts`,
    style: (componentPath, tile) => `${componentPath}/${tile.name}.styles.ts`,
  },
  [FRAMEWORK_ANGULAR_ALIAS]: {
    ...defaultPathGetters,
    clientSrcPath: `../../client/src/app/pages`,
    route: (clientSrcPath, tile, routeName) =>
      `${clientSrcPath}/${routeName}/${tile.name}-${tile.componentType}`,
    component: (componentPath, tile) =>
      `${componentPath}/${tile.name}.component.ts`,
    template: (componentPath, tile) =>
      `${componentPath}/${tile.name}.component.html`,
    style: (componentPath, tile) =>
      `${componentPath}/${tile.name}.component.css`,
  },
  [FRAMEWORK_REACT_ALIAS]: {
    ...defaultPathGetters,
    index: (componentPath) => `${componentPath}/index.tsx`,
    clientSrcPath: `../../client/src/pages`,
    route: (clientSrcPath, tile, routeName, changeCase) =>
      `${clientSrcPath}/${changeCase.pascalCase(routeName)}/${changeCase.pascalCase(tile.name)}${changeCase.pascalCase(tile.componentType)}`,
    component: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}Component.tsx`,
    style: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}Component.css`,
    addForm: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}CreateFormSchema.ts`,
    updateForm: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}UpdateFormSchema.ts`,
    columnDefs: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}ColumnDefs.ts`,
    gridOptions: (componentPath, tile, changeCase) =>
      `${componentPath}/${changeCase.pascalCase(tile.name)}GridOptions.ts`,
  },
};

const getFilesToWrite = (
  tileData,
  routeName,
  path,
  sourceTemplateDir,
  changeCase,
) => {
  const {
    clientSrcPath,
    route: getRouteDir,
    index: getComponentIndexTarget,
    component: getComponentTarget,
    template: getTemplateTarget,
    style: getStyleTarget,
    addForm: getAddFormTarget,
    updateForm: getUpdateFormTarget,
    columnDefs: getColumnDefsTarget,
    gridOptions: getGridOptionsTarget,
  } = path;

  const routeDir = getRouteDir(clientSrcPath, tileData, routeName, changeCase);

  const componentIndexFile = {
    source: `${sourceTemplateDir}/component/component.index.hbs`,
    target: getComponentIndexTarget(routeDir, tileData),
  };

  const componentFile = {
    source: `${sourceTemplateDir}/component/component.hbs`,
    target: getComponentTarget(routeDir, tileData, changeCase),
  };

  const componentStylesFile = {
    source: `${sourceTemplateDir}/component/component.styles.hbs`,
    target: getStyleTarget(routeDir, tileData, changeCase),
  };

  const componentAddFormFile = {
    source: `${sourceTemplateDir}/component/component.create.form.hbs`,
    target: getAddFormTarget(routeDir, tileData, changeCase),
  };

  const componentUpdateFormFile = {
    source: `${sourceTemplateDir}/component/component.update.form.hbs`,
    target: getUpdateFormTarget(routeDir, tileData, changeCase),
  };

  const componentColumnsFile = {
    source: `${sourceTemplateDir}/component/component.column.defs.hbs`,
    target: getColumnDefsTarget(routeDir, tileData, changeCase),
  };

  const componentGridOptionsFile = {
    source: `${sourceTemplateDir}/component/component.gridOptions.hbs`,
    target: getGridOptionsTarget(routeDir, tileData, changeCase),
  };

  const filesToWrite = [componentIndexFile, componentFile, componentStylesFile];

  if (getTemplateTarget) {
    filesToWrite.push({
      source: `${sourceTemplateDir}/component/component.template.hbs`,
      target: getTemplateTarget(routeDir, tileData),
    });
  }

  switch (tileData.type) {
    case 'entity-manager':
      if (tileData.config?.columns) {
        filesToWrite.push(componentColumnsFile);
      }
      if (tileData.config?.gridOptions) {
        filesToWrite.push(componentGridOptionsFile);
      }
      if (tileData.config?.createFormUiSchema) {
        filesToWrite.push(componentAddFormFile);
      }
      if (tileData.config?.updateFormUiSchema) {
        filesToWrite.push(componentUpdateFormFile);
      }
      break;
    case 'grid-pro':
      if (tileData.config?.gridOptions) {
        filesToWrite.push(componentGridOptionsFile);
      }
      break;
    case 'smart-form':
      filesToWrite.push(componentAddFormFile);
      break;
    default:
      break;
  }

  return filesToWrite;
};

const generateTile = (
  tile,
  route,
  { changeCase, writeFileWithData },
  framework,
) => {
  const tileData = {
    ...tile,
    name: changeCase.paramCase(tile.title),
    componentType: tile.componentType,
    config: tile.config,
  };
  const routeName = changeCase.paramCase(route.name);
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;
  const { clientSrcPath, route: getRouteDir } = getPathByFramework[framework];
  const routeDir = getRouteDir(clientSrcPath, tileData, routeName, changeCase);

  const filesToWrite = getFilesToWrite(
    tileData,
    routeName,
    getPathByFramework[framework],
    sourceTemplateDir,
    changeCase,
  );

  makeDirectory(resolve(__dirname, routeDir));
  filesToWrite.forEach(({ source, target }) => {
    writeFileWithData(
      resolve(__dirname, target),
      { tile, route },
      resolve(__dirname, source),
    );
  });
};

module.exports = generateTile;
