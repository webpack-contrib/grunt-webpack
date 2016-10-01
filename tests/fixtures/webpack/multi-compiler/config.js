var path = require("path");
var webpack = require("webpack");

module.exports = {
  grunt: [
    {
      entry: path.join(__dirname, "entry"),
      output: {
        path: path.join(__dirname, "actual"),
        filename: "bundle.js",
      },
      plugins: [
        new webpack.BannerPlugin("this is a banner"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),],
    },
    {
      entry: path.join(__dirname, "entry2"),
      output: {
        path: path.join(__dirname, "actual"),
        filename: "bundle2.js",
      },
      plugins: [
        new webpack.BannerPlugin("this is a banner"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),],
    },
  ],
};
