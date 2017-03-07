const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  grunt.initConfig({
    webpack: {
      test: {
        // Should work when this is an object too
        entry: {
            h: '<%= globbingFilesTest.messages %>/h*.js',
            w: '<%= globbingFilesTest.messages %>/w*.js'
        },
        output: {
          path: __dirname,
          filename: "output-[name].js",
        }
      }
    }
  });

  grunt.config.set('globbingFilesTest.messages', path.join(__dirname, 'messages'));

  loadGruntWebpackTasks(grunt);
};
