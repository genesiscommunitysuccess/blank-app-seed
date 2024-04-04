const versions = require('./versions.json');
const { registerPartials, generateRoute } = require('./utils');

/**
 * Signature is `async (data: inquirer.Answers, utils: SeedConfigurationUtils)`
 */
module.exports = async (data, utils) => {
  // populate additional data fields
  data.pkgName = data.appName.replace(/[\W_]/g, '').toLowerCase();
  data.rootElement = `${data.pkgName}-root`;
  data.localGenId = data.appName.toUpperCase().replace("-", "_");
  data.applicationVersionWeb = data.applicationVersion.split('-').shift();
  data.versions = versions;

  registerPartials(utils);

	data.routes
		.map((route) => ({ ...route, layoutKey: `${route.name}_${Date.now()}` }))
		.forEach((route) => {
			generateRoute(route, utils);
		});

};
