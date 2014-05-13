/**
 * angular-lint invalid ex-5
 * @args: ["arr", true, true]
 * @globals: [angular]
 * @errors:
 * - Errors.DINotation.ToBeArray@FunctionExpression
 *
 * @description:
 * Tests that the decorator function is tested for the correct di-notation
 */

var angular = {
	module: function () {
		return {
			decorator: function () {

			}
		};
	}
};

angular.module('app').decorator('inputDirective', function ($delegate) {

});
