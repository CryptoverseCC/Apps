const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool: 'source-map',
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
