//Payments controller
(function() {
	
	console.log("In payment Controller");
	'use strict';

	var uberApp = angular.module('uberApp');
	uberApp.controller('paymentCtrl', [ '$scope', '$http', '$window',
			function($scope, $http, $window) {
		console.log("Inside payment Controller");
		$scope.myPayments ={};
		$http({
			method : "GET",
			url : '/paymentInfo'
		}).success(function(data) {
			console.log("In paymentPage Controller");
			//if (data.login == "Success"){
			console.log("Sending values ");
			$scope.myPayments=data.rider;
			console.log("value of $scope.rider "+$scope.myPayments);
			
		}).error(function(error) {
			console.log("In Front Page Controller Fail Login");
			$scope.unexpected_error = true;
			$scope.invalid_login = false;
		});

		$scope.deleteCard = function(cardnumber_4)
		{
			console.log("Inside delete card from payment controller");
			console.log("value of $scope.payment.cardnumber_4 " +cardnumber_4);
			
			$http({
				method : "POST",
				url : '/paymentDelete',
				data : {
					"cardnumber_4" : cardnumber_4
				}
			}).success(function(data) {
				console.log("In paymentPage Controller");
				console.log("Deleted card details ");
				$("#success-alert1").show();
	            $("#success-alert1").fadeTo(2000, 500).slideUp(500, function(){
	            window.location.assign('/paymentPage');
	              
	            });
				//$scope.myPayments=data.rider;
				//console.log("value of $scope.rider "+$scope.myPayments);
				
			}).error(function(error) {
				console.log("In payment page Controller Failed to delete the card");
				$scope.unexpected_error = true;
				$scope.invalid_login = false;
			});
			
		};
		
		//Add Card
		$scope.saveNewCard = function()
		{
			console.log("Inside save new card from payment controller");
			var cardnumber_12 = $scope.creditcard.substring(0, 12 );
			var cardnumber_4 = $scope.creditcard.substring( 12, 16 );
			
			$http({
				method : "POST",
				url : '/saveNewCard',
				data : {
					"cardnumber_12" : cardnumber_12,
					"cardnumber_4" : cardnumber_4,
					"month" : $scope.month,
					"year" : $scope.year,
					"cvv" : $scope.cvv,
					"cardholder" : $scope.cardholder
					
				}
			}).success(function(data) {
				console.log("In paymentPage Controller");
				console.log("Inserted card successfully ");
				$("#success-alert").show();
	            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
	            window.location.assign('/paymentPage');
	                //
	            });
				
			}).error(function(error) {
				console.log("In payment page Controller Failed to add the card");
				$scope.unexpected_error = true;
				$scope.invalid_login = false;
			});
			
		};
		
		
		
		
			/*	$scope.myRides = [ {
					"pickup" : "Fri May 04 2012 01:17:07 GMT-0700 (PDT)",
			"dropoff" : "Fri May 04 2012 01:37:07 GMT-0700 (PDT)",
					"driver" : "KEVIN",
					"fare" : "$25.65",
					"car" : "uberX",
					"city" : "Orange County",
					"paymentMethod" : "pooja.yelure@gmail.com",
					"pickupLocation" : "9001 Bolsa Ave, Westminster, CA",
					"dropoffLocation" : "2021 E 19th St, Signal Hill, CA",
					"rating" : "3"
				} ];
*/
			} ]);
}());

