/**
 * New node file
 */

var home = angular.module('uberApp',['ngRoute']);
home.factory('myService', function() {
	var savedData = "";
	function set(data) {
		savedData = data;
	}
	function get() {
		return savedData;
	}

	return {
		set : set,
		get : get
	}

});

home.service('sharedProperties', function () {
	var property = {
		data1: 'First',
		data2: 'Second',
		data3: 'Third',
		data4 : 'Fourth'
	}
	
	return {
		get: function () {
			return property;
		},
		set: function(value) {
			property = value;
		}
		};
});

home.config(function($routeProvider) {
	
    $routeProvider  
	    .when("/getAdminMainPage", {
	        templateUrl: "views/adminMain.html",
	        controller: "HomeController"
	    })
        .when("/", {
            templateUrl: "views/adminMain.html",
            controller: "HomeController"
        })
        .when("/getAllRidersPage", {
            templateUrl: "views/allRiders.html",
            controller: "RiderControllerAdmin"
        })
        .when("/getAllURidersPage", {
            templateUrl: "views/allURiders.html",
            controller: "RiderControllerAdmin"
        })
        .when("/getRiderDetailsPage/", {
            templateUrl: "views/viewRider.html",
            controller: "DriverControllerAdmin"
        }) 
        .when("/getAllDriversPage", {
            templateUrl: "views/allDrivers.html",
            controller: "DriverControllerAdmin"
        }) 
        .when("/getDriverDetailsPage/", {
            templateUrl: "views/allDrivers.html",
            controller: "DriverControllerAdmin"
        }) 
        .when("/getAllUDriversPage", {
            templateUrl: "views/allUnapproved.html",
            controller: "DriverControllerAdmin"
        })
        .when("/getAllBillsPage", {
            templateUrl: "views/allBills.html",
            controller: "BillController"
        })
        .when("/getBillDetailsPage/", {
            templateUrl: "views/viewBill.html",
            controller: "BillController"
        }) 
        .when("/getStatisticsPage/", {
            templateUrl: "views/adminStats.html",
            controller: "StatsController"
        })
        .when("/getAllRidesPage/", {
            templateUrl: "views/allRides.html",
            controller: "RidesController"
        })        
        /*.when("/friends/:email",{
        	templateUrl : "views/friendsInfo.html",
        	controller: "friendsInfoCtrl"
        })
        .when("/search/:query",{
        	templateUrl : "/views/searchPeople.html",
        	controller : "searchPeopleCtrl"
        })
        .when("/addAsFriendResult",{
        	templateUrl :"/views/addAsFriend.html",
        	controller : "addAsFriendCtrl"
        })
        .when("/groups",{
        	templateUrl :"/views/groups.html",
        	controller : "groupCtrl"
        })
        .when("/groups/:groupId",{
       		templateUrl : "views/groupInfo.html",
        	controller: "groupInfoCtrl"
        })
        .otherwise({
            redirectTo: "/errpage"
        });*/
});

home.controller("MainControllerAdmin", function($scope, $http,$location) {	
		
	console.log("Inside MainControllerAdmin");
	$scope.test = function() {
		alert("HERE!!");
	}
	
	$scope.goNext = function(hash) {	
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
  
});

home.controller("HomeController", function($scope, $http, $location) {
	console.log("Inside HomeController");	
	$scope.goNext = function(hash) {	
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
});

home.controller("RiderControllerAdmin", function($scope, $http, $location,sharedProperties) {
	console.log("Inside RiderController");

	$scope.setEmail = function(email){
		sharedProperties.set(email);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
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
			console.log("In getAllRiders Fail ");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getAllURiders = function() {		
		$http({
			method : "POST",
			url : '/getAllURiders',
			data : {				
			}
		}).success(function(data) {			
			if (data) {				
				$scope.allURidersList = data.allURidersList;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In allURidersList Fail ");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getRiderDetails = function() {
		console.log("$scope.getRiderDetails" + sharedProperties.get());
		$http({
			method : "POST",
			url : '/getRiderDetails/',
			data : {				
				"user":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {
				$scope.formDetails = data.rider;		
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In Admin Controller Fail Login");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.approveRider = function(email){		
		$http({
			method : "POST",
			url : '/approveRider',
			data : {	
				"email":email
			}
		}).success(function(data) {	
			if (data.status=="200") {				
				console.log("Approved");	
				$scope.getAllURiders();
			} else {
				console.log("Not Approved");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In approveDriver fail");
			$scope.unexpected_error = true;
		});
	}
	
});


home.controller("DriverControllerAdmin", function($scope, $http, $location,sharedProperties) {
	console.log("Inside DriverController");
	
	$scope.setEmail = function(email){
		sharedProperties.set(email);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
	$scope.getAllDrivers = function() {		
		$http({
			method : "POST",
			url : '/getAllDrivers',
			data : {	
				
			}
		}).success(function(data) {			
			if (data) {
				console.log("allRidersList" + data);
				$scope.allDriversList = data.allDriversList;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getRiderDetails fail");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getDriverDetails = function() {
		console.log("$scope.getDriverDetails" + sharedProperties.get());
		$http({
			method : "POST",
			url : '/getDriverDetails/',
			data : {				
				"user":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {
				$scope.formDetails = data.driver;		
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getAllUDrivers = function() {		
		$http({
			method : "GET",
			url : '/getAllUDrivers',
			data : {	
				
			}
		}).success(function(data) {			
			if (data) {				
				$scope.allDriversList = data.allUnapprovedDriversList;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In allUnapprovedDriversList fail");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.approveDriver = function(email){
		$http({
			method : "POST",
			url : '/approveDriver',
			data : {	
				"email":email
			}
		}).success(function(data) {	
			if (data.status=="200") {				
				console.log("Approved");				
			} else {
				console.log("Not Approved");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In approveDriver fail");
			$scope.unexpected_error = true;
		});
	}
});


home.controller("BillController", function($scope, $http, $location,sharedProperties) {
	console.log("Inside BillController");

	$scope.setID = function(billid){
		sharedProperties.set(billid);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
	$scope.getAllBills = function() {		
		$http({
			method : "GET",
			url : '/getAllBills',
			data : {				
			}
		}).success(function(data) {			
			if (data) {
				console.log("allBillList" + data);
				$scope.billList = data.billList;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In allBillList Fail ");
			$scope.unexpected_error = true;
		});
	}
	
	$scope.getBillDetails = function() {
		console.log("$scope.getBillDetails" + sharedProperties.get());
		$http({
			method : "POST",
			url : '/getBillDetails/',
			data : {				
				"RIDE_ID":sharedProperties.get()
			}
		}).success(function(data) {			
			if (data) {				
				$scope.billDetails = data.billDetails;		
				$scope.loadMap();
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.loadMap = function(){
		console.log("I came " +$scope.billDetails.SOURCE_LAT + " " + $scope.billDetails.SOURCE_LANG);

	    var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
     
        var map = new google.maps.Map(document
              .getElementById('map'), {
           zoom : 7,
           mapTypeId : google.maps.MapTypeId.ROADMAP
        });
     
        directionsDisplay.setMap(map);
        //directionsDisplay.setPanel(document.getElementById('panel'));
        /*
        var start = "'"+$scope.billDetails.pickuplat + ","+ $scope.billDetails.pickuplong + "'";
        var end = "'"+$scope.billDetails.dropofflat + ","+ $scope.billDetails.dropofflong + "'";*/        
		  
        var start = new google.maps.LatLng($scope.billDetails.SOURCE_LAT,$scope.billDetails.SOURCE_LANG);
        var end = new google.maps.LatLng($scope.billDetails.DESTINATION_LAT,$scope.billDetails.DESTINATION_LANG);
     
        console.log(start);
        console.log(end);
        var request = {
           origin : start,
           destination : end,
           travelMode : google.maps.DirectionsTravelMode.DRIVING
        };
     
        directionsService.route(request, function(response,
              status) {
           if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
           }
        });

	}
});

home.controller("StatsController", function($scope, $http, $location,
		sharedProperties) {
	console.log("Inside StatsController");
	$scope.srcdest = [];
	$scope.setID = function(billid) {
		sharedProperties.set(billid);
		console.log(sharedProperties.get());
	}
	$scope.goNext = function(hash) {
		console.log("Going to the page " + hash);
		$location.path(hash);
	};

	this.tab = 1;
	this.selectedTab = function(setTab) {
		this.tab = setTab;		
	}
	
	this.isSelected = function(checkTab) {
		return this.tab === checkTab;
	}
	
	
	$scope.getAllRides = function() {
		$http({
			method : "GET",
			url : '/getRides/',
			data : {

			}
		}).success(
				function(data) {
					if (data) {
						$scope.rides = data.rides;
						//console.log("RIDES" + $scope.rides);
						for (var i = 0; i < $scope.rides.length; i++) {							
							var sd = [new google.maps.LatLng(	$scope.rides[i].SOURCE_LAT,	$scope.rides[i].SOURCE_LANG),
									  new google.maps.LatLng(	$scope.rides[i].DESTINATION_LAT,$scope.rides[i].DESTINATION_LANG) ];							
							$scope.srcdest.push(sd);
						}
						//console.log($scope.srcdest.length);

						$scope.loadMap();
					} else {
						console.log("Error in Data Fetching");
						$scope.unexpected_error = true;
					}
				}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});

	}

	$scope.loadMap = function() {
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom : 14,
			center : {
				lat : 0,
				lng : -180
			},
			mapTypeId : google.maps.MapTypeId.ROADMAP
		});
		var flightPlanCoordinates = $scope.srcdest[0];
		for (var i = 0; i < $scope.srcdest.length; i++) {
			var flightPath = new google.maps.Polyline({
				path : $scope.srcdest[i],
				geodesic : false,
				strokeColor : "#0000FF",
				strokeOpacity : 0.8,
				strokeWeight : 1
			});
			flightPath.setMap(map);
		}
	}
	
	$scope.getDriverBasedStats = function() {		
		console.log("inside getDriverBasedStats");
		$http({
			method : "GET",
			url : '/getDriverBasedStats',
			data : {				
			}
		}).success(function(data) {			
			if (data) {				
				
				var dataJSON = [];
				//var temp = JSON.parse(data.ridesPerRider);				
				if(data.ridesPerDriver.length>10) {
					for(var indx = 0 ; indx < 10 ; indx++) {
						//console.log("data.ridesPerDriver" + data.ridesPerDriver[indx].lastname);
						dataJSON.push(data.ridesPerDriver[indx]);
					}
				} else {
					dataJSON = data.ridesPerDriver
				}				
				$scope.ridesPerDriver = data.ridesPerDriver;				
				
				document.getElementById('driverTable');
				
				d3.piechart_2.build('#driverTable', data.ridesPerDriver, {
					width : 700,
					height : 600
				});
				
				d3.piechart_3.build('#driverTable2', data.ridesPerDriver, {
					width : 700,
					height : 600
				});
			
				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.getRiderBasedStats = function() {		
		console.log("inside getRiderBasedStats");
		$http({
			method : "GET",
			url : '/getRiderBasedStats',
			data : {				
			}
		}).success(function(data) {			
			if (data) {				
				$scope.ridesPerRider = data.ridesPerRider;		
				var dataJSON = [];
				//var temp = JSON.parse(data.ridesPerRider);
				
				if(data.ridesPerRider.length>10) {
					for(var indx = 0 ; indx < 10 ; indx++) {
						console.log("data.ridesPerRider" + data.ridesPerRider[indx].lastname);
						dataJSON.push(data.ridesPerRider[indx]);
					}
				} else {
					dataJSON = data.ridesPerRider
				}
				
				
				d3.piechart_2.build('#riderTable', dataJSON, {
					width : 700,
					height : 600
				});
				
				d3.piechart_3.build('#riderTable2', dataJSON, {
					width : 700,
					height : 600
				});			
				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.gettimebasedstats = function() {		
		console.log("inside getRiderBasedStats");
		$http({
			method : "GET",
			url : '/timebasedstats',
			data : {				
			}
		}).success(function(data) {			
			if (data) {				
				$scope.timebasedstats = data.timebasedstats;		
				var dataJSON = [];						
				if(data.timebasedstats.length>10) {
					for(var indx = 0 ; indx < 10 ; indx++) {						
						dataJSON.push(data.timebasedstats[indx]);
					}
				} else {
					dataJSON = data.timebasedstats
				}		
									
				d3.piechart_5.build('#timebased1', dataJSON, {
					width : 700,
					height : 600
				});			
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In timebased stats failed");
			$scope.unexpected_error = true;
		});		
	}
	
	$scope.getlocationbasedstats = function() {		
		console.log("inside getlocationbasedstats");
		$http({
			method : "GET",
			url : '/locationbasedstats',
			data : {				
			}
		}).success(function(data) {			
			if (data) {				
				console.log(data.revenuebasedstats);
				$scope.revenuebasedstats = data.revenuebasedstats;				
				d3.piechart_4.build('#revenuebased1', data.revenuebasedstats, {
					width : 700,
					height : 600
				});	
				d3.piechart_5.build('#revenuebased2', data.revenuebasedstats, {
					width : 700,
					height : 600
				});	
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getDriverDetails failed");
			$scope.unexpected_error = true;
		});		
	}
	
});

home.controller("RidesController", function($scope, $http, $location,sharedProperties) {
	console.log("Inside RiderController");
	
	$scope.goNext = function(hash) {		
		console.log("Going to the page "+ hash);
		$location.path(hash);
	};
	
	$scope.getAllRides = function() {
		$http({
			method : "GET",
			url : '/getRides/',
			data : {
			}
		}).success(function(data) {			
			if (data) {
				console.log("rides" + data.rides);
				$scope.rides = data.rides;				
			} else {
				console.log("Error in Data Fetching");
				$scope.unexpected_error = true;
			}
		}).error(function(error) {
			console.log("In getAllRiders Fail ");
			$scope.unexpected_error = true;
		});
	}	
});