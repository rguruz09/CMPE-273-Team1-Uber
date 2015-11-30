/**
 * Module Uber dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , home = require('./routes/home')
  , rider = require('./routes/rider')
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



//Rider Signin
app.get('/bookRide',rider.bookRide);
app.get('/homePageRider', rider.homePageRider);
app.get('/paymentDetails',rider.paymentDetails);
app.get('/paymentPage', rider.paymentPage);
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


//Billing
app.post('/getfareEstimate',billing.getfareEstimate); 

//Rides
app.post('/bookaride',rides.bookaride);
app.post('/getRideRequest',rides.getRideRequest);
app.post('/confirmRide',rides.confirmRide);
app.post('/endRide',rides.endRide);
app.post('/checkForRide',rides.checkForRide);
app.post('/getDriverLoc',rides.getDriverLoc);
app.post('/updatearide',rides.updatearide);


//testing:
app.get('/driverRides', driver.driverRides);
app.post('/getTripDetails',trips.getTripDetails);
app.post('/getdriverTripDetails',trips.getdriverTripDetails);
app.get('/rideHistory',home.rideHistory);



//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});