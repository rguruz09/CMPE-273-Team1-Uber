(function() {

	console.log("In Trips Controller");
	'use strict';

	var uberApp = angular.module('uberApp');
	uberApp.controller('TripsController', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {

				$scope.myRides = [ {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "KEVIN",
					"fare" : "$25.65",
					"car" : "uberX",
					"city" : "Orange County",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"pickupLocation" : "9001 Bolsa Ave, Westminster, CA",
					"dropoffLocation" : "2021 E 19th St, Signal Hill, CA",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "DAVID",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "HOUSE",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "FOREMAN",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "FOREMAN",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "CUDDY",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "CHASE",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				}, {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
					"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "CAMERON",
					"fare" : "$15.65",
					"car" : "uberX",
					"city" : "San Jose",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"rating" : "3"
				} ];

			} ]);
}());