var uberApp = angular.module('uberApp', []);
uberApp.controller('frontpageCtrl', function($scope,$http,$window) {
	
	console.log("Inside frontpageCtrl");
    $scope.login=function(){    	 
      		window.location.assign("/commonLogin");
    }
    $scope.signup=function(){    	 
      		window.location.assign("/riderSignup");
    }    
    $scope.driverSignup=function(){
    	window.location.assign("/driverSignup");	
    }
    
    $scope.riderSignIn = function() {
    	
    	console.log("In frontpage controller, rider email:" + $scope.email);
    	console.log("In frontpage controller, rider password:" + $scope.password);
    	$http({
			method : "POST",
			url : '/checkRiderLogin',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(data) {
			console.log("In Front Page Controller");
			if (data.login == "Success")
				window.location = '/bookRide';
			else {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In Front Page Controller Fail Login");
			$scope.unexpected_error = true;
			$scope.invalid_login = false;
		});
    }
    
    
    //var formDetails = {};
    
    $scope.formDetails = {};    
	$scope.getRiderDetails = function() {
		var searchStmt = $http({
			method : 'POST',			
			url : '/getRiderDetails',
			data: {}
		}).success(function(response) {			
			$scope.formDetails = response.rider;
			console.log("value of $scope from frontpage controller " + $scope.formDetails);
		});
	}
	
	
	
	$scope.updateProfile = function(details){
		/*
	        $scope.update ={};
	        $scope.update.address = inputProfile.address;
	        $scope.update.city = inputProfile.city;
	        $scope.update.state = inputProfile.state;
	        $scope.update.zipcode = inputProfile.zipcode;
	        $scope.update.phone = inputProfile.phone;
	        $scope.update.email = inputProfile.email;
	        console.log($scope.profile);
	        */
		console.log("inside updateProfile function");
	        console.log(details);
	        $http({
	            method: "POST",
	            url: "/actionUpdate",
	            data: details

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
	
});