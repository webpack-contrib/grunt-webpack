module.exports = function(grunt) {
	grunt.loadTasks("tasks");
	grunt.initConfig({
		webpack: {
			a: {
				entry: "./example/entry",
				output: {
					path: "js",
					filename: "bundle.js"
				}
			}
		},
		"webpack-dev-server": {
			a: {
				webpack: {
					entry: "./example/entry"
				}
			}
		}
	});
};