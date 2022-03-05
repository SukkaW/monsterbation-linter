'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

/** @type {import("webpack").Configuration} */
module.exports = {
  entry: {
    eslint: path.resolve(__dirname, 'index.js')
  },
  output: {
    path: path.resolve(__dirname, '../src/eslint-browserify'),
    filename: '[name].js',
    library: {
      type: 'commonjs'
    }
  },
  module: {
    // rules: [
    //   // An workaround for the stupid parcel bug: https://github.com/parcel-bundler/parcel/issues/7468
    //   {
    //     test: /\.js$/,
    //     loader: 'string-replace-loader',
    //     options: {
    //       multiple: [
    //         {
    //           search: JSON.stringify('object?'),
    //           replace: 'objectOrNull'
    //         },
    //         {
    //           search: JSON.stringify('string!'),
    //           replace: 'stringNonNull'
    //         }
    //       ]
    //     }
    //   }
    // ]
  },
  plugins: [
    new NodePolyfillPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    mainFields: ['browser', 'main', 'module']
  },
  stats: 'errors-only',
  optimization: {
    minimize: false
  }
};
