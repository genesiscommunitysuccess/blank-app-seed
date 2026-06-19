const formatJSONValue = (value, prettyPrint = true) => {
  try {
    // Conditionally choose the number of spaces based on prettyPrint flag
    return value ? JSON.stringify(value, null, prettyPrint ? 2 : 0) : undefined;
  } catch (e) {
    console.warn('Could not serialise value to JSON', value, e);
  }
};

module.exports = formatJSONValue;

