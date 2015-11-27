var uberApp = angular.module('uberApp', []);
//defining the Signup controller
uberApp.controller('riderSignupCtrl', function($scope, $http, $location) {
	$scope.createAccount = function() {
		console.log("Email is::" + $scope.email);
		var card_12 = $scope.creditcard.substring(0, 12 );
		var card_4 = $scope.creditcard.substring( 12, 16 );
		console.log("Card 12 digits " +card_12);
		console.log("Card 4 digits" +card_4);
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
				"creditcard_12" : card_12,
				"creditcard_4" : card_4,
				//"creditcard" : $scope.creditcard,
				"cvv" : $scope.cvv,
				"month" : $scope.month,
				"year" : $scope.year,
				"postalcode" : $scope.postalcode
			}
		}).success(function(data) {
			if (data.status == "User Inserted!") {
				console.log("inside rider signup controller success status 1");
				$scope.invalid_signup = true;
				$scope.valid_signup = false;
				$scope.unexpected_error_signup = true;
			} else {
				console.log("inside rider signup controller success status 2");
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
				window.location.assign("/riderSignin");
			}
		}).error(function(error) {
			console.log("inside rider signup controller error status");
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
});