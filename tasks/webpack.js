/*
 * grunt-webpack
 * https://github.com/sokra/grunt-webpack
 *
 * Copyright (c) 2012 Tobias Koppers @sokra
 * Licensed under the MIT license.
 */

var path = require("path");
var _ = require("lodash");
module.exports = function(grunt) {

	var webpack = require("webpack");
	var CachePlugin = require("webpack/lib/CachePlugin");
	var ProgressPlugin = require("webpack/lib/ProgressPlugin");

	var targetCachePlugins = {};
	var targetDependencies = {};

	grunt.registerMultiTask('webpack', 'Webpack files.', function() {
		var done = this.async();

		// Get options from this.data
		function getWithPlugins(ns) {
			var obj = grunt.config(ns);
			if(obj.plugins) {
				// getRaw must be used or grunt.config will clobber the types (i.e.
				// the array won't a BannerPlugin, it will contain an Object)
				obj.plugins = grunt.config.getRaw(ns.concat(["plugins"]));

				// See https://github.com/webpack/grunt-webpack/pull/9
				obj.plugins = obj.plugins.map(function(plugin) {
					var instance = Object.create(plugin); // Operate on a copy of the plugin, since the webpack task
					                                      // can be called multiple times for one instance of a plugin
					for(var key in plugin) {
						// Re-interpolate plugin string properties as templates
						if(Object.prototype.hasOwnProperty.call(plugin, key) && typeof plugin[key] === "string") {
							instance[key] = grunt.template.process(plugin[key]);
						}
					}
					return instance;
				});
			}
			return obj;
		}
		var options = _.merge(
			{
				context: ".",
				output: {
					path: "."
				},
				failOnError: true
			},
			getWithPlugins([this.name, "options"]),
			getWithPlugins([this.name, this.target]),
			function(a, b) {
				return grunt.util._.isArray(a) && grunt.util._.isArray(b) ? a.concat(b) : undefined;
			}
		);
		options.context = path.resolve(process.cwd(), options.context);
		options.output.path = path.resolve(process.cwd(), options.output.path);

		var target = this.target;
		var cache = options.cache;
		options.cache = false;
		var storeStatsTo = options.storeStatsTo;
		var statsOptions = options.stats || {};
		delete options.stats;
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

		compiler.run(function(err, stats) {
			if(cache) {
				targetDependencies[target] = {
					file: compiler._lastCompilationFileDependencies,
					context: compiler._lastCompilationContextDependencies
				};
			}
			if(err) {
				grunt.log.error(err);
				return done(false);
			}

			grunt.log.notverbose.writeln(stats.toString(grunt.util._.merge({
				colors: true,
				hash: false,
				timings: false,
				assets: true,
				chunks: false,
				chunkModules: false,
				modules: false,
				children: true
			}, statsOptions)));
			grunt.verbose.writeln(stats.toString(grunt.util._.merge({
				colors: true
			}, statsOptions)));
			if(typeof storeStatsTo === "string") {
				grunt.config.set(storeStatsTo, stats.toJson());
			}
			if(options.failOnError && stats.hasErrors())
				return done(false);
			done();
		});
	});

};
