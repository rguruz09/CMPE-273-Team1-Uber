var uberApp = angular.module('uberApp', []);
uberApp.controller('AdminController', function($rootScope,$scope, $http, $window) {

	console.log("Inside Admin Controller");

	$scope.adminForm = {};
	$scope.formDetails = {};
	$scope.selectedEmail = ""; 
	$scope.adminSignin = function() {
		console.log("In adminSignin");
		$http({
			method : "POST",
			url : '/checkAdminLogin',
			data : {
				"email" : $scope.adminForm.email,
				"password" : $scope.adminForm.password
			}
		}).success(function(data) {
			console.log("In Admin Controller:" + data);
			if (data.login == "Success") {
				console.log("In Valid Admin Controller");
				window.location = '/adminDashboard';
			} else {
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In Admin Controller Fail Login");
			$scope.unexpected_error = true;
			$scope.invalid_login = false;

		});
	}
	
	$scope.getAdminDashboardPage = function() {
		window.location = '/adminDashboard';
	}
	
	$scope.getAllRidersPage = function() {
		window.location = '/getAllRidersPage';
	}
	
	$scope.getAllRiders = function() {
		
		$http({
			method : "POST",
			url : '/getAllRiders',
			data : {
				
			}
		}).success(function(data) {			
			if (data) {
				console.log("allRidersList" + data);
				$scope.allRidersList = data.allRidersList;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In Admin Controller Fail Login");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getRiderDetailsPage = function(email) {
		$rootScope.selectedEmail = email;
		$scope.selectedEmail = email;
		
		window.location = '/adminViewRider';
		
	}
	
	$scope.getRiderDetails = function() {		
		console.log("getRiderDetails" +  $rootScope.selectedEmail);		
		$http({
			method : "POST",
			url : '/getRiderDetails',
			data : {
				"user" : "manasa@gmail.com"
			}
		}).success(function(response) {			
			if (response) {
				$scope.formDetails = response.rider;							
			} else {
			
			}
		}).error(function(error) {			
			$scope.unexpected_error = true;
		});
	}
});