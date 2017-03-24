'use strict';
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

class ProgressPluginFactory {

  constructor(grunt) {
    this.grunt = grunt;
  }

  addPlugin(compiler, options) {
    compiler.apply(new ProgressPlugin({ profile: options.profile }));
  }
}

module.exports = ProgressPluginFactory;
