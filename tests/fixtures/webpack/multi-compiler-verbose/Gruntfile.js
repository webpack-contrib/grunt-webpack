const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      options: {
        plugins: [
          new webpack.optimize.UglifyJsPlugin(),
        ],
      },
      test: [
        {
          entry: path.join(__dirname, "entry"),
          output: {
            path: __dirname,
            filename: "bundle.js",
          },
          plugins: [
            new webpack.BannerPlugin("this is a banner"),
          ],
        },
        {
          entry: path.join(__dirname, "entry2"),
          output: {
            path: __dirname,
            filename: "bundle2.js",
          }
        },
      ],
    },
  });

  loadGruntWebpackTasks(grunt);
};
