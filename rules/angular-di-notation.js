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

	var nodeTypes = {
		"CallExpression": {
			selector: function (node) {
				return node.callee.name || (node.callee.property ? node.callee.property.name : "");
			},
			options: {
				"config": {
					is: function (node) {
						return node.arguments[0].type === "ArrayExpression" ||
							node.arguments[0].type === "FunctionExpression";
					},
					validate: function (node) {
						return validateNotation(node.arguments[0]);
					}
				},

				"invoke": {
					is: function (node) {
						return node.arguments.length >= 2 &&
							node.callee.object &&
							node.callee.object.name &&
							node.callee.object.name === "$injector" &&
							node.arguments[0].type === "Literal" &&
								(node.arguments[1].type === "ArrayExpression" ||
								node.arguments[1].type === "FunctionExpression");
					},
					validate: function (node) {
						return validateNotation(node.arguments[1]);
					}
				},

				"controller": {
					is: function (node) {
						return node.arguments.length >= 2 &&
							node.arguments[0].type === "Literal" &&
							(node.arguments[1].type === "ArrayExpression" ||
								node.arguments[1].type === "FunctionExpression");
					},
					validate: function (node) {
						return validateNotation(node.arguments[1]);
					}
				},

				"run": "config",

				"annotate": "invoke",

				"decorator": "controller",
				"directive": "controller",
				"service": "controller",
				"factory": "controller"
			}
		},
		"AssignmentExpression": {
			selector: function (node) {
				return node.left.name || node.left.property.name;
			},
			options: {
				"$get": {
					is: function (node) {
						return node.operator === "=" &&
							node.left.type === "MemberExpression" &&
							node.left.object.type === "ThisExpression" &&
							node.left.property.type === "Identifier";
					},
					validate: function (node) {
						validateNotation(node.right);
					}
				}
			}
		},
		"ObjectExpression": {
			selector: function () {
				return function (option, node) {
					for (var i = 0; i < node.properties.length; i++) {
						var property = node.properties[i];
						if (property.key.name !== option) { continue; }
						this.matches(property.value);
					}
				};
			},
			options: {
				"$get": {
					is: function (node) {
						return node.type === "ArrayExpression" || node.type === "FunctionExpression";
					},
					validate: function (node) {
						return validateNotation(node);
					}
				},
				"controller": "$get"
			}
		}
	};

	var executeOption = function (option, node) {
		if (option && option.is && option.is(node)) {
			return option.validate(node);
		}
		return null;
	};

	var getOption = function (options, selectId){
		var option = options[selectId];
		if (typeof option === "string") { option = options[option]; }
		return option;
	};

	var validate = function (node) {
		var checkType = nodeTypes[node.type];
		if (!checkType) { return; }

		var select = checkType.selector(node);
		if (typeof select === "function") {
			var getMatchesContext = function (option) {
				return function (selectedNode) {
					return executeOption(getOption(checkType.options, option), selectedNode || node);
				};
			};

			for (var o in checkType.options) {
				if (!checkType.options.hasOwnProperty(o)) { continue; }
				select.call({ matches: getMatchesContext(o) }, o, node);
			}
		}

		executeOption(getOption(checkType.options, select), node);
	};

	return {
		"CallExpression": validate,
		"AssignmentExpression": validate,
		"ObjectExpression": validate
	};
};

rule.Errors = Errors;
