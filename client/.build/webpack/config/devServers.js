const path = require('path');

const convertWsEndpointToHTTP = (endpoint = '', socketExt) =>
  (endpoint.startsWith('ws:')
      ? endpoint.replace('ws:', 'http:')
      : endpoint.startsWith('wss:')
        ? endpoint.replace('wss:', 'https:')
        : endpoint
  ).replace(`/${socketExt}`, '');

const devServers = {
  default: (port = 9000, host = 'localhost') => {
    const socketExt = process.env.SOCKET_EXT || 'gwf';
    const target = convertWsEndpointToHTTP(process.env.API_HOST, socketExt);
    return {
      open: !process.env.CI,
      historyApiFallback: true,
      allowedHosts: 'all',
      host,
      port,
      proxy: [
        {
          context: [`/${socketExt}/**`, '/sso/**'],
          target,
          secure: false,
          changeOrigin: true,
        },
      ],
      client: {
        overlay: {
          runtimeErrors: false,
        },
      },
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
    };
  },
};

module.exports = {
  devServers,
};
