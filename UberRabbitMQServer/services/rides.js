/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";
var mysql = require("./mysql");
var billing = require("./billing");
 
exports.handle_request_bookaRide = function(msg,callback){
//	handle_confirmRideRequest_queue
		var res = {};
		var hhmm;
		var query;
		console.log("msg is - "+msg.distance+" "+msg.duration);
		
		var fuld = msg.reqtime.split(" ");
		var fuld1 = fuld[1].split(":");
		hhmm = fuld1[0]+":"+fuld1[1];
		console.log("hhmm "+hhmm);
		
		//mongo
		mongo.connect(mongoURL, function(){
			console.log('Connected to mongo at driversignup: ' + mongoURL);
			var coll = mongo.collection('drivers');
			
			coll.find().count(function(err, Tcount){
				if (Tcount) {
					total_count = Tcount;
					console.log("Avail Counr - "+ total_count);
					coll.find({"status" : "0"}).count(function(err, count){
						if (count) {
							console.log("Avail Counr - "+ count);						
							billing.calprice(total_count, count, msg.distance, msg.duration, hhmm, msg.weekend, function(price){
								console.log("price - "+ price);
								
								price = Number((price).toFixed(2));
								var sts = -1;
								query = "insert into RIDES(DRIVER_ID, CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG, DURATION, DISTANCE, REQ_TIME, PRICE, RIDE_STATUS, ZIPCODE, DFNAME, DLNAME, CFNAME, CLNAME )" + 
								"  values('"+msg.driverID+"','"+msg.custID+"',"+msg.srcLat+","+msg.srcLng+","+msg.descLat+","+msg.descLng+","+msg.duration+","+msg.distance+",'"+msg.reqtime+"',"+price+","+sts+","+msg.zipcode+",'"+msg.dfname+"','"+msg.dlname+"','"+msg.cfname+"','"+msg.clname+"')";
								
								console.log("Query - "+ query);
								
								
								
								mysql.executeQuery(query, function(err, rows) {		
									if (err) {			
										console.log("Unexpected Error in Getting drivers");
										res.code = 404;	
										res.value = "Fail";
										console.log(err);			
										callback(null,res);			
									} else {						
										console.log("Rides table updated: "	+ JSON.stringify(rows));			
										res.code = "200";
										res.value = "Success";
										res.data = rows;
										callback(null,res);
									}		
								});
							});											
						} else {
							console.log("Unable to get avail count");
							res.code = 404;
							res.value = "Failed";
							callback(null, res);
						}
					});
					
				}else{
					console.log("Unable to get total count");
					res.code = "401";
					res.value = "Failed";
					callback(null, res);
				}
			});
		});
};


//handle_request_editaRide
exports.handle_request_editaRide = function(msg,callback){
	
	var res = {};
	var hhmm;
	var query;
	console.log("msg is - "+msg.distance+" "+msg.duration);
	
	var fuld = msg.reqtime.split(" ");
	var fuld1 = fuld[1].split(":");
	hhmm = fuld1[0]+":"+fuld1[1];
	console.log("hhmm "+hhmm);
	
	//mongo
	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at driversignup: ' + mongoURL);
		var coll = mongo.collection('drivers');
		
		coll.find().count(function(err, Tcount){
			if (Tcount) {
				total_count = Tcount;
				console.log("Avail Counr - "+ total_count);
				coll.find({"status" : "0"}).count(function(err, count){
					if (count) {
						console.log("Avail Counr - "+ count);						
						billing.calprice(total_count, count, msg.distance, msg.duration, hhmm, msg.weekend, function(price){
							console.log("price - "+ price);
							
							price = Number((price).toFixed(2));
							var sts = -1;
							
							query = "update RIDES set DESTINATION_LAT = "+msg.descLat+", DESTINATION_LANG = "+msg.descLng+", DURATION = "+msg.duration+", DISTANCE = "+msg.distance+", PRICE = "+price+" where RIDE_ID = "+msg.rideID ;
							
							
							console.log("Query - "+ query);
							
							mysql.executeQuery(query, function(err, rows) {		
								if (err) {			
									console.log("Unexpected Error in Getting drivers");
									res.code = 404;	
									res.value = "Fail";
									console.log(err);			
									callback(null,res);			
								} else {						
									console.log("Rides table updated: "	+ JSON.stringify(rows));			
									res.code = "200";
									res.value = "Success";
									res.data = rows;
									callback(null,res);
								}		
							});
						
						});											
					} else {
						console.log("Unable to get avail count");
						res.code = 404;
						res.value = "Failed";
						callback(null, res);
					}
				});
				
			}else{
				console.log("Unable to get total count");
				res.code = "401";
				res.value = "Failed";
				callback(null, res);
			}
		});
	});
};

//handle_request_endRide
exports.handle_request_endRide = function(msg,callback) {

	console.log("In handle_getRideRequest_queue request: "+ msg.driverID );	
	
	var rideID = msg.rideID;
	var endTime = msg.endTime;
	var ratings  = msg.ratings;
	
	var res = {};
	  
	var query1 = "update RIDES set RIDE_STATUS = 1, END_TIME = '"+endTime+"' , CUSTOMER_RATING = "+ ratings + " where RIDE_ID = "+rideID ;
	var query2 = "select * from RIDES where RIDE_ID = "+rideID ;
	console.log("Query "+query1);
	

	mysql.executeQuery(query1, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.code = 404;	
			console.log(err);	
			callback(null,res);	
		} else{
			console.log("Updated the rides table ");			
			
			mysql.executeQuery(query2, function(err, rows) {		
				if (err) {			
					console.log("Unexpected Error in Getting ride requests");
					res.code = 404;	
					console.log(err);	
					callback(null,res);	
				} else{
					console.log("Got RIDE details ");			
					res.code = 200;
					res.data = rows;
					callback(null,res);	
				}	
			});	
		}	
	});	
}

//handle_request_checkRide
exports.handle_request_checkRide = function(msg,callback) {

	console.log("In handle_getRideRequest_queue request: "+ msg.driverID );	
	
	var custID = msg.custID;

	var res = {};
	  
	var query = "select A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status, A.RIDE_STATUS ,B.ratings from RIDES A, customer B where A.CUSTOMER_ID = '"+custID+"' and RIDE_STATUS IN (-1,0)  and A.CUSTOMER_ID = B.email";
	
	console.log("Query "+query);
	

	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.code = 404;	
			console.log(err);	
			callback(null,res);	
		} else if(rows.length > 0){						
			console.log("From Get Ride requests: ");			
			res.code = "200";
			res.value = "Success";
			res.request = rows;
			callback(null,res);	
		}else{
			console.log("From Get Ride requests with no requests: ");			
			res.code = "201";
			res.value = "Success with no rows";		
			callback(null,res);	
		}	
	});	
}

//handle_request_getLoc
exports.handle_request_getLoc = function(msg,callback) {

	console.log("In handle_getRideRequest_queue request: "+ msg.driverID );	
	
	var driverID = msg.driverID;

	var res = {};
	  
	var query = "select * from DRIVER_LOCATION where DRIVER_ID = '"+driverID+"'";
	
	console.log("Query "+query);

	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.code = 404;	
			console.log(err);	
			callback(null,res);	
		} else {						
			res.code = 200;
			res.result = rows;
			callback(null,res);	
		}	
	});	
}

// getting the ride requests for driver
exports.handle_getRideRequest_queue = function(msg,callback) {

	console.log("In handle_getRideRequest_queue request: "+ msg.driverID );	
	
	var driverID = msg.driverID;

	var res = {};
	  
	var query = "select A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status, A.RIDE_STATUS ,B.ratings from RIDES A, customer B where DRIVER_ID = '"+driverID+"' and RIDE_STATUS IN (-1,0)  and A.CUSTOMER_ID = B.email";
	
	console.log("Query "+query);
	

	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.code = 404;	
			console.log(err);	
			callback(null,res);	
		} else if(rows.length > 0){						
			console.log("From Get Ride requests: ");			
			res.code = "200";
			res.value = "Success";
			res.request = rows;
			callback(null,res);	
		}else{
			console.log("From Get Ride requests with no requests: ");			
			res.code = "201";
			res.value = "Success with no rows";		
			callback(null,res);	
		}	
	});	
}

exports.handle_confirmRideRequest_queue = function(msg,callback){
	
	var driverID = msg.driverID;
	var custID = msg.custID;
	var startTime = msg.startTime;
	var res = {};
	
	var query = "update RIDES set RIDE_STATUS = 0, START_TIME = '"+startTime+"' where DRIVER_ID = '"+driverID+"' and CUSTOMER_ID = '"+custID+"'";
	console.log("Query - " + query);
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in confirming the ride requests");
			res.code = 404;	
			console.log(err);	
			callback(null,res);	
		} else {						
			console.log("started teh ride ");			
			res.code = "200";
			callback(null,res);	
			
		}
	});	
	
};












