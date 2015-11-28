/**
 * http://usejsdoc.org/
 */
var mq_client = require('../rpc/client');

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
	var driverID = "Curabitur.sed.tortor@sem.net"; //remove after the sessions implemented.

	console.log("In getting ride request "+driverID);
	
	var msg_payload = { "driverID" : driverID };

	console.log(msg_payload);
	
	mq_client.make_request('getRideRequest_queue',msg_payload, function(err,results){
		
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
				res.send(res_json);	
			}
			else if(results.code == 201){  
				console.log(" No requests yet :P ");	
				res.json({
					code : 201
				});		
				res.send(res_json);				
			}
			else if(results.code == 200){  
				console.log("Got a ride request ");	
				res.json({
					code : 200,
					request: results.request
				});		
				res.send(res_json);				
			}
		}  
	});
};