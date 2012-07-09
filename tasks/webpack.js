/*
 * grunt-webpack
 * https://github.com/sokra/grunt-webpack
 *
 * Copyright (c) 2012 Tobias Koppers @sokra
 * Licensed under the MIT license.
 */

var path = require("path");
var sprintf = require("sprintf").sprintf;
module.exports = function(grunt) {

	grunt.registerMultiTask('webpack', 'Webpack files.', function() {
		var webpack = require("webpack");
		var input = path.join(process.cwd(), this.file.src);
		var output = path.join(process.cwd(), this.file.dest);
		var statsTarget = this.data.statsTarget;
		var options = this.data;
		if(!options.outputDirectory) options.outputDirectory = path.dirname(output);
		if(!options.output) options.output = path.basename(output);
		if(!options.outputPostfix) options.outputPostfix = "." + path.basename(output);
		var done = this.async();

		if(!options.events) options.events = new (require("events").EventEmitter)();
		var events = options.events;

		var sum = 0;
		var finished = 0;
		var chars = 0;
		function c(str) {
			return str;
		}
		function print() {
			var msg = "";
			if(sum > 0) {
				msg += "compiling... (" + c("\033[1m\033[33m");
				msg += sprintf("%4s", finished+"") + "/" + sprintf("%4s", sum+"");
				msg += " " + sprintf("%4s", Math.floor(finished*100/sum)+"%");
				msg += c("\033[39m\033[22m") + ")";
			}
			for(var i = 0; i < chars; i++)
				grunt.log.write("\b");
			grunt.log.write(msg);
			chars = msg.length;
		}
		events.on("task", function(name) {
			sum++;
			print();
		});
		events.on("task-end", function(name) {
			finished++;
			if(name) {
				for(var i = 0; i < chars; i++)
					grunt.log.write("\b \b");
				grunt.log.write(name + " " + c("\033[1m\033[32m") + "done" + c("\033[39m\033[22m") + "\n");
				chars = 0;
			}
			print();
		});
		events.on("bundle", function(name) {
			sum = 0;
			finished = 0;
			for(var i = 0; i < chars; i++)
				grunt.log.write("\b \b");
			chars = 0;
		});
		webpack(input, options, function(err, stats) {
			if(err) {
				grunt.log.error(err);
				done(false);
			}
			if(stats.warnings)
				stats.warnings.forEach(grunt.log.writeln.bind(grunt.log));
			if(stats.errors)
				stats.errors.forEach(grunt.warn);
			if(statsTarget) {
				var st;
				if(typeof statsTarget === "string")
					st = statsTarget;
				else if(statsTarget)
					st = statsTarget[index];
				if(st)
					grunt.config.set(st, stats);
			}
			done();
		});
	});

};
