// http://docs.angularjs.org/guide/di
/**
 * @fileoverview
 * @author Nate Wilkins
 */
"use strict";

var Errors = {
	DINotation: {
		ToBeArray: "Expected di-notation to be an array.",
		ToBeFunction: "Expected di-notation to be a function.",
		MissingDependencies: function (deps) { return "Di-notation is missing " + deps + " dependencies."; },
		Dependencies: {
			ToBeStrings: "Expected all di-notation dependencies to be string literals."
		},
		LastArgFunction: {
			ToBeFunction: "Expected last di-notation argument to be a function.",
			MissingDependencies: function (deps) { return "Di-notation function is missing" + deps + " dependencies."; },
			Dependencies: {
				ToBeIdentifiers: "Expected identifier name for all di-notation function parameters.",
				ToBeSameAsDINotationDependencies: "Expected all di-notation dependencies to be the same value as the di-notation function parameter names."
			}
		}
	}
};

var selectors = require('../helpers/selectors');

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

	var validators = {
		validate: function (node) {
			var type = this[node.type];
			if (!type) { return null; }

			var option = selectors.is(node);
			if (!option) { return null; }

			var validator = type[option];
			while (typeof validator === 'string') { validator = this[validator]; }
			if (typeof validator !== 'function' || !validator(node)) { return null; }
			return option;
		},

		"CallExpression": {
			"config": function (node) {
				return validateNotation(node.arguments[0]);
			},

			"invoke": function (node) {
				return validateNotation(node.arguments[1]);
			},

			"controller": function (node) {
				return validateNotation(node.arguments[1]);
			},

			"run": "config",
			"annotate": "invoke",
			"decorator": "controller",
			"directive": "controller",
			"service": "controller",
			"factory": "controller"
		},

		"AssignmentExpression": {
			"$get": function (node) {
				return validateNotation(node.right);
			}
		},

		"ObjectExpression": {
			"$get": function (node) {
				return validateNotation(node);
			},

			"controller": "$get"
		}
	};

	var validateNotation = function (diNotationNode) {
		// DI Notation: - Type -
		if (diNotationNode.type !== "ArrayExpression") {
			// DI Notation: FunctionExpression
			if (config.notation === "arr") {
				if (diNotationNode.type === "FunctionExpression" && diNotationNode.params.length === 0 && config.ignoreEmpty) {
					return null;
				}
				return context.report(diNotationNode, Errors.DINotation.ToBeArray);
			}
			if (diNotationNode.type !== "FunctionExpression") {
				return context.report(diNotationNode, Errors.DINotation.ToBeFunction);
			}
			return null;
		}

		// DI Notation: ArrayExpression
		if (config.notation === "fn") {
			return context.report(diNotationNode, Errors.DINotation.ToBeFunction);
		}
		var lastDiFnArg = diNotationNode.elements[diNotationNode.elements.length - 1];
		var depsCount = diNotationNode.elements.length - 1;

		// - Last Element FunctionExpression
		if (lastDiFnArg.type !== "FunctionExpression") {
			return context.report(lastDiFnArg, Errors.DINotation.LastArgFunction.ToBeFunction);
		}

		// - Compare Parameter Identifiers with Notation Literals
		if (lastDiFnArg.params.length < depsCount) {
			return context.report(lastDiFnArg, Errors.DINotation.MissingDependencies(depsCount - lastDiFnArg.params.length));
		}
		if (lastDiFnArg.params.length > depsCount) {
			return context.report(diNotationNode, Errors.DINotation.LastArgFunction.MissingDependencies(lastDiFnArg.params.length - depsCount));
		}

		// Check all dependency elements except lastDiFnArg
		for (var i = 0; i < diNotationNode.elements.length - 1; i++) {
			var element = diNotationNode.elements[i];
			var param = lastDiFnArg.params[i];

			// - Requires 'Simple' Parameters
			if (element.type !== "Literal") {
				return context.report(element, Errors.DINotation.Dependencies.ToBeStrings);
			}
			if (param.type !== "Identifier") {
				return context.report(param, Errors.DINotation.LastArgFunction.Dependencies.ToBeIdentifiers);
			}

			// - Requires Same Dependency ID
			if (config.sameID && element.value !== param.name) {
				return context.report(diNotationNode, Errors.DINotation.LastArgFunction.Dependencies.ToBeSameAsDINotationDependencies);
			}
		}

		return null;
	};

	var validate = function (node) { return validators.validate(node); };

	return {
		"CallExpression": validate,
		"AssignmentExpression": validate,
		"ObjectExpression": validate
	};
};

rule.Errors = Errors;
