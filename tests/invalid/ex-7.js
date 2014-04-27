/**
 * angular-lint invalid ex-7
 * @args: ["fn"]
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.ToBeFunction@ArrayExpression
 *
 * @description:
 * Tests that the di-notation should not be the defaults - expect function instead of array
 * Tests that the provider's $get function is also tested for di-notation - Assignment
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

		function ($scope) {

		}
	];
});
