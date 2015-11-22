var uberApp = angular.module('uberApp', []);
//defining the Signup controller
uberApp.controller('driverSignupCtrl', function($scope, $http, $location) {
	$scope.driverSignUp = function() {
		console.log("Email is::" + $scope.email);
		console.log("Email is::" + $scope.password);
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
				console.log("Successful Driver Login");
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
	  $scope.driverSignin=function(){
	    	 
    		window.location.assign("/driverSignin");
  };
	
});