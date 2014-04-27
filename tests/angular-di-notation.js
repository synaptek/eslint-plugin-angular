/**
 * @fileoverview Angular dependency injection notation
 * @author Nate-Wilkins
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var fs = require('fs'),
	path = require('path');

var eslintTester = require('eslint-tester');

var diNotationRule = require('../rules/angular-di-notation');

var Errors = diNotationRule.Errors;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ArgsSelector = new RegExp("(?://|\\*)\\s*(?:@|)args\\s*(?::|)\\s*(?:\\[|)([^\\]]+)(?:]|)", "i");
var GlobalsSelector = new RegExp("(?://|\\*)\\s*(?:@|)globals\\s*(?::|)\\s*(?:\\[|)([^\\]]+)(?:]|)", "i");
var ErrorsSelector = new RegExp("-\\s*Errors.*(?:\r\n|\n)", "ig");
var QuotedValueSelector = new RegExp("(?:\"|'|)([^\"']+)(?:\"|'|)", "i");

var parseValidTest = function (src) {
	var argsMatch = ArgsSelector.exec(src);
	var globalsMatch = GlobalsSelector.exec(src);

	var args = normalizeTestArgs(argsMatch ? argsMatch[1].split(',') : []);

	return {
		code: src,
		args: args,
		globals: globalsMatch ? globalsMatch[1].split(',') : []
	};
};

var parseInvalidTest = function (src) {
	var argsMatch = ArgsSelector.exec(src);
	var globalsMatch = GlobalsSelector.exec(src);
	var errorMatch;

	var args = normalizeTestArgs(argsMatch ? argsMatch[1].split(',') : []);

	var errors = [];
	while ((errorMatch = ErrorsSelector.exec(src)) !== null) {
		errors.push(new TestError(errorMatch[0]));
	}

	return {
		code: src,
		args: args,
		globals: globalsMatch ? globalsMatch[1].split(',') : [],
		errors: errors
	};
};

var normalizeTestArgs = function (args) {
	for (var i = 0; i < args.length; i++) {
		var valueMatch = QuotedValueSelector.exec(args[i].trim());
		var arg = valueMatch ? valueMatch[1] : args[i];

		if (arg === "false") { arg = false; }
		else if (arg === "true") { arg = true; }

		args[i] = arg;
	}
	if (args[0] === "[") { args = []; }
	args.unshift(2);
	return args;
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

var test = function (testPath) {
	testPath = path.normalize(testPath);
	var src = fs.readFileSync(testPath, 'utf8');

	if (testPath.indexOf("invalid") <= -1) { return parseValidTest(src); }
	return parseInvalidTest(src);
};

var getTests = function (dir) {
	dir = path.join("./tests/", path.normalize(dir)) + "/";
	var testFiles = fs.readdirSync(dir);
	var tests = [];
	for (var i = 0; i < testFiles.length; i++) { tests.push(test(dir + testFiles[i])); }
	return tests;
};

getTests("./valid");

eslintTester.addRuleTest("rules/angular-di-notation", {
    valid: getTests("./valid"),
    invalid: getTests("./invalid")
});
