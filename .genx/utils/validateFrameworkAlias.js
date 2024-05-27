const { FRAMEWORKS_ALIAS } = require('../static');
const normalizeFrameworkAlias = require('./normalizeFrameworkAlias');

const validateFrameworkAlias = (alias) => {
  return FRAMEWORKS_ALIAS.includes(normalizeFrameworkAlias(alias));
};

module.exports = validateFrameworkAlias;
