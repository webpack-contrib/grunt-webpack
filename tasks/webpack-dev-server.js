/*
 * grunt-webpack
 * https://github.com/sokra/grunt-webpack
 *
 * Copyright (c) 2014 Tobias Koppers @sokra
 * Licensed under the MIT license.
 */

var path = require("path");
var _ = require("lodash");
module.exports = function(grunt) {
	var getWithPlugins = require("../lib/getWithPlugins")(grunt);
	var mergeFunction = require("../lib/mergeFunction")(grunt);

	var webpack = require("webpack");
	var WebpackDevServer = require("webpack-dev-server");
	var ProgressPlugin = require("webpack/lib/ProgressPlugin");

	grunt.registerMultiTask('webpack-dev-server', 'Start a webpack-dev-server.', function() {
		var done = this.async();
		var options = _.merge(
			{
				port: 8080,
				host: undefined,
				keepalive: false,
				contentBase: ".",
				webpack: {
					context: ".",
					output: {
						path: "/"
					}
				},
				progress: true,
				inline: false,
				hot: false,
				stats: {
					colors: true,
					hash: false,
					timings: false,
					assets: true,
					chunks: false,
					chunkModules: false,
					modules: false,
					children: true
				}
			},
			getWithPlugins([this.name, "options"]),
			getWithPlugins([this.name, this.target]),
			mergeFunction
		);
		if(typeof options.contentBase === 'string' && !/^(https?:)?\/\//.test(options.contentBase))
			options.contentBase = path.resolve(process.cwd(), options.contentBase);
		[].concat(options.webpack).forEach(function(webpackOptions) {
			webpackOptions.context = path.resolve(process.cwd(), webpackOptions.context);
			if(webpackOptions.output && webpackOptions.output.path) {
				webpackOptions.output.path = path.resolve(process.cwd(), webpackOptions.output.path);
			}
		});

		var protocol = options.https ? "https" : "http";
		if(options.inline) {
			var devClient = ["webpack-dev-server/client?" + protocol + "://" + options.host + ":" + options.port];
			if(options.hot)
				devClient.push("webpack/hot/dev-server");
			[].concat(options.webpack).forEach(function(webpackOptions) {
				if (options.hot) webpackOptions.plugins = [].concat(webpackOptions.plugins, new webpack.HotModuleReplacementPlugin());
				if(typeof webpackOptions.entry === "object" && !Array.isArray(webpackOptions.entry)) {
					Object.keys(webpackOptions.entry).forEach(function(key) {
						webpackOptions.entry[key] = devClient.concat(webpackOptions.entry[key]);
					});
				} else {
					webpackOptions.entry = devClient.concat(webpackOptions.entry);
				}
			});
		}

		var compiler = webpack(options.webpack);

		if(options.progress) {
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

		(new WebpackDevServer(compiler, options)).listen(options.port, options.host, function() {
			grunt.log.writeln("\rwebpack-dev-server on port " + options.port + "  ");
			if(!options.keepAlive && !options.keepalive) done();
		});

	});

};
