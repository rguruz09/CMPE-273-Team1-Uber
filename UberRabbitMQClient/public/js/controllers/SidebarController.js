var home = angular.module('driverProfile', ['ngRoute']);

home.service('sharedProperties', function () {
	var property = {
		data1: 'First',
		data2: 'Second',
		data3: 'Third',
		data4 : 'Fourth'
	}
	
	return {
		getProperty: function () {
			return property;
		},
		setProperty: function(value) {
			property = value;
		}
		};
});

home.config(function($routeProvider) {
    console.log("inside router");
    $routeProvider
    
    	.when("/", {
    		templateUrl: "views/welcomeDriver.html",
    		controller: ""
    	})
    	.when("/driverRides", {
            templateUrl: "views/driverRides.html",
            controller: "driverRidesController"
        })
        .when("/myProfile", {
            templateUrl: "views/driverProfile.html",
            controller: "driverProfileCtrl"
        })
        .when("/carDetails", {
            templateUrl: "views/carDetails.html",
            controller: "carDetailsCtrl"
        })
         .when("/uploadDocument", {
            templateUrl: "views/uploadDocument.html",
            controller: "documentUploadCtrl"
        })
         .when("/introVideo", {
            templateUrl: "views/introVideo.html",
            controller: "introVideoCtrl"
        })
         .when("/rideHistory", {
            templateUrl: "views/rideHistory.html",
            controller: "rideHistoryCtrl"
        })
         .when("/billHistory", {
            templateUrl: "views/billHistory.html",
            controller: "billHistoryCtrl"
        });
        
        
        
});

home.controller("SidebarController", function($scope, $http, $routeParams) {
	console.log("inside sidebar controller");
	
});

home.controller("driverProfileCtrl", function($scope, $http, $routeParams) {
	console.log("inside driver profile controller");
	
	  $scope.update_success = true;
	  $scope.update_failure = true;
	// var formDetailsOld = {};
	  $scope.formDetails = {};    
		$scope.getDriverDetails = function() {
			$http({
				method : 'POST',			
				url : '/getDriverDetails',
				data: {}
			}).success(function(response) {		
				
				console.log("inside sidebar controller: ");
				console.log(response.driver);
				$scope.formDetails = response.driver;
			});
		}
$scope.updateProfile = function(details){
			
			console.log("inside updateProfile driver angularJS update function");
		    console.log(JSON.stringify(details));
		        $http({
		            method: "POST",
		            url: "/actionDriverUpdate",
		            data: details

		        }).success(function (customer, status, headers, config) {
		            console.log(customer);
		            $scope.update_success = false;
		            
		            //$("#success-alert").show();
		            //$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
		            	 //window.location.assign('/myProfile');
		            //});
		        })
		            .error(function (data, status, headers, config) {
		                
		            	$scope.update_failure = false;
		         });

		    };
	/*
	$scope.updateProfile = function() {
		console.log("formdetails data are: ");
		console.log("firstname: "+ $scope.formDetails.firstname);
		console.log("lastname: "+ $scope.formDetails.lastname);
		console.log("address: "+ $scope.formDetails.address);
		console.log("city: "+ $scope.formDetails.city);
		console.log("zipcode: "+ $scope.formDetails.zipcode);*/
		
		/*
		$scope.updateProfile = function(){
			
		        $scope.update ={};
		        $scope.update.address = inputProfile.address;
		        $scope.update.city = inputProfile.city;
		        $scope.update.state = inputProfile.state;
		        $scope.update.zipcode = inputProfile.zipcode;
		        $scope.update.phone = inputProfile.phone;
		        $scope.update.email = inputProfile.email;
		        console.log($scope.profile);
		        
		        console.log("Form Details"+$scope.formDetails);
		        $http({
		            method: "POST",
		            url: "/actionUpdate",
		            data:{
		           	 "email": $scope.formDetails.email,
		           	 "firstname" : $scope.formDetails.firstname,
		           	 "lastname" : $scope.formDetails.lastname,
					"phone" : $scope.formDetails.phone,
					"address" : $scope.formDetails.address,
					"city" : $scope.formDetails.city,
					"zipcode" : $scope.formDetails.zipcode,
					"password" : $scope.formDetails.password
		            }

		        }).success(function (customer, status, headers, config) {
		            console.log(customer);
		            $("#success-alert").show();
		            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){

		                //
		            });
		        })
		            .error(function (data, status, headers, config) {
		                alert("Could not update data");
		            });

		    }
	*/	
	
});



home.controller("carDetailsCtrl", function($scope, $http, $routeParams) {
	
	console.log("inside car details controller");
	$scope.update_success = true;
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
				//"email" : "manoj@gmail.com",
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
				$scope.update_success = false;
				//window.location.assign("/carDetails");
			}
		}).error(function(error) {
			console.log("Error car Details Insert");
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
	
});


home.controller("documentUploadCtrl", function($scope, $http, $routeParams) {
	console.log("inside document details controller");
});

home.controller("introVideoCtrl", function($scope, $http, $routeParams) {
	console.log("inside intro video controller");
});

home.controller("rideHistoryCtrl", function($scope, $http, $routeParams) {
	console.log("inside Ride History controller");
	$scope.getdriverTripDetails = function() {
		console.log("$scope.getDriverTripDetails");
		$http({
			method : "POST",
			url : '/getdriverTripDetails',
			data : {				
				//"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {
				console.log("hi"+data.alldriversTripslist);
				$scope.alldriverTripslist = data.alldriversTripslist;	
				console.log($scope.alldriverTripslist.REQ_TIME);
				//$scope.loadMap();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In driver trips failed");
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
        var end = "'"+$scope.billDetails.dropofflat + ","+ $scope.billDetails.dropofflong + "'";*/        
		  
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
});

home.controller("billHistoryCtrl", function($scope, $http, $routeParams) {
	console.log("inside bill history controller");
});



