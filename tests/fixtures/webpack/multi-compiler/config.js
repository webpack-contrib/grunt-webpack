var path = require("path");

module.exports = {
  grunt: [
    {
      entry: path.join(__dirname, "entry"),
      output: {
        path: path.join(__dirname, "actual"),
        filename: "bundle.js",
      },
      plugins: [],
    },
    {
      entry: path.join(__dirname, "entry2"),
      output: {
        path: path.join(__dirname, "actual"),
        filename: "bundle2.js",
      },
      plugins: [],
    },
  ],
};
