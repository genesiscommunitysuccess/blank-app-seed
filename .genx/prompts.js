const apiPrompts = require('./prompts/api');
const genesisServerPrompts = require('./prompts/server');
const uiPrompts = require('./prompts/ui');
const {description, license, name, version} = require('./package.json');

module.exports = async (inquirer, prevAns = {}) => {
  console.log(`
  Thanks for choosing this seed:
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}`);

  const {apiHost, enableSSO} = await apiPrompts(inquirer, prevAns)
  const {groupId, applicationVersion, enableDeployPlugin} = await genesisServerPrompts(inquirer, prevAns);
  const {routes} = await uiPrompts(inquirer, prevAns);

  return {
    apiHost,
    routes,
    enableSSO,
    groupId,
    applicationVersion,
    enableDeployPlugin,
  };
};
