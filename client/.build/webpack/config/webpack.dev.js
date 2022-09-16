const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const {devServers} = require('./devServers.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // CSP?
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
    sourceMapFilename: '[name].js.map',
    // library: {
    //     // no name required for module
    //     type: 'module',
    // },
  },
  devServer: devServers.default(),
});
