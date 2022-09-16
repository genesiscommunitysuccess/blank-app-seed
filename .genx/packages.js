const {rootPath} = require('./utils');

module.exports = {
  root: rootPath('client'),
  desktop: rootPath('client/desktop'),
  mobile: rootPath('client/mobile'),
  web: rootPath('client/web'),
  components: rootPath('client/web/src/components'),
  designSystem: rootPath('client/web/src/design-system'),
  services: rootPath('client/web/src/services'),
  utils: rootPath('client/web/src/utils'),
}
