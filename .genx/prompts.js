const apiPrompts = require('./prompts/api');
const genesisServerPrompts = require('./prompts/server');
const uiPrompts = require('./prompts/ui');
const {
  description: packageDescription,
  license,
  name,
  version,
} = require('./package.json');

module.exports = async (inquirer, prevAns = {}) => {
  console.log(`
  Thanks for choosing this seed:
  Name: ${name}
  Description: ${packageDescription}
  Version: ${version}
  License: ${license}`);

  const { apiHost, enableSSO } = await apiPrompts(inquirer, prevAns);
  const { description, groupId, applicationVersion, enableDeployPlugin, csv } =
    await genesisServerPrompts(inquirer, prevAns);
  const { routes, ui, framework } = await uiPrompts(inquirer, prevAns);

  return {
    apiHost,
    routes,
    enableSSO,
    description,
    groupId,
    applicationVersion,
    enableDeployPlugin,
    csv,
    ui,
    framework,
  };
};
