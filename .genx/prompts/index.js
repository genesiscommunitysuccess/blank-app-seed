const apiPrompts = require('./api');
const dsPrompts = require('./ds');
const packagePrompts = require('./package');
const {almostThere, inputStepThanks, seedSelection} = require('./messages');
const {argv, env} = require('../utils');
const genesisServerPrompts = require('./server')

const applyRuntimeArgs = (prevAns = {}) => {
  if (!prevAns.pkgScope) {
    prevAns.pkgScope = argv.pkgScope || env.GENESISLCAP_PKG_SCOPE;
  }
  if (!prevAns.pkgName) {
    prevAns.pkgName = argv.pkgName || env.GENESISLCAP_PKG_NAME;
  }
  if (!prevAns.dsName) {
    prevAns.dsName = argv.dsName || env.GENESISLCAP_DS_NAME;
  }
  if (!prevAns.baseDsPackage) {
    prevAns.baseDsPackage = argv.baseDsPackage || env.GENESISLCAP_BASE_DS_PACKAGE;
  }
  if (!prevAns.apiHost) {
    prevAns.apiHost = argv.apiHost || env.GENESISLCAP_API_HOST;
  }
  return prevAns;
};

module.exports = async (inquirer, prevAns = {}) => {
  prevAns = applyRuntimeArgs(prevAns);
  seedSelection();
  const {pkgScope, pkgName, workspaceName} = await packagePrompts(inquirer, prevAns);
  inputStepThanks();
  const {baseDsPackage, dsName} = await dsPrompts(inquirer, prevAns);
  almostThere();
  const {apiHost, enableSSO} = await apiPrompts(inquirer, prevAns)
  const {groupId, applicationVersion} = await genesisServerPrompts(inquirer, prevAns);

  return {
    apiHost,
    enableSSO,
    baseDsPackage,
    dsName,
    pkgScope,
    pkgName,
    groupId,
    applicationVersion,
    workspaceName,
  };
};
