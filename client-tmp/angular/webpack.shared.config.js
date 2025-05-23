const path = require('path');

// Register ts-node to transpile environments TypeScript file
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs'
  }
});

const apiPrefix = process.env.SOCKET_EXT || 'gwf';
const publicPath = process.env.PUBLIC_PATH || '/';
const apiBasePath = `${publicPath}${apiPrefix}`;

module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {},
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      'pbc': path.resolve(
          __dirname,
          'src/pbc',
      )
    },
  },
  /**
   * Ensure webpack handles module loading strictly to allow module federation fallbacks.
   */
  output: {
    strictModuleErrorHandling: true,
    strictModuleExceptionHandling: true,
  },
  /**
   * Mark the 'foundationZero/ZeroDesignSystem' module federated remote as external.
   */
  externals: {
    'foundationZero/ZeroDesignSystem': 'foundationZero/ZeroDesignSystem',
  },
  devServer: {
      proxy: [
        {
          context: apiBasePath,
          target: "{{apiHost}}",
          pathRewrite: { [`^${apiBasePath}`]: '' },
          secure: false,
          changeOrigin: true,
          cookieDomainRewrite: 'localhost',
          ws: true,
          headers: {
            origin: "{{apiHost}}",
          }
        }
      ],
      compress: true,
      historyApiFallback: true,
    },
};

