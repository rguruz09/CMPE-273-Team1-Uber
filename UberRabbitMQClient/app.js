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
  , path = require('path');

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
app.get('/adminSignin',home.adminSignin);

//Rider Signin
app.get('/bookRide',rider.bookRide);
app.get('/homePageRider', rider.homePageRider);
app.get('/paymentPage',rider.paymentPage);
app.get('/tripsPage',rider.tripsPage);
app.post('/checkRiderLogin',rider.checkRiderLogin);
app.post('/addRider',rider.addRider);
app.post('/getRiderDetails',rider.getRiderDetails);
app.get('/logout',rider.logout);

//Admin Module
app.post('/checkAdminLogin',admin.checkAdminLogin);
app.get('/adminDashBoard',admin.adminDashBoard);

app.get('/getAllRidersPage',admin.getAllRidersPage);
app.post('/getAllRiders',admin.getAllRiders);
app.get('/adminViewRider',admin.adminViewRider);

app.get('/getAllUDrivers',admin.getUnappDrivers);
app.get('/getAllDriversPage',admin.getAllDriversPage)
app.post('/getAllDrivers',admin.getAllDrivers);
app.post('/approveDriver',admin.approveDriver);
app.get('/getRides',admin.getRides);

//Bill Module
app.get('/getAllBills',bills.getAllBills);
app.post('/getBillDetails',bills.getBillDetails);

//Statistics
app.get('/getDriverBasedStats',stats.getDriverBasedStats);
app.get('/getRiderBasedStats',stats.getRiderBasedStats);
app.get('/timebasedstats',stats.timebasedstats);
app.get('/locationbasedstats',stats.locationbasedstats);

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});