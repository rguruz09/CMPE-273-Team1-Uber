/**
 * New node file
 */

/*var facebook = angular.module('facebook',[]);

facebook.controller('SearchController',function($scope,$http,$window){
	$scope.message = "In Search controller";
});*/

(function () {
    'use strict';
    var app= angular.module('facebook');
    app.controller('SearchController', ['$scope','$http', function ($scope,$http) {
    	$scope.message = "In Search controller";
    	console.log("In Search Controller");
    	
       	$scope.searchFunc = function(){
    		alert("$scope.search:: " + $scope.search1);
    		var searchStmt = $http({
    			method : 'POST',			
    			url : '/searchAll',
    			data: {
    				"searchQuery":$scope.search1
    			}
    		}).success(function(response) {			
    			$scope.allFriendsList = response;
    			alert(response);
    			console.log(response);
    		});
    	}
    	    	
    }]);
}());

