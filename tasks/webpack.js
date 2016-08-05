var path = require("path");
var merge = require("lodash/merge");
var mergeWith = require("lodash/mergeWith");
var map = require("lodash/map");
var isString = require("lodash/isString");
var isArray = require("lodash/isArray");

module.exports = function(grunt) {
  var getWithPlugins = require("../src/getWithPlugins")(grunt);
  var mergeCustomizer = require("../src/mergeCustomizer");

  var webpack = require("webpack");
  var CachePlugin = require("webpack/lib/CachePlugin");
  var ProgressPlugin = require("webpack/lib/ProgressPlugin");

  var targetCachePlugins = {};
  var targetDependencies = {};

  grunt.registerMultiTask('webpack', 'Webpack files.', function() {
    var done = this.async();
    var options = mergeWith(
      {x:{
        context: ".",
        output: {
          path: "."
        },
        progress: true,
        stats: {},
        failOnError: true
      }},
      {x:getWithPlugins([this.name, "options"])},
      {x:getWithPlugins([this.name, this.target])},
      mergeCustomizer
    ).x;
    [].concat(options).forEach(function(options) {
      convertPathsForObject(options, ["context", "recordsPath", "recordsInputPath", "recordsOutputPath"])
      convertPathsForObject(options.output, ["path"]);
      convertPathsForObject(options.resolve, ["root", "fallback"]);
      convertPathsForObject(options.resolveLoader, ["root", "fallback"]);
      if(options.module && options.module.loaders) {
        options.module.loaders.forEach(function(l){
          convertPathsForObject(l, ["test", "include", "exclude"]);
        });
      }
    });

    function convertPathsForObject(obj, props){
      if(obj){
        props.forEach(function(prop) {
          if(obj[prop] != undefined) {
            obj[prop] = convertPath(obj[prop]);
          }
        });
      }
    }

    function convertPath(pth) {
      if(isString(pth)){
        return path.resolve(process.cwd(), pth);
      }
      else if(isArray(pth)){
        return map(pth, function(p){
          // Arrays of paths can contain a mix of both strings and RegExps
          if(isString(p)){
            return path.resolve(process.cwd(), p);
          }
          return p
        });
      }
      // It may have been a RegExp so just send it back
      return pth;
    }

    var firstOptions = Array.isArray(options) ? options[0] : options;
    var target = this.target;
    var watch = firstOptions.watch;
    var cache = watch ? false : firstOptions.cache;
    var keepalive = this.flags.keepalive || firstOptions.keepalive;
    if(cache) {
      [].concat(options).forEach(function(o) { o.cache = false; });
    }
    var storeStatsTo = firstOptions.storeStatsTo;
    var statsOptions = firstOptions.stats;
    var failOnError = firstOptions.failOnError;
    var progress = firstOptions.progress;
    var compiler = webpack(options);

    if(cache) {
      var theCachePlugin = targetCachePlugins[target];
      if(!theCachePlugin) {
        theCachePlugin = targetCachePlugins[target] = new CachePlugin();
      }
      compiler.apply(theCachePlugin);
      if(targetDependencies[target]) {
        compiler._lastCompilationFileDependencies = targetDependencies[target].file;
        compiler._lastCompilationContextDependencies = targetDependencies[target].context;
      }
    }

    if(progress) {
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
      compiler.watch(options.watchOptions || options.watchDelay || 0, handler);
    } else {
      compiler.run(handler);
    }
    function handler(err, stats) {
      if(cache) {
        targetDependencies[target] = {
          file: compiler._lastCompilationFileDependencies,
          context: compiler._lastCompilationContextDependencies
        };
      }
      if(err) {
        return done(err);
      }

      if(statsOptions || stats.hasErrors()) {
        grunt.log.notverbose.writeln(stats.toString(merge({
          colors: true,
          hash: false,
          timings: false,
          assets: true,
          chunks: false,
          chunkModules: false,
          modules: false,
          children: true
        }, statsOptions)));
        grunt.verbose.writeln(stats.toString(merge({
          colors: true
        }, statsOptions)));
      }
      if(typeof storeStatsTo === "string") {
        grunt.config.set(storeStatsTo, stats.toJson());
      }
      if(failOnError && stats.hasErrors()) {
        return done(false);
      }
      if(!keepalive) {
        done();
        done = function(){};
      }
    }
  });
};
