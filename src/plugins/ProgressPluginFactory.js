'use strict';
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

class ProgressPluginFactory {

  constructor(grunt) {
    this.grunt = grunt;
  }

  addPlugin(target, compiler) {
    let chars = 0;
    compiler.apply(new ProgressPlugin((percentage, msg) => {
      if (percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = percentage + '% ' + msg;
        if (percentage < 100) msg = ' ' + msg;
        if (percentage < 10) msg = ' ' + msg;
      }
      for (; chars > msg.length; chars--)
        this.grunt.log.write('\b \b');
      chars = msg.length;
      for (let i = 0; i < chars; i++)
        this.grunt.log.write('\b');
      this.grunt.log.write(msg);
    }));
  }
}

module.exports = ProgressPluginFactory;
