//loading the 'login' angularJS module
var uberApp = angular.module('uberApp', []);
//defining the login controller
uberApp.controller('driverSignupCtrl', function($scope) {
    $scope.riderSignUp=function(){    	 
      		window.location.assign("/riderSignup");
    }
     $scope.signup=function(){
    	 
      		window.location.assign("/riderSignup");
    }
    
    $scope.driverSignup=function(){
    	window.location.assign("/driverSignup");	
    }
});