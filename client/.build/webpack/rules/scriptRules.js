const path = require('path');

const appScriptRules = {
  typescript: () => ({
    test: /\.ts$/i,
    exclude: /node_modules/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(process.cwd(), './tsconfig.build.json'),
          projectReferences: true,
        },
      },
    ],
  }),
};

module.exports = {
  appScriptRules,
};
