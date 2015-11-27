/**
 * New node file
 */
(function() {
	console.log("In Ride Controller");
	'use strict';
	var app = angular.module('uberApp');
	app.controller('RideController', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {

				$scope.driverDetails = {
					"driver" : "KEVIN",
					"rating" : "4",
					"video" : "s"
				};
			} ]);
}());