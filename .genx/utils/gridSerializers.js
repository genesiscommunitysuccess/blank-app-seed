const formatJSONValue = require('./formatJSONValue');

function gridColumnsSerializer(columns, indent = 0) {
  if (!columns) return undefined;

  try {
    const pad = ' '.repeat(indent);
    const itemPad = ' '.repeat(indent + 2);
    const items = columns.map((column) => {
      const fields = Object.entries(column)
        .map(([k, v]) => {
          if (v?.type === 'function' || v?.type === 'valueFormatter') {
            const args = v.arguments?.map(JSON.stringify).join(', ');
            return `${itemPad}  ${k}: ${v.name}(${args}),`;
          }
          if (k === 'hide') return `${itemPad}  ${k}: ${v},`;
          return `${itemPad}  ${k}: ${formatJSONValue(v, indent + 4)},`;
        })
        .join('\n');
      return `${itemPad}{\n${fields}\n${itemPad}}`;
    });
    return `[\n${items.join(',\n')},\n${pad}]`;
  } catch (e) {
    console.error('Error serializing grid columns:', e.message);
    throw e;
  }
}

function gridOptionsSerializer(options, indent = 0) {
  if (!options) return undefined;

  try {
    const pad = ' '.repeat(indent);
    const itemPad = ' '.repeat(indent + 2);
    let fields = '';
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'columns') {
        fields += `${itemPad}columnDefs: ${gridColumnsSerializer(value, indent + 2)},\n`;
      } else if (value?.type === 'function' || value?.type === 'valueFormatter') {
        const args = value.arguments?.map(JSON.stringify).join(', ');
        fields += `${itemPad}${key}: ${value.name}(${args}),\n`;
      } else if (key === 'hide') {
        fields += `${itemPad}${key}: ${value},\n`;
      } else {
        fields += `${itemPad}${key}: ${formatJSONValue(value, indent + 2)},\n`;
      }
    });
    return `{\n${fields}${pad}}`;
  } catch (e) {
    console.error('Error serializing grid options:', e.message);
    throw e;
  }
}

module.exports = { gridColumnsSerializer, gridOptionsSerializer };
