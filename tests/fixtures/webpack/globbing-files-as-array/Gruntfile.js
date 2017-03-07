const path = require('path');
const webpack = require('webpack');
const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
  const messagesDir = path.join(__dirname, 'messages');

  grunt.initConfig({
    webpack: {
      test: {
        entry: [
          // Combining globbing support with exact path
          '<%= globbingFilesTest.messages %>/*.js',
          path.join(messagesDir, 'welcome.txt')
        ],
        output: {
          path: __dirname,
          filename: "output.js",
        }
      }
    }
  });

  grunt.config.set('globbingFilesTest.messages', messagesDir);

  loadGruntWebpackTasks(grunt);
};
