const merge = require('webpack-merge');
const safeImportant = require('postcss-safe-important');

const baseConfig = require('../../config/postcss.base');

module.exports = merge(baseConfig, {
  plugins: [
    // safeImportant(),
  ],
});
