const { FRAMEWORKS_ALIAS } = require('../static');

const validateFrameworkAlias = (alias) => {
  return FRAMEWORKS_ALIAS.includes(alias);
};

module.exports = validateFrameworkAlias;
