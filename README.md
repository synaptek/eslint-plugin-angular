angular-lint
===========
[![npm](http://img.shields.io/npm/v/angular-lint.svg)](https://www.npmjs.org/package/angular-lint)
[![license](http://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Nate-Wilkins/angular-lint/blob/master/LICENSE-MIT)
[![travis](https://travis-ci.org/Nate-Wilkins/angular-lint.png)](https://travis-ci.org/Nate-Wilkins/angular-lint)
[![deps](https://david-dm.org/nate-wilkins/angular-lint.png)](https://david-dm.org/nate-wilkins/angular-lint)

####Description
Note: Still in development

Set of ESLint rules to lint source code that uses the angular framework.

Lint to enforce the dependency injection notation, return values for a service, provider, and factory along with some other useful features.

####Rules
- `angular-di-notation`: Validates that all angular dependency injection notations are initialized the same
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] notation {string="arr"}: Specifies the dependency injection notations to be arrays ("arr") or functions ("fn")
		- [2] sameID {boolean=true}: When using array notation this option specifies if the function parameters should be the same name as their dependency notation (Only applicable to notation="arr")
		- [3] ignoreEmpty {boolean=true}: Specifies if the dependency injection notation can be a function if it's not requiring any dependencies (Only applicable to notation="arr")
		- N/A [4] inline {boolean=true}: Specifies if the dependency injection notation should be inline or defined through a variable (Only applicable to notation="arr")

- N/A `angular-directive`: Validates that all angular directives are a certain type (declared similarly)
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the service return

- N/A `angular-service`: Validates that all angular services are a certain type
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the service return

- N/A `angular-provider:`: Validates that all angular providers are a certain type
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the provider return

- N/A `angular-factory`: Validates that all angular factories are a certain type
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the factory return

- N/A `angular-constant`: Validates that all angular constants are a certain type
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the constant return

- N/A `angular-value`: Validates that all angular values are a certain type
	- args
		- [0] on/off {number*}: Tells ESLint if this rule is on or off
		- [1] type {string="object"}: Which type should the value return

#### Install

```bash
$ npm install angular-lint
$ N/A bower install angular-lint
```

####Todo:
- Update tests
- Unify valid and invalid tests (be more coherent)
- Implement N/A rules
- Add 'inline' rule argument to 'angular-di-notation'

####Other

[![downloads](http://img.shields.io/npm/dm/angular-lint.svg)](https://www.npmjs.org/package/angular-lint)
[![stories](https://badge.waffle.io/Nate-Wilkins/angular-lint.png)](http://waffle.io/nate-wilkins/angular-lint)
[![endorse](https://api.coderwall.com/Nate-Wilkins/endorsecount.png)](https://coderwall.com/Nate-Wilkins)
