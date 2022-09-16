const {camelCase} = require('camel-case');

const remoteEntryFilename = 'remoteEntry.js';

const getFederatedPkgName = (pkgName) => {
  try {
    return camelCase(pkgName.split('/').pop());
  } catch (e) {
    return pkgName;
  }
};

/**
 * TODO: Add prod version logic
 */
const getRemoteEntryUrl = (port, host = 'localhost') => `http://${host}:${port}/${remoteEntryFilename}`;
const getRemoteEntry = (name, port, host = 'localhost') => `${name}@${getRemoteEntryUrl(port, host)}`;

module.exports = {
  getFederatedPkgName,
  remoteEntryFilename,
  getRemoteEntryUrl,
  getRemoteEntry,
};
