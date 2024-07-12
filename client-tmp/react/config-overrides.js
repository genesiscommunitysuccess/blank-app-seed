const path = require('path');
const { resolveDefineConfig } = require('@genesislcap/build-kit');
const { config } = require('dotenv');
const { DefinePlugin } = require('webpack');

config();

module.exports = function override(config) {
  config.plugins = [
    ...config.plugins,
    new DefinePlugin(resolveDefineConfig(['GENX_*', 'FOUNDATION_AUTH'])),
  ];

  config.module = {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ],
  };

  //@todo: fix genesis packages source maps
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    /Failed to parse source map/,
  ];

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'foundationZero/ZeroDesignSystem': path.resolve(
        __dirname,
        'node_modules/@genesislcap/foundation-zero',
      ),
    },
  };

  return config;
};
