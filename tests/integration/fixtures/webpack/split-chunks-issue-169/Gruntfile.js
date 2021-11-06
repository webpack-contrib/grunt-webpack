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
          filename: "[name].bundle.js",
        },
        plugins: [
          new webpack.DefinePlugin({ okey: JSON.stringify("dokey") }),
        ],
        optimization: {
          splitChunks: {
            cacheGroups: {
              common: {
                test: function (module) {
                  if (module.resource) {
                    return module.resource.includes('/uniquerandomfolder/');
                  }
                },
                name: 'common',
                minChunks: 1,
                minSize: 0,
                chunks: 'all'
              }
            }
          }
        }
      },
    },
  });

  loadGruntWebpackTasks(grunt);
};
