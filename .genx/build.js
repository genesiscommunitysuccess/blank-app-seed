const {rootPath} = require('./utils');

module.exports = {
  root: rootPath('client/.build'),
  clean: rootPath('client/.build/clean'),
  rollup: rootPath('client/.build/rollup'),
  rollupTransformFragments: rootPath('client/.build/rollup/transform-fragments'),
  webpack: rootPath('client/.build/webpack'),
}
