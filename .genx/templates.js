const {rootPath} = require('./utils');

module.exports = {
  baseComponent: rootPath('.genx/plop/templates/component/ui'),
  designSystem: rootPath('.genx/plop/templates/design-system'),
  designSystemComponent: rootPath('.genx/plop/templates/component/ds'),
  npmrcFile: rootPath('.genx/plop/templates/.npmrc.hbs'),
}
