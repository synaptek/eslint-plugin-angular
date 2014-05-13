// http://docs.angularjs.org/guide/di
/**
 * @fileoverview
 * @author Nate Wilkins
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

var rule = module.exports = function (context) {
	var config = {
		notation: context.options[0] === "arr" || context.options[0] === "fn" ? context.options[0] : "arr",
		sameID: context.options[1] !== undefined ? context.options[1] : true,
		ignoreEmpty: context.options[2] !== undefined ? context.options[2] : true,
		inline: context.options[3] !== undefined ? context.options[3] : true
	};
};
