/**
 * Module Uber dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , admin = require('./routes/admin')
  , rider = require('./routes/rider')
  , bills = require('./routes/bills')
  , stats = require('./routes/stats')
  , driver = require('./routes/driver')
  , billing = require('./routes/billing')
  , rides = require('./routes/rides')
  , trips = require('./routes/trips')
  , path = require('path')
  , cluster = require('cluster');


var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");
var bcrypt = require('bcrypt');

var app = express();

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: true,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use("/views", express.static(path.join(__dirname, 'views')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



//Get APIs
app.get('/', routes.index);
app.get('/driverSignup', home.driverSignup);
app.get('/riderSignup', home.riderSignup);
app.get('/commonLogin', home.commonLogin);
app.get('/driverSignin', home.driverSignin);
app.get('/riderSignin', home.riderSignin);
//app.get('/carDetails',home.carDetails);
app.get('/driverProfile',home.driverProfile);
app.get('/driverlogout',driver.driverlogout);

//Drivers APIs
app.post('/getDrivers', driver.getDrivers);
app.post('/addDrivers',driver.addDrivers);
app.post('/checkDrivers',driver.checkDrivers);
app.post('/addcarDetails',driver.addcarDetails);
app.post('/getDriverInfo',driver.getDriverInfo);
app.post('/updateDriverLoc',driver.updateDriverLoc);
app.post('/getDriverDetails',driver.getDriverDetails);
app.post('/getCurDriverLatlng',driver.getCurDriverLatlng);
app.get('/adminSignin',home.adminSignin);
app.post('/actionDriverUpdate',driver.actionDriverUpdate);

//Rider Signin
app.get('/bookRide',rider.bookRide);
app.get('/homePageRider', rider.homePageRider);
app.get('/paymentDetails',rider.paymentDetails);
app.get('/paymentPage', rider.paymentPage);
//app.get('/paymentPage',rider.paymentPage);
app.get('/tripsPage',rider.tripsPage);
app.post('/checkRiderLogin',rider.checkRiderLogin);
app.post('/addRider',rider.addRider);
app.post('/getRiderDetails',rider.getRiderDetails);
app.post('/actionUpdate',rider.actionUpdate);
app.get('/logout',rider.logout);

//payments
app.post('/riderSignin', home.riderSignin);
app.get('/paymentInfo',rider.paymentInfo);
app.post('/paymentDelete', rider.paymentDelete);
app.post('/saveNewCard', rider.saveNewCard);
//Admin Module
app.post('/checkAdminLogin',admin.checkAdminLogin);
app.get('/adminDashBoard',admin.adminDashBoard);

app.get('/getAllRidersPage',admin.getAllRidersPage);
app.post('/getAllRiders',admin.getAllRiders);
app.post('/getAllURiders',admin.getAllURiders);
app.get('/adminViewRider',admin.adminViewRider);

app.get('/getAllUDrivers',admin.getUnappDrivers);
app.get('/getAllDriversPage',admin.getAllDriversPage)
app.post('/getAllDrivers',admin.getAllDrivers);
app.post('/approveRider',admin.approveRider);
app.post('/approveDriver',admin.approveDriver);
app.get('/getRides',admin.getRides);
//Billing
app.post('/getfareEstimate',billing.getfareEstimate); 

//Bill Module
app.get('/getAllBills',bills.getAllBills);
app.post('/getBillDetails',bills.getBillDetails);

//Rides
app.post('/bookaride',rides.bookaride);
app.post('/getRideRequest',rides.getRideRequest);
app.post('/confirmRide',rides.confirmRide);
app.post('/endRide',rides.endRide);
app.post('/checkForRide',rides.checkForRide);
app.post('/getDriverLoc',rides.getDriverLoc);
app.post('/updatearide',rides.updatearide);
app.post('/endCusRide',rides.endCusRide);

//Statistics
app.get('/getDriverBasedStats',stats.getDriverBasedStats);
app.get('/getRiderBasedStats',stats.getRiderBasedStats);
app.get('/timebasedstats',stats.timebasedstats);
app.get('/locationbasedstats',stats.locationbasedstats);

//testing:
app.get('/driverRides', driver.driverRides);
app.post('/getTripDetails',trips.getTripDetails);
app.post('/getdriverTripDetails',trips.getdriverTripDetails);
app.get('/rideHistory',home.rideHistory);



//Check the number of CPUs
var numCPUs = require('os').cpus().length;
console.log("num of CPUs "+numCPUs);


//for without cluster
//connect to the mongo collection session and then createServer
//mongo.connect(mongoSessionConnectURL, function(){
//	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
//	http.createServer(app).listen(app.get('port'), function(){
//		console.log('Express server listening on port ' + app.get('port'));
//	});  
//});



//with cluster

if (cluster.isMaster) {
	// Fork workers.
	console.log("I am master");
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	// Workers can share any TCP connection
	// In this case it is an HTTP server
	mongo.connect(mongoSessionConnectURL, function(){
		http.createServer(app).listen(app.get('port'), function(){
			console.log('Express server listening on port ' + app.get('port'));
		});
	});

}