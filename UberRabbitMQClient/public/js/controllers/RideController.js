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
					"video" : "s",
					"Detais" : "Yellow SX4 KA 06 V 7546"
				} ;

				$scope.bDriverDiv = true;
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
						if(data.code == 404){
							console.log("SQL failed");
						}else{		
							$scope.Drivers = data.details;
							console.log("Here in success");
						}				
					});
					
				};
				

				$scope.loadDrivers = function(){

				  var res1 = $scope.res;
				  console.log("In loaddrivers");

				  for (var i = 0; i < res1.length; i++) {
				    var x = res1[i].LATITUDE;
				    var y = res1[i].LANGITUDE;

				  //  console.log(x + "," + y); 
				    var marker = new google.maps.Marker({
				      position: new google.maps.LatLng(x,y),
				      map: map,
				      label: res1[i].DRIVER_ID,
				      labelStyle: {opacity: 0},
				      icon:'../images/car.png'
				    });

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



				$scope.geocodeAddress = function(addr) {

				  var geoloc;
				  var geocoder = new google.maps.Geocoder();  
				  geocoder.geocode({'address': addr}, function(results, status) {
				    if (status === google.maps.GeocoderStatus.OK) {
				      geoloc = results[0].geometry.location;      
				      alert('Location is: ' + results[0].geometry.location.lat());     
				      alert('Location is: ' + results[0].geometry.location.lng());     
				      var latlang = {
				      		lat: results[0].geometry.location.lat(),
				      		lang: results[0].geometry.location.lng()
				      };

				      return latlang;	
				    } else {
				      alert('Geocode was not successful for the following reason: ' + status);
				    }
				  });
				}

				$scope.GetFare = function(){

					console.log("getting fare estimate");

					var source = document.getElementById('txtSource').value;
					var destination = document.getElementById('txtDestination').value;
				  
				  	if(source == "" || destination == ""){
				    	alert("Source/Destination can not be empty");
				    	return;
				  	}


				}

				$scope.getDistance = function(src, desc){
					
					var service = new google.maps.DistanceMatrixService();
					service.getDistanceMatrix({
						origins: [src],
						destinations: [desc],
						travelMode: google.maps.TravelMode.DRIVING,
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						avoidTolls: false
					},  function (response, status) {
							if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
						    	$scope.distance = response.rows[0].elements[0].distance.text;
						    	console.log("Distcs - "+$scope.distance);
						        $scope.duration = response.rows[0].elements[0].duration.text;						        						        
						        console.log("duration - "+$scope.duration );
						} else {
							alert("Unable to find the distance via road.");
						}
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
						if($scope.Drivers[i].driverID == $scope.selectedDriver ){
							$scope.driverDetails = {
								"driver" : $scope.Drivers[i].fname,
								"rating" : $scope.Drivers[i].rating,
								"video" : $scope.Drivers[i].video,
								"Detais" : $scope.Drivers[i].details
							} ;
						}
					}


				}
			}
		]);
}());

