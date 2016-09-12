var plugins = [];
try {
	var webpack = require("webpack");
	plugins.push(new webpack.DefinePlugin({
		ok: JSON.stringify("ok")
	}));
} catch (e) {

}
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
				plugins: plugins
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
					plugins: plugins
				},
				keepalive: true
			}
		}
	});
};
