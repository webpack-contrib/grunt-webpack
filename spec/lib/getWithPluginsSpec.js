var webpack = require("webpack");
var grunt = require('grunt');
var getWithPluginsFactory = require('../../lib/getWithPlugins');
var DefinePlugin = webpack.DefinePlugin;
var taskName;
var target;
var gruntConfigFactory = function(grunt) {
	taskName = 'webpack';
	target = 'a';
	var config = {};
	config[taskName] = {};
	config[taskName][target] = {
		entry: "./example/entry",
		output: {
			path: "js",
			filename: "bundle.js"
		},
		foo: {
			plugins: ['foo']
		},
		plugins: [new webpack.DefinePlugin({
			ok: JSON.stringify("ok")
		})]
	};

	grunt.initConfig(config);

	return grunt.config();
};


describe('getWithPlugins', function() {

	var getWithPlugins;
	var config;
	var namespace;
	beforeEach(function() {
		config = gruntConfigFactory(grunt);
		getWithPlugins = getWithPluginsFactory(grunt);
		namespace = [taskName, target];
	});


	it('should fix plugins property in webpack config', function() {
		expect(getWithPlugins(namespace).plugins[0].constructor)
			.toBe(DefinePlugin);
	});

	it('should fix only top level property `plugins`', function() {
		expect(getWithPlugins(namespace).foo.plugins)
			.toEqual(['foo']);
	});
});
