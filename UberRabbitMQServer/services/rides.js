/**
 * http://usejsdoc.org/
 */

var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/uberdb";
var mysql = require("./mysql");
var billing = require("./billing");
 
exports.handle_request_bookaRide = function(msg,callback){
		
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
								query = "insert into RIDES(DRIVER_ID, CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG, DURATION, DISTANCE, REQ_TIME, PRICE, RIDE_STATUS)" + 
								"  values('"+msg.driverID+"','"+msg.custID+"',"+msg.srcLat+","+msg.srcLng+","+msg.descLat+","+msg.descLng+","+msg.duration+","+msg.distance+",'"+msg.reqtime+"',"+price+","+sts+")";
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


// getting the ride requests for driver
exports.handle_getRideRequest_queue = function(msg,callback) {

	console.log("In handle_getRideRequest_queue request: "+ msg.driverID );	
	
	var driverID = msg.driverID;

	var res = {};
	  
	var query = "select A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status, B.ratings from RIDES A, customer B where DRIVER_ID = '"+driverID+"' and RIDE_STATUS = -1 and A.CUSTOMER_ID = B.email";
	
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