const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_DEV = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: IS_DEV ? '' : '/apps/widgets/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class'      
    },
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /node_modules\/(?!@userfeeds)/,
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
            plugins: () => ([
              autoprefixer({ browsers: ['last 2 versions'] }),
            ]),
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
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'url-loader',
    }, {
      test: /\.(woff|ttf|eot|svg|otf)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
      loader: 'url-loader?limit=100000',
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
    // new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
  },
};
