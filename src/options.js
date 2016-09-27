var mergeWith = require('lodash/mergeWith');
var mergeCustomizer = require('./mergeCustomizer');
var path = require("path");
var map = require("lodash/map");
var isArray = require("lodash/isArray");
var createGetWithPlugins = require("./getWithPlugins");

var defaultGruntOptions = {
  failOnError : true,
  keepalive: false,
  progress: true,
  storeStatsTo: null,
  inline: false,
  hot: false,
};

var defaultWebpackOptions = {
  context: ".",
  output: {
    path: ".",
  },
  stats: {},
};

function getWebpackOptions(name, target, grunt) {
  var getWithPlugins = createGetWithPlugins(grunt);
  var options = mergeWith(
    {},
    defaultWebpackOptions,
    getWithPlugins([name, "options"]),
    getWithPlugins([name, target]),
    mergeCustomizer
  );

  convertPathsForObject(options, ["context", "recordsPath", "recordsInputPath", "recordsOutputPath"]);
  convertPathsForObject(options.output, ["path"]);
  convertPathsForObject(options.resolve, ["root", "fallback"]);
  convertPathsForObject(options.resolveLoader, ["root", "fallback"]);

  if (options.module && options.module.loaders) {
    options.module.loaders.forEach(function(l){
      convertPathsForObject(l, ["test", "include", "exclude"]);
    });
  }

  return Object.keys(defaultGruntOptions).reduce(function(prev, cur) {
    delete prev[cur];
    return prev;
  }, options);
}

function getGruntOptions(name, target, grunt) {
  var getWithPlugins = createGetWithPlugins(grunt);
  var options = mergeWith(
    {},
    defaultGruntOptions,
    getWithPlugins([name, "options"]),
    getWithPlugins([name, target]),
    mergeCustomizer
  );

  return Object.keys(defaultGruntOptions).reduce(function(prev, cur) {
    prev[cur] = options[cur];
    return prev;
  }, {});
}

function convertPathsForObject(obj, props){
  if (obj){
    props.forEach(function(prop) {
      if(obj[prop] != undefined) {
        obj[prop] = convertPath(obj[prop]);
      }
    });
  }
}

function convertPath(pth) {
  if(typeof pth === 'string'){
    return path.resolve(process.cwd(), pth);
  }
  else if(isArray(pth)){
    return map(pth, function(p){
      // Arrays of paths can contain a mix of both strings and RegExps
      if(typeof p === 'string'){
        return path.resolve(process.cwd(), p);
      }
      return p;
    });
  }
  // It may have been a RegExp so just send it back
  return pth;
}

exports.getGruntOptions = getGruntOptions;
exports.getWebpackOptions = getWebpackOptions;
