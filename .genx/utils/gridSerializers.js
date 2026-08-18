const formatJSONValue = require('./formatJSONValue');
const toJsStringLiteral = require('./toJsStringLiteral');

const FDC3_CLICK_CATEGORY = 'fdc3';

// Emit string literals in oxfmt's own shape (singleQuote: true, with the
// quote/escape choice prettier would make); JSON.stringify would always emit
// double quotes and fail `oxfmt --check` out of the box.
const serialiseFunctionArg = (arg) =>
  typeof arg === 'string' ? toJsStringLiteral(arg) : JSON.stringify(arg);

/**
 * Serialises one `key: value` pair of a grid options object or of a column
 * definition. Shared by both serializers so the special value shapes
 * (function/valueFormatter factories, FDC3 click markers) are handled
 * identically wherever they are authored.
 *
 * @param {string} key property name
 * @param {unknown} value property value
 * @param {number} indent indentation of the emitted line
 * @returns {string} the emitted line(s), trailing comma included
 */
function serialiseEntry(key, value, indent) {
  const pad = ' '.repeat(indent);

  if (value?.type === 'function' || value?.type === 'valueFormatter') {
    const args = value.arguments?.map(serialiseFunctionArg).join(', ');
    return `${pad}${key}: ${value.name}(${args}),`;
  }

  if (value?.category === FDC3_CLICK_CATEGORY) {
    // FDC3 click markers are authored as { category: 'fdc3', channelName, type } and are
    // detected by formatRouteData (FDC3EventHandlersEnabled). AG Grid handlers such as
    // onRowClicked must be functions, so emit the sendEventOnChannel factory call that the
    // generated src/utils/fdc3.ts provides instead of leaking the raw marker object.
    const args = [value.channelName, value.type].map(serialiseFunctionArg).join(', ');
    // prettier-ignore pin: channel/type are user data, so the emitted call can exceed the
    // print width; the pin keeps the single-line form stable either way.
    return `${pad}// prettier-ignore\n${pad}${key}: sendEventOnChannel(${args}),`;
  }

  return `${pad}${key}: ${formatJSONValue(value, indent)},`;
}

function gridColumnsSerializer(columns, indent = 0) {
  if (!columns) return undefined;

  try {
    // An expanded empty array would serialise as `[\n,\n]`; emit the literal instead.
    if (!columns.length) return '[]';
    const pad = ' '.repeat(indent);
    const itemPad = ' '.repeat(indent + 2);
    const items = columns.map((column) => {
      const fields = Object.entries(column)
        .map(([k, v]) => serialiseEntry(k, v, indent + 4))
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
      } else {
        fields += `${serialiseEntry(key, value, indent + 2)}\n`;
      }
    });
    // An expanded empty object is what oxfmt collapses to `{}`; match formatTSValue.
    if (!fields) return '{}';
    return `{\n${fields}${pad}}`;
  } catch (e) {
    console.error('Error serializing grid options:', e.message);
    throw e;
  }
}

module.exports = { gridColumnsSerializer, gridOptionsSerializer };
