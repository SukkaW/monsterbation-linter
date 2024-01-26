'use strict';

module.exports = require('eslint-config-sukka').sukka({
  node: {
    files: ['eslint.config.js', './build/webpack.config.js']
  },
  ts: {},
  react: true
});
