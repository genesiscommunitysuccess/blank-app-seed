/* eslint prefer-named-capture-group: "off" */
// In this config named capturing isn't desired.
// May cause adverse affects with webpack.

const path = require('path');
const {merge} = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const vendorCacheGroup = {
  vendor: {
    test: /[\\/]node_modules[\\/]/,
    name: (module) => {
      const packageName = module.context.match(
        /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
      )[1];
      // npm package names are URL-safe, but some servers don't like @ symbols
      return `npm.${packageName.replace('@', '')}`;
    },
  },
};

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[id].[contenthash].js',
    sourceMapFilename: '[name].[contenthash].js.map',
  },
  optimization: {
    minimizer: [new TerserJSPlugin({})],
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 100,
      cacheGroups: {
        ...vendorCacheGroup,
      },
    },
  },
});
