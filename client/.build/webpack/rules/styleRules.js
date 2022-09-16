const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const miniCssExtractLoader = () => ({
  loader: MiniCssExtractPlugin.loader,
  options: {
    esModule: true,
    modules: {
      namedExport: true,
    },
  },
});

const cssLoader = (importLoaders = 1, useHash = true) => ({
  loader: 'css-loader',
  options: {
    importLoaders,
    // modules: {
    //   namedExport: true,
    //   localIdentName: '[local]' + (useHash ? '--[hash:base64:5]' : ''),
    //   exportLocalsConvention: 'camelCaseOnly',
    // },
  },
});

const postCSSLoader = () => ({
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      config: path.resolve(__dirname, '../config/postcss.config.js'),
    },
  },
});

const headCssPatterns = [
  /main\.css$/i,
  /head\.css$/i,
  /index\.css$/i,
];

const appStyleRules = {
  headCss: () => ({
    test: /\.css$/i,
    include: headCssPatterns,
    use: [
      'style-loader',
      cssLoader(),
      postCSSLoader(),
    ],
  }),
  css: (useHash = true) => ({
    test: /\.css$/i,
    exclude: [
      ...headCssPatterns,
    ],
    use: [
      cssLoader(),
      postCSSLoader(),
    ],
  }),
  sass: (useHash = true) => ({
    test: /\.(sa|sc)ss$/i,
    exclude: [
      ...headCssPatterns,
    ],
    use: [
      cssLoader(2),
      postCSSLoader(),
      'sass-loader',
    ],
  }),
};

module.exports = {
  appStyleRules,
};
