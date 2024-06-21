const webpackSharedConfig = require('./webpack.shared.config');
const { DefinePlugin } = require('webpack');
const environment = require('./src/environments/environment.ts').environment;
const envKeys = Object.keys(environment).reduce((prev, next) => {
  prev[next] = JSON.stringify(environment[next]);
  return prev;
}, {});

module.exports = {
  ...webpackSharedConfig,
  plugins: [
    new DefinePlugin(envKeys),
  ],
};
