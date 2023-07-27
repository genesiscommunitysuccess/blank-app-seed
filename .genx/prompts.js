const apiPrompts = require('./prompts/api');
const packagePrompts = require('./prompts/package');
const genesisServerPrompts = require('./prompts/server');
const {description, license, name, version} = require('./package.json');

module.exports = async (inquirer, prevAns = {}) => {
  console.log(`
  Thanks for choosing this seed:
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}`);

  const {pkgName} = await packagePrompts(inquirer, prevAns);
  const {apiHost, enableSSO} = await apiPrompts(inquirer, prevAns)
  const {groupId, applicationVersion} = await genesisServerPrompts(inquirer, prevAns);

  return {
    apiHost,
    enableSSO,
    pkgName,
    groupId,
    applicationVersion,
  };
};
