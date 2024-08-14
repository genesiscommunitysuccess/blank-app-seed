const { FRAMEWORKS_ALIAS } = require('../static');
const normalizeFrameworkAlias = require('./normalizeFrameworkAlias');
const isString = require('./isString');

const validateFrameworkAlias = (alias) => {
  if (!isString(alias)) {
    return false;
  }

  return FRAMEWORKS_ALIAS.includes(normalizeFrameworkAlias(alias));
};

module.exports = validateFrameworkAlias;
