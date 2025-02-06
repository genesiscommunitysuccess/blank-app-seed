const { resolve, join } = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  const https = process.env.HTTPS === 'true';
  const open = !(process.env.NO_OPEN === 'true');
  const environmentFile = mode === 'production'
    ? 'environment.prod.ts' 
    : 'environment.ts';
  const environmentPath = resolve(__dirname, 'src/environments', environmentFile);

  return {
    mode,
    entry: './src/main.tsx',
    output: {
      path: resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        'foundationZero/ZeroDesignSystem': resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
        '@': resolve(__dirname, 'src'),
        '@environment': environmentPath,
        'pbc': resolve(__dirname, 'src/pbc'),
      },
      symlinks: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          type: 'asset/resource',
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      new webpack.DefinePlugin({
        BUILDER: JSON.stringify('webpack'),
      }),
    ],
    devServer: {
      server: https ? 'https' : 'http',
      open,
      static: {
        directory: join(__dirname, 'public'),
      },
      client: {
        overlay: {
          errors: false,
          warnings: false,
          runtimeErrors: false,
        },
      },
      compress: true,
      port: 3000,
      historyApiFallback: true,
    },
    stats: {
      all: false,
      errors: true,
      warnings: true,
      timings: true,
      assets: true,
      modules: false,
    },
  };
};