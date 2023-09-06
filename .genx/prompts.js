const apiPrompts = require('./prompts/api');
const genesisServerPrompts = require('./prompts/server');
const {description, license, name, version} = require('./package.json');

module.exports = async (inquirer, prevAns = {}) => {
  console.log(`
  Thanks for choosing this seed:
  Name: ${name}
  Description: ${description}
  Version: ${version}
  License: ${license}`);

  const {apiHost, enableSSO} = await apiPrompts(inquirer, prevAns)
  const {groupId, applicationVersion} = await genesisServerPrompts(inquirer, prevAns);

  // data.pkgName = appName.replace(/[\W_]/g, '');
  // data.rootElement = `${data.pkgName}-root`;
  // data.localGenId = appName.toUpperCase().replace("-", "_");
  // data.applicationVersionWeb = applicationVersion.split('-').shift();
  // data.versions = versions;
  // // to be exposed via user prompt in the future
  // data.useDocker = !!process.env.USE_DOCKER;

  return {
    apiHost,
    enableSSO,
    groupId,
    applicationVersion,
  };
};
