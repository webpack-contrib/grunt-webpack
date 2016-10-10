'use strict';

const mergeWith = require('lodash/mergeWith');

const gruntOptions = {
  failOnError: true,
  keepalive: false,
  progress: true,
  storeStatsTo: null,
  inline: false,
  hot: false,
};

const webpackOptions = {
  context: '.',
  output: {
    path: '.',
  },
  stats: {},
};

function mergeCustomize(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.concat(b);
  }
}

function mergeOptions(options, targetOptions) {
  let result;
  if (Array.isArray(targetOptions)) {
    result = targetOptions.map(opt => mergeWith({}, webpackOptions, options, opt, mergeCustomize));
  } else {
    result = mergeWith({}, webpackOptions, options, targetOptions, mergeCustomize);
  }

  return result;
}

exports.gruntOptions = gruntOptions;
exports.mergeOptions = mergeOptions;

