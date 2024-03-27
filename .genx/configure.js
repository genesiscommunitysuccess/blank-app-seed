const versions = require('./versions.json');
const { registerPartials, generateRoute } = require('./utils');
const { resolve } = require('node:path');
const Handlebars = require("handlebars");

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

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

  data.routes.forEach(route => {
    // hack
    route.fdc3 = data.fdc3;
    generateRoute(route, utils);
  });

  if (data.fdc3ListenChannel) {
    const channelConfig = JSON.parse(data.fdc3ListenChannel);
    data.fdc3ChannelName = channelConfig.name;
    data.fdc3ChannelType = channelConfig.type;
  }

  utils.writeFileWithData(resolve(data.directory, `client/src/main/main.ts`), { data }, resolve(data.directory, '.genx/templates/main/main.hbs'));
};
