const merge = require('webpack-merge');

const devConfig = require('./webpack.config');
const baseProdConfig = require('../../config/webpack.base.prod');

module.exports = merge(devConfig, baseProdConfig, {
  output: {
    // publicPath: '/apps/',
  },
});
