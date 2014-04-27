/**
 * angular-lint invalid ex-7
 * @args: ["arr", true]
 * @globals: [angular]
 * @errors:
 * -  Errors.DINotation.LastArgFunction.Dependencies.ToBeSameAsDINotationDependencies@ArrayExpression
 *
 * @description:
 * Tests the default args to be ["arr", true]
 * Tests that the provider's $get function is also tested for di-notation with the same dependency names - Assignment
 */

var angular = {
	module: function () {
		return {
			provider: function () {

			}
		};
	}
};

angular.module('app').provider('MyService', function () {
	this.$get = [
		'$scope',

		function (serviceScope) {

		}
	];
});
