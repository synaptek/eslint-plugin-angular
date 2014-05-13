/**
 * angular-lint invalid ex-2
 * @args: []
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.LastArgFunction.Dependencies.ToBeSameAsDINotationDependencies@ArrayExpression
 *
 * @description:
 * Tests the default args to be ["arr", true]
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

	function (myCtrlScope) {

	}
]);
