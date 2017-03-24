const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      test: {
        // Should be able to process the grunt template string and find all files matching pattern
        entry: '<%= globbingFilesTest.messages %>/*.js',
        output: {
          path: __dirname,
          filename: "output.js",
        }
      }
    }
  });

  grunt.config.set('globbingFilesTest.messages', path.join(__dirname, 'messages'));

  loadGruntWebpackTasks(grunt);
};
