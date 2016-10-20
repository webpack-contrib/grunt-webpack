'use strict';
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');

class HotModuleReplacementPluginFactory {

  constructor(grunt) {
    this.grunt = grunt;
  }

  addPlugin(target, compiler) {
    compiler.apply(new HotModuleReplacementPlugin());
  }
}

module.exports = HotModuleReplacementPluginFactory;
