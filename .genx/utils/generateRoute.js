const { resolve } = require('node:path');
const makeDirectory = require('./makeDirectory');

const generateRoute = (route, { writeFileWithData, changeCase }) => {
  const routeName = changeCase.paramCase(route.name);
  makeDirectory(resolve(__dirname, `../../client/src/routes/${routeName}`));
  writeFileWithData(
    resolve(__dirname, `../../client/src/routes/${routeName}/${routeName}.ts`),
    { route },
    resolve(__dirname, '../templates/route.hbs'),
  );
  writeFileWithData(
    resolve(
      __dirname,
      `../../client/src/routes/${routeName}/${routeName}.template.ts`,
    ),
    { route },
    resolve(__dirname, '../templates/route.template.hbs'),
  );
  writeFileWithData(
    resolve(
      __dirname,
      `../../client/src/routes/${routeName}/${routeName}.styles.ts`,
    ),
    { route },
    resolve(__dirname, '../templates/route.styles.hbs'),
  );
};

module.exports = generateRoute;
