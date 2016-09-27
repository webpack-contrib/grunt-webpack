'use strict';
const path = require('path');

function resolvePath(inputPath) {
  if (typeof inputPath === 'string') {
    return path.resolve(process.cwd(), inputPath);
  }

  return inputPath;
}

function convertPath(inputPath) {
  if (Array.isArray(inputPath)) {
    return inputPath.map(resolvePath);
  }

  // It may have been a RegExp so just send it back
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
  convertPathsForObject(options, ['context', 'recordsPath', 'recordsInputPath', 'recordsOutputPath']);
  convertPathsForObject(options.output, ['path']);
  convertPathsForObject(options.resolve, ['root', 'fallback']);
  convertPathsForObject(options.resolveLoader, ['root', 'fallback']);

  if (options.module && options.module.loaders) {
    options.module.loaders.forEach((loader) => {
      convertPathsForObject(loader, ['test', 'include', 'exclude']);
    });
  }

  return options;
}

module.exports = convertPathsForOptions;
