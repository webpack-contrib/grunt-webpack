const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      test: {
        entry: [
          // Since extension is not given, files are not expanded but grunt template strings should still be
          '<%= globbingFilesTest.messages %>/hello',
          '<%= globbingFilesTest.messages %>/world'
        ],
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
