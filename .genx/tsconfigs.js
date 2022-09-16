const {rootPath} = require('./utils');

module.exports = {
  root: rootPath('client/tsconfig.json'),
  build: rootPath('client/tsconfig.build.json'),
  common: rootPath('client/tsconfig.common.json'),
}
