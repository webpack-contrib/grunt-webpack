var isArray = require("lodash/isArray");
var mergeWith = require("lodash/mergeWith");

module.exports = function mergeCustomizer(a, b) {
  if (isArray(a)) {
    if (isArray(b)) {
      return a.concat(b);
    } else {
      return a.map(function(item) {
        return mergeWith({}, { x: item }, { x: b }, mergeCustomizer).x;
      });
    }
  } else if (isArray(b)) {
    return b.map(function(item) {
      return mergeWith({}, { x: a }, { x: item }, mergeCustomizer).x;
    });
  }
};
