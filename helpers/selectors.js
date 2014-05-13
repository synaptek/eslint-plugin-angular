// http://docs.angularjs.org/guide/di
/**
 * @fileoverview
 * @author Nate Wilkins
 */
"use strict";

var selectors = module.exports = {
	is: function (node) {
		var type = this[node.type];
		if (!type) { return null; }

		var selectedOptions = [],
			selectedOption = type.selector(node),
			confirm = function (option) {
				var confirmOption = type.options[option];
				while (typeof confirmOption === 'string') { confirmOption = type.options[confirmOption]; }
				if (typeof confirmOption !== 'function' || !confirmOption(node)) { return null; }
				return option;
			};

		if (typeof selectedOption === 'function') {
			var context = { yield: function (option) { if (confirm(option)) { selectedOptions.push(option); } } };

			for (var o in type.options) {
				if (!type.options.hasOwnProperty(o)) { continue; }

				var result = selectedOption.call(context, o, node);
				if (typeof result === 'string' && confirm(result)) {
					selectedOptions.push(result);
				}

				return selectedOptions.length === 1 ? selectedOptions[0] : (selectedOptions.length <= 0 ? null : selectedOptions);
			}
		}

		return confirm(selectedOption);
	},

	"CallExpression": {
		selector: function (node) {
			return node.callee.name || (node.callee.property ? node.callee.property.name : "");
		},
		options: {
			"config": function (node) {
				return node.arguments[0].type === "ArrayExpression" ||
					node.arguments[0].type === "FunctionExpression";
			},

			"invoke": function (node) {
				return node.arguments.length >= 2 &&
					node.callee.object &&
					node.callee.object.name &&
					node.callee.object.name === "$injector" &&
					node.arguments[0].type === "Literal" &&
					(node.arguments[1].type === "ArrayExpression" ||
						node.arguments[1].type === "FunctionExpression");
			},

			"controller": function (node) {
				return node.arguments.length >= 2 &&
					node.arguments[0].type === "Literal" &&
					(node.arguments[1].type === "ArrayExpression" ||
						node.arguments[1].type === "FunctionExpression");
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
			return node.left.name || node.left.property && node.left.property.name;
		},
		options: {
			"$get": function (node) {
				return node.operator === "=" &&
					node.left.type === "MemberExpression" &&
					node.left.object.type === "ThisExpression" &&
					node.left.property.type === "Identifier";
			}
		}
	},
	"ObjectExpression": {
		selector: function () {
			return function (option, node) {
				for (var i = 0; i < node.properties.length; i++) {
					var property = node.properties[i];
					if (property.key.name !== option) { continue; }
					this.yield(property.value);
				}
			};
		},
		options: {
			"$get": function (node) {
				return node.type === "ArrayExpression" || node.type === "FunctionExpression";
			},
			"controller": "$get"
		}
	}
};
