const normalizeFrameworkAlias = (source) => {
  // Normalize the strings: remove spaces and convert to lowercase
  return source.replace(/\s+/g, '').toLowerCase();
};

module.exports = normalizeFrameworkAlias;
