const {rootPath} = require('./utils');

module.exports = {
  root: rootPath('client'),
  web: rootPath('client/web'),
  components: rootPath('client/web/src/components'),
  designSystem: rootPath('client/web/src/design-system'),
  services: rootPath('client/web/src/services'),
  utils: rootPath('client/web/src/utils'),
}
