'use strict';
const _ = require('lodash');
const defaults = require('./default');

class OptionHelper {

  constructor(grunt, task) {
    this.grunt = grunt;
    this.task = task;
  }

  generateOptions() {
    const baseOptions = this.getWithPlugins([this.task.name, 'options']);
    if (Array.isArray(baseOptions)) throw new Error('webpack.options must be an object, but array was provided');

    return defaults.mergeOptions(
      this.getDefaultOptions(),
      baseOptions,
      this.getWithPlugins([this.task.name, this.task.target])
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
    const obj = this.grunt.config(ns) || {};

    if (Array.isArray(obj)) {
      obj.forEach((options, index) => {
        this.fixPlugins(options, ns.concat([`${index}`, 'plugins']));
      });
    } else {
      this.resolvePaths(obj);
      if (obj.webpack) {
        // handle webpack-dev-server options
        this.fixPlugins(obj.webpack, ns.concat(['webpack', 'plugins']));
      } else {
        this.fixPlugins(obj, ns.concat(['plugins']));
      }
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

    return result;
  }

  resolvePaths(obj) {
    // Use grunt to expand the path of the following properties
    const props = ['entry', 'output.path', 'output.filename'];

    _.each(props, (prop) => {
      if (_.has(obj, prop)) {
        _.set(obj, prop, this.expandPath(_.get(obj, prop)));
      }
    });

    return obj;
  }

  expandPath(paths) {
    let result = paths;

    if (_.isString(paths)) {
      if (_.startsWith(paths, '.') || _.startsWith(paths, '/')) {
        result = this.grunt.file.expand({ cwd: process.cwd() }, paths);
        if (!result || result.length < 1) {
          result = this.grunt.template.process(paths);
        }
        if (result && (result.length === 1)) {
          result = result[0];
        }
      }
    } else if (Array.isArray(paths)) {
      result = _.map(paths, (path) => {
        return this.expandPath(path);
      });
    } else if (_.isObject(paths)) {
      _.each(paths, (path, key) => {
        result[key] = this.expandPath(path);
      });
    }

    return result;
  }
}

module.exports = OptionHelper;
