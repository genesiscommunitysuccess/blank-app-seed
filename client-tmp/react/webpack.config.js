const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  const isProduction = mode === 'production';
  const https = process.env.HTTPS === 'true';
  const open = !(process.env.NO_OPEN === 'true');
  const jsonFilePath = path.resolve(process.cwd(), `env.${mode}.json`);
  const envConfig = {};

  if (fs.existsSync(jsonFilePath)) {
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const parsedConfig = JSON.parse(jsonContent);

    for (const key in parsedConfig) {
      envConfig[`process.env.${key}`] = JSON.stringify(parsedConfig[key]);
    }
  }

  return {
    mode,
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'foundationZero/ZeroDesignSystem': path.resolve(__dirname, 'node_modules/@genesislcap/foundation-zero'),
        'pbc': path.resolve(__dirname, 'src/pbc'),
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
        ...envConfig,
        BUILDER: JSON.stringify('webpack'),
      }),
    ],
    devServer: {
      server: https ? 'https' : 'http',
      open,
      static: {
        directory: path.join(__dirname, 'public'),
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