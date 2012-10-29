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

	var webpack = require("webpack");

	grunt.registerMultiTask('webpack', 'Webpack files.', function() {
		var done = this.async();

		// Get options from this.data
		var options = this.data;
		var input = path.join(process.cwd(), grunt.template.process(options.src));
		var output = path.join(process.cwd(), grunt.template.process(options.dest));
		var statsTarget = options.statsTarget;

		// Default values
		if(!options.outputDirectory) options.outputDirectory = path.dirname(output);
		if(!options.output) options.output = path.basename(output);
		if(!options.outputPostfix) options.outputPostfix = "." + path.basename(output);
		if(!options.events) options.events = new (require("events").EventEmitter)();

		var events = options.events;
		var sum = 0;
		var finished = 0;
		var chars = 0;
		function print() {
			var msg = "";
			if(sum > 0) {
				msg += "compiling... (";
				msg += String(sprintf("%4s", finished+"") + "/" + sprintf("%4s", sum+"")).yellow.bold;
				msg += String(" " + sprintf("%4s", Math.floor(finished*100/sum)+"%")).yellow.bold;
				msg += ")";
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
				grunt.log.writeln(name + " " +  "done".green.bold);
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
