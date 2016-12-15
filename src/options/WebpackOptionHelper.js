'use strict';
const defaults = require('./default');
const OptionHelper = require('./OptionHelper');

class WebpackOptionHelper extends OptionHelper {

  getDefaultOptions() {
    return defaults.gruntOptions;
  }

  getWebpackOptions() {
    const options = this.getOptions();

    if (Array.isArray(options)) {
      return options.map((opt) => this.filterGruntOptions(opt));
    }

    // ensure cache is disabled, as we add our own CachePlugin to support
    // multiple targets in one run with different caches
    options.cache = false;

    return this.filterGruntOptions(options);
  }
}

module.exports = WebpackOptionHelper;
