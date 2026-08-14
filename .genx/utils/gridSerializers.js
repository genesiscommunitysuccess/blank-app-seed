const formatJSONValue = require('./formatJSONValue');

// Emit single-quoted string literals so generated code matches oxfmt (singleQuote: true);
// JSON.stringify would emit double quotes and fail `oxfmt --check` out of the box.
const serialiseFunctionArg = (arg) =>
  typeof arg === 'string'
    ? `'${arg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
    : JSON.stringify(arg);

function gridColumnsSerializer(columns, indent = 0) {
  if (!columns) return undefined;

  try {
    const pad = ' '.repeat(indent);
    const itemPad = ' '.repeat(indent + 2);
    const items = columns.map((column) => {
      const fields = Object.entries(column)
        .map(([k, v]) => {
          if (v?.type === 'function' || v?.type === 'valueFormatter') {
            const args = v.arguments?.map(serialiseFunctionArg).join(', ');
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
        const args = value.arguments?.map(serialiseFunctionArg).join(', ');
        fields += `${itemPad}${key}: ${value.name}(${args}),\n`;
      } else if (value?.category === 'fdc3') {
        // FDC3 click markers are authored as { category: 'fdc3', channelName, type } and are
        // detected by formatRouteData (FDC3EventHandlersEnabled). AG Grid handlers such as
        // onRowClicked must be functions, so emit the sendEventOnChannel factory call that the
        // generated src/utils/fdc3.ts provides instead of leaking the raw marker object.
        const args = [value.channelName, value.type].map(serialiseFunctionArg).join(', ');
        // prettier-ignore pin: channel/type are user data, so the emitted call can exceed the
        // print width; the pin keeps the single-line form stable either way.
        fields += `${itemPad}// prettier-ignore\n${itemPad}${key}: sendEventOnChannel(${args}),\n`;
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
