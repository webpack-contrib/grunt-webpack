const path = require("path");

const config = {
  mode: "none",
  entry: {
    main: "./main.js",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: ["babel-loader"],
      },
    ],
  },
};

module.exports = config;
