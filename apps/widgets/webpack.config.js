const path = require('path');
const merge = require('webpack-merge');

const baseConfig = require('../../config/webpack.base');

module.exports = merge(baseConfig, {
  entry: './src/index.tsx',
});
