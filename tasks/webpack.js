'use strict';
const webpack = require('webpack');
const OptionHelper = require('../src/options/OptionHelper');
const CachePluginFactory = require('../src/plugins/CachePluginFactory');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');

module.exports = (grunt) => {
  const cachePluginFactory = new CachePluginFactory();
  const processPluginFactory = new ProgressPluginFactory(grunt);

  grunt.registerMultiTask('webpack', 'Webpack files.', function webpackTask() {
    const done = this.async();
    const optionHelper = new OptionHelper(grunt, this);

    const watch = optionHelper.get('watch', true);
    const opts = {
      cache: watch ? false : optionHelper.get('cache'),
      failOnError: optionHelper.get('failOnError'),
      keepalive: this.flags.keepalive || optionHelper.get('keepalive'),
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

      const defaultStatsOptions = {
        colors: true,
        hash: false,
        timings: false,
        assets: true,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true
      };

      if (opts.stats || stats.hasErrors()) {
        grunt.log.writeln(stats.toString(Object.assign(defaultStatsOptions, opts.stats)));
      }

      if (typeof opts.storeStatsTo === 'string') {
        grunt.config.set(opts.storeStatsTo, stats.toJson(Object.assign(defaultStatsOptions, opts.stats)));
      }

      if (opts.failOnError && stats.hasErrors()) {
        return done(false);
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
