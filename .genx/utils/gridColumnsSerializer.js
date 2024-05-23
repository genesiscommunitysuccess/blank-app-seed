const gridOptionsSerializer = require('./gridOptionsSerializer');

const gridColumnsSerializer = (columns, pad = '      ') => {
  if (!columns) {
    return undefined;
  }
  try {
    const columnsSerialized = columns.map((column) => gridOptionsSerializer(column));
    return `[\n${pad}${columnsSerialized}]`;
  } catch (e) {
    return undefined;
  }
};

module.exports = gridColumnsSerializer;
