const path = require('path');

function loadGruntWebpackTasks(grunt) {
  grunt.loadTasks(path.join(__dirname, '../../tasks'));
}

module.exports = loadGruntWebpackTasks;
