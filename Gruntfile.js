/*
 * angular-lint
 * https://github.com/Nate-Wilkins/angular-lint
 * npm install angular-lint
 *
 * Copyright (c) 2014 Nate-Wilkins
 * Licensed under the MIT license.
 */
'use strict';

var loadGruntTasks = require('load-grunt-tasks');

module.exports = function (grunt) {
	var config = {
		pkg: grunt.file.readJSON('package.json'),

		clean: ["./tests/_lib/**/*"],

		jshint: {
			all: [
				"./**/*.js",
				"!" + "./node_modules/**/*.js"
			],
			options: { jshintrc: '.jshintrc' }
		},

		simplemocha: {
			options: {
				ui: 'bdd',
				reporter: 'tap'
			},
			all: ['tests/**/*.js']
		},

		eslint: {
			options: {
				config: './eslint.json',
				rulesdir: "./rules"
			},
			angular: [
				"./tests/angular/**/*.js"
			]
		}
	};

	grunt.initConfig(config);

	loadGruntTasks(grunt);

	grunt.registerTask('test', ['clean', 'simplemocha', 'jshint']);
	grunt.registerTask('release', ['test']);

	grunt.registerTask('default', ['release', 'clean']);
};
