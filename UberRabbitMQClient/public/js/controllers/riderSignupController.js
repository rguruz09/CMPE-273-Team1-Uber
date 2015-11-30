var uberApp = angular.module('uberApp', []);
//defining the Signup controller
uberApp.controller('riderSignupCtrl', function($scope,$window, $http, $location) {
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
				"address" : $scope.address,
				"city" : $scope.city,
				"state" : $scope.state,
				"cardholder" : $scope.cardholder,
				"creditcard_12" : card_12,
				"creditcard_4" : card_4,
				"cvv" : $scope.cvv,
				"month" : $scope.month,
				"year" : $scope.year,
				"postalcode" : $scope.postalcode
			}
		}).success(function(results) {
			if (results.statusCode == 401) {
				console.log("stscode "+ results.statusCode);
				//$scope.invalid_signup = true;
				//$scope.valid_signup = false;
				$("#failure-alert").show();
	            $("#failure-alert").fadeTo(2000, 500).slideUp(500, function(){
	            //window.location.assign("/riderSignup");
	              
	            });
				$scope.unexpected_error_signup = true;
			} else {
				console.log("Data: "+JSON.stringify(results));
				$scope.invalid_signup = false;
				$scope.valid_signup = true;
				$scope.unexpected_error_signup = true;
				console.log("Now going to signin page for rider");
				$("#success-alert1").show();
	            $("#success-alert1").fadeTo(2000, 500).slideUp(500, function(){
	            window.location.assign("/riderSignin");
	              
	            });
			}
		}).error(function(error) {
			console.log("Data: "+JSON.stringify(error));
			$scope.invalid_signup = true;
			$scope.valid_signup = true;
			$scope.unexpected_error_signup = false;
		});

	};
});