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
				"email" : "swathi@gmail.com",
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
	
});


home.controller("documentUploadCtrl", function($scope, $http, $routeParams) {
	console.log("inside document details controller");
});

home.controller("introVideoCtrl", function($scope, $http, $routeParams) {
	console.log("inside intro video controller");
});

home.controller("rideHistoryCtrl", function($scope, $http, $routeParams) {
	console.log("inside Ride History controller");
});

home.controller("billHistoryCtrl", function($scope, $http, $routeParams) {
	console.log("inside bill history controller");
});



