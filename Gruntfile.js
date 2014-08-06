var webpack = require("webpack");
module.exports = function(grunt) {
	grunt.loadTasks("tasks");
	grunt.initConfig({
		webpack: {
			a: {
				entry: "./example/entry",
				output: {
					path: "js",
					filename: "bundle.js"
				},
				plugins: [new webpack.DefinePlugin({
					ok: JSON.stringify("ok")
				})]
			}
		},
		"webpack-dev-server": {
			a: {
				webpack: {
					entry: "./example/entry",
					output: {
						path: "js",
						filename: "bundle.js"
					},
					plugins: [new webpack.DefinePlugin({
						ok: JSON.stringify("ok")
					})]
				},
				keepAlive: true
			}
		}
	});
};