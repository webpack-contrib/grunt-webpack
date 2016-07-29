var isArray = require("lodash/isArray");
var mergeWith = require("lodash/mergeWith");

module.exports = function mergeFunction(a, b) {
	if(isArray(a) && isArray(b)) {
		return a.concat(b);
	}
	if(isArray(a) && !isArray(b)) {
		return a.map(function(item) {
			return mergeWith({}, {x:item}, {x:b}, mergeFunction).x;
		});
	}
	if(isArray(b) && !isArray(a)) {
		return b.map(function(item) {
			return mergeWith({}, {x:a}, {x:item}, mergeFunction).x;
		});
	}
};
