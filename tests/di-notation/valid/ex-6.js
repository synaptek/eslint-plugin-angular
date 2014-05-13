/**
 * angular-lint valid ex-3
 * @args: ["arr", true]
 * @globals: [angular]
 *
 * @description:
 * Checks to see if empty args are acceptable
 */

var angular = {
	module: function () {
		return {
			controller: function () {

			}
		};
	}
};

angular.module('app').controller('MyCtrl', [function () {

}]);
