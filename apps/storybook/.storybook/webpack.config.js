const path = require('path');
const webpack = require('webpack');

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
  });
  defaultConfig.resolve.extensions.push('.ts', '.tsx');
  defaultConfig.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'typings-for-css-modules-loader?modules&sass&namedExport&camelCase', 'sass-loader'],
    include: path.resolve(__dirname, '../../../'),
  });
  defaultConfig.resolve.extensions.push('.scss');
  defaultConfig.plugins.push(new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]));
  return defaultConfig;
};
