/**
 * angular-lint invalid ex-3
 * @args: ["fn"]
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.ToBeFunction@ArrayExpression
 *
 * @description:
 * Tests that the di-notation should not be the defaults - expect function instead of array
 */

var angular = {
	module: function () {
		return {
			controller: function () {

			}
		};
	}
};

angular.module('app').controller('MyCtrl', [
	'$scope',

	function ($scope) {

	}
]);
