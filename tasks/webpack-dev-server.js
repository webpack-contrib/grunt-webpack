'use strict';
const webpack = require('webpack');
const OptionHelper = require('../src/options/WebpackDevServerOptionHelper');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');

module.exports = (grunt) => {
  let WebpackDevServer;
  try {
    WebpackDevServer = require('webpack-dev-server');
  } catch (err) {
    grunt.registerTask('webpack-dev-server', 'webpack-dev-server not installed.', () => {
      grunt.fail.fatal(
        `webpack-dev-server is currently not installed, this task will do nothing.

To fix this problem install webpack-dev-server by doing either
yarn add webpack-dev-server --dev
or
npm install --save-dev webpack-dev-server 
`);
    });
    return;
  }

  if (typeof WebpackDevServer.addDevServerEntrypoints !== 'function') {
    grunt.fail.fatal('webpack-dev-server is outdated. Please ensure you have at least version 2.4.0 installed.');
  }

  const processPluginFactory = new ProgressPluginFactory(grunt);

  grunt.registerMultiTask('webpack-dev-server', 'Start a webpack-dev-server.', function webpackDevServerTask() {
    const done = this.async();
    const optionHelper = new OptionHelper(grunt, this);
    const opts = optionHelper.getOptions();
    const webpackOptions = optionHelper.getWebpackOptions();

    WebpackDevServer.addDevServerEntrypoints(webpackOptions, opts);

    if (opts.inline && (opts.hotOnly || opts.hot)) {
      webpackOptions.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    const compiler = webpack(webpackOptions);

    if (opts.progress) processPluginFactory.addPlugin(this.target, compiler);

    (new WebpackDevServer(compiler, optionHelper.getWebpackDevServerOptions())).listen(opts.port, opts.host, () => {
      grunt.log.writeln(`\rwebpack-dev-server listening on ${opts.host}:${opts.port}`);
      if (!opts.keepalive) done();
    });
  });
};
