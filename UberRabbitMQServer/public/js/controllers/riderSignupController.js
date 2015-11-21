var uberApp = angular.module('uberApp', []);
//defining the Signup controller
uberApp.controller('riderSignupCtrl', function($scope, $http, $location) {
	$scope.createAccount = function() {
		console.log("Email is::" + $scope.email);
		$http({
			method : "POST",
			url : '/addRider',
			data : {
				"email" : $scope.email,
				"password" : $scope.password,
				"firstname" : $scope.firstname,
				"lastname" : $scope.lastname,
				"mobile" : $scope.mobile,
				"ssn" : $scope.ssn,
				"address" : $scope.address,
				"city" : $scope.city,
				"state" : $scope.state,
				"cardholder" : $scope.cardholder,
				"creditcard" : $scope.creditcard,
				"cvv" : $scope.cvv,
				"month" : $scope.month,
				"year" : $scope.year,
				"postalcode" : $scope.postalcode
			}
		}).success(function(data) {
			if (data.status == "User Inserted!") {
				$scope.invalid_signup = true;
				$scope.valid_signup = false;
				$scope.unexpected_error_signup = true;
			} else {
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
			}
		}).error(function(error) {
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
});