'use strict';

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

function ensureWebpackOptions(options) {
  if (!options.context) {
    options.context = webpackOptions.context;
  }

  if (!options.output) {
    options.output = webpackOptions.output;
  } else if (!options.output.path) {
    options.output.path = webpackOptions.output.path;
  }

  if (!options.stats) {
    options.stats = webpackOptions.stats;
  }

  return options;
}

exports.gruntOptions = gruntOptions;
exports.ensureWebpackOptions = ensureWebpackOptions;

