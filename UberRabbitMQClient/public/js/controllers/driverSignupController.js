var uberApp = angular.module('uberApp', []);

//factory services
uberApp.factory('globalservice',function(){
	
	var sharedValues= {};
	sharedValues.setEmail = function (giveEmailid){
		console.log("In service "+ giveEmailid);
		this.email=giveEmailid;
	};
	
	sharedValues.getEmail = function (){
		return this.email;
	};
	
	return sharedValues;
	
});


//defining the Signup controller
uberApp.controller('driverSignupCtrl', function($scope, $http, $location,globalservice) {
	
	$scope.driverSignUp = function() {
		console.log("Email is::" + $scope.email);
		console.log("PWD is::" + $scope.password);
		$http({
			method : "POST",
			url : '/addDrivers',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"firstname" : $scope.firstname,
				"lastname" : $scope.lastname,
				"mobile" : $scope.mobile,
				"city" : $scope.city,
				"zip" : $scope.zip
			}
		}).success(function(data) {
			if (data.status == "User Inserted!") {
				$scope.invalid_signup = true;
				$scope.valid_signup = false;
				$scope.unexpected_error_signup = true;
			} else {
				console.log("Successful Driver Signup");
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
				window.location.assign("/driverSignin");
			}
		}).error(function(error) {
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
	
	
	//Sign-In the driver
	$scope.driverSignin = function() {


		console.log("Email is::" + $scope.email);
		console.log("Password is::" + $scope.password);
	
		
		
		//globalservice.setEmail("rag@gm.com");
		console.log(globalservice.getEmail());
		$http({
			method : "POST",
			url : '/checkDrivers',
			data : {
				"email" : $scope.email,
				"password" : $scope.password				
			}
		}).success(function(data) {
			$scope.curUser = $scope.email;
			if (data.status == "User Validated!") {
				console.log("Failure Driver Login");
				$scope.invalid_signup = true;
				$scope.valid_signup = false;
				$scope.unexpected_error_signup = true;
			} else {
				console.log("Successful Driver Login");
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
				$scope.updatedriverlocation($scope.email);				
			}
		}).error(function(error) {
			console.log("Error Driver Login");
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
	$scope.saveAndContinue = function() {
		//console.log("Email is::" + globalservice.getEmail());
		console.log("Make is::" + $scope.formDetails.make);
		console.log("Year is::" +  $scope.formDetails.year);
		console.log("color is::" + $scope.formDetails.Color);
		console.log("licence is::" + $scope.formDetails.license);
		
		$http({
			method : "POST",
			url : '/addcarDetails',
			data : {
				"email" : "raghavendra1810@gmail.com",
				"Make" : $scope.formDetails.make,
				"Year" : $scope.formDetails.year,
				"color" : $scope.formDetails.Color,
				"license" :$scope.formDetails.license
			}
		}).success(function(data) {
			if (data.status == "Car Details Inserted!") {
				console.log("car Details Inserted");
				$scope.invalid_signup = true;
				$scope.valid_signup = false;
				$scope.unexpected_error_signup = true;
			} else {
				console.log("Successful update of carDetails");
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
				//window.location.assign("/carDetails");
			}
		}).error(function(error) {
			console.log("Error car Details Insert");
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
	
	  $scope.driverSigninpage=function(){
	    	window.location.assign("/driverSignin");	
	    };
	  
	  
	  $scope.updatedriverlocation = function(email){

			var res = {};
			console.log("Im in updating driver loc ctrl");

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
	
					$scope.curlat = position.coords.latitude;
					$scope.curlang = position.coords.longitude;
	
					console.log("from controller - Latitude: " + $scope.curlat + " Langitude: " + $scope.curlang );      

					//get drivers from that circle.
					$http({
						method : 'post',
						url : '/updateDriverLoc',
						data : {
							"email" : email,
							"lat" : $scope.curlat,
							"lang" : $scope.curlang
						}
					}).success(function(data) {
						window.location.assign("/carDetails");
						if(data.code == 404){
							console.log("SQL failed");
						}else{								
							res = data.data;
							if(res.length > 0){
								console.log("success");
								$scope.loadDrivers(res);				
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
	  
	
});


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	  infoWindow.setPosition(pos);
	  infoWindow.setContent(browserHasGeolocation ?
	                        'Error: The Geolocation service failed.' :
	                        'Error: Your browser doesn\'t support geolocation.');
	}