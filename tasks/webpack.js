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
	var getWithPlugins = require("../lib/getWithPlugins")(grunt);
	var mergeFunction = require("../lib/mergeFunction")(grunt);

	var webpack = require("webpack");
	var CachePlugin = require("webpack/lib/CachePlugin");
	var ProgressPlugin = require("webpack/lib/ProgressPlugin");

	var targetCachePlugins = {};
	var targetDependencies = {};

	grunt.registerMultiTask('webpack', 'Webpack files.', function() {
		var done = this.async();
		var options = _.merge(
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
			mergeFunction
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
			if(_.isString(pth)){
				return path.resolve(process.cwd(), pth);
			}
			else if(_.isArray(pth)){
				return _.map(pth, function(p){
					// Arrays of paths can contain a mix of both strings and RegExps
					if(_.isString(p)){
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
			compiler.watch(options.watchDelay || 200, handler);
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
				grunt.log.error(err);
				return done(false);
			}

			if(statsOptions) {
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
