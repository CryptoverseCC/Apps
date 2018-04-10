const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    filename: 'bundle.js',
    library: 'UserfeedsWidgets',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules\/(?!@userfeeds|@linkexchange)/,
        loader: 'ts-loader',
        options: {},
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\/(?!@userfeeds|@linkexchange)/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              namedExport: true,
              modules: true,
              importLoaders: 1,
              sourceMap: true,
              camelCase: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: path.join(process.cwd(), 'postcss.config.js'),
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              outputStyle: 'expanded',
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        include: /node_modules\/(?!@userfeeds|@linkexchange)/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
      },
      {
        test: /\.(woff|ttf|eot|svg|otf)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'index.html'),
    }),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
      VERSION: JSON.stringify(require(process.cwd() + '/package.json').version),
    }),
    // new webpack.NamedModulesPlugin(),
    // new webpack.optimize.ModuleConcatenationPlugin(), // ToDo read about this.
  ],
  devServer: {
    compress: true,
    historyApiFallback: true,
    disableHostCheck: true,
  },
};
