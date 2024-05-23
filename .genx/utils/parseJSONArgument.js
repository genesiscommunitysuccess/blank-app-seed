const parseJSONArgument = (name, defaultValue) => (value) => {
  if (!value) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error parsing "${name}" parameter as JSON:`, error.message);
    return defaultValue;
  }
};

module.exports = parseJSONArgument;
