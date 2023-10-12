const versions = require('./versions.json');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  // populate additional data fields
  data.pkgName = data.appName.replace(/[\W_]/g, '');
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace("-", "_");
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;
  // to be exposed via user prompt in the future
  data.useDocker = !!process.env.USE_DOCKER;
};
