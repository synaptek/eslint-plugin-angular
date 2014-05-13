/**
 * angular-lint invalid ex-1
 * @args: []
 * @globals: [define, require]
 * @errors:
 * - Errors.DINotation.ToBeArray@FunctionExpression
 *
 * @description:
 * Tests the default args to be ["arr", true]
 */

var define = function () {};

define([
	'_',
	'app'

], function (_, app) {
	app.controller('MyController', function ($scope) {
		_.extend($scope, {
			invoke: function () {

			}
		});
	});
});
