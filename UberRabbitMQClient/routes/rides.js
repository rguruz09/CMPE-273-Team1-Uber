/**
 * http://usejsdoc.org/
 */
var mq_client = require('../rpc/client');
var mysql = require('./mysql');

exports.bookaride = function(req, res){
	
	var custID = req.session.email;
	var driverID = req.param("driverID");
	var duration = req.param("duration");
	var reqtime = req.param("reqtime");
	var weekend = req.param("weekend");
	var distance = req.param("distance");
	var srcLat = req.param("srcLat");
	var srcLng = req.param("srcLng");
	var descLat = req.param("descLat");
	var descLng = req.param("descLng");
	
	console.log("In book a ride "+driverID+" "+custID);
	
	var msg_payload = {"custID" : custID, "driverID" : driverID, "duration" : duration, 
						"reqtime" : reqtime, "distance" : distance, "weekend" : weekend, 
						"srcLat" : srcLat, "srcLng" : srcLng, "descLat" : descLat, 
						"descLng" : descLng};

	console.log(msg_payload);
	
	mq_client.make_request('bookaRide_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log("Result is: " + results.code);
			if(results.code == 404){
				console.log("unable to post");
				res.json({
					code : 404 
				});		
			}
			else {  
				console.log(" fetching success");	
				res.json({
					code : 200,
					minfare : results.minprice,
					maxfare : results.maxprice
				});		
				res.send(res_json);				
			}
		}  
	});
};


exports.getRideRequest = function(req, res){
	
	//var driverID = req.session.email;
	var driverID = "facilisi@viverraDonec.net"; //remove after the sessions implemented.

	console.log("In getting ride request "+driverID);
	  
	var query = "select A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status, B.ratings from RIDES A, customer B where DRIVER_ID = '"+driverID+"' and RIDE_STATUS IN (-1,0) and A.CUSTOMER_ID = B.email";
	
	console.log("Query "+query);
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.json({
				code : 404 
			});
		} else if(rows.length > 0){						
			console.log("From Get Ride requests: ");			
			res.json({
				code : 200,
				request : rows
			});	
		}else{
			res.json({
				code : 201 
			});
		}	
	});	
	
	
	
//  var msg_payload = { "driverID" : driverID };
//	mq_client.make_request('getRideRequest_queue',msg_payload, function(err,results){
//		
//		console.log(results);
//		if(err){
//			throw err;
//		}
//		else 
//		{
//			console.log("Result is: " + results.code);
//			if(results.code == 404){
//				console.log("unable to post");
//				res.json({
//					code : 404 
//				});		
//				res.send(res_json);	
//			}
//			else if(results.code == 201){  
//				console.log(" No requests yet :P ");	
//				res.json({
//					code : 201
//				});		
//				res.send(res_json);				
//			}
//			else if(results.code == 200){  
//				console.log("Got a ride request ");	
//				res.json({
//					code : 200,
//					request: results.request
//				});		
//				res.send(res_json);				
//			}
//		}  
//	});
};

//confirmRide
exports.confirmRide = function(req, res){
	
	//var driverID = req.session.email;
	var driverID = "facilisi@viverraDonec.net"; //remove after the sessions implemented.
	
	var custID = req.param("custID");
	var startTime = req.param("startTime");  			
	console.log("In confirm ride request "+custID);
	
	var msg_payload = { "driverID" : driverID, "custID":custID, "startTime":startTime };
	var res_json = {};
	console.log(msg_payload);
	
	mq_client.make_request('confirmRideRequest_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
			console.log("Result is: " + results.code);
			if(results.code == 404){
				console.log("unable to confirm");
				res.json({
					code : 404 
				});		
				res.send(res_json);	
			}
			else {  
				console.log("Starting the ride");	
				res.json({
					code : 200
				});		
				res.send(res_json);				
			}
		}  
	});
};