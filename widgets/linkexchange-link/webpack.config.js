const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('../../config/webpack.base');

const config = merge.smart(baseConfig, {
  entry: './src/index.tsx',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /node_modules\/(?!@userfeeds|@linkexchange)/,
        use: [
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              namedExport: true,
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              camelCase: true,
              localIdentName: 'LX__[name]__[local]',
            },
          },
        ],
      },
    ],
  },
});

module.exports = config;
