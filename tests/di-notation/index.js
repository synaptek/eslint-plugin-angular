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

var testHelpers = require('../../helpers/testing');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

eslintTester.addRuleTest("rules/angular-di-notation", {
	valid: testHelpers.getTests('valid', "di-notation"),
	invalid: testHelpers.getTests('invalid', "di-notation")
});
