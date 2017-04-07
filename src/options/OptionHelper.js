'use strict';
const deepForEach = require('deep-for-each');
const defaults = require('./default');

class OptionHelper {

  constructor(grunt, taskName, target) {
    this.grunt = grunt;
    this.taskName = taskName;
    this.target = target;
  }

  generateOptions() {
    const baseOptions = this.getWithPlugins([this.taskName, 'options']);
    if (Array.isArray(baseOptions)) throw new Error('webpack.options must be an object, but array was provided');

    return defaults.mergeOptions(
      this.getDefaultOptions(),
      baseOptions,
      this.getWithPlugins([this.taskName, this.target])
    );
  }

  getOptions() {
    if (!this.options) {
      this.options = this.generateOptions();
    }

    return this.options;
  }

  get(name) {
    const options = this.getOptions();
    let option = undefined;

    if (Array.isArray(options)) {
      let value = undefined;
      options.some((opt) => {
        value = opt[name];
        return value != undefined;
      });

      option = value;
    } else {
      option = options[name];
    }

    return typeof option === 'function' ? option(options) : option;
  }

  getWithPlugins(ns) {
    let obj = this.grunt.config.getRaw(ns) || {};

    if (typeof obj === 'function') {
      obj = obj();
    }

    deepForEach(obj, function (value, key, parent) {
      if (typeof value === 'string') {
        parent[key] = this.grunt.config.process(value);
      } else if (Array.isArray(value) && key === 'plugins') {
        parent[key] = value.map(plugin => this.fixPlugin(plugin));
      }
    }.bind(this));

    return obj;
  }

  fixPlugin(plugin) {
    if (typeof plugin === 'function') return plugin;

    // Operate on a copy of the plugin, since the webpack task
    // can be called multiple times for one instance of a plugin
    const instance = Object.create(plugin);
    Object.keys(plugin).forEach((key) => {
      if (typeof plugin[key] === 'string') {
        instance[key] = this.grunt.config.process(plugin[key]);
      } else {
        instance[key] = plugin[key];
      }
    });

    return instance;
  }

  filterGruntOptions(options) {
    const result = Object.assign({}, options);
    Object.keys(defaults.gruntOptions).forEach(key => delete result[key]);

    return result;
  }
}

module.exports = OptionHelper;
