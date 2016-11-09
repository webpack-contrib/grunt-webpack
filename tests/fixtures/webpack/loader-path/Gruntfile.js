const loadGruntWebpackTasks = require('../../../utils/loadGruntWebpackTasks');

module.exports = function (grunt) {
    grunt.initConfig({
        webpack: {
            options: require('./webpack.config.js'),
            dev: {}
        }
    });

    loadGruntWebpackTasks(grunt);
};
