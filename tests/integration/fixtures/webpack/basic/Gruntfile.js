const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      test: {
        mode: "none",
        entry: path.join(__dirname, "entry"),
        output: {
          path: __dirname,
          filename: "output.js",
        },
        plugins: [
          new webpack.DefinePlugin({ okey: JSON.stringify("dokey") }),
        ],
      },
    },
  });

  loadGruntWebpackTasks(grunt);
};
