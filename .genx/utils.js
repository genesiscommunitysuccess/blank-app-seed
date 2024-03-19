const {existsSync, mkdirSync} = require('node:fs');
const { resolve } = require('node:path');

const makeDirectory = (directory) => {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
};

const registerPartials = ({ registerPartial }) => {
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

module.exports = {
  makeDirectory,
  registerPartials,
  generateRoute
};
