/* eslint prefer-named-capture-group: "off" */
// In this config named capturing isn't desired.
// May cause adverse affects with webpack.

const appFileRules = {
  fonts: () => ({
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
  }),
  html: () => ({
    test: /\.html$/,
    use: [
      {
        loader: 'html-loader',
      },
    ],
  }),
  images: () => ({
    test: /\.(png|svg|jpg|jpeg|gif)$/i,
    type: 'asset/resource',
  }),
};

module.exports = {
  appFileRules,
};
