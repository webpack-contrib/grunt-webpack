'use strict';
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

class ProgressPluginFactory {

  constructor(grunt) {
    this.grunt = grunt;
    this.lineCaretPosition = 0;
    this.lastState = 0;
    this.lastStateTime = 0;
  }

  addPlugin(compiler, options) {
    compiler.apply(new ProgressPlugin(function (percentage, msg) {
      let state = msg;
      const details = Array.prototype.slice.call(arguments, 2);
      if (percentage < 1) {
        percentage = Math.floor(percentage * 100);
        msg = `${percentage}% ${msg}`;
        if (percentage < 100) msg = ` ${msg}`;
        if (percentage < 10) msg = ` ${msg}`;

        details.forEach(detail => {
          if (!detail) return;
          if (detail.length > 40) {
            detail = `...${detail.substr(detail.length - 37)}`;
          }
          msg += ` ${detail}`;
        });
      }

      if (options.profile) {
        state = state.replace(/^\d+\/\d+\s+/, '');
        if (percentage === 0) {
          this.lastState = null;
          this.lastStateTime = +new Date();
        } else if (state !== this.lastState || percentage === 1) {
          const now = +new Date();
          if (this.lastState) {
            const stateMsg = `${now - this.lastStateTime}ms ${this.lastState}`;
            this.goToLineStart(stateMsg);
            this.grunt.log.write(stateMsg + '\n');
            this.lineCaretPosition = 0;
          }
          this.lastState = state;
          this.lastStateTime = now;
        }
      }

      this.goToLineStart(msg);
      this.grunt.log.write(msg);
    }.bind(this)));
  }

  goToLineStart(nextMessage) {
    let str = '';
    for (; this.lineCaretPosition > nextMessage.length; this.lineCaretPosition--) {
      str += '\b \b';
    }
    for (let i = 0; i < this.lineCaretPosition; i++) {
      str += '\b';
    }
    this.lineCaretPosition = nextMessage.length;
    if (str) this.grunt.log.write(str);
  }
}

module.exports = ProgressPluginFactory;
