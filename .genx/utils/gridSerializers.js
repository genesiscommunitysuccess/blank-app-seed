const formatJSONValue = require('./formatJSONValue');

function gridColumnsSerializer(columns, pad = '      ') {
  if (!columns) {
    return undefined;
  }

  try {
    const columnsSerialized = columns.map((column) => {
      return gridOptionsSerializer(column);
    });
    return `[\n${pad}${columnsSerialized}]`;
  } catch (e) {
    console.error('Error serializing grid columns:', e.message);
    throw e;
  }
}

function gridOptionsSerializer(options, pad = '      ') {
  if (!options) {
    return undefined;
  }

  try {
    let output = `{\n`;
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'columns') {
        output += `${pad}${'columnDefs'}: ${gridColumnsSerializer(value)},\n`;
      } else if (
        value?.type === 'function' ||
        value?.type === 'valueFormatter'
      ) {
        const args = value.arguments?.map(JSON.stringify).join(', ');
        output += `${pad}${key}: ${value.name}(${args}),\n`;
      } else if (key === 'hide') {
        output += `${pad}${key}: ${value},\n`;
      } else {
        output += `${pad}${key}: ${formatJSONValue(value)},\n`;
      }
    });
    output += `${pad}}\n`;
    return output;
  } catch (e) {
    console.error('Error serializing grid options:', e.message);
    throw e;
  }
}

module.exports = { gridColumnsSerializer, gridOptionsSerializer };
