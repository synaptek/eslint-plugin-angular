/**
 * angular-lint invalid ex-4
 * @args: ["fn"]
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.ToBeFunction@ArrayExpression
 *
 * @description:
 * Tests that the di-notation should not be the defaults - expect function instead of array
 * Tests that 'service' is similar to the 'controller' test
 */

var angular = {
	module: function () {
		return {
			service: function () {

			}
		};
	}
};

angular.module('app').service('MyService', [
	'$scope',

	function ($scope) {

	}
]);
