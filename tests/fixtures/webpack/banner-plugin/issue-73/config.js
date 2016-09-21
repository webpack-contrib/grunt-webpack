var webpack = require("webpack");
var path = require("path");

module.exports = {
  grunt: {
    entry: path.join(__dirname, "entry"),
    output: {
      path: path.join(__dirname, "actual"),
      filename: "bundle.js",
    },
    plugins: [
      new webpack.BannerPlugin("this is a banner"),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ],
  },
};
