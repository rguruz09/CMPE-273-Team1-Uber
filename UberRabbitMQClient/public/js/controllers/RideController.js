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
				} ;

				$scope.bDriverDiv = true;
				$scope.strDriverID = 20;
				
				
				//Load drivers
				$scope.loaddriver = function(){

					var res = {};
					console.log("Im triggered");

					if (navigator.geolocation) {
    					navigator.geolocation.getCurrentPosition(function(position) {
      		
      						$scope.curlat = position.coords.latitude;
							$scope.curlang = position.coords.longitude;
      		
      						console.log("from controller - Latitude: " + $scope.curlat + " Langitude: " + $scope.curlang );      

      						//get drivers from that circle.
      						$http({
								method : 'post',
								url : '/getDrivers',
								data : {
									"lat" : $scope.curlat,
									"lang" : $scope.curlang
								}
							}).success(function(data) {
								if(data.code == 404){
									console.log("SQL failed");
								}else{								
									res = data.data;
									if(res.length > 0){
										console.log("success");
										loadDrivers(res);				
									}else{
										console.log("No drivers available");								
									}					
								}				
							});
    					}, function() {
    						console.log("map load error");
      						//handleLocationError(true, infoWindow, map.getCenter());
    					});
  					} else {
  						console.log("error - Browser not support maps");
    					// Browser doesn't support Geolocation
    					//handleLocationError(false, infoWindow, map.getCenter());
  					}	
				}


				//Get a driver details
				$scope.getDriverDetails = function(dr){
					console.log("Im here--getting driver details");
					$scope.bDriverDiv = false;
					console.log("Driver is : " + $scope.strDriverID);
				}
			}
		]);
}());