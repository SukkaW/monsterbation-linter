'use strict';

const path = require('node:path');

module.exports = require('@corespeed/webpack').createWebpack({
  cwd: __filename,
  dotenv: false,
  output: {
    library: '_SKK',
    path: path.resolve(__dirname, 'dist'),
    filenamePrefix: '/_sukka/static/',
    filenameContainChunkName: false
  },
  devServerPort: 3000,
  spa: true,
  externals: {
    'isomorphic-fetch': 'fetch',
    'node-fetch': 'fetch',
    // requires to build @undecaf/zbar.wasm
    module: 'module'
  },
  browserlists: 'defaults, chrome > 70, edge >= 79, firefox esr, safari >= 11, not dead, not ie > 0, not ie_mob > 0, not OperaMini all',
  reactCompiler: true,
  webpackExperimentalBuiltinCssSupport: true,
  htmlTemplatePath: './src/index.html',
  sourcemap: {
    production: false
  }
});
