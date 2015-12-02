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


//function handle_get_drivers_queue (msg,callback) {
//
//	console.log("In handle_get_drivers_queue request:"+ msg.lat +" "+msg.lang );	
//	
//	var lat = msg.lat
//	var lang = msg.lang;	
//	
//	var res = {};
//	
//	getavaildrvrs(function(err, arr){
//		if(err){
//			console.log("Error");
//			es.code = 404;	
//			res.value = "Fail";
//			console.log(err);			
//			callback(null,res);		
//		}else{
//			
//			
//			var params = [];
//			for(var i = 1; i <= arr.length; i++) {
//			  params.push('$' + i);
//			}
//			
//			
//			var query = "SELECT DRIVER_ID, LATITUDE, LANGITUDE, ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS("+ lat +") ) + "+
//			" COS( RADIANS( LATITUDE ) ) * COS( RADIANS("+ lat +")) * COS( RADIANS( LANGITUDE ) - RADIANS("+ lang +")) ) * 6380 AS "  +
//			" distance FROM DRIVER_LOCATION WHERE ACOS( SIN( RADIANS( LATITUDE ) ) * SIN( RADIANS( " + lat +") ) + "  +
//			" COS( RADIANS( LATITUDE ) ) * COS( RADIANS( "+  lat +" )) * COS( RADIANS( LANGITUDE ) - RADIANS( "+ lang+" )) ) * 6380 < 10 " +
//			"and DRIVER_ID IN( "+params.join(',')+" ) ORDER BY distance";
//			
//			mysql.executeQuerywithParam(query, arr, function(err, rows) {		
//				if (err) {			
//					console.log("Unexpected Error in Getting drivers");
//					res.code = 404;	
//					res.value = "Fail";
//					console.log(err);			
//					callback(null,res);			
//				} else {						
//					console.log("From Get Rider result of querydb: "	+ JSON.stringify(rows));			
//					res.code = "200";
//					res.value = "Success";
//					res.data = rows;
//					callback(null,res);
//				}		
//			});	
//		}
//	})	
//}


function handle_request_updateLoca(msg,callback) {

	console.log("In handle_request_updateLoca request: "+ msg.driverID + " " + msg.lat +"  "+msg.lang );	
	
	var driverID = msg.driverID;
	var lat = msg.lat 
	var lng = msg.lang;	
	
	var res = {};
	
	
	  
	var query = "INSERT INTO DRIVER_LOCATION (DRIVER_ID, LATITUDE, LANGITUDE) VALUES ('"+driverID+"' ,"+lat+","+lng+") ON DUPLICATE KEY UPDATE " +
	 " LATITUDE    = VALUES(LATITUDE), LANGITUDE = VALUES(LANGITUDE)";
	
	console.log("Query "+query);
	
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


//handle_request_getDrvLoc
function handle_request_getDrvLoc(msg,callback) {

	console.log("In handle_request_getDrvLoc request:"+ msg.driverID);	
	
	var driverID = msg.driverID;	
	var res = {};
	
	var query = "select * from DRIVER_LOCATION where DRIVER_ID = '" + driverID + "'";
	
	console.log("Query "+query);
	
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
				//res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);			
				callback(null,res);			
		}
	});
};


function getavaildrvrs(callback){
	
	mongo.connect(mongoURL, function(){
		
		console.log('Connected to mongo at: ' + mongoURL);	
		var coll = mongo.collection('drivers');
		
		coll.find( { "status" : "0" },{_id:0, email:1 } ).toArray(function(err, docs) {
			if(docs){												
				var myArray = [];
				for(var i=0; i<docs.length; i++){
					myArray.push("'"+docs[i].email+"'");
					console.log(docs[i].email);
				}
				callback(false, myArray);
			}else{						
				callback(true, null);
			}			
		});
	});
}

function handle_updateDriver_queue(msg,callback){
	console.log("In handle_updateDriver_queue request:"+ msg.email);	
	var json_responses;
	var email = msg.email;	
	var res = {};
console.log("data from updateDriver queue: "+JSON.stringify(msg));
	
var firstname = msg.firstname;
var lastname = msg.lastname;
var email = msg.email;
var phone = msg.phone;
var address = msg.address;
var city = msg.city;
var state = msg.state;
var zipcode = msg.zipcode;
var password = msg.password;

console.log("*****************************************************************");
console.log("Data from angularJS: "+" email: "+email+" password: "+password+" firstname: "+firstname+" lastname:  "+lastname+" phone: "+phone+ " address: "+address+" city: "+city+" state: "+state+" zip: "+zipcode);
console.log("*****************************************************************");

	mongo.connect(mongoURL, function() {
		// console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('drivers');
		
		
		coll.update({email:msg.email},{$set : {"firstname": firstname, "lastname": lastname, "password":password, "address":address, "city": city, "zip": zipcode, "state": state, "mobile": phone, "email": email}}
		, function(err, result) {
			console.log("After updating details of the driver :: " + result);
			if (err) {
				console.log("Unexpected Error in Getting Rider");
				res.code = err.code;
				res.value = "Unexpected Error!";
				console.log(err);			
				callback(null,res);			
			} else {
				console.log("From update Driver result of query mongodb: "	+ JSON.stringify(result));			
				res.code = "200";
				res.value = "Success";
				res.user = result;						
				callback(null,res);
			}
			console.log("Response:: " + res);
			callback(null, res)
		});
	});
}



exports.handle_updateDriver_queue = handle_updateDriver_queue;
exports.handle_get_driverInfo_queue = handle_get_driverInfo_queue;
exports.handle_request_updateLoca = handle_request_updateLoca;
exports.handle_get_drivers_queue = handle_get_drivers_queue;
exports.handle_request_getDrvLoc = handle_request_getDrvLoc;