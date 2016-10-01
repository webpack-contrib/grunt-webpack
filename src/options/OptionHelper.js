'use strict';
const defaults = require('./default');
const convertPaths = require('./convertPaths');

class OptionHelper {

  constructor(grunt, task) {
    this.grunt = grunt;
    this.task = task;
    this.options = this.task.options(defaults.gruntOptions);
    this.webpackOptions = this.generateWebpackOptions();
  }

  generateWebpackOptions() {
    const options = defaults.ensureWebpackOptions(
      this.getWithPlugins([this.task.name, this.task.target])
    );

    if (Array.isArray(options)) {
      options.forEach(convertPaths);
    } else {
      convertPaths(options);
    }

    return options;
  }

  get(name, onlyWebpackOptions) {
    if (Array.isArray(this.webpackOptions)) {
      let value = undefined;
      this.webpackOptions.some((options) => {
        value = options[name];
        return value != undefined;
      });

      return value;
    } else if (this.options[name] !== undefined) {
      return this.webpackOptions[name];
    }

    if (onlyWebpackOptions) return undefined;

    return this.options[name];
  }

  getWebpackOptions() {
    if (Array.isArray(this.webpackOptions)) {
      return this.webpackOptions.map((options) => this.filterGruntOptions(options));
    }

    return this.filterGruntOptions(this.webpackOptions);
  }

  getWithPlugins(ns) {
    const obj = this.grunt.config(ns) || {};

    if (Array.isArray(obj)) {
      obj.forEach((options, index) => {
        this.fixPlugins(options, ns.concat([`${index}`, 'plugins']));
      });
    } else {
      this.fixPlugins(obj, ns.concat(['plugins']));
    }

    return obj;
  }

  fixPlugins(obj, ns) {
    if (obj.plugins) {
      // getRaw must be used or grunt.config will clobber the types (i.e.
      // the array won't a BannerPlugin, it will contain an Object)
      const plugins = this.grunt.config.getRaw(ns);
      obj.plugins = plugins.map(plugin => this.fixPlugin(plugin));
    }

    return obj;
  }

  fixPlugin(plugin) {
    if (typeof plugin === 'function') return plugin;

    // Operate on a copy of the plugin, since the webpack task
    // can be called multiple times for one instance of a plugin
    const instance = Object.create(plugin);
    Object.keys(plugin).forEach((key) => {
      if (typeof plugin[key] === 'string') {
        instance[key] = this.grunt.template.process(plugin[key]);
      }
    });

    return instance;
  }

  filterGruntOptions(options) {
    const result = Object.assign({}, options);
    Object.keys(defaults.gruntOptions).forEach(key => delete result[key]);

    // ensure cache is disabled, as we add our own CachePlugin to support
    // multiple targets in one run with different caches
    result.cache = false;

    return result;
  }
}

module.exports = OptionHelper;
