"use strict";

const CachePlugin = require("webpack/lib/cache/MemoryCachePlugin");

class CachePluginFactory {
  constructor() {
    this.plugins = {};
  }

  addPlugin(target, compiler) {
    if (!this.plugins[target]) {
      this.plugins[target] = new CachePlugin();
    }
    this.plugins[target].apply(compiler);
  }
}

module.exports = CachePluginFactory;
