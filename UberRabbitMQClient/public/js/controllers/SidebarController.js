(function () {
    'use strict';
    var app= angular.module('facebook');
    app.controller('SidebarController', ['$scope', function ($scope) {
    	$scope.message = "In Side bar controller";
    	console.log("In Side Bar Controller");
    }]);
}());
