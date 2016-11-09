'use strict';
const defaults = require('./default');
const convertPaths = require('./convertPaths');

class OptionHelper {

  constructor(grunt, task) {
    this.grunt = grunt;
    this.task = task;
  }

  getDefaultOptions() {
    throw new Error();
  }

  generateOptions() {
    const baseOptions = this.getWithPlugins([this.task.name, 'options']);
    if (Array.isArray(baseOptions)) throw new Error('webpack.options must be an object, but array was provided');

    const options = defaults.mergeOptions(
      this.getDefaultOptions(),
      baseOptions,
      this.getWithPlugins([this.task.name, this.task.target])
    );
    
    // https://webpack.github.io/docs/configuration.html#module-loaders
    // The loaders here are resolved relative to the resource which they are applied to. 
    // This means they are not resolved relative the the configuration file.
    if (Array.isArray(options)) {
      options.forEach(convertPaths);
    } else {
      convertPaths(options);
    }
    return options;
  }

  getOptions() {
    if (!this.options) {
      this.options = this.generateOptions();
    }

    return this.options;
  }

  get(name) {
    const options = this.getOptions();

    if (Array.isArray(options)) {
      let value = undefined;
      options.some((opt) => {
        value = opt[name];
        return value != undefined;
      });

      return value;
    }

    return options[name];
  }

  getWebpackOptions() {
    const options = this.getOptions();

    if (Array.isArray(options)) {
      return options.map((opt) => this.filterGruntOptions(opt));
    }

    return this.filterGruntOptions(options);
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
