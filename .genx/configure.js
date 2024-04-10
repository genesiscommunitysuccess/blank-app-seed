const versions = require('./versions.json');
const { registerPartials, generateRoute, generateEmptyCsv } = require('./utils');

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

  data.csv
    .map(entity => ({
      name: entity.name.toUpperCase(),
      fields: entity.fields.map( (field, index) => ({name: field.toUpperCase(), isLast: index === (entity.fields.length -1) }))
    }))
    .forEach(entity => {
      generateEmptyCsv(entity, data.appName, utils);
    });

};
