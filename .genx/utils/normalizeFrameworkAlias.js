const normalizeFrameworkAlias = (source) => {
  return source?.replace(/\s+/g, '').toLowerCase();
};

module.exports = normalizeFrameworkAlias;
