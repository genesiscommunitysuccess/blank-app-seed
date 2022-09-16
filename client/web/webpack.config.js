const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const {ModuleFederationPlugin} = webpack.container;
const DashboardPlugin = require('@module-federation/dashboard-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonDev = require('../.build/webpack/config/webpack.common.js');
const {devServers} = require('../.build/webpack/config/devServers');
const {getFederatedPkgName, getRemoteEntry, remoteEntryFilename: filename} = require('../.build/webpack/config/utils');
const pkg = require('./package.json');

const port = pkg.config.PORT;
const name = getFederatedPkgName(pkg.name);
const deps = pkg.dependencies;
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';
const devtool = prod ? 'source-map' : 'inline-source-map'; // CSP?
const devServer = prod ? {} : devServers.default(port);

const remotes = {
  foundationZero: getRemoteEntry('foundationZero', 4020),
};

const exposes = {
  './index': './src/index.federated.ts',
};

const shared = {
  ...deps,
};

const moduleFederationOptions = {
  name,
  filename,
  remotes,
  exposes,
  shared,
};

const jsonIndentSpace = 2;

const mergedConfig = merge(commonDev, {
  mode,
  devtool,
  devServer,
  entry: path.resolve(__dirname, './src/index.federated.ts'),
  plugins: [
    new ModuleFederationPlugin(moduleFederationOptions),
    new DashboardPlugin({
      dashboardURL: 'http://localhost:3000/api/update',
      publishVersion: '1.0.0',
    }),
    new HtmlWebpackPlugin({
      title: `${pkg.description} (Federated)`,
      template: path.resolve(__dirname, './public/info.ejs'),
      filename: 'info.html',
      inject: false,
      /**
      * Passing arbitrary data to the template for display
      */
      moduleFederationDetails: JSON.stringify(moduleFederationOptions, undefined, jsonIndentSpace),
    }),
    new HtmlWebpackPlugin({
      title: `${pkg.description}`,
      template: path.resolve(__dirname, './public/index.ejs'),
    }),
  ],
});

module.exports.port = port;
module.exports.default = mergedConfig;
