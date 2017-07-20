const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /(node_modules)/,
      loader: 'awesome-typescript-loader',
    }, {
      test: /\.scss$/,
      exclude: /(node_modules)/,
      use: [
        { loader: 'style-loader' },
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
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => {
              autoprefixer({ browsers: ['last 2 versions'] });
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    }, {
      test: /\.(css|scss)$/,
      include: /(node_modules)/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => {
              autoprefixer({ browsers: ['last 2 versions'] });
            },
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    }, {
      test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
      loader: 'url-loader',
    }, {
      test: /\.svg$/,
      loader: 'svg-inline-loader',
      options: {
        removeTags: true,
        removeSVGTagAttrs: true,
      },
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new webpack.WatchIgnorePlugin([
      /scss\.d\.ts$/
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) || 'development',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
};
