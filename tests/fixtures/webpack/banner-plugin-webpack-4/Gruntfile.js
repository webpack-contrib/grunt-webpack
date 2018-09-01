const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: {
      copyright: 'Webpack',
      version: '6.55.345',
    },
    webpack: {
      test: {
        entry: path.join(__dirname, "entry"),
        output: {
          path: __dirname,
          filename: "output.js",
        },
        plugins: [
          new webpack.BannerPlugin({
            banner: '/*! <%= pkg.copyright %> - Version <%= pkg.version %> dated <%= grunt.template.today() %> */',
            raw: true,
          }),
        ],
      },
    },
  });

  loadGruntWebpackTasks(grunt);
};
