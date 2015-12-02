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
					
					//console.log($scope.driverID);
					console.log("i came here first");
					
					geocoder = new google.maps.Geocoder();
  					directionsService = new google.maps.DirectionsService();
  					

  					map = new google.maps.Map(document.getElementById('dvMap'), {
  						center: {lat: 37.3325859, lng: -121.89610470000002},
  					    zoom: 14,
  					    mapTypeId: google.maps.MapTypeId.ROADMAP
  					});

  					
  					//	get drivers location
  					$http({
				  		method : 'post',
				  		url : '/getCurDriverLatlng',
				  		data : {
				  			//"driverID" : $scope.driverID 
				  		}
				  	}).success(function(data) {
				  		if(data.code == 404){
				  			console.log("couldnt get the loc");
				  		}				
				  		else{
				  			console.log("loc found");
				  			$scope.drvLoc = data.loc[0];
				      		pos = {
				        		lat: $scope.drvLoc.LATITUDE,
				        		lng: $scope.drvLoc.LANGITUDE
				      		};
				      		
				    		//console.log("Latitude: " + pos.lat + " Langitude: " + pos.lng);
				      		marker = new google.maps.Marker({
				        		position: {lat: pos.lat, lng: pos.lng},
				        		map: map,
				        		icon:'../images/car.png'
				      		});
				      		map.setCenter(pos);   

							console.log("in getreq");
							
							$http({
				      			method : 'post',
				      			url : '/getRideRequest',
				      			data : {
				      				//"email" : "david@gmail.com"
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
					      				//$scope.bbtnStart = true;
					      				console.log("request found "+data.request[0].CUSTOMER_ID);
					      				$scope.custDetails = data.request[0];
					      				
					      				$scope.sts = $scope.custDetails.RIDE_STATUS;
					      				$scope.rideID = $scope.custDetails.RIDE_ID;
					      				
					      				if($scope.sts == -1){
					      					$scope.bbtnStart = true;
					      				}else{
					      					$scope.bbtnStart = false;
					      				}
					      				
					      				
					      				$scope.getAddressFromLatLang($scope.custDetails.SOURCE_LAT,$scope.custDetails.SOURCE_LANG, function(src){
				      						
					      					document.getElementById('txtSource').value = src;
					      					$scope.startLocation = src;

					      					$scope.getAddressFromLatLang($scope.custDetails.DESTINATION_LAT,$scope.custDetails.DESTINATION_LANG, function(des){
					      						
					      						document.getElementById('txtDestination').value = des;
					      						$scope.endLocation = des;

					      						directionsDisplay = new google.maps.DirectionsRenderer({ 'map': map });

					      						//polyline
					      						var srclatlang = new google.maps.LatLng($scope.custDetails.SOURCE_LAT,$scope.custDetails.SOURCE_LANG);
					      						var deslatlang = new google.maps.LatLng($scope.custDetails.DESTINATION_LAT,$scope.custDetails.DESTINATION_LANG);

					      						directionsService = new google.maps.DirectionsService();
					      						var travelMode = google.maps.DirectionsTravelMode.DRIVING;  
					      						var request = {
					      						      origin: srclatlang,
					      						      destination: deslatlang,
					      						      travelMode: travelMode
					      						};  

					      						directionsService.route(request,function(result,status){
					      							if(status == google.maps.DirectionsStatus.OK){
					      								directionsDisplay.setDirections(result);
					      							}else{
					      								console.log("cannt add");
					      							}
					      						});
					      					});
					      				});
					      				
				      				}
				      		});
						
				    	

				  		}		
				  	});
					
				};

				 $scope.updatedriverlocation = function(){

						var res = {};
						console.log("Im in updating driver loc ctrl");
						
						console.log($scope.custDetails.DESTINATION_LAT);
						
						
						$http({
							method : 'post',
							url : '/updateDriverLoc',
							data : {
								"lat" : $scope.custDetails.DESTINATION_LAT,
								"lang" : $scope.custDetails.DESTINATION_LANG
							}
						}).success(function(data) {						
							if(data.code == 404){
								console.log("SQL failed");
							}else{								
								console.log("Updated");								
							}	
							callback(true);
						});
							
					}
				
				$scope.endRide = function(){
					
					
					if (angular.isUndefined($scope.cusrating)) {
						alert("Please rate the customer");
					} else {
						$scope.time = new Date();
					  	$scope.month = $scope.time.getMonth() + 1;
					  	$scope.endTime = $scope.time.getFullYear()+"-"+$scope.month+"-"+$scope.time.getDate()+" "+$scope.time.getHours()+":"+$scope.time.getMinutes()+":"+$scope.time.getSeconds(); 
					  
						console.log("in end ride "+$scope.cusrating );
						
						$http({
							method : 'post',
							url : '/endRide',
							data : {							
								"rideID" : $scope.rideID,
								"endTime" : $scope.endTime,
								"ratings" : $scope.cusrating
							}
						}).success(function(data) {								
							if(data.code == 404){
								console.log("SQL failed");
							}else{		
								$scope.initLoad();
									console.log("Ride Ended successfully");
							}					
											
						});
					}
					
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
				  			
				  			$http({
								method : 'post',
								url : '/updateDriverLoc',
								data : {
									"email" : $scope.driverID,
									"lat" : $scope.custDetails.DESTINATION_LAT,
									"lang" : $scope.custDetails.DESTINATION_LANG
								}
							}).success(function(data) {								
								if(data.code == 404){
									console.log("SQL failed");
								}else{		
									$scope.initLoad();
									 $scope.updatedriverlocation()
									 console.log("success");
									 $scope.initLoad();
								}					
												
							});
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

