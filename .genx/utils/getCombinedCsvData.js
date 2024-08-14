const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

function csvToObject(csv) {
  const lines = csv
    .split('\n')
    .map((x) => x.replaceAll('"', ''))
    .filter((line) => line.trim() !== '');
  const fieldsRow = lines[0].split(',').map((field) => field.trim());
  const fields = fieldsRow.map((field, index) => ({
    name: field.toUpperCase(),
    isLast: index === fieldsRow.length - 1,
  }));

  const data = lines.slice(1).map((line) => {
    const rows = line.split(',').map((value, index) => ({
      name: value.trim(),
      isLast: index === fieldsRow.length - 1,
    }));
    return { rows };
  });

  return { fields, data };
}

const prepareCsvData = (entity) => {
  if (!entity.data?.length) return null;

  const data = entity.data.map((rows) => ({
    rows: rows?.map((x, index) => ({
      name: x,
      isLast: index === rows.length - 1,
    })),
  }));

  return data;
};

const getCombinedCsvData = (entity) => {
  let csvFile;
  const combinedCsv = {
    name: entity.name.toUpperCase(),
    fields: entity.fields?.map((field, index) => ({
      name: field.toUpperCase(),
      isLast: index === entity.fields.length - 1,
    })),
    data: prepareCsvData(entity),
  };

  if (entity.mode?.toLowerCase() === 'append') {
    const path = resolve(
      __dirname,
      `../../server/{{appName}}-app/src/main/genesis/data/${entity.name}.csv`,
    );

    try {
      csvFile = readFileSync(path, 'utf8');
    } catch {
      console.log('File to append not found - creating a new CSV file');
    }

    if (csvFile) {
      const existingCsv = csvToObject(csvFile);
      combinedCsv.fields = existingCsv.fields;
      combinedCsv.data = [...existingCsv.data, ...prepareCsvData(entity)];
    }
  }

  return combinedCsv;
};

module.exports = getCombinedCsvData;
