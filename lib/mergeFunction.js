var isArray = require("lodash/isArray");
var merge = require("lodash/merge");

module.exports = function(grunt) {

	function mergeFunction(a, b) {
		if(isArray(a) && isArray(b)) {
			return a.concat(b);
		}
		if(isArray(a) && !isArray(b)) {
			return a.map(function(item) {
				return merge({}, {x:item}, {x:b}, mergeFunction).x;
			});
		}
		if(isArray(b) && !isArray(a)) {
			return b.map(function(item) {
				return merge({}, {x:a}, {x:item}, mergeFunction).x;
			});
		}
	}

	return mergeFunction;

};
