/*
 * grunt-webpack
 * https://github.com/sokra/grunt-webpack
 *
 * Copyright (c) 2012 Tobias Koppers @sokra
 * Licensed under the MIT license.
 */

var path = require("path");
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
		webpack(input, options, function(err, stats) {
			if(err) {
				grunt.log.error(err);
				done(false);
			}
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
