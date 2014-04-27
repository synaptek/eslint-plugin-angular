/**
 * angular-lint invalid ex-5
 * @args: []
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.ToBeArray@FunctionExpression
 *
 * @description:
 * Tests the default args to be ["arr", true]
 * Tests that the provider's $get function is also tested for di-notation
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
	return {
		$get: function () {

		}
	};
});
