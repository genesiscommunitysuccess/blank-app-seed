const { resolve } = require('node:path');

const generateEmptyCsv = (entity, appName, { writeFileWithData }) => {
  writeFileWithData(
    resolve(
      __dirname,
      `../server/{{appName}}-app/src/main/genesis/data/${entity.name}.csv`,
    ),
    { entity },
    resolve(__dirname, 'templates/csv.hbs'),
  );
};

module.exports = generateEmptyCsv;
