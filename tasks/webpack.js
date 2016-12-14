'use strict';
const webpack = require('webpack');
const OptionHelper = require('../src/options/WebpackOptionHelper');
const CachePluginFactory = require('../src/plugins/CachePluginFactory');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');

module.exports = (grunt) => {
  const cachePluginFactory = new CachePluginFactory();
  const processPluginFactory = new ProgressPluginFactory(grunt);

  grunt.registerMultiTask('webpack', 'Webpack files.', function webpackTask() {
    const done = this.async();
    const optionHelper = new OptionHelper(grunt, this);

    const watch = optionHelper.get('watch');
    const opts = {
      cache: watch ? false : optionHelper.get('cache'),
      failOnError: optionHelper.get('failOnError'),
      keepalive: optionHelper.get('keepalive'),
      progress: optionHelper.get('progress'),
      stats: optionHelper.get('stats'),
      storeStatsTo: optionHelper.get('storeStatsTo'),
      watch: watch,
    };

    const webpackOptions = optionHelper.getWebpackOptions();

    const compiler = webpack(webpackOptions);

    if (opts.cache) cachePluginFactory.addPlugin(this.target, compiler);
    if (opts.progress) processPluginFactory.addPlugin(this.target, compiler);

    const handler = (err, stats) => {
      if (opts.cache) cachePluginFactory.updateDependencies(this.target, compiler);
      if (err) return done(err);

      if (opts.stats && !stats.hasErrors()) {
        grunt.log.writeln(stats.toString(opts.stats));
      }

      if (typeof opts.storeStatsTo === 'string') {
        grunt.config.set(opts.storeStatsTo, stats.toJson(opts.stats));
      }

      if (stats.hasErrors()) {
        // in case opts.stats === false we still want to display errors.
        grunt.log.writeln(stats.toString(opts.stats || 'errors-only'));
        if (opts.failOnError) {
          // construct error without stacktrace, as the stack is not relevant here
          const error = new Error();
          error.stack = null;
          return done(error);
        }
      }

      if (!opts.keepalive) done();
    };

    if (opts.watch) {
      compiler.watch(webpackOptions.watchOptions || {}, handler);
    } else {
      compiler.run(handler);
    }
  });
};
