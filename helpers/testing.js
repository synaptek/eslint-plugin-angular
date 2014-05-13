// http://docs.angularjs.org/guide/di
/**
 * @fileoverview
 * @author Nate Wilkins
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require('fs'),
	path = require('path');

var diNotationRule = require('../rules/angular-di-notation');

var Errors = diNotationRule.Errors;

//------------------------------------------------------------------------------
// Test Helpers
//------------------------------------------------------------------------------

var Selectors = {
	ArgsSelector: new RegExp("(?://|\\*)\\s*(?:@|)args\\s*(?::|)\\s*(?:\\[|)([^\\]]+)(?:]|)", "i"),
	GlobalsSelector: new RegExp("(?://|\\*)\\s*(?:@|)globals\\s*(?::|)\\s*(?:\\[|)([^\\]]+)(?:]|)", "i"),
	ErrorsSelector: new RegExp("-\\s*Errors.*(?:\r\n|\n)", "ig"),
	QuotedValueSelector: new RegExp("(?:\"|'|)([^\"']+)(?:\"|'|)", "i")
};

var Parsers = {
	getAttributes: function (src) {
		var argsMatch = Selectors.ArgsSelector.exec(src);
		var args = normalizeMatches(argsMatch ? argsMatch[1].split(',') : []);
		args.unshift(2);
		return args;
	},

	getGlobals: function (src) {
		var globalsMatch = Selectors.GlobalsSelector.exec(src);
		return normalizeMatches(globalsMatch ? globalsMatch[1].split(',') : []);
	},

	getErrors: function (src) {
		var errorMatch, errors = [];
		while ((errorMatch = Selectors.ErrorsSelector.exec(src)) !== null) {
			errors.push(new TestError(errorMatch[0]));
		}
		return errors;
	}
};

var normalizeMatches = function (matches) {
	for (var i = 0; i < matches.length; i++) {
		var valueMatch = Selectors.QuotedValueSelector.exec(matches[i].trim());
		var value = valueMatch ? valueMatch[1] : matches[i];

		if (value === "false") { value = false; }
		else if (value === "true") { value = true; }

		matches[i] = value;
	}
	if (matches[0] === "[") { matches = []; }
	return matches;
};


var TestError = function (errorId) {
	var errorAndType = errorId.trim().split("@");
	var errorParts = errorAndType[0].split(".").splice(1);

	var currentErrorSegment = Errors;
	for (var i = 0; i < errorParts.length; i++) {
		currentErrorSegment = currentErrorSegment[errorParts[i]];
	}
	if (typeof currentErrorSegment !== "string") {
		throw new Error("Invalid TestError - Error does not map to a string");
	}

	return {
		message: currentErrorSegment,
		type: errorAndType[1]
	};
};

var testing = module.exports = {
	getTests: function (type, target) {
		var dir = path.join("./tests", target, type) + "/";
		var testFiles = fs.readdirSync(dir);
		var tests = [];
		for (var i = 0; i < testFiles.length; i++) { tests.push(this.test(type, target, testFiles[i])); }
		return tests;
	},

	test: function (type, target, name) {
		if (type === 'valid') { return this.valid(target, name); }
		else if (type === 'invalid') { return this.invalid(target, name); }
		throw new Error("Unrecognized type: " + type);
	},

	valid: function (target, name) {
		var testFilePath = path.join("./tests", target, "valid", name);
		var src = fs.readFileSync(testFilePath, 'utf8');

		return {
			code: src,
			args: Parsers.getAttributes(src),
			globals: Parsers.getGlobals(src)
		};

	},

	invalid: function (target, name) {
		var testFilePath = path.join("./tests", target, "invalid", name);
		var src = fs.readFileSync(testFilePath, 'utf8');

		return {
			code: src,
			args: Parsers.getAttributes(src),
			globals: Parsers.getGlobals(src),
			errors: Parsers.getErrors(src)
		};
	},

	Selectors: Selectors,

	Parsers: Parsers
};
