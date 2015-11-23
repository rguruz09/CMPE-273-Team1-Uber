angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		// home page
		.when('/', {			
			templateUrl: 'views/login.html',
			controller: 'MainController'
		})

		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'signupController'
		})

		.when('/geeks', {
			templateUrl: 'views/geek.html',
			controller: 'GeekController'	
		});

	$locationProvider.html5Mode(true);

}]);

