const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'production',
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
        compress: true,
      },
      sourceMap: true,
    }),
  ],
};
