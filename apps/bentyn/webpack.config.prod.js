const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devConfig = require('./webpack.config');
const baseProdConfig = require('../../config/webpack.base.prod');

module.exports = merge(devConfig, baseProdConfig, {
  plugins: [new CopyWebpackPlugin([{ from: 'favicon.ico' }])],
});
