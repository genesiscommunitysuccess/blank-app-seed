const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const formatTSValue = (value, indent = 0) => {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value.replace(/'/g, "\\'")}'`;

  const pad = ' '.repeat(indent + 2);
  const closePad = ' '.repeat(indent);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const items = value.map((v) => `${pad}${formatTSValue(v, indent + 2)}`).join(',\n');
    return `[\n${items},\n${closePad}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return '{}';
    const items = entries
      .map(([k, v]) => {
        const key = IDENTIFIER_RE.test(k) ? k : `'${k}'`;
        return `${pad}${key}: ${formatTSValue(v, indent + 2)}`;
      })
      .join(',\n');
    return `{\n${items},\n${closePad}}`;
  }

  return String(value);
};

const formatJSONValue = (value, indent = 0) => {
  try {
    return value ? formatTSValue(value, indent) : undefined;
  } catch (e) {
    console.warn('Could not serialise value to JSON', value, e);
  }
};

module.exports = formatJSONValue;
