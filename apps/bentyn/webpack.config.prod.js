const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devConfig = require('./webpack.config');
const baseProdConfig = require('../../config/webpack.base.prod');

module.exports = merge(devConfig, baseProdConfig, {
  plugins: [new HtmlWebpackPlugin([{ from: 'favicon.ico' }])],
});
