var home = angular.module('uberApp',['ngRoute']);
home.factory('myService', function() {
	var savedData = "";
	function set(data) {
		savedData = data;
	}
	function get() {
		return savedData;
	}

	return {
		set : set,
		get : get
	}

});

home.service('sharedProperties', function () {
	var property = {
		data1: 'First',
		data2: 'Second',
		data3: 'Third',
		data4 : 'Fourth'
	}
	
	return {
		get: function () {
			return property;
		},
		set: function(value) {
			property = value;
		}
		};
});



home.config(function($routeProvider) {
	
    $routeProvider  
	    .when("/", {
	        templateUrl: "views/rideDetails.html",
	        controller: "getTrips"
	    })
        .when("/getrideDetailsPage", {
            templateUrl: "views/eachtrip.html",
            controller: "getTrips"
        })
});

home.controller("TripsController", function($scope, $http,$location) {	
	
	console.log("Inside TripsController");
	$scope.test = function() {
		alert("HERE!!");
	}
	
	$scope.goNext = function(hash) {	
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
  
});
home.controller("getTrips", function($scope, $http, $location,sharedProperties) {
	console.log("Inside getTrips");

	$scope.setID = function(billid){
		sharedProperties.set(billid);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
	$scope.getTripDetails = function() {
		console.log("$scope.getTripDetails");
		$http({
			method : "POST",
			url : '/getTripDetails',
			data : {				
				//"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {
				console.log("hi"+data.allTripslist);
				$scope.allTripslist = data.allTripslist;	
				console.log($scope.allTripslist);
				$scope.loadMap();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.getdriverTripDetails = function() {
		console.log("$scope.getdriverTripDetails");
		$http({
			method : "POST",
			url : '/getdriverTripDetails',
			data : {				
				//"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {
				console.log("hi"+data.allTripslist);
				$scope.alldriverTripslist = data.alldriverTripslist;	
				console.log($scope.alldriverTripslist);
				$scope.loadMap1();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	
	$scope.eachTripDetails = function() {
		console.log("$scope.eachTripDetails" + sharedProperties.get());
		$http({
			method : "POST",
			url : '/geteachTripDetails',
			data : {				
				"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {				
				$scope.eachTripDetails = data.eachTripDetails;		
				$scope.loadMap();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.eachdriverTripDetails = function() {
		console.log("$scope.eachdriverTripDetails" + sharedProperties.get());
		$http({
			method : "POST",
			url : '/eachdriverTripDetails',
			data : {				
				"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {				
				$scope.eachdriverTripDetails = data.eachdriverTripDetails;		
				$scope.loadMap1();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.loadMap = function(){
		console.log("I came " +$scope.eachTripDetails.SOURCE_LAT + " " + $scope.eachTripDetails.SOURCE_LANG);

	    var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
     
        var map = new google.maps.Map(document
              .getElementById('map'), {
           zoom : 7,
           mapTypeId : google.maps.MapTypeId.ROADMAP
        });
     
        directionsDisplay.setMap(map);   
		  
        var start = new google.maps.LatLng($scope.eachTripDetails.SOURCE_LAT,$scope.eachTripDetails.SOURCE_LANG);
        var end = new google.maps.LatLng($scope.eachTripDetails.DESTINATION_LAT,$scope.eachTripDetails.DESTINATION_LANG);
     
        console.log(start);
        console.log(end);
        var request = {
           origin : start,
           destination : end,
           travelMode : google.maps.DirectionsTravelMode.DRIVING
        };
     
        directionsService.route(request, function(response,
              status) {
           if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
           }
        });

	}

$scope.loadMap1 = function(){
	console.log("I came " +$scope.eachdriverTripDetails.SOURCE_LAT + " " + $scope.eachdriverTripDetails.SOURCE_LANG);

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
 
    var map = new google.maps.Map(document
          .getElementById('map'), {
       zoom : 7,
       mapTypeId : google.maps.MapTypeId.ROADMAP
    });
 
    directionsDisplay.setMap(map);   
	  
    var start = new google.maps.LatLng($scope.eachdriverTripDetails.SOURCE_LAT,$scope.eachdriverTripDetails.SOURCE_LANG);
    var end = new google.maps.LatLng($scope.eachdriverTripDetails.DESTINATION_LAT,$scope.eachdriverTripDetails.DESTINATION_LANG);
 
    console.log(start);
    console.log(end);
    var request = {
       origin : start,
       destination : end,
       travelMode : google.maps.DirectionsTravelMode.DRIVING
    };
 
    directionsService.route(request, function(response,
          status) {
       if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
       }
    });

}
});

/*
//var uberApp = angular.module('uberApp', []);
(function() {

	console.log("In Trips Controller");
	'use strict';

	var uberApp = angular.module('uberApp',[]);
	uberApp.controller('TripsController', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {

		var map;
		$scope.getTripDetails = function() {
			console.log("$scope.getTripDetails");
			$http({
				method : "POST",
				url : '/getTripDetails',
				data : {				
					//"RIDE_ID":sharedProperties.get()
				}
			}).success(function(data) {			
				if (data) {
					console.log("hi"+data.allTripslist);
					$scope.allTripslist = data.allTripslist;	
					console.log($scope.allTripslist);
					$scope.loadMap();
				} else {
					console.log("Error in Data Fetching");
					$scope.unexpected_error = true;
				}
			}).error(function(error) {
				console.log("In getDriverDetails failed");
				$scope.unexpected_error = true;
			});		
		}
		
		
		
		$scope.getdriverTripDetails = function() {
			console.log("$scope.getdriverTripDetails");
			$http({
				method : "POST",
				url : '/getdriverTripDetails',
				data : {				
					//"RIDE_ID":sharedProperties.get()
				}
			}).success(function(data) {			
				if (data) {
					console.log("hi"+data.alldriverTripslist);
					$scope.alldriverTripslist = data.alldriverTripslist;	
					console.log($scope.getdriverTripDetails);
					$scope.loadMap();
				} else {
					console.log("Error in Data Fetching");
					$scope.unexpected_error = true;
				}
			}).error(function(error) {
				console.log("In getDriverDetails failed");
				$scope.unexpected_error = true;
			});		
		}
		$scope.loadMap = function(){
			console.log("I came " +$scope.allTripslist.SOURCE_LAT + " " + $scope.allTripslist.SOURCE_LANG);

			 map = new google.maps.Map(document.getElementById('map'), {
		           zoom : 7,
		           mapTypeId : google.maps.MapTypeId.ROADMAP
		        });
		    var directionsService = new google.maps.DirectionsService();
	        var directionsDisplay = new google.maps.DirectionsRenderer();
	     
	       
	     
	        directionsDisplay.setMap(map);
	        //directionsDisplay.setPanel(document.getElementById('panel'));
	        /*
	        var start = "'"+$scope.billDetails.pickuplat + ","+ $scope.billDetails.pickuplong + "'";
	        var end = "'"+$scope.billDetails.dropofflat + ","+ $scope.billDetails.dropofflong + "'";    
			  
	        var start = new google.maps.LatLng($scope.allTripslist.SOURCE_LAT,$scope.allTripslist.SOURCE_LANG);
	        var end = new google.maps.LatLng($scope.allTripslist.DESTINATION_LAT,$scope.allTripslist.DESTINATION_LANG);
	     
	        console.log(start);
	        console.log(end);
	        var request = {
	           origin : start,
	           destination : end,
	           travelMode : google.maps.DirectionsTravelMode.DRIVING
	        };
	     
	        directionsService.route(request, function(response,
	              status) {
	           if (status == google.maps.DirectionsStatus.OK) {
	              directionsDisplay.setDirections(response);
	           }
	        });

		}
		
		
		
				/*$scope.myRides = [ {
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
}()); */
