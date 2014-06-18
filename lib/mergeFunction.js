var _ = require("lodash");

module.exports = function(grunt) {

	function mergeFunction(a, b) {
		if(_.isArray(a) && _.isArray(b)) {
			return a.concat(b);
		}
		if(_.isArray(a) && !_.isArray(b)) {
			return a.map(function(item) {
				return _.merge({}, {x:item}, {x:b}, mergeFunction).x;
			});
		}
		if(_.isArray(b) && !_.isArray(a)) {
			return b.map(function(item) {
				return _.merge({}, {x:a}, {x:item}, mergeFunction).x;
			});
		}
	}
	
	return mergeFunction;

};
