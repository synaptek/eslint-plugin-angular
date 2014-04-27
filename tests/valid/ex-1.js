/**
 * angular-lint valid ex-1
 * @args: ["arr", true]
 * @globals: [define,require]
 *
 * @description:
 *
 */

var define = function () {};

define([
	'_',
	'app'

], function (_, app) {
	app.controller('MyController', [
		'$scope',

		function ($scope) {
			_.extend($scope, {
				invoke: function () { }
			});
		}
	]);
});
