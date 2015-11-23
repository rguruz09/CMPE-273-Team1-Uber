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
    
    $scope.driverSignIn = function() {
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
    
    $scope.formDetails = {};    
	$scope.getRiderDetails = function() {
		var searchStmt = $http({
			method : 'POST',			
			url : '/getRiderDetails',
			data: {"user" : "me"}
		}).success(function(response) {			
			$scope.formDetails = response.rider;
		});
	}
});