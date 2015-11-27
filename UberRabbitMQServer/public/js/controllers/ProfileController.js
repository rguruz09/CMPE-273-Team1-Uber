
    var uberApp = angular.module('uberApp');
    uberApp.controller('ProfileController1', ['$scope','$http',function ($scope,$http) { 
    	
    	console.log("In Profile Controller for Rider");
    	$scope.formDetails = {};
    	/*$scope.addToGroup = function(member_id,firstname,lastname) {
    		var searchStmt = $http({
    			method : 'POST',			
    			url : '/addToGroup',
    			data: {
    				"group_id":$scope.groupId,
    				"firstname":firstname,
    				"lastname":lastname,
    				"_id":member_id
    			}
    		}).success(function(response) {			
    			$scope.memberAddition = response.message;
    			$scope.selectGroup();
    		});
    	}*/
    	
    	$scope.getRiderDetails = function() {
    		var searchStmt = $http({
    			method : 'POST',			
    			url : '/getRiderDetails',
    			data: {}
    		}).success(function(response) {			
    			$scope.formDetails = response.rider;
    		});
    	}
    	
   }]);
