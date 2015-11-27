/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";
var mysql = require("./mysql");

function handle_get_drivers_queue (msg,callback) {

	console.log("In handle_get_drivers_queue request:"+ msg.lat +" "+msg.lang );	
	
	var lat = msg.lat
	var lang = msg.lang;	
	
	var res = {};
	var query = "SELECT DRIVER_ID, LATITUDE, LANGITUDE, ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS("+ lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( LANGITUDE ) - RADIANS("+ lang +")) ) * 6380 AS distance FROM DRIVER_LOCATION WHERE ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS( " + lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS( LANGITUDE ) - RADIANS( "+ lang+" )) ) * 6380 < 10 ORDER BY distance";
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting drivers");
			res.code = 404;	
			res.value = "Fail";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.data = rows;
			callback(null,res);
		}		
	});	
}

function handle_request_updateLoca(msg,callback) {

	console.log("In handle_request_updateLoca request: "+ msg.driverID + " " + msg.lat +"  "+msg.lang );	
	
	var driverID = msg.driverID;
	var lat = msg.lat 
	var lang = msg.lang;	
	
	var res = {};
	var query = "update ";
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting drivers");
			res.code = 404;	
			res.value = "Fail";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.data = rows;
			callback(null,res);
		}		
	});	
}

//to get the driver details - handle_request_getDriverDetails
exports.handle_request_getDriverDetails = function(msg, callback){

	var res = {};
	var drivers = msg.drivers;
				
	console.log("In gettings group details : " + drivers[0] );
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);	
		var coll = mongo.collection('drivers');
		
		coll.find( {email: {$in : drivers} },{_id:0, email:1, firstname:1, lastname:1, mobile:1, Make:1, Color:1, licence:1, ratings:1 } ).toArray(function(err, docs) {
			if(docs){												
				var myArray = [];
				for(var i=0; i<docs.length; i++){
					myArray.push({ "email":docs[i].email, "firstname": docs[i].firstname, "lastname":docs[i].lastname, "mobile":docs[i].mobile,"ratings": docs[i].ratings, "Make": docs[i].Make, "Color":docs[i].Color, "licence":docs[i].licence});
				}
				res.statusCode = 200;
				res.data = myArray;						
			}else{						
				res.statusCode  = 401;
			}							
			callback(null, res);
		});
		
	});		
};

function handle_get_driverInfo_queue(msg,callback) {

	console.log("In handle_get_driver_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};
	
	console.log('Connected to mongo at: ' + mongoURL);	
	var coll = mongo.collection('drivers');
	
	coll.findOne({email: msg.email}, function(err, user){
		if (user) {
			console.log("From Get Driver result of querydb: "	+ JSON.stringify(user));			
			res.code = "200";
			res.value = "Success";
			res.user = user;						
			callback(null,res);

		} else {
				console.log("Unexpected Error in Getting Driver");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);			
				callback(null,res);			
		}
	});
};

exports.handle_get_driverInfo_queue = handle_get_driverInfo_queue;
exports.handle_request_updateLoca = handle_request_updateLoca;
exports.handle_get_drivers_queue = handle_get_drivers_queue;











/*
var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";
var mysql = require("./mysql");


function handle_get_drivers_queue (msg,callback) {

	console.log("In handle_get_drivers_queue request:"+ msg.lat +" "+msg.lang );	
	
	var lat = msg.lat
	var lang = msg.lang;	
	
	var res = {};
	var query = "SELECT DRIVER_ID, LATITUDE, LANGITUDE, ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS("+ lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( LANGITUDE ) - RADIANS("+ lang +")) ) * 6380 AS distance FROM DRIVER_LOCATION WHERE ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS( " + lat +") ) + COS( RADIANS( LATITUDE ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS( LANGITUDE ) - RADIANS( "+ lang+" )) ) * 6380 < 10 ORDER BY distance";
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting drivers");
			res.code = 404;	
			res.value = "Fail";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.data = rows;
			callback(null,res);
		}		
	});	
}

function handle_request_updateLoca(msg,callback) {

	console.log("In handle_request_updateLoca request: "+ msg.driverID + " " + msg.lat +"  "+msg.lang );	
	
	var driverID = msg.driverID;
	var lat = msg.lat 
	var lang = msg.lang;	
	
	var res = {};
	var query = "update ";
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting drivers");
			res.code = 404;	
			res.value = "Fail";
			console.log(err);			
			callback(null,res);			
		} else {						
			console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
			res.code = "200";
			res.value = "Success";
			res.data = rows;
			callback(null,res);
		}		
	});	
}


//to get the driver details - handle_request_getDriverDetails
exports.handle_request_getDriverDetails = function(msg, callback){

	var res = {};
	var drivers = msg.drivers;
				
	console.log("In gettings group details : " + drivers[0] );
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);	
		var coll = mongo.collection('drivers');
		
		coll.find( {email: {$in : drivers} },{_id:0, email:1, firstname:1, lastname:1, mobile:1, Make:1, Color:1, licence:1, ratings:1 } ).toArray(function(err, docs) {
			if(docs){												
				var myArray = [];
				for(var i=0; i<docs.length; i++){
					myArray.push({ "email":docs[i].email, "firstname": docs[i].firstname, "lastname":docs[i].lastname, "mobile":docs[i].mobile,"ratings": docs[i].ratings, "Make": docs[i].Make, "Color":docs[i].Color, "licence":docs[i].licence});
				}
				res.statusCode = 200;
				res.data = myArray;						
			}else{						
				res.statusCode  = 401;
			}							
			callback(null, res);
		});
		
	});		
};




exports.handle_request_updateLoca = handle_request_updateLoca;
exports.handle_get_drivers_queue = handle_get_drivers_queue; */