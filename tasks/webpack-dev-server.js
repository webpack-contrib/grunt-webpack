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
			function(a, b) {
				return grunt.util._.isArray(a) && grunt.util._.isArray(b) ? a.concat(b) : undefined;
			}
		);
		if(!/^(https?:)?\/\//.test(options.contentBase))
			options.contentBase = path.resolve(process.cwd(), options.contentBase);
		options.webpack.context = path.resolve(process.cwd(), options.webpack.context);
		if(!/^\//.test(options.webpack.output.path))
			options.webpack.output.path = "/" + options.webpack.output.path;

		var compiler = webpack(options.webpack);

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

		(new WebpackDevServer(compiler, options)).listen(options.port, options.host, function() {
			grunt.log.writeln("\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\bwebpack-dev-server on port " + options.port);
			if(!options.keepAlive && !options.keepalive) done();
		});

	});

};
