const merge = require('webpack-merge');

const package = require('./package.json');
const devConfig = require('./webpack.config');
const baseProdConfig = require('../../config/webpack.base.prod');

const VERSION = package.version;

module.exports = merge(devConfig, baseProdConfig, {
  output: {
    publicPath: `https://cdn.jsdelivr.net/npm/@linkexchange/widgets@${VERSION}/build/`,
  },
});
