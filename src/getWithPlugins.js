var isFunction = require("lodash/isFunction");

module.exports = function(grunt) {

  // Get options from this.data
  function getWithPlugins(ns) {
    var obj = grunt.config(ns) || {};

    if (obj.plugins) {

      // getRaw must be used or grunt.config will clobber the types (i.e.
      // the array won't a BannerPlugin, it will contain an Object)
      obj.plugins = fixPlugins(grunt.config.getRaw(ns.concat(["plugins"])));
    }

    return obj;
  }

  function fixPlugins(plugins) {

    // See https://github.com/webpack/grunt-webpack/pull/9
    var fixPlugin = function(plugin) {
      if (isFunction(plugin)) {
        return plugin;
      }

      // Operate on a copy of the plugin, since the webpack task
      // can be called multiple times for one instance of a plugin
      var instance = Object.create(plugin);
      for (var key in plugin) {
        // Re-interpolate plugin string properties as templates
        if (Object.prototype.hasOwnProperty.call(plugin, key) && typeof plugin[key] === "string") {
          instance[key] = grunt.template.process(plugin[key]);
        }
      }
      return instance;
    };

    return plugins.map(fixPlugin);
  }

  return getWithPlugins;
};
