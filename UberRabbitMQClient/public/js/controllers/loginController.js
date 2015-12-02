 var uberApp= angular.module('uberApp',[]);
 
 uberApp.controller('loginCtrl', function($scope) {
 $scope.riderSignin=function(){	 
      		window.location.assign("/riderSignin");
    }
     $scope.driverSignin=function(){
    	 
      		window.location.assign("/driverSignin");
    }
     $scope.adminSignin=function(){
    	 
   		window.location.assign("/adminSignin");
 }
     
});