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
//					"driver" : "KEVIN",
//					"rating" : "4",
//					"video" : "s",
//					"Detais" : "Yellow SX4 KA 06 V 7546"
				} ;

				$scope.bDriverDiv = true;
				$scope.bFareDiv = true;
				//$scope.strDriverID = 20;	
				
				//global variables
				//var polyline;
				
				//initLoad
				$scope.initLoad = function(){
					console.log("i came here first");
					
					geocoder = new google.maps.Geocoder();
  					directionsService = new google.maps.DirectionsService();
  					var pos = { };

				    map = new google.maps.Map(document.getElementById('dvMap'), {
				    center: {lat: -33.8688, lng: 151.2195},
				    zoom: 14,
				    mapTypeId: google.maps.MapTypeId.ROADMAP
				   });


					if (navigator.geolocation) {
				    		navigator.geolocation.getCurrentPosition(function(position) {
				      		pos = {
				        		lat: position.coords.latitude,
				        		lng: position.coords.longitude
				      		};
				    
				    		//console.log("Latitude: " + pos.lat + " Langitude: " + pos.lng);
				      		var marker = new google.maps.Marker({
				        		position: {lat: pos.lat, lng: pos.lng},
				        		map: map
				      		});
				      	
				      		getAddressFromLatLang(pos.lat, pos.lng);
				      		map.setCenter(pos);
				    	}, function() {
				      		handleLocationError(true, infoWindow, map.getCenter());
				    	});
				  	} else {
				    	// Browser doesn't support Geolocation
				    	handleLocationError(false, infoWindow, map.getCenter());
				  	}			
				  	
				  	//Source
				  	var input = document.getElementById('txtSource');
				  	var searchBox = new google.maps.places.SearchBox(input);

				  	//Destination
				  	var output = document.getElementById('txtDestination');
				  	var searchBox = new google.maps.places.SearchBox(output);

				  	// Bias the SearchBox results towards current map's viewport.
				  	map.addListener('bounds_changed', function() {
				  	  searchBox.setBounds(map.getBounds());
				  	});

				  	//fetch the driver details
				  	$scope.loaddriver();

				}


				//Load drivers
				$scope.loaddriver = function(){

					
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
									$scope.res = data.data;
									if($scope.res.length > 0){
										console.log("success");
										$scope.loadDrivers();		
										$scope.getDriverInfo();
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
				};


				//get mode details about the driver.
				$scope.getDriverInfo= function(){
					
					var driverID = [];
					
					for(i=0;i<$scope.res.length;i++){
						driverID[i]=$scope.res[i].DRIVER_ID;
						//console.log("driverID : "+driverID[i]);
					}
					
					$http({
						method : 'post',
						url : '/getDriverInfo',
						data : {
							"drivers" : driverID							
						}
					}).success(function(data) {
						if(data.statusCode == 404){
							console.log("SQL failed");
						}else{		
							$scope.Drivers = data.details;
							console.log("Here in success");
						}				
					});
					
				};
				

				$scope.loadDrivers = function(){

				  var res = $scope.res;
				  console.log("In loaddrivers");

				  for (var i = 0; i < res.length; i++) {
				    var x = res[i].LATITUDE;
				    var y = res[i].LANGITUDE;
				    var setlab=String(res[i].DRIVER_ID);

				  //  console.log(x + "," + y); 
				    var marker = new google.maps.Marker({
				      position: new google.maps.LatLng(x,y),
				      map: map,
				      label: setlab,
				      labelStyle: {opacity: 0},
				      icon:'../images/car.png'
				    });
				    console.log(res[i].DRIVER_ID);
				    google.maps.event.addListener(marker, 'click', (function(marker, i) {
				         return function() {
				            console.log("Yes here: " + marker.label);
				            $scope.selectedDriver = marker.label;
				            // document.getElementById('txtDriverID').value = marker.label;
				            // console.log("div value "+document.getElementById('btnGetDriver').value);
				            // driver_id = marker.label;
				            document.getElementById('btnGetDriver').click();
				         }
				    })(marker, i));
				  }

				}

				$scope.setRoutes = function(){   

				  var srcloc;
				  var desloc;

				  console.log("From setRoutes");
				  var source = document.getElementById('txtSource').value;
				  var destination = document.getElementById('txtDestination').value;
				  
				  if(source == "" || destination == ""){
				    alert("Source/Destination can not be empty");
				    return;
				  }
				 
				  $scope.setMarker(destination);
				  var startLoc = new Array();
				  startLoc[0] = source;

				  var endLoc = new Array();
				  endLoc[0] = destination;

				  $scope.getDistance(source,destination);

				  var directionsDisplay = new Array();
				  
				  for (var i=0; i< startLoc.length; i++){
				    console.log("startLoc[i]: "+ startLoc[i]);
				    var rendererOptions = {
				          map: map,
				          suppressMarkers : true,
				          preserveViewport: true
				    }
				    directionsService = new google.maps.DirectionsService();
				    var travelMode = google.maps.DirectionsTravelMode.DRIVING;  
				    var request = {
				          origin: startLoc[i],
				          destination: endLoc[i],
				          travelMode: travelMode
				    };  

				    directionsService.route(request,makeRouteCallback(i,directionsDisplay[i]));
				  }   
				  
				  function makeRouteCallback(routeNum,disp){
				    console.log("In makeRouteCallback");
				    if (polyline[routeNum] && (polyline[routeNum].getMap() != null)) {
				       	polyline[routeNum].setMap(null);
				    }
				    
				    return function(response, status){    
				      if (status == google.maps.DirectionsStatus.OK){
				        var bounds = new google.maps.LatLngBounds();
				        var route = response.routes[0];
				        startLocation[routeNum] = new Object();
				        endLocation[routeNum] = new Object();
				        polyline[routeNum] = new google.maps.Polyline({
				          path: [],
				          strokeColor: '#FFFF00',
				          strokeWeight: 3
				        });
				        
				        poly2[routeNum] = new google.maps.Polyline({
				          path: [],
				          strokeColor: '#FFFF00',
				          strokeWeight: 3
				        });     
				        // For each route, display summary information.
				        var path = response.routes[0].overview_path;
				        var legs = response.routes[0].legs;
				        disp = new google.maps.DirectionsRenderer(rendererOptions);     
				        disp.setMap(map);
				        disp.setDirections(response);

				       
				      }       
				      
				      polyline[routeNum].setMap(map);
				      //map.fitBounds(bounds);
				      //startAnimation(routeNum);  
				    } // else alert("Directions request failed: "+status);
				  }

				}



				$scope.geocodeAddress = function(addr, callback) {

				  var geoloc;
				  var latlang ={};
				  var geocoder = new google.maps.Geocoder();  
				  geocoder.geocode({'address': addr}, function(results, status) {
				    if (status === google.maps.GeocoderStatus.OK) {
				      geoloc = results[0].geometry.location;      
				         latlang = {
				      		lat: results[0].geometry.location.lat(),
				      		lang: results[0].geometry.location.lng()
				      };
				    } else {
				      alert('Geocode was not successful for the following reason: ' + status);
				    }
				    callback(latlang);
				  });
				}

				
				// request for a ride
				$scope.BookRide = function(){
					
					console.log("In book ride module");
					
					var source = document.getElementById('txtSource').value;
					var destination = document.getElementById('txtDestination').value;
				  
				  	if(source == "" || destination == ""){
				    	alert("Source/Destination can not be empty");
				    	return;
				  	}
				  	
				  	if( angular.isUndefined($scope.selectedDriver ) == true){
				  		alert("Please select a driver");
				  		return;
				  	}
				  	
				  	console.log("Driver is "+ $scope.selectedDriver );
				  	
				  	$scope.time = new Date();
				  	$scope.month = $scope.time.getMonth() + 1;
				  	$scope.reqTime = $scope.time.getFullYear()+"-"+$scope.month+"-"+$scope.time.getDate()+" "+$scope.time.getHours()+":"+$scope.time.getMinutes()+":"+$scope.time.getSeconds(); 
				  	console.log("datetime"+$scope.reqTime);
					
				  	$scope.day = $scope.time.getDay();
				  	var weekend = 0;
				  	
				  	if($scope.day == 5 || $scope.day == 6 || $scope.day == 7){
				  		weekend = 1;
				  	}
				  	
				  	$scope.getDistance(source, destination, function(){	
				  		
				  		$scope.geocodeAddress(source, function(latlang) {
				  		
				  			$scope.srclatlang =  latlang;
				  			
				  			$scope.geocodeAddress(destination, function(latlang) {
				  				$scope.deslatlang = latlang;
				  			
				  				$scope.distance = parseInt($scope.distance);
					  			
						  		console.log("Distance is - "+ $scope.distance);
						  		console.log("Duration is - "+$scope.duration );
						  
						  		var dur = $scope.duration.split(" ");
						  		var hr = 0;
						  		var min = 0;
						  		
						  		if(dur.length == 2){
						  			var min = dur[0];
						  			$scope.duration = min;
						  		}else if(dur.length == 4){
						  			var hr = dur[0];
						  			var min = dur[2];
						  			$scope.duration = (hr * 60) + min;
						  		}else{
						  			return;
						  		}
						  		
						  		$scope.ridests = -1;
						  		
						  		
						  		$http({
									method : 'post',
									url : '/bookaride',
									data : {
										"distance" : $scope.distance,
										"duration" : $scope.duration,
										"reqtime" : $scope.reqTime,
										"weekend" : weekend,
										"driverID" : $scope.selectedDriver,
										"srcLat" : $scope.srclatlang.lat,
										"srcLng" : $scope.srclatlang.lang,
										"descLng" : $scope.deslatlang.lang,
										"descLat" : $scope.deslatlang.lat,
										
									}
								}).success(function(data) {
									if(data.code == 404){
										console.log("couldnt book the ride");
									}else{		
										console.log("booking done");
									}				
								});
				  			})		  			
				  		})
				  		  		
				  	});
				  	
				  	
				}
				
				
				// Calculate the fare estimate
				$scope.GetFare = function(){

					console.log("getting fare estimate");

					var source = document.getElementById('txtSource').value;
					var destination = document.getElementById('txtDestination').value;
				  
				  	if(source == "" || destination == ""){
				    	alert("Source/Destination can not be empty");
				    	return;
				  	}
				  	
				  	$scope.time = new Date();
				  	
				  	$scope.curTime = $scope.time.getHours() + ":" +  $scope.time.getMinutes();
				  	$scope.day = $scope.time.getDay();
				  	var weekend = 0;
				  	
				  	if($scope.day == 5 || $scope.day == 6 || $scope.day == 7){
				  		weekend = 1;
				  	}
				  	
				  	console.log("time is - "+ $scope.curTime);
				  	
				  	$scope.getDistance(source, destination, function(){
				  		
				  		$scope.distance = parseInt($scope.distance);
				  		console.log("Distance is - "+ $scope.distance);
				  		console.log("Duration is - "+$scope.duration );
				  
				  		var dur = $scope.duration.split(" ");
				  		var hr = 0;
				  		var min = 0;
				  		
				  		if(dur.length == 2){
				  			var min = dur[0];
				  			$scope.duration = min;
				  		}else if(dur.length == 4){
				  			var hr = dur[0];
				  			var min = dur[2];
				  			$scope.duration = (hr * 60) + min;
				  		}else{
				  			return;
				  		}
				  		
				  		
				  		$http({
							method : 'post',
							url : '/getfareEstimate',
							data : {
								"distance" : $scope.distance,
								"duration" : $scope.duration,
								"time" : $scope.curTime,
								"weekend" : weekend
							}
						}).success(function(data) {
							if(data.code == 404){
								console.log("Cannot get fare estimate");
							}else{		
//								$scope.minPrice = Math.round(data.minfare,2);
//								$scope.maxPrice = Math.round(data.maxfare,2);
								$scope.minPrice = data.minfare.toFixed(2);
								$scope.maxPrice = data.maxfare.toFixed(2);
								
								$scope.bFareDiv = false;
							}				
						});
				  		
				  		
				  	});
				  				  	

				}

				$scope.getDistance = function(src, desc, callback){
					
					var service = new google.maps.DistanceMatrixService();
					service.getDistanceMatrix({
						origins: [src],
						destinations: [desc],
						travelMode: google.maps.TravelMode.DRIVING,						
						unitSystem: google.maps.UnitSystem.IMPERIAL,
						avoidHighways: false,
						avoidTolls: false
					},  function (response, status) {
							if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
						    	$scope.distance = response.rows[0].elements[0].distance.text;  
						    	//Math.round( totalDuration / 60 )+' minutes'
						    	console.log("Distcs - "+$scope.distance);
						        $scope.duration = response.rows[0].elements[0].duration.text;						        						        
						        console.log("duration - "+$scope.duration );
						} else {
							alert("Unable to find the distance via road.");
						}
						callback();
						
					});
				}


				$scope.setMarker = function(addr){
					geocoder.geocode({'address': addr}, function(results, status) {
				    if (status === google.maps.GeocoderStatus.OK) {				     
				    	var marker = new google.maps.Marker({
           					map: map,
            				position: results[0].geometry.location
        				});
				      
				    } else {
				      alert('Geocode was not successful for the following reason: ' + status);
				    }
				  });
				}

				//Get a driver details
				$scope.getDriverDetails = function(dr){
					console.log("Im here--getting driver details");
					$scope.bDriverDiv = false;
					console.log("Driver is : " + $scope.selectedDriver);

					
					
					
					for(var i=0; i<$scope.Drivers.length; i++){
						if($scope.Drivers[i].email == $scope.selectedDriver ){
							$scope.driverDetails = {
								"driver" : $scope.Drivers[i].firstname +" "+ $scope.Drivers[i].lastname,
								"rating" : $scope.Drivers[i].ratings,
								"video" : $scope.Drivers[i].video,
								"Detais" : $scope.Drivers[i].Make+" "+ $scope.Drivers[i].Color+" "+ $scope.Drivers[i].licence
							} ;
						}
					}
				}
				
				
				//get geoloca for address
				$scope.getLatLangfrmAddress=function(callback){
					var geocoder = new google.maps.Geocoder();
					var source = document.getElementById('txtSource').value;
					var destination = document.getElementById('txtDestination').value;
					
					geocoder.geocode( { 'address': source}, function(results, status) {

						if (status == google.maps.GeocoderStatus.OK) {
							
						    $scope.srclatitude = results[0].geometry.location.latitude;
						    $scope.srclongitude = results[0].geometry.location.longitude;
						     
						}
						
						geocoder.geocode( { 'address': destination }, function(results, status) {
							
							if (status == google.maps.GeocoderStatus.OK) {
								$scope.destlatitude = results[0].geometry.location.latitude;
								$scope.destlongitude = results[0].geometry.location.longitude;
							    
							} 
						});
						callback();
					});
				}
				
			}
		]);
}());

