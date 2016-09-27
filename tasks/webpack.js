var merge = require("lodash/merge");
var options = require("../src/options");

module.exports = function(grunt) {
  var webpack = require("webpack");

  var targetCachePlugins = {};
  var targetDependencies = {};

  grunt.registerMultiTask('webpack', 'Webpack files.', function() {
    var done = this.async();

    var gruntOptions = options.getGruntOptions(this.name, this.target, grunt);
    var webpackOptions = options.getWebpackOptions(this.name, this.target, grunt);

    var target = this.target;
    var watch = webpackOptions.watch;
    var cache = watch ? false : webpackOptions.cache;
    var keepalive = this.flags.keepalive || gruntOptions.keepalive;
    if (cache) webpackOptions.cache = false;

    var storeStatsTo = gruntOptions.storeStatsTo;
    var statsOptions = webpackOptions.stats;
    var failOnError = gruntOptions.failOnError;
    var progress = gruntOptions.progress;
    var compiler = webpack(webpackOptions);

    if (cache) {
      var CachePlugin = require("webpack/lib/CachePlugin");
      var theCachePlugin = targetCachePlugins[target];
      if (!theCachePlugin) {
        theCachePlugin = targetCachePlugins[target] = new CachePlugin();
      }
      compiler.apply(theCachePlugin);
      if (targetDependencies[target]) {
        compiler._lastCompilationFileDependencies = targetDependencies[target].file;
        compiler._lastCompilationContextDependencies = targetDependencies[target].context;
      }
    }

    if (progress) {
      var ProgressPlugin = require("webpack/lib/ProgressPlugin");
      var chars = 0;
      compiler.apply(new ProgressPlugin(function(percentage, msg) {
        if(percentage < 1) {
          percentage = Math.floor(percentage * 100);
          msg = percentage + "% " + msg;
          if(percentage < 100) msg = " " + msg;
          if(percentage < 10) msg = " " + msg;
        }
        for(; chars > msg.length; chars--)
          grunt.log.write("\b \b");
        chars = msg.length;
        for(var i = 0; i < chars; i++)
          grunt.log.write("\b");
        grunt.log.write(msg);
      }));
    }

    if (watch) {
      // watchDelay and 0 are for backwards compatibility with webpack <= 1.9.0
      // remove with next major and bump to v1.9.1 / v2
      compiler.watch(webpackOptions.watchOptions || webpackOptions.watchDelay || 0, handler);
    } else {
      compiler.run(handler);
    }
    function handler(err, stats) {
      if (cache) {
        targetDependencies[target] = {
          file: compiler._lastCompilationFileDependencies,
          context: compiler._lastCompilationContextDependencies
        };
      }
      if (err) {
        return done(err);
      }

      var defaultStatsOptions = {
        colors: true,
        hash: false,
        timings: false,
        assets: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true
      };

      if (statsOptions || stats.hasErrors()) {
        grunt.log.notverbose.writeln(stats.toString(merge(defaultStatsOptions, statsOptions)));
        grunt.verbose.writeln(stats.toString(merge({
          colors: true
        }, statsOptions)));
      }
      if (typeof storeStatsTo === "string") {
        grunt.config.set(storeStatsTo, stats.toJson(merge(defaultStatsOptions, statsOptions)));
      }
      if (failOnError && stats.hasErrors()) {
        return done(false);
      }
      if (!keepalive) {
        done();
        done = function(){};
      }
    }
  });
};
