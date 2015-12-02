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
	var zipcode = req.param("zipcode");
	var drivername = req.param("drivername");
	
	var name = drivername.split(" ");
	var cfname = req.session.firstname;
	var clname = req.session.lastname;
	
	console.log(name[0]+" "+name[1]+" "+cfname+" "+clname);
	
	
	//console.log("In book a ride "+driverID+" "+custID);
	
	var msg_payload = {"custID" : custID, "driverID" : driverID, "duration" : duration, 
						"reqtime" : reqtime, "distance" : distance, "weekend" : weekend, 
						"srcLat" : srcLat, "srcLng" : srcLng, "descLat" : descLat, 
						"descLng" : descLng, "zipcode" : zipcode, "dfname" : name[0], "dlname": name[1], "cfname": cfname, "clname" : clname };

//	var msg_payload = {"custID" : custID, "driverID" : driverID, "duration" : duration, 
//	"reqtime" : reqtime, "distance" : distance, "weekend" : weekend, 
//	"srcLat" : srcLat, "srcLng" : srcLng, "descLat" : descLat, 
//	"descLng" : descLng};
	
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
					code : 200
				});		
				res.send(res_json);				
			}
		}  
	});
};


//Edit ride - updatearide

exports.updatearide = function(req, res){
	
	var custID = req.session.email;
	//var driverID = req.param("driverID");
	var duration = req.param("duration");
	var reqtime = req.param("reqtime");
	var weekend = req.param("weekend");
	var distance = req.param("distance");
	var srcLat = req.param("srcLat");
	var srcLng = req.param("srcLng");
	var descLat = req.param("descLat");
	var descLng = req.param("descLng");
	var rideID = req.param("rideID");
	
//	console.log("In book a ride "+driverID+" "+custID);
	
	var msg_payload = {"custID" : custID, "duration" : duration, 
						"reqtime" : reqtime, "distance" : distance, "weekend" : weekend, 
						"srcLat" : srcLat, "srcLng" : srcLng, "descLat" : descLat, 
						"descLng" : descLng, "rideID" : rideID};

	console.log(msg_payload);
	
	mq_client.make_request('editaRide_queue',msg_payload, function(err,results){
		
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
	var driverID = req.session.driverID; //remove after the sessions implemented.

	console.log("In getting ride request "+driverID);
	  
	var query = "select A.RIDE_ID, A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status,A.RIDE_STATUS, B.ratings from RIDES A, customer B where DRIVER_ID = '"+driverID+"' and RIDE_STATUS IN (-1,0) and A.CUSTOMER_ID = B.email";
	
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
	var driverID = req.session.driverID; //remove after the sessions implemented.
	
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


///getDriverLoc
exports.getDriverLoc = function(req, res){
	
	var driverID = req.param("driverID");
	var msg_payload = { "driverID" : driverID };
	
	var res_json = {};
	console.log(msg_payload);
	
	mq_client.make_request('getLoc_queue',msg_payload, function(err,results){
		
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
			}
			else {  
				console.log("Starting the ride");	
				res.json({
					code : 200,
					result : results.result
				});						
			}
		}  
	});
};


//EndRide
exports.endRide = function(req, res){
		
	var rideID = req.param("rideID");		
	var endTime = req.param("endTime");
	var ratings = req.param("ratings");
	
	var msg_payload = { "rideID" : rideID, "endTime" : endTime, "ratings" : ratings };
	var res_json = {};
	console.log(msg_payload);
	
	mq_client.make_request('endRide_queue',msg_payload, function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			console.log("Result is: " + results.code);
			if(results.code == 404){
				console.log("unable to End the ride");
				res.json({
					code : 404 
				});		
			}
			else {  
				console.log("Starting the ride");	
				res.json({
					code : 200,
					data : results.data
				});						
			}
		}  
	});
};

//endCusRide
exports.endCusRide = function(req, res){
	
	var rideID = req.param("rideID");		
	var ratings = req.param("ratings");
	var msg_payload = { "rideID" : rideID, "ratings" : ratings  };
	var res_json = {};
	console.log(msg_payload);
	
	var query = "update RIDES set RIDE_STATUS = 2 , DRIVER_RATING = "+ ratings +" where RIDE_ID = "+rideID;
	
	console.log("Query "+query);
	
	mysql.executeQuery(query, function(err, rows) {		
		if (err) {			
			console.log("Unexpected Error in Getting ride requests");
			res.json({
				code : 404 
			});
		} else {
			
			console.log("From Get Ride requests: ");			
			res.json({
				code : 200
			});	
		}	
	});	
	
};

////checkForRide
//exports.checkForRide = function(req, res){
//	
//	var custID = req.session.email;		
//	
//	var msg_payload = { "custID" : custID };
//	
//	console.log(msg_payload);
//	
//	mq_client.make_request('checkRide_queue',msg_payload, function(err,results){
//		if(err){
//			throw err;
//		}
//		else 
//		{
//			console.log("Result is: " + results.code);
//			if(results.code == 404){
//				console.log("unable to End the ride");
//				res.json({
//					code : 404 
//				});		
//			}
//			else 
//			if(results.code == 201) {  
//				console.log("No active ride");	
//				res.json({
//					code : 201
//				});						
//			}
//			else if(esults.code == 200){
//				console.log("got the active ride");	
//				res.json({
//					code : 200,
//					data : results
//				});						
//			}
//		}  
//	});
//};




exports.checkForRide = function(req, res){
	
	var custID = req.session.email;
	
	console.log("In getting ride request "+custID);
	  
	var query = "select A.RIDE_ID, A.DRIVER_ID, A.CUSTOMER_ID, SOURCE_LAT, SOURCE_LANG, DESTINATION_LAT, DESTINATION_LANG,  B.firstname, "+
	"B.lastname, B.phone, B.status,A.RIDE_STATUS, B.ratings from RIDES A, customer B where A.CUSTOMER_ID = '"+custID+"' and RIDE_STATUS IN (-1,0,1) and A.CUSTOMER_ID = B.email";
	
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
}
	