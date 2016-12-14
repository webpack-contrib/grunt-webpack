'use strict';
const webpack = require('webpack');
const OptionHelper = require('../src/options/WebpackDevServerOptionHelper');
const ProgressPluginFactory = require('../src/plugins/ProgressPluginFactory');
const HotModuleReplacementPluginFactory = require('../src/plugins/HotModuleReplacementPluginFactory');

module.exports = (grunt) => {
  let WebpackDevServer;
  try {
    WebpackDevServer = require('webpack-dev-server');
  } catch (err) {
    grunt.registerTask('webpack-dev-server', 'webpack-dev-server not installed.', () => {
      grunt.fail.fatal(
        `webpack-dev-server is currently not installed, this task will do nothing.

To fix this problem install webpack-dev-server by doing either
npm install --save webpack-dev-server 
or 
yarn add webpack-dev-server`);
    });
    return;
  }

  const processPluginFactory = new ProgressPluginFactory(grunt);
  const hotModuleReplacementPluginFactory = new HotModuleReplacementPluginFactory(grunt);

  grunt.registerMultiTask('webpack-dev-server', 'Start a webpack-dev-server.', function webpackDevServerTask() {
    const done = this.async();
    const optionHelper = new OptionHelper(grunt, this);

    const opts = {
      host: optionHelper.get('host'),
      hot: optionHelper.get('hot'),
      https: optionHelper.get('https'),
      inline: optionHelper.get('inline'),
      keepalive: optionHelper.get('keepalive'),
      port: optionHelper.get('port'),
      progress: optionHelper.get('progress')
    };

    const webpackOptions = optionHelper.getWebpackOptions();

    if (opts.inline) {
      const protocol = opts.https ? 'https' : 'http';
      const devClient = [
        `webpack-dev-server/client?${protocol}://${opts.host}:${opts.port}`
      ];
      if (opts.hot) devClient.push('webpack/hot/dev-server');

      // TODO can ww extract that and make it nice
      [].concat(webpackOptions).forEach((webpackOptions) => {
        if (typeof webpackOptions.entry === 'object' && !Array.isArray(webpackOptions.entry)) {
          Object.keys(webpackOptions.entry).forEach((key) => {
            webpackOptions.entry[key] = devClient.concat(webpackOptions.entry[key]);
          });
        } else {
          webpackOptions.entry = devClient.concat(webpackOptions.entry);
        }
      });
    }

    const compiler = webpack(webpackOptions);

    if (opts.progress) processPluginFactory.addPlugin(this.target, compiler);

    // TODO does this work? or do we add the module in the initial config?
    if (opts.inline && opts.hot) hotModuleReplacementPluginFactory.addPlugin(this.target, compiler);

    (new WebpackDevServer(compiler, optionHelper.getWebpackDevServerOptions())).listen(opts.port, opts.host, () => {
      grunt.log.writeln(`\rwebpack-dev-server on port ${opts.port}  `);
      if (!opts.keepalive) done();
    });
  });
};
