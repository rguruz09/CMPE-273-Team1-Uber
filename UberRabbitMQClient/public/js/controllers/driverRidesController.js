/**
 * New node file
 */
(function() {
	console.log("In Ride Controller");
	'use strict';
	var app = angular.module('uberApp2',[]);
	
	app.controller('driverRidesController', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {

				var map;
				var geocoder;
				var directionsService;
				var pos = { };
				var marker;
				//initLoad
				$scope.initLoad = function(){
					$scope.bReqAvail = true;
					console.log("i came here first");
					
					geocoder = new google.maps.Geocoder();
  					directionsService = new google.maps.DirectionsService();
  					

  					map = new google.maps.Map(document.getElementById('dvMap'), {
  						center: {lat: 37.3325859, lng: -121.89610470000002},
  					    zoom: 14,
  					    mapTypeId: google.maps.MapTypeId.ROADMAP
  					});


					//get the rides request
					if (navigator.geolocation) {
				    		navigator.geolocation.getCurrentPosition(function(position) {
				      		pos = {
				        		lat: position.coords.latitude,
				        		lng: position.coords.longitude
				      		};

				    		//console.log("Latitude: " + pos.lat + " Langitude: " + pos.lng);
				      		marker = new google.maps.Marker({
				        		position: {lat: pos.lat, lng: pos.lng},
				        		map: map,
				        		icon:'../images/car.png'
				      		});
				      		map.setCenter(pos);   
				      		$scope.getreq();
				    	}, function() {
				    		console.log("Error");
				      		//handleLocationError(true, infoWindow, map.getCenter());
				    	});
				  	} else {
				    	// Browser doesn't support Geolocation
				    	//handleLocationError(false, infoWindow, map.getCenter());
				  	}
					
				};

				$scope.getreq = function(){
					console.log("in getreq");
					
					$http({
		      			method : 'post',
		      			url : '/getRideRequest',
		      			data : {
		      				"email" : "manoj@gmail.com"
		      			}
		      		}).success(function(data) {
		      				if(data.code == 404){
		      					console.log("couldnt book the ride");
		      					$scope.bReqAvail = false;
		      				}
		      				else if(data.code == 201){		
		      					console.log("No request yer!!");
		      					$scope.bReqAvail = false;
		      				}
		      				else if(data.code == 200){
			      				alert("getting your rides");
			      				//$scope.bReqAvail = true;
			      				console.log("request found "+data.request[0].CUSTOMER_ID);
			      				$scope.custDetails = data.request[0];
		      				}
		      		});
				};

				$scope.confirmRide = function(){

					console.log("In confirmRide");
					$scope.time = new Date();
				  	$scope.month = $scope.time.getMonth() + 1;
				  	$scope.StartTime = $scope.time.getFullYear()+"-"+$scope.month+"-"+$scope.time.getDate()+" "+$scope.time.getHours()+":"+$scope.time.getMinutes()+":"+$scope.time.getSeconds(); 
				  	$scope.CustID = $scope.custDetails.CUSTOMER_ID;

				  	console.log($scope.StartTime + " " + $scope.CustID);


				  	$http({
				  		method : 'post',
				  		url : '/confirmRide',
				  		data : {
				  			"custID" : $scope.CustID,
				  			"startTime" : $scope.StartTime
				  		}
				  	}).success(function(data) {
				  		if(data.code == 404){
				  			console.log("couldnt book the ride");
				  		}				
				  		else{
				  			console.log("Ride started");
				  		}
				  			
				  	});				  	
				};

				$scope.getAddressFromLatLang = function(lat,lng,callback){
				 
				  var latLng = new google.maps.LatLng(lat, lng);
				  geocoder.geocode( { 'latLng': latLng}, function(results, status) {
				    if (status == google.maps.GeocoderStatus.OK) {
				      if (results[1]) {
				        //alert(results[1].formatted_address);
				        //document.getElementById('txtSource').value = results[1].formatted_address;
				      	callback(results[1].formatted_address);
				      }
				    }
				    else  {
				      alert("Geocode was not successful " + status);
				      callback(null);
				    }
				  });
				}

			}
		]);
}());

