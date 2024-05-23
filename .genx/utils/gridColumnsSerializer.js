const gridOptionsSerializer = require('./gridOptionsSerializer');

const gridColumnsSerializer = (columns, pad = '      ') => {
  if (!columns) {
    return undefined;
  }
  try {
    const columnsSerialized = columns.map((column) =>
      gridOptionsSerializer(column),
    );
    return `[\n${pad}${columnsSerialized}]`;
  } catch {
    return undefined;
  }
};

module.exports = gridColumnsSerializer;
