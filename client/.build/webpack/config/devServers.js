const path = require('path');

const devServers = {
  default: (port = 9000, host = 'localhost') => ({
    open: !process.env.CI,
    historyApiFallback: true,
    allowedHosts: 'all',
    host,
    port,
    // disableHostCheck: true,
    // sockHost: 'localhost',
    // sockPort: '8080',
    // https: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    static: [
      {
        directory: path.resolve(process.cwd(), './public'),
        publicPath: '/',
        watch: true,
      },
    ],
  }),
};

module.exports = {
  devServers,
};
