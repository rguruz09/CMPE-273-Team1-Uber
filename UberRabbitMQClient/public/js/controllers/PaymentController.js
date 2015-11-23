(function() {

	console.log("In Profile Controller");
	'use strict';

	var app = angular.module('uberApp');
	app.controller('ProfileController', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {

				$scope.myPayments = [ {
					"details" : "personal Paytm...payt expires 04/2016"
				}, {
					"details" : "personal Paytm...payt expires 22/2016"

				}, {
					"details" : "personal Paytm...payt expires 15/2016"

				} ];

			} ]);
}());