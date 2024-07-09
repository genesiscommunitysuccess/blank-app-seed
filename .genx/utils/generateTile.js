const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');
const {
  COMPONENT_TYPE,
  FRAMEWORK_WEB_COMPONENTS_ALIAS,
  FRAMEWORK_ANGULAR_ALIAS,
  DIR_TEMPLATE_BY_FRAMEWORK,
} = require('../static');

const getPathByFramework = {
  [FRAMEWORK_WEB_COMPONENTS_ALIAS]: {
    clientSrcPath: `../../client/src/routes`,
    route: (clientSrcPath, tileName, tileType, routeName) => `${clientSrcPath}/${routeName}/${tileName}-${tileType}`,
    index: (componentPath) => `${componentPath}/index.ts`,
    component: (componentPath, tileName) => `${componentPath}/${tileName}.ts`,
    template: (componentPath, tileName) => `${componentPath}/${tileName}.template.ts`,
    style: (componentPath, tileName) => `${componentPath}/${tileName}.styles.ts`,
    addForm: (componentPath, tileName) => `${componentPath}/${tileName}.create.form.schema.ts`,
    updateForm: (componentPath, tileName) => `${componentPath}/${tileName}.update.form.schema.ts`,
    columnDefs: (componentPath, tileName) => `${componentPath}/${tileName}.column.defs.ts`,
    gridOptions: (componentPath, tileName) => `${componentPath}/${tileName}.gridOptions.ts`,
  },
  // Placeholder for angular part
  [FRAMEWORK_ANGULAR_ALIAS]: {},
};

const getFilesToWrite = (tile, tileName, routeName, path, sourceTemplateDir) => {
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

      const routeDir = getRouteDir(clientSrcPath, tileName, tile.componentType, routeName);

      const componentIndexFile = {
        source: `${sourceTemplateDir}/component/component.index.hbs`,
        target: getComponentIndexTarget(routeDir, tileName),
      };
      
      const componentFile = {
        source: `${sourceTemplateDir}/component/component.hbs`,
        target: getComponentTarget(routeDir, tileName),
      };

      const componentTemplateFile = {
        source: `${sourceTemplateDir}/component/component.template.hbs`,
        target: getTemplateTarget(routeDir, tileName),
      };

      const componentStylesFile = {
        source: `${sourceTemplateDir}/component/component.styles.hbs`,
        target: getStyleTarget(routeDir, tileName),
      };

      const componentAddFormFile = {
        source: `${sourceTemplateDir}/component/component.create.form.hbs`,
        target: getAddFormTarget(routeDir, tileName),
      };

      const componentUpdateFormFile = {
        source: `${sourceTemplateDir}/component/component.update.form.hbs`,
        target: getUpdateFormTarget(routeDir, tileName),
      }

      const componentColumnsFile = {
        source: `${sourceTemplateDir}/component/component.column.defs.hbs`,
        target: getColumnDefsTarget(routeDir, tileName),
      };

      const componentGridOptionsFile = {
        source: `${sourceTemplateDir}/component/component.gridOptions.hbs`,
        target: getGridOptionsTarget(routeDir, tileName),
      };

      const filesToWrite = [componentIndexFile, componentFile, componentTemplateFile, componentStylesFile];
      
      switch (tile.type) {
        case 'entity-manager':
          if (tile.config?.columns) {
            filesToWrite.push(componentColumnsFile);
          }
          if (tile.config?.gridOptions) {
            filesToWrite.push(componentGridOptionsFile);
          }
          if (tile.config?.createFormUiSchema) {
             filesToWrite.push(componentAddFormFile);
          }
          if (tile.config?.updateFormUiSchema) {
            filesToWrite.push(componentUpdateFormFile);
          }
          break;
        case 'grid-pro':
          if (tile.config?.gridOptions) {
            filesToWrite.push(componentGridOptionsFile);
          }
        break;
        case 'smart-form':
          filesToWrite.push(componentAddFormFile);
          break
        default:
          break;
      }

    return filesToWrite
}

const generateTile = (tile, route, { changeCase, writeFileWithData }, framework) => {
  const tileName = changeCase.paramCase(tile.title);
  const routeName = changeCase.paramCase(route.name);
  const sourceTemplateDir = `../${DIR_TEMPLATE_BY_FRAMEWORK[framework]}`;
  const {
    clientSrcPath,
    route: getRouteDir,
  } = getPathByFramework[framework];
  const routeDir = getRouteDir(clientSrcPath, tileName, tile.componentType, routeName);

  const filesToWrite = getFilesToWrite(tile, tileName, routeName, getPathByFramework[framework], sourceTemplateDir)

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
