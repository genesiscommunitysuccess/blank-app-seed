const { DefinePlugin } = require('webpack');
const environment = require('./src/environments/environment.prod.ts').environment;
const webpackSharedConfig = require('./webpack.shared.config');

const envKeys = Object.keys(environment).reduce((prev, next) => {
  prev[next] = JSON.stringify(environment[next]);
  return prev;
}, {});

module.exports = {
  ...webpackSharedConfig,
  plugins: [new DefinePlugin(envKeys)],
};
