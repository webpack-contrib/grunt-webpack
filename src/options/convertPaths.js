'use strict';
const path = require('path');

function resolvePath(inputPath) {
  if (typeof inputPath === 'string') {
    return path.resolve(process.cwd(), inputPath);
  }

  // It may have been a RegExp so just send it back
  return inputPath;
}

function convertPath(inputPath) {
  if (Array.isArray(inputPath)) {
    return inputPath.map(resolvePath);
  }

  return resolvePath(inputPath);
}

function convertPathsForObject(obj, props) {
  if (!obj) return;

  props.forEach(prop => {
    if (obj[prop] != undefined) {
      obj[prop] = convertPath(obj[prop]);
    }
  });
}

function convertPathsForOptions(options) {
  const contentBase = options.contentBase;
  // contentBase as url and number is depreacted and will be removed from dev-server at some point
  if (typeof contentBase === 'string' && !/^(https?:)?\/\//.test(contentBase)) {
    convertPathsForObject(options, ['contentBase']);
  }
  convertPathsForObject(options, ['context', 'recordsPath', 'recordsInputPath', 'recordsOutputPath']);
  convertPathsForObject(options.output, ['path']);
  convertPathsForObject(options.resolve, ['root', 'fallback']);
  convertPathsForObject(options.resolveLoader, ['root', 'fallback']);

  if (options.module && Array.isArray(options.module.rules)) {
    options.module.rules.forEach((rule) => {
      convertPathsForObject(rule, ['test', 'include', 'exclude']);
    });
  }

  if (options.webpack) {
    if (Array.isArray(options.webpack)) {
      options.webpack = options.webpack((opts) => convertPathsForOptions(opts));
    } else {
      options.webpack = convertPathsForOptions(options.webpack);
    }
  }

  return options;
}

module.exports = convertPathsForOptions;
