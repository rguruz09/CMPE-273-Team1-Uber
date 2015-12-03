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
	        templateUrl: "views/driverrideDetails.html",
	        controller: "getdriverTrips"
	    })
        .when("/getrideDetailsPage", {
            templateUrl: "views/eachdrivertrip.html",
            controller: "getdriverTrips"
        })
});

home.controller("driverTripsController", function($scope, $http,$location) {	
	
	console.log("Inside getdriverTripDetails");
	$scope.test = function() {
		alert("HERE!!");
	}
	
	$scope.goNext = function(hash) {	
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
  
});
home.controller("getdriverTrips", function($scope, $http, $location,sharedProperties) {
	console.log("Inside getTrips");

	$scope.setID = function(billid){
		sharedProperties.set(billid);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
	
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
