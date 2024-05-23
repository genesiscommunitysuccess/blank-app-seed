const formatJSONValue = (value) => {
  try {
    return value ? JSON.stringify(value, null, 2) : undefined;
  } catch (e) {
    console.warn('Could not serialise value to JSON', value, e);
  }
};

module.exports = formatJSONValue;
